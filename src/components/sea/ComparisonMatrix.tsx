import { Reveal } from "@/components/anim/Reveal";
import { TickedRule } from "@/components/media/CinematicPlate";
import { Prose } from "@/components/ui/Prose";
import {
  COUNTRIES,
  REGIONAL_COMPARISON,
  milestoneTrail,
  summaryOf,
} from "@/lib/southeast-asia";

/**
 * So sánh xuyên quốc gia.
 *
 * Server component — không cần JavaScript vì phần này luôn hiển thị đủ tất
 * cả các quốc gia có trong dữ liệu. Việc "lọc để so sánh" đã nằm ở
 * `CountryExplorer`.
 *
 * Mọi ô trong bảng đều lấy từ `src/data/countries.ts`. Những ô không có dữ
 * liệu hiện dấu "—" thay vì chuỗi rỗng, để người đọc không tưởng là thiếu sót
 * khi trình bày.
 */
export function ComparisonMatrix() {
  const { title, paragraphs, closingTitle, closingBody } = REGIONAL_COMPARISON;

  return (
    <section aria-labelledby="so-sanh-title" className="scroll-mt-24">
      <Reveal variant="up">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
          So sánh khu vực
        </p>
        <h2
          id="so-sanh-title"
          className="mt-5 max-w-4xl text-balance font-display text-[clamp(1.5rem,4vw,2.7rem)] uppercase leading-[1.1] text-paper"
        >
          {title}
        </h2>
      </Reveal>

      <Reveal variant="up" className="mt-10">
        <Prose>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Reveal>

      {/* ── Bảng (desktop) ──────────────────────────────────────────────── */}
      <Reveal variant="mask" className="mt-14 hidden lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            So sánh {COUNTRIES.length} quốc gia Đông Nam Á theo tiêu đề hồ sơ,
            chuỗi mốc thời gian và ghi chú biên tập.
          </caption>
          <thead>
            <tr className="border-y border-line-strong">
              <Th>Quốc gia</Th>
              <Th>Tiêu đề hồ sơ</Th>
              <Th>Chuỗi mốc</Th>
              <Th>Ghi chú biên tập</Th>
            </tr>
          </thead>
          <tbody>
            {COUNTRIES.map((country) => (
              <tr
                key={country.id}
                className="border-b border-line align-top transition-colors duration-500 hover:bg-ink-800/60"
              >
                <Td>
                  <span className="font-display text-base uppercase tracking-wide text-paper">
                    {country.name}
                  </span>
                  <span className="mt-1 block font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                    {country.nameEn}
                  </span>
                </Td>
                <Td>{country.title}</Td>
                <Td>
                  <span className="font-mono text-[0.82rem] tabular-nums tracking-[0.12em] text-gold">
                    {milestoneTrail(country) ?? "—"}
                  </span>
                </Td>
                <Td>
                  <span className="text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                    {country.editorialNote ?? "—"}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* ── Thẻ dọc (mobile) ──────────────────────────────────────────────
          Cùng dữ liệu, khác cách trình bày: bốn cột ở 390px sẽ bị bóp nghẹt
          đến mức không đọc được. */}
      <div className="mt-14 grid gap-px border border-line bg-line lg:hidden">
        {COUNTRIES.map((country) => (
          <article key={country.id} className="bg-ink p-6">
            <h3 className="font-display text-lg uppercase tracking-wide text-paper">
              {country.name}
            </h3>
            <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
              {country.nameEn}
            </p>

            <dl className="mt-5 space-y-4">
              <Row label="Tiêu đề hồ sơ" value={country.title} />
              <Row
                label="Chuỗi mốc"
                value={milestoneTrail(country) ?? "—"}
                mono
              />
              {country.editorialNote ? (
                <Row label="Ghi chú biên tập" value={country.editorialNote} />
              ) : null}
            </dl>

            <p className="mt-5 border-l border-line-strong pl-3 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
              {summaryOf(country)}
            </p>
          </article>
        ))}
      </div>

      {/* ── Kết chương ──────────────────────────────────────────────────── */}
      <Reveal variant="up" className="mt-16">
        <TickedRule />
        <div className="mt-10 border border-line bg-ink-900/60 p-8 sm:p-12">
          <h3 className="max-w-2xl text-balance font-display text-[clamp(1.3rem,3.4vw,2.1rem)] uppercase leading-[1.14] text-paper">
            {closingTitle}
          </h3>
          <p className="mt-6 max-w-[62ch] text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
            {closingBody}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="px-4 py-4 font-mono text-[0.58rem] uppercase tracking-[0.2em] font-normal text-paper-faint"
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-6 pr-6">{children}</td>;
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-paper-faint">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "mt-1.5 font-mono text-[0.82rem] tabular-nums tracking-[0.12em] text-gold"
            : "mt-1.5 text-pretty text-[0.85rem] leading-relaxed text-paper-dim"
        }
      >
        {value}
      </dd>
    </div>
  );
}