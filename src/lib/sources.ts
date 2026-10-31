import { getPublicEvents, getPublicSites } from "@/lib/content";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  DANH MỤC NGUỒN THAM KHẢO
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Gộp mọi nguồn đã kiểm chứng từ hồ sơ địa điểm và mốc thời gian về một
 * danh mục duy nhất, để người đọc kiểm chứng lại bất kỳ thông tin nào trên
 * site chỉ bằng một cú nhảy.
 *
 * ── Quy tắc ───────────────────────────────────────────────────────────────
 *
 *   • Chỉ nguồn của bản ghi `public` mới lọt vào đây. Bản ghi `draft` không
 *     bao giờ được liệt kê.
 *   • `url` là bắt buộc để một mục được coi là "có thể mở ra kiểm chứng".
 *     Mục thiếu `url` vẫn hiện, nhưng được đánh dấu rõ là chưa có đường dẫn.
 *   • `note` là phần QUAN TRỌNG NHẤT: nó ghi lại cụ thể nguồn đó xác nhận
 *     điều gì. Không có `note` thì người đọc không biết phải tin phần nào.
 */

export interface SourceEntry {
  /** Khóa ổn định để dùng làm `key` và anchor. */
  id: string;
  /** Nguồn này thuộc hồ sơ hay mốc thời gian. */
  origin: "site" | "event";
  /** Tên hồ sơ/mốc mà nguồn này xác nhận. */
  originTitle: string;
  /** Slug hồ sơ để dựng liên kết nội bộ (mốc thời gian không có slug). */
  originSlug?: string;
  /** Đường dẫn nội bộ tới bản ghi gốc. */
  originHref?: string;
  title: string;
  publisher?: string;
  url?: string;
  note?: string;
}

function collect(): SourceEntry[] {
  const entries: SourceEntry[] = [];

  for (const site of getPublicSites()) {
    for (const source of site.sources) {
      entries.push({
        id: `site:${site.slug}:${source.id}`,
        origin: "site",
        originTitle: site.name,
        originSlug: site.slug,
        originHref: `/ho-so/${site.slug}`,
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        note: source.note,
      });
    }
  }

  for (const event of getPublicEvents()) {
    for (const source of event.sources) {
      entries.push({
        id: `event:${event.id}:${source.id}`,
        origin: "event",
        originTitle: event.title,
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        note: source.note,
      });
    }
  }

  return entries;
}

/** Toàn bộ nguồn đã kiểm chứng, đã sắp xếp theo cơ quan ban hành. */
export function getSourceEntries(): SourceEntry[] {
  return collect().sort((a, b) => {
    const pa = (a.publisher ?? "").localeCompare(b.publisher ?? "", "vi");
    if (pa !== 0) return pa;
    return a.title.localeCompare(b.title, "vi");
  });
}

/** Nhóm nguồn theo cơ quan ban hành — cùng một cơ quan thì gom lại. */
export function getSourcesByPublisher(): {
  publisher: string;
  entries: SourceEntry[];
}[] {
  const groups = new Map<string, SourceEntry[]>();

  for (const entry of getSourceEntries()) {
    const key = entry.publisher ?? "Chưa rõ cơ quan ban hành";
    const list = groups.get(key);
    if (list) list.push(entry);
    else groups.set(key, [entry]);
  }

  return [...groups.entries()]
    .map(([publisher, entries]) => ({ publisher, entries }))
    .sort((a, b) => a.publisher.localeCompare(b.publisher, "vi"));
}

/** Thống kê ngắn cho phần đầu trang. */
export function getSourceStats() {
  const entries = getSourceEntries();
  return {
    total: entries.length,
    withUrl: entries.filter((entry) => entry.url).length,
    publishers: new Set(entries.map((entry) => entry.publisher).filter(Boolean)).size,
    sites: getPublicSites().filter((site) => site.sources.length > 0).length,
    events: getPublicEvents().filter((event) => event.sources.length > 0).length,
  };
}
