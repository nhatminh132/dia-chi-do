"use client";

import { useLayoutEffect, useRef } from "react";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap/gsap";
import { backgroundDrift } from "@/lib/gsap/motionPresets";
import { useMotionReady } from "@/lib/gsap/motionReady";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  PARALLAX BACKDROP — lớp nền trôi theo cuộn
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Vì sao cần một component riêng thay vì nhét `scrub` vào từng trang:
 *
 *  Trước đây chỉ trang chủ, trang hồ sơ và trang Đông Nam Á có chuyển động
 *  nền. Các trang ngắn như `/thu-thach`, `/gioi-thieu`, `/tu-lieu` gần như
 *  đứng yên — người xem cuộn mà không thấy gì chuyển, dù nội dung vẫn ở đó.
 *
 *  Component này gói phần lặp lại: một lớp nền trôi chậm theo vị trí của
 *  chính nó trong viewport. Nhờ vậy chỉ cần khai báo "nền này trôi" là xong,
 *  không phải viết lại `gsap.context` + `ScrollTrigger` ở mỗi route.
 *
 * ── Kỹ thuật ─────────────────────────────────────────────────────────────
 *
 *  • Trigger là CHÍNH lớp nền này. Vì nó `absolute inset-0` trong một section
 *    có `position: relative`, hộp của nó trùng với hộp của section — nên
 *    `start: "top bottom"` → `end: "bottom top"` bao trọn đúng lúc section
 *    đi qua màn hình, và `scrub` nối liền chuyển động với con lăn.
 *
 *  • Lớp nền cao HƠN section (`-top-[18%] h-[136%]`) để khi trôi lên không
 *    lộ ra mép trên. Đây là lý do `backgroundDrift` dùng `yPercent` chứ
 *    không dùng pixel.
 *
 *  • `will-change: transform` do `backgroundDrift` bật trong lúc scrub; trong
 *    markup KHÔNG đặt class tĩnh — bật vĩnh viễn sẽ giữ GPU layer cho cả 5
 *    mặt phẳng nền và đốt pin laptop.
 *
 *  • Giảm chuyển động ⇒ không tạo trigger, lớp nền đứng yên. Nội dung vẫn
 *    đọc được bình thường.
 */

export function ParallaxBackdrop({
  className,
  style,
  strength = 60,
  depth = false,
  children,
}: {
  /** Lớp vị trí (thường là `absolute inset-0` của section). */
  className?: string;
  /** Nền gradient. */
  style?: React.CSSProperties;
  /** Cường độ trôi. Lớn hơn ⇒ nhanh hơn. */
  strength?: number;
  /**
   * Đánh dấu lớp này là MẶT PHẲNG NỀN của máy quay điện ảnh.
   *
   * Khi bật, `CameraRoom` sẽ phóng to + hạ sáng lớp này khi nó còn ngoài
   * tiêu điểm, rồi trở lại đúng độ sáng khi phòng đi vào vùng nhìn. Đó là
   * hiệu ứng rack focus — xem `CameraRoom.tsx`.
   */
  depth?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const layoutReady = useMotionReady();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled || !layoutReady) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        ...backgroundDrift(strength),
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [motionEnabled, layoutReady, strength]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-depth={depth ? "" : undefined}
      className={cn(
        "pointer-events-none absolute inset-x-0 -top-[18%] h-[136%]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
