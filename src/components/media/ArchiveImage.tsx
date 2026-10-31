import Image from "next/image";
import type { ArchiveItem } from "@/data/types";
import { ArchivalPlate } from "@/components/media/ArchivalPlate";
import {
  ARCHIVE_PENDING_BODY,
  ARCHIVE_PENDING_TITLE,
  isPublic,
} from "@/lib/content-status";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ARCHIVE IMAGE — nguồn sự thật DUY NHẤT cho mọi hình ảnh trên website
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Mục tiêu: sau này bạn có ảnh thật chỉ cần sửa `src/data/*.ts`, không đụng UI.
 *
 *  Quy tắc bất di bất dịch:
 *   • KHÔNG có `src`  →  hiển thị placeholder + dòng "TƯ LIỆU ĐANG ĐƯỢC BỔ SUNG".
 *     TUYỆT ĐỐI không dùng ảnh minh họa, ảnh AI, hay texture trang trí để che.
 *   • `status` là `draft` / `unpublished`  →  coi như chưa có, render placeholder.
 *   • `alt` luôn bắt buộc (bắt buộc trong type) vì ảnh lịch sử mang thông tin.
 *   • Luôn kèm nguồn (`credit`) và giấy phép (`license`) khi có.
 *
 *  ⚠️ Ảnh lịch sử chưa được xác minh không được hiển thị như ảnh tư liệu thật.
 */

interface ArchiveImageProps {
  item: ArchiveItem;
  /** Tỉ lệ khung. Dùng để chống layout shift (CLS) khi ảnh chưa tải xong. */
  ratio?: string;
  /** Gợi ý `sizes` cho next/image — định nghĩa theo tỉ lệ hiển thị. */
  sizes?: string;
  /** Ảnh nằm ở trên màn hình đầu tiên → tải ưu tiên. */
  priority?: boolean;
  className?: string;
  /** Ẩn chú thích (dùng cho thumbnail trong lưới nhỏ). */
  hideCaption?: boolean;
}

export function ArchiveImage({
  item,
  ratio = "4 / 3",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
  hideCaption = false,
}: ArchiveImageProps) {
  const renderable = Boolean(item.src) && isPublic(item.status);
  const hasMeta = Boolean(item.credit || item.license || item.dateOrPeriod);

  return (
    <figure className={cn("group/figure", className)}>
      <div
        className="relative overflow-hidden border border-line bg-ink-800"
        style={{ aspectRatio: ratio }}
      >
        {renderable && item.src ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            decoding={priority ? "sync" : "async"}
            className="object-cover"
          />
        ) : (
          <ArchivePlaceholder status={item.status} itemId={item.id} />
        )}
      </div>

      {!hideCaption && (item.caption || hasMeta) ? (
        <figcaption
          className={cn(
            "mt-3 space-y-1.5 border-l border-line-strong pl-3",
            "font-mono text-[0.68rem] leading-relaxed tracking-wide text-paper-faint",
          )}
        >
          {item.caption ? <p className="text-paper-mute">{item.caption}</p> : null}

          {item.dateOrPeriod ? (
            <p className="uppercase tracking-[0.14em]">{item.dateOrPeriod}</p>
          ) : null}

          {hasMeta ? (
            <p className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
              {item.credit ? (
                <span>
                  <span className="text-paper-faint">Nguồn: </span>
                  {item.credit}
                </span>
              ) : null}
              {item.license ? (
                <span>
                  <span className="text-paper-faint">Giấy phép: </span>
                  {item.license}
                </span>
              ) : null}
            </p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */

function ArchivePlaceholder({
  status,
  itemId,
}: {
  status: ArchiveItem["status"];
  itemId: string;
}) {
  const pending = !isPublic(status);

  // Cùng ngôn ngữ thị giác với `ArchivalPlate` ở thẻ địa chỉ đỏ — một bảo tàng
  // không để trống chỗ trưng bày, nó treo tấm biển "tấm này đang trong kho".
  return (
    <div data-placeholder="true" className="absolute inset-0">
      <ArchivalPlate
        plate={`Plate ${itemId.toUpperCase()}`}
        title={pending ? ARCHIVE_PENDING_TITLE : "Ảnh đang được xác minh"}
        note={ARCHIVE_PENDING_BODY}
      />
    </div>
  );
}