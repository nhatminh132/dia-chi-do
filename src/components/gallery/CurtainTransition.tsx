"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsap";
import { useGallery } from "./GalleryProvider";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  RÈM CHUYỂN PHÒNG — "CỬA PHÒNG" ĐÓNG LẠI RỒI MỞ RA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Khi người xem đi từ phòng này sang phòng khác, màn hình phải có một khoảng
 * lặng. Không phải để làm chậm lại, mà vì trong phim, giữa hai cảnh luôn có
 * một khoảng tối — đó là lúc bộ phim đổi cuộn, và lúc người xem thở.
 *
 * Ở đây khoảng lặng đó là HAI TẤM RÈM khép lại từ hai phía, giữa chừng có
 * một sợi đỏ và tên phòng đang đi tới. Người xem luôn biết mình sắp vào
 * phòng nào trước khi thấy nó.
 *
 * ── Nhịp ────────────────────────────────────────────────────────────────
 *
 *   closing  rèm khép (0.62s) → sợi đỏ nở ra → tên phòng hiện
 *            → báo "đã che kín" → provider đổi route
 *   opening  tên phòng mờ đi → rèm mở (0.8s) → trở về idle
 *
 * Rèm MỞ chậm hơn rèm KHÉP một chút. Lý do: người xem vừa bị "cắt" khỏi cảnh
 * cũ, cần thêm một nhịp để nhận ra mình đang ở đâu. Mở nhanh sẽ tạo cảm
 * giác bị ném vào trang mới.
 */
export function CurtainTransition() {
  const { phase, target, markCovered, completeTravel } = useGallery();

  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const panels = el.querySelectorAll<HTMLElement>("[data-panel]");
    const line = el.querySelector<HTMLElement>("[data-line]");
    const card = el.querySelector<HTMLElement>("[data-card]");
    const ghost = el.querySelector<HTMLElement>("[data-ghost]");
    const rule = el.querySelector<HTMLElement>("[data-rule]");
    const frame = el.querySelector<HTMLElement>("[data-frame]");
    const meta = el.querySelector<HTMLElement>("[data-meta]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dọn timeline cũ trước khi dựng cái mới — nếu người xem bấm phòng khác
    // giữa lúc rèm đang khép, phải có một cái duy nhất đang chạy.
    timeline.current?.kill();

    if (phase === "closing") {
      const tl = gsap.timeline({
        onComplete: () => markCovered(),
      });

      if (reduceMotion) {
        tl.to(panels, { xPercent: 0, duration: 0.15, ease: "none" }, 0).set(
          [line, card, ghost, rule, frame, meta],
          { opacity: 0 },
          0,
        );
      } else {
        tl.fromTo(
          panels,
          { xPercent: (i: number) => (i === 0 ? -100 : 100) },
          { xPercent: 0, duration: 0.68, ease: "power4.inOut" },
          0,
        )
          .fromTo(
            line,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.55, ease: "expo.out" },
            0.12,
          )
          .fromTo(
            rule,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.44, ease: "expo.out" },
            0.3,
          )
          .fromTo(
            card,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
            0.24,
          )
          .fromTo(
            ghost,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.72, ease: "expo.out" },
            0.22,
          )
          .fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.36)
          .fromTo(
            meta,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            0.42,
          );
      }

      timeline.current = tl;
      return () => {
        tl.kill();
      };
    }

    if (phase === "opening") {
      const tl = gsap.timeline({ onComplete: () => completeTravel() });

      if (reduceMotion) {
        tl.set([line, card, ghost, rule, frame, meta], { opacity: 0 }, 0).to(
          panels,
          {
            xPercent: (i: number) => (i === 0 ? -100 : 100),
            duration: 0.15,
            ease: "none",
          },
          0,
        );
      } else {
        tl.to(card, { opacity: 0, y: -24, duration: 0.28, ease: "power2.in" }, 0)
          .to(ghost, { opacity: 0, scale: 1.04, duration: 0.36, ease: "power2.in" }, 0)
          .to([frame, meta], { opacity: 0, duration: 0.3, ease: "power2.in" }, 0)
          .to(rule, { scaleX: 0, opacity: 0, duration: 0.3, ease: "power2.in" }, 0.12)
          .to(line, { scaleX: 0, opacity: 0, duration: 0.4, ease: "power2.in" }, 0.16)
          .to(
            panels,
            {
              xPercent: (i: number) => (i === 0 ? -100 : 100),
              duration: 0.85,
              ease: "power4.inOut",
            },
            0.24,
          );
      }

      timeline.current = tl;
      return () => {
        tl.kill();
      };
    }

    // idle — đảm bảo mọi thứ về đúng trạng thái nghỉ.
    gsap.set(panels, { xPercent: (i: number) => (i === 0 ? -100 : 100) });
    gsap.set(line, { scaleX: 0, opacity: 0 });
    gsap.set(card, { opacity: 0, y: 0 });
    gsap.set(ghost, { opacity: 0, scale: 1 });
    gsap.set(rule, { scaleX: 0, opacity: 0 });
    gsap.set(frame, { opacity: 0 });
    gsap.set(meta, { opacity: 0, y: 0 });
    return undefined;
  }, [phase, markCovered, completeTravel]);

  const active = phase !== "idle";

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-illustrative="true"
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {/* Hai tấm rèm. `will-change: transform` để chúng không nháy khi
          bắt đầu chuyển động. Gradient nhẹ giữ cảm giác "tường phòng" thay
          vì hai khối đen phẳng. */}
      <div
        data-panel
        className="absolute inset-y-0 left-0 w-1/2 will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, #050505 0%, #070606 74%, #100d0c 100%)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06)",
        }}
      />
      <div
        data-panel
        className="absolute inset-y-0 right-0 w-1/2 will-change-transform"
        style={{
          background:
            "linear-gradient(270deg, #050505 0%, #070606 74%, #100d0c 100%)",
          boxShadow: "inset 1px 0 0 rgba(255,255,255,0.06)",
        }}
      />

      {/* Khung ngắm kiểu tư liệu — bốn góc mảnh, chỉ hiện khi rèm đã khép. */}
      <div
        data-frame
        aria-hidden
        className="pointer-events-none absolute inset-4 opacity-0 sm:inset-7"
      >
        <span className="absolute left-0 top-0 size-6 border-l border-t border-paper/20" />
        <span className="absolute right-0 top-0 size-6 border-r border-t border-paper/20" />
        <span className="absolute bottom-0 left-0 size-6 border-b border-l border-paper/20" />
        <span className="absolute bottom-0 right-0 size-6 border-b border-r border-paper/20" />
      </div>

      {/* Sợi đỏ ở đường may giữa rèm. */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          data-line
          className="h-px w-[min(78vw,56rem)] origin-center bg-flag-red opacity-0"
          style={{ boxShadow: "0 0 24px 2px rgba(200,16,46,0.45)" }}
        />
      </div>

      {/* Bảng tên phòng đang đi tới. */}
      <div className="absolute inset-0 grid place-items-center px-6">
        <div data-card className="relative flex max-w-xl flex-col items-center opacity-0">
          <span
            data-ghost
            aria-hidden
            className="pointer-events-none absolute -top-14 select-none font-display text-[9rem] leading-none text-paper/[0.05] opacity-0 sm:text-[13rem]"
          >
            {target?.number ?? "—"}
          </span>

          <span className="relative font-mono text-[0.62rem] uppercase tracking-[0.42em] text-flag-bright">
            {target ? `Đang đi tới · Phòng ${target.number}` : "Đang đi tới"}
          </span>

          <span
            data-rule
            aria-hidden
            className="mt-3 h-px w-14 origin-left bg-flag-red opacity-0"
          />

          <h2 className="relative mt-4 text-center font-display text-[length:var(--text-h2)] uppercase leading-[1.08] text-paper">
            {target?.name ?? ""}
          </h2>

          {target ? (
            <p className="relative mt-3 max-w-sm text-center font-mono text-[0.66rem] uppercase tracking-[0.22em] text-paper-faint">
              {target.nameEn}
            </p>
          ) : null}
        </div>
      </div>

      {/* Nhãn biên tập ở hai mép dưới — tăng cảm giác "đang đi trong bảo tàng". */}
      <div
        data-meta
        className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-paper-faint opacity-0 sm:inset-x-7 sm:bottom-7"
      >
        <span>Địa Chỉ Đỏ · Bảo tàng số</span>
        <span className="text-right">
          {target ? `Phòng ${target.number}` : ""}
        </span>
      </div>
    </div>
  );
}
