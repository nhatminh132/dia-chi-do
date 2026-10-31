import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { ParallaxGhost } from "@/components/anim/ParallaxGhost";
import { Button } from "@/components/ui/Button";
import { QUIZ_QUESTIONS } from "@/lib/quiz";

/**
 * Nhịp cuối của CẢNH 07 — THỬ THÁCH LỊCH SỬ. Nội dung theo Idea.txt §2.7.
 *
 * Ba dòng số liệu lấy trực tiếp từ dữ liệu: số câu đọc từ `QUIZ_QUESTIONS`
 * để không lệch khi thêm/bớt câu; mỗi câu vẫn giữ 4 phương án, 1 đáp án đúng,
 * kèm giải thích.
 *
 * Nhịp này nằm TRONG cảnh 07 — xem `ClosingSection.tsx`.
 */
const RULES = [
  {
    value: String(QUIZ_QUESTIONS.length).padStart(2, "0"),
    label: "Câu hỏi",
    note: "Về địa điểm, nhân vật và sự kiện",
  },
  { value: "04", label: "Phương án", note: "Chỉ một đáp án đúng mỗi câu" },
  { value: "01", label: "Lời giải thích", note: "Hiện sau khi bạn trả lời" },
] as const;

export function QuizTeaserSection() {
  return (
    <ChapterFrame
      id="chapter-07-quiz"
      index="07"
      label="Test Your Knowledge"
      title="Bạn đã hiểu những địa chỉ đỏ đến đâu?"
      description="Thử thách kiến thức về các địa điểm, nhân vật và sự kiện lịch sử đã khám phá. Mỗi câu trả lời là một cơ hội hiểu thêm về quá khứ."
      plate="grid"
    >
      <ParallaxGhost
        strength={0.7}
        className="pointer-events-none absolute -bottom-10 left-0 hidden font-display text-[22rem] leading-none text-gold/[0.035] select-none lg:block"
      >
        ?
      </ParallaxGhost>

      <Reveal variant="stagger" className="grid gap-px border border-line bg-line sm:grid-cols-3" respectReducedMotion>
        {RULES.map((rule) => (
          <div key={rule.label} className="bg-ink p-8">
            <p className="font-display text-[3.5rem] leading-none tabular-nums text-flag-bright">
              {rule.value}
            </p>
            <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-paper">
              {rule.label}
            </p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-paper-mute">
              {rule.note}
            </p>
          </div>
        ))}
      </Reveal>

      <Reveal variant="up" className="mt-14 flex justify-center" respectReducedMotion>
        <Button href="/thu-thach" size="lg">
          Bắt đầu thử thách
        </Button>
      </Reveal>
    </ChapterFrame>
  );
}