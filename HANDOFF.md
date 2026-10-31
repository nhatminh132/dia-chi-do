# HANDOFF — Địa Chỉ Đỏ

Cập nhật: 2026-10-31. Người tiếp nhận trước: Antigravity / Codex.

## Trạng thái đã xác minh

- Repo: `dia-chi-do/`, git có, 1 commit `4dd5e0f` (Create Next App). Toàn bộ nội dung là thay đổi chưa commit.
- `npm run lint`: pass. `npm run build`: pass, 23 route (`/ho-so/*` gồm 10 slug).
- Dữ liệu: 10 địa điểm (tất cả `verified`), **10/10 địa điểm đã có ảnh** (4 ảnh
  mới ở mức `needs_review`), 14 mốc thời gian (không phải 12), 6 quốc gia,
  12 câu hỏi quiz (`src/lib/quiz.ts`), 7 cảnh cinematic (2 `ready`: scene-01,
  scene-02).
- Liên kết chéo: mọi `relatedSiteSlugs` / `relatedEventIds` đều trỏ tới slug/id tồn tại. Mọi `topics` khớp `TOPIC_LABELS`.
- 16 URL nguồn: 15 trả HTTP 200, 1 hỏng (xem dưới).

## Thay đổi trong phiên này

1. `src/data/sites.ts`
   - `nga-ba-giong`: thay placeholder bằng ảnh thật `public/images/sites/nga-ba-giong-01.jpg`.
   - `khu-di-tich-ba-son`: thay placeholder bằng 2 ảnh tư liệu (ảnh trên không 1968, công nhân 1968).
   - `dinh-doc-lap`: dùng ảnh mới `dinh-doc-lap-02.jpg` (Diego Delso, CC BY-SA 3.0) vì ảnh cũ ghi license CC BY 2.0 nhưng thiếu tên tác giả.
   - Bỏ `url` hỏng `vietnamtourism.vn/index.php/tourism/items/280` (HTTP 500), giữ tiêu đề + ghi chú.
2. `src/data/events.ts`
   - `event-1950`: sửa số liệu cho khớp nguồn ("hàng ngàn" thay "hơn 2.000"; bỏ con số người dự tang vì hai nguồn lệch 5 vạn / nửa triệu; "chưa tròn 19 tuổi").
   - `event-1950`: thay 2 nguồn bằng deep link đã kiểm tra HTTP 200 (hcmcpv.org.vn, baotanglichsu.vn).
   - `event-1911`: bỏ `url` vietnamtourism hỏng.
3. Ảnh mới: `public/images/sites/` thêm `nga-ba-giong-01.jpg`, `ba-son-nha-may-1968-01.jpg`, `dinh-doc-lap-02.jpg`; `public/images/archive/` thêm `ba-son-cong-nhan-1968-01.jpg`. Tất cả có credit + license, đã ghi width/height.
4. `src/app/gioi-thieu/page.tsx`: điền thông tin nhóm do nhóm cung cấp — nhóm "Địa Chỉ Đỏ", lớp 11A1, Trường THPT Lê Quý Đôn, không có GVHD, 7 thành viên (Lê Phước Nhật Minh là nhóm trưởng).
5. Part 03 trang chủ: gộp 03A/03B/03C thành một khối gấp/mở duy nhất (`src/components/home/Chapter03Explorer.tsx`) — ba hàng "Kho lưu trữ · Địa chỉ đỏ · Bản đồ ký ức", mỗi hàng mount nội dung khi mở nên `ArchivalReveal`/`MapReveal` không dựng ScrollTrigger lúc bị ẩn. Bỏ 4 thẻ danh mục kho trùng `/tu-lieu` và khung ảnh placeholder trong danh sách địa điểm. `ArchiveResistanceMapSection.tsx` còn header chương + một đoạn dẫn + khối gấp/mở. Không sửa `ArchivalReveal`, `MapReveal`, `ChapterFrame`, GSAP, Lenis hay bất kỳ tệp cinematic nào.
6. `CapsulePlayer` nâng cấp: nhớ âm lượng/tắt tiếng/chế độ lặp/bài đang chọn bằng localStorage; Media Session (tai nghe, màn hình khoá); thanh tiến trình luôn hiện; thanh tua và âm lượng tự style (`.range-capsule`); lặp một bài/lặp danh sách/phát ngẫu nhiên khi có từ 2 bài; báo lỗi tải nhạc + thử lại.
7. Chỉ dẫn cuộn ở hero (`Hero.tsx`, người dùng yêu cầu trực tiếp): thay vạch `|` bằng biểu tượng chuột, con lăn vàng nhấp nháy (`cue-wheel` trong `globals.css`, có nhánh giảm chuyển động). Chỉ đổi phần hiển thị — không đụng timeline GSAP, thứ tự text hay logic cuộn.
8. Favicon: xoá `src/app/favicon.ico` mặc định của Next.js, thêm `src/app/icon.svg` (nền đỏ cờ, sao vàng).
9. Sửa lỗi phát hiện sau audit (không đổi vùng cinematic):
   - `QuizTeaserSection`: số câu lấy từ `QUIZ_QUESTIONS.length` (12; trước ghi cứng "08").
   - `/dong-nam-a`, `CountryExplorer`, `SoutheastAsiaHero`, `ComparisonMatrix`: số hồ sơ lấy từ `COUNTRIES.length` (6; trước ghi "bốn"); lưới quốc gia đổi sang 3 cột để đủ 6 thẻ.
   - `ClosingSection`: khoảng năm dòng thời gian tính từ `getPublicEvents()` (1858–1975 thay vì 1911–1975); `rooms.ts` sửa caption cùng mốc; `SoutheastAsiaSection` đổi lưới 3 cột.
   - `ArchiveResistanceMapSection` và trang hồ sơ: chỉ dùng ảnh có `src` + `status` công khai, nên 4 hồ sơ chưa có ảnh không còn hiện khung placeholder.
   - `Chapter03Explorer`: gọi `ScrollTrigger.refresh()` sau khi đổi panel vì chiều cao khối thay đổi.
   - `ClosingSection`, `CountryExplorer`: link nội bộ chuyển sang `next/link`.
   - `Header`: thêm `aria-label` cho nút sơ đồ phòng trên desktop.
10. Vòng sửa a11y/UX sau audit:
   - Tăng tương phản: `paper-faint` → `#938a78` (≥4.88:1 trên ink-700), `flag-bright` → `#f04a5f` (≥4.64:1 trên ink-700); bỏ các lớp mờ `/60`, `/70`, `/80` trên chữ `paper-faint`; nhãn đỏ nhỏ chuyển sang `flag-bright` (giữ `flag-red` cho nền/nhãn lớn trên giấy).
   - `RoomMap`: khoá cuộn `html`/`body` khi mở, `overscroll-contain` cho vùng cuộn, trả focus về nút đã mở sau khi đóng, nút đóng 44px.
   - `Header`: nút sơ đồ phòng desktop đạt 44px (home) / `min-h-11` (trang trong).
   - `Chapter03Explorer`: accordion animate chiều cao bằng `grid-template-rows` + opacity 300ms, giữ panel đã mở trong DOM, `inert` + `aria-hidden` khi đóng, `ScrollTrigger.refresh()` sau khi animation kết thúc.
11. `ChapterRail` (thanh chỉ báo chương bên phải):
   - Desktop: hiện số chương thường trực, nhãn chương trượt ra khi hover/chương đang đọc; chương hiện tại có số vàng + vạch đỏ dày hơn; vùng bấm mỗi chương cao 44px; `aria-label` đầy đủ và `aria-current="location"`.
   - Mobile: thanh tiến trình chia 5 đoạn theo chương (đã đọc đỏ mờ, hiện tại vàng, còn lại xám) thay cho một vạch liền.
12. `CurtainTransition` (hiệu ứng đổi phòng):
   - Rèm gradient thay vì đen phẳng; khung ngắm bốn góc kiểu tư liệu; vạch đỏ + số phòng ghost + tên phòng vào theo nhịp so le.
   - Nhãn biên tập dưới hai mép ("Địa Chỉ Đỏ · Bảo tàng số" / "Phòng XX").
   - Nhịp đóng 0.68s, mở 0.85s; nhánh `prefers-reduced-motion` rút còn 0.15s, vẫn gọi `markCovered`/`completeTravel` đúng thứ tự.
13. Loading screen:
   - `src/components/ui/LoadingScreen.tsx` (mới): nền ink, quầng đỏ, số chương ghost, khung 4 góc, logo sao, tiêu đề "Đang mở cửa", vệt vàng quét (`.loader-sweep`, có nhánh giảm chuyển động).
   - `src/app/loading.tsx` dùng `LoadingScreen` thay skeleton.
   - Overlay chờ video ở `Hero.tsx` (chỉ phần hiển thị) đồng bộ ngôn ngữ: khung góc, ghost 01, tiêu đề, progressbar có `aria-valuenow`, nút dự phòng 44px.
14. Cinematic phase 1:
   - `ChapterSlate` (mới): title card số chương lớn, nhãn, metadata, vạch đỏ; `ChapterFrame` nhận `slateMeta` và thay `SectionLabel` khi bật.
   - Bật cho chương 03 (`10 hồ sơ công khai`) và 06 (`6 quốc gia`).
   - `EndCredits` (mới) sau `ClosingSection`: credit nhóm, nội dung, ảnh, công nghệ, cảm ơn; liên kết nguồn; "Về đầu phim".
   - `src/data/team.ts` là nguồn duy nhất cho thông tin nhóm; `gioi-thieu` dùng lại.
15. Cinematic phase 2 — motif chuyển cảnh:
   - `SceneSeam` (mới): mỗi chương mở bằng đường đỏ chạy ngang, nhịp sáng đỏ, đoạn vàng băng qua và nhãn `Ch NN`.
   - Gắn trong `ChapterFrame` (mọi chương) và `ClosingSection`; chỉ transform/opacity, không đụng sticky/pin.
   - Checkpoint trước khi sửa: `.tmp/checkpoints/phase1-cinematic/` (đã ignore trong git).

## Bản mobile — nền tĩnh thay video

Trước phiên này, điện thoại tải **y hệt desktop**: 6,63 MB video, chương 02 pin 8.404px,
và `poster: ""` ở cả 7 cảnh nên nhánh "ảnh tĩnh" của `SceneMedia` trả về `null` — màn nhỏ
không có nền nào. `mobileStrategy: "lower-resolution"` chưa từng được đọc.

Đã sửa:

1. `public/images/scenes/` (mới): `scene-01-flag.jpg`, `scene-02-city.jpg` — trích từ chính
   các clip `.scrub.mp4` bằng ffmpeg (`-ss 1` / `-ss 3`, rộng 1200px).
2. `src/data/scenes.ts`: điền `poster` cho cảnh 01 và 02; đổi `mobileStrategy` hai cảnh này
   sang `"poster-only"`.
3. `SceneMedia.tsx`: tách "có dựng thẻ video" (`wantsVideo`) khỏi "được tải" (`loadVideo`).
   Ảnh poster luôn nằm dưới; thẻ video vẫn được dựng nhưng **không có `src`** cho tới khi
   hydrate xong và màn hình không hẹp.
   - Không dựng thẻ muộn: đo được Chromium huỷ lượt tải rồi xin lại, mỗi tệp tải **hai lần**
     (6,63 MB thành 13,26 MB trên desktop). Chỉ chặn `src` thì mỗi tệp tải đúng một lần.
   - Bỏ thuộc tính `poster` trên thẻ video (ảnh đã có `<img>` riêng) để khỏi tải ảnh hai lần.
4. `SceneSequenceMedia.tsx`: nhận prop `poster`; màn hẹp và lần render đầu không pin, không
   gán `src` cho ba clip. `pause()` chỉ gọi khi clip đang chạy.
5. `Hero.tsx`: thêm `videoEnabled = hasVideo && !isMobile`; `videoReady` suy ra từ đó nên
   lớp chờ `fixed` không treo trên điện thoại khi không có thẻ video. Hai effect cố ý không
   đưa `videoEnabled` vào deps (có ghi chú trong file) để phần mở đầu không chạy hai lần.
6. `ChapterFrame.tsx`: sân khấu chuỗi cảnh 02 cao theo nội dung ở màn hẹp (`lg:h-[100dvh]`
   mới pin); truyền `poster` xuống `SceneSequenceMedia`.
7. `StorySection.tsx` + `globals.css`: hai nhịp biên tập (The City / The Journey) xếp dọc
   dưới `lg`, nhịp B hiện sẵn (`.scene-sequence-copy-journey` opacity 1 dưới 1023px).
8. Ba thanh fixed ở đáy: `AutoScrollControl` dời sang phải trên điện thoại
   (`justify-end pr-[4.25rem]`), không còn chồng lên capsule nhạc (đo được chồng 14px).
   *(Sau đó nút này bị bỏ hẳn khỏi mobile — xem mục “Mobile: nền tĩnh…” bên dưới.)*
   `ChatCapsule` chỉ hiện bong bóng mời khi có `(hover: hover) and (pointer: fine)` — trước
   đó trên cảm ứng không có `mousemove` nên đồng hồ idle bật bong bóng **vĩnh viễn**.
9. `Header.tsx`: trang con luôn có nền đặc, không còn trong suốt ở đầu trang — nhãn `Ch NN`
   của `SceneSeam` từng đè lên thanh đầu ở `/ban-do`, `/dong-thoi-gian`.

Đo lại (production build):

| | mobile 390px | desktop 1440px |
|---|---|---|
| video tải | 0 byte | 6,63 MB, mỗi tệp 1 lần |
| chiều cao trang chủ | 22.676px → 12.607px | không đổi |
| chương 02 | 9.069px → 1.080px | không đổi |

`npx tsc --noEmit`, `npx eslint src`, `npm run build` đều pass (23 route).

## Mobile: nền tĩnh tuyệt đối + bỏ auto-scroll

Hai yêu cầu của chủ dự án, làm cùng một lượt.

### 1. Điện thoại không còn dùng ảnh cắt từ clip của bản desktop

Bản trước lấy `poster` (khung hình trích từ chính `.scrub.mp4`) làm nền điện thoại. Đó là
một khung hình video đóng băng — lệch hẳn với tông nền tĩnh của phần còn lại, và người xem
màn nhỏ đang nhìn một video họ không bao giờ được xem. Nay nền của điện thoại là
**`SceneBackdrop`** — phông gradient dựng bằng CSS, không tệp, không request (7 cảnh đã có
sẵn phông riêng từ trước).

- `SceneMedia.tsx` + `SceneSequenceMedia.tsx`: thẻ `<img>` poster mang thêm `hidden md:block`.
  `loading="lazy"` + `display: none` ⇒ máy nhỏ không tải byte ảnh nào. Ẩn bằng CSS (không
  bằng `useIsMobile`) để HTML máy chủ và bản hydrate giống hệt nhau — không nháy ảnh.
- `Hero.tsx`: lá cờ SVG đứng giữa khung từng cắt ngang tiêu đề và nút bấm trên điện thoại
  (nó chỉ hiện khi cảnh 01 không có clip). Nay có clip ⇒ lá cờ **không hiện ở khung nhìn
  nào**; thay vào đó hero dựng `SceneBackdrop sceneId="scene-01-flag"` dưới `md` làm nền tĩnh.
- `ChapterFrame.tsx`: lớp nền gradient đổi `opacity-70` → `max-md:opacity-100`, vì trên
  điện thoại nó **là** nền chứ không còn là lớp phụ dưới video.

Đo lại (dev 390×844, Chromium cảm ứng): request tới `/video/` = **0**, `/images/scenes/` =
**0**; `<img>` poster có trong DOM nhưng rộng 0px. Desktop 1440×900 không đổi: video phát,
poster vẫn tải và vẫn hiện.

### 2. Auto-scroll bị bỏ khỏi bản mobile

Máy cầm tay không có con lăn để "nhường lái", và nút tự cuộn chỉ tranh chỗ ở đáy màn hình.

- `useMediaQuery.ts`: thêm `useIsHandheld()` = `(pointer: coarse), (max-width: 767px)` —
  một media query gộp cả điện thoại dọc (bề rộng) lẫn điện thoại nằm ngang / máy tính bảng
  (con trỏ thô).
- `AutoScrollControl.tsx`: tách thành `AutoScrollControl` (chỉ quyết định) + `AutoScrollCapsule`
  (phần giao diện cũ). Trên máy cầm tay nó trả `null` ⇒ không dựng nút, không chạy vòng rAF,
  không nghe sự kiện. Lớp ngoài còn mang `max-md:hidden pointer-coarse:hidden` để capsule
  trong HTML máy chủ không kịp lóe lên trước lúc hydrate.
- Dọn theo: bỏ `useSyncExternalStore`/`playerOpen`/`lifted` (khối nâng capsule lên trên
  player mở rộng) — nhánh đó không còn khung nhìn nào chạm tới. Bỏ `pointer-coarse:opacity-100`
  bên trong capsule.

Kiểm chứng: cửa sổ 390×844 cảm ứng ⇒ `[data-autoscroll-ui]` **không có trong DOM**; 1440×900
⇒ capsule vẫn ở đáy giữa, vẫn chạy 1×.

`npx tsc --noEmit`, `npx eslint src` sạch; `npm run build` pass (23 route).

> Ghi nhận có sẵn, KHÔNG sửa trong phiên này: tiêu đề `--text-h1` với `leading-[1.04]` bị
> dấu tiếng Việt của dòng trên chạm dòng dưới ở màn 390px (thấy cả trước khi đổi nền —
> ảnh `.tmp/walk-02.png`). Muốn sửa thì phải làm ở `Heading`/`--text-h1`, cần đo lại toàn bộ
> tiêu đề chương.

## Giới hạn tốc độ cuộn + thanh neo chương

1. **Trần tốc độ bánh xe nay có tác dụng thật.** `ScrollProvider` khai
   `smoothWheel: false`, mà Lenis có nhánh:
   `if (!(syncTouch && isTouch || smoothWheel && isWheel)) → isScrolling = "native"; return`.
   Nghĩa là mọi phép kẹp trong `virtualScroll` bị bỏ qua và bánh xe cuộn native.
   Đo được: trần 900 hay 260 px/s đều cho ~1.750–2.000 px/s.
   → bật `smoothWheel: true`.
2. Viết lại cổng kẹp: mỗi sự kiện bánh xe chỉ đi tối đa
   `maxDistanceFor(dt)` với `dt` = thời gian từ sự kiện trước (1..1000ms).
   Bản cũ mang theo 70% phần dư rồi trừ lại khỏi `deltaY`, nên khi phần được
   duyệt nhỏ hơn phần mang theo thì `deltaY` ra số âm — trang chạy ngược chiều
   con lăn.
3. `SCROLL_BUDGET.maxSpeed` = **640 px/s**. Đo trên trang chủ 1440×900:

   | trần | bánh xe thật |
   |---|---|
   | 900 px/s | 1.996 px/s |
   | 260 px/s | 232 px/s |
   | **640 px/s** | **573 px/s** |

   Auto-scroll 1× đo cùng lúc: **571 px/s**. Tức bánh xe không còn nhanh hơn
   auto 1×. Đổi `autoSpeed` / `lerp` / `smoothWheel` thì phải đo lại.
4. **Thanh neo chương** (`ChapterRail`): trước đây hiện thường trực sau khi rời
   cảnh 01. Nay chỉ trượt ra khi người xem **đổi chương** (IntersectionObserver
   đổi `activeId`), giữ 1.800ms rồi tự thụt vào. Cuộn trong lòng một chương
   KHÔNG làm thanh hiện.
   Thêm nút `<` ở giữa mép phải, sát màn hình (`size-9`, sát `right-0`), để mở
   thanh bằng tay; bấm lần nữa để đóng, chevron xoay 180° theo trạng thái.
   Hiệu ứng `translate-x` + `opacity` 500ms.
5. **Phạm vi trần tốc độ: chỉ Part 01–02.** Từ đầu `#chapter-03` trở đi bánh xe
   trả delta nguyên vẹn (cuộn tự do). Mốc đọc lại tối đa 4 lần/giây trong
   `capApplies()` (`ScrollProvider`), trang không có `#chapter-03` thì giữ hành
   vi cũ (kẹp toàn trang). Đo trên trang chủ 1440×900, bánh xe 120px mỗi 6ms:

   | vùng | px/s |
   |---|---|
   | Part 01 | 552 |
   | Part 02 (giữa) | 608 |
   | Part 03 | 1.536 |
   | Part 04 | 1.645 |
   | Part 05 | 1.782 |

6. **Auto-scroll chỉ tồn tại ở Part 01–02.** `useAutoScrollZone()` (trong
   `useAutoScroll.ts`) so `window.scrollY` với mốc `#chapter-03` mỗi khung hình
   và trả cờ `inZone`; `AutoScrollControl` ẩn hẳn capsule (`invisible`, không
   chỉ mờ) khi ra khỏi vùng, còn `start()` từ chối chạy nếu đã ở sau mốc. Đo:
   ở Part 04 capsule `visibility: hidden` + `opacity: 0`, bấm phát không nhích
   (0px); về Part 02 hiện lại, phát chạy 569 px/s, bấm lần hai thì dừng.

## Ảnh Part 03 + nút trên bản đồ

- Bốn địa điểm từng dùng `pendingImage` nay có ảnh thật (người dùng cung cấp):
  `co-so-bimat-thanh-uy-01.jpg` (1024×640), `ham-in-tai-lieu-hoa-van-01.jpg`
  (740×494), `ham-vu-khi-biet-dong-01.jpg` (1600×1066, hạ từ 1920),
  `bao-tang-biet-dong-01.jpg` (800×700) trong `public/images/sites/`.
- Cả bốn để `status: "needs_review"` + `credit: "Ảnh do chủ dự án cung cấp"`,
  **không** điền `license` vì chưa xác định được giấy phép. `isPublic` cho
  `needs_review` nên ảnh vẫn hiển thị công khai, nhưng không bị tính là đã
  xác minh. Hàm `pendingImage` đã xoá (không còn chỗ dùng).
- `GoogleMapsView`: bỏ nút "Mở Google Maps ↗" ở thanh dưới khung nhúng — khung
  của Google đã tự chèn nút "Mở trong Maps", hai nút cạnh nhau là trùng lặp.
  Thanh dưới giờ chỉ còn tên địa điểm.
- `Chapter03Explorer`: bỏ hẳn dòng chú thích dưới bản đồ nhúng
  ("Bản đồ thật · toạ độ từ hồ sơ đã kiểm chứng" và nhánh dự phòng "Bản đồ sẽ
  hiện khi có toạ độ"). Khung bản đồ giờ kết thúc ở viền, không còn dòng chữ.

## Chưa giải quyết (cần quyết định của người dùng)

- Giấy phép 4 ảnh mới ở trên: cần chủ dự án xác nhận nguồn + quyền sử dụng để
  nâng `needs_review` → `verified` và điền `license`. Ảnh hầm in còn mang
  watermark VNExpress — nếu là ảnh báo chí thì phải ghi credit theo báo.
- 2 ảnh mồ côi chưa rõ nguồn gốc, giữ file nhưng KHÔNG tham chiếu: `public/images/sites/bao-tang-chung-tich-chientranh-01.jpg`, `public/images/archive/latouche-treville-1911.jpg`.
- `src/data/scenes.ts`: 7 `poster` để rỗng, 5 cảnh chưa có video. Không đổi vì thuộc vùng cinematic.
- Nguồn còn dùng URL trang chủ (chưa phải deep link): hcmcpv, svhtt, qdnd, dangcongsan, chinhphu, sggp, hochiminhcity, bennharong, dinhdoclap, baotanglichsu, thanhdoan, tapchiqptd. Đều trả HTTP 200, ghi chú nêu rõ nguồn xác nhận điều gì.

## Vùng cinematic được bảo vệ — KHÔNG sửa

`ScrollProvider.tsx`, `Hero.tsx`, `StorySection.tsx`, `SceneSequenceMedia.tsx`, toàn bộ `src/lib/gsap/*`, logic Lenis/GSAP/ScrollTrigger/pinning/video scrubbing.

## Lệnh kiểm tra

```
npm run lint
npm run build
```
