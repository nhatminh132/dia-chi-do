import { cn } from "@/lib/utils";

/**
 * Nền trang trí dựng hoàn toàn bằng CSS/SVG.
 *
 * ⚠️ QUY TẮC TUYỆT ĐỐI — đọc trước khi dùng:
 * Component này KHÔNG BAO GIỜ được dùng làm ảnh tư liệu lịch sử và
 * không bao giờ được đặt vào trường `ArchiveItem.src`.
 * Nó chỉ là lớp nền khí quyển cho hero, section và placeholder.
 *
 * Vì vậy nó luôn đặt `data-illustrative="true"` + `role="presentation"`,
 * để bất kỳ ai đọc DOM cũng phân biệt được ngay đâu là ảnh thật,
 * đâu là họa tiết trang trí. Khi ảnh thật có, chỉ cần thay src vào
 * `ArchiveImage` — không cần sửa gì ở đây.
 */

export type PlateVariant =
  /** Lưới bản đồ cách điệu + tia sáng đỏ — chủ đề "địa chỉ". */
  | "grid"
  /** Gradient đỏ sâu → đen — chủ đề "cam kết / khát vọng". */
  | "abyss"
  /** Giấy cũ + vệt mực — chủ đề "hồ sơ tư liệu". */
  | "paper"
  /** Tối đặc, tia đơn — chủ đề "chiến tranh / ký ức". */
  | "ember";

interface PlateProps {
  variant?: PlateVariant;
  /** Cường độ tối phủ thêm (0–1). Dùng để tăng tương phản chữ. */
  density?: number;
  className?: string;
  children?: React.ReactNode;
}

export function CinematicPlate({
  variant = "grid",
  density = 0.55,
  className,
  children,
}: PlateProps) {
  return (
    <div
      data-illustrative="true"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        PLATE_BASE[variant],
        className,
      )}
    >
      {PLATE_DECOR[variant]}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgb(10 10 10 / ${density * 0.55}) 0%, rgb(10 10 10 / ${density}) 55%, rgb(10 10 10 / ${Math.min(density * 1.35, 0.95)}) 100%)`,
        }}
      />
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Các lớp nền
 * ---------------------------------------------------------------------- */

const PLATE_BASE: Record<PlateVariant, string> = {
  grid: "bg-ink-900",
  abyss: "bg-ink-900",
  paper: "bg-ink-900",
  ember: "bg-ink-900",
};

const PLATE_DECOR: Record<PlateVariant, React.ReactNode> = {
  // Lưới bản đồ: hai lớp lưới lệch pha tạo chiều sâu, cộng một vệt sáng đỏ.
  grid: (
    <>
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C8102E 1px, transparent 1px), linear-gradient(to bottom, #C8102E 1px, transparent 1px)",
          backgroundSize: "68px 68px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F2EBDD 1px, transparent 1px), linear-gradient(to bottom, #F2EBDD 1px, transparent 1px)",
          backgroundSize: "17px 17px",
        }}
      />
      <div
        className="absolute -left-1/4 top-1/4 h-[130%] w-[80%] rotate-[18deg] opacity-25 blur-[90px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C8102E 45%, transparent 100%)",
        }}
      />
    </>
  ),

  // Vực: gradient đỏ sâu tụ xuống đen, cộng một quầng sáng vàng rất mờ.
  abyss: (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 8%, #5E0715 0%, #1a0a0d 42%, #0A0A0A 78%)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-[70vh] w-[70vw] -translate-x-1/2 opacity-[0.10] blur-[120px]"
        style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 68%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)",
        }}
      />
    </>
  ),

  // Giấy cũ: vệt mực loang nhẹ, gợi trang hồ sơ lưu trữ.
  paper: (
    <>
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(94deg, #F2EBDD 0 2px, transparent 2px 9px)",
        }}
      />
      <div
        className="absolute -right-1/5 top-1/3 h-[70vh] w-[70vw] rounded-full opacity-[0.13] blur-[130px]"
        style={{ background: "radial-gradient(circle, #8E0B20 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-8 left-8 h-px w-40 opacity-40"
        style={{ background: "linear-gradient(to right, #A2977F, transparent)" }}
      />
    </>
  ),

  // Ember: đốm nhiệt rải rác, ánh sáng đơn từ trên xuống.
  ember: (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgb(200 16 46 / 0.30) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 72%, #FF2D55 0%, transparent 9%), radial-gradient(circle at 76% 38%, #FFD700 0%, transparent 7%), radial-gradient(circle at 42% 86%, #C8102E 0%, transparent 11%), radial-gradient(circle at 88% 78%, #FF2D55 0%, transparent 6%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(10 10 10 / 0.15) 0%, rgb(10 10 10 / 0.9) 88%)",
        }}
      />
    </>
  ),
};

/* -------------------------------------------------------------------------
 * Họa tiết tĩnh dùng lặp lại (cache-friendly, không phụ thuộc ảnh ngoài)
 * ---------------------------------------------------------------------- */

/** Lưới nhỏ dùng cho nền section, độ mờ rất thấp. */
export function GridField({ className }: { className?: string }) {
  return (
    <div
      data-illustrative="true"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.05]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(to right, #A2977F 1px, transparent 1px), linear-gradient(to bottom, #A2977F 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}

/** Đường kẻ tư liệu: đường kẻ ngang có vạch, dùng làm ngăn cách section. */
export function TickedRule({ className }: { className?: string }) {
  return (
    <div
      data-illustrative="true"
      aria-hidden="true"
      className={cn("rule-tick h-px w-full opacity-70", className)}
    />
  );
}