import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Bạn là trợ lý của bảo tàng số "Địa Chỉ Đỏ — Khát vọng độc lập cho thành phố", về lịch sử đấu tranh giành độc lập của Sài Gòn và các di tích cách mạng.

Chỉ trả lời về website/dự án và lịch sử Sài Gòn, Đảng Cộng sản Việt Nam, các địa điểm di tích, dòng thời gian, Đông Nam Á, tư liệu, quiz.

Quy tắc:
- Trả lời ngắn gọn (1-3 câu), tiếng Việt.
- Không bịa sự kiện/ngày tháng/nhân vật/địa chỉ.
- Nếu câu hỏi ngoài phạm vi, từ chối ngắn: "Việc đó nằm ngoài khả năng của tôi, hãy thử hỏi về ngày Giải phóng chẳng hạn?"
- Không dùng markdown dài; ưu tiên văn bản thuần.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
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

  /* Chỉ gửi 10 lượt gần nhất: hội thoại dài không được phép phình payload
     (và hoá đơn) mỗi lần người xem hỏi thêm một câu. */
  const history = Array.isArray(messages) ? messages.slice(-10) : [];

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
