import Link from "next/link";
import { ArchiveImage } from "@/components/media/ArchiveImage";
import type { ArchiveItem, SourceRef } from "@/data/types";
import { isPublic } from "@/lib/content-status";
import { cn } from "@/lib/utils";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  LỚP B — TƯ LIỆU LƯU TRỮ
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Mọi bằng chứng lịch sử trên website đều nằm ở lớp này, và LUÔN LUÔN là
 *  HTML + ảnh riêng — không bao giờ nằm trong video, không bao giờ được bake
 *  vào một tấm hình AI.
 *
 *  ── Thứ tự lớp ───────────────────────────────────────────────────────────
 *
 *      Lớp A  khí quyển   video (nếu có) — không chứa thông tin
 *      Lớp B  tư liệu     ảnh + chú thích + nguồn — CÓ THẬT hoặc nói rõ là
 *                          chưa có
 *      Lớp C  giao diện   tiêu đề, mốc thời gian, điều hướng, bản đồ
 *
 *  Nếu Lớp A không tải được, Lớp B và C vẫn đứng vững và vẫn đầy đủ.
 *
 *  ── Nguyên tắc tuyệt đối ────────────────────────────────────────────────
 *
 *   • KHÔNG dùng ảnh AI thay ảnh lịch sử. Không có ngoại lệ này.
 *   • KHÔNG bịa chú thích, ngày tháng, địa điểm hay trích dẫn.
 *   • Tư liệu chưa được công bố ⇒ hiện đúng trạng thái "đang được bổ sung",
 *     KHÔNG dùng ảnh minh họa để che.
 *   • Ngày và địa điểm chỉ hiện khi nguồn xác nhận.
 *   • Mọi nguồn phải là liên kết THẬT, bấm được.
 */

export function ArchivalLayer({
  item,
  /** Địa điểm liên quan — chỉ truyền khi đã kiểm chứng. */
  location,
  /** Nguồn xác nhận tư liệu. */
  sources = [],
  /** Tên + đường dẫn tới hồ sơ địa điểm. */
  siteName,
  siteHref,
  /** Số hiệu tấm, ví dụ "Plate 01". */
  plate,
  className,
}: {
  item: ArchiveItem;
  location?: string;
  sources?: SourceRef[];
  siteName?: string;
  siteHref?: string;
  plate?: string;
  className?: string;
}) {
  const published = isPublic(item.status);
  const hasImage = Boolean(item.src) && published;

  /* Nguồn đầu tiên có URL thật — nguồn có thể mở ra để kiểm chứng. */
  const primarySource = sources.find((source) => Boolean(source.url));

  return (
    <figure className={cn("m-0", className)}>
      {/* Khung trưng bày — dấu đăng ký ở bốn góc, cùng ngôn ngữ với
          tấm lưu trữ của bảo tàng. */}
      <div className="relative border border-line-strong bg-ink-900 p-2 sm:p-3">
        {(
          [
            "left-1 top-1 border-l border-t",
            "right-1 top-1 border-r border-t",
            "left-1 bottom-1 border-b border-l",
            "right-1 bottom-1 border-b border-r",
          ] as const
        ).map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={cn("pointer-events-none absolute size-3 border-paper/30", pos)}
          />
        ))}

        {plate ? (
          <span className="absolute -top-2 left-3 z-10 bg-ink-900 px-1.5 font-mono text-[0.55rem] uppercase tracking-[0.26em] text-paper-faint">
            {plate}
          </span>
        ) : null}

        <ArchiveImage
          item={item}
          ratio="4 / 3"
          hideCaption
          sizes="(max-width: 768px) 92vw, 44vw"
        />
      </div>

      {/* Chú thích biên tập */}
      <figcaption
        data-archival-caption=""
        className={cn(
          "mt-4 space-y-2 border-l-2 pl-4",
          hasImage ? "border-flag-red/50" : "border-line-strong",
        )}
      >
        {item.caption ? (
          <p className="text-pretty text-[0.92rem] leading-relaxed text-paper">
            {item.caption}
          </p>
        ) : null}

        {/* Ngày / địa điểm — CHỈ hiện khi có và đã được xác nhận. */}
        {(item.dateOrPeriod || location) ? (
          <p className="font-mono text-[0.64rem] uppercase leading-relaxed tracking-[0.14em] text-gold">
            {[item.dateOrPeriod, location].filter(Boolean).join("  ·  ")}
          </p>
        ) : null}

        {siteName && siteHref ? (
          <p className="font-mono text-[0.64rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
            Địa điểm:{" "}
            <Link
              href={siteHref}
              className="text-paper-mute underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-flag-bright"
            >
              {siteName}
            </Link>
          </p>
        ) : null}

        {/* Nguồn — phải là liên kết thật. */}
        {primarySource ? (
          <p className="font-mono text-[0.64rem] leading-relaxed tracking-[0.1em] text-paper-faint">
            Nguồn:{" "}
            <a
              href={primarySource.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-paper-mute underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-gold"
            >
              {primarySource.title}
              {primarySource.publisher ? ` — ${primarySource.publisher}` : ""}
            </a>
          </p>
        ) : sources.length ? (
          <p className="font-mono text-[0.64rem] leading-relaxed tracking-[0.1em] text-paper-faint">
            Nguồn: {sources[0].title}
            {sources[0].publisher ? ` — ${sources[0].publisher}` : ""} (chưa có đường
            dẫn để mở kiểm chứng)
          </p>
        ) : null}

        {/* Giấy phép sử dụng — chỉ ghi khi đã biết. Không đoán. */}
        {item.license ? (
          <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-paper-faint">
            Giấy phép: {item.license}
          </p>
        ) : null}

        {item.credit ? (
          <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-paper-faint">
            Ảnh: {item.credit}
          </p>
        ) : null}

        {/* Trạng thái công bố — nói rõ tấm này đã hay chưa được kiểm chứng. */}
        {!hasImage ? (
          <p className="font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.16em] text-gold-dim">
            Tư liệu chưa được công bố — khung đang trưng bày là vị trí trống,
            không phải ảnh tư liệu.
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
