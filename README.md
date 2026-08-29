# Kix Image Tools · foxai 🦊

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Powered by foxai](https://img.shields.io/badge/Powered%20by-foxai-F97316)](https://foxai.com)
[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![100% Private](https://img.shields.io/badge/Privacy-100%25%20Client--side-22c55e)](#privacy)

A modern, browser-based image compression and format-conversion tool by **foxai**.
Compress and convert images to AVIF, WebP, JPEG, JPEG XL, and PNG — all in your
browser, with no uploads and no third-party trackers.

> Live demo: [image.kixtools.com](https://image.kixtools.com) ·
> 中文版：[image.kixtools.com/zh-CN/](https://image.kixtools.com/zh-CN/)

![Kix Image Tools screenshot](https://image.kixtools.com/meta.jpg)

---

## ✨ Features

### 🖼️ Multi-format support

| Format | Default quality | Notes |
|---|---|---|
| **AVIF** (AV1 Image File Format) | 50% | Best compression/size ratio |
| **WebP** | 75% | Great all-rounder, broad support |
| **JPEG** (MozJPEG) | 75% | Maximum compatibility |
| **JPEG XL** | 75% | Next-gen, royalty-free |
| **PNG** (OxiPNG) | lossless | Optimisation without re-encoding |

### 🚀 Capabilities

- 🛡️ **100% client-side** — images never leave your device
- 📦 **Batch processing** with smart queue, no per-file click
- 🎛️ **Per-format quality slider** (1%–100%)
- 🔄 **Format conversion** between any supported formats
- 👀 **Real-time preview** with size-reduction stats
- 📊 **Compression-ratio badge** per image (e.g. `-72% smaller`)
- 🖱️ **Drag-and-drop** upload, paste from clipboard
- 🌐 **Bilingual** UI — auto-switches by URL (`/zh-CN/`)

---

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 5 (MPA, two HTML entries) |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Codecs | [jSquash](https://github.com/jamsinclair/jSquash) (WASM MozJPEG / OxiPNG / libavif / libjxl / libwebp) |
| Hosting | Cloudflare Pages (edge) |

---

## 🚀 Getting started

### Prerequisites

- Node.js **18+** (Node 20 recommended)
- npm 7+

### Install & run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

### Production build

```bash
npm run build        # outputs ./dist
npm run preview      # serve the build locally on :4173
```

---

## ☁️ Deploy to Cloudflare Pages

The repo ships with everything CF Pages needs:

- `wrangler.toml` — project name, build dir, prod/preview envs
- `public/_headers` — security + cache-control policy
- `public/_redirects` — `/zh-CN` → `/zh-CN/` canonicalisation, vanity paths
- `npm run deploy:cf` — one-command build & deploy

### Option A — Dashboard (recommended)

1. Push this repo to GitHub
2. Open [Cloudflare Dashboard → Pages → Create application → Direct Upload or Connect to Git](https://dash.cloudflare.com/?to=/:account/pages)
3. Pick this repo, then set:

   | Setting | Value |
   |---|---|
   | Framework preset | **Vite** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `20` |

4. After first deploy, attach the custom domain `image.kixtools.com`
   under **Custom Domains**.

### Option B — CLI

```bash
npm install
npx wrangler login                # one-time
npm run deploy:cf                 # production
npm run deploy:cf:preview         # preview / PR-style
npm run cf:tail                   # stream live logs
```

### Environment variables

| Name | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Build mode |
| `PUBLIC_SITE_ORIGIN` | `https://image.kixtools.com` | Canonical origin |

---

## 🦊 Branding

The **foxai** brand mark is a geometric fox face on a slate rounded-square with
an amber-to-orange gradient.

| File | Format | Use |
|---|---|---|
| `public/icon.svg` | SVG vector | Favicon, inline use |
| `public/foxai-mark.svg` | SVG vector | Mark only (no wordmark) |
| `public/foxai-logo.svg` | SVG vector | Horizontal lockup (mark + wordmark) |
| `public/favicon-16x16.png` | PNG | Browser tab (HiDPI) |
| `public/favicon-32x32.png` | PNG | Browser tab |
| `public/icon-128x128.png` | PNG | PWA icon |
| `public/icon-512x512.png` | PNG | PWA icon (maskable) |
| `public/apple-touch-icon.png` | PNG | iOS home screen |
| `src/components/FoxaiLogo.tsx` | React | `<FoxaiLogo size={42} />` |

### Regenerate PNG icons from the SVG source

```bash
npm run icons      # uses scripts/generate_png.py (stdlib only)
```

---

## 🛡️ Privacy

- **No images are uploaded** — all compression runs locally in WebAssembly
- **No third-party scripts** — no analytics, no ads, no trackers
- **No cookies** set by this site
- `<meta name="referrer" content="strict-origin-when-cross-origin">` and
  strict Permissions-Policy headers (see `public/_headers`)

---

## 📁 Project layout

```
.
├── index.html              # English entry (/)
├── zh-CN/index.html        # Chinese entry (/zh-CN/)
├── public/                 # Static assets copied as-is
│   ├── _headers            # Cloudflare Pages security/cache headers
│   ├── _redirects          # Language canonicalisation + vanity paths
│   ├── icon.svg            # foxai favicon (SVG)
│   ├── icon-*.png          # foxai favicon (PNG fallbacks)
│   ├── foxai-*.svg         # foxai brand assets
│   ├── site.webmanifest    # PWA manifest
│   └── sitemap.xml         # SEO sitemap
├── src/
│   ├── App.tsx             # Main UI shell
│   ├── components/         # DropZone, ImageList, FoxaiLogo, …
│   ├── hooks/              # useImageQueue
│   ├── i18n/               # en / zh-CN translation tables
│   └── utils/              # WASM wrappers, format defaults
├── scripts/generate_png.py # PNG-icon generator (Python stdlib only)
├── vite.config.ts          # MPA config (two HTML entries)
└── wrangler.toml           # Cloudflare Pages config
```

---

## 💡 Usage

1. **Drop or pick images** — drag onto the upload area, or click to select.
   Multiple files at once.
2. **Pick an output format** — AVIF · WebP · JPEG · JPEG XL · PNG.
3. **Adjust quality** — slider from 1%–100% (PNG stays lossless).
4. **Wait** — the queue processes each image sequentially, no UI freeze.
5. **Download** — single-file button or **Download All** for the batch.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss substantial
changes, then send a Pull Request.

```bash
git checkout -b feature/my-change
# …
git commit -m "feat: describe your change"
git push origin feature/my-change
```

Lint and build locally before submitting:

```bash
npm run lint
npm run build
```

---

## 📝 License

[MIT](./LICENSE) © foxai · KixTools.

---

## 🙏 Acknowledgments

- [jSquash](https://github.com/jamsinclair/jSquash) — WASM image codecs
- [MozJPEG](https://github.com/mozilla/mozjpeg) — JPEG encoder
- [libavif](https://github.com/AOMediaCodec/libavif) — AVIF support
- [libjxl](https://github.com/libjxl/libjxl) — JPEG XL support
- [Oxipng](https://github.com/shssoichiro/oxipng) — PNG optimizer
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [Lucide](https://lucide.dev) — open-source icon set
- [Cloudflare Pages](https://pages.cloudflare.com) — global edge hosting
- Originally forked from [addyosmani/squish](https://github.com/addyosmani/squish)