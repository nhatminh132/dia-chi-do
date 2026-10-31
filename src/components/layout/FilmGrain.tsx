/**
 * Lớp hạt phim phủ toàn trang.
 *
 * - `pointer-events: none` để không chặn tương tác.
 * - `aria-hidden` vì thuần trang trí.
 * - Overlay cố định, không cuộn theo → cảm giác phim quay, không phải web layer.
 * - CSS tự tắt animation khi `prefers-reduced-motion: reduce` (xem globals.css).
 */
export function FilmGrain({ intensity = 1 }: { intensity?: number }) {
  return (
    <div
      aria-hidden="true"
      data-illustrative="true"
      className="film-grain pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ opacity: intensity }}
    />
  );
}