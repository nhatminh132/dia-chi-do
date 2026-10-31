import type { SceneId, SceneTransitionKind } from "@/data/types";
import { DURATION, EASE } from "./gsap";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  ĐỘNG CƠ CHUYỂN CẢNH — đặc tả của bảy cảnh
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Mỗi cảnh có MỘT kiểu chuyển cảnh riêng. Không có hiệu ứng fade chung cho
 *  toàn trang — đó là dấu hiệu của một trang "nhét hiệu ứng vào sau".
 *
 *  Mỗi mục ở đây trả lời tám câu hỏi mà brief đặt ra cho mỗi cảnh:
 *
 *      entryState         trạng thái khi vào cảnh
 *      focalPoint         tiêu điểm mắt
 *      mainMotion         chuyển động chính
 *      scrollBehavior     cách cảnh phản ứng với cuộn
 *      exitState          trạng thái khi rời cảnh
 *      nextSceneLink      mối nối thị giác với cảnh kế tiếp
 *      mobileAdaptation   thích ứng trên màn hình hẹp
 *      reducedMotion      bản rơi khi bật giảm chuyển động
 *
 *  File này chỉ là ĐẶC TẢ + cấu hình tween. Không có logic, không có DOM.
 *  Component đọc nó để biết phải làm gì.
 */

export interface SceneTransitionSpec {
  /** Loại chuyển cảnh (danh sách kiểu được duyệt). */
  kind: SceneTransitionKind;
  /** Tiêu đề hiển thị trong tài liệu kỹ thuật. */
  label: string;
  /** Cảnh này dùng chuyển cảnh nào để ĐI VÀO. */
  entryState: string;
  /** Điểm mắt neo vào. */
  focalPoint: string;
  /** Chuyển động chính của cảnh. */
  mainMotion: string;
  /** Cảnh phản ứng thế nào với con lăn. */
  scrollBehavior: string;
  /** Trạng thái khi rời cảnh. */
  exitState: string;
  /** Mối nối thị giác sang cảnh kế tiếp. */
  nextSceneLink: string;
  /** Thích ứng trên màn hình hẹp. */
  mobileAdaptation: string;
  /** Bản rơi khi bật giảm chuyển động. */
  reducedMotion: string;
  /**
   * Có dùng `pin` không.
   *
   * Toàn trang chỉ có MỘT scene ghim (cảnh bản đồ ký ức) và cảnh đó được
   * ghim ở chế độ ngang-trong-dọc rất ngắn. Ghim mọi cảnh sẽ biến trang
   * thành hành lang vô tận — đúng thứ cần tránh.
   */
  pinned: boolean;
}

/** Đặc tả chuyển cảnh cho từng cảnh. */
export const SCENE_TRANSITIONS: Record<SceneId, SceneTransitionSpec> = {
  "scene-01-flag": {
    kind: "fabric-mask",
    label: "Mặt nạ vải quét sang — lộ tiêu đề",
    entryState:
      "Nền đỏ sẫm, tiêu đề ĐỊA CHỈ ĐỎ đã có sẵn trong HTML (đọc được ngay).",
    focalPoint: "Ngôi sao vàng ở chính giữa lá cờ.",
    mainMotion:
      "Lớp vải quét ngang bằng clip-path, đồng thời tiêu đề dâng lên có trọng lượng.",
    scrollBehavior:
      "Nền lùi máy quay (scrub) khi cuộn; tiêu đề trôi lên và mờ dần.",
    exitState: "Cánh vải quét hết khung, để lộ nền đỏ tối của cảnh 02.",
    nextSceneLink:
      "Nền đỏ tối của cảnh 01 nối thẳng vào gradient đỏ sâu của cảnh 02 — cùng một hướng sáng.",
    mobileAdaptation:
      "Vải ở dạng tĩnh, không quét; tiêu đề hiện ngay, không chờ.",
    reducedMotion:
      "Không quét vải, không scrub. Lá cờ hiện tĩnh, tiêu đề hiện ngay, nút bỏ qua vẫn dùng được.",
    pinned: false,
  },

  "scene-02-city": {
    kind: "typography-reveal",
    label: "Tiêu đề hiện từng dòng",
    entryState:
      "Nền thành phố tối dần, tiêu đề chưa hiện cho tới khi cảnh vào khung hình.",
    focalPoint: "Khối tiêu đề 'Một thành phố, nhiều thế hệ đấu tranh.'",
    mainMotion:
      "Tiêu đề hiện từng dòng qua ô cắt; các mốc thời gian dâng lên lần lượt theo vị trí cuộn.",
    scrollBehavior:
      "Mốc thời gian hiện khi cuộn tới — không phải trình chiếu tự động.",
    exitState: "Khối văn bản trôi lên và nhạt đi.",
    nextSceneLink:
      "Ánh sáng hướng từ trên xuống ở cảnh 02 được nối bằng một tia sáng hẹp sang cảnh 03.",
    mobileAdaptation:
      "Tiêu đề hiện dạng khối; dòng thời gian dọc thay vì ngang, không ghim.",
    reducedMotion:
      "Tiêu đề và các mốc hiện sẵn, không cuộn theo. Không ghim.",
    pinned: false,
  },

  "scene-03-archive": {
    kind: "match-cut",
    label: "Cắt nối hình ảnh — tư liệu trồi lên",
    entryState:
      "Nền bàn lưu trữ tối, một vùng sáng duy nhất ở giữa khung hình.",
    focalPoint: "Tấm ảnh lưu trữ ở giữa cảnh.",
    mainMotion:
      "Ảnh lưu trữ trồi lên từ dưới qua mặt nạ cắt; chú thích hiện sau; nhãn nguồn hiện cuối; tấm ảnh trượt sang để lộ tấm kế tiếp.",
    scrollBehavior:
      "Mỗi tấm ảnh tự mở khi tới vùng đọc; tấm trước lùi sang khi tấm sau tới.",
    exitState: "Tấm ảnh cuối cùng nở ra, lùi lại giữa khung.",
    nextSceneLink:
      "Tấm ảnh nở ra lấp đầy khung hình rồi thu lại — cắt nối thẳng sang cảnh 04.",
    mobileAdaptation:
      "Ảnh ở dạng chồng dọc, chú thích luôn hiện kèm, không hiệu ứng trượt.",
    reducedMotion:
      "Ảnh và chú thích hiện sẵn, không mặt nạ cắt, không trượt.",
    pinned: false,
  },

  "scene-04-resistance": {
    kind: "archival-expand",
    label: "Ảnh lưu trữ nở ra",
    entryState:
      "Nền xưởng in tối với một luồng sáng xiên từ trái.",
    focalPoint: "Các khung địa điểm nối bằng đường kẻ mảnh.",
    mainMotion:
      "Từng khung địa điểm mở ra tuần tự bằng clip-path, nhãn biên tập hiện theo.",
    scrollBehavior:
      "Khung mở khi vào vùng đọc; các nhãn nối bằng đường kẻ mảnh kéo dài.",
    exitState: "Cả khung lùi lại, để lộ nền tối cho cảnh 05.",
    nextSceneLink:
      "Một vệt mực đỏ bắt đầu loang từ góc dưới — chuẩn bị cho cảnh 05.",
    mobileAdaptation:
      "Khung xếp dọc, không đường kẻ nối, không hiệu ứng nở.",
    reducedMotion: "Mọi khung hiện sẵn, không mở mặt nạ.",
    pinned: false,
  },

  "scene-05-map-transition": {
    kind: "map-transform",
    label: "Bản đồ hình thức → bản đồ thật",
    entryState:
      "Nền bản đồ tối, một vệt mực đỏ nhỏ ở tâm.",
    focalPoint: "Vệt mực đỏ lan ra và bản đồ thật lộ ra bên dưới.",
    mainMotion:
      "Vệt mực loang (clip-path + scale) phủ lên nền hình thức; bản đồ tương tác thật hiện ra bên dưới.",
    scrollBehavior:
      "Vệt mực loang theo cuộn; bản đồ thật luôn dùng được ngay khi hiện.",
    exitState: "Bản đồ thật chiếm trọn khung, vệt mực lùi ra mép.",
    nextSceneLink:
      "Mực đỏ tan dần thành nền tối của cảnh 06 — cùng hệ màu.",
    mobileAdaptation:
      "Không loang mực; bản đồ thật hiện ngay, chiều cao khung nhỏ hơn.",
    reducedMotion:
      "Không loang mực, bản đồ thật hiện ngay ở đầu cảnh.",
    pinned: false,
  },

  "scene-06-southeast-asia": {
    kind: "light-to-dark",
    label: "Sáng sang tối — thu về khu vực",
    entryState: "Nền tối với quầng sáng khu vực ở trung tâm.",
    focalPoint: "Các quốc gia Đông Nam Á xếp ngang.",
    mainMotion:
      "Máy quay lùi (scale giảm dần) — thành phố thu nhỏ lại thành một điểm trong bức tranh khu vực.",
    scrollBehavior:
      "Quầng sáng nới rộng; các ô quốc gia hiện lần lượt khi cuộn tới.",
    exitState: "Quầng sáng co lại, màn hình tối dần.",
    nextSceneLink:
      "Quầng sáng tối dần thành các luồng sáng trưng bày của cảnh 07.",
    mobileAdaptation:
      "Các ô quốc gia xếp dọc, không hiệu ứng lùi máy quay.",
    reducedMotion:
      "Không lùi máy quay, các ô hiện sẵn.",
    pinned: false,
  },

  "scene-07-finale": {
    kind: "gallery-crossfade",
    label: "Chuyển cảnh phòng trưng bày",
    entryState: "Nền tối, từng luồng sáng riêng chiếu lên các tấm trưng bày.",
    focalPoint: "Câu 'LỊCH SỬ VẪN Ở ĐÂY.'",
    mainMotion:
      "Câu tuyên bố hiện dâng lên có trọng lượng; các liên kết dưới đó hiện lần lượt.",
    scrollBehavior:
      "Chỉ hiệu ứng vào; không scrub, không ghim — cảnh kết thúc phải tĩnh.",
    exitState: "Giữ nguyên tới hết trang.",
    nextSceneLink:
      "Không có cảnh kế tiếp — cảnh kết thúc chuyển tiếp tự nhiên sang chân trang.",
    mobileAdaptation:
      "Các liên kết xếp một cột, luồng sáng bớt.",
    reducedMotion:
      "Câu và liên kết hiện sẵn, không hiệu ứng vào.",
    pinned: false,
  },
};

/** Chuyển cảnh đi vào của cảnh kế tiếp (dùng ở ranh giới giữa hai cảnh). */
export const SCENE_EXIT_TRANSITIONS: Record<SceneId, SceneTransitionKind> = {
  "scene-01-flag": "fabric-mask",
  "scene-02-city": "match-cut",
  "scene-03-archive": "archival-expand",
  "scene-04-resistance": "ink-spread",
  "scene-05-map-transition": "light-to-dark",
  "scene-06-southeast-asia": "gallery-crossfade",
  "scene-07-finale": "gallery-crossfade",
};

/* -------------------------------------------------------------------------
 *  Cấu hình tween dùng chung
 *  ------------------------------------------------------------------------- */

/** Thời lượng một nhịp chuyển cảnh vào. */
export const SCENE_ENTER_DURATION = DURATION.slow;

/** Thời lượng mở mặt nạ cắt cho ảnh lưu trữ. */
export const ARCHIVE_MASK_DURATION = 1.25;

/** Nhịp dễ chịu cho các thẻ hiện lần lượt. */
export const SCENE_STAGGER = 0.07;

/**
 * Vết mực đỏ loang — dùng cho ranh giới cảnh 04 → cảnh 05.
 *
 * Dựng bằng `clip-path` hình tròn + `transform: scale`, KHÔNG dùng thư viện
 * vẽ mực: một lớp overlay đơn giản chạy được trên GPU và không tốn thêm
 * gói dependency nào.
 */
export function inkSpreadVars(): gsap.TweenVars {
  return {
    scale: 1,
    opacity: 1,
    ease: EASE.linear,
  };
}

/** Vệt sáng chuyển cảnh giữa hai cảnh — hướng sáng được giữ nguyên. */
export function sceneBeamVars(): gsap.TweenVars {
  return {
    scaleX: 0,
    opacity: 0,
    transformOrigin: "left center",
    duration: SCENE_ENTER_DURATION,
    ease: EASE.cinematic,
  };
}
