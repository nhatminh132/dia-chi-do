"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsap";
import { useMotionReady } from "@/lib/gsap/motionReady";

/**
 * SCENE SEAM — motif chuyển cảnh dùng chung.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Mỗi chương mở ra bằng CÙNG MỘT dấu hiệu: một đường đỏ chạy ngang mép trên,
 * một nhịp sáng đỏ loé lên rồi tắt, một đoạn vàng chạy hết chiều ngang.
 *
 * Vì sao không làm hiệu ứng riêng cho từng cảnh: nhiều hiệu ứng khác nhau
 * khiến các chương đọc như các trang dán lại. Một motif lặp lại — như tiếng
 * đập cửa buồng chiếu phim — mới nối chúng thành một bộ phim.
 *
 * Chỉ dùng transform/opacity. Không thêm `position: sticky`, không biến đổi
 * `<section>` ⇒ không phá cột sticky hay nhịp pin của SceneSequenceMedia.
 */
export function SceneSeam({ index }: { index: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useMotionReady();

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!ready || !el || !section) return;

    const ctx = gsap.context(() => {
      const rule = el.querySelector<HTMLElement>("[data-seam-rule]");
      const pulse = el.querySelector<HTMLElement>("[data-seam-pulse]");
      const bloom = el.querySelector<HTMLElement>("[data-seam-bloom]");
      const tag = el.querySelector<HTMLElement>("[data-seam-tag]");
      if (!rule || !pulse || !bloom || !tag) return;

      gsap.set(rule, { scaleX: 0 });
      gsap.set(tag, { autoAlpha: 0, x: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 96%",
          end: "top 46%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      tl.to(rule, { scaleX: 1, duration: 1, ease: "none" }, 0)
        .to(bloom, { opacity: 1, duration: 0.32, ease: "none" }, 0)
        .to(bloom, { opacity: 0, duration: 0.52, ease: "none" }, 0.38)
        .to(tag, { autoAlpha: 1, x: 0, duration: 0.22, ease: "power2.out" }, 0.34)
        .fromTo(
          pulse,
          { x: () => -pulse.offsetWidth, opacity: 0 },
          {
            x: () => rule.offsetWidth,
            opacity: 1,
            duration: 1,
            ease: "none",
          },
          0,
        )
        .to(pulse, { opacity: 0, duration: 0.18, ease: "none" }, 0.82);
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scene-seam
      className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-40 overflow-hidden"
    >
      {/* Nhịp sáng đỏ ở mép cắt — "light leak" của buồng chiếu. */}
      <div
        data-seam-bloom
        className="absolute inset-x-0 top-0 h-40 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 58% 100% at 50% 0%, rgba(200,16,46,0.30) 0%, rgba(200,16,46,0) 72%)",
        }}
      />

      {/* Đường cắt chính. */}
      <div
        data-seam-rule
        className="absolute inset-x-5 top-0 h-px origin-left bg-gradient-to-r from-flag-red via-flag-red/45 to-transparent sm:inset-x-8 lg:inset-x-12"
      />

      {/* Đoạn vàng chạy dọc đường cắt, như đầu kim băng qua khung hình. */}
      <span
        data-seam-pulse
        className="absolute -top-px left-5 block h-[2px] w-16 bg-gold sm:left-8 lg:left-12"
      />

      {/* Dấu đăng ký giữa khung. */}
      <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-flag-red/70" />

      {/* Nhãn chương nhỏ, chỉ để định vị — nội dung thật nằm ở title card. */}
      <div
        data-seam-tag
        className="absolute right-5 top-3 flex items-center gap-2 font-mono text-[0.54rem] uppercase tracking-[0.24em] text-paper-faint sm:right-8 lg:right-12"
      >
        <span className="inline-block size-1.5 bg-flag-red" />
        <span className="tabular-nums">Ch {index}</span>
      </div>
    </div>
  );
}
