import L from "leaflet";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  MARKER ĐỊA CHỈ ĐỎ
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Hai kiểu marker, KHÁC NHAU VỀ MẮT — người xem phải nhận ra ngay từ xa
 *  đâu là vị trí chính xác, đâu là vị trí ước lượng:
 *
 *  · XÁC MINH (accuracy: "verified") — hình thoi đặc, viền đỏ đậm, có lõi trắng.
 *  · XẤP XỈ (accuracy: "approximate") — hình tròn RỖNG, viền vàng đứt nét,
 *    kèm dấu "?" — nghĩa là "chưa chắc chắn", không phải một điểm chắc chắn.
 *
 *  Marker xấp xỉ KHÔNG BAO GIỜ được vẽ giống marker đã xác minh. Đây là
 *  yêu cầu trực tiếp từ dự án: tọa độ ước lượng không được trình bày như
 *  vị trí chính xác.
 */

const SIZE = 30;
const ANCHOR: L.PointExpression = [SIZE / 2, SIZE / 2];

function shell(inner: string, ring: string): string {
  return `
    <span class="red-address-marker__shell" style="
      position:absolute; inset:0; display:grid; place-items:center;
      width:${SIZE}px; height:${SIZE}px; border-radius:50%;
    ">
      ${ring}
      ${inner}
    </span>
  `;
}

/** Marker cho tọa độ đã xác minh — hình thoi đặc. */
function verifiedHtml(): string {
  return shell(
    `<svg viewBox="0 0 30 30" width="30" height="30" aria-hidden="true">
       <rect x="8" y="8" width="14" height="14" transform="rotate(45 15 15)"
             fill="#C8102E" stroke="#F2EBDD" stroke-width="1.4"/>
       <rect x="13" y="13" width="4" height="4" fill="#F2EBDD"/>
     </svg>`,
    `<span style="
         position:absolute; inset:0; border-radius:50%;
         border:1px solid rgba(200,16,46,0.55);
       "></span>`,
  );
}

/** Marker cho tọa độ xấp xỉ — vòng tròn rỗng, viền vàng đứt nét, dấu "?". */
function approximateHtml(): string {
  return shell(
    `<svg viewBox="0 0 30 30" width="30" height="30" aria-hidden="true">
       <circle cx="15" cy="15" r="7.5" fill="#111111" stroke="#FFD700"
               stroke-width="1.6" stroke-dasharray="3 2.5"/>
       <text x="15" y="18.6" text-anchor="middle" font-size="9.5"
             font-family="ui-monospace, monospace" fill="#FFD700">?</text>
     </svg>`,
    `<span style="
         position:absolute; inset:0; border-radius:50%;
         border:1px solid rgba(255,215,0,0.34);
       "></span>`,
  );
}

export const VERIFIED_ICON = L.divIcon({
  className: "red-address-marker",
  html: verifiedHtml(),
  iconSize: [SIZE, SIZE],
  iconAnchor: ANCHOR,
  popupAnchor: [0, -SIZE / 2],
});

export const APPROXIMATE_ICON = L.divIcon({
  className: "red-address-marker",
  html: approximateHtml(),
  iconSize: [SIZE, SIZE],
  iconAnchor: ANCHOR,
  popupAnchor: [0, -SIZE / 2],
});

/** Chọn icon theo độ chính xác của tọa độ. */
export function iconForAccuracy(accuracy: "approximate" | "verified") {
  return accuracy === "verified" ? VERIFIED_ICON : APPROXIMATE_ICON;
}

/**
 * Nội dung popup.
 *
 * Popup là nền tảng của nơi người xem kiểm tra lại trước khi tin — nên nó
 * phải nói rõ đây là vị trí chính xác hay ước lượng, và địa chỉ đã xác minh
 * hay chưa.
 *
 * Thẻ `<a>` có CẢ `href` lẫn `data-router-href`:
 *   • `data-router-href` → `MapCanvas` chặn click và chuyển trang phía client
 *     (bắt buộc: `<a>` thô không chứa được `<Link>` của Next, và để tải trang
 *     thì Next báo lỗi params ngoài Suspense).
 *   • `href` → dự phòng cho trình duyệt không chạy JS.
 */
export function popupHtml(site: {
  name: string;
  subtitle?: string;
  summary: string;
  periodLabel: string;
  approximate: boolean;
  hasAddress: boolean;
  address: string | null;
  href: string;
}): string {
  const warning = site.approximate
    ? `<p style="
         margin:10px 0 0;padding:8px 10px;
         border-left:2px solid #FFD700;background:rgba(255,215,0,0.07);
         font:500 10px/1.5 ui-monospace,monospace;
         letter-spacing:.08em;text-transform:uppercase;color:#FFD700;
       ">Cần kiểm chứng — tọa độ ước lượng</p>`
    : "";

  return `
    <div style="padding:14px 16px;min-width:240px;max-width:280px">
      <p style="
        margin:0 0 6px;font:500 9.5px/1.4 ui-monospace,monospace;
        letter-spacing:.18em;text-transform:uppercase;color:#C8102E;
      ">${escapeHtml(site.periodLabel)}</p>

      <p style="
        margin:0;font:700 16px/1.2 'Playfair Display',Georgia,serif;
        color:#F2EBDD;text-transform:uppercase;
      ">${escapeHtml(site.name)}</p>

      <p style="
        margin:8px 0 0;font:400 12.5px/1.6 system-ui,sans-serif;color:#A2977F;
      ">${escapeHtml(site.summary)}</p>

      <p style="
        margin:10px 0 0;font:400 10.5px/1.5 ui-monospace,monospace;color:#6B6353;
      ">${site.hasAddress ? escapeHtml(site.address ?? "") : "Địa chỉ: đang được cập nhật"}</p>

      ${warning}

      <a href="${site.href}"
         data-router-href="${site.href}"
         style="
           display:inline-flex;align-items:center;gap:6px;margin-top:12px;
           padding:8px 12px;border:1px solid #C8102E;background:#C8102E;
           font:500 9.5px/1 ui-monospace,monospace;letter-spacing:.14em;
           text-transform:uppercase;color:#F2EBDD;text-decoration:none;
         ">Xem hồ sơ di tích →</a>
    </div>
  `;
}

/** Chống chèn HTML từ dữ liệu — an toàn kể cả khi nội dung được sửa tay sau này. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}