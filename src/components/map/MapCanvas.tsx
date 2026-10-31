"use client";

import L from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Site } from "@/data/types";
import { periodLabel } from "@/lib/content";
import { isApproximate, mappableCoordinates, publicAddress } from "@/lib/content-status";
import { iconForAccuracy, popupHtml } from "./markers";

/**
 * Tâm bản đồ mặc định — vùng Sài Gòn.
 * 10.7769° N, 106.7009° E
 */
const DEFAULT_CENTER: L.LatLngExpression = [10.7769, 106.7009];
const DEFAULT_ZOOM = 13;

/**
 * Thông điệp khi tile bản đồ không tải được (mất mạng, OSM chặn, CSP...).
 *
 * Bản đồ vẫn hiển thị khung và marker; danh sách bên cạnh không bị ảnh
 * hưởng. Người xem vẫn tìm được địa điểm qua tìm kiếm và bộ lọc.
 */
function TileFailureNotice() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[500] grid place-items-center bg-ink-900/88 px-6 text-center backdrop-blur-[2px]">
      <div className="pointer-events-auto max-w-sm border border-line bg-ink-800 p-6">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="mx-auto size-7 text-gold-dim"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <path d="M2 8l10-5 10 5v8l-10 5-10-5z" />
          <path d="M2 8l10 5 10-5M12 13v10" opacity=".6" />
          <path d="M7 5.5l10 5" opacity=".6" />
        </svg>

        <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-gold">
          Bản đồ không tải được
        </p>
        <p className="mt-3 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
          Lớp bản đồ nền cần kết nối mạng. Bạn vẫn có thể xem và lọc toàn bộ
          địa điểm trong danh sách bên cạnh.
        </p>
      </div>
    </div>
  );
}

/** Bay tới một địa điểm khi người dùng chọn từ danh sách. */
function FlyTo({ site }: { site: Site | null }) {
  const map = useMap();

  useEffect(() => {
    const coords = site ? mappableCoordinates(site) : null;
    if (coords) {
      map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [site, map]);

  return null;
}

/** Đưa khung nhìn về toàn bộ các marker đang hiển thị. */
function FitToMarkers({ sites }: { sites: Site[] }) {
  const map = useMap();

  useEffect(() => {
    const points = sites
      .map((s) => mappableCoordinates(s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => L.latLng(c.lat, c.lng));

    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [56, 56], maxZoom: 16 });
  }, [sites, map]);

  return null;
}

export interface MapCanvasProps {
  /** Địa điểm đã qua bộ lọc. */
  sites: Site[];
  /** Địa điểm đang được chọn (từ danh sách hoặc từ marker). */
  selected: Site | null;
  /** Báo lên khi người xung bấm marker. */
  onSelect: (site: Site | null) => void;
}

/**
 * Phần bản đồ thật — render BÊNH TRONG node do `MapCanvas` tạo và sở hữu.
 *
 * Tách riêng để mọi thứ liên quan Leaflet nằm gọn trong một cây được huỷ
 * đúng một lần, cùng node hạt của nó.
 */
function LeafletMapLayer({ sites, selected, onSelect }: MapCanvasProps) {
  const [tileFailed, setTileFailed] = useState(false);
  const tileLayerRef = useRef<L.TileLayer>(null);

  /**
   * Phân loại trạng thái các tile đang hiển thị, đọc trực tiếp trên phần tử ảnh
   * (`complete` + `naturalWidth`) chứ không dựa vào class của Leaflet — class
   * `leaflet-tile-loaded` đo thật vẫn xuất hiện trên tile hỏng.
   *
   * Phân biệt "hỏng" với "chưa tới" là mấu chốt:
   *   • tile HỎNG   = đã tải xong nhưng không giải mã được → `naturalWidth === 0`
   *   • tile CHẬM   = trình duyệt vẫn đang chờ           → `!complete`
   * Trộn hai trạng thái này lại sẽ báo cảnh báo nhầm cho mạng chậm.
   */
  const inspectTiles = () => {
    const imgs = Array.prototype.slice.call(
      document.querySelectorAll<HTMLImageElement>(".leaflet-tile"),
    ) as HTMLImageElement[];

    return {
      decoded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
      failed: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      pending: imgs.filter((i) => !i.complete).length,
    };
  };

  /**
   * Chốt trạng thái tile.
   *
   * Quy tắc quyết định:
   *   • Còn ít nhất một tile dùng được → BẢN ĐỒ ỔN: gỡ cảnh báo và dừng thăm dò.
   *   • Đã định hình (không còn tile nào đang chờ) mà từ 3 tile trở lên hỏng →
   *     báo lỗi, nhưng VẪN thăm dò để gỡ cảnh báo nếu tile tới muộn hoặc mạng
   *     hồi phục.
   *   • Còn tile đang chờ → mạng chậm, CHƯA kết luận. Đây là chỗ mà logic cũ sai:
   *     dùng mốc thời gian cứng 8s nên mạng chậm bị báo nhầm rồi cảnh báo kẹt
   *     lại vĩnh viễn (đã tái hiện và sửa).
   *   • Chốt chặn: nếu ảnh treo mãi ở trạng thái chờ thì vẫn phải báo, để giao
   *     diện không bị kẹt im lặng.
   */
  useEffect(() => {
    const layer = tileLayerRef.current;

    // Đường tắt cho mỗi lần lô tile kết thúc (kể cả lúc người xem zoom).
    layer?.on("load", () => {
      const s = inspectTiles();
      if (s.decoded > 0) setTileFailed(false);
      else if (s.decoded === 0 && s.failed >= 3 && s.pending === 0) setTileFailed(true);
    });

    const HANG_LIMIT = 20000;
    const startedAt = Date.now();
    const id = setInterval(() => {
      const s = inspectTiles();

      if (s.decoded > 0) {
        setTileFailed(false);
        clearInterval(id);
        return;
      }

      if (s.decoded === 0 && s.failed >= 3 && s.pending === 0) {
        // Gọi lặp lại cùng giá trị không gây render thừa (React bỏ qua khi state
        // không đổi), nên cứ để thăm dò chờ tới khi có tile tốt.
        setTileFailed(true);
        return;
      }

      if (s.pending > 0 && Date.now() - startedAt > HANG_LIMIT) {
        setTileFailed(true);
      }
    }, 400);

    return () => {
      clearInterval(id);
      layer?.off("load");
    };
  }, []);

  /**
   * Chỉ giữ lại địa điểm có tọa độ được cấp phép hiển thị.
   * `mappableCoordinates` là nơi duy nhất quyết định điều này.
   */
  const mappable = useMemo(
    () =>
      sites.flatMap((site) => {
        const coords = mappableCoordinates(site);
        return coords ? [{ site, coords }] : [];
      }),
    [sites],
  );

  return (
    <>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="size-full"
      >
        <TileLayer
          ref={tileLayerRef}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
          maxZoom={19}
        />

        <FitToMarkers sites={mappable.map((m) => m.site)} />
        <FlyTo site={selected} />

        {mappable.map(({ site, coords }) => (
          <Marker
            key={site.id}
            position={[coords.lat, coords.lng]}
            icon={iconForAccuracy(coords.accuracy)}
            // `title` cho trình đọc màn hình và gợi ý khi rê chuột; nội dung
            // nói rõ mức độ chính xác để không ai tưởng đây là vị trí tuyệt đối.
            title={`${site.name} — ${
              isApproximate(site)
                ? "tọa độ xấp xỉ, cần kiểm chứng"
                : "tọa độ đã xác minh"
            }`}
            alt={site.name}
            eventHandlers={{
              click: () => onSelect(site),
              popupclose: () => onSelect(null),
            }}
          >
            <Popup>
              <div
                dangerouslySetInnerHTML={{
                  __html: popupHtml({
                    name: site.name,
                    summary: site.summary,
                    periodLabel: periodLabel(site.period),
                    approximate: isApproximate(site),
                    hasAddress: publicAddress(site) !== null,
                    address: publicAddress(site),
                    href: `/ho-so/${site.slug}`,
                  }),
                }}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {tileFailed ? <TileFailureNotice /> : null}

      {mappable.length === 0 && !tileFailed ? (
        <div className="pointer-events-none absolute inset-0 z-[500] grid place-items-center bg-ink/70 px-6 text-center">
          <p className="max-w-xs text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
            Không có địa điểm nào trong kết quả lọc có tọa độ đã kiểm chứng.
          </p>
        </div>
      ) : null}
    </>
  );
}

/**
 * Bản đồ Leaflet.
 *
 * ── Vì sao file này phải client và được nạp động ──────────────────────────
 *
 * Leaflet gọi DOM/window ngay khi module được nạp nên không thể render ở
 * server. `MapExplorer` nạp file này qua `next/dynamic({ ssr: false })`;
 * import thẳng `react-leaflet` ở bất kỳ đâu trong cây server sẽ làm hỏng
 * build. Đây là lý do `react-leaflet` không được import ở module server.
 *
 * ── Vì sao bản đồ phải nằm trong một node DOM do ta tự tạo ────────────────
 *
 * Đây là điều kiện để vòng đời Leaflet là sạch, và là thứ đã sửa được lỗi
 * "Map container is being reused by another instance" khi bấm nút quay lại
 * trình duyệt.
 *
 * Chuỗi lỗi đã đo được (bản build thật, điều hướng `/ban-do` → hồ sơ →
 * nút Back của trình duyệt):
 *
 *   1. `/ban-do` render, Leaflet tạo map trên node D, đóng dấu `D._leaflet_id = 3`.
 *   2. Sang trang hồ sơ. Next giữ vỏ DOM của trang cũ trong router cache.
 *      React huỷ cây, `Map.remove()` của react-leaflet chạy và XOÁ `D._leaflet_id`
 *      cùng toàn bộ pane — nhưng node D vẫn CÒN trong tài liệu: rỗng, không
 *      pane, không dấu. Đo được: `id=null, panes=0`.
 *   3. Bấm Back. Next phục hồi trang, mount lại bản đồ, và Leaflet nhận lại
 *      chính node D đó. `Util.stamp()` của Leaflet chỉ đóng dấu khi khoá CHƯA
 *      tồn tại — `D._leaflet_id` đã bị xoá nên nó gán mã MỚI: `D._leaflet_id = 98`.
 *      Bản đồ cũ vẫn giữ `_containerId = 3`.
 *   4. `Map.remove()` của bản đồ cũ chạy lại (React dọn cây đã huỷ) và so
 *      `this._containerId (đã xoá → undefined) !== this._container._leaflet_id (98)`
 *      → ném "Map container is being reused by another instance". Kèm theo
 *      `_leaflet_pos`/`appendChild` undefined, vì bản đồ mới đang khởi tạo trên
 *      node đã bị bản đồ cũ dọn mất pane.
 *
 * Cách sửa: không bao giờ đưa cho Leaflet một node mà React/Next có thể giữ
 * lại rồi đưa lại. Mỗi lần mount ta tự tạo một node trống, gắn vào host, rồi
 * render bản đồ vào đó bằng portal; khi unmount thì node ấy bị xoá hẳn khỏi DOM
 * chứ không được giữ. Nhờ vậy:
 *
 *   • Leaflet luôn nhận một node CHƯA TỪNG dùng — không bao giờ dính dấu cũ.
 *   • `remove()` gọi lần hai trở thành no-op an toàn: cả `_containerId` lẫn
 *     `container._leaflet_id` đều là `undefined`, phép so bằng nhau nên không
 *     ném lỗi (thay vì `undefined !== 98`).
 *   • Vỏ DOM mà Next giữ trong cache chỉ còn là `<div>` rỗng của ta, không
 *     đụng tới Leaflet nữa.
 *
 * Không `ErrorBoundary` nào che lỗi ở đây — lỗi được xử lý tận gốc.
 */
export default function MapCanvas(props: MapCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mountNode, setMountNode] = useState<HTMLDivElement | null>(null);

  // Node hạt cho Leaflet: tạo khi mount, xoá khi unmount.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const node = document.createElement("div");
    node.className = "size-full";
    host.appendChild(node);
    setMountNode(node);

    return () => {
      setMountNode(null);
      node.remove();
    };
  }, []);

  /**
   * Điều hướng bằng Next router cho link trong popup.
   *
   * Popup là HTML thô nạp qua `dangerouslySetInnerHTML`, không thể chứa thẻ
   * `<Link>` của Next. Để `<a href>` điều hướng bằng tải trang thì Next báo
   * lỗi "`params` accessed outside of <Suspense>". Chặn sự kiện click rồi chuyển
   * qua router để giữ điều hướng phía client.
   *
   * Listener đặt trên node hạt của chính bản đồ nên không cần lớp phủ nào
   * chặn thao tác chuột, không ảnh hưởng việc kéo/zoom.
   */
  const router = useRouter();

  useEffect(() => {
    const node = mountNode;
    if (!node) return;

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.(
        "a[data-router-href]",
      );
      if (!target) return;

      const href = target.getAttribute("data-router-href");
      if (!href) return;

      event.preventDefault();
      router.push(href);
    };

    node.addEventListener("click", onClick);
    return () => node.removeEventListener("click", onClick);
  }, [mountNode, router]);

  return (
    <div ref={hostRef} className="relative size-full">
      {mountNode ? createPortal(<LeafletMapLayer {...props} />, mountNode) : null}

      {/* Chú thích marker — luôn hiện, kể cả khi không có marker nào */}
      <div className="pointer-events-none absolute bottom-6 left-4 z-[600] flex flex-col gap-2">
        <LegendRow
          swatch={
            <svg viewBox="0 0 30 30" width="16" height="16" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" transform="rotate(45 15 15)"
                    fill="#C8102E" stroke="#F2EBDD" strokeWidth="1.4" />
            </svg>
          }
          label="Tọa độ đã xác minh"
        />
        <LegendRow
          swatch={
            <svg viewBox="0 0 30 30" width="16" height="16" aria-hidden="true">
              <circle cx="15" cy="15" r="7.5" fill="#111111" stroke="#FFD700"
                      strokeWidth="1.6" strokeDasharray="3 2.5" />
            </svg>
          }
          label="Tọa độ xấp xỉ — cần kiểm chứng"
        />
      </div>
    </div>
  );
}

function LegendRow({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 border border-line bg-ink-900/85 px-2.5 py-1.5 backdrop-blur-[2px]">
      {swatch}
      <span className="font-mono text-[0.56rem] uppercase leading-tight tracking-[0.12em] text-paper-mute">
        {label}
      </span>
    </span>
  );
}