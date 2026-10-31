"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TickedRule } from "@/components/media/CinematicPlate";
import { getPublicEvents, getPublicSites } from "@/lib/content";
import {
  ARCHIVE_PUBLICATION_REQUIREMENTS,
  EMPTY_ARCHIVE_FILTERS,
  buildArchiveKindOptions,
  buildArchiveMediaTypeOptions,
  buildArchivePeriodOptions,
  buildArchiveSiteOptions,
  buildArchiveTopicOptions,
  countActiveArchiveFilters,
  filterArchiveRecords,
  getArchiveAudit,
  getArchiveRecords,
  type ArchiveFilters,
} from "@/lib/archive";
import { cn } from "@/lib/utils";

/**
 * Kho tư liệu — tìm kiếm, lọc và hiển thị bản ghi.
 *
 * ── Về trạng thái dữ liệu hiện tại ────────────────────────────────────────
 *
 * Toàn bộ bộ máy dưới đây chạy trên dữ liệu thật và sẽ có đầy đủ giao diện
 * ngay khi `src/data/*.ts` có tư liệu và nguồn đã qua kiểm chứng. Ở thời điểm
 * hiện tại, CỐ Ý ĐỂ DANH SÁCH RỖNG và hiện trạng thái "đang kiểm chứng",
 * thay vì:
 *
 *   • bịa thêm bản ghi cho đầy trang,
 *   • hoặc đổ tiêu đề, tác giả, URL lấy từ trí nhớ.
 *
 * Cổng kiểm duyệt trong `content-status.ts` là nơi duy nhất quyết định bản ghi
 * nào được công bố; file này không tự kiểm tra `status` rải rác.
 */
export function ArchiveExplorer() {
  const all = useMemo(() => getArchiveRecords(), []);
  const [filters, setFilters] = useState<ArchiveFilters>(EMPTY_ARCHIVE_FILTERS);
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () => filterArchiveRecords(all, filters, query),
    [all, filters, query],
  );

  const activeCount = countActiveArchiveFilters(filters, query);

  const options = useMemo(
    () => ({
      kind: buildArchiveKindOptions(all),
      mediaType: buildArchiveMediaTypeOptions(all),
      period: buildArchivePeriodOptions(all),
      topic: buildArchiveTopicOptions(all),
      site: buildArchiveSiteOptions(all),
    }),
    [all],
  );

  const update = <K extends keyof ArchiveFilters>(
    key: K,
    value: ArchiveFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetAll = () => {
    setFilters(EMPTY_ARCHIVE_FILTERS);
    setQuery("");
  };

  return (
    <div>
      {/* ── Tìm kiếm + bộ lọc ─────────────────────────────────────────── */}
      {/* Bảng lọc LUÔN hiện, kể cả khi kho còn trống: đó là cách người đọc
          thấy được những chiều lọc sẽ dùng, và giữ bố cục không nhảy khi dữ
          liệu được bổ sung sau này. Khi chưa có bản ghi thì các điều khiển bị
          khoá lại và có chú thích nói rõ vì sao. */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <label
            htmlFor="archive-search"
            className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper-faint"
          >
            Tìm trong kho
          </label>
          <div className="relative mt-1.5">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-paper-faint"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={all.length === 0}
              aria-describedby="archive-search-hint"
              placeholder={
                all.length === 0
                  ? "Kho đang được kiểm chứng"
                  : "Tiêu đề, cơ quan xuất bản, tác giả, đường dẫn…"
              }
              className="w-full border border-line bg-ink-800 py-2.5 pl-10 pr-3 text-[0.85rem] text-paper placeholder:text-paper-faint focus:border-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {/* Mô tả dùng chung cho ô tìm và nhóm lọc: nói rõ vì sao điều khiển
              bị khoá khi kho còn trống, để trình đọc màn hình không gặp một
              trường "chết" mà không có lý do. */}
          <p id="archive-search-hint" className="sr-only">
            {all.length === 0
              ? "Kho tư liệu hiện chưa có bản ghi đã kiểm chứng nên chưa tìm kiếm được. Xem mục trạng thái kiểm chứng bên dưới."
              : "Tìm trong tiêu đề, tác giả, đơn vị lưu trữ và nội dung tóm tắt của các bản ghi đã công bố."}
          </p>
        </div>

        {/* Nhóm lọc: dùng role="group" + aria-label để trình đọc màn hình gọi
            tên được cả cụm thay vì đọc lơ lửng năm ô select. */}
        <div
          role="group"
          aria-label="Lọc kho tư liệu"
          className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-5"
        >
          <Select
            id="archive-kind"
            label="Loại bản ghi"
            value={filters.kind}
            onChange={(v) => update("kind", v as ArchiveFilters["kind"])}
            options={options.kind}
          />
          <Select
            id="archive-media"
            label="Loại tư liệu"
            value={filters.mediaType}
            onChange={(v) => update("mediaType", v as ArchiveFilters["mediaType"])}
            options={options.mediaType}
          />
          <Select
            id="archive-period"
            label="Giai đoạn"
            value={filters.period}
            onChange={(v) => update("period", v as ArchiveFilters["period"])}
            options={options.period}
          />
          <Select
            id="archive-topic"
            label="Chủ đề"
            value={filters.topic}
            onChange={(v) => update("topic", v as ArchiveFilters["topic"])}
            options={options.topic}
          />
          <Select
            id="archive-site"
            label="Địa điểm"
            value={filters.siteSlug}
            onChange={(v) => update("siteSlug", v as ArchiveFilters["siteSlug"])}
            options={options.site}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        {/* aria-live: đếm kết quả thay đổi sau mỗi lần gõ hay lọc — thông báo
            ngắn, hữu ích thật sự, không phải thông báo hào nhoáng. */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-faint"
        >
          {visible.length} / {all.length} bản ghi
          {all.length === 0 ? " · bộ lọc sẽ hoạt động khi có bản ghi đã kiểm chứng" : ""}
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={resetAll}
            className="cursor-pointer font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold-dim underline underline-offset-4 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Xoá bộ lọc ({activeCount})
          </button>
        ) : null}
      </div>

      {/* ── Kết quả ────────────────────────────────────────────────────── */}
      {all.length === 0 ? (
        <div className="mt-12 space-y-16">
          <EditorialEmptyState recordCount={all.length} />
          <VerificationNotice />
          <ExpectedVenues />
          <RelatedTimeline />
          <DevAudit />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="Không có bản ghi phù hợp"
          description="Thử từ khoá khác hoặc xoá bộ lọc để xem toàn bộ kho tư liệu."
          action={
            <Button onClick={resetAll} variant="outline" size="sm">
              Xoá bộ lọc
            </Button>
          }
        />
      ) : (
        <>
          {/* Tiêu đề cấp 2 cho danh sách kết quả.
              Thẻ tư liệu dùng `h3`, nên phải có một `h2` ở giữa để không
              nhảy cấp heading (h1 của trang → h3 của thẻ). Đặt ẩn bằng
              `sr-only` vì trực quan thì danh sách đã có tiêu đề trang ở trên. */}
          <h2 className="sr-only">
            Danh sách tư liệu đã kiểm chứng ({visible.length} bản ghi)
          </h2>
          <Reveal variant="stagger" childrenSelector="li" className="mt-10">
            <ul className="grid gap-px border border-line bg-line lg:grid-cols-2">
              {visible.map((record) => (
                <ArchiveCard key={record.id} record={record} />
              ))}
            </ul>
          </Reveal>
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function ArchiveCard({ record }: { record: ReturnType<typeof getArchiveRecords>[number] }) {
  const rows: { label: string; value: string }[] = [];

  if (record.dateOrPeriod) rows.push({ label: "Thời gian", value: record.dateOrPeriod });
  if (record.creatorOrArchive) rows.push({ label: "Tác giả / lưu trữ", value: record.creatorOrArchive });
  if (record.publisher) rows.push({ label: "Đơn vị phát hành", value: record.publisher });
  if (record.credit) rows.push({ label: "Nguồn ảnh", value: record.credit });
  if (record.license) rows.push({ label: "Giấy phép", value: record.license });

  return (
    <li className="flex flex-col bg-ink p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="gold">
          {record.kind === "tai-lieu" ? "Tư liệu" : "Nguồn tham khảo"}
        </Badge>
        {record.mediaType ? (
          <Badge tone="neutral">
            {record.mediaType === "image"
              ? "Ảnh tư liệu"
              : record.mediaType === "map"
                ? "Bản đồ lịch sử"
                : record.mediaType === "text"
                  ? "Văn bản"
                  : "Hiện vật"}
          </Badge>
        ) : null}
        <StatusBadge status={record.status} />
      </div>

      <h3 className="mt-4 text-balance font-display text-lg uppercase leading-snug tracking-wide text-paper">
        {record.title}
      </h3>

      {record.description ? (
        <p className="mt-3 text-pretty text-[0.86rem] leading-relaxed text-paper-mute">
          {record.description}
        </p>
      ) : null}

      {record.caption ? (
        <p className="mt-3 border-l border-line-strong pl-3 text-pretty text-[0.8rem] leading-relaxed text-paper-faint">
          {record.caption}
        </p>
      ) : null}

      {rows.length > 0 ? (
        <dl className="mt-5 space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap gap-x-2">
              <dt className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                {row.label}:
              </dt>
              <dd className="text-[0.8rem] text-paper-dim">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {record.note ? (
        <p className="mt-4 border-l-2 border-gold-dim pl-3 text-pretty text-[0.78rem] leading-relaxed text-paper-mute">
          {record.note}
        </p>
      ) : null}

      {/* Chỉ hiện link khi data thật sự có URL — đó là cam kết với người đọc. */}
      {record.url ? (
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold-dim underline underline-offset-4 transition-colors hover:text-gold"
        >
          Mở nguồn
          <span aria-hidden>↗</span>
        </a>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-6">
        {record.siteSlug ? (
          <Link
            href={`/ho-so/${record.siteSlug}`}
            className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper-mute underline underline-offset-4 transition-colors hover:text-flag-bright"
          >
            Hồ sơ: {record.siteName}
          </Link>
        ) : null}
        {record.eventId ? (
          <Link
            href="/dong-thoi-gian"
            className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper-mute underline underline-offset-4 transition-colors hover:text-flag-bright"
          >
            Dòng thời gian: {record.eventYear} · {record.eventTitle}
          </Link>
        ) : null}
      </div>
    </li>
  );
}

/* ── Trạng thái chưa có bản ghi ──────────────────────────────────────────── */

/**
 * Phase 5.5 §1.3 — trang kho trống phải vẫn có giá trị giáo dục và trông
 * cố ý, nhưng TUYỆT ĐỐI không được bịa bản ghi hay giả vờ đã kiểm chứng.
 *
 * Cách làm: một "bìa tạp chí" — số chương, câu tuyên bố ngắn, và lý do cụ
 * thể. Mọi con số đều đếm từ dữ liệu thật, không có số liệu minh hoạ bịa.
 */
function EditorialEmptyState({ recordCount }: { recordCount: number }) {
  // Đếm trực tiếp từ dữ liệu đang công bố — không có hằng số bịa đặt.
  const publicSourceCount =
    getPublicSites().reduce((n, s) => n + s.sources.length, 0) +
    getPublicEvents().reduce((n, e) => n + e.sources.length, 0);

  return (
    <Reveal variant="up">
      <section
        aria-labelledby="kho-empty-title"
        className="relative isolate overflow-hidden border border-line bg-ink-900/60"
      >
        {/* Vân nền tĩnh — không dùng blur lớn để tránh tốn GPU. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "radial-gradient(ellipse 70% 90% at 12% 0%, #5E0715 0%, transparent 62%)",
          }}
        />
        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
          <div className="lg:col-span-7">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-gold-dim">
              Chương 04 — Trạng thái biên tập
            </p>
            <h2
              id="kho-empty-title"
              className="mt-6 text-balance font-display text-[clamp(1.5rem,3.6vw,2.6rem)] uppercase leading-[1.08] text-paper"
            >
              Kho tư liệu đang được kiểm chứng
            </h2>
            <p className="mt-6 max-w-[58ch] text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
              Trang này được dựng để chứa ảnh tư liệu, bản đồ lịch sử, văn bản
              và hiện vật gắn với từng địa điểm. Ở thời điểm hiện tại, chưa tồn
              tại bản ghi nào đủ căn cứ để công bố — mọi trường đều được để trống
              chứ không điền bằng nội dung chưa kiểm chứng.
            </p>
            <p className="mt-4 max-w-[58ch] text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
              Phần lớn những gì từng được ghi nhận về các địa điểm này đều đã lưu
              hành trong nhiếp ảnh, thư tịch và ký ức địa phương chưa được số hóa.
              Chúng ta chọn chờ tài liệu gốc thay vì kể một câu chuyện có vẻ đầy
              đủ nhưng không kiểm chứng được.
            </p>
          </div>

          {/* Sổ kiểm chứng: chỉ kể số đếm từ dữ liệu thật. */}
          <div className="lg:col-span-5">
            <div className="border-l border-line pl-6">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper-faint">
                Sổ kiểm chứng
              </p>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                    Bản ghi đã công bố
                  </dt>
                  <dd className="mt-1 font-display text-4xl tabular-nums text-paper">
                    {recordCount}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                    Nguồn tham khảo đã kiểm chứng
                  </dt>
                  <dd className="mt-1 font-display text-4xl tabular-nums text-paper-faint">
                    {publicSourceCount}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                    Hồ sơ địa điểm đang mở
                  </dt>
                  <dd className="mt-1 font-display text-4xl tabular-nums text-gold-dim">
                    {getPublicSites().length}
                  </dd>
                </div>
              </dl>
              <p className="mt-7 border-t border-line pt-5 text-pretty text-[0.82rem] leading-relaxed text-paper-faint">
                Những con số trên được đếm trực tiếp từ dữ liệu của trang, nên
                chúng sẽ thay đổi ngay khi có tư liệu mới được kiểm chứng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function VerificationNotice() {
  return (
    <div>
      {/* Phase 5.5: trước đây khối này mở đầu bằng một EmptyState lặp lại
          đúng câu "Kho tư liệu đang được kiểm chứng" — sau khi thêm
          `EditorialEmptyState` ở trên thì thành nói hai lần cùng một ý.
          Nay nó chỉ giữ phần CHƯƠNG TRÌNH (bảng trường bắt buộc), phần tuyên
          bố đã nằm ở khối trên. */}
      <TickedRule />
      <div className="mt-10">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
          Một bản ghi cần có gì
        </p>
        <p className="mt-4 max-w-[62ch] text-pretty text-[0.88rem] leading-[1.8] text-paper-mute">
          Đây là những trường mà một bản ghi phải có đủ trước khi được công bố
          ở đây. Trang hiện chưa có bản ghi nào đạt đủ, nên danh sách bên dưới
          đang là “bản chờ” chứ không phải mô tả của những gì đang có.
        </p>
        <ul className="mt-7 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ARCHIVE_PUBLICATION_REQUIREMENTS.map((requirement) => (
            <li key={requirement.field} className="bg-ink p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold-dim">
                {requirement.field}
              </p>
              <p className="mt-2 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                {requirement.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Các hồ sơ nơi tư liệu sẽ xuất hiện — lấy từ dữ liệu công khai. */
function ExpectedVenues() {
  const sites = getPublicSites();
  if (sites.length === 0) return null;

  return (
    <Reveal variant="up" className="mt-16">
      <div className="border border-line bg-ink-900/60 p-7 sm:p-9">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
          Tư liệu sẽ xuất hiện ở đâu
        </p>
        <p className="mt-4 max-w-[62ch] text-pretty text-[0.9rem] leading-[1.8] text-paper-mute">
          Mỗi tư liệu gắn với một hồ sơ địa điểm. Khi hồ sơ có ảnh đã được kiểm
          chứng, bản ghi tương ứng sẽ hiện ở đây và trong hồ sơ đó cùng lúc.
        </p>

        <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
          {sites.map((site) => (
            <li key={site.slug} className="bg-ink p-5">
              <Link
                href={`/ho-so/${site.slug}`}
                className="font-display text-base uppercase tracking-wide text-paper transition-colors hover:text-flag-bright"
              >
                {site.name}
              </Link>
              <p className="mt-2 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                {site.summary}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/ban-do" variant="outline" size="sm">
            Mở bản đồ địa chỉ đỏ
          </Button>
          <Button href="/dong-thoi-gian" variant="outline" size="sm">
            Mở dòng thời gian
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Dẫn người đọc sang nội dung lịch sử ĐÃ CÔNG BỐ thay vì để trang kho trôi
 * vào ngõ cụt. Dùng `getPublicEvents()` nên mọi mốc hiện ra đều đã qua cổng
 * kiểm duyệt — không có mốc nào bịa thêm.
 */
function RelatedTimeline() {
  const events = getPublicEvents();
  if (events.length === 0) return null;

  return (
    <Reveal variant="up">
      <section aria-labelledby="kho-related-title">
        <TickedRule />
        <div className="mt-10">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
            Trong khi chờ tư liệu
          </p>
          <h2
            id="kho-related-title"
            className="mt-5 text-balance font-display text-[clamp(1.4rem,3.2vw,2.2rem)] uppercase leading-[1.1] text-paper"
          >
            Những cột mốc đã có thể đọc ngay
          </h2>
          <p className="mt-5 max-w-[62ch] text-pretty text-[0.9rem] leading-[1.8] text-paper-mute">
            Kho tư liệu cần thời gian để đầy. Trong lúc đó, phần lịch sử đã được
            kiểm chứng của dự án vẫn đọc được đầy đủ ở dòng thời gian và các
            hồ sơ địa điểm.
          </p>

          <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.id} className="bg-ink p-5">
                <p className="font-mono text-[0.66rem] tabular-nums tracking-[0.14em] text-flag-bright">
                  {event.year ?? "—"}
                </p>
                <h3 className="mt-2.5 text-pretty font-display text-[0.98rem] uppercase leading-snug text-paper">
                  {event.title}
                </h3>
                <p className="mt-2.5 text-pretty text-[0.8rem] leading-relaxed text-paper-faint">
                  {event.summary}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/dong-thoi-gian" variant="outline" size="sm">
              Mở dòng thời gian đầy đủ
            </Button>
            <Button href="/dong-nam-a" variant="outline" size="sm">
              Xem bối cảnh Đông Nam Á
            </Button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/**
 * Báo cáo kiểm toán — CHỈ hiện ở `next dev`, không bao giờ tới người xem bản
 * build. Đây là công cụ cho người duyệt nội dung: biết chính xác bản ghi nào
 * còn thiếu trường gì để có thể công bố.
 */
function DevAudit() {
  if (process.env.NODE_ENV !== "development") return null;

  const rows = getArchiveAudit();

  return (
    <section
      aria-labelledby="kho-audit-title"
      className="border border-dashed border-gold-dim/50 bg-ink-900/70 p-7"
    >
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-gold">
        Chỉ hiện ở chế độ phát triển
      </p>
      <h2
        id="kho-audit-title"
        className="mt-4 font-display text-xl uppercase tracking-wide text-paper"
      >
        Kiểm toán bản ghi chưa công bố
      </h2>

      {rows.length === 0 ? (
        <p className="mt-4 text-[0.85rem] text-paper-mute">
          Không có bản ghi nào đang chờ trong dữ liệu.
        </p>
      ) : (
        <table className="mt-6 w-full border-collapse text-left text-[0.8rem]">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                Mã
              </th>
              <th scope="col" className="py-2 pr-4 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                Tiêu đề
              </th>
              <th scope="col" className="py-2 pr-4 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                Trạng thái
              </th>
              <th scope="col" className="py-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                Còn thiếu
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line/60">
                <td className="py-2.5 pr-4 font-mono text-[0.72rem] text-paper-faint">
                  {row.id}
                </td>
                <td className="py-2.5 pr-4 text-paper-dim">{row.title}</td>
                <td className="py-2.5 pr-4 font-mono text-[0.68rem] text-gold-dim">
                  {row.status}
                </td>
                <td className="py-2.5 text-paper-faint">
                  {row.missing.length === 0 ? "—" : row.missing.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function Select({
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
        className={cn(
          "mt-1.5 w-full cursor-pointer border border-line bg-ink-800 px-3 py-2.5",
          "text-[0.82rem] text-paper focus:border-gold focus:outline-none",
          options.length === 0 && "cursor-not-allowed opacity-50",
        )}
        disabled={options.length === 0}
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