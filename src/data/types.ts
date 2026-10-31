/**
 * ĐỊA CHỈ ĐỎ — Kiểu dữ liệu
 * ------------------------------------------------------------------
 * Toàn bộ nội dung lịch sử sẽ nằm trong `src/data/*.ts` theo các kiểu ở đây.
 * Giao diện chỉ đọc, không hardcode nội dung.
 *
 * NGUYÊN TẮC BẮT BUỘC (spec §11 + §12):
 *  1. Không bịa sự kiện, ngày tháng, nhân vật, địa chỉ.
 *  2. `status` quyết định cái gì được hiển thị công khai.
 *  3. Chưa xác minh → `needs_review`, tuyệt đối không khẳng định như sự thật.
 *  4. Không dùng ảnh AI / ảnh minh họa làm ảnh tư liệu lịch sử.
 */

/** Trạng thái kiểm chứng nội dung. */
export type ContentStatus =
  /** Đã đối chiếu với nguồn chính thức — hiển thị đầy đủ. */
  | "verified"
  /** Cần kiểm tra thêm — hiển thị kèm cảnh báo, ẩn địa chỉ/tọa độ. */
  | "needs_review"
  /** Bản nháp nội bộ — chưa được hiển thị công khai. */
  | "draft"
  /** Bị chặn hiển thị công khai. */
  | "unpublished";

/** Độ chính xác của tọa độ địa lý. */
export type CoordinateAccuracy = "approximate" | "verified";

/**
 * Tọa độ địa lý.
 * `accuracy: "approximate"` → bắt buộc hiển thị badge "CẦN KIỂM CHỨNG",
 * tuyệt đối không dùng làm vị trí chính xác.
 */
export interface Coordinates {
  lat: number;
  lng: number;
  accuracy: CoordinateAccuracy;
}

/** Nguồn tham khảo. `url` chỉ được điền khi đã kiểm chứt là URL thật. */
export interface SourceRef {
  id: string;
  /** Tên nguồn hiển thị. */
  title: string;
  /** Đơn vị phát hành, ví dụ "Cục Di tích lịch sử". */
  publisher?: string;
  /** URL thật đã kiểm chứt. Không điền nếu chưa xác minh. */
  url?: string;
  /** Ghi chú về mức độ tin cậy. */
  note?: string;
}

/**
 * Một tư liệu trong kho (ảnh, bản đồ, văn bản, hiện vật).
 *
 * `src` là DUY NHẤT thứ phân biệt "ảnh thật" với "placeholder".
 * Khi `src` rỗng, `ArchiveImage` bắt buộc render trạng thái
 * "TƯ LIỆU ĐANG ĐƯỢC BỔ SUNG" — không bao giờ dùng ảnh minh họa để che.
 */
export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  /** "image" | "map" | "text" | "artifact" */
  mediaType: "image" | "map" | "text" | "artifact";
  /** Thời gian hoặc giai đoạn, nếu xác định được. */
  dateOrPeriod?: string;
  /** Tác giả / đơn vị lưu trữ, nếu xác định được. */
  creatorOrArchive?: string;
  /**
   * Đường dẫn hoặc URL ảnh. Để TRỐNG nếu chưa có ảnh.
   * Khi thêm ảnh thật: chỉ cần điền `src` + `alt` + `credit` + `license`.
   */
  src?: string;
  /** Mô tả thay thế — bắt buộc cho ảnh có nghĩa truyền thông. */
  alt: string;
  /** Chú thích hiển thị dưới ảnh. */
  caption?: string;
  /** Nguồn của ảnh. */
  credit?: string;
  /** Giấy phép sử dụng. Không đoán — để trống nếu chưa rõ. */
  license?: string;
  /** Kích thước gốc, dùng để chống layout shift. */
  width?: number;
  height?: number;
  status: ContentStatus;
  /** slug của địa điểm liên quan, nếu có. */
  relatedSiteSlugs?: string[];
}

/** Giai đoạn lịch sử — dùng cho bộ lọc bản đồ. */
export type HistoricalPeriod =
  | "truoc-1930"
  | "1930-1945"
  | "1945-1954"
  | "1954-1975"
  | "sau-1975";

/** Loại địa điểm — dùng cho bộ lọc bản đồ. */
export type SiteCategory =
  | "di-tich-lich-su"
  | "bao-tang"
  | "co-so-cach-mang"
  | "dia-diem-luu-niem"
  | "dia-diem-lien-quan";

/** Hồ sơ địa điểm. */
export interface Site {
  id: string;
  /** URL slug, không dấu, dùng cho route /ho-so/[slug]. */
  slug: string;
  name: string;
  /** Nhãn tiếng Anh — chỉ mang tính nhận diện, không thay nội dung tiếng Việt. */
  nameEn?: string;
  subtitle?: string;

  /**
   * Địa chỉ đã xác minh.
   * OPTIONAL — chỉ điền khi `status === "verified"`.
   * `lib/content-status.ts` chặn việc hiển thị nếu chưa verified.
   */
  address?: string;

  /**
   * Tọa độ địa lý.
   * OPTIONAL — để trống nếu chưa xác minh.
   * `accuracy: "approximate"` → bản đồ vẫn render marker nhưng kèm badge cảnh báo.
   */
  coordinates?: Coordinates;

  /**
   * URL nhúng bản đồ Google cho địa điểm này, lấy từ Google Maps →
   * Chia sẻ → Nhúng bản đồ (chứa Place ID của chính Google).
   *
   * OPTIONAL. Khi có, trang dùng luồng này thay vì dựng iframe từ toạ độ.
   *
   * ── Vì sao ưu tiên Place ID hơn toạ độ ────────────────────────────────
   *
   * Trong một công trình rộng như Bến Nhà Rồng, "vị trí" có thể là tâm
   * công trình hay cổng vào — hai điểm cách nhau vài trăm mét, và mỗi nguồn
   * chọn một kiểu. Đo được:
   *
   *     Bến Nhà Rồng    Wikipedia 10.76824/106.70680  vs  Google 10.76861/106.70163   → 413 m
   *     Bảo tàng TPHCM  Wikipedia 10.77611/106.69972  vs  Google 10.77592/106.69706   → 290 m
   *
   * Cả hai đều lệch gần như trọn vẹn theo KINH ĐỘ (ngang hàng bắc), đúng dấu
   * hiệu của chênh lệch quy ước chứ không phải sai số ngẫu nhiên.
   *
   * Nếu nhúng bằng Place ID thì Google tự phân giải đúng địa điểm và tự
   * lo vụ vài trăm mét đó. Người dự án không phải phân xử giữa hai hệ quy
   * ước đoạn độ mà không có dữ liệu đo đạc chính thức.
   */
  mapEmbedUrl?: string;

  period: HistoricalPeriod;
  category: SiteCategory;
  /** Chủ đề, dùng cho bộ lọc theo chủ đề. */
  topics: string[];

  summary: string;
  historicalContext: string;
  historicalSignificance: string;

  images: ArchiveItem[];
  sources: SourceRef[];
  /** slug của các địa điểm liên quan. */
  relatedSiteSlugs: string[];
  /** id của các sự kiện liên quan trong timeline. */
  relatedEventIds: string[];

  status: ContentStatus;
}

/** Mốc lịch sử trên dòng thời gian. */
export interface TimelineEvent {
  id: string;
  /** Năm, dùng để sắp xếp. */
  year: number;
  /** Nhãn mốc, ví dụ "05 / 06 / 1911". */
  dateLabel?: string;
  title: string;
  summary: string;
  detailedContent: string;
  /**
   * Phân loại chủ đề để lọc — lấy từ danh sách chủ đề ở Idea.txt §3.
   *
   * Đây là PHÂN LOẠI BIÊN TẬP, không phải dữ kiện lịch sử: nó nói "mốc này
   * thuộc nhóm chủ đề nào", không khẳng định thêm điều gì về sự kiện. Sửa
   * thoải mái trong `src/data/events.ts` mà không ảnh hưởng nội dung.
   */
  topics: string[];
  /** slug của địa điểm liên quan. */
  relatedSiteSlugs: string[];
  sources: SourceRef[];
  /** Từ khoá hiển thị dưới mốc. */
  keywords: string[];
  /** Phạm vi sự kiện — phân biệt toàn quốc với riêng Sài Gòn (spec §11). */
  scope: "toan-quoc" | "sai-gon" | "dong-nam-a";
  status: ContentStatus;
}

/** Quốc gia Đông Nam Á. */
export interface Country {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  description: string[];
  /** Các mốc nổi bật, dùng để hiển thị dạng chip. */
  milestones: string[];
  /** Lưu ý biên tập — ví dụ phân biệt 1898 với 1946 ở Philippines. */
  editorialNote?: string;
}

/** Bộ sưu tập trong kho tư liệu. */
export interface ArchiveCollection {
  id: string;
  title: string;
  description: string;
  /** Thời kỳ, dùng cho bộ lọc. */
  dateOrPeriod?: string;
  items: ArchiveItem[];
  status: ContentStatus;
}

/* ══════════════════════════════════════════════════════════════════════════
   CẢNH CINEMATIC (History Web V2)
   ------------------------------------------------------------------
   Lớp A (khí quyển) — video. Lớp B (tư liệu) — ảnh lịch sử. Lớp C (giao diện)
   — HTML. Ba lớp tách bạch: video KHÔNG bao giờ chứa chữ hay tài liệu lịch
   sử, và mọi nội dung đọc được phải còn đủ khi video không tải được.
   ══════════════════════════════════════════════════════════════════════════ */

/** Định danh một cảnh của trang chủ. Ổn định — dùng làm khóa và anchor. */
export type SceneId =
  | "scene-01-flag"
  | "scene-02-city"
  | "scene-03-archive"
  | "scene-04-resistance"
  | "scene-05-map-transition"
  | "scene-06-southeast-asia"
  | "scene-07-finale";

/**
 * Trạng thái của một clip khí quyển.
 *
 * - `missing` — chưa có tệp. Đây là trạng thái MẶC ĐỊNH của cả bảy cảnh.
 * - `ready`   — đã có tệp thật ở `src`.
 *
 * KHÔNG có trạng thái "đã tạo" khi tệp chưa tồn tại. Không được ghi
 * `ready` cho một đường dẫn không tồn tại.
 */
export type SceneVideoStatus = "missing" | "ready";

/** Chiến lược nạp video. */
export type SceneLoadingStrategy = "eager" | "lazy";

/** Chiến lược video trên màn hình hẹp. */
export type SceneMobileStrategy =
  /** Chỉ dùng ảnh tĩnh (poster) — không phát video. */
  | "poster-only"
  /** Dùng nguồn độ phân giải thấp hơn nếu có. */
  | "lower-resolution"
  /** Không dùng video trên mobile. */
  | "omit";

/**
 * Loại chuyển cảnh ra vào một cảnh.
 *
 * Mỗi cảnh có một loại RIÊNG — không dùng chung một hiệu ứng fade cho
 * toàn trang. Danh sách này là tập hợp các chuyển cảnh được duyệt.
 */
export type SceneTransitionKind =
  /** Mặt nạ vải quét sang — cảnh lá cờ. */
  | "fabric-mask"
  /** Tiêu đề hiện từng dòng — cảnh thành phố. */
  | "typography-reveal"
  /** Cắt nối hình ảnh — cảnh kho lưu trữ. */
  | "match-cut"
  /** Ảnh lưu trữ nở ra — cảnh kháng chiến. */
  | "archival-expand"
  /** Sáng sang tối — cảnh bản đồ. */
  | "light-to-dark"
  /** Mực đỏ loang — ranh giới cảnh 04 → 05. */
  | "ink-spread"
  /** Bản đồ hình thức biến thành bản đồ thật — cảnh bản đồ. */
  | "map-transform"
  /** Chuyển cảnh phòng trưng bày — cảnh kết thúc. */
  | "gallery-crossfade";

/**
 * Một clip khí quyển của một cảnh.
 *
 * `src` rỗng ⇒ cảnh dùng lớp nền tĩnh (fallback) và KHÔNG render thẻ
 * `<video>` — không phát sinh request nào cho một URL rỗng.
 */
export interface SceneVideo {
  id: SceneId;
  /** Tên cảnh, hiển thị trong tài liệu và trong bảng trạng thái tư liệu. */
  title: string;
  /**
   * Thời lượng clip TẠO RA (giây) — dùng để chọn tuỳ chọn thời lượng
   * khi sinh video. KHÔNG phải thời lượng người xem phải ở lại cảnh.
   */
  durationSeconds: number;
  /** Đường dẫn tới tệp video. Rỗng ⇒ chưa có tư liệu. */
  src: string;
  /** Chuỗi clip tùy chọn cho một chương có nhiều nhịp hình ảnh nối tiếp. */
  sequence?: SceneVideoClip[];
  /** Ảnh tĩnh thay thế. Rỗng ⇒ không có poster. */
  poster: string;
  /** Tỉ lệ khung hình dự kiến, dùng để chống layout shift. */
  aspectRatio: string;
  /** Mô tả chuyển động mong muốn — chỉ để đối chiếu khi dựng tư liệu. */
  intendedMotion: string;
  loadingStrategy: SceneLoadingStrategy;
  mobileStrategy: SceneMobileStrategy;
  /**
   * Công bố bắt buộc khi cảnh là DỰNG LẠI (tái tạo) chứ không phải tư liệu
   * gốc. Rỗng ⇒ cảnh không phải dựng lại.
   */
  reconstructionDisclosure?: string;
  status: SceneVideoStatus;
}

/** Một clip trong chuỗi nền cinematic của một chương. */
export interface SceneVideoClip {
  src: string;
  durationSeconds: number;
  label?: string;
}

/** Câu hỏi trong thử thách lịch sử. */
export interface QuizQuestion {
  id: string;
  question: string;
  /** Luôn đúng 4 phương án (spec §8). */
  options: [string, string, string, string];
  /** Index của đáp án đúng trong `options`. */
  correctAnswer: number;
  explanation: string;
  /** Đường dẫn đọc thêm. */
  relatedContent?: string;
  sources: SourceRef[];
  status: ContentStatus;
}
