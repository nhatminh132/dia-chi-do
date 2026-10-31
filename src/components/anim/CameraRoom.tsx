"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsap";
import { useMotionReady } from "@/lib/gsap/motionReady";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  MÁY QUAY ĐIỆN ẢNH — DOLLY IN + RACK FOCUS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Ảnh phim nói gì về "dolly in" ───────────────────────────────────────
 *
 * Khi máy quay đẩy vào một cảnh, có HAI chuyện xảy ra cùng lúc:
 *
 *   1. Mọi thứ trong khung hình TO RA — tiền cảnh phóng nhanh hơn hậu
 *      cảnh. Đó là thứ mắt ta đọc được là "camera đang tiến lại".
 *
 *   2. Những thứ ở xa DỊU LẠI — vì tiêu điểm chỉ có một chỗ. Đó là "rack
 *      focus": kéo tiêu điểm từ nền lên chủ thể.
 *
 * Trang web bình thường chỉ làm (1) bằng `transform: scale` cho cả trang —
 * nền và chữ cùng to ra, nên không có cảm giác chiều sâu. Ở đây ta làm
 * (1) và (2) một cách TÁCH BIỆT:
 *
 *   • MẶT PHẲNG NỀN  (`data-depth`)     — phóng to + hạ sáng khi lỗi tiêu điểm,
 *                                          trở lại đúng độ sáng khi vào tiêu điểm.
 *   • MẶT PHẲNG NỘI DUNG (`data-camera-plane`) — phóng to nhẹ, luôn sắc.
 *
 * Kết quả: nền bay về phía người xem và dịu đi, còn chữ vẫn nét như tiêu
 * điểm đang được kéo vào. Đó là chiều sâu, không phải phóng to.
 *
 * ── Vì sao KHÔNG dùng `filter: blur()` cho rack focus ────────────────────
 *
 * Đã thử và ĐO trên máy thật: blur chạy theo `scrub` buộc Chrome raster lại
 * toàn bộ subtree của mặt phẳng ở MỖI frame. Năm mặt phẳng rộng 1526–2028px,
 * mỗi cái lại chứa quầng sáng `blur(90px)/blur(130px)` ⇒ ~30fps, p95 133ms,
 * 6–9 frame rớt mỗi lần cuộn nhanh. Bỏ filter ⇒ 60fps ổn định
 * (p95 16.9ms, 0 frame rớt). Đo lặp 4 lần, đảo thứ tự, kết quả không đổi.
 *
 * Mà mắt không mất gì: các mặt phẳng này là gradient thuần, không có `<img>`
 * nào — blur chỉ làm nhoè một lớp vân 7% opacity. Độ sâu còn nguyên nhờ
 * scale + độ sáng. Các quầng sáng tĩnh `blur(90px)` giữ nguyên vì chúng chỉ
 * được raster một lần, không phải mỗi frame.
 *
 * ── Vì sao KHÔNG transform toàn bộ `<section>` ───────────────────────────
 *
 * Vì `transform` trên một phần tử tạo ra "containing block" mới cho mọi
 * `position: fixed` và `position: sticky` bên trong nó. Trang `/tu-lieu`,
 * `/nguon-tham-khao`, `/gioi-thieu` và `/ban-do` đều có phần tử `sticky`
 * (cột bộ lọc bám theo khi cuộn) — transform lên chúng sẽ làm cột bộ lọc
 * bị trượt lệch.
 *
 * Nên chỉ những mặt phẳng được đánh dấu TƯỜNG MINH bằng `data-depth` /
 * `data-camera-plane` mới được biến đổi. Mặt định: không đổi gì cả.
 */
export function CameraRoom({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useMotionReady();

  useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;

    const ctx = gsap.context(() => {
      /* ── Mặt phẳng nền: lùi xa + dịu sáng, rồi sáng lại khi vào tiêu điểm ── */
      const depthPlanes = el.querySelectorAll<HTMLElement>("[data-depth]");

      if (depthPlanes.length) {
        // Độ sáng đích đọc từ CSS (`opacity-70` của từng lớp) thay vì ghi
        // cứng — đổi thiết kế trong class là tween tự theo.
        const focusedOpacity = Array.from(depthPlanes, (plane) =>
          Number.parseFloat(getComputedStyle(plane).opacity),
        );

        gsap.fromTo(
          depthPlanes,
          {
            scale: 1.07,
            opacity: (i: number) => (focusedOpacity[i] || 1) * 0.55,
          },
          {
            scale: 1,
            opacity: (i: number) => focusedOpacity[i] || 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 22%",
              scrub: 0.65,
            },
          },
        );
      }

      /* ── Mặt phẳng nội dung: tiến lên nhẹ, luôn sắc nét ──────────────── */
      const contentPlanes = el.querySelectorAll<HTMLElement>("[data-camera-plane]");

      if (contentPlanes.length) {
        gsap.fromTo(
          contentPlanes,
          { scale: 0.972, y: 26 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 26%",
              scrub: 0.65,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
