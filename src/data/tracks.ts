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
 *       id: "deep-cinematic",
 *       title: "Deep Cinematic Emotional Ambient",
 *       artist: "RomanSenykMusic",
 *       src: "/audio/deep-cinematic-emotional-ambient.mp3",
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
 * - File WAV/AIFF có dung lượng lớn hơn MP3/OGG nhiều lần. Bản đang dùng là
 *   MP3 ~5,5 MB; file WAV 24 giây sinh tại chỗ (`ambient-hall.wav`, ~1 MB)
 *   vẫn còn trong `/public/audio` nhưng KHÔNG nằm trong danh sách phát nữa.
 * - Tên tệp gốc: `romansenykmusic-deep-cinematic-emotional-ambient-125957.mp3`.
 *   Tên tác giả dưới đây lấy từ chính tên tệp đó, CHƯA đối chiếu giấy phép —
 *   cần xác minh trước khi xuất bản (xem HANDOFF).
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
    id: "deep-cinematic",
    title: "Deep Cinematic Emotional Ambient",
    artist: "RomanSenykMusic",
    src: "/audio/deep-cinematic-emotional-ambient.mp3",
    kind: "local",
  },
];
