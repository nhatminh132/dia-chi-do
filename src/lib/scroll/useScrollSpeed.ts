"use client";

import { useEffect, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THEO DÕI TỐC ĐỘ CUỘN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Đọc lại tốc độ thật của trang (px/giây) để chỉ dẫn "con lăn nhanh quá" chỉ
 * hiện khi đúng lúc cần: người xem vừa lăn một cú vượt trần, hoặc đang cầm
 * con lăn liên tục.
 *
 * ── Mẫu số ────────────────────────────────────────────────────────────────
 *
 * Tốc độ phải đo bằng một khoảng thời gian, không phải bằng một khung hình:
 * khung hình nhanh/chậm làm cùng một quãng đường ra số rất khác nhau. Nên cứ
 * mỗi 120ms lấy vị trí một lần, và tốc độ = quãng đi được / thời gian trôi.
 *
 * ── Vì sao đo bằng `scroll` chứ không đọc `lenis.velocity` ───────────────
 *
 * `scroll` là sự thật cuối cùng: nó phản ánh cả cuộn mượt của Lenis, cả cuộn
 * native (khi Lenis tắt), cả phím PageDown. Hỏi Lenis thì phải có Lenis, và
 * trên thiết bị không dùng cuộn mượt lại không có số nào.
 */

/** Khoảng lấy mẫu (ms). 120ms ≈ 7 khung hình — đủ dài để hết nhiễu, đủ ngắn để bắt cú flick. */
const SAMPLE_MS = 120;

/** Rung tối thiểu để coi là "đang cuộn" (px/s) — lọc chuyện thanh cuộn nhích 1px. */
const MIN_SPEED = 60;

export function useScrollSpeed(): { speed: number; fast: boolean } {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;

    const sample = () => {
      raf = 0;

      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT;

      if (dt < SAMPLE_MS) {
        raf = requestAnimationFrame(sample);
        return;
      }

      const raw = Math.abs(y - lastY) / (dt / 1000);
      lastY = y;
      lastT = now;

      // Chỉ setState khi con số đổi đủ để mắt đọc ra — tránh một vòng render
      // cho mỗi mẫu 120ms trong suốt lúc người xem đang cuộn.
      setSpeed((prev) => (Math.abs(prev - raw) < 1 ? prev : raw));

      raf = requestAnimationFrame(sample);
    };

    // Vòng đo chỉ sống trong lúc trang đang có `scroll`; im lặng thì dừng,
    // không giữ một rAF mồ côi chạy suốt phiên.
    const onScroll = () => {
      if (!raf) {
        lastY = window.scrollY;
        lastT = performance.now();
        raf = requestAnimationFrame(sample);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { speed, fast: speed >= MIN_SPEED };
}