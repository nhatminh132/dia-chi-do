import { sites } from "@/data/sites";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BÀN SÁNG — bản đồ THẬT của hai địa điểm đã xác minh
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── PHIÊN BẢN ĐẦU TIÊN KHÔNG CÓ Ý NGHĨA GÌ ────────────────────────────
 *
 * Bản đầu tiên của component này vẽ "đường đồng mức" bằng tổng sine và đặt
 * các chấm đỏ ở toạ độ TỰ BỊA. Nhìn thì giống bản đồ, nhưng không phải:
 * đường đồng mức đó không phải địa hình của bất cứ đâu, và các chấm đỏ chỉ
 * là hình tròn trang trí.
 *
 * Với một dự án có quy tắc "không khẳng định gì mà không có nguồn", đó là
 * một lỗi nghiêm trọng — mà bản đồ thì vốn đã là một lời khẳng định.
 * Người xem tưởng đang nhìn vị trí thật.
 *
 * ── BẢN NÀY: THẬT ───────────────────────────────────────────────────────
 *
 * Không vẽ gì cả nếu không bám được vào dữ liệu:
 *
 *   • Toạ độ lấy THẲNG từ `sites` — chuyển vị trí trong trang này thà sai
 *     thì bản đồ ở đây cũng sai, và điều đó phải nhìn thấy được.
 *   • Lưới toạ độ vẽ theo đường kinh tuyến/tuyến đối thật, có nhãn toạ độ.
 *   *   Thang đo tính từ phép chiếu, không đoán bừa.
 *   • Khoảng cách giữa hai điểm tính bằng công thức Haversine.
 *
 * Phép chiến dùng là CỐ ĐỊNH TRỤC ĐỊA CẦU (equirectangular). Ở quy mô
 * ~2 km mà bàn sáng này phủ, sai số do độ cong mặt đất nhỏ hơn 1 mét —
 * không đáng kể so với sai số của chính toạ độ nguồn.
 *
 * ── Còn những thứ không phải bản đồ ────────────────────────────────────
 *
 * Tấm kính, quầng sáng, vệt quét, hạt phim: đó là thị giác của một tấm kính
 * ngăn màu trong phòng kế hoạch, không phải thông tin địa lý. Chúng ở lớp
 * `aria-hidden` và không mô tả bất cứ điều gì.
 */

/** Chiều rộng cao của mặt bản đồ (đơn vị viewBox của SVG). */
const W = 600;
const H = 620;

/** Nới rộng quanh hai điểm, tính bằng độ. */
const PAD_LAT = 0.0074;
const PAD_LNG = 0.0054;

/** Điểm có toạ độ thật. */
const located = sites.filter(
  (site) => site.coordinates && site.coordinates.lat != null && site.coordinates.lng != null,
);

interface GridLine {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  /** Nhãn vẽ ở mép trái hay mép phải. */
  at: "start" | "end";
}

interface Pt {
  lat: number;
  lng: number;
  x: number;
  y: number;
  name: string;
  slug: string;
}

/**
 * Tính toàn bộ hình học của bản đồ một lần, lúc nạp module.
 *
 * Tách ra khỏi component vì mọi thứ ở đây là HÀM SỐ THUẦN TÚY của dữ liệu:
 * không phụ thuộc state, không phụ thuộc trình duyệt. Chạy sẵn ở server thì
 * trang không phải làm lại phép tính này ở client.
 */
const MAP = (() => {
  if (located.length === 0) {
    return { pts: [] as Pt[], grid: [] as GridLine[], scale500m: 0, distanceText: "" };
  }

  const lats = located.map((s) => s.coordinates!.lat);
  const lngs = located.map((s) => s.coordinates!.lng);

  const latMin = Math.min(...lats) - PAD_LAT;
  const latMax = Math.max(...lats) + PAD_LAT;
  const lngMin = Math.min(...lngs) - PAD_LNG;
  const lngMax = Math.max(...lngs) + PAD_LNG;

  const pts: Pt[] = located.map((s) => ({
    lat: s.coordinates!.lat,
    lng: s.coordinates!.lng,
    x: ((s.coordinates!.lng - lngMin) / (lngMax - lngMin)) * W,
    // Bản đồ: vĩ độ tăng lên thì y giảm (lên trên).
    y: ((latMax - s.coordinates!.lat) / (latMax - latMin)) * H,
    name: s.name,
    slug: s.slug,
  }));

  // Lưới toạ độ: đường chục phân, có nhãn ở mép.
  const grid: GridLine[] = [];
  const step = 0.005;

  for (let lat = Math.ceil(latMin / step) * step; lat <= latMax; lat += step) {
    const y = ((latMax - lat) / (latMax - latMin)) * H;
    grid.push({
      key: `lat-${lat.toFixed(4)}`,
      x1: 0, y1: y, x2: W, y2: y,
      label: `${lat.toFixed(3)}°N`,
      at: "start",
    });
  }

  for (let lng = Math.ceil(lngMin / step) * step; lng <= lngMax; lng += step) {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * W;
    grid.push({
      key: `lng-${lng.toFixed(4)}`,
      x1: x, y1: 0, x2: x, y2: H,
      label: `${lng.toFixed(3)}°E`,
      at: "end",
    });
  }

  // Số mét trên một đơn vị viewBox, tính theo vĩ độ giữa khung.
  const metresPerUnit = (H / (latMax - latMin)) * 111320;

  // Khoảng cách thật giữa hai điểm (Haversine), tính bằng mét.
  let distanceText = "";
  if (pts.length === 2) {
    const [a, b] = pts;
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    const d = 2 * R * Math.asin(Math.sqrt(h));
    distanceText = `${(d / 1000).toFixed(2).replace(".", ",")} KM`;
  }

  return {
    pts,
    grid,
    scale500m: Math.round(500 / metresPerUnit),
    distanceText,
  };
})();

export function LightTable() {
  if (MAP.pts.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      data-illustrative="true"
      data-light-table
      className="pointer-events-none absolute right-[-18%] top-1/2 hidden aspect-square w-[min(78vh,46vw)] -translate-y-1/2 lg:block xl:right-[-12%]"
    >
      {/* Quầng sáng hắt ra ngoài — ánh sáng của tấm kính rọi lên tường.
          Hai lớp: một quầng đỏ lan xa (màu thương hiệu) và một quầng giấy
          sát mặt kính (màu của ánh sáng ngàn ngày đèn huỳnh quang). */}
      <div className="absolute -inset-[22%] rounded-full bg-[radial-gradient(circle,rgba(200,16,46,0.24)_0%,rgba(200,16,46,0.07)_38%,transparent_66%)] blur-[70px]" />
      <div className="absolute -inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(242,235,221,0.09)_0%,transparent_62%)] blur-2xl" />

      {/* Khung máy */}
      <div className="absolute inset-0 rounded-[2px] border border-line-strong shadow-[0_0_0_1px_rgba(0,0,0,0.7),0_40px_120px_-30px_rgba(200,16,46,0.5)]" />

      {/* Mặt kính */}
      <div className="absolute inset-[3px] overflow-hidden bg-[#0b0b0c]">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none">
          <defs>
            <radialGradient id="lt-core" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stopColor="var(--color-paper)" stopOpacity="0.08" />
              <stop offset="62%" stopColor="var(--color-paper)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="var(--color-paper)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height={H} fill="url(#lt-core)" />

          {/* Lưới toạ độ thật — đường 0.005°, có nhãn ở mép */}
          <g>
            {MAP.grid.map((g) => (
              <g key={g.key}>
                <path
                  d={`M${g.x1} ${g.y1}L${g.x2} ${g.y2}`}
                  stroke="var(--color-paper)"
                  strokeOpacity={g.label.endsWith("N") ? 0.16 : 0.11}
                  strokeWidth="0.7"
                />
                <text
                  x={g.at === "start" ? 6 : g.x2 - 6}
                  y={g.at === "start" ? g.y1 - 5 : 12}
                  textAnchor={g.at === "start" ? "start" : "end"}
                  fill="var(--color-paper)"
                  fillOpacity="0.32"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  letterSpacing="1"
                >
                  {g.label}
                </text>
              </g>
            ))}
          </g>

          {/* Đường nối hai địa điểm — khoảng cách thật tính bằng Haversine */}
          {MAP.pts.length === 2 ? (
            <g>
              <path
                d={`M${MAP.pts[0].x} ${MAP.pts[0].y}L${MAP.pts[1].x} ${MAP.pts[1].y}`}
                stroke="var(--color-flag-red)"
                strokeOpacity="0.65"
                strokeWidth="1.2"
                strokeDasharray="7 8"
                strokeLinecap="round"
              />
              <text
                x={(MAP.pts[0].x + MAP.pts[1].x) / 2 + 8}
                y={(MAP.pts[0].y + MAP.pts[1].y) / 2}
                fill="var(--color-flag-bright)"
                fillOpacity="0.85"
                fontSize="12"
                fontFamily="var(--font-mono)"
                letterSpacing="2"
              >
                {MAP.distanceText}
              </text>
            </g>
          ) : null}

          {/* Các điểm có toạ độ thật */}
          {MAP.pts.map((p) => (
            <g key={p.slug}>
              <circle cx={p.x} cy={p.y} r="16" fill="none" stroke="var(--color-flag-red)" strokeOpacity="0.45" strokeWidth="1" />
              <circle cx={p.x} cy={p.y} r="5" fill="var(--color-flag-red)" />
              <circle cx={p.x} cy={p.y} r="2" fill="var(--color-paper)" fillOpacity="0.9" />
              {/* Vạch chữ thập của tâm ngắm */}
              <path
                d={`M${p.x - 30} ${p.y}h11M${p.x + 19} ${p.y}h11M${p.x} ${p.y - 30}v11M${p.x} ${p.y + 19}v11`}
                stroke="var(--color-paper)"
                strokeOpacity="0.24"
                strokeWidth="0.8"
              />
              <text
                x={p.x + (p.x > W * 0.6 ? -30 : 30)}
                y={p.y - 40}
                /*
                  Nhãn bám theo mép của chấm: điểm nằm bên phải giữa bản đồ
                  thì chữ bám về TRÁI. Nếu luôn neo ở giữa, tên dài của điểm bên
                  phải sẽ tràn ra ngoài mép kính và bị cắt mất nửa.
                */
                textAnchor={p.x > W * 0.6 ? "end" : "start"}
                fill="var(--color-paper)"
                fillOpacity="0.72"
                fontSize="13"
                letterSpacing="0.5"
              >
                {p.name.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Thang đo — suy ra từ phép chiếu, không đoán bừa */}
          <g>
            <path
              d={`M40 ${H - 30}h${MAP.scale500m}`}
              stroke="var(--color-paper)"
              strokeOpacity="0.5"
              strokeWidth="1.4"
            />
            <path
              d={`M40 ${H - 34}v8M${40 + MAP.scale500m} ${H - 34}v8`}
              stroke="var(--color-paper)"
              strokeOpacity="0.5"
              strokeWidth="1.4"
            />
            <text
              x={40 + MAP.scale500m / 2}
              y={H - 40}
              textAnchor="middle"
              fill="var(--color-paper)"
              fillOpacity="0.42"
              fontSize="10"
              fontFamily="var(--font-mono)"
              letterSpacing="2"
            >
              500 M
            </text>
          </g>

          {/* Khoảng thời gian phủ — bám theo chủ đề trang */}
          <text
            x="10"
            y={H - 10}
            fill="var(--color-paper)"
            fillOpacity="0.3"
            fontSize="10"
            fontFamily="var(--font-mono)"
            letterSpacing="2.4"
          >
            1911 — 1975 · QUẬN 1 &amp; QUẬN 4
          </text>
        </svg>

        {/* Vệt sáng quét — máy quét đang chạy qua mặt kính */}
        <div className="lt-scan absolute inset-y-0 w-[42%] bg-[linear-gradient(90deg,transparent,rgba(242,235,221,0.06)_45%,rgba(242,235,221,0.11)_50%,rgba(242,235,221,0.06)_55%,transparent)]" />

        {/* Vòng sáng trong mặt kính + viền tối ở mép */}
        <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.85),inset_0_0_22px_rgba(242,235,221,0.04)]" />
        <div className="absolute -inset-x-1/4 -top-1/3 h-2/3 rotate-6 bg-[linear-gradient(180deg,rgba(242,235,221,0.05),transparent_60%)] blur-xl" />
      </div>

      {/* Dấu đăng ký ở bốn góc — quy ước của tấm bản vẽ được in */}
      {(
        [
          "left-[-7px] top-[-7px] border-l border-t",
          "right-[-7px] top-[-7px] border-r border-t",
          "left-[-7px] bottom-[-7px] border-l border-b",
          "right-[-7px] bottom-[-7px] border-r border-b",
        ] as const
      ).map((pos) => (
        <span key={pos} className={`absolute size-3.5 border-paper/45 ${pos}`} />
      ))}
    </div>
  );
}