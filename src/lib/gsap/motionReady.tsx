"use client";

import { createContext, useContext } from "react";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  CỜ "LAYOUT ĐÃ ỔN ĐỊNH"
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── Vì sao cần ────────────────────────────────────────────────────────────
 *
 * Đo thực tế trên trang chủ (1440×900):
 *
 *   t =  201 ms   document.scrollHeight =  1463 px
 *   t = 1110 ms   document.scrollHeight =  9733 px
 *   t = 1582 ms   document.scrollHeight = 10353 px   (ổn định)
 *
 * Trong lúc Next hydrate, cây DOM lớn dần: chiều cao tài liệu tăng từ
 * 1463px lên hơn 10000px. `ScrollTrigger` đo vị trí `start` bằng
 * `getBoundingClientRect()` NGAY LÚC ĐƯỢC TẠO, tức là lúc tài liệu còn
 * "gập".
 *
 * Với trigger `start: "top 82%"`, điều kiện kích hoạt là:
 *
 *     scroll >= elementTop - 0.82 * viewportHeight
 *
 * Khi tài liệu mới cao 1463px, MỌI phần tử nằm dưới ~738px đều cho ra
 * `start` ÂM — nghĩa là "đã vượt qua" ngay cả khi `scrollY = 0`. ScrollTrigger
 * liền chạy tween ngay, và vì trigger dùng `once: true`, nó **tự hủy vĩnh
 * viễn**. Đến khi bố cục ổn định thì vị trí đã đúng, nhưng không còn trigger
 * nào để kích hoạt.
 *
 * Hậu quả quan sát được: 44/47 hiệu ứng `Reveal` (94%) chạy xong trong 12
 * giây đầu, kể cả những cái nằm ở `docY = 9454`, trước khi người xem cuộn
 * tới đâu. Trang trông "tĩnh" hoàn toàn.
 *
 * ── Cách sửa ──────────────────────────────────────────────────────────────
 *
 * `Reveal` chỉ tạo ScrollTrigger khi cờ này bật. `ScrollProvider` bật cờ sau
 * khi: phông chữ đã sẵn sàng (`document.fonts.ready`) → trang đã vẽ xong
 * (`scrollHeight` ổn định qua 2 khung hình) → `ScrollTrigger.refresh()`.
 *
 * Không dùng `setTimeout` với thời lượng tùy ý: mọi tín hiệu ở đây đều là sự
 * kiện vòng đời thật, không phải "hy vọng đủ lâu".
 *
 * Trước khi cờ bật, `Reveal` KHÔNG render gì cả — nội dung hiện ở trạng thái
 * HTML gốc. Đây cũng là nguyên tắc đã có từ trước: nội dung lịch sử phải đọc
 * được kể cả khi JavaScript không chạy.
 */

const MotionReadyContext = createContext(false);

/** Cờ đã sẵn sàng cho ScrollTrigger đo vị trí. */
export const MotionReadyProvider = MotionReadyContext.Provider;

/**
 * `true` khi bố cục đã ổn định và ScrollTrigger đã được đo lại.
 *
 * Mọi thứ tạo ScrollTrigger đều phải hỏi cờ này trước.
 */
export function useMotionReady(): boolean {
  return useContext(MotionReadyContext);
}
