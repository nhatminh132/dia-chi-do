import type { Country } from "./types";

/**
 * Phong trào giải phóng dân tộc Đông Nam Á — Chuyển từ Idea.txt §6 và bổ sung các nước lân cận Đông Dương.
 *
 * ── Lưu ý biên tập (Spec §6 & §11) ───────────────────────────────────────
 *
 * 1. Phân biệt rõ sự kiện tuyên bố độc lập với sự kiện quốc tế công nhận chủ quyền.
 * 2. Đối chiếu chuẩn xác theo Cổng Thông tin điện tử Bộ Ngoại giao Việt Nam (mofa.gov.vn).
 * 3. Đặt lịch sử đấu tranh của Sài Gòn và Việt Nam trong mối tương quan với dòng chảy chung của khu vực.
 */
export const countries: Country[] = [
  {
    id: "vn",
    name: "Việt Nam",
    nameEn: "Vietnam",
    title: "Độc lập và thống nhất",
    description: [
      "Ngày 2/9/1945, nước Việt Nam Dân chủ Cộng hòa ra đời sau thắng lợi của Cách mạng Tháng Tám. Tiếp đó, nhân dân Việt Nam trải qua 30 năm kiên cường kháng chiến chống thực dân Pháp và đế quốc Mỹ.",
      "Chiến thắng lịch sử ngày 30/4/1975 tại Sài Gòn đã giải phóng hoàn toàn miền Nam, non sông thu về một mối, hoàn thành trọn vẹn sự nghiệp đấu tranh giành độc lập và thống nhất Tổ quốc.",
      "Sài Gòn là địa bàn chiến lược đặc biệt quan trọng, nơi hội tụ các phong trào công nhân, học sinh sinh viên, căn cứ bí mật nội đô và là đích đến của chiến dịch toàn thắng năm 1975.",
    ],
    milestones: ["1945", "1954", "1975"],
  },

  {
    id: "id",
    name: "Indonesia",
    nameEn: "Indonesia",
    title: "Tuyên bố độc lập và cuộc đấu tranh bảo vệ độc lập",
    description: [
      "Ngày 17/8/1945, hai nhà lãnh đạo Sukarno và Mohammad Hatta thay mặt nhân dân đọc Tuyên ngôn Độc lập, khai sinh nước Cộng hòa Indonesia.",
      "Sau tuyên bố độc lập, nhân dân Indonesia phải tiến hành cuộc Cách mạng Dân tộc kéo dài hơn 4 năm vừa chiến đấu vừa đàm phán để bảo vệ nền độc lập trước sự tái chiếm của quân đội Hà Lan.",
      "Ngày 27/12/1949, sau Hội nghị Bàn tròn La Hay, Vương quốc Hà Lan chính thức ký văn bản công nhận hoàn toàn chủ quyền của Hợp chúng quốc Indonesia.",
    ],
    milestones: ["1945", "1949"],
  },

  {
    id: "ph",
    name: "Philippines",
    nameEn: "Philippines",
    title: "Hành trình giành quyền tự quyết",
    description: [
      "Philippines có lịch sử đấu tranh chống ách thống trị kéo dài hơn 300 năm của thực dân Tây Ban Nha. Ngày 12/6/1898, nhà cách mạng Emilio Aguinaldo đọc Tuyên ngôn Độc lập, lập nên nền Cộng hòa đầu tiên.",
      "Ngay sau đó, Hoa Kỳ thiết lập quyền kiểm soát và biến Philippines thành thuộc địa kiểu mới, tiếp nối là giai đoạn bị phát-xít Nhật chiếm đóng trong Thế chiến thứ hai.",
      "Ngày 4/7/1946, Hiệp ước Manila có hiệu lực, Hoa Kỳ chính thức công nhận nền độc lập và quyền tự quyết của Cộng hòa Philippines.",
    ],
    milestones: ["1898", "1946"],
    editorialNote:
      "Tuyên bố độc lập năm 1898 chống Tây Ban Nha và việc Hoa Kỳ công nhận độc lập năm 1946 là hai sự kiện khác nhau, cần được phân biệt chính xác.",
  },

  {
    id: "mm",
    name: "Myanmar",
    nameEn: "Myanmar",
    title: "Độc lập từ ách thống trị thực dân Anh",
    description: [
      "Ngày 4/1/1948, Miến Điện (nay là Liên bang Myanmar) chính thức tuyên bố độc lập hoàn toàn, chấm dứt hơn 6 thập kỷ đô hộ của thực dân Anh.",
      "Tiến trình độc lập gắn liền với phong trào Thakin, Liên đoàn Tự do Nhân dân Chống Phát-xít (AFPFL) do Tướng Aung San lãnh đạo cùng các cuộc thương lượng chuyển giao quyền lực sau Thế chiến thứ hai.",
      "Hiệp định Panglong năm 1947 đặt nền móng thống nhất các sắc tộc trước khi quốc gia chính thức giành lại quyền tự quyết vào đầu năm 1948.",
    ],
    milestones: ["1947", "1948"],
  },

  {
    id: "la",
    name: "Lào",
    nameEn: "Laos",
    title: "Liên minh chiến đấu và con đường giải phóng",
    description: [
      "Ngày 12/10/1945, chính phủ kháng chiến Lao Issara tuyên bố nền độc lập của nước Lào. Sau đó, nhân dân Lào cùng liên minh chiến đấu Việt - Lào kiên cường kháng chiến chống Pháp.",
      "Hiệp định Geneva năm 1954 công nhận độc lập, chủ quyền của Lào. Ngày 2/12/1975, nước Cộng hòa Dân chủ Nhân dân Lào chính thức được thành lập, hoàn thành cuộc cách mạng dân tộc dân chủ.",
    ],
    milestones: ["1945", "1954", "1975"],
  },

  {
    id: "kh",
    name: "Campuchia",
    nameEn: "Cambodia",
    title: "Vận động ngoại giao và độc lập dân tộc",
    description: [
      "Dưới sự vận động kiên quyết của Quốc vương Norodom Sihanouk và phong trào yêu nước Khmer Issarak, ngày 9/11/1953, thực dân Pháp phải trao trả độc lập cho Vương quốc Campuchia.",
      "Hiệp định Geneva năm 1954 chính thức khẳng định chủ quyền quốc tế và toàn vẹn lãnh thổ của Campuchia trên bàn đàm phán đa phương.",
    ],
    milestones: ["1953", "1954"],
  },
];

/**
 * Bài so sánh khu vực — Giữ nguyên theo Idea.txt §6.
 */
export const COMPARISON = {
  title: "NHỮNG CON ĐƯỜNG KHÁC NHAU, MỘT KHÁT VỌNG CHUNG.",
  paragraphs: [
    "Các phong trào giải phóng dân tộc ở Đông Nam Á không diễn ra theo một khuôn mẫu duy nhất. Có nơi trải qua chiến tranh kéo dài, có nơi kết hợp đấu tranh chính trị với thương lượng, và có nơi phải tiếp tục bảo vệ nền độc lập sau khi tuyên bố thành công.",
    "Điểm chung là khát vọng tự quyết và mong muốn thoát khỏi sự thống trị từ bên ngoài.",
    "Khi so sánh với Việt Nam, cần đặt từng sự kiện trong đúng bối cảnh, tránh đồng nhất các con đường lịch sử khác nhau.",
  ],
  closingTitle: "MỘT KHU VỰC. NHIỀU HÀNH TRÌNH LỊCH SỬ.",
  closingBody:
    "Tìm hiểu lịch sử Sài Gòn cũng là cơ hội nhìn rộng hơn về phong trào giải phóng dân tộc tại Đông Nam Á, nơi mỗi dân tộc để lại dấu ấn riêng trong hành trình xây dựng nền độc lập.",
} as const;
