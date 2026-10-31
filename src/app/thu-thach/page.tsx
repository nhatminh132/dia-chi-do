import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ParallaxBackdrop } from "@/components/anim/ParallaxBackdrop";
import { Reveal } from "@/components/anim/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { QuizApp } from "@/components/quiz/QuizApp";
import { QUIZ_QUESTIONS } from "@/lib/quiz";
import { GridField, TickedRule } from "@/components/media/CinematicPlate";

export const metadata: Metadata = {
  title: "Thử thách lịch sử",
  description:
    "Kiểm tra kiến thức về các địa điểm, nhân vật và sự kiện lịch sử qua những câu hỏi ngắn, kèm giải thích và nguồn trích dẫn.",
};

/**
 * Trang thử thách lịch sử.
 *
 * Không còn là trang khung: đây là một bài kiểm tra tương tác thật, dựng
 * hoàn toàn từ những mốc thời gian và hồ sơ địa điểm đã được kiểm chứng
 * trong dự án. Mỗi câu đều dẫn về bản ghi gốc nên người học có thể tự
 * đối chiếu.
 */
export default function ThuThachPage() {
  const topics = Array.from(new Set(QUIZ_QUESTIONS.map((q) => q.source.split(" · ")[0])));

  return (
    <>
      {/* ── Đầu trang ───────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-line">
        {/* Nền trôi theo cuộn — trước đây trang này gần như đứng yên. */}
        <ParallaxBackdrop
          strength={70}
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 70% -10%, #5E0715 0%, #120A0C 48%, #0A0A0A 84%)",
          }}
        />
        <ParallaxBackdrop strength={34} className="opacity-[0.05]">
          <GridField />
        </ParallaxBackdrop>

        <Container width="wide" className="relative py-20 sm:py-24 lg:py-32">
          <Reveal variant="stagger">
            <SectionLabel index="05" title="History quiz" />

            <h1 className="mt-7 max-w-4xl text-balance font-display text-[clamp(2rem,5.8vw,4.6rem)] uppercase leading-[1.04] text-paper text-cinematic">
              Thử thách lịch sử
            </h1>

            <p className="mt-7 max-w-[58ch] text-pretty text-[length:var(--text-lead)] leading-[1.85] text-paper-mute">
              {QUIZ_QUESTIONS.length} câu hỏi rút ra từ những mốc thời gian và hồ
              sơ địa điểm mà dự án này đã kiểm chứng. Trả lời xong, bạn sẽ thấy
              ngay câu đó lấy từ đâu — và có thể mở hồ sơ đó để đọc lại.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint">
                {QUIZ_QUESTIONS.length} câu
              </span>
              <span aria-hidden className="text-line-strong">
                ·
              </span>
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint"
                >
                  {topic}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <Container width="wide" className="py-16 sm:py-20 lg:py-24">
        <Reveal variant="settle">
          <QuizApp />
        </Reveal>

        <Reveal variant="up" className="mt-20">
          <TickedRule />
          <p className="mt-8 max-w-[62ch] text-pretty text-[0.88rem] leading-[1.85] text-paper-faint">
            Các câu hỏi trong trang này chỉ dùng những thông tin đã được dự án
            công bố và kiểm chứng. Những mốc thời gian và hồ sơ còn đang ở
            trạng thái chờ đối chiếu không được dùng làm đáp án, để không tạo
            ra nội dung có vẻ chắc chắn một cách không trung thực.
          </p>
        </Reveal>
      </Container>
    </>
  );
}
