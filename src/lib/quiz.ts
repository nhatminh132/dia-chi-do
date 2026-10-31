/**
 * ══════════════════════════════════════════════════════════════════════════
 *  THỬ THÁCH LỊCH SỬ — bộ câu hỏi
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── Nguyên tắc ────────────────────────────────────────────────────────────
 *
 * Mọi câu hỏi ở đây được rút ra từ nội dung ĐÃ ĐƯỢC KIỂM CHỨNG trong dự án
 * (`src/data/events.ts`, `src/data/sites.ts`, `src/data/countries.ts`). Mỗi
 * câu ghi rõ:
 *
 *   • `eventId` / `siteSlug` — bản ghi gốc, để người học đối chiếu ngay.
 *   • `source` — nơi câu hỏi lấy ra (dòng thời gian / hồ sơ địa điểm / khu vực).
 *   • `explanation` — giải thích kèm ngữ cảnh, luôn nói rõ mốc thời gian.
 *
 * Đúng spec §8: mỗi câu 4 phương án, có 1 đáp án đúng duy nhất, có giải thích.
 */

export interface QuizOption {
  label: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  /** Câu hỏi, viết như một câu hỏi thật, không gợi ý đáp án. */
  prompt: string;
  /** Gợi ý về nơi tìm câu trả lời — hiện trước khi chọn. */
  hint: string;
  options: QuizOption[];
  /** Giải thích sau khi trả lời, kèm mốc thời gian cụ thể. */
  explanation: string;
  /** Bản ghi gốc trong dự án. */
  eventId?: string;
  siteSlug?: string;
  /** Nơi câu hỏi lấy ra, hiển thị cho người học. */
  source: string;
  /** Nhóm chủ đề, dùng để tổng kết cuối cùng. */
  topic: "thoi-gian" | "dia-diem" | "pham-vi";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  /* 1. Câu hỏi 1 theo Idea.txt §8 */
  {
    id: "q-1911",
    prompt: "Nguyễn Tất Thành rời Bến Nhà Rồng vào năm nào?",
    hint: "Xem mốc đầu tiên trong dòng thời gian hoặc hồ sơ Bến Nhà Rồng.",
    options: [
      { label: "1908", correct: false },
      { label: "1911", correct: true },
      { label: "1930", correct: false },
      { label: "1945", correct: false },
    ],
    explanation:
      "Ngày 5/6/1911, người thanh niên yêu nước Nguyễn Tất Thành rời Bến Nhà Rồng trên con tàu Amiral Latouche-Tréville, bắt đầu hành trình tìm đường cứu nước.",
    eventId: "event-1911",
    siteSlug: "ben-nha-rong",
    source: "Dòng thời gian · 05/06/1911 — Hồ sơ Bến Nhà Rồng",
    topic: "thoi-gian",
  },

  /* 2. Câu hỏi 2 theo Idea.txt §8 */
  {
    id: "q-1930",
    prompt: "Đảng Cộng sản Việt Nam được thành lập vào ngày nào?",
    hint: "Xem mốc mùa Xuân 1930 trong dòng thời gian.",
    options: [
      { label: "03 / 02 / 1930", correct: true },
      { label: "19 / 08 / 1945", correct: false },
      { label: "02 / 09 / 1945", correct: false },
      { label: "30 / 04 / 1975", correct: false },
    ],
    explanation:
      "Ngày 3/2/1930 đánh dấu sự thành lập Đảng Cộng sản Việt Nam tại Hội nghị Cửu Long (Hồng Kông) do lãnh tụ Nguyễn Ái Quốc chủ trì, một bước ngoặt quan trọng của cách mạng Việt Nam.",
    eventId: "event-1930",
    source: "Dòng thời gian · 03/02/1930",
    topic: "thoi-gian",
  },

  /* 3. Câu hỏi 3 theo Idea.txt §8 */
  {
    id: "q-1950",
    prompt: "Cuộc biểu tình gắn với sự hy sinh của anh hùng liệt sĩ Trần Văn Ơn diễn ra vào ngày nào?",
    hint: "Đọc mốc năm 1950 trong dòng thời gian và hồ sơ Bảo tàng TP.HCM.",
    options: [
      { label: "09 / 01 / 1950", correct: true },
      { label: "03 / 02 / 1930", correct: false },
      { label: "02 / 09 / 1945", correct: false },
      { label: "30 / 04 / 1975", correct: false },
    ],
    explanation:
      "Ngày 9/1/1950, cuộc biểu tình của học sinh, sinh viên tại Sài Gòn gắn với sự hy sinh dũng cảm của Trần Văn Ơn trở thành mốc son chói lọi, mở đầu cho Ngày truyền thống Học sinh - Sinh viên Việt Nam.",
    eventId: "event-1950",
    siteSlug: "bao-tang-thanh-pho-ho-chi-minh",
    source: "Dòng thời gian · 09/01/1950 — Hồ sơ Bảo tàng Thành phố Hồ Chí Minh",
    topic: "thoi-gian",
  },

  /* 4. Câu hỏi 4 theo Idea.txt §8 */
  {
    id: "q-1975",
    prompt: "Chiến dịch nào toàn thắng vào ngày 30/4/1975?",
    hint: "Xem mốc đại thắng mùa Xuân 1975 trong dòng thời gian.",
    options: [
      { label: "Chiến dịch Việt Bắc", correct: false },
      { label: "Chiến dịch Biên giới", correct: false },
      { label: "Chiến dịch Điện Biên Phủ", correct: false },
      { label: "Chiến dịch Hồ Chí Minh", correct: true },
    ],
    explanation:
      "Chiến dịch Hồ Chí Minh toàn thắng trưa ngày 30/4/1975 khi cờ giải phóng tung bay trên nóc Dinh Độc Lập, đánh dấu thắng lợi quyết định giải phóng hoàn toàn miền Nam và thống nhất đất nước.",
    eventId: "event-1975",
    siteSlug: "dinh-doc-lap",
    source: "Dòng thời gian · 30/04/1975 — Hồ sơ Dinh Độc Lập",
    topic: "thoi-gian",
  },

  /* 5. Câu hỏi 5 theo Idea.txt §8 */
  {
    id: "q-indonesia",
    prompt: "Indonesia tuyên bố độc lập vào năm nào?",
    hint: "Xem thông tin các quốc gia trong trang Đông Nam Á.",
    options: [
      { label: "1930", correct: false },
      { label: "1945", correct: true },
      { label: "1948", correct: false },
      { label: "1954", correct: false },
    ],
    explanation:
      "Indonesia tuyên bố độc lập ngày 17/8/1945 dưới sự lãnh đạo của Sukarno và Hatta, sau đó trải qua hơn 4 năm kiên cường đấu tranh để Hà Lan công nhận chủ quyền vào ngày 27/12/1949.",
    source: "Chuyên mục Đông Nam Á · Indonesia",
    topic: "pham-vi",
  },

  /* 6. Câu hỏi 6 theo Idea.txt §8 */
  {
    id: "q-myanmar",
    prompt: "Myanmar (Miến Điện) giành độc lập từ thực dân Anh vào năm nào?",
    hint: "Xem thông tin quốc gia Myanmar trong trang Đông Nam Á.",
    options: [
      { label: "1945", correct: false },
      { label: "1946", correct: false },
      { label: "1948", correct: true },
      { label: "1950", correct: false },
    ],
    explanation:
      "Ngày 4/1/1948, Miến Điện (nay là Liên bang Myanmar) chính thức giành được độc lập từ thực dân Anh sau các phong trào dân tộc kiên trì.",
    source: "Chuyên mục Đông Nam Á · Myanmar",
    topic: "pham-vi",
  },

  /* 7. Câu hỏi 7 theo Idea.txt §8 */
  {
    id: "q-quoc-khanh-vn",
    prompt: "Ngày Quốc khánh của nước Việt Nam gắn liền với sự kiện nào?",
    hint: "Xem sự kiện mùa Thu năm 1945 trong dòng thời gian.",
    options: [
      { label: "Thành lập Đảng Cộng sản Việt Nam", correct: false },
      { label: "Tuyên ngôn Độc lập được đọc tại Quảng trường Ba Đình", correct: true },
      { label: "Chiến dịch Hồ Chí Minh toàn thắng", correct: false },
      { label: "Nguyễn Tất Thành rời Bến Nhà Rồng", correct: false },
    ],
    explanation:
      "Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa, trở thành ngày Quốc khánh của nước ta.",
    eventId: "event-1945",
    source: "Dòng thời gian · 02/09/1945",
    topic: "thoi-gian",
  },

  /* 8. Câu hỏi 8 theo Idea.txt §8 */
  {
    id: "q-vai-tro-saigon",
    prompt: "Sài Gòn có vai trò gì trong lịch sử đấu tranh giải phóng dân tộc?",
    hint: "Đọc phần giới thiệu dự án hoặc câu chuyện lịch sử thành phố.",
    options: [
      { label: "Chỉ là một thương cảng buôn bán đơn thuần", correct: false },
      { label: "Không liên quan đến phong trào cách mạng", correct: false },
      { label: "Là địa bàn quan trọng của nhiều phong trào đấu tranh và sự kiện lịch sử", correct: true },
      { label: "Là thủ đô chung của tất cả quốc gia Đông Nam Á", correct: false },
    ],
    explanation:
      "Sài Gòn là địa bàn chiến lược đặc biệt quan trọng trong các phong trào yêu nước, cách mạng công nhân, phong trào học sinh sinh viên đô thị, mạng lưới biệt động và là nơi kết thúc thắng lợi cuộc kháng chiến thống nhất đất nước.",
    source: "Giới thiệu dự án & Lịch sử Sài Gòn",
    topic: "pham-vi",
  },

  /* 9. Về cơ sở in ấn tài liệu */
  {
    id: "q-ham-gia-phu",
    prompt: "Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận (341/10 Gia Phú, Quận 6) từng xuất bản tờ báo cách mạng nào?",
    hint: "Xem hồ sơ di tích Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận.",
    options: [
      { label: "Báo Công Nhân (tiền thân Báo Sài Gòn Giải Phóng Hoa Văn)", correct: true },
      { label: "Báo Thanh Niên", correct: false },
      { label: "Báo Lao Động", correct: false },
      { label: "Báo Nhân Dân", correct: false },
    ],
    explanation:
      "Tại căn hầm bí mật số 341/10 Gia Phú (Quận 6), tổ in gồm 15 đồng chí do đồng chí Lâm Tư Quang chỉ đạo đã kiên trì xuất bản Báo Công Nhân (về sau đổi tên thành Báo Giải Phóng, tiền thân Báo Sài Gòn Giải Phóng Hoa Văn) cùng hàng triệu truyền đơn, tài liệu chỉ đạo của Đảng bằng chữ Hoa trong suốt 10 năm (1965 – 1975).",
    siteSlug: "ham-bimat-in-tai-lieu-ban-tuyen-huan-hoa-van",
    source: "Hồ sơ Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận",
    topic: "dia-diem",
  },

  /* 10. Về Hầm chứa vũ khí Biệt động Sài Gòn */
  {
    id: "q-ham-vu-khi-nguyen-dinh-chieu",
    prompt: "Căn hầm chứa gần 2 tấn vũ khí của Biệt động Sài Gòn phục vụ trận đánh Dinh Độc Lập Tết Mậu Thân 1968 nằm tại địa chỉ nào?",
    hint: "Xem hồ sơ các cơ sở cách mạng bí mật tại Quận 3.",
    options: [
      { label: "287/70 đường Nguyễn Đình Chiểu, Quận 3", correct: true },
      { label: "91 đường Phạm Văn Chí, Quận 6", correct: false },
      { label: "341/10 đường Gia Phú, Quận 6", correct: false },
      { label: "65 đường Lý Tự Trọng, Quận 1", correct: false },
    ],
    explanation:
      "Căn nhà số 287/70 Nguyễn Đình Chiểu (Quận 3) do Anh hùng LLVTND Trần Văn Lai xây dựng hầm ngầm bí mật, cất giấu gần 2 tấn súng đạn, chất nổ cung cấp cho Đội 5 Biệt động Sài Gòn tập kích Dinh Độc Lập trong đợt Tết Mậu Thân 1968.",
    siteSlug: "ham-chua-vu-khi-biet-dong-sai-gon",
    source: "Hồ sơ Hầm chứa vũ khí Biệt động Sài Gòn",
    topic: "dia-diem",
  },

  /* 11. Về sự kiện Ba Son 1925 */
  {
    id: "q-ba-son-1925",
    prompt: "Cuộc bãi công của hơn 1.000 công nhân xưởng Ba Son vào tháng 8/1925 do ai trực tiếp tổ chức và lãnh đạo?",
    hint: "Xem mốc năm 1925 trong dòng thời gian hoặc hồ sơ Khu di tích Ba Son.",
    options: [
      { label: "Đồng chí Tôn Đức Thắng", correct: true },
      { label: "Đồng chí Trần Văn Ơn", correct: false },
      { label: "Đồng chí Nguyễn Văn Cừ", correct: false },
      { label: "Đồng chí Mai Chí Thọ", correct: false },
    ],
    explanation:
      "Dưới sự chỉ đạo của đồng chí Tôn Đức Thắng và Công hội bí mật, hơn 1.000 công nhân Ba Son đã tiến hành bãi công thắng lợi, kìm chân chiến hạm Jules Michelet của thực dân Pháp sang đàn áp phong trào cách mạng Trung Quốc.",
    eventId: "event-1925-ba-son",
    siteSlug: "khu-di-tich-ba-son",
    source: "Dòng thời gian · Tháng 8/1925 — Hồ sơ Khu di tích lịch sử Ba Son",
    topic: "dia-diem",
  },

  /* 12. Về Ngã Ba Giồng */
  {
    id: "q-nga-ba-giong",
    prompt: "Khu tưởng niệm liệt sĩ Ngã Ba Giồng (Hóc Môn) gắn liền với cuộc khởi nghĩa và phong trào cách mạng nào?",
    hint: "Xem hồ sơ Khu tưởng niệm liệt sĩ Ngã Ba Giồng.",
    options: [
      { label: "Khởi nghĩa Nam Kỳ năm 1940", correct: true },
      { label: "Phong trào Cần Vương cuối thế kỷ XIX", correct: false },
      { label: "Phong trào Đông Du đầu thế kỷ XX", correct: false },
      { label: "Chiến dịch Điện Biên Phủ năm 1954", correct: false },
    ],
    explanation:
      "Ngã Ba Giồng (Hóc Môn, Mười tám thôn vườn trầu) là căn cứ lịch sử gắn liền với cuộc Khởi nghĩa Nam Kỳ đêm 22 rạng sáng 23/11/1940 và là trường bắn nơi thực dân Pháp đã xử bắn các đồng chí lãnh đạo kiệt xuất như Nguyễn Văn Cừ, Hà Huy Tập, Phan Đăng Lưu, Nguyễn Thị Minh Khai.",
    siteSlug: "nga-ba-giong",
    source: "Hồ sơ Khu tưởng niệm liệt sĩ Ngã Ba Giồng",
    topic: "dia-diem",
  },
];

/** Nhóm chủ đề, dùng cho thẻ tổng kết cuối cùng. */
export const QUIZ_TOPIC_LABELS: Record<QuizQuestion["topic"], string> = {
  "thoi-gian": "Mốc thời gian",
  "dia-diem": "Địa điểm",
  "pham-vi": "Phạm vi sự kiện",
};
