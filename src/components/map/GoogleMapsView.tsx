"use client";

import { useMemo } from "react";
import type { Site } from "@/data/types";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BẢN ĐỒ GOOGLE — nguồn địa lý đối chiếu
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Vì sao thêm bản này ──────────────────────────────────────────────────
 *
 * Bản đồ Leaflet + OpenStreetMap trước đây không ổn định: đo được 17
 * request tile bị fail, và trong khung hình xuất hiện những ô vuông đen —
 * marker nằm trên vùng TRỐNG không có bản đồ nền, trông như bị lệch hẳn.
 * Người xem không phân biệt được "ô nền chưa tải" với "toạ độ sai".
 *
 * Bản đồ là một lời khẳng định về vị trí. Nếu không hiển thị được nền đúng
 * thì tốt hơn là đưa người xem tới nơi có bản đồ chắc chắn.
 *
 * ── Vì sao dùng được không cần API key ───────────────────────────────────
 *
 * Google đã chặn URL `maps.google.com/maps?...&output=embed` ở cấp trang
 * trực tiếp (báo *"must be used in an iframe"*), nhưng CHẤP NHẬN trong thẻ
 * `<iframe>`. Đây là đường nhúng cổ, không cần khoá, không tốn lượt gọi
 * Embed API có hạn mức.
 *
 * ── Đánh đổi đã chấp nhận ────────────────────────────────────────────────
 *
 * Giao diện Google mặc định là sáng, lệch với bảng màu tối của trang. Đây
 * là cái giá phải trả để có một bản đồ luôn đúng và luôn tải được. Khung
 * bao bên ngoài vẫn giữ ngôn ngữ thiết kế của trang để nó không bị "rơi"
 * vào giữa.
 */

/** Bán kính tìm kiếm, mét. Bán kính nhỏ để dùng cho một địa điểm cụ thể. */
const SEARCH_RADIUS_M = 400;

function embedUrl(lat: number, lng: number): string {
  /*
    KHÔNG `encodeURIComponent` trước rồi đưa vào `URLSearchParams`.

    `URLSearchParams` đã tự encode khi serialize. Nếu encode sẵn thì dấu `%`
    bị encode thành `%25` → `q=10.7687%252C106.7054`, và Google tìm đúng
    chuỗi literal đó, không phải toạ độ.
  */
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    hl: "vi",
    z: "17",
    output: "embed",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

export function GoogleMapsView({
  sites,
  selected,
}: {
  sites: Site[];
  selected: Site | null;
}) {
  /**
   * Địa điểm hiển thị được: có Place ID nhúng, hoặc có toạ độ để dựng iframe.
   *
   * Cần nhận cả hai vì hai cơ sở bí mật chưa có toạ độ đã qua cổng kiểm
   * duyệt — nhưng chúng CÓ Place ID do Google xác lập, nên vẫn hiện được
   * trên bản đồ mà không phải đoán vị trí.
   */
  const target = useMemo(() => {
    const showable = sites.filter(
      (s): s is Site & { coordinates?: NonNullable<Site["coordinates"]> } =>
        s.mapEmbedUrl != null || s.coordinates != null,
    );
    if (selected && (selected.mapEmbedUrl || selected.coordinates)) return selected;
    return showable[0] ?? null;
  }, [sites, selected]);

  if (!target) {
    return (
      <div className="grid h-full place-items-center bg-ink-900 px-6 text-center">
        <p className="max-w-xs font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.16em] text-paper-faint">
          Chưa có địa điểm nào được duyệt để hiển thị trên bản đồ
        </p>
      </div>
    );
  }

  /* Ưu tiên URL nhúng do Google sinh ra (có Place ID). */
  const src =
    target.mapEmbedUrl ?? embedUrl(target.coordinates!.lat, target.coordinates!.lng);
  const { lat, lng } = target.coordinates ?? { lat: null, lng: null };

  return (
    <div className="relative flex h-full flex-col">
      {/* Bản thân bản đồ */}
      <div className="relative min-h-0 flex-1">
        <iframe
          /* `key` buộc dựng lại iframe khi đổi địa điểm — `src` của iframe
             KHÔNG tự nạp lại khi prop đổi, nên không có `key` thì bản đồ sẽ
             kẹt ở địa điểm cũ. */
          key={`${target.id}-${src}`}
          title={`Bản đồ vị trí ${target.name}`}
          src={src}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Thanh nhãn phía dưới — giữ ngôn ngữ tối của trang. Không đặt nút mở
          Google Maps ở đây: khung nhúng của Google đã tự chèn nút của nó, hai
          nút cạnh nhau chỉ gây trùng lặp. */}
      <div className="flex shrink-0 items-center gap-3 border-t border-line bg-ink-900 px-3 py-2">
        <p className="min-w-0 truncate font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-faint">
          {target.name}
        </p>
      </div>

      {/* Bán kính tìm kiếm chỉ để giải thích cho người đọc mã: nếu sau này
          đổi sang nhúng nhiều điểm thì cần biết độ chính xác hiện tại. */}
      <span className="sr-only">
        {lat != null
          ? `Bản đồ hiển thị trong bán kính khoảng ${SEARCH_RADIUS_M} mét quanh toạ độ ${lat}, ${lng}.`
          : "Bản đồ hiển thị vị trí do Google xác lập cho địa điểm này."}
      </span>
    </div>
  );
}