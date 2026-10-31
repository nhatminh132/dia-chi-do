import type { Metadata } from "next";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { ComparisonMatrix } from "@/components/sea/ComparisonMatrix";
import { CountryExplorer } from "@/components/sea/CountryExplorer";
import { SoutheastAsiaHero } from "@/components/sea/SoutheastAsiaHero";
import { Badge } from "@/components/ui/Badge";
import { COUNTRIES } from "@/lib/southeast-asia";

export const metadata: Metadata = {
  title: "Đông Nam Á",
  description: `Sài Gòn trong bức tranh giải phóng dân tộc Đông Nam Á — ${COUNTRIES.length} hồ sơ quốc gia, những con đường khác nhau nhưng cùng một khát vọng tự quyết.`,
};

/**
 * `/dong-nam-a` — trang chủ đề Đông Nam Á.
 *
 * Trang là Server Component. Chỉ hai khối cần JavaScript:
 *   • `SoutheastAsiaHero` — chuyển động nhập màn và parallax.
 *   • `CountryExplorer`     — bộ lọc quốc gia và dải mốc.
 *
 * Mọi nội dung lịch sử đến từ `src/data/countries.ts`. Trang này KHÔNG kể
 * thêm câu chuyện nào, không thêm mốc nào, không thêm nguồn nào — kể cả khi
 * điều đó sẽ làm trang đầy hơn.
 */
export default function DongNamAPage() {
  return (
    <>
      <SoutheastAsiaHero />

      {/* ── 1 · Tổng quan khu vực ──────────────────────────────────────── */}
      <ChapterFrame
        index="01"
        label="Regional overview"
        title={`${COUNTRIES.length} quốc gia trong một vùng`}
        description={`Sài Gòn không đứng ngoài lịch sử khu vực. ${COUNTRIES.length} hồ sơ dưới đây cho thấy các con đường giành độc lập diễn ra khác nhau — có nơi phải bảo vệ nền độc lập sau khi tuyên bố, có nơi còn đang tiếp tục hành trình sau đó.`}
        plate="ember"
      >
        <Reveal
          variant="stagger"
          className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {COUNTRIES.map((country, index) => (
            <article
              key={country.id}
              className="flex flex-col bg-ink p-6 transition-colors duration-500 hover:bg-ink-800"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg uppercase tracking-wide text-paper">
                  {country.name}
                </h3>
                <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-paper-faint">
                {country.nameEn}
              </p>

              <p className="mt-4 font-display text-[0.8rem] uppercase leading-snug tracking-[0.1em] text-gold-dim">
                {country.title}
              </p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {country.milestones.map((m) => (
                  <li key={m}>
                    <Badge tone="neutral" className="tabular-nums">
                      {m}
                    </Badge>
                  </li>
                ))}
              </ul>

              {country.id === "vn" ? (
                <span className="mt-5 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-flag-bright">
                  Trọng tâm dự án
                </span>
              ) : null}
            </article>
          ))}
        </Reveal>
      </ChapterFrame>

      {/* ── 2 · Bối cảnh lịch sử · các phong trào · các mốc ───────────── */}
      <ChapterFrame
        index="02"
        label="Context & movements"
        title="Bối cảnh, phong trào và các mốc."
        description="Mỗi quốc gia có hoàn cảnh lịch sử riêng. Phần dưới đây trình bày nguyên văn nội dung hồ sơ từng nước, kèm ghi chú biên tập ở những chỗ dễ bị viết sai."
        plate="abyss"
      >
        <CountryExplorer />
      </ChapterFrame>

      {/* ── 3 · So sánh xuyên quốc gia · kết chương ───────────────────── */}
      <ChapterFrame
        index="03"
        label="Comparison"
        title="So sánh và điều chưa nên vội kết luận."
        description="Các phong trào giải phóng dân tộc ở Đông Nam Á không diễn ra theo một khuôn mẫu duy nhất. Phần này đặt các quốc gia cạnh nhau để thấy điểm chung và điểm khác biệt."
        plate="grid"
        tone="deep"
      >
        <ComparisonMatrix />
      </ChapterFrame>
    </>
  );
}