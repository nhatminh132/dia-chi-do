import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Điểm đăng ký GSAP duy nhất của ứng dụng.
 *
 * Import mọi thứ từ đây — KHÔNG import thẳng `gsap` hay `gsap/ScrollTrigger`
 * ở component khác, nếu không plugin sẽ bị đăng ký nhiều lần và
 * `gsap.matchMedia()` sẽ không hoạt động ổn định trong React StrictMode.
 *
 * `gsap.registerPlugin()` tự bỏ qua nếu plugin đã đăng ký (kiểm tra nội bộ
 * `_globals`), nên gọi ở cấp module là an toàn — kể cả khi React StrictMode
 * remount hay HMR nạp lại module.
 *
 * `gsap.config({ nullTargetWarn: false })` — tắt cảnh báo khi
 * ScrollTrigger chạy trước lúc cây DOM đã render xong (rất phổ biến với
 * App Router: effect chạy trước khi server markup được hydrate).
 */
gsap.registerPlugin(ScrollTrigger);

gsap.config({ nullTargetWarn: false });

// ── TẠM THỜI: chỉ để chẩn đoán, sẽ gỡ ngay ──────────────────────────────
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;
}

/* -------------------------------------------------------------------------
 * Hằng số đo chuẩn — dùng chung để chuyển động đồng nhất toàn site
 * ---------------------------------------------------------------------- */

export const EASE = {
  /** Đường cong chủ đạo: chậm vào, nhanh giữa, đỗ nhẹ cuối. */
  cinematic: "expo.out",
  emphasis: "power3.inOut",
  /** Dành cho scrub — không có ease vì gắn với scroll progress. */
  linear: "none",
} as const;

export const DURATION = {
  fast: 0.5,
  base: 0.9,
  slow: 1.4,
  /** Tiêu đề hero — đủ chậm để đọc, ngắn để không chặn nội dung. */
  title: 1.15,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.13,
} as const;

export { gsap, ScrollTrigger };