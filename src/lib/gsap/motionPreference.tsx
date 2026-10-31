"use client";

import { createContext, useContext } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CỜ CHUYỂN ĐỘNG CỦA DỰ ÁN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Quyết định ────────────────────────────────────────────────────────────
 *
 * Hiệu ứng chuyển động **BẬT MẶC ĐỊNH**, và cố ý KHÔNG bị tắt bởi cài
 * đặt "giảm chuyển động" (`prefers-reduced-motion`) của hệ điều hành.
 *
 * Lý do: đã có lần website tĩnh lặng hoàn toàn vì máy người dùng bật
 * `prefers-reduced-motion` trong khi không có cách nào biết vì sao — trang
 * chết lặng trông giống hỏng. Chủ dự án quyết định ưu tiên trải nghiệm
 * hơn là im lặng tuân theo cài đặt hệ thống.
 *
 * ── Nếu sau này muốn quay lại tôn trọng cài đặt hệ thống ───────────────────
 *
 * Chỉ cần sửa MỘT chỗ, ở cuối file này:
 *
 *     export function useMotionEnabled(): boolean {
 *       return !usePrefersReducedMotion();     // ← thay cho `return true`
 *     }
 *
 * Mọi component đã hỏi đúng cờ này (`Reveal`, `ParallaxBackdrop`,
 * `ProfileHero`, `Hero`, `TimelineSection`, `ScrollProvider`…), nên không
 * cần sửa gì thêm ở đâu cả.
 *
 * ── Vì sao vẫn giữ lớp context ───────────────────────────────────────────
 *
 * Vì nó là MỘT câu hỏi duy nhất cho toàn site: "được phép chuyển động
 * không?". Giữ một điểm quyết định duy nhất thì không bao giờ xảy ra
 * tình trạng một component chạy hiệu ứng còn component khác không — vốn
 * là nguồn gốc của những lỗi rất khó tìm.
 */

interface MotionContextValue {
  /** Hiệu ứng có được phép chạy không — cờ mà toàn site hỏi. */
  enabled: boolean;
}

const MotionContext = createContext<MotionContextValue>({ enabled: true });

export function MotionPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionContext.Provider value={{ enabled: true }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPreference(): MotionContextValue {
  return useContext(MotionContext);
}

/**
 * Cờ "được phép chạy hiệu ứng" — thay cho `usePrefersReducedMotion()` ở mọi
 * nơi đang quyết định có tạo ScrollTrigger hay không.
 *
 * Lưu ý tên: đây KHÔNG phải "OS có bảo lưu giảm chuyển động hay không", mà
 * là "dự án này có được phép chuyển động không".
 */
export function useMotionEnabled(): boolean {
  return useContext(MotionContext).enabled;
}
