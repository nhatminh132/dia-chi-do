import type { HistoricalPeriod, TimelineEvent } from "@/data/types";
import { PERIOD_LABELS } from "./content";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  BỘ LỌC DÒNG THỜI GIAN — logic thuần, không phụ thuộc React
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Sự kiện không lưu trường `period` (Idea.txt §12 không yêu cầu), nên giai
 *  đoạn được SUY RA từ năm theo đúng các mốc mà Idea.txt §3 liệt kê cho bộ
 *  lọc bản đồ. Hàm này là nơi duy nhất định nghĩa ranh giới — muốn đổi thì
 *  sửa một chỗ, không rải điều kiện ở component.
 */

/** Ranh giới giai đoạn. Mốc trên là biên trên, không bao gồm. */
const PERIOD_BOUNDS: { before: number; period: HistoricalPeriod }[] = [
  { before: 1930, period: "truoc-1930" },
  { before: 1945, period: "1930-1945" },
  { before: 1954, period: "1945-1954" },
  { before: 1975, period: "1954-1975" },
];

export function periodOfYear(year: number): HistoricalPeriod {
  for (const bound of PERIOD_BOUNDS) {
    if (year < bound.before) return bound.period;
  }
  return "sau-1975";
}

export interface EventFilters {
  /** `null` = không lọc theo giai đoạn. */
  period: HistoricalPeriod | null;
  /** `null` = không lọc theo chủ đề. */
  topic: string | null;
  /** `null` = không lọc theo phạm vi. */
  scope: TimelineEvent["scope"] | null;
}

export const EMPTY_EVENT_FILTERS: EventFilters = {
  period: null,
  topic: null,
  scope: null,
};

export function filterEvents(
  events: TimelineEvent[],
  filters: EventFilters,
): TimelineEvent[] {
  return events.filter((event) => {
    if (filters.period && periodOfYear(event.year) !== filters.period) return false;
    if (filters.topic && !event.topics.includes(filters.topic)) return false;
    if (filters.scope && event.scope !== filters.scope) return false;
    return true;
  });
}

export function countActiveEventFilters(filters: EventFilters): number {
  return (
    (filters.period ? 1 : 0) + (filters.topic ? 1 : 0) + (filters.scope ? 1 : 0)
  );
}

/* ── Các lựa chọn, dựng từ dữ liệu thật ──────────────────────────────── */

export function buildEventPeriodOptions(events: TimelineEvent[]) {
  const seen = new Map<HistoricalPeriod, number>();
  for (const event of events) {
    const period = periodOfYear(event.year);
    seen.set(period, (seen.get(period) ?? 0) + 1);
  }
  return [...seen.entries()]
    .map(([value, count]) => ({ value, count, label: PERIOD_LABELS[value] }))
    // Sắp theo thứ tự thời gian, không theo thứ tự Map
    .sort((a, b) => PERIOD_ORDER.indexOf(a.value) - PERIOD_ORDER.indexOf(b.value));
}

const PERIOD_ORDER: HistoricalPeriod[] = [
  "truoc-1930",
  "1930-1945",
  "1945-1954",
  "1954-1975",
  "sau-1975",
];

export function buildEventTopicOptions(events: TimelineEvent[]) {
  const seen = new Map<string, number>();
  for (const event of events) {
    for (const topic of event.topics) {
      seen.set(topic, (seen.get(topic) ?? 0) + 1);
    }
  }
  return [...seen.entries()].map(([value, count]) => ({ value, count }));
}

export function buildEventScopeOptions(events: TimelineEvent[]) {
  const seen = new Map<TimelineEvent["scope"], number>();
  for (const event of events) {
    seen.set(event.scope, (seen.get(event.scope) ?? 0) + 1);
  }
  return [...seen.entries()].map(([value, count]) => ({ value, count }));
}