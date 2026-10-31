import type { TimelineEvent } from "./types";

/**
 * Dòng thời gian lịch sử từ năm 1858 đến năm 1975.
 *
 * ── Nguyên tắc biên soạn (Spec §11) ───────────────────────────────────────
 *
 * 1. Phân biệt rõ sự kiện toàn quốc (`scope: "toan-quoc"`) với sự kiện trực
 *    tiếp diễn ra tại Sài Gòn (`scope: "sai-gon"`).
 * 2. Mọi mốc thời gian, diễn biến và nhân vật lịch sử đều được đối chiếu từ
 *    các nguồn có thẩm quyền (Cổng thông tin điện tử Đảng Cộng sản Việt Nam,
 *    Cổng TTĐT Chính phủ, Trang tin Điện tử Đảng bộ TP.HCM, Báo QĐND, Cục Di sản văn hóa).
 * 3. Liên kết chặt chẽ các sự kiện với hồ sơ địa điểm trong `sites.ts` thông qua `relatedSiteSlugs`.
 */
export const events: TimelineEvent[] = [
  /* ── 1858: Mở đầu cuộc kháng chiến chống Pháp ────────────────────────── */
  {
    id: "event-1858",
    year: 1858,
    dateLabel: "01 / 09 / 1858",
    title: "Thực dân Pháp nổ súng xâm lược Việt Nam",
    summary:
      "Ngày 1/9/1858, liên quân Pháp – Tây Ban Nha nổ súng tấn công bán đảo Sơn Trà (Đà Nẵng), mở đầu cuộc chiến tranh xâm lược nước ta.",
    detailedContent:
      "Sáng ngày 1/9/1858, hạm đội liên quân Pháp và Tây Ban Nha nổ súng tấn công cửa biển Đà Nẵng với âm mưu 'đánh nhanh, thắng nhanh' nhằm nhanh chóng uy hiếp triều đình Huế. Quân và dân ta dưới sự chỉ huy của danh tướng Nguyễn Tri Phương đã anh dũng kháng cự, lập phòng tuyến kiên cố cầm chân quân xâm lược suốt 5 tháng, làm phá sản hoàn toàn kế hoạch đánh nhanh thắng nhanh của địch, buộc chúng phải chuyển hướng vào Nam Kỳ.",
    topics: ["phong-trao-yeu-nuoc"],
    relatedSiteSlugs: [],
    sources: [
      {
        id: "event-1858-src-01",
        title: "Cuộc kháng chiến chống thực dân Pháp xâm lược (1858 - 1884)",
        publisher: "Báo điện tử Đảng Cộng sản Việt Nam",
        url: "https://dangcongsan.vn",
        note: "Tư liệu lịch sử Đảng: Ngày 1/9/1858 liên quân Pháp - Tây Ban Nha nổ súng tấn công Đà Nẵng, mở đầu cuộc xâm lược Việt Nam.",
      },
    ],
    keywords: ["1858", "Đà Nẵng", "Nguyễn Tri Phương", "Kháng chiến chống Pháp"],
    scope: "toan-quoc",
    status: "verified",
  },

  /* ── 1859: Pháp đánh thành Gia Định ──────────────────────────────────── */
  {
    id: "event-1859-gia-dinh",
    year: 1859,
    dateLabel: "17 / 02 / 1859",
    title: "Quân và dân Gia Định kháng cự quân xâm lược Pháp",
    summary:
      "Ngày 17/2/1859, quân Pháp tấn công đánh chiếm thành Gia Định; quân và dân Nam Kỳ kiên quyết đứng lên chiến đấu bảo vệ quê hương.",
    detailedContent:
      "Sau khi bị sa lầy ở Đà Nẵng, thực dân Pháp đưa chiến thuyền tiến vào sông Sài Gòn, bắn phá các đồn lũy Cần Giờ và rạng sáng 17/2/1859 mở cuộc công kích đánh chiếm thành Gia Định. Hộ đốc Võ Duy Ninh cùng quân dân thành phố đã chiến đấu anh dũng. Trước sự kháng cự bền bỉ của nghĩa quân các vùng phụ cận, quân Pháp không thể đóng giữ lâu dài và buộc phải đốt phá thành rồi rút xuống tàu chiến. Sự kiện này mở đầu cho phong trào kháng chiến chống Pháp oanh liệt của nhân dân đất Sài Gòn – Gia Định.",
    topics: ["phong-trao-yeu-nuoc"],
    relatedSiteSlugs: ["bao-tang-lich-su-tphcm"],
    sources: [
      {
        id: "event-1859-src-01",
        title: "Lịch sử Sài Gòn - Chợ Lớn - Gia Định kháng chiến",
        publisher: "Trang tin Điện tử Đảng bộ TP. Hồ Chí Minh",
        url: "https://hcmcpv.org.vn",
        note: "Ghi nhận trận chiến ngày 17/2/1859 tại thành Gia Định và phong trào bất khuất của nhân dân Nam Bộ chống xâm lược.",
      },
    ],
    keywords: ["1859", "Thành Gia Định", "Võ Duy Ninh", "Sài Gòn kháng chiến"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1861: Nguyễn Trung Trực đốt tàu Hy Vọng ─────────────────────────── */
  {
    id: "event-1861-nhut-tao",
    year: 1861,
    dateLabel: "10 / 12 / 1861",
    title: "Nguyễn Trung Trực chỉ huy đốt cháy chiến hạm L'Espérance",
    summary:
      "Trưa ngày 10/12/1861, nghĩa quân do Nguyễn Trung Trực chỉ huy đã tập kích bất ngờ thiêu rụi tiểu hạm L'Espérance (Hy Vọng) của Pháp trên sông Nhựt Tảo.",
    detailedContent:
      "Chiến hạm L'Espérance là một trong những tàu tuần tra bọc đồng tối tân nhất của hải quân Pháp thời điểm đó nhằm khống chế cửa ngõ Gia Định và các tỉnh Nam Bộ. Trưa ngày 10/12/1861, người anh hùng áo vải Nguyễn Trung Trực đã mưu trí ngụy trang thuyền buôn tiếp cận áp sát tàu, bất ngờ xông lên tiêu diệt địch và phóng hỏa đốt chìm chiến hạm xuống dòng sông Nhựt Tảo. Chiến công chấn động này đã cổ vũ mạnh mẽ ý chí bất khuất của nhân dân Nam Kỳ trước kẻ thù xâm lược.",
    topics: ["phong-trao-yeu-nuoc"],
    relatedSiteSlugs: [],
    sources: [
      {
        id: "event-1861-src-01",
        title: "Chiến công đốt tàu Hy Vọng trên vàm Nhựt Tảo",
        publisher: "Bảo tàng Lịch sử Quốc gia",
        url: "https://baotanglichsu.vn",
        note: "Xác nhận diễn biến ngày 10/12/1861, nghĩa quân Nguyễn Trung Trực tập kích thiêu rụi chiến hạm L'Espérance.",
      },
    ],
    keywords: ["1861", "Nguyễn Trung Trực", "Tàu Hy Vọng", "L'Espérance", "Nhựt Tảo"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1911: Hành trình tìm đường cứu nước ─────────────────────────────── */
  {
    id: "event-1911",
    year: 1911,
    dateLabel: "05 / 06 / 1911",
    title: "Hành trình tìm đường cứu nước",
    summary:
      "Ngày 5/6/1911, người thanh niên yêu nước Nguyễn Tất Thành rời Bến Nhà Rồng, bắt đầu hành trình tìm con đường giải phóng dân tộc.",
    detailedContent:
      "Ngày 5/6/1911, từ thương cảng Sài Gòn, người thanh niên yêu nước Nguyễn Tất Thành lấy tên là Văn Ba, xin làm phụ bếp trên con tàu buôn Amiral Latouche-Tréville để rời Tổ quốc. Sự kiện này mở đầu cho hành trình 30 năm bôn ba qua nhiều châu lục, vượt mọi gian nan để tìm ra con đường cứu nước, giải phóng dân tộc theo con đường cách mạng vô sản chân chính.",
    topics: ["hanh-trinh-tim-duong-cuu-nuoc"],
    relatedSiteSlugs: ["ben-nha-rong"],
    sources: [
      {
        id: "event-1911-src-01",
        title: "Bảo tàng Hồ Chí Minh - Chi nhánh Thành phố Hồ Chí Minh",
        publisher: "Bảo tàng Hồ Chí Minh - Bến Nhà Rồng",
        url: "https://bennharong.vn/",
        note: "Nguồn chính thức của bảo tàng: ngày 5/6/1911 Nguyễn Tất Thành (Văn Ba) xin làm phụ bếp trên tàu Amiral Latouche-Tréville rời thương cảng Sài Gòn ra đi tìm đường cứu nước.",
      },
      {
        id: "event-1911-src-02",
        title: "Bến Nhà Rồng",
        publisher: "Cục Du lịch Quốc gia Việt Nam",
        note: "Danh mục điểm đến của Cục Du lịch Quốc gia: ngày 5/6/1911 người thanh niên Nguyễn Tất Thành xuống tàu tại bến cảng Nhà Rồng bắt đầu hành trình cứu nước. Đường dẫn gốc hiện không truy cập được, đã tạm ẩn.",
      },
    ],
    keywords: ["1911", "Bến Nhà Rồng", "Nguyễn Tất Thành", "Văn Ba", "Latouche-Tréville"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1925: Bãi công Ba Son ───────────────────────────────────────────── */
  {
    id: "event-1925-ba-son",
    year: 1925,
    dateLabel: "Tháng 8 / 1925",
    title: "Cuộc bãi công của công nhân Ba Son",
    summary:
      "Tháng 8/1925, hơn 1.000 công nhân xưởng đóng tàu Ba Son bãi công dưới sự lãnh đạo của đồng chí Tôn Đức Thắng, kìm chân chiến hạm Pháp.",
    detailedContent:
      "Dưới sự lãnh đạo của tổ chức Công hội bí mật do đồng chí Tôn Đức Thắng sáng lập, hơn 1.000 công nhân Ba Son (Sài Gòn) đã tiến hành bãi công đòi tăng lương và kiên quyết kìm chân chiến hạm Jules Michelet của thực dân Pháp sang đàn áp cách mạng Trung Quốc. Cuộc bãi công thắng lợi rực rỡ, đánh dấu bước chuyển biến có tính bước ngoặt của phong trào công nhân Việt Nam từ tự phát sang tự giác và thể hiện tình đoàn kết quốc tế vô sản sâu sắc.",
    topics: ["phong-trao-yeu-nuoc"],
    relatedSiteSlugs: ["khu-di-tich-ba-son"],
    sources: [
      {
        id: "event-1925-src-01",
        title: "Cuộc bãi công của công nhân Ba Son tháng 8/1925",
        publisher: "Báo điện tử Đảng Cộng sản Việt Nam",
        url: "https://dangcongsan.vn",
        note: "Khẳng định ý nghĩa lịch sử của cuộc bãi công Ba Son do đồng chí Tôn Đức Thắng chỉ đạo kìm chân chiến hạm Michelet.",
      },
    ],
    keywords: ["1925", "Ba Son", "Tôn Đức Thắng", "Công hội Đỏ", "Phong trào công nhân"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1930: Thành lập Đảng Cộng sản Việt Nam ──────────────────────────── */
  {
    id: "event-1930",
    year: 1930,
    dateLabel: "03 / 02 / 1930",
    title: "Đảng Cộng sản Việt Nam ra đời",
    summary:
      "Ngày 3/2/1930, Đảng Cộng sản Việt Nam được thành lập dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc, mở ra bước ngoặt quyết định cho cách mạng Việt Nam.",
    detailedContent:
      "Từ ngày 6/1 đến đầu tháng 2/1930, tại Cửu Long (Hồng Kông, Trung Quốc), Hội nghị hợp nhất các tổ chức cộng sản đã họp dưới sự chủ trì của đồng chí Nguyễn Ái Quốc, quyết định thành lập một đảng duy nhất lấy tên là Đảng Cộng sản Việt Nam và thông qua Chánh cương vắn tắt, Sách lược vắn tắt. Ngày 3/2/1930 trở thành ngày thành lập Đảng, chấm dứt thời kỳ khủng hoảng về đường lối giải phóng dân tộc và soi đường cho phong trào cách mạng cả nước, trong đó có Sài Gòn – Chợ Lớn.",
    topics: ["phong-trao-yeu-nuoc"],
    relatedSiteSlugs: ["nga-ba-giong", "khu-di-tich-ba-son"],
    sources: [
      {
        id: "event-1930-src-01",
        title: "Hội nghị thành lập Đảng Cộng sản Việt Nam (mùa Xuân năm 1930)",
        publisher: "Báo điện tử Đảng Cộng sản Việt Nam",
        url: "https://dangcongsan.vn",
        note: "Tư liệu lịch sử Đảng về Hội nghị hợp nhất thành lập Đảng Cộng sản Việt Nam ngày 3/2/1930 do lãnh tụ Nguyễn Ái Quốc chủ trì.",
      },
    ],
    keywords: ["1930", "Thành lập Đảng", "Nguyễn Ái Quốc", "Hồng Kông"],
    scope: "toan-quoc",
    status: "verified",
  },

  /* ── 1940: Khởi nghĩa Nam Kỳ ─────────────────────────────────────────── */
  {
    id: "event-1940-nam-ky",
    year: 1940,
    dateLabel: "23 / 11 / 1940",
    title: "Cuộc Khởi nghĩa Nam Kỳ bùng nổ",
    summary:
      "Đêm 22 rạng sáng 23/11/1940, cuộc Khởi nghĩa Nam Kỳ nổ ra mạnh mẽ tại hầu khắp các tỉnh Nam Bộ; lần đầu tiên lá cờ đỏ sao vàng xuất hiện.",
    detailedContent:
      "Dưới sự lãnh đạo của Xứ ủy Nam Kỳ, nhân dân tại Sài Gòn, Chợ Lớn, Gia Định (Hóc Môn, Bà Điểm) và các tỉnh Nam Bộ đã đồng loạt đứng lên tiến công đồn bốt giặc, lập chính quyền cách mạng ở nhiều vùng nông thôn. Lần đầu tiên trong lịch sử, lá cờ đỏ sao vàng năm cánh kiêu hãnh tung bay trong các cuộc tuần hành khởi nghĩa. Dù bị thực dân Pháp đàn áp tàn khốc, cuộc Khởi nghĩa Nam Kỳ là 'tiếng súng báo hiệu cho cuộc khởi nghĩa toàn quốc', hun đúc ý chí chiến đấu quật cường cho Cách mạng Tháng Tám năm 1945.",
    topics: ["dau-tranh-chinh-tri", "phong-trao-yeu-nuoc"],
    relatedSiteSlugs: ["nga-ba-giong"],
    sources: [
      {
        id: "event-1940-src-01",
        title: "Khởi nghĩa Nam Kỳ - Bản hùng ca bất diệt",
        publisher: "Trang tin Điện tử Đảng bộ TP. Hồ Chí Minh",
        url: "https://hcmcpv.org.vn",
        note: "Tư liệu lịch sử Đảng bộ TPHCM về cuộc Khởi nghĩa Nam Kỳ ngày 23/11/1940 và sự xuất hiện thiêng liêng của cờ đỏ sao vàng.",
      },
    ],
    keywords: ["1940", "Khởi nghĩa Nam Kỳ", "Cờ đỏ sao vàng", "Hóc Môn", "Bà Điểm"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1945: Tổng khởi nghĩa Cách mạng Tháng Tám ────────────────────────── */
  {
    id: "event-1945-saigon",
    year: 1945,
    dateLabel: "25 / 08 / 1945",
    title: "Khởi nghĩa giành chính quyền thắng lợi tại Sài Gòn",
    summary:
      "Ngày 25/8/1945, hơn một triệu đồng bào Sài Gòn – Chợ Lớn và các tỉnh lân cận tổng biểu tình vũ trang giành trọn vẹn chính quyền về tay nhân dân.",
    detailedContent:
      "Tiếp nối thắng lợi vang dội của cuộc khởi nghĩa tại Hà Nội ngày 19/8/1945, đêm 24 rạng sáng 25/8/1945, dưới sự chỉ đạo của Xứ ủy Nam Kỳ, lực lượng Thanh niên Tiền phong, công nhân cùng hơn một triệu đồng bào Sài Gòn – Chợ Lớn và vùng ven rầm rộ xuống đường chiếm lĩnh các công sở huyết mạch. Sáng 25/8, Ủy ban Hành chính lâm thời Nam Bộ ra mắt đồng bào trước Dinh Đốc lý, cuộc khởi nghĩa tại Sài Gòn giành thắng lợi trọn vẹn và không đổ máu, cổ vũ mạnh mẽ phong trào toàn miền Nam.",
    topics: ["dau-tranh-chinh-tri"],
    relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh"],
    sources: [
      {
        id: "event-1945-saigon-src-01",
        title: "Cách mạng Tháng Tám năm 1945 tại Sài Gòn - Gia Định",
        publisher: "Trang tin Điện tử Đảng bộ TP. Hồ Chí Minh",
        url: "https://hcmcpv.org.vn",
        note: "Lịch sử cuộc khởi nghĩa ngày 25/8/1945 tại Sài Gòn và sự ra mắt của Ủy ban Hành chính lâm thời Nam Bộ.",
      },
    ],
    keywords: ["1945", "Khởi nghĩa Sài Gòn", "25/8/1945", "Trần Văn Giàu", "Thanh niên Tiền phong"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1945: Tuyên ngôn Độc lập ─────────────────────────────────────────── */
  {
    id: "event-1945",
    year: 1945,
    dateLabel: "02 / 09 / 1945",
    title: "Cách mạng Tháng Tám và Tuyên ngôn Độc lập",
    summary:
      "Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.",
    detailedContent:
      "Sau thắng lợi vĩ đại của Tổng khởi nghĩa Tháng Tám trong cả nước, sáng ngày 2/9/1945, trước hàng chục vạn đồng bào tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời trang trọng đọc bản Tuyên ngôn Độc lập. Cùng thời điểm đó tại Sài Gòn, hàng triệu người dân cũng mít tinh tuần hành biểu dương ý chí giữ vững nền độc lập vừa giành được.",
    topics: ["dau-tranh-chinh-tri"],
    relatedSiteSlugs: [],
    sources: [
      {
        id: "event-1945-src-01",
        title: "Tuyên ngôn Độc lập năm 1945",
        publisher: "Cổng Thông tin điện tử Chính phủ",
        url: "https://chinhphu.vn",
        note: "Toàn văn Tuyên ngôn Độc lập và giá trị lịch sử ngày Quốc khánh 2/9/1945 khai sinh nước Việt Nam Dân chủ Cộng hòa.",
      },
    ],
    keywords: ["1945", "Cách mạng Tháng Tám", "Tuyên ngôn Độc lập", "Hồ Chí Minh", "Ba Đình"],
    scope: "toan-quoc",
    status: "verified",
  },

  /* ── 1945: Nam Bộ kháng chiến ────────────────────────────────────────── */
  {
    id: "event-1945-nam-bo-khang-chien",
    year: 1945,
    dateLabel: "23 / 09 / 1945",
    title: "Ngày Nam Bộ kháng chiến bùng nổ",
    summary:
      "Rạng sáng 23/9/1945, thực dân Pháp nổ súng đánh chiếm Sài Gòn; quân và dân Nam Bộ nhất tề đứng lên kháng chiến bảo vệ nền độc lập non trẻ.",
    detailedContent:
      "Chỉ 21 ngày sau Tuyên ngôn Độc lập, được sự giúp sức của quân đội Anh, rạng sáng 23/9/1945 thực dân Pháp nổ súng tấn công các cơ quan công quyền tại Sài Gòn nhằm tái chiếm nước ta. Sáng cùng ngày, Xứ ủy và Ủy ban Kháng chiến Nam Bộ ra lời kêu gọi toàn dân kháng chiến với ý chí 'Thà chết tự do chứ không chịu làm nô lệ'. Quân dân thành phố lập các phòng tuyến chiến đấu kiên cường 'trong đánh ngoài vây', giam chân giặc suốt hơn một tháng, tạo điều kiện cho Trung ương củng cố lực lượng trường kỳ kháng chiến.",
    topics: ["phong-trao-yeu-nuoc", "dau-tranh-chinh-tri"],
    relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh"],
    sources: [
      {
        id: "event-1945-nbkc-src-01",
        title: "Nam Bộ kháng chiến - Khí phách Thành đồng Tổ quốc",
        publisher: "Báo Sài Gòn Giải Phóng",
        url: "https://sggp.org.vn",
        note: "Ghi nhận mốc son lịch sử 23/9/1945 và ý chí kiên cường của nhân dân Nam Bộ bảo vệ nền độc lập tự do.",
      },
    ],
    keywords: ["1945", "Nam Bộ kháng chiến", "23/9/1945", "Thành đồng Tổ quốc", "Sài Gòn"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1950: Phong trào học sinh, sinh viên Trần Văn Ơn ────────────────── */
  {
    id: "event-1950",
    year: 1950,
    dateLabel: "09 / 01 / 1950",
    title: "Phong trào học sinh, sinh viên Sài Gòn – Trần Văn Ơn",
    summary:
      "Ngày 9/1/1950, hàng ngàn học sinh, sinh viên Sài Gòn biểu tình phản đối áp bức; sự hy sinh của Trần Văn Ơn mở đầu Ngày truyền thống Học sinh - Sinh viên.",
    detailedContent:
      "Sáng ngày 9/1/1950, hàng ngàn học sinh sinh viên các trường Petrus Ký, Gia Long, Y Dược cùng nhân dân Sài Gòn đã tuần hành đến Dinh Thủ hiến Nam phần đòi thả các học sinh yêu nước bị bắt. Thực dân Pháp và tay sai đàn áp dã man cuộc biểu tình. Người học sinh yêu nước Trần Văn Ơn (trường Petrus Ký, chưa tròn 19 tuổi) đã dũng cảm che chở cho các học sinh nhỏ tuổi và anh dũng hy sinh. Đám tang Trần Văn Ơn ngày 12/1 biến thành cuộc biểu tình khổng lồ của đông đảo các tầng lớp nhân dân Sài Gòn. Ngày 9/1 từ đó được chọn làm Ngày truyền thống Học sinh - Sinh viên Việt Nam.",
    topics: ["hoc-sinh-sinh-vien"],
    relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh"],
    sources: [
      {
        id: "event-1950-src-01",
        title: "Lịch sử ngày Học sinh, sinh viên Việt Nam",
        publisher: "Trang tin điện tử Đảng bộ Thành phố Hồ Chí Minh",
        url: "https://hcmcpv.org.vn/tin-tuc/lich-su-ngay-hoc-sinh-sinh-vien-viet-nam-1-1491889265",
        note: "Bài tư liệu: cuộc biểu tình ngày 9/1/1950, sự hy sinh của liệt sĩ Trần Văn Ơn và lễ tang ngày 12/1/1950 với khoảng nửa triệu người tham gia.",
      },
      {
        id: "event-1950-src-02",
        title: "Kỷ niệm ngày truyền thống học sinh – sinh viên (9/1/1950 – 9/1/2013)",
        publisher: "Bảo tàng Lịch sử Quốc gia",
        url: "https://baotanglichsu.vn/vi/Articles/3097/13407/ky-niem-63-nam-ngay-truyen-thong-hoc-sinh-sinh-vien-9-1-1950-9-1-2013.html",
        note: "Lịch sử phong trào học sinh sinh viên Sài Gòn - Chợ Lớn, diễn biến ngày 9/1/1950 và lễ truy điệu Trần Văn Ơn ngày 12/1/1950.",
      },
    ],
    keywords: ["1950", "Trần Văn Ơn", "Học sinh sinh viên", "Petrus Ký", "Sài Gòn"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1954: Chiến thắng Điện Biên Phủ và Hiệp định Geneva ──────────────── */
  {
    id: "event-1954",
    year: 1954,
    dateLabel: "07 / 05 / 1954",
    title: "Chiến thắng Điện Biên Phủ và Hiệp định Geneva",
    summary:
      "Ngày 7/5/1954, Chiến dịch Điện Biên Phủ toàn thắng, dẫn đến việc ký kết Hiệp định Geneva công nhận độc lập, chủ quyền của ba nước Đông Dương.",
    detailedContent:
      "Sau 56 ngày đêm chiến đấu ngoan cường, quân và dân ta đã đập tan tập đoàn cứ điểm Điện Biên Phủ của thực dân Pháp. Chiến thắng 'lừng lẫy năm châu, chấn động địa cầu' này là đòn quyết định buộc Pháp phải ngồi vào bàn đàm phán và ký kết Hiệp định Geneva (tháng 7/1954), cam kết tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào và Campuchia, chấm dứt hoàn toàn sự thống trị của thực dân Pháp tại Đông Dương.",
    topics: ["dau-tranh-chinh-tri"],
    relatedSiteSlugs: [],
    sources: [
      {
        id: "event-1954-src-01",
        title: "Chiến thắng lịch sử Điện Biên Phủ năm 1954",
        publisher: "Báo Quân đội nhân dân",
        url: "https://qdnd.vn",
        note: "Tư liệu tổng kết chiến dịch Điện Biên Phủ và việc ký kết Hiệp định Geneva năm 1954.",
      },
    ],
    keywords: ["1954", "Điện Biên Phủ", "Hiệp định Geneva", "Đông Dương", "Kháng chiến chống Pháp"],
    scope: "toan-quoc",
    status: "verified",
  },

  /* ── 1968: Tổng tiến công và nổi dậy Tết Mậu Thân ─────────────────────── */
  {
    id: "event-1968",
    year: 1968,
    dateLabel: "Tết Mậu Thân 1968",
    title: "Tổng tiến công và nổi dậy Tết Mậu Thân",
    summary:
      "Đêm giao thừa Tết Mậu Thân 1968, quân và dân ta đồng loạt tiến công vào các mục tiêu đầu não chiến lược tại nội đô Sài Gòn và khắp miền Nam.",
    detailedContent:
      "Đêm 30 rạng sáng 31/1/1968, các lực lượng vũ trang giải phóng và Biệt động Sài Gòn đã bất ngờ đồng loạt nổ súng đánh thẳng vào các cơ quan đầu não kiên cố nhất của Mỹ và chính quyền Sài Gòn: Tòa Đại sứ Mỹ, Dinh Độc Lập, Bộ Tổng tham mưu, Đài Phát thanh, Bộ Tư lệnh Biệt khu Thủ đô. Cuộc tổng tiến công đã làm rung chuyển nước Mỹ, bẻ gãy ý chí xâm lược, buộc chính quyền Mỹ phải chấm dứt ném bom miền Bắc và chấp nhận ngồi vào bàn đàm phán tại Hội nghị Paris.",
    topics: ["dau-tranh-chinh-tri", "hoat-dong-cach-mang-bimat"],
    relatedSiteSlugs: ["dinh-doc-lap", "ham-chua-vu-khi-biet-dong-sai-gon", "bao-tang-biet-dong-sai-gon"],
    sources: [
      {
        id: "event-1968-src-01",
        title: "Bước ngoặt lịch sử Tổng tiến công và nổi dậy Xuân Mậu Thân 1968",
        publisher: "Tạp chí Quốc phòng toàn dân",
        url: "https://tapchiqptd.vn",
        note: "Khẳng định ý nghĩa chiến lược của đòn tiến công bất ngờ vào các cơ quan đầu não ở Sài Gòn làm xoay chuyển cục diện cuộc kháng chiến chống Mỹ.",
      },
    ],
    keywords: ["1968", "Tết Mậu Thân", "Biệt động Sài Gòn", "Dinh Độc Lập", "Hội nghị Paris"],
    scope: "sai-gon",
    status: "verified",
  },

  /* ── 1975: Chiến dịch Hồ Chí Minh toàn thắng ─────────────────────────── */
  {
    id: "event-1975",
    year: 1975,
    dateLabel: "30 / 04 / 1975",
    title: "Chiến dịch Hồ Chí Minh toàn thắng — Đất nước thống nhất",
    summary:
      "11 giờ 30 phút ngày 30/4/1975, cờ giải phóng tung bay trên nóc Dinh Độc Lập; Chiến dịch Hồ Chí Minh toàn thắng, non sông thu về một mối.",
    detailedContent:
      "Sáng 30/4/1975, năm cánh quân lớn của Quân đội nhân dân Việt Nam đồng loạt tiến vào trung tâm Sài Gòn. Lúc 11 giờ 30 phút ngày 30/4/1975, xe tăng của Lữ đoàn 203 tiến vào húc đổ cổng chính Dinh Độc Lập, cờ giải phóng kiêu hãnh tung bay trên nóc dinh. Tổng thống chính quyền Sài Gòn Dương Văn Minh tuyên bố đầu hàng không điều kiện. Chiến dịch Hồ Chí Minh toàn thắng, kết thúc trọn vẹn 21 năm kháng chiến chống Mỹ cứu nước và 30 năm chiến tranh giải phóng dân tộc, giang sơn thu về một mối.",
    topics: ["dau-tranh-chinh-tri"],
    relatedSiteSlugs: ["dinh-doc-lap"],
    sources: [
      {
        id: "event-1975-src-01",
        title: "Đại thắng mùa Xuân 1975 - Mốc son chói lọi trong lịch sử dân tộc",
        publisher: "Báo Quân đội nhân dân",
        url: "https://qdnd.vn",
        note: "Diễn biến ngày 30/4/1975, thời khắc cờ giải phóng tung bay trên nóc Dinh Độc Lập kết thúc thắng lợi cuộc kháng chiến chống Mỹ.",
      },
    ],
    keywords: ["1975", "Chiến dịch Hồ Chí Minh", "30/4/1975", "Dinh Độc Lập", "Thống nhất đất nước"],
    scope: "sai-gon",
    status: "verified",
  },
];
