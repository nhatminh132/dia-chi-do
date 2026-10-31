import type { Site } from "@/data/types";
import { matchesKeywords } from "./utils";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  BỘ LỌC ĐỊA ĐIỂM — logic thuần, không phụ thuộc React
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Tách riêng khỏi component để có thể kiểm thử độc lập và dùng lại ở
 *  nhiều trang. Component chỉ gọi hàm, không chứa logic so khớp.
 *
 *  ── Quy tắc bất di bất dịch ─────────────────────────────────────────────
 *
 *  Lọc KHÔNG BAO GIỜ thay đổi việc địa điểm có được hiển thị công khai
 *  hay không. Đó là quyết định của `content-status.ts`. Bộ lọc chỉ
 *  thu hẹp tập đã được phép — không bao giờ mở rộng.
 */

export interface SiteFilters {
  /** Từ khoá tìm kiếm, đã tách theo khoảng trắng. */
  keywords: string[];
  /** `null` = không lọc theo giai đoạn. */
  period: string | null;
  /** `null` = không lọc theo chủ đề. */
  topic: string | null;
  /** `null` = không lọc theo loại địa điểm. */
  category: string | null;
}

export const EMPTY_FILTERS: SiteFilters = {
  keywords: [],
  period: null,
  topic: null,
  category: null,
};

/** Chuỗi để tìm kiếm: gộp mọi trường người dùng có thể nghĩ tới. */
function searchableText(site: Site): string {
  return [
    site.name,
    site.nameEn ?? "",
    site.subtitle ?? "",
    site.summary,
    site.address ?? "",
    site.historicalContext,
  ].join(" ");
}

export function filterSites(sites: Site[], filters: SiteFilters): Site[] {
  return sites.filter((site) => {
    if (filters.period && site.period !== filters.period) return false;
    if (filters.category && site.category !== filters.category) return false;
    if (filters.topic && !site.topics.includes(filters.topic)) return false;

    if (filters.keywords.length > 0) {
      const haystack = searchableText(site);
      if (!filters.keywords.every((kw) => matchesKeywords(haystack, [kw])))
        return false;
    }

    return true;
  });
}

/** Tách chuỗi tìm kiếm thành danh sách từ khoá đã loại khoảng trắng thừa. */
export function parseQuery(input: string): string[] {
  return input.trim().split(/\s+/).filter(Boolean);
}

/** Đếm số bộ lọc đang có hiệu lực — dùng cho nút "Xoá bộ lọc". */
export function countActiveFilters(filters: SiteFilters): number {
  return (
    (filters.period ? 1 : 0) +
    (filters.topic ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.keywords.length > 0 ? 1 : 0)
  );
}

/* ── Các lựa chọn trong bộ lọc ─────────────────────────────────────────── */

/** Danh sách giai đoạn lấy từ dữ liệu thật, không hardcode. */
export function buildPeriodOptions(sites: Site[]) {
  const seen = new Map<string, number>();
  for (const site of sites) {
    seen.set(site.period, (seen.get(site.period) ?? 0) + 1);
  }
  return [...seen.entries()].map(([value, count]) => ({ value, count }));
}

/** Danh sách chủ đề lấy từ dữ liệu thật. */
export function buildTopicOptions(sites: Site[]) {
  const seen = new Map<string, number>();
  for (const site of sites) {
    for (const topic of site.topics) {
      seen.set(topic, (seen.get(topic) ?? 0) + 1);
    }
  }
  return [...seen.entries()].map(([value, count]) => ({ value, count }));
}

/** Danh sách loại địa điểm lấy từ dữ liệu thật. */
export function buildCategoryOptions(sites: Site[]) {
  const seen = new Map<string, number>();
  for (const site of sites) {
    seen.set(site.category, (seen.get(site.category) ?? 0) + 1);
  }
  return [...seen.entries()].map(([value, count]) => ({ value, count }));
}