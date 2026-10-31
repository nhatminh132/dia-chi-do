import type { SceneVideo } from "./types";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  MANIFEST VIDEO — HÀNH TRÌNH CINEMATIC (History Web V2)
 *  ----------------------------------------------------------------------
 *
 *  Bảy cảnh của trang chủ, theo đúng storyboard:
 *
 *   01 scene-01-flag            6s   Cờ đỏ
 *   02 scene-02-city            8s   Thành phố và ký ức
 *   03 scene-03-archive         6s   Mở kho lưu trữ
 *   04 scene-04-resistance      8s   Dấu vết kháng chiến
 *   05 scene-05-map-transition  4s   Bản đồ ký ức
 *   06 scene-06-southeast-asia  6s   Đông Nam Á
 *   07 scene-07-finale          6s   Ký ức vẫn còn đây
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  TỔNG THỜI LƯỢNG DỰ KIẾN: 44 GIÂY
 *  ─────────────────────────────────────────────────────────────────────────
 *
 *  44 giây là TỔNG của bảy clip, KHÔNG phải một đoạn mở đầu dài 44 giây.
 *  Bảy clip nằm rải rác ở bảy cảnh riêng biệt; người xem tự cuộn, tự dừng,
 *  tự đọc. Không có màn hình chờ nào giữ người xem lại.
 *
 *  ══════════════════════════════════════════════════════════════════════
 *  TRẠNG THÁI TƯ LIỆU — ĐỌC TRƯỚC KHI DÙNG
 *  ══════════════════════════════════════════════════════════════════════
 *
 *  Tất cả bảy mục đang ở trạng thái `missing` với `src: ""`.
 *
 *  LÝ DO: khi rà soát kho của dự án, KHÔNG tìm thấy tệp video nào —
 *  `public/` chỉ có `audio/ambient-hall.wav` và hai thư mục ảnh rỗng.
 *  Clip lá cờ mà chủ dự án từng tạo cũng không còn trong kho.
 *
 *  Vì vậy KHÔNG đoán tên tệp và KHÔNG dùng video mẫu bừa. Một `src` sai
 *  lúc này sẽ tạo ra 404 trong Network tab và một biểu tượn video hỏng
 *  trên màn hình — tệ hơn nhiều so với lớp nền tĩnh.
 *
 *  ── CÁCH THÊM TƯ LIỆU ───────────────────────────────────────────────────
 *
 *  1. Đặt tệp vào `public/video/` (tệp cục bộ) hoặc dùng một URL đã kiểm
 *     chứng của bạn.
 *  2. Điền `src` (và `poster` nếu bạn có ảnh tĩnh) trong file này.
 *  3. Đổi `status` từ `"missing"` sang `"ready"`.
 *
 *  Bảy mục dưới đây là nơi duy nhất cần sửa. Giao diện tự phản ứng:
 *  video có mặt → phát; không có → lớp nền tĩnh; lỗi → quay về lớp nền
 *  tĩnh. Không cần sửa component nào.
 *
 *  ── QUY TẮC BẤT DI BẤT DỊCH ────────────────────────────────────────────
 *
 *   • KHÔNG tự đặt tên tệp giả. Không có "scene-01-flag.mp4" nếu tệp đó
 *     không tồn tại.
 *   • KHÔNG dùng video mẫu/ngẫu nhiên thay cho tư liệu.
 *   • Video trang trí phải KHÔNG có tiếng (`muted`).
 *   • KHÔNG được bake chữ, tiêu đề hay tài liệu giả vào video — tiêu đề
 *     và giao diện luôn là lớp HTML riêng.
 *   • Clip là DỰNG LẠI thì phải bật `reconstructionDisclosure`.
 *
 *  ── NƠI ĐẶT TỆP MẪU (khi có) ───────────────────────────────────────────
 *
 *      public/video/scene-01-flag.mp4
 *      public/video/scene-02-city.mp4
 *      public/video/scene-03-archive.mp4
 *      public/video/scene-04-resistance.mp4
 *      public/video/scene-05-map-transition.mp4
 *      public/video/scene-06-southeast-asia.mp4
 *      public/video/scene-07-finale.mp4
 *
 *  và `src` tương ứng là `"/video/scene-01-flag.mp4"`, …
 * ══════════════════════════════════════════════════════════════════════════
 */

export const SCENES: SceneVideo[] = [
  {
    id: "scene-01-flag",
    title: "Cờ đỏ — mở đầu",
    durationSeconds: 4,
    src: "/video/scene-01-flag.scrub.mp4",
    poster: "/images/scenes/scene-01-flag.jpg",
    aspectRatio: "16 / 9",
    intendedMotion:
      "Macro vải đỏ chuyển động, ngôi sao vàng năm cánh ở chính giữa từ khung hình đầu tiên. Vải quét sang để lộ tiêu đề HTML bên dưới.",
    loadingStrategy: "eager",
    /* Màn hình hẹp: ảnh tĩnh cùng khung hình, không tải video. */
    mobileStrategy: "poster-only",
    status: "ready",
  },

  {
    id: "scene-02-city",
    title: "Thành phố và ký ức",
    durationSeconds: 20,
    intendedMotion:
      "Chuỗi ba nhịp: phố Sài Gòn xưa bạc màu và nhiễu hạt; camera ngửa lên trời làm cầu nối; từ bầu trời hạ xuống hình ảnh tư liệu ngày 30/4/1975.",
    src: "",
    sequence: [
      {
        src: "/video/scene-02-city.scrub.mp4",
        durationSeconds: 8,
        label: "The City",
      },
      {
        src: "/video/scene-02-transition.scrub.mp4",
        durationSeconds: 4.01,
        label: "Transition",
      },
      {
        src: "/video/scene-02-1975.scrub.mp4",
        durationSeconds: 8,
        label: "30/4/1975",
      },
    ],
    poster: "/images/scenes/scene-02-city.jpg",
    aspectRatio: "16 / 9",
    loadingStrategy: "lazy",
    mobileStrategy: "poster-only",
    status: "ready",
  },

  {
    id: "scene-03-archive",
    title: "Mở kho lưu trữ",
    durationSeconds: 6,
    intendedMotion:
      "Bàn lưu trữ tối với một nguồn sáng kiểm soát, bụi lơ lửng trong luồng sáng, máy quay trôi rất chậm. KHÔNG có tài liệu đọc được trong hình.",
    src: "",
    poster: "",
    aspectRatio: "16 / 9",
    loadingStrategy: "lazy",
    mobileStrategy: "poster-only",
    status: "missing",
  },

  {
    id: "scene-04-resistance",
    title: "Dấu vết kháng chiến",
    durationSeconds: 8,
    intendedMotion:
      "Không gian dựng lại của một xưởng in ấn thời chiến: máy in cơ, giấy chuyển động, ánh sáng xiên, bóng đổ có kiểm soát. KHÔNG có chữ đọc được.",
    src: "",
    poster: "",
    aspectRatio: "16 / 9",
    loadingStrategy: "lazy",
    mobileStrategy: "poster-only",
    reconstructionDisclosure:
      "Hình ảnh nền của cảnh này là DỰNG LẠI phục vụ không khí, không phải tư liệu gốc. Mọi tên địa điểm, ngày tháng và trích dẫn hiển thị trên cảnh đều là HTML và đều dẫn về nguồn đã kiểm chứng.",
    status: "missing",
  },

  {
    id: "scene-05-map-transition",
    title: "Bản đồ ký ức",
    durationSeconds: 4,
    intendedMotion:
      "Khí quyển bản đồ tối, một vết mực đỏ lan trên mặt bản đồ, máy quay tiến về một điểm. Đây là clip chuyển tiếp ngắn, KHÔNG thay thế bản đồ tương tác thật.",
    src: "",
    poster: "",
    aspectRatio: "16 / 9",
    loadingStrategy: "lazy",
    mobileStrategy: "poster-only",
    status: "missing",
  },

  {
    id: "scene-06-southeast-asia",
    title: "Đông Nam Á — nhiều con đường",
    durationSeconds: 6,
    intendedMotion:
      "Máy quay lùi từ thành phố ra Đông Nam Á, điểm sáng địa lý tiết chế, cảm giác quy mô khu vực. Không gợi ý quan hệ lịch sử không có thật.",
    src: "",
    poster: "",
    aspectRatio: "16 / 9",
    loadingStrategy: "lazy",
    mobileStrategy: "poster-only",
    status: "missing",
  },

  {
    id: "scene-07-finale",
    title: "Ký ức vẫn còn đây",
    durationSeconds: 6,
    intendedMotion:
      "Không gian trưng bày bảo tàng tối, từng luồng sáng chiếu riêng, chiều sâu tiết chế, máy quay trôi chậm. Kết thúc tĩnh và trầm.",
    src: "",
    poster: "",
    aspectRatio: "16 / 9",
    loadingStrategy: "lazy",
    mobileStrategy: "poster-only",
    status: "missing",
  },
];

/**
 * Tổng thời lượng dự kiến của toàn bộ tư liệu khí quyển (giây).
 *
 * Đây là TỔNG của bảy clip nằm rải rác ở bảy cảnh — không phải thời
 * lượng của một đoạn mở đầu. Người xem không bị giữ lại bất kỳ lúc nào.
 */
export const SCENE_TOTAL_DURATION_SECONDS = SCENES.reduce(
  (total, scene) => total + scene.durationSeconds,
  0,
);
