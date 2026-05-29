<div align="center">

# 🎠 100‑Day Carousel Factory

### Design, animate, and export studio‑quality learning carousels — right in your browser.

**100 days × 5 posts/day × 8–10 slides** on AI, ML, RAG, programming, databases, and the modern AI‑engineering stack.
Pick a theme, swap the palette, preview the motion, and export **PNG · PDF · MP4 · GIF** — no server, no cost, no upload.

<br/>

### ▶︎ [**Live demo → carousel-100-day.vercel.app**](https://carousel-100-day.vercel.app/)

<br/>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq_(free)-F55036?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)

<br/>

`26 themes` · `132 palettes` · `16 video effects` · `4K export` · `AI drafting`

</div>

---

## ✨ Highlights

| | Feature | What it does |
|---|---|---|
| 🎨 | **26 themes × 132 palettes** | Retro Grid, Dark Cyber, Glass, Brutalist, Aurora, Holographic, Vaporwave, Memphis, Blueprint, Newsprint, Chalkboard… each with 5–6 hand‑tuned palettes. |
| 🎬 | **Cinematic video export** | 14 transitions + `none`/`auto`, Ken Burns motion, and a **live looping preview** that matches the exported file frame‑for‑frame. |
| ⚡ | **Fast, real MP4** | Hardware **H.264 via WebCodecs** (encodes faster than real‑time) with a MediaRecorder fallback — always a universally‑playable `.mp4`. |
| 🖼️ | **Image upload & editing** | Drop a photo onto any slide (framed overlay) or make a full hero **image slide** — auto‑downscaled, persisted in your browser. |
| 🧠 | **AI slide drafting** | Generate a full 8–10 slide post from a topic with **Claude‑grade output via Groq (free)** — single post, whole day, or all 500. |
| 🪄 | **AI image prompts** | Per‑slide / per‑post / per‑day prompts that adapt to the selected **theme + palette + topic** — copy into Midjourney/DALL·E/Ideogram. |
| 📦 | **Bulk export** | One day = 40 PNGs, 5 PDFs, or 5 MP4s — zipped, with the real slide counts. |
| 📱 | **Fully responsive** | Edge‑to‑edge on phones; the 1080×1350 preview scales to fit while exports stay full‑res. |
| 💾 | **Browser‑persistent edits** | Text, ordering, and images save to `localStorage` and show up across the app — no backend required. |

---

## 🖼️ Slide format

Every slide renders at **1080 × 1350 (4:5)** — the Instagram/LinkedIn carousel sweet spot. Exports never lose quality: the on‑screen preview scales for your device, but PNG/PDF/MP4 are always rendered at full resolution (up to **4K**).

---

## 🎬 The animation & video engine

The preview and the exported video are driven by **one shared painter**, so *what you preview is exactly what you download*.

<table>
<tr><td>

**Transitions / effects (16)**

`none` · `auto` · `fade` · `slide` · `slide-up` · `push` ·
`zoom` · `zoom-out` · `wipe` · `rotate` · `blur` · `glitch` ·
`pixelate` · `iris` · `flip` · `bars`

</td><td>

**Controls**

- **Speed** — Fast / Normal / Slow
- **Ken Burns** zoom — on/off
- **`auto`** cycles through every effect, one per slide
- Live looping **preview** of the selected effect

</td></tr>
</table>

> **MP4 path:** WebCodecs `VideoEncoder` (H.264) + `mp4-muxer` encode frame‑by‑frame as fast as the machine allows, with a `fastStart` MP4 that plays instantly everywhere. On browsers without WebCodecs it falls back to a real‑time `MediaRecorder` capture.

---

## 📤 Export formats

| Format | How | Quality |
|---|---|---|
| **PNG (zip)** | `html-to-image` → JSZip | **HD / 2K / 4K** selector |
| **PDF** | jsPDF (`addImage`, JPEG) | HD / 2K / 4K |
| **MP4 / WebM** | WebCodecs H.264 (→ MediaRecorder fallback) | 1080×1350 @ 30 fps, 9 Mbps |
| **GIF** | gifenc | lightweight loop |
| **Bulk (per day)** | 40 PNGs · 5 PDFs · 5 MP4s, zipped | — |

Fonts are embedded **once per session** and images are awaited before capture, so exports are fast *and* never blank.

---

## 🧠 AI features (powered by Groq — free)

**Slide drafting** — give a topic, angle, and category; get a complete, on‑brand 8–10 slide post (cover → content → CTA) as validated structured JSON.

- **`✨ Draft with AI`** on the post editor — drafts the current post.
- **`✨ Draft all 5 posts`** on a day page — batch‑drafts the day.
- **`scripts/draft-all-posts.mjs`** — fills in *all* unwritten posts (resumable).
- Rotates across multiple Groq keys and **fails over on rate limits**.

**Image prompts** — copyable, theme‑ and palette‑aware prompts for generating matching imagery, available per slide, per post (“All slides”), and per day (all 5 posts).

> Drafting is **optional** — without a key the buttons show a friendly message and the rest of the app works fully.

---

## 🚀 Getting started

```bash
# 1. install
npm install

# 2. (optional) enable AI drafting — create .env.local
echo "GROQ_API_KEYS=gsk_yourkey1,gsk_yourkey2" > .env.local

# 3. run
npm run dev          # http://localhost:3000
```

Then open a day → a post → tweak **theme / palette / effect** → **Download**. Hit **✎ Edit content** to rewrite slides, upload images, or **✨ Draft with AI**.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEYS` | for AI drafting only | Comma‑separated Groq keys (rotated + failover). Single `GROQ_API_KEY` also works. Get free keys at [console.groq.com](https://console.groq.com). |
| `GROQ_MODEL` | optional | Override the model (default `llama-3.3-70b-versatile`). |

---

## ☁️ Deploy to Vercel

1. Push to GitHub and import the repo in Vercel (framework auto‑detected as Next.js).
2. Add **`GROQ_API_KEYS`** under **Settings → Environment Variables** (for AI drafting in production).
3. Deploy.

> **Note:** `next.config.js` stubs `jspdf`'s optional deps (`html2canvas`, `dompurify`, `canvg`) in webpack — they're only needed for jsPDF's HTML/SVG rendering, which this app doesn't use. This keeps the build green even with Vercel's `npm install --omit=optional`.

---

## 🗂️ Project structure

```
app/
  page.tsx                     Home — 100-day grid, search, status filters
  day/[day]/                   All 5 posts for a day + bulk export + AI prompts
  post/[day]/[postIdx]/        Single post: theme/palette, exports, video preview, prompts
  author/[day]/[postIdx]/      Editor: slides, images, AI drafting
  api/
    save-content/              Persist authored slides → sample-content.ts (dev)
    draft-slides/              Groq slide drafting (single + batch)
    curriculum/                Lists all 500 posts (for the batch script)
components/
  CarouselPreview.tsx          Live preview + off-screen full-size capture nodes
  VideoPreview.tsx             Looping canvas preview of the selected effect
  BulkRenderer.tsx             Off-screen renderer for bulk export
  themes/                      26 theme components + dispatcher, ImageSlide, stickers
  diagrams/                    13 diagram types (flow, pipeline, network, tree…)
lib/
  types.ts                     Core data model (themes, palettes, slides)
  curriculum.ts                The 100-day plan
  content.ts / sample-content  Template + authored slide content
  palettes.ts                  26 theme metas + 132 palettes
  download.ts                  PNG/PDF/MP4/GIF export + the shared video painter
  draftSlides.ts               Groq drafting (key rotation, JSON output)
  imagePrompt.ts               Theme/palette-aware AI image prompts
  post-content.ts              localStorage slide overrides
  image-upload.ts / useResponsive.ts
scripts/
  draft-all-posts.mjs          Batch-draft every post via the API
```

---

## 🛠️ Tech stack

**Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS** · **Framer Motion** (preview motion) · **html‑to‑image** · **jsPDF** · **JSZip** · **gifenc** · **mp4‑muxer** + **WebCodecs** · **PrismJS** (code highlighting) · **Groq** (free LLM API).

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |
| `node scripts/draft-all-posts.mjs` | AI‑draft every unwritten post (dev server + `GROQ_API_KEYS` required; resumable, `--from/--to/--force`) |

---

<div align="center">

Built by **Saurav Danej**
[Instagram](https://instagram.com/saurav_dnj_24) · [GitHub](https://github.com/SauravDnj) · [LinkedIn](https://linkedin.com/in/sauravdnj)

<sub>500 posts · 26 themes · 132 palettes · made for shipping daily.</sub>

</div>
