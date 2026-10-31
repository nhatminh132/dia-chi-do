"use client";

import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useMotionEnabled } from "./motionPreference";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  CỔNG CHUYỂN ĐỘNG CỦA LỚP CINEMATIC
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  ── Vì sao có CỔNG RIÊNG, không dùng `useMotionEnabled()` ────────────────
 *
 *  `useMotionEnabled()` là cờ của DỰ ÁN: nó cố ý BẬT chuyển động kể cả khi
 *  hệ điều hành bật "giảm chuyển động" (xem `motionPreference.tsx` — quyết
 *  định có chủ đích của chủ dự án, không phải sơ suất).
 *
 *  Nhưng lớp cinematic V2 có những hiệu ứng mà cờ đó chưa từng kiểm soát:
 *  video nền tự phát, ghim trang, scrub, vệt mực loang, cam dài. Với người
 *  dùng bật giảm chuyển động ở cấp hệ điều hành, những hiệu ứng đó phải
 *  TẮT — đó là yêu cầu khả năng tiếp cận, không phải sở thích.
 *
 *  Nên ta tách hai tầng:
 *
 *      useMotionEnabled()   → cờ của dự án (toàn site, giữ nguyên)
 *      useSceneMotion()     → cổng của lớp cinematic (thêm tôn trọng OS)
 *
 *  `useSceneMotion()` = dự án cho phép VÀ hệ điều hành không yêu cầu giảm
 *  chuyển động. Cổng này CHỈ dùng trong các component của lớp cinematic mới.
 *  Không đụng vào hành vi của phần còn lại của website.
 *
 *  ── Hệ quả ──────────────────────────────────────────────────────────────
 *
 *  Khi `useSceneMotion()` trả về `false`:
 *   • không video tự phát (chỉ hiện poster hoặc lớp nền tĩnh),
 *   • không ghim, không scrub, không parallax mới,
 *   • mọi nội dung vẫn hiện đầy đủ — vì hiệu ứng luôn dùng `gsap.fromTo`
 *     trên nội dung vốn đã có sẵn trong HTML, không dùng `opacity: 0` tĩnh.
 */
export function useSceneMotion(): boolean {
  const projectMotion = useMotionEnabled();
  const systemReducedMotion = usePrefersReducedMotion();

  return projectMotion && !systemReducedMotion;
}
