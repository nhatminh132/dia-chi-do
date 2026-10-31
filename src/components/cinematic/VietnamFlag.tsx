import { cn } from "@/lib/utils";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  QUỐC KỲ VIỆT NAM — dựng bằng SVG
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  ── Vì sao vẽ bằng SVG chứ không dùng ảnh ────────────────────────────────
 *
 *  Khi không có clip video (chưa có — xem `src/data/scenes.ts`), cảnh 01 vẫn
 *  phải có một lá cờ ĐÚNG. Một file ảnh bitmap sẽ làm tăng băng thông và
 *  mất quyền kiểm soát màu. SVG thì:
 *
 *   • nhẹ, vector, sắc nét ở mọi kích thước,
 *   • cho phép thêm lớp nếp vải bằng gradient mà không cần file ngoài,
 *   • không phụ thuộc mạng và không bao giờ hỏng.
 *
 *  ── Hình học ─────────────────────────────────────────────────────────────
 *
 *  Cờ tỉ lệ 2:3 (viewBox 1000×600). Ngôi sao năm cánh:
 *
 *      • tâm đúng tâm lá cờ: (500, 300)
 *      • đường kính = 1/3 chiều cao lá cờ ⇒ bán kính ngoài R = 100
 *      • bán kính trong của ngôi sao năm cánh: r = R × 0,381966
 *        (= R × cos72° / cos36°)
 *      • đỉnh trên hướng lên trên
 *
 *  Đỏ cờ #C8102E, vàng ngôi sao #FFD700 — đúng hai màu đã có trong bảng
 *  màu của dự án (`--color-flag-red`, `--color-gold`).
 *
 *  ── Quy tắc ──────────────────────────────────────────────────────────────
 *
 *  Đây là HỌA TIẾT TRANG TRÍ, không phải ảnh tư liệu lịch sử — nên nó mang
 *  `data-illustrative="true"` và `role="presentation"` khi dùng làm nền.
 *  Khi dùng như một khối có ý nghĩa (màn mở đầu), nó có nhãn thay thế
 *  đầy đủ và được đọc bởi trình đọc màn hình.
 */

const FLAG_RED = "#C8102E";
const FLAG_GOLD = "#FFD700";

/**
 * Đường viết ngôi sao năm cánh.
 *
 * Các đỉnh xen kẽ: ngoài → trong → ngoài → trong… Với R = 100 và
 * r = 38,1966, quanh tâm (500, 300):
 *
 *      ngoài:  (500,00 200,00) (595,11 269,10) (558,78 380,90)
 *              (441,22 380,90) (404,89 269,10)
 *      trong:  (522,45 269,10) (536,33 311,81) (500,00 338,20)
 *              (463,67 311,81) (477,55 269,10)
 */
const STAR_PATH =
  "M 500 200 " +
  "L 522.45 269.10 " +
  "L 595.11 269.10 " +
  "L 536.33 311.81 " +
  "L 558.78 380.90 " +
  "L 500 338.20 " +
  "L 441.22 380.90 " +
  "L 463.67 311.81 " +
  "L 404.89 269.10 " +
  "L 477.55 269.10 " +
  "Z";

export function VietnamFlag({
  className,
  /** Có gấp nếp vải hay không (lớp gradient trên nền đỏ). */
  fabric = true,
  /** Nhãn thay thế khi lá cờ mang ý nghĩa nội dung. */
  label,
}: {
  className?: string;
  fabric?: boolean;
  label?: string;
}) {
  const decorative = !label;

  return (
    <svg
      viewBox="0 0 1000 600"
      /* Khi trang trí: ẩn khỏi cây trợ năng. Khi mang ý nghĩa: có nhãn. */
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={label}
      data-illustrative={decorative ? "true" : undefined}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
    >
      <defs>
        {/* Nếp vải: một dải tối ở mép dưới, một dải sáng chéo ở giữa. */}
        <linearGradient id="dd-flag-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="72%" stopColor="#000000" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.34" />
        </linearGradient>

        <linearGradient id="dd-flag-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.13" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="dd-flag-vignette" cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </radialGradient>
      </defs>

      {/* Nền đỏ */}
      <rect width="1000" height="600" fill={FLAG_RED} />

      {/* Ngôi sao vàng năm cánh — luôn ở chính giữa */}
      <path d={STAR_PATH} fill={FLAG_GOLD} />

      {fabric ? (
        <>
          <rect width="1000" height="600" fill="url(#dd-flag-sheen)" />
          <rect width="1000" height="600" fill="url(#dd-flag-fold)" />
          <rect width="1000" height="600" fill="url(#dd-flag-vignette)" />
        </>
      ) : null}
    </svg>
  );
}
