/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  DANH SÁCH NHẠC NỀN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Cách thêm bản nhạc của bạn ───────────────────────────────────────────
 *
 * Bạn chỉ cần thêm một mục vào mảng `TRACKS` bên dưới. Player ở góc dưới
 * bên phải sẽ tự nhận — không cần sửa component nào.
 *
 *   src (bắt buộc)  Đường dẫn tới file âm thanh. Có hai dạng:
 *                    • file trong dự án:  "/audio/ten-file.mp3"
 *                    • link ngoài (URL):  "https://...mp3"
 *   title  (bắt buộc) Tên bản nhạc, hiển thị trên player.
 *   artist (tuỳ chọn) Tên tác giả / nguồn.
 *   kind   (tuỳ chọn) "local" (mặc định) hoặc "remote" cho link ngoài.
 *
 *   Ví dụ:
 *
 *   export const TRACKS: Track[] = [
 *     {
 *       id: "ambient-hall",
 *       title: "Hành lang trưng bày",
 *       artist: "Không gian âm thanh",
 *       src: "/audio/ambient-hall.wav",
 *     },
 *     {
 *       id: "buoi-tang",
 *       title: "Buổi tối ở phố Lê Lợi",
 *       artist: "Nhạc nền của bạn",
 *       src: "https://example.com/audio/buoi-toi.mp3",
 *       kind: "remote",
 *     },
 *   ];
 *
 * ── Ghi chú kỹ thuật ─────────────────────────────────────────────────────
 *
 * - File WAV/AIFF có dung lượng lớn hơn MP3/OGG nhiều lần. Bản nền mặc định
 *   ở đây là WAV 24 giây lặp liên tục (~1 MB) vì nó được sinh tại chỗ, không
 *   phải tải về. Khi bạn thay bằng nhạc thật, hãy dùng MP3 128–192 kbps để
 *   trang vẫn nhẹ.
 * - Player tự dừng khi người xem điều hướng sang phòng khác? Không — nhạc
 *   nền nên chạy liên tục qua các phòng, giống nhạc nền thật của một bảo
 *   tàng. Nó sẽ dừng khi bạn đóng tab.
 */

export interface Track {
  /** Khóa ổn định — dùng cho `key` và định danh. */
  id: string;
  /** Tên bản nhạc. */
  title: string;
  /** Tên tác giả / nguồn phát. */
  artist?: string;
  /** Đường dẫn tới file âm thanh. */
  src: string;
  /** "local" = file trong `/public`, "remote" = URL bên ngoài. */
  kind?: "local" | "remote";
}

export const TRACKS: Track[] = [
  {
    id: "ambient-hall",
    title: "Hành lang trưng bày",
    artist: "Không gian âm thanh",
    src: "/audio/ambient-hall.wav",
    kind: "local",
  },
];
