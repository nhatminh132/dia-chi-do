"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/anim/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TickedRule } from "@/components/media/CinematicPlate";
import { getPublicSites } from "@/lib/content";
import {
  COUNTRIES,
  EMPTY_COUNTRY_FILTER,
  buildMilestoneBand,
  countActiveCountryFilter,
  filterCountries,
  positionOnBand,
  type CountryFilter,
} from "@/lib/southeast-asia";
import { cn } from "@/lib/utils";

/**
 * Hồ sơ các quốc gia + dải mốc liên kết.
 *
 * Vì sao lọc THEO QUỐC GIA mà không lọc theo thời kỳ: `Country` trong data
 * không có trường giai đoạn. Dựng bộ lọc thời kỳ ở đây đồng nghĩa với việc
 * bịa một chiều dữ liệu không tồn tại — nên không dựng. Thời kỳ chỉ xuất hiện
 * ở những trang mà dữ liệu thật sự có nó (`/ban-do`, `/dong-thoi-gian`).
 *
 * Toàn bộ câu chữ, mốc năm và ghi chú biên tập đến thẳng từ
 * `src/data/countries.ts`. Component này chỉ bố trí và lọc.
 */
export function CountryExplorer() {
  const [active, setActive] = useState<CountryFilter>(EMPTY_COUNTRY_FILTER);

  const band = useMemo(() => buildMilestoneBand(COUNTRIES), []);
  const visible = useMemo(() => filterCountries(COUNTRIES, active), [active]);
  const activeCount = countActiveCountryFilter(active);

  const activeName = active
    ? COUNTRIES.find((c) => c.id === active)?.name ?? null
    : null;

  return (
    <section id="quoc-gia" aria-labelledby="quoc-gia-title" className="scroll-mt-24">
      <Reveal variant="up">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
          {COUNTRIES.length} hồ sơ quốc gia
        </p>
        <h2
          id="quoc-gia-title"
          className="mt-5 max-w-3xl text-balance font-display text-[clamp(1.6rem,4.2vw,3rem)] uppercase leading-[1.08] text-paper"
        >
          Mỗi nước một con đường, cùng một hướng đi
        </h2>
        <p className="mt-5 max-w-[62ch] text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
          Chọn một quốc gia để đọc hồ sơ của nước đó và làm nổi bật các mốc
          tương ứng trên dải thời gian bên dưới.
        </p>
      </Reveal>

      {/* ── Bộ lọc quốc gia ─────────────────────────────────────────────── */}
      <Reveal variant="up" className="mt-10">
        <div
          role="group"
          aria-label="Lọc theo quốc gia"
          className="flex flex-wrap gap-2"
        >
          <FilterChip
            active={!active}
            onClick={() => setActive(null)}
            label="Tất cả"
            count={COUNTRIES.length}
          />
          {COUNTRIES.map((country) => (
            <FilterChip
              key={country.id}
              active={active === country.id}
              onClick={() => setActive(country.id)}
              label={country.name}
              count={1}
            />
          ))}
        </div>

        <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-faint">
          {activeCount > 0
            ? `Đang lọc: ${activeName} · ${visible.length} hồ sơ`
            : `${visible.length} hồ sơ · ${band.marks.length} mốc trên dải`}
        </p>
      </Reveal>

      {/* ── Mốc theo thứ tự thời gian ─────────────────────────────────── */}
      <div className="mt-20">
        <Reveal variant="up">
          <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
            Các mốc theo thứ tự thời gian
          </h3>
        </Reveal>
        <Reveal variant="mask" className="mt-6">
          <MilestoneBand band={band} active={active} />
        </Reveal>
      </div>

      {/* ── Bối cảnh lịch sử và phong trào độc lập ────────────────────── */}
      <div className="mt-20">
        <Reveal variant="up">
          <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
            Bối cảnh lịch sử và phong trào độc lập
          </h3>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-px border border-line bg-line lg:grid-cols-2">
        {visible.map((country) => (
          <Reveal
            key={country.id}
            variant="up"
            className={cn(
              "flex flex-col bg-ink p-7 sm:p-9",
              country.id === "vn" && "bg-ink-800",
            )}
          >
            <article
              data-country-card={country.id}
              className="flex h-full flex-col"
            >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
                {country.name}
              </h3>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper-faint">
                {country.nameEn}
              </span>
            </div>

            <p className="mt-3 font-display text-sm uppercase tracking-[0.12em] text-gold-dim">
              {country.title}
            </p>

            <div className="mt-6 space-y-4">
              {country.description.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-pretty text-[0.9rem] leading-[1.8] text-paper-dim"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-7 flex flex-wrap gap-1.5">
              {country.milestones.map((m) => (
                <li key={m}>
                  <Badge tone="neutral" className="tabular-nums">
                    {m}
                  </Badge>
                </li>
              ))}
            </ul>

            {/* Ghi chú biên tập giữ nguyên từ data — đây là loại chi tiết
                dễ bị viết sai nếu kể lại từ trí nhớ. */}
            {country.editorialNote ? (
              <div className="mt-7 border-l-2 border-gold-dim bg-ink-900/60 px-4 py-3">
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-gold-dim">
                  Lưu ý biên tập
                </p>
                <p className="mt-2 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                  {country.editorialNote}
                </p>
              </div>
            ) : null}
            </article>
          </Reveal>
        ))}
      </div>

      <RelatedProfiles />
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer border px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] transition-colors duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        active
          ? "border-flag bg-flag text-paper"
          : "border-line bg-ink-800 text-paper-mute hover:border-line-strong hover:text-paper",
      )}
    >
      {label}
      <span className="ml-2 text-[0.55rem] opacity-60">{count}</span>
    </button>
  );
}

/**
 * Dải mốc.
 *
 * Desktop: trục ngang, các nút năm xếp theo tỉ lệ thời gian thật (dùng
 * `positionOnBand`) nên người xem thấy được các năm gần nhau nằm gần nhau —
 * đó là phần "dễ hiểu trình tự" của yêu cầu.
 *
 * Mobile: xếp dọc. Trục ngang ở 390px sẽ bị ép nén hoặc tràn ngang, nên ở
 * màn hình hẹp ta đổi sang danh sách dọc thay vì thu nhỏ.
 */
function MilestoneBand({
  band,
  active,
}: {
  band: ReturnType<typeof buildMilestoneBand>;
  active: CountryFilter;
}) {
  const countryName = (id: string) =>
    COUNTRIES.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="border border-line bg-ink-900/60 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper-faint">
          Dải mốc liên kết
        </p>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper-faint">
          {band.from} — {band.to}
        </p>
      </div>

      {/* Desktop / tablet: trục ngang */}
      <div className="relative mt-10 hidden h-40 sm:block" aria-hidden="true">
        {/* đường trục */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />

        {/* vạch mốc năm */}
        {band.marks.map((mark) => (
          <div
            key={mark.year}
            className="absolute -translate-x-1/2"
            style={{ left: `${positionOnBand(band, mark.year) * 100}%` }}
          >
            <div className="absolute -top-8 left-1/2 h-8 w-px -translate-x-1/2 bg-line-strong" />
            <div className="absolute -bottom-8 left-1/2 h-8 w-px -translate-x-1/2 bg-line-strong" />
            <span className="absolute -top-[3.1rem] left-1/2 -translate-x-1/2 font-mono text-[0.7rem] tabular-nums tracking-[0.12em] text-paper-mute">
              {mark.label}
            </span>
          </div>
        ))}

        {/* nút quốc gia, xếp chồng nhẹ quanh trục */}
        {band.marks.map((mark) => (
          <div
            key={`nodes-${mark.year}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${positionOnBand(band, mark.year) * 100}%` }}
          >
            {mark.countryIds.map((id, i) => {
              const dim = active !== null && active !== id;
              const isPrimary = id === "vn";
              return (
                <span
                  key={id}
                  title={countryName(id)}
                  className={cn(
                    "block size-3 rounded-full border transition-all duration-500",
                    isPrimary
                      ? "border-gold bg-flag"
                      : "border-paper-faint bg-ink-900",
                    dim ? "opacity-25" : "opacity-100",
                  )}
                  style={{ marginTop: `${i * 18}px` }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: danh sách dọc */}
      <ol className="mt-8 space-y-4 sm:hidden">
        {band.marks.map((mark) => {
          const dimmed =
            active !== null && !mark.countryIds.includes(active);
          return (
            <li
              key={mark.year}
              className={cn(
                "flex items-baseline gap-4 border-b border-line pb-3 transition-opacity duration-300 last:border-0",
                dimmed && "opacity-35",
              )}
            >
              <span className="font-mono text-sm tabular-nums tracking-[0.12em] text-gold">
                {mark.label}
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {mark.countryIds.map((id) => (
                  <span
                    key={id}
                    className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-paper-mute"
                  >
                    {countryName(id)}
                  </span>
                ))}
              </span>
            </li>
          );
        })}
      </ol>

      <TickedRule className="mt-8" />

      <p className="mt-5 max-w-[62ch] text-pretty text-[0.85rem] leading-relaxed text-paper-mute">
        Các năm trên dải là mốc đã được nêu trong hồ sơ quốc gia. Dải này chỉ
        cho thấy thứ tự và mức độ gần nhau của các mốc; phần diễn giải chi tiết
        nằm trong từng hồ sơ bên trên.
      </p>
    </div>
  );
}

/**
 * Liên kết chéo tới các nội dung ĐÃ CÓ trong dự án.
 *
 * Danh sách lấy trực tiếp từ `getPublicSites()` — không ghi tay slug, nên nếu
 * một hồ sơ bị chuyển sang trạng thái không công khai thì link tự biến mất
 * thay vì trỏ tới trang 404.
 */
function RelatedProfiles() {
  const sites = getPublicSites();
  if (sites.length === 0) return null;

  return (
    <Reveal variant="up" className="mt-14">
      <TickedRule />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
            Điều hướng
          </p>
          <h3 className="mt-4 text-balance font-display text-xl uppercase leading-[1.15] text-paper">
            Từ bức tranh khu vực, quay lại Sài Gòn
          </h3>
          <p className="mt-4 max-w-[52ch] text-pretty text-[0.9rem] leading-[1.8] text-paper-mute">
            Hồ sơ Sài Gòn là trọng tâm của dự án. Các trang dưới đây là nơi
            các mốc trên dải được diễn giải chi tiết theo bối cảnh địa phương.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/dong-thoi-gian" variant="outline" size="sm">
              Dòng thời gian
            </Button>
            <Button href="/ban-do" variant="outline" size="sm">
              Bản đồ địa chỉ đỏ
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {sites.map((site) => (
              <li key={site.slug} className="bg-ink p-5">
                <Link
                  href={`/ho-so/${site.slug}`}
                  className="block transition-colors duration-300 hover:text-flag-bright"
                >
                  <span className="font-display text-base uppercase tracking-wide text-paper">
                    {site.name}
                  </span>
                  <span className="mt-2 block text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                    {site.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}