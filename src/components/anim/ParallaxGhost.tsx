"use client";

import { useLayoutEffect, useRef } from "react";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";
import { EASE, gsap } from "@/lib/gsap/gsap";
import { cn } from "@/lib/utils";

/**
 * Chữ số / chữ cái khổng lồ mờ nhạt, trôi chậm theo cuộn.
 *
 * Đây là yếu tố "chiều sâu" rẻ nhất trong thiết kế điện ảnh: một lớp
 * chạy chậm hơn nội dung, tạo cảm giác máy quay đang lùi chứ không phải
 * trang đang đứng yên.
 *
 * `aria-hidden` vì thuần trang trí — không mang thông tin cho screen reader.
 * Giảm chuyển động thì đứng yên ở giữa, vẫn trang trí nhưng không trôi.
 */
export function ParallaxGhost({
  children,
  className,
  /** 1 = mạnh, 0.5 = nhẹ. Giữ dưới ~12 để không gây khó chịu. */
  strength = 1,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionEnabled = useMotionEnabled();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -9 * strength },
        {
          yPercent: 9 * strength,
          ease: EASE.linear,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            // scrub > 1 → có độ trễ nhẹ, chuyển động "nặng" hơn, đỡ giật
            scrub: 1.1,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [motionEnabled, strength]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-illustrative="true"
      className={cn("pointer-events-none select-none", className)}
    >
      {children}
    </span>
  );
}