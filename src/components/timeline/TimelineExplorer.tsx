"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { TimelineEvent } from "@/data/types";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/anim/Reveal";
import {
  SCOPE_LABELS,
  TOPIC_LABELS,
  getEvents,
  getSiteBySlug,
  periodLabel,
  topicLabel,
} from "@/lib/content";
import {
  EMPTY_EVENT_FILTERS,
  buildEventPeriodOptions,
  buildEventScopeOptions,
  buildEventTopicOptions,
  countActiveEventFilters,
  filterEvents,
  periodOfYear,
  type EventFilters,
} from "@/lib/event-filters";
import { gsap, EASE } from "@/lib/gsap/gsap";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  DÒNG THỜI GIAN — bố cục dọc, không ghim ngang
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ── Vì sao KHÔNG dùng pinned horizontal ở đây ───────────────────────────
 *
 *  Trang chủ đã có một pinned timeline ngang đủ làm điểm nhấn. Lặp lại kỹ
 *  thuật đó ở trang nội dung sẽ biến việc đọc thành cuộn ngang — người xem
 *  phải cuộn để đọc từng mốc, mất khả năng quét nhanh toàn bộ lịch sử.
 *  Trên mobile, cuộn ngang còn xung đột trực tiếp với cuộn dọc của trang.
 *
 *  Ở đây chỉ giữ hai hiệu ứng vừa phải:
 *   1. Đường tiến trình dọc chạy theo cuộn (scrub) — cho cảm giác đang đi
 *      dọc hành trình, nhưng nội dung vẫn là cột dọc dễ đọc.
 *   2. Reveal nhẹ khi từng mốc vào khung nhìn.
 *
 *  Nội dung LUÔN hiển thị đầy đủ kể cả khi JavaScript không chạy.
 */
export function TimelineExplorer() {
  const events = useMemo(() => getEvents(), []);
  const [filters, setFilters] = useState<EventFilters>(EMPTY_EVENT_FILTERS);

  const visible = useMemo(() => filterEvents(events, filters), [events, filters]);
  const activeCount = countActiveEventFilters(filters);

  const periodOptions = useMemo(() => buildEventPeriodOptions(events), [events]);
  const topicOptions = useMemo(() => buildEventTopicOptions(events), [events]);
  const scopeOptions = useMemo(() => buildEventScopeOptions(events), [events]);

  return (
    <div>
      {/* ── Bộ lọc ──────────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Lọc cột mốc thời gian"
        className="grid gap-2 sm:grid-cols-3"
      >
        <EventSelect
          id="event-filter-period"
          label="Giai đoạn"
          value={filters.period}
          onChange={(v) =>
            setFilters((p) => ({ ...p, period: v as EventFilters["period"] }))
          }
          options={periodOptions.map((o) => ({
            value: o.value,
            label: o.label,
            count: o.count,
          }))}
        />
        <EventSelect
          id="event-filter-topic"
          label="Chủ đề"
          value={filters.topic}
          onChange={(v) => setFilters((p) => ({ ...p, topic: v }))}
          options={topicOptions.map((o) => ({
            value: o.value,
            label: TOPIC_LABELS[o.value] ?? o.value,
            count: o.count,
          }))}
        />
        <EventSelect
          id="event-filter-scope"
          label="Phạm vi"
          value={filters.scope}
          onChange={(v) =>
            setFilters((p) => ({ ...p, scope: v as EventFilters["scope"] }))
          }
          options={scopeOptions.map((o) => ({
            value: o.value,
            label: SCOPE_LABELS[o.value] ?? o.value,
            count: o.count,
          }))}
        />
      </div>

      {activeCount > 0 ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper-faint">
            <span aria-live="polite" aria-atomic="true">{visible.length} / {events.length} mốc · {activeCount} bộ lọc đang bật</span>
          </p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_EVENT_FILTERS)}
            className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-flag-bright transition-colors duration-300 hover:text-gold"
          >
            Xoá bộ lọc
          </button>
        </div>
      ) : null}

      {/* ── Danh sách mốc ───────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="Không có mốc thời gian phù hợp"
          description="Hãy xoá bộ lọc để xem lại toàn bộ dòng thời gian."
          action={
            <Button
              onClick={() => setFilters(EMPTY_EVENT_FILTERS)}
              variant="outline"
            >
              Xoá bộ lọc
            </Button>
          }
        />
      ) : (
        <ol className="relative mt-12 pl-10 sm:pl-16">
          {/* Rail dọc — trạng thái đi cùng tiến trình cuộn */}
          <RailProgress />

          {visible.map((event) => (
            <TimelineEntry key={event.id} event={event} />
          ))}
        </ol>
      )}

      {/* ── Kết thúc ────────────────────────────────────────────────── */}
      <Reveal variant="up" className="mt-20 border-t border-line pt-10">
        <h2 className="text-balance font-display text-[clamp(1.4rem,3.2vw,2.2rem)] uppercase leading-tight text-paper">
          Mỗi cột mốc là một phần của lịch sử.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
          Những sự kiện trên là các dấu mốc tiêu biểu, không thay thế toàn bộ
          tiến trình đấu tranh tại Sài Gòn. Để hiểu lịch sử đầy đủ hơn, hãy tiếp
          tục khám phá các địa điểm và tư liệu gắn với từng giai đoạn.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/ban-do">Khám phá địa chỉ đỏ</Button>
          <Button href="/" variant="outline">
            Về trang chủ
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

/**
 * Rail dọc + thanh tiến trình điều khiển bằng cuộn.
 *
 * Chỉ `scaleY` trên thanh — GPU-friendly, không gây layout shift. Tự tắt khi
 * người dùng bật giảm chuyển động.
 */
function RailProgress() {
  const barRef = useRef<HTMLSpanElement>(null);
  const motionEnabled = useMotionEnabled();

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar || !motionEnabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: EASE.linear,
          scrollTrigger: {
            trigger: bar.parentElement?.parentElement ?? bar,
            start: "top 72%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        },
      );
    }, bar);

    return () => ctx.revert();
  }, [motionEnabled]);

  return (
    <span
      aria-hidden
      className="absolute left-[7px] top-2 bottom-2 w-px bg-line-strong sm:left-[15px]"
    >
      <span
        ref={barRef}
        className="block h-full w-full origin-top scale-y-0 bg-gradient-to-b from-flag-red to-gold"
      />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function TimelineEntry({ event }: { event: TimelineEvent }) {
  const relatedSites = event.relatedSiteSlugs
    .map((slug) => getSiteBySlug(slug))
    .filter((s) => Boolean(s));

  return (
    <li className="relative pb-14 last:pb-0 sm:pb-20">
      {/* Node trên rail */}
      <span
        aria-hidden
        className="absolute -left-[34px] top-1.5 grid size-[15px] place-items-center sm:-left-[54px]"
      >
        <span className="size-[9px] rotate-45 border border-gold bg-ink" />
      </span>

      <Reveal variant="up">
        <article className="border border-line bg-ink-800/60 p-6 transition-colors duration-500 hover:border-line-strong sm:p-8">
          {/* Đầu: năm + ngày + phạm vi */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-none tabular-nums text-paper">
              {event.year}
            </span>
            {event.dateLabel ? (
              <span className="font-mono text-[0.68rem] tracking-[0.14em] text-gold">
                {event.dateLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <Badge tone="gold">{periodLabel(periodOfYear(event.year))}</Badge>
            <Badge>
              {event.scope === "toan-quoc"
                ? SCOPE_LABELS["toan-quoc"]
                : SCOPE_LABELS["sai-gon"]}
            </Badge>
            {event.topics.map((topic) => (
              <Badge key={topic} tone="flag">
                {topicLabel(topic)}
              </Badge>
            ))}
            <StatusBadge status={event.status} />
          </div>

          {/* Phase 5.5: tiêu đề trang đã là <h1>; từng mốc là phần
              tử cấp hai của trang nên dùng <h2>. */}
          <h2 className="mt-5 text-balance font-display text-[1.3rem] uppercase leading-snug text-paper">
            {event.title}
          </h2>

          <p className="mt-4 max-w-2xl text-pretty text-[0.94rem] leading-[1.8] text-paper-dim">
            {event.detailedContent}
          </p>

          {/* Điều hướng tới hồ sơ liên quan — chỉ khi thật sự có liên kết */}
          {relatedSites.length > 0 ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper-faint">
                Địa điểm liên quan
              </p>
              <ul className="mt-3 space-y-2">
                {relatedSites.map((site) => (
                  <li key={site!.id}>
                    <Link
                      href={`/ho-so/${site!.slug}`}
                      className="group inline-flex items-center gap-2 text-[0.9rem] text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                    >
                      <span className="inline-block size-1.5 rotate-45 bg-flag-red" />
                      {site!.name}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Nguồn — trung thực khi chưa có */}
          <div className="mt-6 border-t border-line pt-5">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper-faint">
              Nguồn tham khảo
            </p>
            {event.sources.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {event.sources.map((source) => (
                  <li key={source.id} className="text-[0.85rem] text-paper-mute">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-gold hover:decoration-gold"
                      >
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                    {source.publisher ? (
                      <span className="text-paper-faint"> — {source.publisher}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[0.82rem] leading-relaxed text-paper-faint">
                Đang được bổ sung. Nội dung mốc này chưa được đối chiếu với hồ
                sơ lưu trữ chính thức — vui lòng tham khảo nguồn độc lập khi sử
                dụng cho mục đích học tập.
              </p>
            )}
          </div>

          {/* Từ khoá */}
          <p className="mt-5 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
            {event.keywords.join("  ·  ")}
          </p>
        </article>
      </Reveal>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function EventSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { value: string; label: string; count: number }[];
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
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </div>
  );
}