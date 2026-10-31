# TƯ LIỆU VIDEO CỦA BẢY CẢNH (History Web V2)

Thư mục này là **điểm đặt tệp** cho bảy clip khí quyển của trang chủ.

Hiện tại **cả bảy clip đều chưa có** — xem `src/data/scenes.ts`. Trang chủ
chạy hoàn chỉnh với lớp nền tĩnh (CSS/SVG) cho tới khi tệp được đặt vào.

## Danh sách tệp cần đặt vào đây

| Tên tệp đề xuất      | Cảnh                          | Thời lượng đích | Nội dung dự kiến |
|-----------------------|-------------------------------|----------------:|------------------|
| `scene-01-flag.mp4`        | `scene-01-flag`           |  6 giây | Lá cờ Việt Nam vải đỏ, ngôi sao vàng ở chính giữa, mở đầu cảnh. |
| `scene-02-city.mp4`        | `scene-02-city`           |  8 giây | Không khí đô thị Sài Gòn, máy quay tiến chậm. |
| `scene-03-archive.mp4`     | `scene-03-archive`        |  6 giây | Bàn lưu trữ tối, một luồng sáng kiểm soát, bụi lơ lửng. |
| `scene-04-resistance.mp4`  | `scene-04-resistance`     |  8 giây | **DỰNG LẠI** xưởng in ấn thời chiến. Không có chữ đọc được. |
| `scene-05-map-transition.mp4` | `scene-05-map-transition` |  4 giây | Clip chuyển tiếp ngắn: mực đỏ lan trên bản đồ. |
| `scene-06-southeast-asia.mp4` | `scene-06-southeast-asia` |  6 giây | Máy quay lùi ra Đông Nam Á, điểm sáng khu vực. |
| `scene-07-finale.mp4`      | `scene-07-finale`         |  6 giây | Không gian trưng bày bảo tàng, từng luồng sáng chiếu riêng. |

**Tổng thời lượng dự kiến: 44 giây.** Đây là TỔNG của bảy clip nằm rải rác ở
bảy cảnh riêng biệt — KHÔNG phải một đoạn mở đầu 44 giây. Không có màn hình
chờ nào giữ người xem lại.

## Kích hoạt một clip

Mở `src/data/scenes.ts` và sửa mục tương ứng:

```ts
{
  id: "scene-01-flag",
  ...
  src: "/video/scene-01-flag.mp4",   // ← từ "" thành đường dẫn thật
  poster: "/video/scene-01-flag.jpg", // ← ảnh tĩnh (tuỳ chọn, rất nên có)
  status: "ready",                    // ← từ "missing" thành "ready"
}
```

Không cần sửa component nào. Giao diện tự phản ứng:

- có `src` → dựng thẻ `<video>` (lazy, chỉ khi cảnh sắp vào khung hình);
- `src` rỗng → không dựng thẻ video nào, không có request nào ra mạng;
- video lỗi → tự quay về lớp nền tĩnh, không có ô đen trống.

## Quy tắc bắt buộc

1. **KHÔNG có tiếng.** Video trang trí luôn được đặt `muted` và `playsInline`.
2. **KHÔNG chứa chữ, tiêu đề, tài liệu hay trích dẫn.** Mọi chữ trên trang
   là lớp HTML riêng. Không dùng AI để dựng tài liệu lịch sử giả.
3. **Cảnh 04 là DỰNG LẠI.** Nó phải giữ nguyên `reconstructionDisclosure` —
   công bố đó đang hiện ngay trong cảnh, không giấu ở trang nguồn.
4. **Video không được thay thế bản đồ thật** ở cảnh 05.
5. Khuyến nghị: H.264/MP4, 1080p, không nén quá, dưới ~4 MB mỗi clip.

## Không tìm thấy clip cờ sẵn có

Khi rà soát kho của dự án, **không có tệp video nào** — `public/` chỉ có
`audio/ambient-hall.wav` và hai thư mục ảnh rỗng. Clip lá cờ mà chủ dự án
từng tạo cũng không còn trong kho. Vì vậy cảnh 01 dùng lá cờ vẽ bằng SVG
(`src/components/cinematic/VietnamFlag.tsx`) — hình học đúng theo quốc kỳ, sao
vàng năm cánh ở chính giữa, đường kính bằng 1/3 chiều cao lá cờ.
