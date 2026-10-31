/**
 * TITLE CARD CỦA CHƯƠNG — "slate" điện ảnh.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Thay cho một nhãn section nhỏ: số chương lớn, đường kẻ trên/dưới, metadata
 * bên phải. Đây là bảng dựng đầu cảnh, không phải một tiêu đề trang.
 *
 * Không JavaScript, không animation: `Reveal` của tiêu đề phía dưới vẫn lo
 * nhịp xuất hiện, nên slate không tranh chuyển động với GSAP.
 */
export function ChapterSlate({
  index,
  label,
  meta,
}: {
  /** Số chương, ví dụ "03". */
  index: string;
  /** Nhãn chương, ví dụ "Archive · Resistance · Map". */
  label: string;
  /** Dòng dữ kiện ngắn, ví dụ "10 hồ sơ công khai". */
  meta: string;
}) {
  return (
    <div data-chapter-slate className="relative">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-y border-line py-5">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="font-display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-none tabular-nums text-gold">
            {index}
          </span>
          <span className="max-w-[24ch] font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.26em] text-paper-mute">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-paper-faint">
          <span aria-hidden className="inline-block size-1.5 bg-flag-red" />
          <span>{meta}</span>
          <span aria-hidden className="hidden h-px w-10 bg-line-strong sm:block" />
          <span className="hidden sm:inline">Chương {index}</span>
        </div>
      </div>

      {/* Vạch đỏ ngắn ở mép trên — nhịp cắt cảnh, không phải trang trí rải rác. */}
      <span aria-hidden className="absolute -top-px left-0 h-px w-24 bg-flag-red" />
    </div>
  );
}
