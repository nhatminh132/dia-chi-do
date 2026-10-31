import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Bạn là trợ lý của bảo tàng số "Địa Chỉ Đỏ — Khát vọng độc lập cho thành phố", về lịch sử đấu tranh giành độc lập của Sài Gòn và các di tích cách mạng.

Chỉ trả lời về website/dự án và lịch sử Sài Gòn, Đảng Cộng sản Việt Nam, các địa điểm di tích, dòng thời gian, Đông Nam Á, tư liệu, quiz.

Quy tắc:
- Trả lời ngắn gọn (1-3 câu), tiếng Việt.
- Không bịa sự kiện/ngày tháng/nhân vật/địa chỉ.
- Nếu câu hỏi ngoài phạm vi, từ chối ngắn: "Việc đó nằm ngoài khả năng của tôi, hãy thử hỏi về ngày Giải phóng chẳng hạn?"
- Không dùng markdown dài; ưu tiên văn bản thuần.`;

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  /api/chat — CỔNG GÁC CỦA KHOÁ API
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Khoá nhà cung cấp nằm ở server, không bao giờ xuống trình duyệt. Nhưng một
 *  route công khai thì ai biết URL cũng gọi được và đốt tiền của chủ dự án.
 *  Ba lớp chặn dưới đây, theo thứ tự từ rẻ tới đắt:
 *
 *  1. CHỈ NHẬN REQUEST TỪ CHÍNH WEBSITE NÀY (`sameSite`).
 *     Trình duyệt luôn gửi `Origin` khi gọi `fetch` POST, và gửi
 *     `Sec-Fetch-Site` từ trình duyệt hiện đại. Ta đòi:
 *       • `Origin` khớp chính host đang phục vụ request (hoặc một trong các
 *         origin khai trong `CHAT_ALLOWED_ORIGINS`), VÀ
 *       • `Sec-Fetch-Site` — nếu có — phải là `same-origin`.
 *
 *     Hệ quả: một website khác nhúng gọi vào đây từ trình duyệt của người xem
 *     sẽ bị chặn (Origin của họ khác), còn gọi thẳng bằng script cũng bị chặn
 *     vì không có `Origin`.
 *
 *     GIỚI HẠN CẦN BIẾT: đây là kiểm tra theo header, không phải chữ ký mật
 *     mã. Người cố tình vẫn có thể tự đặt `Origin` giả bằng curl. Muốn chặn
 *     tuyệt đối thì phải có đăng nhập người dùng — ngoài phạm vi bảo tàng mở.
 *     Vì vậy lớp 2 và lớp 3 phải có, và phía nhà cung cấp nên đặt hạn mức chi
 *     tiêu (spend limit) cho khoá này.
 *
 *  2. GIỚI HẠN TẦN SUẤT THEO IP — 20 câu / 5 phút. Bộ đếm nằm trong bộ nhớ
 *     của từng instance serverless (không dùng Redis): đúng với một người
 *     dùng bình thường, chỉ là "best effort" khi có nhiều instance — đủ để
 *     một script không quét được hàng nghìn câu trong một phút.
 *
 *  3. GIỚI HẠN KÍCH THƯỚC ĐẦU VÀO — 10 lượt, 1.000 ký tự/lượt, 4.000 ký tự
 *     tổng. Không có lớp này thì chỉ cần một request 10 MB là đủ đốt tiền.
 */

const MAX_MESSAGES = 10;
const MAX_CHARS_PER_MESSAGE = 1000;
const MAX_TOTAL_CHARS = 4000;

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60 * 1000;

type Bucket = { count: number; resetAt: number };

/** Bộ đếm theo IP. Mất khi instance lạnh — chấp nhận được, xem ghi chú trên. */
const buckets = new Map<string, Bucket>();

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function overRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    // Dọn rác khi bảng phình to, tránh giữ IP cũ trong bộ nhớ mãi mãi.
    if (buckets.size > 5000) {
      for (const [key, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(key);
      }
    }
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

/** Request này có đến từ chính website đang phục vụ nó không? */
function sameSite(req: NextRequest): boolean {
  const first = (value: string | null) => value?.split(",")[0]?.trim() || "";

  const host = first(req.headers.get("x-forwarded-host")) || first(req.headers.get("host"));
  if (!host) return false;

  const proto = first(req.headers.get("x-forwarded-proto")) || "https";
  const own = `${proto}://${host}`;

  const extra = (process.env.CHAT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  const origin = req.headers.get("origin");
  if (!origin || !(origin === own || extra.includes(origin))) return false;

  /* `Sec-Fetch-Site` do trình duyệt đặt, JavaScript không ghi đè được. Vắng
     mặt ở trình duyệt cũ ⇒ chỉ kiểm tra khi có. */
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;

  return true;
}

/** Cắt hội thoại về đúng giới hạn, giữ các lượt MỚI NHẤT. */
function cleanHistory(input: unknown): Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(input)) return [];

  const picked: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || content.trim() === "") continue;
    picked.push({ role, content: content.slice(0, MAX_CHARS_PER_MESSAGE) });
  }

  // Đi từ cuối lên: câu hỏi mới nhất là thứ không được phép rơi.
  const kept: Array<{ role: "user" | "assistant"; content: string }> = [];
  let total = 0;

  for (let index = picked.length - 1; index >= 0 && kept.length < MAX_MESSAGES; index -= 1) {
    const message = picked[index];
    if (total + message.content.length > MAX_TOTAL_CHARS) break;
    total += message.content.length;
    kept.unshift(message);
  }

  return kept;
}

export async function POST(req: NextRequest) {
  /* ── 1) Cổng origin ──────────────────────────────────────────────────── */
  if (!sameSite(req)) {
    return NextResponse.json(
      { error: "Hướng dẫn viên chỉ trả lời từ chính trang này." },
      { status: 403 },
    );
  }

  /* ── 2) Cổng tần suất ────────────────────────────────────────────────── */
  if (overRateLimit(clientIp(req))) {
    return NextResponse.json(
      { error: "Bạn hỏi hơi nhanh — thử lại sau vài phút nhé." },
      { status: 429 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  /*
    `OPENAI_BASE_URL` phải là gốc API, KHÔNG có dấu "/" ở cuối — đoạn dưới
    luôn ghép thêm `/chat/completions`. Nhiều nhà cung cấp (Gemini, một số
    proxy) công bố URL kết thúc bằng "/", và khi đó `.../openai//chat/
    completions` trả 404. Cắt hết dấu "/" thừa để việc dán URL không còn là
    cái bẫy.
  */
  const baseUrl = (process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1")
    .replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Chưa cấu hình OPENAI_API_KEY." },
      { status: 500 },
    );
  }

  /* ── 3) Cổng kích thước ──────────────────────────────────────────────── */
  const body = await req.json().catch(() => null);
  const history = cleanHistory((body as { messages?: unknown } | null)?.messages);

  if (history.length === 0 || history[history.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Cần một câu hỏi của người xem." },
      { status: 400 },
    );
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      max_tokens: 200,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ reply });
}
