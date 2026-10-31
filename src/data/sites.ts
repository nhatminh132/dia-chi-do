import type { Site } from "./types";

/**
 * Hồ sơ địa điểm lịch sử Sài Gòn — TP. Hồ Chí Minh.
 *
 * ── Nguyên tắc xác thực (Spec §11 & §12) ─────────────────────────────────
 *
 * 1. Mọi địa chỉ, toạ độ, số quyết định xếp hạng di tích và mốc lịch sử đều
 *    được đối chiếu với các nguồn có thẩm quyền (Cục Du lịch Quốc gia, Sở VHTT
 *    TP.HCM, Cục Di sản văn hóa, Báo QĐND, Website chính thức của Di tích).
 * 2. `coordinates`: Sử dụng toạ độ thực tế của công trình; gắn kèm `accuracy`
 *    chuẩn xác và ưu tiên `mapEmbedUrl` của Google Maps Place ID.
 * 3. `images`: Ảnh tư liệu có thật, tải về nội bộ `public/images/sites/` để
 *    tránh hotlink/phụ thuộc mạng ngoài. Ảnh chưa đối chiếu được nguồn gốc
 *    phải để `status: "needs_review"` — vẫn hiển thị công khai (xem
 *    `isPublic`) nhưng không được tính là đã xác minh.
 */

export const sites: Site[] = [
  /* ── Hồ sơ 001: Bến Nhà Rồng ─────────────────────────────────────────── */
  {
    id: "site-001",
    slug: "ben-nha-rong",
    name: "Bến Nhà Rồng",
    nameEn: "Nha Rong Wharf",
    subtitle: "DẤU MỐC TRÊN HÀNH TRÌNH TÌM ĐƯỜNG CỨU NƯỚC",
    address: "Số 1 Nguyễn Tất Thành, Phường 12, Quận 4, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7687,
      lng: 106.7054,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3919.5567305745!2d106.7016251!3d10.7686053!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fc2e03a3215%3A0x4d6f6b776d84688e!2zQuG6v24gTmjDoCBS4buTbmcgLSBC4bqjbyB0w6BuZyBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1792332548397!5m2!1svi!2s",
    period: "truoc-1930",
    category: "di-tich-lich-su",
    topics: ["hanh-trinh-tim-duong-cuu-nuoc"],
    summary:
      "Nơi gắn với sự kiện người thanh niên yêu nước Nguyễn Tất Thành ra đi tìm đường cứu nước ngày 5/6/1911. Tên chính thức hiện nay: Bảo tàng Hồ Chí Minh – Chi nhánh TP. Hồ Chí Minh.",
    historicalContext:
      "Bến Nhà Rồng nguyên là trụ sở thương cảng của Hãng vận tải đường biển Messageries Maritimes (Pháp), được khởi công xây dựng từ năm 1863 và hoàn thành vào năm 1864 với kiến trúc đặc trưng đôi rồng chầu mặt nguyệt trên nóc. Ngày 5/6/1911, người thanh niên Nguyễn Tất Thành với tên gọi Văn Ba đã lên con tàu buôn Amiral Latouche-Tréville xin làm phụ bếp, rời bến cảng Sài Gòn sang phương Tây bôn ba 30 năm tìm con đường cứu nước, giải phóng dân tộc. Sau ngày đất nước thống nhất, công trình được bảo tồn và chuyển thành Khu lưu niệm Chủ tịch Hồ Chí Minh, đến năm 1995 chính thức mang tên Bảo tàng Hồ Chí Minh – Chi nhánh TP. Hồ Chí Minh. Nơi đây hiện lưu giữ hàng ngàn tư liệu, hiện vật quý về cuộc đời hoạt động cách mạng của Bác Hồ và tình cảm sâu nặng của Người đối với đồng bào miền Nam.",
    historicalSignificance:
      "Bến Nhà Rồng là biểu tượng lịch sử thiêng liêng gắn với điểm khởi đầu hành trình cứu nước của Chủ tịch Hồ Chí Minh, là di tích kiến trúc nghệ thuật cấp Thành phố và là địa chỉ đỏ hàng đầu giáo dục truyền thống yêu nước cho các thế hệ trẻ.",
    images: [
      {
        id: "site-001-img-01",
        title: "Bến Nhà Rồng — Bảo tàng Hồ Chí Minh Chi nhánh TP.HCM",
        description:
          "Công trình kiến trúc lịch sử Bến Nhà Rồng bên bờ sông Sài Gòn, nơi Nguyễn Tất Thành xuất phát tìm đường cứu nước năm 1911.",
        mediaType: "image",
        src: "/images/sites/ben-nha-rong-01.jpg",
        alt: "Toàn cảnh tòa nhà Bến Nhà Rồng bên bờ sông Sài Gòn",
        caption: "Bến Nhà Rồng (Bảo tàng Hồ Chí Minh – Chi nhánh TP.HCM) nhìn từ phía sông Sài Gòn.",
        credit: "Wikimedia Commons / Eternal Dragon",
        license: "CC BY-SA 3.0",
        width: 539,
        height: 431,
        status: "verified",
        relatedSiteSlugs: ["ben-nha-rong"],
      },
    ],
    sources: [
      {
        id: "site-001-src-01",
        title: "Bảo tàng Hồ Chí Minh - Chi nhánh Thành phố Hồ Chí Minh",
        publisher: "Bảo tàng Hồ Chí Minh - Bến Nhà Rồng",
        url: "https://bennharong.vn/",
        note: "Nguồn chính thức của bảo tàng: xác nhận ngày 5/6/1911 Nguyễn Tất Thành (Văn Ba) lên tàu Amiral Latouche-Tréville rời thương cảng Sài Gòn; lịch sử tòa nhà từ 1863 và chức năng bảo tàng lưu niệm Chủ tịch Hồ Chí Minh.",
      },
      {
        id: "site-001-src-02",
        title: "Bến Nhà Rồng - Di tích lịch sử văn hóa",
        publisher: "Cục Du lịch Quốc gia Việt Nam",
        note: "Xác nhận vị trí di tích tại số 1 đường Nguyễn Tất Thành và ý nghĩa lịch sử của bến cảng đối với hành trình cách mạng Việt Nam. Đường dẫn gốc hiện không truy cập được, đã tạm ẩn.",
      },
    ],
    relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh", "khu-di-tich-ba-son"],
    relatedEventIds: ["event-1911"],
    status: "verified",
  },

  /* ── Hồ sơ 002: Bảo tàng Thành phố Hồ Chí Minh ───────────────────────── */
  {
    id: "site-002",
    slug: "bao-tang-thanh-pho-ho-chi-minh",
    name: "Bảo tàng Thành phố Hồ Chí Minh",
    nameEn: "Ho Chi Minh City Museum",
    subtitle: "LỊCH SỬ ĐÔ THỊ VÀ NHỮNG PHONG TRÀO ĐẤU TRANH",
    address: "65 Lý Tự Trọng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7761,
      lng: 106.6997,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.46148274368!2d106.69705697451711!3d10.775923459204035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f7e127ee995%3A0x2dcb5bd0282bae73!2zQuG6o28gdMOgbmcgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1792332798226!5m2!1svi!2s",
    period: "1945-1954",
    category: "bao-tang",
    topics: ["lich-su-do-thi", "hoc-sinh-sinh-vien"],
    summary:
      "Không gian trưng bày lịch sử hình thành, đấu tranh cách mạng của Sài Gòn – TP.HCM. Tòa dinh thự cổ từng gắn với các biến động chính trị lớn và phong trào học sinh sinh viên năm 1950.",
    historicalContext:
      "Tòa nhà được xây dựng từ năm 1885 đến 1890 theo thiết kế của kiến trúc sư người Pháp Alfred Foulhoux, nguyên là dinh Thống đốc Nam Kỳ (dinh Gia Long). Nơi đây từng chứng kiến nhiều bước ngoặt chính trị của thành phố qua các thời kỳ: Cách mạng Tháng Tám năm 1945 tại Sài Gòn, trụ sở Ủy ban Hành chánh lâm thời Nam Bộ. Đặc biệt, ngày 9/1/1950, hàng ngàn học sinh sinh viên Sài Gòn – Chợ Lớn đã tập hợp biểu tình đưa yêu sách đòi trả tự do cho học sinh bị bắt giam, dẫn đến sự hy sinh anh dũng của liệt sĩ Trần Văn Ơn. Sau năm 1975, tòa nhà trở thành Bảo tàng Cách mạng Thành phố, đến năm 1999 đổi tên thành Bảo tàng TP. Hồ Chí Minh và được công nhận là Di tích kiến trúc nghệ thuật cấp quốc gia năm 2012.",
    historicalSignificance:
      "Di tích kiến trúc nghệ thuật quốc gia lưu giữ toàn diện tiến trình lịch sử, văn hóa, kinh tế và những phong trào đấu tranh kiên cường của nhân dân và tuổi trẻ Sài Gòn trong các cuộc kháng chiến giải phóng dân tộc.",
    images: [
      {
        id: "site-002-img-01",
        title: "Bảo tàng Thành phố Hồ Chí Minh (Dinh Gia Long cũ)",
        description:
          "Kiến trúc tân cổ điển của Bảo tàng Thành phố Hồ Chí Minh tại 65 Lý Tự Trọng, Quận 1.",
        mediaType: "image",
        src: "/images/sites/bao-tang-tphcm-01.jpg",
        alt: "Mặt tiền Bảo tàng Thành phố Hồ Chí Minh tại số 65 Lý Tự Trọng",
        caption: "Mặt tiền tòa nhà Bảo tàng Thành phố Hồ Chí Minh, công trình di tích kiến trúc nghệ thuật quốc gia.",
        credit: "Wikimedia Commons / User:Gia Long Palace",
        license: "Public domain",
        width: 1024,
        height: 768,
        status: "verified",
        relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh"],
      },
    ],
    sources: [
      {
        id: "site-002-src-01",
        title: "Bảo tàng Thành phố Hồ Chí Minh",
        publisher: "Sở Văn hóa và Thể thao Thành phố Hồ Chí Minh",
        url: "https://svhtt.hochiminhcity.gov.vn/web/guest/tin-chi-tiet/-/chi-tiet/bao-tang-thanh-pho-ho-chi-minh-19637-2015.html",
        note: "Trang thông tin chính thức của Sở VHTT TP.HCM: địa chỉ 65 Lý Tự Trọng, Quận 1; xếp hạng di tích kiến trúc nghệ thuật quốc gia năm 2012; sự kiện biểu tình của học sinh sinh viên ngày 9/1/1950.",
      },
    ],
    relatedSiteSlugs: ["ben-nha-rong", "dinh-doc-lap"],
    relatedEventIds: ["event-1950", "event-1945-saigon"],
    status: "verified",
  },

  /* ── Hồ sơ 003: Cơ sở bí mật Thành ủy Sài Gòn – Gia Định ─────────────── */
  {
    id: "site-003",
    slug: "co-so-bimat-thanh-uy-sai-gon-gia-dinh",
    name: "Cơ sở bí mật Thành ủy Sài Gòn – Gia Định",
    nameEn: "Secret Base of the Saigon – Gia Dinh City Party Committee",
    subtitle: "NHỮNG ĐỊA CHỈ HOẠT ĐỘNG TRONG LÒNG ĐÔ THỊ",
    address: "91 Phạm Văn Chí, Phường 1, Quận 6, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7461,
      lng: 106.6542,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31358.789161682165!2d106.6111111743164!3d10.746145999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752e61ae4b51a7%3A0xae586023a225584!2zTmjDoCBUcnV54buBbiBUaOG7kW5nIEPDoWNoIE3huqFuZyBOZ8aw4budaSBIb2E!5e0!3m2!1svi!2s!4v1792334282486!5m2!1svi!2s",
    period: "1954-1975",
    category: "co-so-cach-mang",
    topics: ["hoat-dong-cach-mang-bimat"],
    summary:
      "Cơ sở nuôi giấu an toàn các đồng chí lãnh đạo Thành ủy Sài Gòn – Gia Định và Ban Hoa vận T4 ngay giữa lòng đô thị thời chiến tranh.",
    historicalContext:
      "Căn nhà số 91 Phạm Văn Chí nguyên là nơi ở và sản xuất của gia đình ông Lưu Vinh (Lưu Vinh Phong) – một cơ sở kinh doanh người Hoa giác ngộ cách mạng thuộc Ban Hoa vận đặc khu Sài Gòn – Chợ Lớn – Gia Định. Dưới vỏ bọc xưởng xi mạ và gia công may mặc nhộn nhịp, căn nhà đã bí mật nuôi giấu các đồng chí lãnh đạo cao cấp như Trần Bạch Đằng (Bí thư Thành ủy), Mai Chí Thọ (Ủy viên Ban Thường vụ Thành ủy) cùng các cán bộ lãnh đạo Ban Hoa vận từ cuối năm 1968 cho đến ngày 30/4/1975. Ngôi nhà được thiết kế hầm ngầm bí mật khéo léo dưới nền gác lửng và bếp, bảo đảm an toàn tuyệt đối cho đầu não lãnh đạo Thành ủy chỉ đạo các phong trào cách mạng nội đô.",
    historicalSignificance:
      "Được UBND TP.HCM xếp hạng Di tích lịch sử cấp thành phố theo Quyết định số 4377/QĐ-UBND ngày 15/10/2008. Hiện là Nhà Truyền thống Cách mạng người Hoa TP.HCM, minh chứng hùng hồn cho tinh thần yêu nước và sự đùm bọc son sắt của nhân dân lao động đối với cách mạng.",
    images: [
      {
        id: "site-003-img-01",
        title: "Cơ sở bí mật Thành ủy — 91 Phạm Văn Chí",
        description:
          "Khuôn viên di tích tại số 91 Phạm Văn Chí, Phường 1, Quận 6 — cơ sở nuôi giấu cán bộ Thành ủy Sài Gòn – Gia Định từ 1968 đến 1975.",
        mediaType: "image",
        src: "/images/sites/co-so-bimat-thanh-uy-01.jpg",
        alt: "Ngôi nhà mái ngói đỏ có sân vườn, bồn nước và cột cờ giữa sân tại di tích 91 Phạm Văn Chí",
        caption:
          "Khuôn viên di tích Cơ sở bí mật Thành ủy Sài Gòn – Gia Định, nay là Nhà Truyền thống Cách mạng người Hoa TP.HCM (Quận 6).",
        credit: "Ảnh do chủ dự án cung cấp",
        width: 1024,
        height: 640,
        status: "needs_review",
        relatedSiteSlugs: ["co-so-bimat-thanh-uy-sai-gon-gia-dinh"],
      },
    ],
    sources: [
      {
        id: "site-003-src-01",
        title: "Di tích Lịch sử cơ sở bí mật của Thành ủy Sài Gòn - Gia Định",
        publisher: "Thành đoàn Thành phố Hồ Chí Minh",
        url: "http://www.thanhdoan.hochiminhcity.gov.vn/ThanhDoan/webtd/News/7770",
        note: "Xác nhận địa chỉ 91 Phạm Văn Chí, Quyết định 4377/QĐ-UBND ngày 15/10/2008 của UBND TP.HCM xếp hạng di tích cấp thành phố; vai trò nuôi giấu cán bộ Thành ủy từ 1968 đến 1975.",
      },
    ],
    relatedSiteSlugs: ["ham-bimat-in-tai-lieu-ban-tuyen-huan-hoa-van", "ham-chua-vu-khi-biet-dong-sai-gon"],
    relatedEventIds: ["event-1968"],
    status: "verified",
  },

  /* ── Hồ sơ 004: Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận ────────── */
  {
    id: "site-004",
    slug: "ham-bimat-in-tai-lieu-ban-tuyen-huan-hoa-van",
    name: "Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận",
    nameEn: "Secret Printing Tunnel of the Hoa Van Propaganda Board",
    subtitle: "KHI TÀI LIỆU TRỞ THÀNH PHƯƠNG TIỆN ĐẤU TRANH",
    address: "341/10 đường Gia Phú, Phường 1, Quận 6, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7449,
      lng: 106.6385,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15679.460298304273!2d106.6299928457581!3d10.744880580057632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752e611a5c5555%3A0x52f24daceac68bee!2zMzQxLzEwIMSQLiBHaWEgUGjDuiwgQsOsbmggVGnDqm4sIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1792334330481!5m2!1svi!2s",
    period: "1954-1975",
    category: "co-so-cach-mang",
    topics: ["tuyen-truyen-van-dong-quan-chung"],
    summary:
      "Cơ sở in ấn tài liệu, truyền đơn và báo chí cách mạng bí mật chữ Hoa hoạt động an toàn suốt 10 năm ngay giữa nội đô Sài Gòn.",
    historicalContext:
      "Năm 1961, Ban cán sự Công vận người Hoa thành lập cơ sở in ấn tài liệu bí mật do đồng chí Lâm Tư Quang chỉ đạo. Sau khi cơ sở tại đường Gò Công bị lộ, tổ in chuyển về căn nhà số 341/10 Gia Phú vào năm 1965 và hoạt động bền bỉ đến tháng 4/1975. Căn nhà ngụy trang làm xưởng may, bên dưới đào căn hầm dài 2,2m, rộng 1,6m, sâu 1,4m với nắp hầm giấu dưới lu nước và ống thông hơi ngụy trang tài tình. Nơi đây đã xuất bản Báo Công Nhân (tiền thân Báo Sài Gòn Giải Phóng Hoa Văn), in hàng triệu tờ truyền đơn, tài liệu chỉ đạo của Trung ương Cục và Thành ủy đến nhân dân và chiến sĩ vùng Chợ Lớn – Sài Gòn.",
    historicalSignificance:
      "Được Bộ Văn hóa – Thông tin xếp hạng Di tích lịch sử cấp Quốc gia theo Quyết định số 2009/1998/QĐ-BVHTT ngày 26/9/1998. Biểu tượng cho lòng dũng cảm, sự mưu trí và đóng góp to lớn của đồng bào Hoa trong công tác tư tưởng, tuyên truyền thời chiến.",
    images: [
      {
        id: "site-004-img-01",
        title: "Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận",
        description:
          "Lối vào căn nhà số 341/10 Gia Phú, Phường 1, Quận 6 — nơi đào hầm đặt máy in tài liệu, truyền đơn bí mật từ năm 1965 đến 1975.",
        mediaType: "image",
        src: "/images/sites/ham-in-tai-lieu-hoa-van-01.jpg",
        alt: "Mặt tiền căn nhà hẹp màu vàng với cửa gỗ sơn xanh và lá cờ đỏ treo trước cửa",
        caption:
          "Căn nhà 341/10 Gia Phú (Quận 6) — cơ sở in ấn bí mật của Ban Tuyên huấn Hoa vận, nơi xuất bản Báo Công Nhân.",
        credit: "Ảnh do chủ dự án cung cấp",
        width: 740,
        height: 494,
        status: "needs_review",
        relatedSiteSlugs: ["ham-bimat-in-tai-lieu-ban-tuyen-huan-hoa-van"],
      },
    ],
    sources: [
      {
        id: "site-004-src-01",
        title: "Hầm bí mật in tài liệu của Ban Tuyên huấn Hoa vận",
        publisher: "Sở Dân tộc và Tôn giáo Thành phố Hồ Chí Minh",
        url: "https://bandantoc.hochiminhcity.gov.vn/web/bdt/ham-in",
        note: "Nguồn chính thức: lịch sử thành lập tổ in năm 1961, chuyển về 341/10 Gia Phú năm 1965 và hoạt động xuất bản báo chí cách mạng phục vụ kháng chiến.",
      },
      {
        id: "site-004-src-02",
        title: "Quyết định công nhận di tích lịch sử cấp quốc gia",
        publisher: "Bộ Văn hóa - Thông tin",
        note: "Quyết định số 2009/1998/QĐ-BVHTT ngày 26/9/1998 công nhận Hầm bí mật in tài liệu Ban Tuyên huấn Hoa vận là Di tích lịch sử cấp quốc gia.",
      },
    ],
    relatedSiteSlugs: ["co-so-bimat-thanh-uy-sai-gon-gia-dinh"],
    relatedEventIds: ["event-1968"],
    status: "verified",
  },

  /* ── Hồ sơ 005: Dinh Độc Lập ─────────────────────────────────────────── */
  {
    id: "site-005",
    slug: "dinh-doc-lap",
    name: "Dinh Độc Lập",
    nameEn: "Independence Palace",
    subtitle: "CHỨNG NHÂN CHO THỜI KHẮC TOÀN THẮNG 30/4/1975",
    address: "135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.777,
      lng: 106.6954,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.495117387229!2d106.69538807584497!3d10.77701725893769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4c3917457b%3A0x1bbfbd64190c1f2e!2zRGluaCDEkOG7mWMgTOGbpuWF!5e0!3m2!1svi!2svn!4v1719000000000!5m2!1svi!2svn",
    period: "1954-1975",
    category: "di-tich-lich-su",
    topics: ["dau-tranh-chinh-tri", "lich-su-do-thi"],
    summary:
      "Cơ quan đầu não của chính quyền Sài Gòn cũ và là nơi chứng kiến thời khắc lịch sử ngày 30/4/1975 khi cờ giải phóng tung bay, kết thúc chiến tranh, thống nhất non sông.",
    historicalContext:
      "Khởi dựng từ năm 1868 mang tên Dinh Norodom, công trình được xây dựng lại hoàn toàn từ năm 1962 đến 1966 theo bản thiết kế của Kiến trúc sư Ngô Viết Thụ mang đậm triết lý phương Đông kết hợp kiến trúc hiện đại. Trong chiến tranh, dinh là trung tâm điều hành quyền lực cao nhất của chính quyền Việt Nam Cộng hòa. Đúng 11 giờ 30 phút ngày 30/4/1975, xe tăng của Quân giải phóng húc đổ cổng chính, cắm cờ Mặt trận Dân tộc Giải phóng miền Nam Việt Nam trên nóc dinh, đánh dấu Chiến dịch Hồ Chí Minh toàn thắng, giải phóng hoàn toàn miền Nam và thống nhất đất nước.",
    historicalSignificance:
      "Di tích quốc gia đặc biệt (xếp hạng theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009 của Thủ tướng Chính phủ). Nơi ghi dấu mốc son toàn vẹn lãnh thổ và biểu tượng chiến thắng của ý chí độc lập dân tộc.",
    images: [
      {
        id: "site-005-img-01",
        title: "Dinh Độc Lập — Hội trường Thống Nhất",
        description: "Toàn cảnh mặt tiền công trình Di tích quốc gia đặc biệt Dinh Độc Lập tại Quận 1, TP.HCM.",
        mediaType: "image",
        src: "/images/sites/dinh-doc-lap-02.jpg",
        alt: "Mặt tiền Dinh Độc Lập với bồn phun nước phía trước",
        caption: "Toàn cảnh Dinh Độc Lập (Hội trường Thống Nhất) nhìn từ cổng chính đường Nam Kỳ Khởi Nghĩa.",
        credit: "Diego Delso / Wikimedia Commons",
        license: "CC BY-SA 3.0",
        width: 1920,
        height: 952,
        status: "verified",
        relatedSiteSlugs: ["dinh-doc-lap"],
      },
    ],
    sources: [
      {
        id: "site-005-src-01",
        title: "Di tích lịch sử Dinh Độc Lập",
        publisher: "Hội trường Thống Nhất — Văn phòng Chính phủ",
        url: "https://dinhdoclap.gov.vn/",
        note: "Trang chính thức của di tích: lịch sử xây dựng dinh 1962-1966 của KTS Ngô Viết Thụ; thời khắc trưa 30/4/1975 kết thúc cuộc kháng chiến chống Mỹ.",
      },
      {
        id: "site-005-src-02",
        title: "Quyết định xếp hạng Di tích quốc gia đặc biệt",
        publisher: "Thủ tướng Chính phủ",
        note: "Quyết định số 1272/QĐ-TTg ngày 12/8/2009 xếp hạng Dinh Độc Lập là Di tích lịch sử quốc gia đặc biệt.",
      },
    ],
    relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh", "ham-chua-vu-khi-biet-dong-sai-gon"],
    relatedEventIds: ["event-1975"],
    status: "verified",
  },

  /* ── Hồ sơ 006: Hầm chứa vũ khí Biệt động Sài Gòn ────────────────────── */
  {
    id: "site-006",
    slug: "ham-chua-vu-khi-biet-dong-sai-gon",
    name: "Hầm chứa vũ khí Biệt động Sài Gòn",
    nameEn: "Secret Weapons Cache of the Saigon Commando",
    subtitle: "KHO VŨ KHÍ BÍ MẬT TẤN CÔNG DINH ĐỘC LẬP TẾT MẬU THÂN 1968",
    address: "287/70 đường Nguyễn Đình Chiểu, Phường 5, Quận 3, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7767,
      lng: 106.6842,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.467776510344!2d106.68415537687847!3d10.776669959218683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f216c5ef8f9%3A0x629cb8c5a242c75a!2zMjg3LzcwIMSQLiBOZ3V54buFbiDEkMOsbmggQ2hp4buBdSwgUGjGsOG7nW5nIDUsIFF14bqtbiAzLCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn",
    period: "1954-1975",
    category: "co-so-cach-mang",
    topics: ["hoat-dong-cach-mang-bimat"],
    summary:
      "Căn hầm bí mật cách Dinh Độc Lập chỉ hơn 1 km, nơi cất giấu gần 2 tấn vũ khí cung cấp cho Đội 5 Biệt động đánh chiếm Dinh trong đợt Tết Mậu Thân 1968.",
    historicalContext:
      "Ngôi nhà do Anh hùng LLVTND Trần Văn Lai (Năm Lai) mua lại dưới vỏ bọc thầu khoán Mai Hồng Quế. Trong hai năm 1966 – 1967, ông cùng gia đình bí mật đào căn hầm kiên cố ngay dưới lòng phòng khách, gia cố chống thấm và ngụy trang nắp hầm trùng khớp với các viên gạch hoa lát nền. Gần 2 tấn vũ khí gồm súng B40, AK-47, lựu đạn, mìn và thuốc nổ TNT đã được chuyển từ căn cứ Củ Chi về cất giữ an toàn. Đêm mùng 1 rạng sáng mùng 2 Tết Mậu Thân (31/1/1968), 15 chiến sĩ Đội 5 Biệt động đã xuất phát từ đây tiến đánh Dinh Độc Lập.",
    historicalSignificance:
      "Di tích lịch sử cấp Quốc gia (công nhận theo Quyết định số 1288/VH-QĐ ngày 16/11/1988 của Bộ Văn hóa). Điểm di tích tiêu biểu thể hiện nghệ thuật quân sự độc đáo và tinh thần dũng cảm vô song của Biệt động thành.",
    images: [
      {
        id: "site-006-img-01",
        title: "Hầm chứa vũ khí 287/70 Nguyễn Đình Chiểu",
        description:
          "Mặt tiền căn nhà số 287/70 Nguyễn Đình Chiểu, Phường 5, Quận 3 — nơi đào hầm cất giấu gần 2 tấn vũ khí cho Đội 5 Biệt động Tết Mậu Thân 1968.",
        mediaType: "image",
        src: "/images/sites/ham-vu-khi-biet-dong-01.jpg",
        alt: "Cổng sắt sơn xanh và phù điêu tái hiện chiến sĩ Biệt động trên mặt tiền căn nhà số 287/70 Nguyễn Đình Chiểu",
        caption:
          "Di tích Hầm chứa vũ khí Biệt động Sài Gòn tại 287/70 Nguyễn Đình Chiểu (Quận 3), với phù điêu và bia ghi dấu di tích cấp quốc gia.",
        credit: "Ảnh do chủ dự án cung cấp",
        width: 1600,
        height: 1066,
        status: "needs_review",
        relatedSiteSlugs: ["ham-chua-vu-khi-biet-dong-sai-gon"],
      },
    ],
    sources: [
      {
        id: "site-006-src-01",
        title: "Di tích Hầm chứa vũ khí của Biệt động Sài Gòn",
        publisher: "Báo Quân đội nhân dân",
        url: "https://www.qdnd.vn",
        note: "Xác nhận lịch sử đào hầm 1966-1967 của Anh hùng Trần Văn Lai, lưu trữ gần 2 tấn vũ khí tấn công Dinh Độc Lập Tết Mậu Thân 1968.",
      },
      {
        id: "site-006-src-02",
        title: "Quyết định xếp hạng Di tích lịch sử cấp Quốc gia",
        publisher: "Bộ Văn hóa",
        note: "Quyết định số 1288/VH-QĐ ngày 16/11/1988 công nhận di tích lịch sử quốc gia.",
      },
    ],
    relatedSiteSlugs: ["dinh-doc-lap", "bao-tang-biet-dong-sai-gon"],
    relatedEventIds: ["event-1968"],
    status: "verified",
  },

  /* ── Hồ sơ 007: Khu tưởng niệm liệt sĩ Ngã Ba Giồng ──────────────────── */
  {
    id: "site-007",
    slug: "nga-ba-giong",
    name: "Khu tưởng niệm liệt sĩ Ngã Ba Giồng",
    nameEn: "Nga Ba Giong Martyrs Memorial",
    subtitle: "ĐỊA CHỈ ĐỎ KHỞI NGHĨA NAM KỲ VÀ MƯỜI TÁM THÔN VƯỜN TRẦU",
    address: "Đường Nguyễn Văn Bứa, Xã Xuân Thới Thượng, Huyện Hóc Môn, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.8675,
      lng: 106.5575,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.443358079555!2d106.55750317582695!3d10.867515289299778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b0f443b7407%3A0x6b19a557b7774e1d!2zS2h1IFTEsOG7kW5nIE5p4buHbSBMaeG7h3QgU+G7qSBOZ8OgIEJhIEdp4buWbmc!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn",
    period: "1930-1945",
    category: "di-tich-lich-su",
    topics: ["phong-trao-yeu-nuoc", "dau-tranh-chinh-tri"],
    summary:
      "Nơi ghi dấu cuộc Khởi nghĩa Nam Kỳ kiên cường năm 1940 và là trường bắn lịch sử nơi thực dân Pháp sát hại các đồng chí Tổng Bí thư Nguyễn Văn Cừ, Hà Huy Tập, Phan Đăng Lưu, Nguyễn Thị Minh Khai.",
    historicalContext:
      "Vùng đất Hóc Môn – Bà Điểm (Mười tám thôn vườn trầu) là căn cứ bí mật của Xứ ủy Nam Kỳ và Trung ương Đảng từ năm 1936 đến 1940. Đêm 22 rạng sáng 23/11/1940, cuộc Khởi nghĩa Nam Kỳ bùng nổ mạnh mẽ, lần đầu tiên xuất hiện lá cờ đỏ sao vàng. Sau khi đàn áp khởi nghĩa, thực dân Pháp biến Ngã Ba Giồng thành trường bắn tàn khốc để hành quyết các cán bộ kiên trung của Đảng và đồng bào yêu nước. Ngày 28/8/1941, các đồng chí Nguyễn Văn Cừ, Hà Huy Tập, Phan Đăng Lưu, Nguyễn Thị Minh Khai đã anh dũng hy sinh trước họng súng quân thù mà không hề nao núng.",
    historicalSignificance:
      "Di tích lịch sử cấp Quốc gia (xếp hạng theo Quyết định số 39/2002/QĐ-BVHTT ngày 30/12/2002 của Bộ Văn hóa – Thông tin). Nơi nhắc nhớ tinh thần bất khuất và sự hy sinh cao cả của các lãnh tụ tiền bối của Đảng.",
    images: [
      {
        id: "site-007-img-01",
        title: "Khu tưởng niệm Ngã Ba Giồng, Hóc Môn",
        description:
          "Khu tưởng niệm liệt sĩ Ngã Ba Giồng nhìn từ đường Nguyễn Văn Bứa, huyện Hóc Môn — nơi thực dân Pháp dùng làm trường bắn sau Khởi nghĩa Nam Kỳ 1940.",
        mediaType: "image",
        src: "/images/sites/nga-ba-giong-01.jpg",
        alt: "Cổng và khuôn viên Khu tưởng niệm liệt sĩ Ngã Ba Giồng tại Hóc Môn",
        caption:
          "Khu tưởng niệm liệt sĩ Ngã Ba Giồng (Hóc Môn, TP. Hồ Chí Minh).",
        credit: "Wikimedia Commons / TuanUt",
        license: "CC BY-SA 4.0",
        width: 1280,
        height: 1707,
        status: "verified",
        relatedSiteSlugs: ["nga-ba-giong"],
      },
    ],
    sources: [
      {
        id: "site-007-src-01",
        title: "Khu di tích lịch sử Ngã Ba Giồng",
        publisher: "UBND Huyện Hóc Môn & Cổng thông tin Thành ủy TP.HCM",
        url: "https://hcmcpv.org.vn",
        note: "Tư liệu chính thức về cuộc Khởi nghĩa Nam Kỳ ngày 23/11/1940 và trường bắn Ngã Ba Giồng nơi các đồng chí lãnh đạo Đảng hy sinh.",
      },
      {
        id: "site-007-src-02",
        title: "Quyết định xếp hạng Di tích lịch sử quốc gia",
        publisher: "Bộ Văn hóa - Thông tin",
        note: "Quyết định số 39/2002/QĐ-BVHTT ngày 30/12/2002 công nhận Ngã Ba Giồng là Di tích lịch sử cấp quốc gia.",
      },
    ],
    relatedSiteSlugs: ["bao-tang-lich-su-tphcm"],
    relatedEventIds: ["event-1940-nam-ky"],
    status: "verified",
  },

  /* ── Hồ sơ 008: Khu di tích lịch sử Ba Son ────────────────────────────── */
  {
    id: "site-008",
    slug: "khu-di-tich-ba-son",
    name: "Khu di tích lịch sử Ba Son",
    nameEn: "Ba Son Historical Site",
    subtitle: "CÁI NÔI CỦA GIAI CẤP CÔNG NHÂN VÀ PHONG TRÀO CÁCH MẠNG",
    address: "Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.777,
      lng: 106.7042,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.494539507917!2d106.7041732757271!3d10.777013559193237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f483427976b%3A0x868b209d297d025b!2zS3UgdHUgROGbuLtjIHNpLCBCYSBTb24gLSDEkOG7iyBkaeG7gXUgbMawdeK7pmltIENowqB0IHThuqNuIMSQ4buhYyBUaOG6r25n!5e0!3m2!1svn!2svn!4v1710000000000!5m2!1svn!2svn",
    period: "truoc-1930",
    category: "di-tich-lich-su",
    topics: ["phong-trao-yeu-nuoc"],
    summary:
      "Địa điểm thành lập tổ chức Công hội bí mật năm 1920 và cuộc bãi công lịch sử của hơn 1.000 công nhân Ba Son do đồng chí Tôn Đức Thắng lãnh đạo tháng 8/1925.",
    historicalContext:
      "Xưởng Ba Son được người Pháp xây dựng từ năm 1863 bên bờ sông Sài Gòn làm căn cứ sửa chữa và đóng tàu chiến. Năm 1920, đồng chí Tôn Đức Thắng sau khi trở về từ Pháp đã thành lập tổ chức Công hội bí mật tại đây – tổ chức công đoàn đầu tiên của giai cấp công nhân Việt Nam. Tháng 8/1925, cuộc bãi công lẫy lừng của công nhân xưởng Ba Son nổ ra nhằm đòi quyền lợi và kìm chân chiến hạm Jules Michelet của thực dân Pháp sang đàn áp phong trào cách mạng Trung Quốc. Đây là dấu mốc chuyển biến bước đầu từ tự phát sang tự giác của phong trào công nhân nước ta.",
    historicalSignificance:
      "Di tích lịch sử cấp Quốc gia (Quyết định số 1034-VHQĐ ngày 12/8/1993 của Bộ Văn hóa, điều chỉnh tên gọi theo Quyết định số 1269/QĐ-BVHTTDL ngày 30/3/2016). Khẳng định vai trò tiên phong của giai cấp công nhân Sài Gòn trong phong trào giải phóng dân tộc.",
    images: [
      {
        id: "site-008-img-01",
        title: "Nhà máy Ba Son nhìn từ trên không, khoảng năm 1968",
        description:
          "Ảnh chụp toàn cảnh xưởng đóng tàu Ba Son bên bờ tây sông Sài Gòn. Xưởng do người Pháp xây dựng năm 1863, là căn cứ sửa chữa và đóng tàu — nơi Công hội bí mật thành lập năm 1920 và phong trào bãi công 8/1925 nổ ra.",
        mediaType: "image",
        src: "/images/sites/ba-son-nha-may-1968-01.jpg",
        alt: "Ảnh trên không chụp nhà máy Ba Son bên bờ sông Sài Gòn khoảng năm 1968",
        caption:
          "Nhà máy Ba Son (Saigon Naval Shipyard) nhìn từ trên không, khoảng năm 1968.",
        credit: "U.S. Navy All Hands / Wikimedia Commons",
        license: "Public domain",
        width: 1530,
        height: 646,
        status: "verified",
        relatedSiteSlugs: ["khu-di-tich-ba-son"],
      },
      {
        id: "site-008-img-02",
        title: "Công nhân đóng tàu tại xưởng Ba Son, khoảng năm 1968",
        description:
          "Công nhân xưởng Ba Son đang đóng tàu thuyền. Mỗi chiếc tàu ghe hoàn thành sau khoảng bảy tuần, trong một xưởng từng là tổ hợp công nghiệp lớn nhất Đông Nam Á.",
        mediaType: "image",
        src: "/images/archive/ba-son-cong-nhan-1968-01.jpg",
        alt: "Công nhân làm việc tại xưởng đóng tàu Ba Son khoảng năm 1968",
        caption:
          "Công nhân đóng tàu tại xưởng Ba Son, khoảng năm 1968. Ảnh tư liệu.",
        credit: "U.S. Navy All Hands / Wikimedia Commons",
        license: "Public domain",
        width: 887,
        height: 569,
        status: "verified",
        relatedSiteSlugs: ["khu-di-tich-ba-son"],
      },
    ],
    sources: [
      {
        id: "site-008-src-01",
        title: "Địa điểm lưu niệm Chủ tịch Tôn Đức Thắng tại khu vực Ba Son",
        publisher: "Sở Văn hóa và Thể thao Thành phố Hồ Chí Minh",
        url: "https://svhtt.hochiminhcity.gov.vn",
        note: "Tư liệu di tích: Quyết định 1034-VHQĐ ngày 12/8/1993 và Quyết định 1269/QĐ-BVHTTDL ngày 30/3/2016 bảo vệ ụ tàu nhỏ và triền nề Ba Son.",
      },
    ],
    relatedSiteSlugs: ["ben-nha-rong"],
    relatedEventIds: ["event-1925-ba-son", "event-1930"],
    status: "verified",
  },

  /* ── Hồ sơ 009: Bảo tàng Lịch sử Thành phố Hồ Chí Minh ───────────────── */
  {
    id: "site-009",
    slug: "bao-tang-lich-su-tphcm",
    name: "Bảo tàng Lịch sử Thành phố Hồ Chí Minh",
    nameEn: "Museum of History of Ho Chi Minh City",
    subtitle: "DÒNG CHẢY HÀNG NGÀN NĂM LỊCH SỬ VĂN HÓA PHƯƠNG NAM",
    address: "Số 2 Nguyễn Bỉnh Khiêm, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7877,
      lng: 106.702,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424300305513!2d106.70196857485744!3d10.787723989363594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f48358485c3%3A0x86134b2e53efb1c9!2zQuG6oyB0w6BuZyBM4buLYyBzw7wgdGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn",
    period: "truoc-1930",
    category: "bao-tang",
    topics: ["lich-su-do-thi"],
    summary:
      "Bảo tàng đầu tiên của vùng đất Nam Bộ (thành lập năm 1929), lưu giữ hàng vạn cổ vật và tư liệu lịch sử từ thời tiền sử đến năm 1930.",
    historicalContext:
      "Tòa nhà được xây dựng từ năm 1926 đến 1929 theo phong cách kiến trúc Đông Dương kết hợp nét cung đình truyền thống do kiến trúc sư Auguste Delaval thiết kế, khánh thành với tên gọi Bảo tàng Blanchard de la Brosse. Đây là bảo tàng đầu tiên tại miền Nam Việt Nam. Nơi đây hiện lưu giữ hơn 40.000 hiện vật đặc sắc phản ánh tiến trình dựng nước và giữ nước của dân tộc Việt Nam, các nền văn hóa cổ Óc Eo, Chăm-pa, văn hóa các dân tộc phương Nam và quá trình khai phá vùng đất Gia Định – Sài Gòn.",
    historicalSignificance:
      "Di tích kiến trúc nghệ thuật cấp Quốc gia (công nhận theo Quyết định số 1207/QĐ-BVHTTDL ngày 29/3/2012 của Bộ Văn hóa, Thể thao và Du lịch). Trung tâm nghiên cứu và giáo dục di sản lịch sử văn hóa trọng điểm của phương Nam.",
    images: [
      {
        id: "site-009-img-01",
        title: "Bảo tàng Lịch sử Thành phố Hồ Chí Minh",
        description: "Kiến trúc phong cách Đông Dương của Bảo tàng Lịch sử TP.HCM tại số 2 Nguyễn Bỉnh Khiêm, Quận 1.",
        mediaType: "image",
        src: "/images/sites/bao-tang-lich-su-01.jpg",
        alt: "Kiến trúc mái vòm cổ kính của Bảo tàng Lịch sử TP.HCM",
        caption: "Kiến trúc Đông Dương đặc sắc của Bảo tàng Lịch sử TP.HCM (nguyên là Bảo tàng Blanchard de la Brosse, 1929).",
        credit: "Wikimedia Commons / Grossbildjaeger",
        license: "CC BY-SA 3.0",
        width: 2272,
        height: 1704,
        status: "verified",
        relatedSiteSlugs: ["bao-tang-lich-su-tphcm"],
      },
    ],
    sources: [
      {
        id: "site-009-src-01",
        title: "Bảo tàng Lịch sử Thành phố Hồ Chí Minh",
        publisher: "Sở Văn hóa và Thể thao Thành phố Hồ Chí Minh",
        url: "https://svhtt.hochiminhcity.gov.vn",
        note: "Xác nhận địa chỉ số 2 Nguyễn Bỉnh Khiêm, Quận 1; xếp hạng di tích kiến trúc nghệ thuật quốc gia theo Quyết định số 1207/QĐ-BVHTTDL ngày 29/3/2012.",
      },
    ],
    relatedSiteSlugs: ["bao-tang-thanh-pho-ho-chi-minh"],
    relatedEventIds: ["event-1859-gia-dinh"],
    status: "verified",
  },

  /* ── Hồ sơ 010: Bảo tàng Biệt động Sài Gòn – Gia Định ───────────────── */
  {
    id: "site-010",
    slug: "bao-tang-biet-dong-sai-gon",
    name: "Bảo tàng Biệt động Sài Gòn – Gia Định",
    nameEn: "Saigon - Gia Dinh Commando Museum",
    subtitle: "KHẮC HỌA HUYỀN THOẠI BIỆT ĐỘNG THÀNH TRONG LÒNG ĐỊCH",
    address: "145 Trần Quang Khải, Phường Tân Định, Quận 1, TP. Hồ Chí Minh",
    coordinates: {
      lat: 10.7877,
      lng: 106.6909,
      accuracy: "verified",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424169747514!2d106.69085867485746!3d10.787687559146193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f350616b64f%3A0xbcf70bfa3f064c5!2zMTQ1IMSQxrDhu51uZyBUcuG6p24gUXVhbmcgS2jhuqNpLCBUw6JuIMSQ4buLbmgsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1svn!2s!4v1729900000000!5m2!1svn!2s",
    period: "1954-1975",
    category: "bao-tang",
    topics: ["hoat-dong-cach-mang-bimat"],
    summary:
      "Bảo tàng thông minh chuyên đề đầu tiên và duy nhất tại Việt Nam vinh danh lực lượng Biệt động Sài Gòn – Gia Định với hệ thống hầm nổi, thang máy cổ và hiện vật gốc quý giá.",
    historicalContext:
      "Ngôi nhà xây dựng năm 1963 nguyên là cơ sở hoạt động bí mật của Anh hùng LLVTND Trần Văn Lai (Năm Lai) dưới sự chỉ đạo của Bộ Tư lệnh Quân khu Sài Gòn – Gia Định. Tòa nhà có cấu trúc độc đáo gồm hầm nổi trên trần nhà dùng cất giấu vàng, tiền, tài liệu và thang máy cổ từ năm 1963. Ngày 27/8/2023, Sở Văn hóa và Thể thao TP.HCM đã công bố quyết định cấp phép thành lập Bảo tàng Biệt động Sài Gòn – Gia Định tại đây, quy tụ hơn 300 hiện vật, tài liệu về các trận đánh chấn động địa cầu của lực lượng biệt động vào Dinh Độc Lập, Đại sứ quán Mỹ, Đài Phát thanh Sài Gòn.",
    historicalSignificance:
      "Bảo tàng chuyên đề ngoài công lập đầu tiên tái hiện trọn vẹn mạng lưới tình báo và biệt động thành phố, được thành lập theo Quyết định số 300/QĐ-SVHTT ngày 21/6/2023 của Sở Văn hóa và Thể thao TP. Hồ Chí Minh.",
    images: [
      {
        id: "site-010-img-01",
        title: "Bảo tàng Biệt động Sài Gòn — 145 Trần Quang Khải",
        description:
          "Mặt tiền tòa nhà tại số 145 Trần Quang Khải, Phường Tân Định, Quận 1 — nơi đặt Bảo tàng Biệt động Sài Gòn – Gia Định, nguyên là cơ sở bí mật của Anh hùng Trần Văn Lai.",
        mediaType: "image",
        src: "/images/sites/bao-tang-biet-dong-01.jpg",
        alt: "Mặt tiền tòa nhà gắn bảng hiệu Bảo tàng Biệt động Sài Gòn – Gia Định, cờ đỏ sao vàng treo trên ban công",
        caption:
          "Bảo tàng Biệt động Sài Gòn – Gia Định tại 145 Trần Quang Khải (Quận 1), khai trương ngày 27/8/2023.",
        credit: "Ảnh do chủ dự án cung cấp",
        width: 800,
        height: 700,
        status: "needs_review",
        relatedSiteSlugs: ["bao-tang-biet-dong-sai-gon"],
      },
    ],
    sources: [
      {
        id: "site-010-src-01",
        title: "Quyết định thành lập Bảo tàng Biệt động Sài Gòn - Gia Định",
        publisher: "Sở Văn hóa và Thể thao Thành phố Hồ Chí Minh",
        url: "https://hochiminhcity.gov.vn",
        note: "Quyết định số 300/QĐ-SVHTT ngày 21/6/2023 cấp giấy phép hoạt động bảo tàng ngoài công lập; lễ công bố ra mắt ngày 27/8/2023.",
      },
    ],
    relatedSiteSlugs: ["ham-chua-vu-khi-biet-dong-sai-gon", "dinh-doc-lap"],
    relatedEventIds: ["event-1968"],
    status: "verified",
  },
];

/**
 * Danh sách hiển thị ưu tiên trên trang chủ — giữ nguyên thứ tự ban đầu và mở rộng.
 */
export const FEATURED_SITE_IDS = [
  "site-001",
  "site-002",
  "site-003",
  "site-005",
] as const;
