import type { Route } from "next";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SƠ ĐỒ PHÒNG TRIỂN LÃM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Triết lý ─────────────────────────────────────────────────────────────
 *
 * Một bảo tàng thật không có "menu". Người ta đi từ phòng này sang phòng
 * khác, và biết mình đang ở đâu bằng cách nhìn sơ đồ. Vì vậy menu ngang ở
 * đầu trang được thay bằng MỘT SƠ ĐỒ: các phòng nằm đúng chỗ trên mặt
 * bằng, có lối đi nối giữa chúng, và bạn bấm vào phòng để đi tới.
 *
 * Mỗi phòng ở đây là một ROUTE của website. Tức là "phòng triển lãm ảo" và
 * "các trang" là cùng một thứ — không có hai hệ thống song song, cũng không
 * có nội dung nào phải viết lần hai.
 *
 * ── Tọa độ trên sơ đồ ────────────────────────────────────────────────────
 *
 * Hệ toạ độ dùng CHUNG cho mọi phòng: `x`, `y` là góc trên-trái của phòng,
 * `w`, `h` là kích thước. Đơn vị là "điểm sơ đồ" (0–1000 theo chiều ngang,
 * 0–600 theo chiều dọc) — khớp với `viewBox` của SVG trong `RoomMap`.
 *
 * Nhờ vậy thêm một phòng mới chỉ cần thêm một mục vào mảng này; sơ đồ tự
 * vẽ lại, không phải sửa tay SVG.
 */

import { sites } from "./sites";

/**
 * Tập slug hồ sơ di tích có thật — dùng để phân biệt `/ho-so/<slug>`
 * (trang thật) với `/ho-so` và `/ho-so/<slug-không-tồn-tại>` (trang 404).
 *
 * Xem `roomForPath()` bên dưới để hiểu vì sao cần.
 */
const DOSSIER_SLUGS: ReadonlySet<string> = new Set(sites.map((site) => site.slug));

export interface Room {
  /** Khóa ổn định — dùng cho `key`, anchor và so sánh route hiện tại. */
  id: string;
  /** Route của phòng. */
  href: Route;
  /** Tên phòng — hiển thị trên sơ đồ và trong menu di động. */
  name: string;
  /** Tên tiếng Anh — nhãn phụ trong sơ đồ. */
  nameEn: string;
  /** Mô tả một dòng: phòng này trưng bày cái gì. */
  caption: string;
  /** Số phòng trong hành trình, hiển thị trên sơ đồ. */
  number: string;
  /** Vị trí trên sơ đồ. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Điểm "camera đứng" trong phòng — cũng là điểm neo của đường đi. */
  focus: { x: number; y: number };
}

/**
 * Các phòng, theo thứ tự hành trình của người xem.
 *
 * Bố cục trên sơ đồ là hình chữ L — đúng kiểu bảo tàng: một hành lang dài
 * nối hai dãi phòng. Người xem đi dọc hành lang và ghé các phòng.
 */
export const ROOMS: Room[] = [
  {
    id: "atrium",
    href: "/",
    name: "Sảnh chính",
    nameEn: "Atrium",
    caption: "Lời mở đầu và màn hình dẫn dắt của toàn bộ hành trình.",
    number: "00",
    x: 60,
    y: 70,
    w: 300,
    h: 200,
    focus: { x: 210, y: 170 },
  },
  {
    id: "red-address",
    href: "/ban-do",
    name: "Địa chỉ đỏ",
    nameEn: "Red Address Map",
    caption: "Bản đồ các địa điểm còn tồn tại trong thành phố hôm nay.",
    number: "01",
    x: 400,
    y: 70,
    w: 250,
    h: 200,
    focus: { x: 525, y: 170 },
  },
  {
    id: "timeline",
    href: "/dong-thoi-gian",
    name: "Dòng thời gian",
    nameEn: "Timeline",
    caption: "Các cột mốc từ 1858 đến 1975, nối thành một trục thời gian.",
    number: "02",
    x: 690,
    y: 70,
    w: 250,
    h: 200,
    focus: { x: 815, y: 170 },
  },
  {
    id: "southeast-asia",
    href: "/dong-nam-a",
    name: "Đông Nam Á",
    nameEn: "Southeast Asia",
    caption: "Bối cảnh khu vực và những phong trào đấu tranh lân cận.",
    number: "03",
    x: 690,
    y: 300,
    w: 250,
    h: 200,
    focus: { x: 815, y: 400 },
  },
  {
    id: "archive",
    href: "/tu-lieu",
    name: "Kho tư liệu",
    nameEn: "Digital Archive",
    caption: "Ảnh, bản đồ, văn bản và hiện vật — kèm trạng thái kiểm chứng.",
    number: "04",
    x: 400,
    y: 300,
    w: 250,
    h: 200,
    focus: { x: 525, y: 400 },
  },
  {
    id: "sources",
    href: "/nguon-tham-khao",
    name: "Nguồn tham khảo",
    nameEn: "Sources",
    caption: "Mọi thông tin đều dẫn về một nơi có thể mở ra kiểm chứng.",
    number: "05",
    x: 60,
    y: 300,
    w: 300,
    h: 200,
    focus: { x: 210, y: 400 },
  },
  {
    id: "quiz",
    href: "/thu-thach",
    name: "Thử thách",
    nameEn: "Quiz",
    caption: "Mười hai câu hỏi rút ra từ chính những hồ sơ đã kiểm chứng.",
    number: "06",
    x: 400,
    y: 540,
    w: 250,
    h: 150,
    focus: { x: 525, y: 615 },
  },
  {
    id: "about",
    href: "/gioi-thieu",
    name: "Giới thiệu",
    nameEn: "About",
    caption: "Về dự án, về cách kiểm chứng và về cách dùng tài liệu này.",
    number: "07",
    x: 690,
    y: 540,
    w: 250,
    h: 150,
    focus: { x: 815, y: 615 },
  },
];

/** Khung bao của toàn bộ sơ đồ — dùng làm `viewBox` cho SVG. */
export const PLAN_VIEWBOX = { x: 0, y: 0, w: 1000, h: 730 };

/**
 * Các hành lang nối các dãi phòng — tọa độ y trên sơ đồ.
 *
 * Khi đường đi phải chuyển từ dãi này sang dãi khác, người xem đi xuống
 * hành lang rồi mới đi ngang, chứ không đi xuyên qua phòng.
 */
const CORRIDORS = [286, 521];

/**
 * Đường đi của khách — chuỗi toạ độ SVG cho `polyline`.
 *
 * Suy ra từ `ROOMS` chứ không viết tay: thêm/bớt một phòng thì đường đi tự
 * đúng. Điểm neo của mỗi phòng là `room.focus`.
 */
export const PLAN_PATH: string = (() => {
  const points: Array<{ x: number; y: number }> = [];

  ROOMS.forEach((room, index) => {
    const here = room.focus;

    if (index === 0) {
      points.push(here);
      return;
    }

    const previous = ROOMS[index - 1].focus;

    // Khác dãi phòng → phải đi qua hành lang.
    if (previous.y !== here.y) {
      const corridor =
        CORRIDORS.find((c) => c > previous.y && c < here.y) ??
        (previous.y + here.y) / 2;

      points.push({ x: previous.x, y: corridor });
      points.push({ x: here.x, y: corridor });
    }

    points.push(here);
  });

  return points.map((p) => `${p.x},${p.y}`).join(" ");
})();

/** Tìm phòng theo route hiện tại. */
export function roomByHref(href: string): Room | undefined {
  return ROOMS.find((room) => room.href === href);
}

/**
 * Phòng "đang ở" theo pathname.
 *
 * Route con (ví dụ `/ho-so/ben-nha-rong`) không khớp phòng nào, nên ta dùng
 * tiền tố: `/ho-so/...` sẽ rơi về phòng "Địa chỉ đỏ" — vì các hồ sơ di
 * tích chính là nơi mở rộng của bản đồ địa chỉ đỏ.
 *
 * ── Vì sao KHÔNG dùng `startsWith` ─────────────────────────────────────
 *
 * `/ho-so` (không có slug) là route 404, và `/ho-so/<slug-không-tồn-tại>`
 * cũng 404. Nếu ta khớp bằng tiền tố, client sẽ vẽ badge phòng cho các
 * URL 404 đó, còn server thì không vẽ — lệch nhau → React báo lỗi hydration
 * #418. (Server render trang `not-found` ở gốc nên `usePathname()` trả về
 * một pathname khác, ví dụ `/404`, còn client thấy đúng `/ho-so`.)
 *
 * Vì vậy chỉ khi slug là hồ sơ CÓ THẬT mới coi như đang ở phòng "Địa chỉ
 * đỏ". Mọi URL 404 còn lại trả về `undefined` — giống nhau trên server và
 * client, nên không còn chỗ nào để lệch.
 */
export function roomForPath(pathname: string): Room | undefined {
  const exact = roomByHref(pathname);
  if (exact) return exact;

  // Hồ sơ di tích: `/ho-so/<slug>` — chỉ khi slug có thật trong kho dữ liệu.
  const dossier = /^\/ho-so\/([^/]+)\/?$/.exec(pathname);
  if (dossier && DOSSIER_SLUGS.has(dossier[1])) {
    return ROOMS.find((room) => room.id === "red-address");
  }

  return undefined;
}
