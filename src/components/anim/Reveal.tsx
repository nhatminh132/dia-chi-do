"use client";

import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useMediaQuery";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";
import { EASE, gsap, DURATION, STAGGER } from "@/lib/gsap/gsap";
import { useMotionReady } from "@/lib/gsap/motionReady";
import { VIEWPORT_ENTER, VIEWPORT_ENTER_EARLY } from "@/lib/gsap/motionPresets";

type Variant =
  /** Trồi lên + mờ dần — dành cho văn bản. */
  | "up"
  /** Mở mặt nạ cắt — dành cho ảnh và khối lớn. */
  | "mask"
  /** Các phần tử con hiện lần lượt — dành cho danh sách. */
  | "stagger"
  /** Mở mặt nạ cắt dọc — dành cho khối lớn, mạnh hơn `mask`. */
  | "clip"
  /** Dâng lên có trọng lượng — dành cho TIÊU ĐỀ quan trọng. */
  | "settle"
  /** Trôi vào nhẹ kèm thu nhỏ — dành cho ẢNH và lớp nền. */
  | "drift";

/**
 * Hiệu ứng xuất hiện khi cuộn tới, dùng lại cho toàn trang.
 *
 * ── Vì sao dùng `gsap.from` chứ không dùng CSS `opacity: 0` ──────────────
 *
 * Đây là quyết định quan trọng nhất của cả hệ thống hiệu ứng.
 *
 * Nếu ẩn phần tử bằng CSS (`opacity-0`) rồi mới cho JS hiện lên, thì khi
 * JavaScript không chạy — hoặc khi người dùng bật giảm chuyển động — nội
 * dung sẽ vĩnh viễn ẩn. Đó là hiệu ứng lấy mất khả năng đọc nội dung lịch
 * sử, vi phạm trực tiếp yêu cầu của dự án.
 *
 * `gsap.from` ngược lại: HTML gửi ra ĐÃ có nội dung hiển thị đầy đủ; JS chỉ
 * chạy một tween "từ ẩn → về vị trí gốc" nếu người xem chưa bật giảm chuyển
 * động. Không JS hay giảm chuyển động → nội dung hiện nguyên trạng, vẹn.
 *
 * ── Ràng buộc hiệu năng ───────────────────────────────────────────────────
 *
 * Chỉ animate `opacity` và `transform`. Không có `setState` trong vòng lặp
 * animation, không có `setTimeout`. Mọi tween nằm trong `gsap.context()`
 * nên tự thu hồi khi unmount — an toàn với React StrictMode remount hai lần.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  distance = 28,
  className,
  /** Trong `variant="stagger"`: selector của các phần tử con cần hiện. */
  childrenSelector = ":scope > *",
  early = false,
  respectReducedMotion = false,
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  distance?: number;
  className?: string;
  childrenSelector?: string;
  /** Kích hoạt sớm hơn cho phần tử nằm gần giữa màn hình. */
  early?: boolean;
  /**
   * Tôn trọng cài đặt "giảm chuyển động" của hệ điều hành.
   *
   * MẶC ĐỊNH `false` — hành vi CŨ GIỮ NGUYÊN: dự án cố ý bật hiệu ứng
   * bất kể cài đặt hệ thống (xem `motionPreference.tsx`). Không đổi.
   *
   * Lớp cinematic V2 bật cờ này cho các hiệu ứng của mình: những hiệu ứng
   * mới (video nền, ghim, scrub, vệt mực) chưa từng nằm trong quyết định
   * cũ, và người dùng bật giảm chuyển động ở cấp hệ điều hành thì phải
   * được miễn nhiễm.
   *
   * Khi `true` và hệ điều hành đang yêu cầu giảm chuyển động ⇒ KHÔNG tạo
   * trigger nào. Nội dung hiện nguyên trạng — vì `Reveal` dùng `fromTo`
   * trên nội dung vốn đã có sẵn trong HTML, không dùng `opacity: 0` tĩnh.
   */
  respectReducedMotion?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const layoutReady = useMotionReady();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled) return;

    // Tôn trọng giảm chuyển động của hệ điều hành (tuỳ chọn, mặc định tắt).
    //
    // Đọc ĐỒNG BỘ tại thời điểm effect chạy: hook `usePrefersReducedMotion`
    // không dùng được ở đây (hook phải gọi ở thân component), và lúc hydrate
    // giá trị của hook còn là `false` — đọc bằng hook sẽ tạo trigger rồi mới
    // hoàn tác, gây nháy. `prefersReducedMotion()` đọc thẳng `matchMedia`.
    if (respectReducedMotion && prefersReducedMotion()) return;


    // ── Chặn tạo trigger cho tới khi bố cục ổn định ──────────────────────
    //
    //  Trong lúc Next hydrate, chiều cao tài liệu tăng từ ~1463px lên
    //  ~10353px (đo thật trên trang chủ). ScrollTrigger đo `start` ngay lúc
    //  được tạo, nên nếu tạo trong lúc đó thì mọi phần tử đều ra `start`
    //  âm — tức "đã lọt" ngay ở scrollY = 0 — và vì `once: true` nên trigger
    //  tự hủy vĩnh viễn. Kết quả: 94% hiệu ứng chạy xong trước khi người
    //  xem kéo con lăn lần đầu, trang trông tĩnh hoàn toàn.
    //
    //  Chờ `layoutReady` là cách sửa nhỏ nhất: không đổi ngữ nghĩa `once`,
    //  không thêm timeout, không đụng hệ chuyển động. Giải thích đầy đủ ở
    //  `src/lib/gsap/motionReady.tsx`.
    if (!layoutReady) return;

    // ── `trigger: el` là BẮT BUỘC, không phải tuỳ chọn ───────────────────
    //
    //  ScrollTrigger chỉ tự suy ra trigger khi tween có ĐÚNG MỘT target. Với
    //  `variant="stagger"` ta truyền MỘT CHUỖI SELECTOR (" :scope > *") nên
    //  target là nhiều phần tử, ScrollTrigger không có cái gì để làm neo và
    //  rơi về mốc đầu tài liệu: đo được `start = -0.82 * viewport = -738px`.
    //  Âm ⇒ coi như đã vượt qua ngay cả khi scrollY = 0 ⇒ tween chạy lập tức
    //  và, do `once: true`, tự hủy vĩnh viễn.
    //
    //  Chỉ định rõ `trigger: el` (phần tử bọc của Reveal) cho mọi biến thể:
    //  ScrollTrigger đo theo phần tử này, và mọi lần `refresh()` sau đó cũng
    //  đo lại đúng theo nó.
    const trigger = {
      ...(early ? VIEWPORT_ENTER_EARLY : VIEWPORT_ENTER),
      trigger: el,
    };

    const ctx = gsap.context(() => {
      if (variant === "mask") {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: DURATION.slow,
            ease: EASE.cinematic,
            delay,
            clearProps: "clipPath",
            scrollTrigger: trigger,
          },
        );
        return;
      }

      // Khối lớn — mở mặt nạ dọc, mạnh và chậm hơn `mask`.
      if (variant === "clip") {
        gsap.fromTo(
          el,
          { opacity: 0, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: DURATION.slow,
            ease: EASE.cinematic,
            delay,
            clearProps: "opacity,clipPath,transform",
            scrollTrigger: trigger,
          },
        );
        return;
      }

      // Tiêu đề quan trọng — dâng lên chậm hơn, tạo cảm giác có trọng lượng.
      if (variant === "settle") {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.slow,
            ease: EASE.cinematic,
            delay,
            clearProps: "opacity,transform",
            scrollTrigger: trigger,
          },
        );
        return;
      }

      // Ảnh và lớp nền — trôi vào nhẹ, không "bật" vào.
      if (variant === "drift") {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 1.04 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DURATION.base,
            ease: EASE.cinematic,
            delay,
            clearProps: "opacity,transform",
            scrollTrigger: trigger,
          },
        );
        return;
      }

      if (variant === "stagger") {
        gsap.fromTo(
          childrenSelector,
          { opacity: 0, y: distance },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: EASE.cinematic,
            stagger: STAGGER.tight,
            delay,
            clearProps: "opacity,transform",
            scrollTrigger: trigger,
          },
        );
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.cinematic,
          delay,
          clearProps: "opacity,transform",
          scrollTrigger: trigger,
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [
    motionEnabled,
    layoutReady,
    variant,
    delay,
    distance,
    childrenSelector,
    early,
    respectReducedMotion,
  ]);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-reveal-variant={variant}
      className={className}
    >
      {children}
    </div>
  );
}