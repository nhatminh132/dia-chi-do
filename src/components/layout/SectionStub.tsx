import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Button } from "@/components/ui/Button";

/**
 * Khung cho các trang đang được xây dựng.
 *
 * ── Vì sao cần, thay vì để nút bấm dẫn tới 404 ────────────────────────────
 *
 * Idea.txt §1 yêu cầu "các nút phải hoạt động thật, không phải thành phần
 * trang trí". Nếu các nút trên trang chủ trỏ tới route chưa tồn tại thì
 * chúng là nút trang trí — người xem bấm rồi gặp trang lỗi.
 *
 * Vì vậy mọi route được liên kết đều phải tồn tại và hiển thị được điều gì
 * đó hợp lý. Trang stub trung thực nói rõ "đang được xây dựng" và luôn có
 * lối về — tốt hơn là một 404 lạnh lùng.
 *
 * Nội dung trang này SẼ được thay thế ở các phase sau (bản đồ ở Phase 6, dòng
 * thời gian chi tiết ở Phase 5…). Việc xây khung trước giữ cho điều hướng
 * của trang chủ luôn liền mạch trong quá trình phát triển.
 */
export function SectionStub({
  index,
  label,
  title,
  description,
  /** Các gạch đầu dòng cho biết trang này sẽ có gì. */
  planned,
  backHref = "/",
  backLabel = "Về trang chủ",
  /**
   * Phase 5.5 §1.1: truyền "h1" từ các trang đứng một mình (hiện là
   * `/thu-thach`) để mỗi trang có đúng một heading cấp 1 thật, không cần
   * chèn thêm `<h1>` sr-only song song.
   */
  headingLevel = "h2",
}: {
  index: string;
  label: string;
  title: string;
  description: string;
  planned: string[];
  backHref?: string;
  backLabel?: string;
  headingLevel?: "h1" | "h2";
}) {
  return (
    <ChapterFrame
      index={index}
      label={label}
      title={title}
      description={description}
      plate="grid"
      className="min-h-[70svh]"
      headingLevel={headingLevel}
    >
      <div className="max-w-2xl">
        <p className="border-l-2 border-gold-dim bg-ink-900/70 px-5 py-4 font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.18em] text-gold-dim">
          Trang này đang được hoàn thiện
        </p>

        <p className="mt-8 text-pretty text-[0.95rem] leading-[1.85] text-paper-dim">
          Nội dung đã được chuẩn bị trong đặc tả dự án và sẽ được đưa lên ở các
          giai đoạn tiếp theo. Trong lúc đó, các mục dưới đây cho biết trang sẽ
          có gì:
        </p>

        <ul className="mt-7 space-y-3">
          {planned.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-line pb-3 text-[0.9rem] leading-relaxed text-paper-mute"
            >
              <span
                aria-hidden
                className="mt-2 inline-block size-1.5 shrink-0 rotate-45 bg-flag-red"
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={backHref}>{backLabel}</Button>
          <Button href="/ban-do" variant="outline">
            Khám phá địa chỉ đỏ
          </Button>
        </div>
      </div>
    </ChapterFrame>
  );
}