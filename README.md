# ĐỊA CHỈ ĐỎ

> **Khát vọng độc lập cho thành phố**
> Không gian triển lãm lịch sử trực tuyến về hành trình đấu tranh giành độc
> lập của Sài Gòn trong dòng chảy phong trào giải phóng dân tộc Đông Nam Á.

Dự án học tập — xây dựng bảo tàng số về các địa điểm gắn với Đảng Cộng sản
Việt Nam và quá trình đấu tranh cách mạng tại Sài Gòn.

---

## Yêu cầu môi trường

| Thành phần | Phiên bản |
|---|---|
| Node.js | **≥ 20.9.0** (khuyến nghị 22.x) |
| npm | ≥ 10 |

## Cài đặt và chạy

```bash
# 1) cài phụ thuộc
npm install

# 2) chạy môi trường phát triển
npm run dev
```

Mở <http://localhost:3000>.

```bash
# kiểm tra chất lượng trước khi commit
npm run lint          # ESLint (React Compiler rules)
npx tsc --noEmit      # kiểm tra kiểu
npm run build         # build production (Turbopack)
npm run start         # chạy bản build production
```

## Công nghệ

| Thư viện | Phiên bản | Vai trò |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.4.2 | App Router, SSR/SSG, metadata, routing file-based |
| React | 19.3.0 | UI runtime |
| TypeScript | ~5.9.3 | *(đã pin — xem "Ghi chú kỹ thuật")* |
| Tailwind CSS | 4.x | CSS-first: token khai trong `@theme`, không có `tailwind.config.js` |
| [GSAP](https://gsap.com) + ScrollTrigger | 3.15.0 | Chuyển động theo cuộn, pin, scrub, parallax |
| [Lenis](https://lenis.darkroom.engineering) | 1.3.27 | Cuộn mượt, đồng bộ với GSAP ticker |
| [Leaflet](https://leafletjs.com) + react-leaflet | 1.9.4 / 5.0.0 | Bản đồ OpenStreetMap *(đưa vào ở phase sau)* |
| [openai](https://github.com/openai/openai-node) | 7.x | Client cho `/api/chat` — dùng `baseURL` nên hợp mọi router OpenAI-compatible |

> **Không** dùng Locomotive Scroll. **Không** dùng thêm thư viện animation
> song song — GSAP là engine duy nhất, CSS lo phần hover/focus đơn giản.

## Cấu trúc thư mục

```
src/
├── app/                     # Route (Next.js App Router)
│   ├── layout.tsx           # Font, metadata, Header/Footer, ScrollProvider
│   ├── globals.css          # @theme tokens + base layer + override Leaflet
│   ├── page.tsx             # Trang chủ (tạm ở Phase 1)
│   ├── loading.tsx          # Trạng thái chờ
│   ├── error.tsx            # Bắt lỗi cấp route
│   └── not-found.tsx        # 404
│
├── data/                    # ★ NỘI DUNG — sửa ở đây, không sửa UI
│   └── types.ts             # Kiểu dữ liệu + quy ước kiểm chứng nội dung
│
├── lib/
│   ├── navigation.ts        # Menu, tagline, hằng số thương hiệu
│   ├── content-status.ts    # ★ CỔNG KIỂM DUYỆT nội dung
│   ├── utils.ts             # cn, normalizeText, matchesKeywords
│   └── gsap/
│       ├── gsap.ts          # Đăng ký plugin (import duy nhất)
│       ├── ScrollProvider.tsx  # ★ Lenis + GSAP ticker
│       └── motionPresets.ts    # 5 chuyển động dùng chung
│
├── hooks/
│   └── useMediaQuery.ts     # useMediaQuery, usePrefersReducedMotion, useIsMobile, useHydrated
│
└── components/
    ├── ui/                  # Container, SectionLabel, Heading, Button, Card,
    │                        # Badge, StatusBadge, Prose, EmptyState, Skeleton
    ├── media/               # ★ ArchiveImage, CinematicPlate
    └── layout/              # Header, MobileNav, Footer, FilmGrain
```

## Thêm nội dung mới

Sửa hoặc tạo file trong `src/data/`, không đụng giao diện.

### Thêm một địa điểm

```ts
// src/data/sites.ts
import type { Site } from "./types";

export const sites: Site[] = [
  {
    id: "site-001",
    slug: "ben-nha-rong",        // URL: /ho-so/ben-nha-rong
    name: "Bến Nhà Rồng",
    nameEn: "Nha Rong Wharf",
    address: undefined,           // ← để trống cho tới khi xác minh
    coordinates: undefined,      // ← để trống cho tới khi xác minh
    period: "truoc-1930",
    category: "di-tich-lich-su",
    topics: ["hanh-trinh-tim-duong-cuu-nuoc"],
    summary: "…",                 // 20–45 từ
    historicalContext: "…",
    historicalSignificance: "…",
    images: [],
    sources: [],
    relatedSiteSlugs: [],
    relatedEventIds: [],
    status: "needs_review",       // ← bắt buộc khi chưa kiểm chứng
  },
];
```

### Thêm ảnh thật

Đặt file vào `public/images/…`, rồi điền metadata trong `ArchiveItem`:

```ts
{
  id: "img-001",
  title: "Bến Nhà Rồng, Sài Gòn, 1911",
  description: "…",
  mediaType: "image",
  src: "/images/sites/ben-nha-rong-1911.jpg",  // ← thêm dòng này là đủ
  alt: "Bến Nhà Rồng về đêm, nền trời tối",
  caption: "Bến Nhà Rồng năm 1911",
  credit: "Tên cơ quan lưu trữ",               // ← bắt buộc ghi nguồn
  license: "Public domain",                     // ← bắt buộc ghi giấy phép
  width: 1600,
  height: 1067,
  status: "verified",
}
```

`ArchiveImage` tự hiển thị ảnh khi có `src`, tự chuyển sang placeholder
khi thiếu. **Không cần sửa bất kỳ component nào.**

---

## 🎬 HISTORY WEB V2 — lớp cinematic

Trang chủ được nâng cấp thành **bảy cảnh cinematic** với ba lớp tách bạch:
khí quyển (video) · tư liệu (ảnh lịch sử) · giao diện (HTML).

### Bảy cảnh

| # | Anchor | Cảnh | Clip | Thời lượng đích |
|---|---|---|---|---:|
| 01 | `chapter-01` | Cờ đỏ | `scene-01-flag` | 6s |
| 02 | `chapter-02` | Thành phố và ký ức | `scene-02-city` | 8s |
| 03 | `chapter-03` | Mở kho lưu trữ | `scene-03-archive` | 6s |
| 04 | `chapter-04` | Dấu vết kháng chiến | `scene-04-resistance` | 8s |
| 05 | `chapter-05` | Bản đồ ký ức | `scene-05-map-transition` | 4s |
| 06 | `chapter-06` | Đông Nam Á | `scene-06-southeast-asia` | 6s |
| 07 | `chapter-07` | Ký ức vẫn còn đây | `scene-07-finale` | 6s |

**Tổng 44 giây** — đây là TỔNG của bảy clip nằm rải rác ở bảy cảnh, KHÔNG
phải một đoạn mở đầu 44 giây. Không có màn hình chờ nào giữ người xem lại.

### Manifest video

`src/data/scenes.ts` — bảy mục, đúng ID/thời lượng ở trên.

**Hiện tại cả bảy `src` đều rỗng** (`""`) và `status: "missing"`.

Lý do: khi rà soát kho của dự án, **không có tệp video nào** — `public/` chỉ
có `audio/ambient-hall.wav` và hai thư mục ảnh rỗng. Clip lá cờ mà chủ dự án
từng tạo cũng không còn trong kho. Vì vậy **không đoán tên tệp và không dùng
video mẫu bừa**.

Cách thêm tệp: xem `public/video/README.md`. Sửa `src` + `poster` + `status`
trong `src/data/scenes.ts` là xong — **không cần sửa component nào**.

Bảo đảm cứng của lớp media:

- `src` rỗng ⇒ **không render thẻ `<video>` nào** ⇒ không có request nào
  cho URL rỗng ⇒ không có 404, không có biểu tượn video hỏng.
- Clip chỉ được tạo khi cảnh sắp vào khung hình (`IntersectionObserver`).
- Video ra khỏi khung hình thì bị `pause()`.
- `muted` + `playsInline` luôn luôn; `preload="none"`.
- Lỗi phát video ⇒ tự quay về lớp nền tĩnh, không có ô đen trống.

### Ba khoảnh khắc chính (WOW)

1. **Vải quét sang, lộ tiêu đề** (cảnh 01) — lá cờ trải xuống, tiêu đề dâng
   lên, rồi cả dải cờ trôi lên ra khỏi khung khi cuộn sang cảnh 02.
2. **Mở tấm lưu trữ** (cảnh 03) — ảnh lưu trữ trồi lên, chú thích hiện, nhãn
   nguồn hiện và bấm được, tấm trước lùi sang để lộ tấm sau.
3. **Bản đồ hình thức → bản đồ thật** (cảnh 05) — vệt mực đỏ loang, bên dưới
   lộ ra bản đồ Google thật với toạ độ thật từ `getPublicSites()`.

### Quy tắc ba lớp

| Lớp | Chứa | Quy tắc |
|---|---|---|
| A — khí quyển | video, gradient, SVG | KHÔNG chứa chữ, tài liệu hay trích dẫn. Không phải ảnh tư liệu. |
| B — tư liệu | ảnh lịch sử + chú thích + nguồn | Nguồn phải là liên kết thật. Không ảnh AI thay ảnh lịch sử. |
| C — giao diện | tiêu đề, mốc, bản đồ, điều hướng | Luôn đọc được kể cả khi mọi video hỏng. |

### Giảm chuyển động

`src/lib/gsap/sceneMotion.ts` — cổng `useSceneMotion()` = cờ của dự án **VÀ**
cờ `prefers-reduced-motion` của hệ điều hành.

Khi bật giảm chuyển động: không video tự phát, không ghim, không scrub, không
vệt mực loang; mọi nội dung hiện sẵn; dòng thời gian xếp dọc.

> Cờ toàn site của dự án (`src/lib/gsap/motionPreference.tsx`) **giữ nguyên**
> — dự án cố ý bật chuyển động bất kể cài đặt hệ thống. Cổng
> `useSceneMotion()` chỉ áp cho lớp cinematic mới, không đảo ngược quyết
> định cũ.

### File quan trọng của lớp V2

```
src/
├── data/
│   └── scenes.ts              # ★ MANIFEST video bảy cảnh
├── lib/
│   ├── scenes.ts               # Bộ chọn cảnh (getScene, hasSceneVideo, …)
│   └── gsap/
│       ├── sceneMotion.ts      # ★ Cổng giảm chuyển động của lớp cinematic
│       └── sceneTransitions.ts # ★ Đặc tả chuyển cảnh từng cảnh
└── components/
    └── cinematic/              # ★ Lớp cinematic
        ├── SceneMedia.tsx      # Lớp A — video (lazy, pause, fallback)
        ├── SceneBackdrop.tsx   # Lớp A — nền tĩnh dựng bằng CSS
        ├── VietnamFlag.tsx     # Quốc kỳ vẽ bằng SVG (hình học chuẩn)
        ├── ArchivalLayer.tsx   # Lớp B — ảnh + chú thích + nguồn
        ├── ArchivalReveal.tsx  # WOW #2 — vò tấm lưu trữ
        ├── MapReveal.tsx       # WOW #3 — vệt mực → bản đồ thật
        ├── ChapterRail.tsx     # Chỉ báo chương
        └── ...
```

---

## ⛔ Quy tắc kiểm chứng nội dung

Đây là ràng buộc nghiêm ngặt nhất của dự án. Không phá vỡ.

### 1. Không bịa

Không tự chế sự kiện, ngày tháng, nhân vật, địa chỉ hay nguồn tham khảo.
Nếu chưa kiểm chứt được thì **đánh dấu**, đừng khẳng định.

### 2. Trạng thái nội dung

| Trạng thái | Hiển thị công khai |
|---|---|
| `verified` | Đầy đủ, kèm nguồn |
| `needs_review` | Có badge "CẦN KIỂM CHỨNG"; **ẩn địa chỉ và tọa độ** |
| `draft` | Không hiển thị |
| `unpublished` | Không hiển thị; `ArchiveImage` render placeholder |

### 3. Tọa độ

- `coordinates` để trống → **không** vẽ marker trên bản đồ.
- `accuracy: "approximate"` → vẫn vẽ marker nhưng **bắt buộc** kèm nhãn
  "CẦN KIỂM CHỨNG". Tuyệt đối không dùng làm vị trí chính xác.

Toàn bộ quy tắc này nằm trong `lib/content-status.ts`. UI gọi hàm ở đó,
không tự kiểm tra `status` rải rác.

### 4. Ảnh

- **Không dùng ảnh AI** hoặc ảnh minh họa để giả làm ảnh tư liệu lịch sử.
- Không có `src` → hiện "TƯ LIỆU ĐANG ĐƯỢC BỔ SUNG".
- Mỗi tư liệu phải có `credit` (nguồn) và `license` (giấy phép).
- `CinematicPlate` chỉ là **lớp trang trí**, không bao giờ nằm trong
  `ArchiveItem.src`. Nó luôn mang `data-illustrative="true"` trong DOM.

---

## Ghi chú kỹ thuật

### Vì sao không dùng `<ReactLenis>`?

`ReactLenis` giữ instance trong React state và phát ra qua `useImperativeHandle`.
Ref chỉ cập nhật ở lần render **kế tiếp**, nên trong effect của provider
`ref.current.lenis` vẫn là `undefined` → driver `raf()` không bao giờ được
gắn. Lenis chặn wheel rồi chỉ đẩy cuộn trong `raf()`, nên **con lăn chuột
sẽ chết hoàn toàn**.

`ScrollProvider` vì thế tự khởi tạo `new Lenis(...)` trong effect: nhận
instance ngay lập tức, vòng đời create/destroy rõ ràng, đúng nghĩa cả với
React StrictMode remount hai lần.

### Quy tắc đồng bộ cuộn

`autoRaf: false` là **bắt buộc**. Bật `autoRaf: true` đồng thời với
`gsap.ticker.add(...)` tạo hai `requestAnimationFrame` cùng đẩy Lenis →
nhấp nháy và scrub rớt nhịp.

Khi người dùng bật **giảm chuyển động**, Lenis **không được khởi tạo** —
trình duyệt cuộn native, tự nhiên, không bị chiếm quyền.

### Tốc độ tự động cuộn

Nút auto-scroll (`AutoScrollControl`, nằm ở đáy giữa trang) cuộn theo **nhịp
đều**, phục vụ việc đọc — không phải tiện ích cuộn tự do.

- Tốc độ được khai **duy nhất** tại `src/lib/scroll/scrollBudget.ts` →
  `PX_PER_SECOND.autoScroll`, hiện là **600 px/s** (gấp đôi mức cũ 300 px/s;
  ~2/3 viewport mỗi giây, tương đương khoảng 1.5 giây cho một màn hình cao 900px).
- Trần cuộn chung là `PX_PER_SECOND.default` (**900 px/s**) — đây là mức khác,
  đừng lẫn với tốc độ auto-scroll.
- `useAutoScroll.ts` chỉ **đọc** tốc độ qua `autoScrollStep(dt)`, không tự khai
  số. Muốn đổi tốc độ thì sửa `scrollBudget.ts`.
- Cuộn tay (wheel / chạm / phím) vẫn **luôn dừng** auto-scroll.

### TypeScript bị pin ở `~5.9.3`

npm đang phát hành `typescript@7.0.2` (bản native compiler mới). `eslint-config-next`
chưa bảo chắc hỗ trợ, nên dự án giữ 5.9 cho ổn định. Nâng lên khi hệ sinh thái
sẵn sàng.

### `npm audit` báo 5 lỗi mức `high`

Tất cả nằm ở **devDependencies** (`braces` → `fast-glob` → `@next/eslint-plugin-next`).
Chỉ là DoS qua glob lồng sâu trong công cụ lint, không liên quan mã chạy thật.
`npm audit --omit=dev` = **0 lỗi**.

Đừng chạy `npm audit fix --force` — nó sẽ hạ `eslint-config-next` xuống 14.x và
phá vỡ Next.js 16.

---

## Hướng dẫn viên AI (khung chat góc phải)

Giao diện: `src/components/chat/ChatCapsule.tsx`. Máy chủ: `src/app/api/chat/route.ts`.

Route gọi **SDK chính thức `openai`**, trỏ tới baseURL khai trong `.env` — nên chạy được với
mọi **router** nói giao thức OpenAI (OpenAI, OpenRouter, Groq, DeepSeek, Gemini, gateway nội
bộ…). Không tự dựng URL, không tự viết lại logic thử lại/timeout: `baseURL` → SDK tự nối
`/chat/completions`, tự cắt `/` thừa, tự đổi lỗi của router thành `APIError` có `status`.

```ts
const client = new OpenAI({ apiKey, baseURL, timeout: 25_000, maxRetries: 1 });
const completion = await client.chat.completions.create({ model, messages, max_tokens: 200, temperature: 0.4 });
```

Muốn đổi router: chỉ sửa `OPENAI_BASE_URL` + `OPENAI_MODEL`. Không sửa code.

### Ba biến môi trường

| Biến | Bắt buộc | Mặc định | Ý nghĩa |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ | — | Khoá của nhà cung cấp. Chỉ đọc ở server |
| `OPENAI_BASE_URL` | — | `https://api.openai.com/v1` | Gốc API, **không** có `/` cuối |
| `OPENAI_MODEL` | — | `gpt-4o-mini` | Tên model theo nhà cung cấp |
| `CHAT_ALLOWED_ORIGINS` | — | — | Origin phụ được phép gọi chat, cách nhau bằng dấu phẩy (mặc định: chính host đang phục vụ) |

Thiếu khoá ⇒ cả site vẫn chạy, chỉ khung chat trả "Chưa cấu hình OPENAI_API_KEY.".
Mẫu: `.env.example`.

### Chạy ở máy

```bash
cp .env.example .env.local      # rồi điền OPENAI_API_KEY
npm run dev
```

### Chạy trên Vercel

1. **Project → Settings → Environment Variables** → thêm `OPENAI_API_KEY`
   (Environment: *Production*, và *Preview* nếu muốn thử ở preview).
2. Thêm `OPENAI_BASE_URL` + `OPENAI_MODEL` nếu không dùng OpenAI.
3. **Deployments → ⋯ → Redeploy.** Biến môi trường chỉ có hiệu lực ở lần deploy **mới**;
   sửa biến rồi mở lại URL cũ vẫn ra lỗi cũ.
4. Mở site → nút góc dưới phải → hỏi thử một câu.

### Kiểm tra nhanh bằng curl

```bash
curl -sS https://<domain>/api/chat \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"Ngày Giải phóng là khi nào?"}]}'
# → {"reply":"..."}          thành công
# → {"error":"..."}          xem mã lỗi bên dưới
```

### Lỗi thường gặp

| Hiện tượng | Nguyên nhân |
|---|---|
| `401` / `invalid_api_key` | Khoá sai, đã thu hồi, hoặc dán kèm khoảng trắng/xuống dòng |
| `404` `model not found` | `OPENAI_MODEL` không đúng tên của **nhà cung cấp đó** (mỗi nơi đặt một kiểu) |
| `404` trên một số provider | `OPENAI_BASE_URL` thừa `/` hoặc thiếu `/v1` — route đã tự cắt `/` thừa, nhưng `/v1` phải có nếu provider yêu cầu |
| `400` `max_tokens` / `temperature` không hỗ trợ | Model dạng "reasoning" (o-series, gpt-5…) không nhận hai tham số này — chọn model thường |
| `429` / `insufficient_quota` | Hết hạn mức hoặc hết credit của khoá |
| Chat trả đúng câu "Chưa cấu hình OPENAI_API_KEY." | Chưa thêm biến, hoặc chưa redeploy sau khi thêm |

### Khoá API chỉ dùng được cho website này

`/api/chat` **không** phải endpoint mở. Mỗi request phải qua ba cổng, theo thứ tự:

1. **Cổng origin** — `Origin` phải trùng host đang phục vụ request (hoặc một origin
   trong `CHAT_ALLOWED_ORIGINS`), và `Sec-Fetch-Site` (nếu trình duyệt gửi) phải là
   `same-origin`. Website khác nhúng gọi vào sẽ bị `403`; gọi bằng script/curl cũng
   `403` vì không có `Origin`.
2. **Cổng tần suất** — 20 câu / 5 phút / IP, quá thì `429`.
3. **Cổng kích thước** — tối đa 10 lượt, 1.000 ký tự mỗi lượt, 4.000 ký tự tổng.

```bash
# Từ website thật: lưu lượng bình thường, không thấy gì.
# Gọi thẳng bằng curl (không Origin) → 403:
curl -sS -o /dev/null -w '%{http_code}\n' https://<domain>/api/chat \
  -H 'content-type: application/json' -d '{"messages":[]}'   # 403
```

**Giới hạn trung thực:** đây là kiểm tra theo header, không phải chữ ký mật mã. Người cố
tình vẫn tự đặt được `Origin` giả. Ba lớp trên chặn đúng thứ cần chặn (web khác nhúng,
script quét bừa), nhưng **bảo đảm cuối cùng vẫn là hạn mức chi tiêu đặt ở phía nhà cung
cấp** — hãy đặt spend limit cho khoá này, và tạo khoá riêng chỉ cho dự án này.

Muốn siết hơn nữa thì phải có đăng nhập người dùng (mỗi người một phiên) — ngoài phạm vi
một bảo tàng mở.

### Giới hạn cần biết

- `max_tokens: 200`; hội thoại gửi đi tối đa 10 lượt / 4.000 ký tự — hoá đơn không phình
  theo độ dài cuộc trò chuyện.
- Bộ đếm tần suất nằm trong bộ nhớ từng instance serverless (không Redis): nhiều instance
  thì hạn mức thực tế có thể cao hơn 20/phút một chút.
- Lịch sử chat lưu ở `localStorage` của người xem (`chatHistory`), không lưu ở server.
- System prompt nằm trong `route.ts`; sửa ở đó để đổi giọng điệu/phạm vi trả lời.

---

## Tiến độ

- [x] **Phase 1** — Nền tảng: scaffold, design system, layout, animation foundation
- [x] **Phase 2 + 3** — Trang chủ cinematic đầy đủ (7 chương) + route thật
- [ ] Phase 4 — Scroll reveal nâng cao, parallax ba lớp chi tiết hơn
- [ ] Phase 5 — Trang dòng thời gian chi tiết (pinned scene thứ hai)
- [ ] Phase 6 — Bản đồ Leaflet, kho tư liệu, thử thách lịch sử
- [ ] Phase 7 — Tối ưu hiệu năng, rà soát cuối

### Trang đã hoàn thiện

| Route | Trạng thái |
|---|---|
| `/` | ✅ Đầy đủ 7 chương, hero sequence GSAP, timeline ghim |
| `/gioi-thieu` | ✅ Nội dung thật theo Idea.txt §9 |
| `/ho-so/[slug]` | ✅ 4 hồ sơ, dữ liệu thật, 10 khối theo §4 |
| `/ban-do` `/dong-thoi-gian` `/dong-nam-a` `/tu-lieu` `/thu-thach` | 🚧 Khung trang, ghi rõ đang hoàn thiện |

Các route chưa hoàn thiện vẫn **tồn tại và trả về 200** — không có liên kết
chết. Đây là yêu cầu của Idea.txt §1: "các nút phải hoạt động thật".

Nội dung lịch sử cần được kiểm chứng và cập nhật từ những nguồn phù hợp
trước khi xuất bản.