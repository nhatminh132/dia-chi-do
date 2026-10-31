"use client";

import { GoogleMapsView } from "@/components/map/GoogleMapsView";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { Site } from "@/data/types";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CATEGORY_LABELS,
  PERIOD_LABELS,
  TOPIC_LABELS,
  categoryLabel,
  getPublicSites,
  periodLabel,
} from "@/lib/content";
import {
  APPROXIMATE_BADGE_LABEL,
  PENDING_LABEL,
  isApproximate,
  mappableCoordinates,
  publicAddress,
} from "@/lib/content-status";
import {
  buildCategoryOptions,
  buildPeriodOptions,
  buildTopicOptions,
  countActiveFilters,
  EMPTY_FILTERS,
  filterSites,
  parseQuery,
  type SiteFilters,
} from "@/lib/site-filters";

/**
 * Bản đồ nạp động, KHÔNG render ở server.
 *
 * Leaflet chạm vào `window`/`document` ngay khi module được nạp. Nếu import
 * ở cây server thì build sẽ hỏng hoặc runtime sẽ ném lỗi. `ssr: false`
 * bảo đảm module chỉ được nạp ở client.
 *
 * Thêm nữa: nạp động còn giữ `leaflet` + `react-leaflet` ra khỏi bundle
 * ban đầu — ai không mở tới bản đồ thì không phải tải.
 */


export function MapExplorer() {
  // Chỉ địa điểm đã qua cổng kiểm duyệt — nguồn duy nhất cho toàn trang này.
  const allSites = useMemo(() => getPublicSites(), []);

  const [filters, setFilters] = useState<SiteFilters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Site | null>(null);



  const visible = useMemo(() => {
    const withQuery: SiteFilters = {
      ...filters,
      keywords: parseQuery(query),
    };
    return filterSites(allSites, withQuery);
  }, [allSites, filters, query]);

  const activeCount = countActiveFilters(filters) + (query.trim() ? 1 : 0);

  const periodOptions = useMemo(() => buildPeriodOptions(allSites), [allSites]);
  const topicOptions = useMemo(() => buildTopicOptions(allSites), [allSites]);
  const categoryOptions = useMemo(() => buildCategoryOptions(allSites), [allSites]);

  const update = useCallback(<K extends keyof SiteFilters>(key: K, value: SiteFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelected(null);
  }, []);

  const resetAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setSelected(null);
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* ══ BẢN ĐỒ ══════════════════════════════════════════════════════ */}
      <div className="lg:col-span-7">
        <div className="sticky top-24">
          <div className="relative h-[46vh] min-h-[320px] overflow-hidden border border-line lg:h-[68vh]">
            {/*
              Bản đồ chính là bản nhúng Google Maps.

              Leaflet + OpenStreetMap trước đây hay để lọt ô vuông đen khi
              tile tải hỏng — marker nằm trên nền trống và trông như lệch
              vị trí. Người xem không phân biệt được "chưa tải xong" với
              "toạ độ sai". Ở đây ưu tiên bản đồ luôn đúng và luôn tải được
              hơn là bản đồ đúng sắc thái.

              `MapCanvas` vẫn còn nguyên trong dự án, không bị xoá.
            */}
            <GoogleMapsView sites={visible} selected={selected} />
          </div>

          {/* Bản chú thích đếm số marker thật sự hiển thị.
              aria-live: bản đồ vẫn dùng được khi tile hỏng, nên số liệu này
              là thông báo duy nhất còn lại cho người dùng trình đọc màn hình. */}
          <p
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint"
          >
            {visible.filter((s) => mappableCoordinates(s) !== null).length} vị trí
            hiển thị trên bản đồ · {visible.length} địa điểm trong danh sách
          </p>
        </div>
      </div>

      {/* ══ TÌM KIẾM · BỘ LỌC · DANH SÁCH ═══════════════════════════════ */}
      <div className="lg:col-span-5">
        {/* Thanh tìm kiếm */}
        <div className="relative">
          <label htmlFor="site-search" className="sr-only">
            Tìm di tích, địa chỉ hoặc sự kiện
          </label>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-paper-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M13 13l4 4" />
          </svg>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            placeholder="Tìm tên di tích, địa chỉ hoặc sự kiện..."
            className="w-full border border-line bg-ink-800 py-3.5 pl-11 pr-4 text-[0.9rem] text-paper placeholder:text-paper-faint focus:border-gold focus:outline-none"
          />
        </div>

        {/* Bộ lọc — gom nhóm để trình đọc màn hình gọi tên được cả cụm */}
        <div
          role="group"
          aria-label="Lọc địa điểm"
          className="mt-3 grid gap-2 sm:grid-cols-3"
        >
          <FilterSelect
            id="filter-period"
            label="Giai đoạn"
            value={filters.period}
            onChange={(v) => update("period", v)}
            options={periodOptions}
            labels={PERIOD_LABELS}
          />
          <FilterSelect
            id="filter-category"
            label="Loại địa điểm"
            value={filters.category}
            onChange={(v) => update("category", v)}
            options={categoryOptions}
            labels={CATEGORY_LABELS}
          />
          <FilterSelect
            id="filter-topic"
            label="Chủ đề"
            value={filters.topic}
            onChange={(v) => update("topic", v)}
            options={topicOptions}
            labels={TOPIC_LABELS}
          />
        </div>

        {activeCount > 0 ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper-faint">
              {activeCount} bộ lọc đang bật
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-flag-bright transition-colors duration-300 hover:text-gold"
            >
              Xoá bộ lọc
            </button>
          </div>
        ) : null}

        {/* Chi tiết địa điểm đang chọn */}
        {selected ? <SelectedPanel site={selected} onClose={() => setSelected(null)} /> : null}

        {/* Danh sách — luôn dùng được kể cả khi bản đồ lỗi */}
        <div className="mt-6">
          {visible.length === 0 ? (
            <EmptyState
              title="Không tìm thấy địa điểm phù hợp"
              description="Hãy thử một từ khóa khác hoặc xoá bộ lọc để tiếp tục khám phá."
              action={
                <Button onClick={resetAll} variant="outline">
                  Xoá bộ lọc
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {visible.map((site) => (
                <SiteListItem
                  key={site.id}
                  site={site}
                  active={selected?.id === site.id}
                  onSelect={() =>
                    setSelected((prev) => (prev?.id === site.id ? null : site))
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  labels,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { value: string; count: number }[];
  labels: Record<string, string>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper-faint"
      >
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-1.5 w-full cursor-pointer border border-line bg-ink-800 px-3 py-2.5 text-[0.82rem] text-paper focus:border-gold focus:outline-none"
      >
        <option value="">Tất cả</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {labels[option.value] ?? option.value} ({option.count})
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function SiteListItem({
  site,
  active,
  onSelect,
}: {
  site: Site;
  active: boolean;
  onSelect: () => void;
}) {
  const address = publicAddress(site);
  const approximate = isApproximate(site);
  const hasMap = mappableCoordinates(site) !== null;

  return (
    <li
      className={[
        "border bg-ink-800 transition-[border-color,background-color] duration-400",
        active ? "border-flag-red bg-ink-700" : "border-line hover:border-line-strong",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={active}
        className="w-full cursor-pointer p-5 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-[1.05rem] uppercase leading-snug text-paper">
              {site.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge tone="gold">{periodLabel(site.period)}</Badge>
              <Badge>{categoryLabel(site.category)}</Badge>
              <StatusBadge status={site.status} />
            </div>
          </div>

          {/* Dấu hiệu có/không có marker — nói rõ điều này ngay trên thẻ */}
          <span
            title={
              hasMap
                ? approximate
                  ? "Có hiển thị trên bản đồ với tọa độ xấp xỉ"
                  : "Có hiển thị trên bản đồ"
                : "Chưa có tọa độ đã kiểm chứng nên không hiển thị trên bản đồ"
            }
            className={[
              "mt-1 grid size-7 shrink-0 place-items-center border",
              hasMap
                ? approximate
                  ? "border-gold/60 text-gold"
                  : "border-flag-red/70 text-flag-bright"
                : "border-line-strong text-paper-faint",
            ].join(" ")}
          >
            {hasMap ? (
              <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M10 18s6-5.6 6-10a6 6 0 10-12 0c0 4.4 6 10 6 10Z" />
                <circle cx="10" cy="8" r="2" />
              </svg>
            ) : (
              <span aria-hidden className="font-mono text-[0.6rem]">
                —
              </span>
            )}
          </span>
        </div>

        <p className="mt-3 text-pretty text-[0.85rem] leading-relaxed text-paper-mute">
          {site.summary}
        </p>

        <dl className="mt-4 space-y-1 border-t border-line pt-3 font-mono text-[0.64rem] leading-relaxed">
          <div className="flex gap-2">
            <dt className="shrink-0 text-paper-faint">Địa chỉ</dt>
            <dd className="text-paper-mute">
              {address ?? <span className="text-paper-faint">{PENDING_LABEL}</span>}
            </dd>
          </div>
          {!hasMap ? (
            <div className="flex gap-2">
              <dt className="shrink-0 text-paper-faint">Bản đồ</dt>
              <dd className="text-paper-faint">
                Chưa có tọa độ đã kiểm chứng
              </dd>
            </div>
          ) : approximate ? (
            <div className="flex gap-2">
              <dt className="shrink-0 text-gold-dim">Bản đồ</dt>
              <dd className="text-gold-dim">{APPROXIMATE_BADGE_LABEL}</dd>
            </div>
          ) : null}
        </dl>
      </button>

      {active ? (
        <div className="border-t border-line px-5 py-4">
          <p className="text-pretty text-[0.85rem] leading-relaxed text-paper-dim">
            {site.historicalSignificance}
          </p>
          <Link
            href={`/ho-so/${site.slug}`}
            className="mt-4 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-flag-bright transition-colors duration-300 hover:text-gold"
          >
            Xem hồ sơ di tích
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : null}
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function SelectedPanel({ site, onClose }: { site: Site; onClose: () => void }) {
  return (
    <div className="mt-5 border border-flag-red/50 bg-ink-800 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-flag-bright">
            Đang chọn
          </p>
          <h2 className="mt-2 font-display text-lg uppercase leading-snug text-paper">
            {site.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center text-paper-mute transition-colors duration-300 hover:text-flag-bright"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </button>
      </div>

      <p className="mt-3 text-pretty text-[0.86rem] leading-relaxed text-paper-mute">
        {site.summary}
      </p>

      <Link
        href={`/ho-so/${site.slug}`}
        className="mt-5 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-flag-bright transition-colors duration-300 hover:text-gold"
      >
        Xem hồ sơ di tích
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}