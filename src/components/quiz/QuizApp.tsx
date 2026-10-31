"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { QUIZ_QUESTIONS, QUIZ_TOPIC_LABELS } from "@/lib/quiz";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  THỬ THÁCH LỊCH SỬ — giao diện kiểm tra kiến thức
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Một luồng tương tác hoàn chỉnh: chọn câu → trả lời → xem giải thích →
 * sang câu tiếp → tổng kết. Có tiến độ, chấm điểm, làm lại, và bàn phím.
 *
 * ── Về việc dùng `Reveal` ────────────────────────────────────────────────
 *
 * Các khối hiện ra dùng `Reveal` (đã sửa ở Phase 5.5/6 để chờ bố cục ổn
 * định trước khi tạo ScrollTrigger). Ở đây phần lớn nội dung nằm NGAY
 * TRONG KHUNG NHÌN, nên hiệu ứng reveal chỉ là lớp trang trí nhẹ; nếu JavaScript
 * không chạy, nội dung vẫn hiện đầy đủ nhờ nguyên tắc `gsap.from` của
 * `Reveal`.
 *
 * ── Bàn phím ─────────────────────────────────────────────────────────────
 *
 *   1 – 4  chọn phương án tương ứng
 *   Enter  sang câu tiếp theo / xem kết quả
 *
 * Không bắt buộc người dùng dùng chuột; mọi nút đều là `<button>` thật nên
 * điều hướng bằng Tab hoạt động như mọi trang khác.
 */

type Phase = "intro" | "question" | "result";

interface Answer {
  questionId: string;
  chosen: number;
  correct: boolean;
}

export function QuizApp() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);

  const questions = QUIZ_QUESTIONS;
  const current = questions[index];
  const answered = chosen !== null;

  const score = useMemo(
    () => answers.filter((a) => a.correct).length,
    [answers],
  );

  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const choose = useCallback(
    (optionIndex: number) => {
      if (chosen !== null) return;
      setChosen(optionIndex);
      setAnswers((prev) => [
        ...prev,
        {
          questionId: current.id,
          chosen: optionIndex,
          correct: current.options[optionIndex].correct,
        },
      ]);
    },
    [chosen, current],
  );
  // Khi sang câu mới, đưa tiêu đề câu hỏi vào vùng đọc của trình đọc màn
  // hình để người dùng biết mình đang ở câu nào.
  useEffect(() => {
    if (phase === "question") headingRef.current?.focus();
  }, [phase, index]);

  // Phím tắt 1–4 và Enter.
  useEffect(() => {
    if (phase !== "question") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      // Không cướp phím khi người dùng đang gõ vào ô nhập.
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (!answered && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        choose(Number(event.key) - 1);
        return;
      }

      if (answered && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        nextRef.current?.click();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, answered, index]);


  const next = useCallback(() => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setChosen(null);
      setPhase("question");
    } else {
      setPhase("result");
    }
  }, [index, questions.length]);

  const restart = useCallback(() => {
    setAnswers([]);
    setChosen(null);
    setIndex(0);
    setPhase("intro");
  }, []);

  /* ── Màn hình mở đầu ─────────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-3xl">
        <Reveal variant="up">
          <div className="border border-line bg-ink-900/70 p-8 sm:p-11">
            <Badge tone="gold">{questions.length} câu hỏi</Badge>

            <h2 className="mt-6 text-balance font-display text-[clamp(1.5rem,3.4vw,2.4rem)] uppercase leading-[1.1] text-paper">
              Kiểm tra những gì bạn đã đọc
            </h2>

            <p className="mt-5 max-w-[58ch] text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
              Mỗi câu lấy từ một mốc thời gian hoặc một hồ sơ địa điểm trong
              dự án. Sau khi trả lời, bạn sẽ được xem giải thích kèm nơi câu
              hỏi lấy ra — để tự đối chiếu lại với hồ sơ.
            </p>

            <ul className="mt-8 space-y-2.5">
              {[
                "Bấm hoặc nhấn phím 1 – 4 để chọn phương án",
                "Sau khi trả lời, nhấn Enter để sang câu tiếp theo",
                "Cuối cùng bạn xem điểm và giải thích cho từng câu",
              ].map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 border-b border-line pb-2.5 text-[0.86rem] leading-relaxed text-paper-mute"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block size-1.5 shrink-0 rotate-45 bg-flag-red"
                  />
                  {tip}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button onClick={() => setPhase("question")}>Bắt đầu</Button>
              <Button href="/dong-thoi-gian" variant="outline">
                Xem lại dòng thời gian
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  /* ── Màn hình kết quả ────────────────────────────────────────────────── */
  if (phase === "result") {
    const percent = Math.round((score / questions.length) * 100);
    const byTopic = Object.keys(QUIZ_TOPIC_LABELS).map((topic) => {
      const list = answers.filter(
        (a) => questions.find((q) => q.id === a.questionId)?.topic === topic,
      );
      return {
        topic: topic as keyof typeof QUIZ_TOPIC_LABELS,
        total: list.length,
        correct: list.filter((a) => a.correct).length,
      };
    }).filter((row) => row.total > 0);

    return (
      <div className="mx-auto max-w-4xl">
        <Reveal variant="up">
          <div className="border border-line bg-ink-900/70 p-8 sm:p-11">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-gold-dim">
              Hoàn tất
            </p>

            <h2 className="mt-5 text-balance font-display text-[clamp(1.8rem,4.4vw,3.2rem)] uppercase leading-[1.06] text-paper">
              {score} / {questions.length} câu đúng
            </h2>

            <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-paper-faint">
              {percent}% —{" "}
              {percent === 100
                ? "bạn nắm được toàn bộ nội dung đã công bố"
                : percent >= 60
                  ? "bạn đã nắm phần lớn; đọc lại phần còn thiếu"
                  : "nên đọc lại dòng thời gian và các hồ sơ địa điểm"}
            </p>

            {byTopic.length > 0 ? (
              <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
                {byTopic.map((row) => (
                  <li key={row.topic} className="bg-ink p-4">
                    <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                      {QUIZ_TOPIC_LABELS[row.topic]}
                    </p>
                    <p className="mt-1.5 font-display text-2xl tabular-nums text-paper">
                      {row.correct}
                      <span className="text-paper-faint">/{row.total}</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3">
              <Button onClick={restart}>Làm lại</Button>
              <Button href="/dong-thoi-gian" variant="outline">
                Dòng thời gian
              </Button>
              <Button href="/ho-so/ben-nha-rong" variant="outline">
                Hồ sơ địa điểm
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" className="mt-14">
          <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
            Xem lại từng câu
          </h3>

          <ol className="mt-6 space-y-px border border-line bg-line">
            {questions.map((question, qIndex) => {
              const answer = answers.find((a) => a.questionId === question.id);
              const chosenLabel = answer
                ? question.options[answer.chosen].label
                : "—";
              const rightLabel =
                question.options.find((o) => o.correct)?.label ?? "—";

              return (
                <li key={question.id} className="bg-ink p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="max-w-[62ch] text-pretty text-[0.92rem] leading-relaxed text-paper-dim">
                      <span className="mr-2 font-mono text-[0.62rem] tabular-nums text-paper-faint">
                        {String(qIndex + 1).padStart(2, "0")}
                      </span>
                      {question.prompt}
                    </p>
                    <Badge tone={answer?.correct ? "gold" : "flag"}>
                      {answer?.correct ? "Đúng" : "Sai"}
                    </Badge>
                  </div>

                  <dl className="mt-3 space-y-1.5 font-mono text-[0.66rem]">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="uppercase tracking-[0.14em] text-paper-faint">
                        Bạn chọn
                      </dt>
                      <dd className="text-paper-mute">{chosenLabel}</dd>
                    </div>
                    {!answer?.correct ? (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="uppercase tracking-[0.14em] text-paper-faint">
                          Đáp án
                        </dt>
                        <dd className="text-gold-dim">{rightLabel}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <p className="mt-3 border-l-2 border-line-strong pl-3 text-pretty text-[0.83rem] leading-relaxed text-paper-faint">
                    {question.explanation}
                  </p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    );
  }

  /* ── Màn hình câu hỏi ────────────────────────────────────────────────── */
  const answeredCount = answers.length;
  const percent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Tiến độ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint">
          Câu {index + 1} / {questions.length}
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint">
          Đúng: {score}
        </p>
      </div>

      <div
        className="mt-4 h-px w-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={answeredCount}
        aria-label="Tiến độ bài kiểm tra"
      >
        <div
          className="h-px bg-flag-red transition-[width] duration-500 ease-cinematic"
          style={{ width: `${percent}%` }}
        />
      </div>

      <Reveal variant="up" key={current.id}>
        <div className="mt-10">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-gold-dim">
            {QUIZ_TOPIC_LABELS[current.topic]}
          </p>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-balance font-display text-[clamp(1.35rem,3.2vw,2.1rem)] uppercase leading-[1.14] text-paper outline-none"
          >
            {current.prompt}
          </h2>

          <p className="mt-4 text-[0.85rem] leading-relaxed text-paper-faint">
            {current.hint}
          </p>

          {/* Phương án */}
          <ul className="mt-8 space-y-px border border-line bg-line">
            {current.options.map((option, optionIndex) => {
              const isChosen = chosen === optionIndex;
              const isRight = option.correct;
              const showResult = answered;

              return (
                <li key={option.label} className="bg-ink">
                  <button
                    type="button"
                    onClick={() => choose(optionIndex)}
                    disabled={answered}
                    aria-pressed={isChosen}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left transition-colors duration-300",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold",
                      "disabled:cursor-default",
                      !showResult &&
                        "hover:bg-ink-800 focus-visible:bg-ink-800",
                      showResult && isRight && "bg-flag-deep/40",
                      showResult && isChosen && !isRight && "bg-ink-700",
                      showResult && !isChosen && !isRight && "opacity-60",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 flex size-6 shrink-0 items-center justify-center border font-mono text-[0.62rem] transition-colors",
                        showResult && isRight
                          ? "border-gold bg-gold/20 text-gold"
                          : showResult && isChosen
                            ? "border-flag-bright text-flag-bright"
                            : "border-line-strong text-paper-faint",
                      )}
                    >
                      {showResult && isRight ? "✓" : showResult && isChosen ? "✕" : optionIndex + 1}
                    </span>

                    <span className="text-pretty text-[0.95rem] leading-relaxed text-paper">
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Phản hồi */}
          <div aria-live="polite" aria-atomic="true">
            {answered ? (
              <div className="mt-8 border border-line bg-ink-900/70 p-6">
                <p
                  className={cn(
                    "font-mono text-[0.62rem] uppercase tracking-[0.22em]",
                    chosen !== null && current.options[chosen].correct
                      ? "text-gold"
                      : "text-flag-bright",
                  )}
                >
                  {current.options[chosen].correct
                    ? "Chính xác"
                    : "Chưa đúng"}
                </p>

                <p className="mt-4 text-pretty text-[0.92rem] leading-[1.8] text-paper-mute">
                  {current.explanation}
                </p>

                <p className="mt-4 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
                  Nguồn: {current.source}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {current.siteSlug ? (
                    <Button href={`/ho-so/${current.siteSlug}`} variant="outline" size="sm">
                      Mở hồ sơ
                    </Button>
                  ) : null}
                  {current.eventId ? (
                    <Button href="/dong-thoi-gian" variant="outline" size="sm">
                      Dòng thời gian
                    </Button>
                  ) : null}
                </div>

                <div className="mt-7">
                  <Button ref={nextRef} onClick={next}>
                    {index + 1 < questions.length ? "Câu tiếp theo" : "Xem kết quả"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Reveal>

      <p className="mt-8 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
        Mẹo: nhấn phím 1 – 4 để chọn, Enter để đi tiếp.{" "}
        <Link
          href="/dong-thoi-gian"
          className="underline underline-offset-4 transition-colors hover:text-gold"
        >
          Xem dòng thời gian
        </Link>{" "}
        nếu cần tra lại.
      </p>
    </div>
  );
}
