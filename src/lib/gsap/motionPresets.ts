import type { gsap } from "gsap";
import { DURATION, EASE, STAGGER } from "./gsap";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  MOTION PRESETS — từ vựng chuyển động dùng chung
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Toàn bsite dùng đúng 5 chuyển động này. Mục đích: khi người xem đi từ
 *  trang này sang trang khác, chuyển động phải có "cùng giọng" — đó là
 *  điều phân biệt một sản phẩm có art direction với một sản phẩm chỉ nhét
 *  hiệu ứng vào sau.
 *
 *  Các preset chỉ TRẢ VỀ cấu hình cho `gsap.from/to`, không tự chạy animation
 *  và không biết gì về phần tử đích. Thành phần gọi:
 *
 *      gsap.from(targets, revealUp({ delay: 0.1 }));
 *
 *  và bọc trong `gsap.context()` để GSAP tự thu hồi khi component unmount.
 *
 *  Nguyên tắc kỹ thuật:
 *   • Chỉ animate `transform` / `opacity` / `clip-path` — GPU-friendly.
 *   • Không dùng `top/left/width/height` trong chuyển động (gây layout thrash).
 *   • Không có `setTimeout`, không có delay tuỳ ý.
 */

/* -------------------------------------------------------------------------
 * 1. lineStagger — tiêu đề hiện từng dòng qua mặt nạ cắt
 *
 * Dự kiến cấu trúc markup:
 *   <h2><span class="overflow-hidden"><span data-line>KHÁT VỌNG</span></span></h2>
 * Ưu tiên `yPercent` thay vì `y` để không phụ thuộc chiều cao phần tử.
 * ---------------------------------------------------------------------- */

export function lineStagger(opts: { delay?: number } = {}): gsap.TweenVars {
  return {
    yPercent: 110,
    opacity: 0,
    duration: DURATION.title,
    ease: EASE.cinematic,
    stagger: STAGGER.base,
    delay: opts.delay ?? 0,
  };
}

/** Trạng thái đầu — đặt bằng `gsap.set(targets, lineStaggerInitial())`. */
export function lineStaggerInitial(): gsap.TweenVars {
  return { yPercent: 110, opacity: 0 };
}

/* -------------------------------------------------------------------------
 * 2. maskWipe — ảnh mở ra bằng mặt nạ cắt hướng dọc
 *
 * `clip-path: inset()` dùng cho reveal ảnh: nhẹ hơn cắt thật, không
 * cần `overflow: hidden` và không gây vỡ layout khi ảnh chưa tải.
 * ---------------------------------------------------------------------- */

export function maskWipe(
  opts: { from?: "bottom" | "top" | "left" | "right"; delay?: number } = {},
): gsap.TweenVars {
  const side = opts.from ?? "bottom";

  const from: Record<NonNullable<typeof side>, string> = {
    bottom: "inset(0% 0% 100% 0%)",
    top: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  };

  return {
    clipPath: from[side],
    duration: DURATION.slow,
    ease: EASE.cinematic,
    delay: opts.delay ?? 0,
    // Reveal là chuyển từ `from` về giá trị gốc trong stylesheet,
    // nên không khai đích tường minh — tránh ràng buộc CSS vào JS.
  };
}

/* -------------------------------------------------------------------------
 * 3. revealUp — văn bản và caption trồi lên
 *
 * Ẩn bằng `opacity` + `y` nhỏ. Không dùng `autoAlpha` vì sẽ thêm
 * `visibility` và gây reflow.
 * ---------------------------------------------------------------------- */

export function revealUp(
  opts: { delay?: number; distance?: number } = {},
): gsap.TweenVars {
  return {
    opacity: 0,
    y: opts.distance ?? 28,
    duration: DURATION.base,
    ease: EASE.cinematic,
    stagger: STAGGER.tight,
    delay: opts.delay ?? 0,
  };
}

/* -------------------------------------------------------------------------
 * 4. scaleDrift — nền chuyển động chậm theo cuộn (scrub)
 *
 * Đây là preset parallax chính. Chỉ dùng với `scrub`, KHÔNG dùng với
 * trigger thuần — nếu không chuyển động sẽ chạy 1 lần rồi đứng yên,
 * mất hết tác dụng chiều sâu.
 * ---------------------------------------------------------------------- */

export function scaleDrift(opts: { strength?: number } = {}): gsap.TweenVars {
  const k = opts.strength ?? 1;

  return {
    scale: 1 + 0.12 * k,
    yPercent: -7 * k,
    ease: EASE.linear,
    // `will-change` chỉ trong lúc scrub để không giữ GPU layer vĩnh viễn
    willChange: "transform",
  };
}

/* -------------------------------------------------------------------------
 * 5. chapterWipe — lớp chuyển cảnh giữa các chapter
 *
 * Lớp overlay full-screen che mờ, xoá ra để lộ chapter kế tiếp.
 * Dùng ở ranh giới giữa các section lớn, KHÔNG dùng liên tục — quá nhiều
 * wipe sẽ khiến người xem mệt và mất nhịp.
 * ---------------------------------------------------------------------- */

export function chapterWipe(opts: { delay?: number } = {}): gsap.TweenVars {
  return {
    scaleY: 0,
    transformOrigin: "top center",
    duration: DURATION.base,
    ease: EASE.emphasis,
    delay: opts.delay ?? 0,
  };
}

/* -------------------------------------------------------------------------
 * Tiêu chí kích hoạt chuyển động
 *
 * Tách ra để dùng nhất quán: "vào tầm nhìn từ 82% chiều cao màn hình,
 * chạy một lần".
 * ---------------------------------------------------------------------- */

export const VIEWPORT_ENTER = {
  start: "top 82%",
  once: true,
} as const;

/** Kích hoạt sớm hơn cho phần tử đã gần giữa màn hình. */
export const VIEWPORT_ENTER_EARLY = {
  start: "top 92%",
  once: true,
} as const;
/* ==========================================================================
   Phase 6 §3.1 — ngôn ngữ chuyển động mở rộng
   ==========================================================================

   Phase 1–5 dùng một preset revealUp cho gần như mọi thứ. Đúng như đặc tả
   cảnh báo: "tránh áp cùng một hiệu ứng xuất hiện cho mọi phần tử". Ba preset
   dưới đây bổ sung ba cường độ khác nhau, chọn theo MỨC QUAN TRỌNG của nội
   dung chứ không theo vị trí:

     - clipReveal  - khối lớn, cần một khoảng lặng trước khi hiện (khung hồ sơ,
                     ảnh tư liệu). Nặng nhất, dùng ít.
     - driftIn     - ảnh và nền: trôi vào nhẹ, không "bật" vào.
     - settleText  - tiêu đề quan trọng: dâng lên chậm, tạo cảm giác có trọng lượng.

   Tất cả chỉ animate transform/opacity/clip-path nên chạy trên GPU, không gây
   layout thrash.
   ========================================================================== */

/** Mở mặt nạ theo chiều dọc - cho khối lớn. */
export function clipReveal(opts: { delay?: number } = {}): gsap.TweenVars {
  return {
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    duration: DURATION.slow,
    ease: EASE.cinematic,
    delay: opts.delay ?? 0,
  };
}

/** Trôi vào nhẹ - cho ảnh, lớp nền, khối phụ. */
export function driftIn(opts: { delay?: number } = {}): gsap.TweenVars {
  return {
    opacity: 0,
    y: 40,
    scale: 1.04,
    duration: DURATION.base,
    ease: EASE.cinematic,
    delay: opts.delay ?? 0,
  };
}

/** Dâng lên có trọng lượng - cho tiêu đề quan trọng. */
export function settleText(opts: { delay?: number } = {}): gsap.TweenVars {
  return {
    opacity: 0,
    y: 24,
    duration: DURATION.slow,
    ease: EASE.cinematic,
    delay: opts.delay ?? 0,
  };
}

/**
 * Trôi nền theo cuộn - dung voi `scrub`, khong phai `once`.
 *
 * `willChange` chi bat khi chay roi tat: giu layer GPU vinh vien la nguyen
 * nhan kinh nien cua "may quat" tren laptop 8 GB.
 */
export function backgroundDrift(strength = 60): gsap.TweenVars {
  return {
    yPercent: -strength / 10,
    ease: "none",
    willChange: "transform",
  };
}