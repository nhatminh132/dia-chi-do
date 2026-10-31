"use client";

import { useEffect, useRef, useState } from "react";
import {
  AUTO_SCROLL_SPEEDS,
  type AutoScrollSpeed,
} from "@/lib/scroll/scrollBudget";
import { useAutoScroll } from "@/lib/scroll/useAutoScroll";
import { useIsHandheld } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CAPSULE AUTO-SCROLL — phát/tạm dừng + bánh răng chọn tốc độ
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Vì sao thu thành capsule ──────────────────────────────────────────────
 *
 * Ở đáy trang đã có trình phát nhạc (trái), nút nổi (phải) và chat (phải).
 * Một cụm điều khiển giữa đáy phải nhỏ: hai nút tròn dính liền, cao 40px.
 *
 * ── Bánh răng mở ra ngay trong capsule ────────────────────────────────────
 *
 * Bấm bánh răng thì capsule **nở ngang** để chứa bốn mốc tốc độ (0,5× · 1× ·
 * 1,5× · 2×) chứ không bung một popover riêng. Nhờ vậy mọi thứ vẫn nằm trên
 * một đường ngang ở đáy màn hình, không che nội dung phía trên và không tạo
 * thêm một lớp nổi nữa. Mốc đang dùng tô vàng.
 *
 * ── Tự ẩn ─────────────────────────────────────────────────────────────────
 *
 * Ẩn sau 6 giây không có chuyển động chuột — trừ khi đang tự cuộn (cần nút
 * pause) hoặc đang mở bảng tốc độ (đang thao tác). Chỉ chạy trên thiết bị
 * có chuột: máy cầm tay không dựng capsule này (xem mục dưới).
 *
 * ── Chỉ tồn tại ở Part 01–02 ──────────────────────────────────────────────
 *
 * Chế độ tự cuộn phục vụ phần mở đầu của trang chủ. Từ đầu Part 03 trở đi
 * capsule ẩn hẳn (không chỉ mờ) và `start()` từ chối chạy — phần sau là nơi
 * đọc và tương tác, một nút "tự cuộn" ở đó chỉ gây nhầm lẫn.
 *
 * ── KHÔNG có ở bản mobile ─────────────────────────────────────────────────
 *
 * Máy cầm tay không có con lăn để "nhường lái": người xem đang cầm ngón tay
 * trên chính nội dung, nên một nút tự cuộn chỉ tranh chỗ ở đáy màn hình và
 * cướp quyền cuộn của họ. Trên thiết bị đó component trả về `null` — không
 * dựng nút, không gắn vòng rAF, không nghe sự kiện.
 *
 * `useIsHandheld()` (bề rộng < 768px HOẶC `pointer: coarse`) quyết định điều
 * này. HTML máy chủ vẫn có capsule (server không biết bề rộng), nên lớp
 * ngoài cùng còn mang `max-md:hidden pointer-coarse:hidden` để nút không
 * kịp lóe lên trước lúc hydrate.
 */
export function AutoScrollControl() {
  const handheld = useIsHandheld();
  if (handheld) return null;
  return <AutoScrollCapsule />;
}

function AutoScrollCapsule() {
  const { active, toggle, speed, setSpeed, inZone } = useAutoScroll();
  const [open, setOpen] = useState(false);
  /* Ngoài vùng auto-scroll thì ẩn hẳn, kể cả khi đang chạy: `useAutoScroll`
     đã tự dừng ở mốc cảnh 03 nên không có phiên nào bị bỏ quên. */
  const hidden = useIdleFade(active || open) || !inZone;

  const rootRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLButtonElement>(null);

  /* Đóng bảng tốc độ khi bấm ra ngoài hoặc Escape. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      gearRef.current?.focus();
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 flex justify-end pb-3 pr-[4.25rem] sm:justify-center sm:pb-4 sm:pr-0",
        /* Chưa hydrate xong thì server đã render sẵn capsule; hai lớp này ẩn
           nó ngay trên máy cầm tay, trước cả khi `AutoScrollControl` kịp trả
           về `null`. */
        "max-md:hidden pointer-coarse:hidden",
        "bottom-0",
      )}
    >
      <div
        ref={rootRef}
        data-autoscroll-ui
        className={cn(
          "flex items-center gap-0.5 rounded-full border p-0.5",
          "bg-ink-950/88 backdrop-blur-xl",
          "transition-[opacity,border-color,transform,visibility] duration-500 ease-cinematic",
          hidden
            ? "pointer-events-none translate-y-1 opacity-0"
            : "pointer-events-auto opacity-90 hover:opacity-100",
          /* Ra khỏi Part 01–02 thì biến mất thật (không chỉ mờ). */
          !inZone && "invisible",
          active ? "border-flag-red/80" : "border-line-strong",
        )}
        style={{ boxShadow: "0 14px 40px -16px rgba(0,0,0,0.9)" }}
      >
        {/* ── Phát / tạm dừng ─────────────────────────────────────────── */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={active}
          aria-label={active ? "Tạm dừng tự động cuộn" : "Tự động cuộn trang"}
          title={active ? "Tạm dừng tự động cuộn" : "Tự động cuộn"}
          data-auto-scroll
          className={cn(
            "relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300",
            "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold",
            "active:scale-95",
            active
              ? "text-gold"
              : "text-paper-faint hover:text-gold",
          )}
        >
          {active ? <PauseIcon /> : <PlayIcon />}

          {active ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-flag-red/40"
              style={{ animationDuration: "2.4s" }}
            />
          ) : null}
        </button>

        {/* ── Bảng tốc độ — nở ngang ngay trong capsule ───────────────── */}
        <div
          id="autoscroll-speed-options"
          inert={!open}
          aria-hidden={!open}
          className={cn(
            "flex items-center overflow-hidden transition-[max-width,opacity] duration-500 ease-cinematic",
            "will-change-[max-width,opacity]",
            open ? "max-w-56 opacity-100" : "max-w-0 opacity-0",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "mx-1 h-5 w-px shrink-0 bg-line transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: open ? "120ms" : "0ms" }}
          />

          <div role="group" aria-label="Tốc độ tự động cuộn" className="flex items-center gap-0.5 pr-1">
            {AUTO_SCROLL_SPEEDS.map((value, i) => {
              const selected = value === speed;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSpeed(value)}
                  aria-pressed={selected}
                  title={`Tốc độ ${speedLabel(value)}`}
                  style={{ transitionDelay: open ? `${140 + i * 45}ms` : "0ms" }}
                  className={cn(
                    "grid h-8 min-w-9 shrink-0 place-items-center rounded-full px-2",
                    "font-mono text-[0.58rem] tabular-nums tracking-[0.06em]",
                    "transition-[color,background-color,opacity,transform] duration-500 ease-cinematic",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold",
                    open ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0",
                    selected
                      ? "bg-gold text-ink-950"
                      : "text-paper-faint hover:bg-ink-800 hover:text-gold",
                  )}
                >
                  {speedLabel(value)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Bánh răng ───────────────────────────────────────────────── */}
        <button
          ref={gearRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="autoscroll-speed-options"
          aria-label="Tốc độ tự động cuộn"
          title={`Tốc độ tự động cuộn: ${speedLabel(speed)}`}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300",
            "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold",
            "active:scale-95",
            open ? "text-gold" : "text-paper-faint hover:text-gold",
          )}
        >
          <span
            className={cn(
              "transition-transform duration-500 ease-cinematic",
              open && "rotate-90",
            )}
          >
            <GearIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const SPEED_LABEL: Record<AutoScrollSpeed, string> = {
  0.5: "0,5×",
  1: "1×",
  1.5: "1,5×",
  2: "2×",
};

function speedLabel(speed: AutoScrollSpeed): string {
  return SPEED_LABEL[speed];
}

/**
 * Ẩn capsule sau `IDLE_MS` không có chuyển động chuột.
 *
 * Nghe trên `window` ở pha capture và `passive` — đây chỉ là một cờ hiển thị,
 * không được phép làm chậm bất kỳ thao tác nào khác của trang.
 */
const IDLE_MS = 6000;

function useIdleFade(forceVisible: boolean) {
  const [hidden, setHidden] = useState(false);

  const idle = useRef(0);

  useEffect(() => {
    const arm = () => {
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => setHidden(true), IDLE_MS);
    };

    const wake = () => {
      setHidden(false);
      arm();
    };

    const reveal = () => setHidden(false);

    arm();

    window.addEventListener("pointermove", wake, { capture: true, passive: true });
    window.addEventListener("pointerdown", wake, { capture: true, passive: true });
    window.addEventListener("keydown", reveal, { capture: true, passive: true });

    return () => {
      window.clearTimeout(idle.current);
      window.removeEventListener("pointermove", wake, { capture: true });
      window.removeEventListener("pointerdown", wake, { capture: true });
      window.removeEventListener("keydown", reveal, { capture: true });
    };
  }, []);

  return forceVisible ? false : hidden;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]" fill="none">
      <path
        d="M8 5.4v13.2L19 12 8 5.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]" fill="none">
      <path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[17px]" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
