import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { getScene } from "@/lib/scenes";

/** CẢNH 02 — một sân khấu fullscreen với nền video liên tục. */
export function StorySection() {
  const scene = getScene("scene-02-city");

  const sequenceOverlay = (
    <div className="scene-sequence-copy pointer-events-none absolute inset-0 z-20 max-lg:relative max-lg:inset-auto max-lg:flex max-lg:flex-col max-lg:gap-20">
      <div
        data-sequence-copy="city"
        className="scene-sequence-copy-stage absolute inset-0 flex items-center px-6 pt-16 sm:px-10 lg:px-[9vw] max-lg:relative max-lg:inset-auto max-lg:items-start max-lg:pt-0"
      >
        <div className="scene-sequence-copy-card max-w-[44rem]">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-gold sm:text-[0.7rem]">
            02 / The City
          </p>
          <h2
            id="chapter-02-title"
            className="mt-5 max-w-[12ch] text-balance font-display text-[clamp(2.45rem,6.1vw,6.4rem)] uppercase leading-[0.96] tracking-[-0.035em] text-paper text-cinematic"
          >
            Một thành phố, nhiều thế hệ đấu tranh.
          </h2>
          <p className="mt-6 max-w-[52ch] text-pretty text-[clamp(0.92rem,1.25vw,1.12rem)] leading-[1.7] text-paper-mute">
            Từ thời thuộc địa đến những năm tháng chiến tranh, Sài Gòn là nơi
            nhiều thế hệ cùng góp sức vào hành trình giành độc lập, thống nhất
            đất nước.
          </p>
        </div>
      </div>

      <div
        data-sequence-copy="journey"
        className="scene-sequence-copy-stage scene-sequence-copy-journey absolute inset-0 flex items-center px-6 pt-16 sm:px-10 lg:px-[9vw] max-lg:relative max-lg:inset-auto max-lg:items-start max-lg:pt-0"
      >
        <div className="scene-sequence-copy-card max-w-[42rem]">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-gold sm:text-[0.7rem]">
            The Journey
          </p>
          <h2 className="mt-5 max-w-[13ch] text-balance font-display text-[clamp(2.35rem,5.6vw,5.8rem)] uppercase leading-[0.96] tracking-[-0.035em] text-paper text-cinematic">
            Từ khát vọng đến ngày thống nhất.
          </h2>
          <p className="mt-6 max-w-[52ch] text-pretty text-[clamp(0.92rem,1.25vw,1.12rem)] leading-[1.7] text-paper-mute">
            Những bước ngoặt lịch sử và sự đóng góp của nhiều thế hệ đã làm
            nên hành trình thống nhất đất nước.
          </p>
          <Button
            href="/dong-thoi-gian"
            variant="outline"
            className="pointer-events-auto mt-8"
          >
            Khám phá dòng thời gian
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ChapterFrame
      id="chapter-02"
      index="02"
      label="The City"
      title="Một thành phố, nhiều thế hệ đấu tranh."
      plate="paper"
      scene={scene}
      camera="static"
      sequenceOverlay={sequenceOverlay}
    />
  );
}
