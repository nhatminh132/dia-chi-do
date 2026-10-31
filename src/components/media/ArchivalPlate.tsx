import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  PLATE LƯU TRỮ — khung dành cho tấm ảnh chưa có
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Vấn đề mà component này giải ─────────────────────────────────────────
 *
 * Trước đây chỗ ảnh chưa có là một ô xám với biểu tượng con đường nét và
 * dòng chữ "ẢNH ĐẠI DIỆN — ĐANG ĐƯỢC XÁC MINH". Nhìn như một lỗi: bảo mật
 * chưa làm xong, hình chưa tải lên, hoặc nhà phát triển đã bỏ rơi.
 *
 * Nhưng nó KHÔNG phải lỗi — đó là một quyết định biên tập có chủ đích:
 * những bức ảnh này chưa được kiểm chứng nên chưa được công bố. Vậy thì
 * khung này phải NÓI LÊN sự kiện đó một cách đẹp, thay vì trông như thiếu.
 *
 * ── Ngôn ngữ thị giác ───────────────────────────────────────────────────
 *
 * Lấy trực tiếp từ `LightTable`: lưới bản vẽ kỹ thuật, dấu đăng ký ở bốn
 * góc, chữ mono giãn rộng, màu `#0b0b0c`. Một bảo tàng không để trống chỗ
 * trưng bày — nó treo một tấm biển "tấm này đang trong kho" với đúng kiểu
 * dáng của một tấm biển trong kho.
 *
 * Không dùng `Math.random` (xem giải thích ở `LightTable.tsx`).
 */

/** Vạch chéo, tạo cảm giác "đã đóng dấu vào sổ". */
const HATCH =
  "repeating-linear-gradient(135deg, rgba(242,235,221,0.05) 0 1px, transparent 1px 9px)";

export function ArchivalPlate({
  /** Số hiệu tấm, ví dụ "PLATE 03". */
  plate,
  /** Tiêu đề chính, IN HOA. */
  title,
  /** Dòng giải thích nhỏ bên dưới. */
  note,
  className,
}: {
  plate?: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-illustrative="true"
      data-archival-plate
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#0b0b0c]",
        className,
      )}
    >
      {/* Lưới bản vẽ kỹ thuật — cùng hệ với bàn sáng ở hero */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F2EBDD 1px, transparent 1px), linear-gradient(to bottom, #F2EBDD 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Vạch chéo đóng dấu */}
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: HATCH }} />

      {/* Vùng sáng nhẹ ở giữa — mặt kính phát sáng */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(242,235,221,0.045),transparent_70%)]" />

      {/* Dấu đăng ký bốn góc — quy ước của tấm in trong kho lưu trữ */}
      {(
        [
          "left-2 top-2 border-l border-t",
          "right-2 top-2 border-r border-t",
          "left-2 bottom-2 border-l border-b",
          "right-2 bottom-2 border-r border-b",
        ] as const
      ).map((pos) => (
        <span key={pos} className={`absolute size-4 border-paper/25 ${pos}`} />
      ))}

      {/* Chữ thập tâm — dấu hiệu trục in */}
      <svg
        viewBox="0 0 100 100"
        className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-paper/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        <circle cx="50" cy="50" r="26" />
        <circle cx="50" cy="50" r="34" strokeDasharray="2 5" />
        <path d="M50 8v18M50 74v18M8 50h18M74 50h18" />
      </svg>

      {/* Số hiệu tấm, góc trên trái trong khung */}
      {plate ? (
        <span className="absolute left-5 top-5 font-mono text-[0.58rem] uppercase tracking-[0.3em] text-paper-mute">
          {plate}
        </span>
      ) : null}

      {/* Dấu chấm dở kiểm duyệt, góc trên phải */}
      <span className="absolute right-5 top-5 size-1.5 rounded-full bg-flag-red/70" />

      {/* Chữ, đặt ở nửa dưới để không đè lên chữ thập tâm */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-5 pb-5 text-center sm:pb-6">
        <span className="h-px w-8 bg-line-strong" />
        <p className="font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.2em] text-paper-mute sm:text-[0.62rem]">
          {title}
        </p>
        {note ? (
          <p className="max-w-[22ch] text-balance font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}