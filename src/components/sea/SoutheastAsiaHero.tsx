"use client";

import { useLayoutEffect, useRef } from "react";
import { CinematicPlate } from "@/components/media/CinematicPlate";
import { Button } from "@/components/ui/Button";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";
import { EASE, gsap, STAGGER } from "@/lib/gsap/gsap";
import { COUNTRIES } from "@/lib/southeast-asia";

const COUNTRY_LINE = `${COUNTRIES.length} hồ sơ quốc gia · ${COUNTRIES.map((country) => country.name).join(" · ")}`;

/**
 * HERO — `/dong-nam-a`
 *
 * Bố cục nhiều lớp:
 *   1. Nền khí quyển (CinematicPlate) — trôi chậm theo cuộn.
 *   2. Mạch hành trình khu vực (SVG) — lớp trang trí, đứng yên.
 *   3. Chữ tiêu đề + phụ đề — trôi nhanh hơn nền, tạo chiều sâu.
 *
 * Mọi chuy�� động dùng `from`/`fromTo` xuất phát từ trạng thái đã hiển thị,
 * nên khi không có JavaScript hoặc bật giảm chuyển động thì nội dung vẫn đọc
 * được nguyên vẹn. Đúng nguyên tắc đã dùng ở hero trang chủ.
 */
export function SoutheastAsiaHero() {
  const rootRef = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled) return;

    const ctx = gsap.context(() => {
      // ── Giới thiệu: chạy một lần, ngắn, không chặn nội dung ──
      gsap
        .timeline({ defaults: { ease: EASE.cinematic } })
        .fromTo(
          "[data-sea-plate]",
          { opacity: 0, scale: 1.14 },
          { opacity: 1, scale: 1, duration: 1.9, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-sea-arc]",
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 1.6 },
          0.3,
        )
        .fromTo(
          "[data-sea-eyebrow]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.35,
        )
        .fromTo(
          "[data-sea-line]",
          { yPercent: 112, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: STAGGER.loose },
          0.5,
        )
        .fromTo(
          "[data-sea-sub]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.85 },
          1,
        )
        .fromTo(
          "[data-sea-body]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.85 },
          1.15,
        )
        .fromTo(
          "[data-sea-actions] > *",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: STAGGER.tight },
          1.35,
        );

      // ── Scrub: máy quay lùi nhẹ ──
      gsap.to("[data-sea-plate]", {
        yPercent: 12,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to("[data-sea-arc]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to("[data-sea-copy]", {
        yPercent: -14,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, [motionEnabled]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="sea-hero-title"
      className="relative isolate flex min-h-[92vh] items-end overflow-hidden border-t border-line bg-ink pt-24 sm:pt-28"
    >
      {/* 1 · Nền khí quyểm — trôi chậm nhất */}
      <div data-sea-plate className="absolute inset-0 -z-10">
        <CinematicPlate variant="abyss" density={0.5} />
      </div>

      {/* 2 · Mạch hành trình — hình học trừu tượng, KHÔNG phải bản đồ địa lý */}
      <div
        data-illustrative="true"
        aria-hidden="true"
        data-sea-arc
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      >
        <svg
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
        >
          <defs>
            <linearGradient id="seaArc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C8102E" stopOpacity="0" />
              <stop offset="45%" stopColor="#C8102E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Các vòng cung lệch pha — gợi chuyển động, không mang thông tin địa lý */}
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M ${-100 + i * 90} ${620 - i * 40} Q ${420 + i * 60} ${120 + i * 70} ${1300 - i * 70} ${-60 + i * 55}`}
              fill="none"
              stroke="url(#seaArc)"
              strokeWidth={i === 1 ? 1.6 : 0.9}
              opacity={0.5 - i * 0.09}
            />
          ))}

          {/* Bốn nút theo nhịp chéo — vị trí thuần trang trí */}
          {[
            { x: 190, y: 470 },
            { x: 430, y: 380 },
            { x: 690, y: 300 },
            { x: 950, y: 215 },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="26" fill="none" stroke="#F2EBDD" strokeOpacity="0.16" />
              <circle cx={p.x} cy={p.y} r="6" fill={i === 0 ? "#C8102E" : "#F2EBDD"} fillOpacity={i === 0 ? 1 : 0.42} />
            </g>
          ))}
        </svg>
      </div>

      {/* 3 · Chữ — trôi nhanh nhất */}
      <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28 xl:px-16">
        <div data-sea-copy className="max-w-5xl">
          <p
            data-sea-eyebrow
            className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-gold-dim"
          >
            Southeast Asia · 03
          </p>

          <h1
            id="sea-hero-title"
            className="mt-6 font-display uppercase leading-[1.02] text-paper"
          >
            {[
              "Những con đường",
              "khác nhau, một",
              "khát vọng chung",
            ].map((line) => (
              <span key={line} className="block overflow-hidden">
                <span
                  data-sea-line
                  className="block text-[clamp(2rem,7.4vw,5.6rem)]"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-sea-sub
            className="mt-8 max-w-2xl font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.2em] text-paper-mute sm:text-[0.82rem]"
          >
            {COUNTRY_LINE}
          </p>

          <p
            data-sea-body
            className="mt-7 max-w-[62ch] text-pretty text-[0.98rem] leading-[1.85] text-paper-mute sm:text-[1.05rem]"
          >
            Trong thế kỷ XX, nhiều dân tộc Đông Nam Á đã đấu tranh chống ách
            thống trị thuộc địa, giành quyền tự quyết và xây dựng quốc gia độc
            lập. Mỗi quốc gia có hoàn cảnh lịch sử, lực lượng tham gia và con
            đường đấu tranh riêng.
          </p>

          <div data-sea-actions className="mt-10 flex flex-wrap gap-3">
            <Button href="#quoc-gia" size="lg">
              Bắt đầu từ hồ sơ quốc gia
            </Button>
            <Button href="/dong-thoi-gian" variant="outline" size="lg">
              Xem dòng thời gian Sài Gòn
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}