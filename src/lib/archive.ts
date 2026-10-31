import type {
  ArchiveItem,
  ContentStatus,
  HistoricalPeriod,
  TimelineEvent,
} from "@/data/types";
import {
  PERIOD_LABELS,
  TOPIC_LABELS,
  getPublicEvents,
  getPublicSites,
} from "./content";
import { sites } from "@/data/sites";
import { isPublic } from "./content-status";
import { periodOfYear } from "./event-filters";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  KHO TƯ LIỆU — selector + bộ lọc cho trang `/tu-lieu`
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  ── Cơ sở dữ liệu dùng ở đây ────────────────────────────────────────────
 *
 *  Trang này KHÔNG có bảng dữ liệu riêng. Mọi bản ghi đều dẫn xuất từ những
 *  gì đã tồn tại sẵn trong dự án:
 *
 *    • `Site.images`      → bản ghi loại "Tư liệu" (ảnh, bản đồ, văn bản, hiện vật)
 *    • `Site.sources`     → bản ghi loại "Nguồn tham khảo"
 *    • `TimelineEvent.sources` → bản ghi loại "Nguồn tham khảo"
 *
 *  Nhờ vậy không tồn tại hai bản sao của cùng một sự kiện lịch sử: thêm một
 *  ảnh vào `sites.ts` là kho tư liệu tự có, không phải sửa hai nơi.
 *
 *  ── Quy tắc không được phá ───────────────────────────────────────────────
 *
 *  1. `content-status.ts` là cổng duy nhất. `ArchiveItem` bị chặn nếu
 *     `status` không công khai; `SourceRef` bị chặn nếu thực thể chủ sở hữu
 *     (hồ sơ hoặc mốc lịch sử) không công khai.
 *  2. KHÔNG sinh tiêu đề, URL, tác giả, ngày hay trích dẫn giả. Trường nào
 *     data chưa có thì giao diện hiện "đang được bổ sung", tuyệt đối không đoán.
 *  3. `url` chỉ render khi data thật sự có, vì đó là cam kết với người đọc.
 */

export type ArchiveRecordKind = "tai-lieu" | "nguon";

export const ARCHIVE_KIND_LABELS: Record<ArchiveRecordKind, string> = {
  "tai-lieu": "Tư liệu",
  nguon: "Nguồn tham khảo",
};

export const MEDIA_TYPE_LABELS: Record<ArchiveItem["mediaType"], string> = {
  image: "Ảnh tư liệu",
  map: "Bản đồ lịch sử",
  text: "Văn bản",
  artifact: "Hiện vật",
};

/**
 * Bản ghi hiển thị trong kho — là VIEW MODEL, không phải ki��� dữ liệu mới.
 * Nó gom trường từ nhiều nơi để giao diện chỉ cần đọc một cấu trúc.
 */
export interface ArchiveRecord {
  id: string;
  kind: ArchiveRecordKind;

  /** `SourceRef.title` hoặc `ArchiveItem.title`. */
  title: string;
  /** `ArchiveItem.description`. Nguồn tham khảo không có mô tả riêng. */
  description?: string;
  /** Chỉ có với kind "tai-lieu". */
  mediaType?: ArchiveItem["mediaType"];

  /** `ArchiveItem.dateOrPeriod`. */
  dateOrPeriod?: string;
  /** `ArchiveItem.creatorOrArchive`. */
  creatorOrArchive?: string;
  /** `SourceRef.publisher` — cơ quan phát hành. */
  publisher?: string;
  /** `ArchiveItem.caption` — chú thích dưới ảnh. */
  caption?: string;
  /** `ArchiveItem.credit` — nguồn của ảnh. */
  credit?: string;
  /** `ArchiveItem.license` — giấy phép. */
  license?: string;
  /** `SourceRef.note` — ghi chú độ tin cậy. */
  note?: string;
  /** `SourceRef.url` — chỉ có khi đã kiểm chứt. */
  url?: string;

  status: ContentStatus;

  /** Giai đoạn suy ra từ hồ sơ/mốc chủ sở hữu — dùng để lọc. */
  period: HistoricalPeriod | null;
  /** Chủ đề suy ra từ thực thể chủ sở hữu — dùng để lọc. */
  topics: string[];

  /** Liên kết tới hồ sơ địa điểm, nếu bản ghi đến từ hồ sơ. */
  siteSlug?: string;
  siteName?: string;
  /** Liên kết tới mốc dòng thời gian, nếu bản ghi đến từ mốc. */
  eventId?: string;
  eventTitle?: string;
  eventYear?: number;
}

/* ── Selector ────────────────────────────────────────────────────────────── */

function fromSiteImages(
  site: ReturnType<typeof getPublicSites>[number],
): ArchiveRecord[] {
  return site.images
    .filter((item) => isPublic(item.status))
    .map((item) => ({
      id: `${site.slug}:${item.id}`,
      kind: "tai-lieu" as const,
      title: item.title,
      description: item.description,
      mediaType: item.mediaType,
      dateOrPeriod: item.dateOrPeriod,
      creatorOrArchive: item.creatorOrArchive,
      caption: item.caption,
      credit: item.credit,
      license: item.license,
      status: item.status,
      period: site.period,
      topics: [...site.topics],
      siteSlug: site.slug,
      siteName: site.name,
    }));
}

function fromSiteSources(
  site: ReturnType<typeof getPublicSites>[number],
): ArchiveRecord[] {
  return site.sources.map((source) => ({
    id: `${site.slug}:${source.id}`,
    kind: "nguon" as const,
    title: source.title,
    publisher: source.publisher,
    url: source.url,
    note: source.note,
    // Nguồn tham khảo đi kèm hồ sơ: trạng thái lấy theo hồ sơ, vì
    // `SourceRef` không có trường `status` riêng.
    status: site.status,
    period: site.period,
    topics: [...site.topics],
    siteSlug: site.slug,
    siteName: site.name,
  }));
}

function fromEventSources(event: TimelineEvent): ArchiveRecord[] {
  return event.sources.map((source) => ({
    id: `${event.id}:${source.id}`,
    kind: "nguon" as const,
    title: source.title,
    publisher: source.publisher,
    url: source.url,
    note: source.note,
    status: event.status,
    period: periodOfYear(event.year),
    topics: [...event.topics],
    eventId: event.id,
    eventTitle: event.title,
    eventYear: event.year,
  }));
}

/**
 * Toàn bộ bản ghi công khai của kho tư liệu.
 *
 * Thứ tự: tư liệu trước, nguồn sau; trong mỗi nhóm theo thứ tự data.
 */
export function getArchiveRecords(): ArchiveRecord[] {
  const sites = getPublicSites();
  const events = getPublicEvents();

  const records: ArchiveRecord[] = [];
  for (const site of sites) records.push(...fromSiteImages(site));
  for (const site of sites) records.push(...fromSiteSources(site));
  for (const event of events) records.push(...fromEventSources(event));
  return records;
}

/* ── Bộ lọc ──────────────────────────────────────────────────────────────── */

export interface ArchiveFilters {
  /** `null` = không lọc theo loại bản ghi. */
  kind: ArchiveRecordKind | null;
  /** `null` = không lọc theo loại tư liệu (ảnh / bản đồ / văn bản / hiện vật). */
  mediaType: ArchiveItem["mediaType"] | null;
  /** `null` = không lọc theo giai đoạn. */
  period: HistoricalPeriod | null;
  /** `null` = không lọc theo chủ đề. */
  topic: string | null;
  /** `null` = không lọc theo địa điểm. */
  siteSlug: string | null;
}

export const EMPTY_ARCHIVE_FILTERS: ArchiveFilters = {
  kind: null,
  mediaType: null,
  period: null,
  topic: null,
  siteSlug: null,
};

/** Chuẩn hoá văn bản tìm kiếm: bỏ dấu tiếng Việt và hạ chữ thường. */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function haystack(record: ArchiveRecord): string {
  return normalizeText(
    [
      record.title,
      record.description,
      record.creatorOrArchive,
      record.publisher,
      record.caption,
      record.credit,
      record.note,
      record.dateOrPeriod,
      record.siteName,
      record.eventTitle,
      // Địa chỉ nguồn: người tra cứu thường gõ tên cơ quan hoặc đoạn
      // cuối của đường dẫn (ví dụ "hochiminhcity.gov.vn") để tìm đúng tài
      // liệu mà mình vừa đọc ở nơi khác. Đây là cách tra cứu tự nhiên của
      // một giao diện nghiên cứu, nên nó thuộc phạm vi tìm kiếm.
      record.url,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function filterArchiveRecords(
  records: ArchiveRecord[],
  filters: ArchiveFilters,
  query: string,
): ArchiveRecord[] {
  const q = normalizeText(query);

  return records.filter((record) => {
    if (filters.kind && record.kind !== filters.kind) return false;
    if (filters.mediaType && record.mediaType !== filters.mediaType) return false;
    if (filters.period && record.period !== filters.period) return false;
    if (filters.topic && !record.topics.includes(filters.topic)) return false;
    if (filters.siteSlug && record.siteSlug !== filters.siteSlug) return false;
    if (q && !haystack(record).includes(q)) return false;
    return true;
  });
}

export function countActiveArchiveFilters(
  filters: ArchiveFilters,
  query: string,
): number {
  return (
    (filters.kind ? 1 : 0) +
    (filters.mediaType ? 1 : 0) +
    (filters.period ? 1 : 0) +
    (filters.topic ? 1 : 0) +
    (filters.siteSlug ? 1 : 0) +
    (query.trim() ? 1 : 0)
  );
}

/* ── Lựa chọn cho bộ lọc, đếm trên chính dữ liệu ───────────────────────── */

const PERIOD_ORDER: HistoricalPeriod[] = [
  "truoc-1930",
  "1930-1945",
  "1945-1954",
  "1954-1975",
  "sau-1975",
];

function tally<V>(records: ArchiveRecord[], pick: (r: ArchiveRecord) => V[]) {
  const seen = new Map<V, number>();
  for (const record of records) {
    for (const value of pick(record)) {
      seen.set(value, (seen.get(value) ?? 0) + 1);
    }
  }
  return seen;
}

export function buildArchivePeriodOptions(records: ArchiveRecord[]) {
  return [...tally(records, (r) => (r.period ? [r.period] : []))]
    .map(([value, count]) => ({ value, count, label: PERIOD_LABELS[value] }))
    .sort(
      (a, b) => PERIOD_ORDER.indexOf(a.value) - PERIOD_ORDER.indexOf(b.value),
    );
}

export function buildArchiveTopicOptions(records: ArchiveRecord[]) {
  return [...tally(records, (r) => r.topics)]
    .map(([value, count]) => ({
      value,
      count,
      label: TOPIC_LABELS[value] ?? value,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildArchiveMediaTypeOptions(records: ArchiveRecord[]) {
  return [...tally(records, (r) => (r.mediaType ? [r.mediaType] : []))]
    .map(([value, count]) => ({
      value,
      count,
      label: MEDIA_TYPE_LABELS[value],
    }))
    .sort((a, b) => b.count - a.count);
}

export function buildArchiveSiteOptions(records: ArchiveRecord[]) {
  // slug → tên hồ sơ (giữ nguyên tên trong data, không rút gọn)
  const names = new Map<string, string>();
  for (const record of records) {
    if (!record.siteSlug || !record.siteName) continue;
    if (!names.has(record.siteSlug)) names.set(record.siteSlug, record.siteName);
  }
  const counts = tally(records, (r) => (r.siteSlug ? [r.siteSlug] : []));
  return [...names.entries()]
    .map(([value, label]) => ({ value, label, count: counts.get(value) ?? 0 }))
    .sort((a, b) => a.label.localeCompare(b.label, "vi"));
}

export function buildArchiveKindOptions(records: ArchiveRecord[]) {
  const counts = tally(records, (r) => [r.kind]);
  return (Object.keys(ARCHIVE_KIND_LABELS) as ArchiveRecordKind[])
    .map((value) => ({
      value,
      label: ARCHIVE_KIND_LABELS[value],
      count: counts.get(value) ?? 0,
    }))
    .filter((option) => option.count > 0);
}

/* ── Copy cho trạng thái rỗng ────────────────────────────────────────────── */

/** Bản ghi phải có đủ gì mới được công bố — hiển thị nguyên văn trong UI. */
export const ARCHIVE_PUBLICATION_REQUIREMENTS: { field: string; detail: string }[] = [
  {
    field: "Tiêu đề",
    detail: "Tên gọi của bản ghi, lấy từ chính tư liệu gốc.",
  },
  {
    field: "Tác giả hoặc đơn vị lưu trữ",
    detail: "Ai tạo ra hoặc đang giữ bản ghi.",
  },
  {
    field: "Thời gian hoặc thời kỳ",
    detail: "Năm, hoặc khoảng năm nếu chưa xác định chính xác.",
  },
  {
    field: "Loại tư liệu",
    detail: "Ảnh, bản đồ, văn bản hay hiện vật.",
  },
  {
    field: "Mô tả",
    detail: "Bản ghi nói gì về sự kiện mà nó minh hoạ.",
  },
  {
    field: "Nguồn và giấy phép",
    detail: "Nơi lấy tư liệu và được phép sử dụng ra sao.",
  },
];
/* ── Kiểm toán nội bộ (chỉ dev) ───────────────────────────────────────────
 *
 * Phase 5.5 §1.3 cho phép kèm một báo cáo ngắn, CHỈ dành cho người duyệt nội
 * bộ, liệt kê bản ghi nào còn thiếu trường có thể công bố. Hàm này đọc
 * `sites`/`events` THÔ để thấy cả những bản ghi đang `unpublished` —
 * điều mà `getArchiveRecords()` (vốn chỉ trả bản đã qua cổng kiểm duyệt)
 * không bao giờ thấy.
 *
 * Cố tình KHÔNG dùng trong đường render của người xem: `ArchiveExplorer`
 * chỉ gọi nó khi `process.env.NODE_ENV === "development"`.
 */

export interface ArchiveAuditRow {
  id: string;
  title: string;
  status: ContentStatus;
  /** Tên các trường còn trống, theo thứ tự ưu tiên công bố. */
  missing: string[];
}

const AUDIT_FIELDS: { field: keyof ArchiveItem; label: string }[] = [
  { field: "src", label: "Tệp ảnh" },
  { field: "creatorOrArchive", label: "Tác giả / đơn vị lưu trữ" },
  { field: "dateOrPeriod", label: "Thời gian" },
  { field: "credit", label: "Nguồn ảnh" },
  { field: "license", label: "Giấy phép" },
];

export function getArchiveAudit(): ArchiveAuditRow[] {
  const rows: ArchiveAuditRow[] = [];

  for (const site of sites) {
    for (const item of site.images) {
      rows.push({
        id: item.id,
        title: item.title,
        status: item.status,
        missing: AUDIT_FIELDS.filter(({ field }) => !item[field]).map(
          ({ label }) => label,
        ),
      });
    }
  }

  return rows.sort((a, b) => Number(isPublic(a.status)) - Number(isPublic(b.status)));
}