"use client";

import { useLayoutEffect, useRef } from "react";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";
import { gsap } from "@/lib/gsap/gsap";
import { backgroundDrift } from "@/lib/gsap/motionPresets";
import { useMotionReady } from "@/lib/gsap/motionReady";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  PROFILE HERO — mở đầu điện ảnh cho hồ sơ di tích
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Ba lớp chiều sâu, mỗi lớp trôi với tốc độ khác nhau:
 *
 *   1. Nền khí quyển (đỏ rất mờ)   — trôi chậm nhất
 *   2. Lưới toạ độ (SVG)            — trôi chậm
 *   3. Chữ số chương / tiêu đề      — gần như đứng yên
 *
 * Tất cả dùng `backgroundDrift` — preset scrub chuyên cho lớp nền, chỉ
 * animate `yPercent` nên không tốn GPU. `willChange` được bật trong lúc
 * scrub và tắt lại khi kết thúc.
 *
 * ── Vì sao phải chờ `layoutReady` ───────────────────────────────────────
 *
 * Nếu tạo ScrollTrigger trước khi bố cục ổn định, `start`/`end` được đo sai
 * và hiệu ứng chạy sai chỗ. Xem `src/lib/gsap/motionReady.tsx` để hiểu đầy
 * đủ. Ở đây ta chỉ dùng đúng một trigger, nhưng nguyên tắc là như nhau.
 */
export function ProfileHero({
  eyebrow,
  title,
  subtitle,
  nameEn,
  period,
  status,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  nameEn?: string;
  period: string;
  status: React.ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  const layoutReady = useMotionReady();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled || !layoutReady) return;

    const ctx = gsap.context(() => {
      // Lớp 1 & 2 — nền trôi chậm
      gsap.to("[data-hero-bg]", {
        ...backgroundDrift(70),
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to("[data-hero-grid]", {
        ...backgroundDrift(40),
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.6,
        },
      });

      // Lớp 3 — tiêu đề nổi lên nhẹ, tạo cảm giác tiến về phía người xem
      gsap.to("[data-hero-title]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [motionEnabled, layoutReady]);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[78svh] items-end overflow-hidden border-b border-line"
    >
      {/* Lớp 1 — nền khí quyển */}
      <div
        data-hero-bg
        aria-hidden
        className="absolute inset-x-0 -top-[18%] h-[136%] will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 62% 52% at 22% 8%, #5E0715 0%, #14090B 46%, #0A0A0A 86%)",
        }}
      />

      {/* Lớp 2 — lưới toạ độ */}
      <svg
        data-hero-grid
        aria-hidden
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]"
      >
        <defs>
          <pattern id="profile-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0H0v48"
              stroke="var(--color-paper)"
              strokeOpacity="0.22"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="600" height="400" fill="url(#profile-grid)" />
        <circle cx="150" cy="120" r="2.5" fill="var(--color-gold)" fillOpacity="0.55" />
        <circle cx="410" cy="260" r="1.8" fill="var(--color-flag-red)" fillOpacity="0.7" />
        <path
          d="M150 120 L 410 260"
          stroke="var(--color-paper)"
          strokeOpacity="0.14"
          strokeWidth="0.8"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Lớp 3 — nội dung */}
      <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-20 pt-28 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div data-hero-title className="max-w-4xl will-change-transform">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-gold-dim">
            {eyebrow}
          </p>

          <h1 className="mt-6 text-balance font-display text-[length:var(--text-h1)] uppercase leading-[1.04] text-paper text-cinematic">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-6 max-w-2xl text-balance font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.18em] text-gold/90 sm:text-[0.8rem]">
              {subtitle}
            </p>
          ) : null}

          {nameEn ? (
            <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper-faint">
              {nameEn}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="border border-line-strong px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-mute">
              {period}
            </span>
            {status}
          </div>
        </div>
      </div>
    </section>
  );
}
