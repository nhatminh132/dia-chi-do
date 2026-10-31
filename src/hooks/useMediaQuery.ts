"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Theo dõi media query bằng `useSyncExternalStore`.
 *
 * Vì sao KHÔNG dùng `useState` + `useEffect`:
 *   • Effect gọi setState đồng bộ tạo thêm một vòng render (rule
 *     `react-hooks/set-state-in-effect` của React Compiler chặn đúng việc này).
 *   • `useSyncExternalStore` xử lý SSR sẵn: `getServerSnapshot` trả về giá trị
 *     dùng cho HTML render trên server và cho bước hydrate, nên không có
 *     hydration mismatch dù media query có khớp hay không.
 *
 * Giá trị ban đầu trên server luôn là `false`; giá trị thật được đọc ngay
 * ở lần hydrate đầu tiên trên client.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Server chưa có window.matchMedia — coi như chưa khớp.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Người dùng có yêu cầu giảm chuyển động không.
 *
 * Đây là CỜ DUY NHẤT của toàn site. Mọi hook animation khác đều phải hỏi
 * cờ này và no-op nếu `true`. Không được rải `matchMedia` riêng ở component.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Đọc ĐỒNG BỘ cờ giảm chuyển động.
 *
 * Hook `usePrefersReducedMotion()` không dùng được trong effect, vì hook phải
 * được gọi ở thân component — mà effect chạy SAU khi render. Chỗ cần đọc cờ
 * ngay tại thời điểm effect chạy thì dùng hàm này.
 *
 * Vẫn giữ đúng một nơi đọc `matchMedia` trong toàn dự án — không rải
 * `matchMedia` rải rác ở component.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Thiết bị cảm ứng nhỏ — dùng để GIẢM bớt hiệu ứng, không phải để bỏ hết.
 * Ngưỡng 768px khớp điểm gãy Tailwind mặc định.
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Thiết bị cầm tay — điện thoại, máy tính bảng, hoặc cửa sổ hẹp.
 *
 * Gộp hai tín hiệu trong MỘT media query:
 *   • `max-width: 767px` — điện thoại dọc, và mọi cửa sổ hẹp trên desktop;
 *   • `pointer: coarse`  — điện thoại nằm ngang và máy tính bảng, nơi bề
 *     rộng vượt 767px nhưng người dùng vẫn chỉ có ngón tay.
 *
 * Dùng cho các tính năng chỉ có nghĩa với chuột (ví dụ tự động cuộn).
 */
export function useIsHandheld(): boolean {
  return useMediaQuery("(pointer: coarse), (max-width: 767px)");
}

/**
 * Đã hydrate hay chưa.
 *
 * Cần để render khác nhau trên server và client — ví dụ không mount Lenis
 * khi chưa biết người dùng có bật giảm chuyển động hay không.
 * `subscribe` rỗng vì trạng thái này chỉ đổi đúng một lần: từ hydrate.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}