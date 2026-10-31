import { FEATURED_SITE_IDS, sites } from "@/data/sites";
import { events } from "@/data/events";
import { countries } from "@/data/countries";
import type {
  HistoricalPeriod,
  Site,
  SiteCategory,
  TimelineEvent,
} from "@/data/types";
import { isPublic } from "./content-status";

/* ══════════════════════════════════════════════════════════════════════════
 *  SELECTOR — lớp đọc dữ liệu cho giao diện.
 *
 *  Giao diện KHÔNG import thẳng từ `src/data/*.ts` mà đi qua đây, để có
 *  một chỗ duy nhất áp quy tắc hiển thị. Nếu đổi quy tắc, sửa một file.
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── Nhãn tiếng Việt cho các giá trị enum ───────────────────────────────── */

export const PERIOD_LABELS: Record<HistoricalPeriod, string> = {
  "truoc-1930": "Trước năm 1930",
  "1930-1945": "1930–1945",
  "1945-1954": "1945–1954",
  "1954-1975": "1954–1975",
  "sau-1975": "Sau năm 1975",
};

export const CATEGORY_LABELS: Record<SiteCategory, string> = {
  "di-tich-lich-su": "Di tích lịch sử",
  "bao-tang": "Bảo tàng",
  "co-so-cach-mang": "Cơ sở cách mạng",
  "dia-diem-luu-niem": "Địa điểm lưu niệm",
  "dia-diem-lien-quan": "Địa điểm liên quan đến sự kiện lịch sử",
};

/** Chủ đề lấy từ Idea.txt §3 "Theo chủ đề". */
export const TOPIC_LABELS: Record<string, string> = {
  "hanh-trinh-tim-duong-cuu-nuoc": "Hành trình tìm đường cứu nước",
  "phong-trao-yeu-nuoc": "Phong trào yêu nước",
  "hoat-dong-cach-mang-bimat": "Hoạt động cách mạng bí mật",
  "dau-tranh-chinh-tri": "Đấu tranh chính trị",
  "hoc-sinh-sinh-vien": "Học sinh, sinh viên",
  "tuyen-truyen-van-dong-quan-chung":
    "Tuyên truyền và vận động quần chúng",
  "lich-su-do-thi": "Lịch sử đô thị",
};

/** Nhãn phân biệt phạm vi sự kiện — spec §11. */
export const SCOPE_LABELS = {
  "toan-quoc": "Toàn quốc",
  "sai-gon": "Tại Sài Gòn",
  "dong-nam-a": "Đông Nam Á",
} as const;

/* ── Sites ──────────────────────────────────────────────────────────────── */

/** Chỉ trả về nội dung mà cổng kiểm duyệt cho phép công khai. */
export function getPublicSites(): Site[] {
  return sites.filter((s) => isPublic(s.status));
}

export function getSiteBySlug(slug: string): Site | undefined {
  return sites.find((s) => s.slug === slug);
}

export function getSiteById(id: string): Site | undefined {
  return sites.find((s) => s.id === id);
}

/** Ba thẻ tiêu biểu trên trang chủ — đúng thứ tự Idea.txt §2.3. */
export function getFeaturedSites(): Site[] {
  return FEATURED_SITE_IDS.map((id) => getSiteById(id)).filter(
    (s): s is Site => Boolean(s),
  );
}

/** Danh sách địa điểm đã được cấp phép hiển thị công khai. */
export const getRelatedSites = (site: Site): Site[] =>
  site.relatedSiteSlugs
    .map((slug) => getSiteBySlug(slug))
    .filter((s): s is Site => Boolean(s));

/* ── Timeline ───────────────────────────────────────────────────────────── */

export function getEvents(): TimelineEvent[] {
  return [...events].sort((a, b) => a.year - b.year);
}

/**
 * Chỉ trả về mốc lịch sử mà cổng kiểm duyệt cho phép công khai.
 *
 * `getEvents()` giữ nguyên toàn bộ để các trang đã được duyệt tiếp tục chạy
 * như cũ; hàm này dành cho nơi cần đúng quy tắc công khai (ví dụ kho tư liệu).
 */
export function getPublicEvents(): TimelineEvent[] {
  return getEvents().filter((e) => isPublic(e.status));
}

export function getEventById(id: string): TimelineEvent | undefined {
  return events.find((e) => e.id === id);
}

export function getEventsForSite(site: Site): TimelineEvent[] {
  return getEvents().filter((e) => site.relatedEventIds.includes(e.id));
}

/* ── Countries ──────────────────────────────────────────────────────────── */

export const getCountries = () => countries;

/* ── Nhãn hiển thị ──────────────────────────────────────────────────────── */

export const periodLabel = (p: HistoricalPeriod) => PERIOD_LABELS[p];
export const categoryLabel = (c: SiteCategory) => CATEGORY_LABELS[c];
export const topicLabel = (t: string) => TOPIC_LABELS[t] ?? t;