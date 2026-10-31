import type { ContentStatus, Coordinates, Site } from "@/data/types";

/**
 * Cổng kiểm duyệt nội dung — spec §11 & §12.
 *
 * Đây là NƠI DUY NHẤT quyết định cái gì được hiển thị công khai.
 * UI không được tự kiểm tra `status` rải rác; mọi thứ gọi hàm ở đây.
 * Nhờ vậy khi đổi quy tắc chỉ cần sửa một chỗ.
 */

/** Nội dung được phép hiển thị công khai. */
export function isPublic(status: ContentStatus): boolean {
  return status === "verified" || status === "needs_review";
}

/** Đã đủ cơ sở để khẳng định như sự thật lịch sử. */
export function isVerified(status: ContentStatus): boolean {
  return status === "verified";
}

/**
 * Địa chỉ chỉ hiển thị khi đã xác minh (spec §4: "Địa chỉ: Chỉ hiển thị sau khi xác minh").
 * Nội dung chưa xác minh trả về null thay vì chuỗi rỗng, để giao diện
 * render "đang được cập nhật" thay vì trống lơ lửng.
 */
export function publicAddress(site: Site): string | null {
  if (!isVerified(site.status)) return null;
  return site.address ?? null;
}

/** Tọa độ chỉ dùng khi đã xác minh. */
export function verifiedCoordinates(site: Site): Coordinates | null {
  if (!isVerified(site.status)) return null;
  return site.coordinates ?? null;
}

/**
 * Tọa độ dùng cho bản đồ công khai.
 *
 * - `verified`     → được vẽ marker bình thường.
 * - `approximate` → vẫn vẽ marker, nhưng BẮT BUỘC kèm nhãn cảnh báo.
 * - rỗng / chưa verify → KHÔNG vẽ.
 */
export function mappableCoordinates(site: Site): Coordinates | null {
  if (!isPublic(site.status)) return null;
  return site.coordinates ?? null;
}

/** Tọa độ có phải xấp xỉ cần kiểm chứng không. */
export function isApproximate(site: Site): boolean {
  return site.coordinates?.accuracy === "approximate";
}

/* -------------------------------------------------------------------------
 * Nhãn hiển thị cho trạng thái nội dung
 * ---------------------------------------------------------------------- */

export interface StatusMeta {
  label: string;
  /** Cảnh báo mở rộng, dùng cho title/tooltip và màn hình hồ sơ. */
  hint: string;
  className: string;
}

const STATUS_META: Record<ContentStatus, StatusMeta> = {
  verified: {
    label: "ĐÃ XÁC MINH",
    hint: "Nội dung đã được đối chiếu với nguồn chính thức.",
    className: "border-gold/40 text-gold bg-gold/8",
  },
  needs_review: {
    label: "CẦN KIỂM CHỨNG",
    hint: "Nội dung chưa được đối chiếu đầy đủ. Vui lòng tham khảo nguồn chính thức trước khi sử dụng.",
    className: "border-gold-dim/50 text-gold-dim bg-gold/6",
  },
  draft: {
    label: "BẢN NHÁP",
    hint: "Nội dung đang được soạn thảo, chưa công bố.",
    className: "border-line-strong text-paper-mute bg-ink-700/50",
  },
  unpublished: {
    label: "CHƯA CÔNG BỐ",
    hint: "Nội dung đang được bổ sung.",
    className: "border-line-strong text-paper-mute bg-ink-700/50",
  },
};

export function statusMeta(status: ContentStatus): StatusMeta {
  return STATUS_META[status];
}

/* -------------------------------------------------------------------------
 * Nhãn cho tọa độ
 * ---------------------------------------------------------------------- */

export const APPROXIMATE_BADGE_LABEL = "CẦN KIỂM CHỨNG";

/** Copy hiển thị khi địa chỉ/tọa độ đang chờ xác minh. */
export const PENDING_LABEL = "ĐANG ĐƯỢC CẬP NHẬT";

/** Copy chuẩn khi chưa có tư liệu. */
export const ARCHIVE_PENDING_TITLE = "TƯ LIỆU ĐANG ĐƯỢC BỔ SUNG";
export const ARCHIVE_PENDING_BODY =
  "Chúng tôi ưu tiên tính chính xác và nguồn gốc rõ ràng để mỗi tư liệu đều góp phần kể lại lịch sử một cách đáng tin cậy.";

/** Copy cho trường hợp người dùng bật giảm chuyển động. */
export const REDUCED_MOTION_NOTICE =
  "Bạn đang bật giảm chuyển động trong hệ điều hành. Trang hiển thị dạng tĩnh để bảo đảm đọc dễ dàng; toàn bộ nội dung vẫn đầy đủ.";