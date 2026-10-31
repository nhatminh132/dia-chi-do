import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/ui/Button";
import { getCountries } from "@/lib/content";
import { getScene } from "@/lib/scenes";

/**
 * CẢNH 06 — ĐÔNG NAM Á: NHIỀU CON ĐƯỜNG TỚI ĐỘC LẬP
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Các quốc gia xếp ngang như những ô cửa sổ cùng nhìn ra một con đường:
 *  mỗi quốc gia một mốc, nhưng cùng một hướng.
 *
 *  ── Chuyển cảnh "SÁNG SANG TỐI" ───────────────────────────────────────────
 *
 *  Máy quay lùi: thành phố ở cảnh 05 thu nhỏ lại thành một điểm trong bức
 *  tranh khu vực. Nền của cảnh này là một quầng sáng khu vực với các vòng
 *  cung vĩ độ — không có tên nước nào được khắc vào hình.
 *
 *  ── Vì sao MỌI tên nước và mốc thời gian đều là HTML ──────────────────────
 *
 *  Không có quan hệ lịch sử nào được suy diễn. Mỗi quốc gia có một con
 *  đường riêng; điểm chung là khát vọng tự quyết — và điều đó được nói thẳng
 *  bằng chữ, kèm lưu ý biên tập, chứ không gợi ý bằng hình ảnh.
 */
export function SoutheastAsiaSection() {
  const list = getCountries();
  const scene = getScene("scene-06-southeast-asia");

  return (
    <ChapterFrame
      id="chapter-06"
      index="06"
      label="Beyond Saigon"
      title="Một khát vọng trong dòng chảy Đông Nam Á."
      description="Sài Gòn không đứng ngoài lịch sử khu vực. Trong thế kỷ XX, nhiều dân tộc Đông Nam Á đã trải qua những hành trình khác nhau để giành độc lập, quyền tự quyết và xây dựng quốc gia của mình."
      plate="ember"
      scene={scene}
      slateMeta={`${list.length} quốc gia`}
    >
      <Reveal
        variant="clip"
        className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        respectReducedMotion
      >
        {list.map((country, index) => (
          <article
            key={country.id}
            className={[
              "group relative flex flex-col bg-ink p-7 transition-colors duration-500",
              "hover:bg-ink-800",
              index === 0 ? "lg:bg-ink-800" : "",
            ].join(" ")}
          >
            {/* Việt Nam là trọng tâm nên dùng nền khác + viền đỏ */}
            {index === 0 ? (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flag-red to-transparent"
              />
            ) : null}

            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl uppercase tracking-wide text-paper">
                {country.name}
              </h3>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
              {country.nameEn}
            </p>

            <p className="mt-5 flex-1 text-pretty text-[0.85rem] leading-relaxed text-paper-dim">
              {country.description[0]}
            </p>

            {/* Các mốc — dữ kiện đã nêu trong Idea.txt §6 */}
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {country.milestones.map((m) => (
                <li
                  key={m}
                  className="border border-line-strong px-2 py-1 font-mono text-[0.6rem] tabular-nums tracking-[0.12em] text-paper-mute"
                >
                  {m}
                </li>
              ))}
            </ul>

            {index === 0 ? (
              <span className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-flag-bright">
                Trọng tâm dự án
              </span>
            ) : null}
          </article>
        ))}
      </Reveal>

      {/* Lưu ý biên tập — giữ nguyên vì đây là điều dễ sai nhất */}
      <Reveal variant="up" className="mt-8" respectReducedMotion>
        <div className="border-l-2 border-gold-dim bg-ink-900/60 px-5 py-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold-dim">
            Lưu ý biên tập
          </p>
          <p className="mt-2 max-w-3xl text-pretty text-[0.85rem] leading-relaxed text-paper-mute">
            Tuyên bố độc lập của Philippines năm 1898 và việc Hoa Kỳ công nhận
            độc lập năm 1946 là hai sự kiện khác nhau, cần được trình bày chính
            xác. Các phong trào giải phóng dân tộc ở Đông Nam Á không diễn ra
            theo một khuôn mẫu duy nhất; điểm chung là khát vọng tự quyết và
            mong muốn thoát khỏi sự thống trị từ bên ngoài.
          </p>
        </div>
      </Reveal>

      <Reveal variant="up" className="mt-12 flex justify-center" respectReducedMotion>
        <Button href="/dong-nam-a" variant="outline" size="lg">
          Khám phá bức tranh khu vực
        </Button>
      </Reveal>
    </ChapterFrame>
  );
}