import { COMPARISON, countries } from "@/data/countries";
import type { Country } from "@/data/types";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  ĐÔNG NAM Á — logic thuần cho trang `/dong-nam-a`
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Nguyên tắc: file này KHÔNG thêm bất kỳ dữ kiện lịch sử nào. Mọi câu chữ,
 *  mốc năm và ghi chú biên tập đều đến từ `src/data/countries.ts`, vốn được
 *  chuyển nguyên văn từ Idea.txt §6.
 *
 *  Nhiệm vụ của file là BIẾN ĐỔI (dải mốc liên kết, đếm số, lọc) chứ không
 *  phải KỂ CHUYỆN. Nếu sau này cần thêm câu chữ, phải sửa ở data, không sửa
 *  ở đây — nếu không sẽ thành "bản sao cạnh tranh" của sự thật lịch sử.
 */

/* ── Dải mốc liên kết ─────────────────────────────────────────────────────
 *
 * `Country.milestones` chỉ là MỘT DÃY NĂM (ví dụ `["1945", "1954", "1975"]`),
 * không kèm mô tả. Ta gộp dãy của cả bốn nước lại theo năm tăng dần để
 * người xem thấy được: cùng một năm có thể xuất hiện ở nhiều nước, và thứ tự
 * ra sao. Đây là cách làm "dễ hiểu trình tự lịch sử" mà không cần kể thêm.
 */

export interface MilestoneMark {
  /** Năm dạng số để sắp xếp. */
  year: number;
  /** Chuỗi năm nguyên bản từ data — hiển thị đúng thứ đã được duyệt. */
  label: string;
  /** id của các quốc gia có mốc này. */
  countryIds: string[];
}

export interface MilestoneBand {
  marks: MilestoneMark[];
  /** Năm nhỏ nhất và lớn nhất trong dải. */
  from: number;
  to: number;
}

/** Năm hợp lệ; bỏ qua mọi thứ không phải số để không bịa dữ liệu. */
function parseYear(label: string): number | null {
  const n = Number.parseInt(label, 10);
  return Number.isFinite(n) ? n : null;
}

export function buildMilestoneBand(list: Country[] = countries): MilestoneBand {
  const byYear = new Map<number, MilestoneMark>();

  for (const country of list) {
    for (const label of country.milestones) {
      const year = parseYear(label);
      if (year === null) continue;

      const existing = byYear.get(year);
      if (existing) {
        if (!existing.countryIds.includes(country.id)) {
          existing.countryIds.push(country.id);
        }
      } else {
        byYear.set(year, { year, label, countryIds: [country.id] });
      }
    }
  }

  const marks = [...byYear.values()].sort((a, b) => a.year - b.year);

  return {
    marks,
    from: marks.length > 0 ? marks[0].year : 0,
    to: marks.length > 0 ? marks[marks.length - 1].year : 0,
  };
}

/** Vị trí 0–1 của một năm trên dải, dùng để đặt nút trục thời gian. */
export function positionOnBand(band: MilestoneBand, year: number): number {
  if (band.marks.length <= 1) return 0;
  const span = band.to - band.from;
  if (span <= 0) return 0;
  const clamped = Math.min(Math.max(year, band.from), band.to);
  return (clamped - band.from) / span;
}

/* ── Bộ lọc quốc gia ───────────────────────────────────────────────────────
 *
 * CHỈ lọc theo quốc gia. Dữ liệu hiện có không có trường giai đoạn cho
 * `Country`, nên không dựng bộ lọc thời kỳ ở đây — làm vậy là bịa một chiều
 * dữ liệu không tồn tại. Thời kỳ chỉ xuất hiện ở `/ban-do` và `/dong-thoi-gian`
 * nơi dữ liệu thật sự có nó.
 */

export type CountryFilter = string | null;

export const EMPTY_COUNTRY_FILTER: CountryFilter = null;

export function filterCountries(
  list: Country[],
  active: CountryFilter,
): Country[] {
  if (!active) return list;
  return list.filter((c) => c.id === active);
}

export function countActiveCountryFilter(active: CountryFilter): number {
  return active ? 1 : 0;
}

/* ── Bảng so sánh ───────────────────────────────────────────────────────── */

/**
 * Chuỗi mốc của một quốc gia, dùng cho bảng so sánh: "1945 → 1949".
 * Trả về `null` nếu không có mốc nào — không thay bằng chuỗi rỗng để giao
 * diện biết phải hiện dấu "—" thay vì một dòng trống lơ lửng.
 */
export function milestoneTrail(country: Country): string | null {
  if (country.milestones.length === 0) return null;
  return country.milestones.join(" → ");
}

/** Đoạn mở đầu dùng làm câu tóm tắt trong bảng so sánh. */
export function summaryOf(country: Country): string {
  return country.description[0] ?? "";
}

export const COUNTRIES = countries;
export const REGIONAL_COMPARISON = COMPARISON;