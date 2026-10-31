import OpenAI, { APIError } from "openai";
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
 *  /api/chat — HƯỚNG DẪN VIÊN AI
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Không tự dựng request HTTP nữa: route này gọi SDK chính thức `openai`,
 *  trỏ tới **router** khai trong `.env`:
 *
 *      OPENAI_BASE_URL   gốc API của router (OpenAI, OpenRouter, Groq,
 *                        DeepSeek, Gemini… — bất kỳ thứ gì nói giao thức
 *                        OpenAI). Bỏ trống ⇒ api.openai.com.
 *      OPENAI_MODEL      tên model phía router.
 *      OPENAI_API_KEY    khoá router.
 *
 *  SDK lo phần khó chịu mà bản fetch tay từng phải tự làm: ghép URL, cắt dấu
 *  "/" thừa, thử lại khi lỗi mạng, timeout, đọc lỗi của nhà cung cấp thành
 *  `APIError` có `status`. Vì vậy KHÔNG còn đoạn nối chuỗi `${baseURL}/chat/
 *  completions` — chỉ cần đúng baseURL.
 *
 *  ── Ba cổng chặn phía trước ────────────────────────────────────────────
 *  Khoá router nằm ở server, không xuống trình duyệt, nhưng route vẫn công
 *  khai nên phải tự bảo vệ: (1) chỉ nhận request từ chính website này,
 *  (2) 20 câu / 5 phút / IP, (3) giới hạn kích thước đầu vào.
 *  Đây là kiểm tra theo header, không phải chữ ký mật mã — chốt chặn cuối
 *  vẫn là hạn mức chi tiêu đặt cho khoá ở phía nhà cung cấp.
 */

const MAX_MESSAGES = 10;
const MAX_CHARS_PER_MESSAGE = 1000;
const MAX_TOTAL_CHARS = 4000;

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60 * 1000;

/** Timeout mỗi lượt gọi router; Vercel Hobby cắt function ở 10s (mặc định). */
const REQUEST_TIMEOUT_MS = 25_000;

type HistoryMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

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
function cleanHistory(input: unknown): HistoryMessage[] {
  if (!Array.isArray(input)) return [];

  const picked: HistoryMessage[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || content.trim() === "") continue;
    picked.push({ role, content: content.slice(0, MAX_CHARS_PER_MESSAGE) });
  }

  // Đi từ cuối lên: câu hỏi mới nhất là thứ không được phép rơi.
  const kept: HistoryMessage[] = [];
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
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chưa cấu hình OPENAI_API_KEY." },
      { status: 500 },
    );
  }

  /* Gốc API của router. SDK tự nối `/chat/completions` vào sau, nên chỉ cần
     cắt dấu "/" thừa cho chắc — dán URL kiểu `.../openai/` vẫn chạy đúng. */
  const baseURL = process.env.OPENAI_BASE_URL?.trim().replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  /* ── 3) Cổng kích thước ──────────────────────────────────────────────── */
  const body = await req.json().catch(() => null);
  const history = cleanHistory((body as { messages?: unknown } | null)?.messages);

  if (history.length === 0 || history[history.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Cần một câu hỏi của người xem." },
      { status: 400 },
    );
  }

  const client = new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    timeout: REQUEST_TIMEOUT_MS,
    // Một lần thử lại là đủ: người xem đang chờ trước màn hình.
    maxRetries: 1,
  });

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      max_tokens: 200,
      temperature: 0.4,
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (error) {
    /* Lỗi từ router (sai khoá, hết hạn mức, model không tồn tại) — trả về
       đúng mã để người xem và chủ dự án biết đường sửa. Nội dung lỗi cắt
       ngắn: đủ đọc trong khung chat, không tràn cả JSON của nhà cung cấp. */
    if (error instanceof APIError) {
      /* `error.message` đã có sẵn mã trạng thái ở đầu ("401 Incorrect API
         key…") — không ghép thêm lần nữa. */
      return NextResponse.json(
        { error: error.message.slice(0, 300) },
        { status: error.status ?? 502 },
      );
    }

    return NextResponse.json({ error: "Không gọi được router AI." }, { status: 502 });
  }
}
