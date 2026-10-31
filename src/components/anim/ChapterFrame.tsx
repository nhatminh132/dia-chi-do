import { CameraRoom } from "@/components/anim/CameraRoom";
import { ParallaxBackdrop } from "@/components/anim/ParallaxBackdrop";
import { Reveal } from "@/components/anim/Reveal";
import { SceneBackdrop } from "@/components/cinematic/SceneBackdrop";
import { SceneMedia } from "@/components/cinematic/SceneMedia";
import { SceneSequenceMedia } from "@/components/cinematic/SceneSequenceMedia";
import { ChapterSlate } from "@/components/cinematic/ChapterSlate";
import { SceneSeam } from "@/components/cinematic/SceneSeam";
import { CinematicPlate, type PlateVariant } from "@/components/media/CinematicPlate";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { SceneVideo } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Khung chung cho mỗi chương của trang chủ.
 *
 * Mỗi chương có "nhịp" riêng (nền khác nhau, cách bố trí khác nhau) nhưng
 * dùng chung một bộ khung này — đó là cách giữ cả 8 section trông như một
 * tác phẩm duy nhất chứ không phải 8 trang dán vào nhau.
 *
 * Server component: toàn bộ hiệu ứng do `Reveal` bên trong lo, khung này
 * không cần JavaScript.
 */
export function ChapterFrame({
  index,
  label,
  title,
  description,
  /** Kiểu nền khí quyển. */
  plate = "grid",
  /** Nền đậm hơn cho chương kết thúc. */
  tone = "dark",
  children,
  className,
  id,
  /**
   * Cấp heading ngữ nghĩa.
   *
   * Phase 5.5 §1.1: mỗi trang công khai phải có ĐÚNG MỘT `<h1>` thật.
   * Trước đây mọi trang dùng ChapterFrame đều xuất `<h2>`, khiến `/ban-do`
   * và `/dong-thoi-gian` không có h1 nào. Thay vì chèn thêm một `<h1>`
   * sr-only song song (dễ sinh trùng khi Next giữ DOM cũ), ta hạ cấp thẳng
   * tiêu đề hiển thị sẵn xuống `h1` — giữ nguyên typography, không đổi
   * bố cục, không thêm phần tử nào.
   *
   * - Trang chủ: hero đã có `<h1>` riêng → các chương sau giữ `h2`.
   * - Trang con: truyền `headingLevel="h1"`.
   */
  headingLevel = "h2",
  /**
   * Phạm vi chuyển động máy quay.
   *
   * - `"heading"` (mặc định): CHỈ tiêu đề + mô tả tiến lên. An toàn với mọi
   *   trang.
   * - `"full"`: toàn bộ nội dung chương tiến lên. Chỉ dùng cho trang KHÔNG
   *   có phần tử `position: sticky` bên trong.
   *
   * ── Vì sao phải phân biệt ────────────────────────────────────────────
   *
   * `transform` trên một phần tử tạo containing block mới cho mọi
   * `position: sticky` bên trong nó — cột bộ lọc bám theo khi cuộn sẽ trượt
   * lệch, và khoảng cách `top-32` bị nhân thêm hệ số scale.
   *
   * `/tu-lieu`, `/nguon-tham-khao` và `/ban-do` đều có cột `sticky` nằm
   * TRONG `ChapterFrame`. Vì vậy mặc định là `"heading"`, và chỉ trang chủ
   * (không có `sticky` nào) mới bật `"full"`.
   */
  camera = "heading",
  /**
   * Cảnh cinematic của chương (History Web V2).
   *
   * Khi có, khung này dựng thêm LỚP A — khí quyển: video nếu cảnh đã có tệp,
   * lớp nền tĩnh riêng cho cảnh nếu chưa. Cả hai nằm trong lớp trang trí
   * `aria-hidden` nên không bao giờ chặn thao tác.
   *
   * KHÔNG có `scene` ⇒ khung dùng đúng `CinematicPlate` như trước. Hành vi
   * cũ giữ nguyên cho mọi trang con.
   */
  scene,
  /** Nội dung overlay của một scene sequence fullscreen. */
  sequenceOverlay,
  /**
   * Lớp B — tư liệu lưu trữ. Render trong khung nội dung, TRÊN nền.
   */
  archival,
  /**
   * Bật title card điện ảnh thay cho `SectionLabel`.
   *
   * Giá trị là dòng metadata ngắn (ví dụ "10 hồ sơ công khai"). Không truyền
   * thì mọi trang giữ nguyên nhãn section cũ.
   */
  slateMeta,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
  plate?: PlateVariant;
  tone?: "dark" | "deep";
  children?: React.ReactNode;
  className?: string;
  /** Đặt để các mục khác nhảy tới (ví dụ chỉ dẫn cuộn của hero). */
  id?: string;
  headingLevel?: "h1" | "h2";
  camera?: "heading" | "full" | "static";
  scene?: SceneVideo;
  sequenceOverlay?: React.ReactNode;
  archival?: React.ReactNode;
  slateMeta?: string;
}) {
  // id của tiêu đề phải khác id của <section> để không trùng ID trong DOM.
  const headingId = `${id ?? `chapter-${index}`}-title`;
  const Heading = headingLevel;

  return (
    /*
      `CameraRoom` bọc ngoài để máy quay điện ảnh có một "khung" để đo
      vị trí. Bên trong nó, lớp nền được đánh dấu `depth` (mờ dần rồi sắc
      lại khi vào tiêu điểm) và khối tiêu đề được đánh dấu `data-camera-plane`
      (tiến lên nhẹ, luôn nét).
    */
    <CameraRoom>
      <section
        id={id}
        aria-labelledby={headingId}
        data-scene={scene?.id}
        data-scene-index={index}
        className={cn(
          // KHÔNG dùng `overflow-hidden` ở đây — xem lớp cắt bên dưới.
          "relative isolate border-t border-line",
          tone === "deep" ? "bg-ink-900" : "bg-ink",
          className,
        )}
      >
        <SceneSeam index={index} />

        {/*
          LỚP CẮT — thay cho `overflow-hidden` trên chính `<section>`.

          Nền trôi phải được cắt ở mép chương, nếu không nó sẽ tràn sang
          chương bên cạnh. Nhưng `overflow: hidden` trên `<section>` lại PHÁ
          `position: sticky` của các cột bám (cột bộ lọc ở `/tu-lieu`,
          `/nguon-tham-khao`, cột bản đồ ở `/ban-do`).

          Lý do: `overflow: hidden` biến phần tử thành một SCROLL CONTAINER.
          Phần tử `sticky` bám vào scroll container gần nhất — nếu đó là
          `<section>` (vốn không bao giờ cuộn), thì nó bám vào một vùng
          đứng yên, tức là không bám gì cả.

          Đo thực tế trước khi sửa:
            overflow: hidden   → sticky top = -460px  (trượt mất)
            overflow: visible  → sticky top =  128px  (bám đúng `top-32`)

          Nên: cắt bằng một lớp BÊ NGOÀI nội dung. Lớp cắt nằm cạnh nội
          dung, không phải tổ tiên của nó ⇒ `sticky` nhìn thấy viewport và
          bám đúng.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Nền khí quyển trôi theo cuộn.
              Trước đây `CinematicPlate` là lớp nền TĈNH: người xem cuộn qua
              một chương mà không có gì chuyển. Bọc nó trong `ParallaxBackdrop`
              để nền trôi chậm, cộng với lớp `chapter-shift` ở trên tạo cảm
              giác đã sang chương mới.

              Hai lớp trôi NGƯỢC chiều nhau tạo chiều sâu — lớp gốc trôi chậm,
              lớp quầng sáng trôi nhanh hơn. Một lớp đơn lẻ trông như trang
              đang bị trượt, hai lớp mới trông như không gian đang chuyển động.

              Lớp `depth` đầu tiên còn được máy quay điện ảnh dùng làm mặt
              phẳng nền: nó mờ và lùi ra xa khi chưa tới tiêu điểm, rồi sắc
              lại khi phòng đi vào khung hình.

              ── Lớp A của lớp cinematic (History Web V2) ──────────────────
              Khi chương có `scene`, video (nếu có tệp) nằm trong một mặt
              phẳng camera riêng. Mặt phẳng này trôi chậm hơn nội dung, có
              lớp grade/vignette riêng, còn nền tĩnh bên dưới vẫn trôi ngược
              chiều để giữ chiều sâu. */}
          {scene?.sequence?.length ? null : scene ? (
            <ParallaxBackdrop
              strength={18}
              depth
              className="scene-video-plane z-10"
            >
              <SceneMedia scene={scene} className="scene-video-media" />
            </ParallaxBackdrop>
          ) : null}

          <ParallaxBackdrop strength={34} depth className="z-0 opacity-70">
            {scene ? (
              <SceneBackdrop sceneId={scene.id} />
            ) : (
              <CinematicPlate
                variant={plate}
                density={tone === "deep" ? 0.7 : 0.45}
              />
            )}
          </ParallaxBackdrop>

          <ParallaxBackdrop strength={-52} className="z-[2] opacity-[0.22] mix-blend-screen">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 55% 45% at 78% 22%, rgba(200,16,46,0.30) 0%, rgba(200,16,46,0) 68%)",
              }}
            />
          </ParallaxBackdrop>

          {/* Dải chuyển màu ở mép trên — ranh giới giữa hai chương, tinh tế
              nhưng đủ để mắt cảm nhận "đã sang chương mới". */}
          <div className="chapter-shift pointer-events-none absolute inset-x-0 top-0 z-[3] h-28" />

          <div className="scene-cinema-line pointer-events-none absolute inset-x-5 top-8 z-[4] h-px sm:inset-x-8 lg:inset-x-12" />

          {/* Số chương khổng lớ mờ — dấu ấn triển lãm. `aria-hidden` vì đây là
              trang trí: nó lặp lại đúng thứ `SectionLabel` đã nói bằng chữ thật,
              và đọc nó ra sẽ thành nhiễu cho trình đọc màn hình. */}
          <span className="chapter-ghost pointer-events-none absolute -right-[0.06em] top-[0.06em] z-[4] hidden select-none lg:block">
            {index}
          </span>
        </div>

        {scene?.sequence?.length ? (
          <div
            data-scene-sequence-runway
            className="relative z-10"
          >
            {/* Màn hẹp: sân khấu cao theo nội dung và KHÔNG pin — nội dung
                biên tập xếp dọc, cuộn tự nhiên (xem `StorySection`). */}
            <div
              data-scene-sequence-stage
              className="scene-video-plane scene-video-stage relative flex flex-col justify-center overflow-hidden py-24 lg:h-[100dvh] lg:min-h-[100svh] lg:justify-start lg:py-0"
            >
              <SceneSequenceMedia
                clips={scene.sequence}
                poster={scene.poster}
                className="scene-video-media"
              />
              {sequenceOverlay}
            </div>
          </div>
        ) : null}

        {!(scene?.sequence?.length && sequenceOverlay) ? (
          <div
            data-camera-plane={camera === "full" ? "" : undefined}
            className="relative z-20 mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36 xl:px-16"
          >
            <div
              data-camera-plane={camera === "heading" ? "" : undefined}
              className="max-w-3xl"
            >
              {slateMeta ? (
                <ChapterSlate index={index} label={label} meta={slateMeta} />
              ) : (
                <SectionLabel index={index} title={label} />
              )}

            {/* Tiêu đề chương dâng lên có trọng lượng — biến thể `settle` của
                Reveal, chậm hơn `up` để tiêu đề có "độ nặng" của một chương
                văn bản, thay vì bật lên như một thẻ giao diện. */}
              <Reveal variant="settle" respectReducedMotion>
                <Heading
                  id={headingId}
                  className="mt-7 text-balance font-display text-[length:var(--text-h1)] uppercase leading-[1.04] text-paper text-cinematic"
                >
                  {title}
                </Heading>
              </Reveal>

              {description ? (
                <p className="measure mt-6 text-pretty text-[length:var(--text-lead)] leading-[1.85] text-paper-mute">
                  {description}
                </p>
              ) : null}
            </div>

          {/* Lớp B — tư liệu lưu trữ, nằm trên nền khí quyển. */}
            {archival ? (
              <div className="relative mt-16 lg:mt-20">{archival}</div>
            ) : null}

            {children ? <div className="relative mt-16 lg:mt-20">{children}</div> : null}
          </div>
        ) : null}
      </section>
    </CameraRoom>
  );
}
