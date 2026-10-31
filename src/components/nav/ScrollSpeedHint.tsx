"use client";

import { useScrollSpeed } from "@/lib/scroll/useScrollSpeed";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CHỈ DẪN KHI CON LĂN ĐI QUÁ NHANH
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Tốc độ cuộn đã bị chặn ở `ScrollProvider` (xem `scrollBudget`), nên người
 * xem không còn bị "tua" nữa. Nhưng khi họ lăn một cú lớn, chênh lệch giữa
 * "tay tôi quay nhiều" và "trang chỉ đi một quãng" vẫn có thể đọc ra là trang
 * bị đơ. Câu này nói rõ: trang có chủ đích đi chậm để hình không rách — hiểu
 * là chủ ý thì không còn là lỗi.
 *
 * ── Vì sao nhãn này nằm cạnh chỉ dẫn cuộn ─────────────────────────────────
 *
 * Cùng một chỗ, cùng khuôn chữ, chỉ đổi nội dung: con lăn nhích → "Cuộn để đi
 * tiếp"; con lăn quay mạnh → "Từ từ thôi, để hình kịp hiện". Người xem không
 * phải đi tìm một thông báo ở chỗ khác.
 *
 * ── Vì sao KHÔNG dùng ARIA live ───────────────────────────────────────────
 *
 * Đây là phản hồi tức thời cho thao tác tay, không phải thông báo trạng thái.
 * Đọc lên mỗi lần con lăn quay nhanh sẽ biến trang thành một cái radio ồn.
 * `aria-hidden` để trình đọc màn hình bỏ qua hẳn.
 */
export function ScrollSpeedHint({ className }: { className?: string }) {
  const { fast } = useScrollSpeed();

  return (
    <span
      aria-hidden
      data-scroll-speed-hint
      className={cn(
        "font-mono text-[0.55rem] uppercase tracking-[0.24em] transition-colors duration-500 ease-cinematic",
        fast ? "text-gold" : "text-paper-faint",
        className,
      )}
    >
      {fast ? "Từ từ thôi · hình đang hiện" : "Cuộn để đi tiếp"}
    </span>
  );
}