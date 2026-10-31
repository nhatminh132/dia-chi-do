"use client";

import { createContext, useContext } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CẦU NỐI CUỘN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Một điểm duy nhất để component ở ngoài `ScrollProvider` (nút auto-scroll,
 * chỉ dẫn cuộn…) nhờ trang cuộn đi, mà vẫn đi ĐÚNG ĐƯỜNG của Lenis.
 *
 * Vì sao không gọi thẳng `window.scrollTo` hay `lenis.scrollTo` ở nơi dùng:
 *
 *   • `window.scrollTo` nhảy native. Lenis đang giữ quyền cuộn, nên nó sẽ
 *     kéo vị trí về lại target cũ ở khung hình kế tiếp — nút bấm "không ăn".
 *   • Lấy instance Lenis bằng `window` hay module singleton thì phải đồng bộ
 *     vòng đời bằng tay (create/destroy, StrictMode remount hai lần). Context
 *     đã có sẵn provider lo việc đó.
 *
 * `null` = chưa có Lenis (SSR, hoặc thiết bị không dùng cuộn mượt). Khi đó
 * nơi gọi tự rơi về `window.scrollBy`/`scrollTo` — xem `useScrollBridge`.
 */

export type ScrollToOptions = {
  /** Thời lượng (giây). Bỏ trống để dùng quán tính mặc định của Lenis. */
  duration?: number;
  /** Khoá cuộn trong lúc chạy (Lenis `lock`). */
  lock?: boolean;
};

export type ScrollApi = {
  /** Trang cuộn mượt tới vị trí `target` (px). */
  scrollTo: (target: number, options?: ScrollToOptions) => void;
  /** Dừng mọi chuyển động cuộn đang chạy, giữ nguyên vị trí hiện tại. */
  stop: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export const ScrollApiProvider = ScrollContext.Provider;

/** `null` khi chưa có Lenis — nơi gọi phải có nhánh dự phòng native. */
export function useScrollApi(): ScrollApi | null {
  return useContext(ScrollContext);
}