'use client';

// Client-side rendering of slides → PNG / PDF / MP4.
// We capture the off-screen full-size DOM nodes (1080x1350) using html-to-image,
// then bundle into ZIP, PDF (jsPDF), or MP4 (MediaRecorder painting frames to a canvas).

import { toPng, toJpeg, getFontEmbedCSS } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SLIDE_W = 1080;
const SLIDE_H = 1350;

// ── Performance: embed web fonts ONCE per session ───────────────────────────
// html-to-image re-fetches + base64-encodes every @font-face on every single
// capture. For an 8-slide post that's 8× the font work. We compute the embedded
// font CSS once and feed it to every capture, and we disable cacheBust so fonts
// and data-URL images aren't re-fetched per frame. This is the single biggest
// speed-up for PNG/PDF/MP4 export.
let _fontCss: string | undefined;
let _fontCssTried = false;
async function getFontCss(node: HTMLElement): Promise<string | undefined> {
  if (_fontCssTried) return _fontCss;
  _fontCssTried = true;
  try { _fontCss = await getFontEmbedCSS(node); }
  catch { _fontCss = undefined; }
  return _fontCss;
}

let _fontsReady: Promise<void> | null = null;
function fontsReadyOnce(): Promise<void> {
  if (!_fontsReady) {
    const fr = (document as any)?.fonts?.ready;
    _fontsReady = fr ? Promise.resolve(fr).then(() => {}) : Promise.resolve();
  }
  return _fontsReady;
}

/** Wait until web fonts are ready and every <img> inside the node has decoded.
 *  Without this, html-to-image can snapshot a slide before its uploaded photo
 *  (a data URL) has painted, producing blank or half-rendered exports. */
async function settleNode(node: HTMLElement): Promise<void> {
  try { await fontsReadyOnce(); } catch { /* ignore */ }
  const imgs = Array.from(node.querySelectorAll('img'));
  await Promise.all(imgs.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise<void>(resolve => {
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }));
  // Two RAFs let layout + paint flush before we snapshot.
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
}

export async function downloadSinglePng(node: HTMLDivElement, fileName: string, scale = 2) {
  await settleNode(node);
  const fontEmbedCSS = await getFontCss(node);
  const url = await toPng(node, {
    width: SLIDE_W, height: SLIDE_H, pixelRatio: scale, cacheBust: false, backgroundColor: '#000', fontEmbedCSS,
  });
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.png`;
  a.click();
}

export async function captureSlides(nodes: HTMLDivElement[], scale = 2): Promise<string[]> {
  const dataUrls: string[] = [];
  const fontEmbedCSS = nodes[0] ? await getFontCss(nodes[0]) : undefined;
  for (const node of nodes) {
    await settleNode(node);
    const url = await toPng(node, {
      width: SLIDE_W, height: SLIDE_H, pixelRatio: scale, cacheBust: false, backgroundColor: '#000', fontEmbedCSS,
    });
    dataUrls.push(url);
  }
  return dataUrls;
}

/** Capture the first few slides at low resolution as <img>s for the live video preview.
 *  `shouldContinue` lets the caller abort between slides when the request is stale. */
export async function capturePreviewImages(
  nodes: HTMLDivElement[],
  maxSlides = 3,
  shouldContinue?: () => boolean,
): Promise<HTMLImageElement[]> {
  const subset = nodes.slice(0, maxSlides);
  const imgs: HTMLImageElement[] = [];
  for (const node of subset) {
    if (shouldContinue && !shouldContinue()) break;
    // Lightweight settle — preview doesn't need the full export-grade wait.
    const inner = Array.from(node.querySelectorAll('img'));
    await Promise.all(inner.map(im => (im.complete ? Promise.resolve() : new Promise<void>(r => {
      im.addEventListener('load', () => r(), { once: true });
      im.addEventListener('error', () => r(), { once: true });
    }))));
    const fontEmbedCSS = await getFontCss(node);
    const url = await toPng(node, { width: SLIDE_W, height: SLIDE_H, pixelRatio: 0.4, cacheBust: false, backgroundColor: '#000', fontEmbedCSS });
    if (shouldContinue && !shouldContinue()) break;
    imgs.push(await loadImage(url));
  }
  return imgs;
}

export interface PostGroup {
  postIdx: number;
  nodes: HTMLDivElement[];
}

/** Bulk per-day PNG zip: one folder per post, all 8 slides inside.
 *  Uses 1.5x pixel ratio (vs 2x for single-post) to keep render time + memory sane.
 */
export async function downloadDayPngZip(groups: PostGroup[], dayName: string) {
  const zip = new JSZip();
  for (const g of groups) {
    const folder = zip.folder(`post-${g.postIdx}`)!;
    const dataUrls = await capturePngAtScale(g.nodes, 1.5);
    for (let i = 0; i < dataUrls.length; i++) {
      const b64 = dataUrls[i].split(',')[1];
      folder.file(`slide-${String(i + 1).padStart(2, '0')}.png`, b64, { base64: true });
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${dayName}.zip`);
}

async function capturePngAtScale(nodes: HTMLDivElement[], scale: number): Promise<string[]> {
  const dataUrls: string[] = [];
  const fontEmbedCSS = nodes[0] ? await getFontCss(nodes[0]) : undefined;
  for (const node of nodes) {
    await settleNode(node);
    const url = await toPng(node, { width: SLIDE_W, height: SLIDE_H, pixelRatio: scale, cacheBust: false, backgroundColor: '#000', fontEmbedCSS });
    dataUrls.push(url);
  }
  return dataUrls;
}

/** Bulk per-day PDFs in a zip: one PDF per post. */
export async function downloadDayPdfZip(groups: PostGroup[], dayName: string) {
  const zip = new JSZip();
  for (const g of groups) {
    const dataUrls = await captureSlidesAtScale(g.nodes, 1.5);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [SLIDE_W, SLIDE_H], compress: true });
    for (let i = 0; i < dataUrls.length; i++) {
      if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'portrait');
      pdf.addImage(dataUrls[i], 'JPEG', 0, 0, SLIDE_W, SLIDE_H, undefined, 'FAST');
    }
    const buf = pdf.output('arraybuffer');
    zip.file(`post-${g.postIdx}.pdf`, buf);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${dayName}-pdfs.zip`);
}

export async function downloadPngZip(nodes: HTMLDivElement[], baseName: string, scale = 2) {
  const dataUrls = await captureSlides(nodes, scale);
  const zip = new JSZip();
  for (let i = 0; i < dataUrls.length; i++) {
    const base64 = dataUrls[i].split(',')[1];
    zip.file(`${baseName}-slide-${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${baseName}.zip`);
}

export async function downloadPdf(nodes: HTMLDivElement[], baseName: string, scale = 2) {
  const dataUrls = await captureSlidesAtScale(nodes, scale);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [SLIDE_W, SLIDE_H], compress: true });
  for (let i = 0; i < dataUrls.length; i++) {
    if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'portrait');
    pdf.addImage(dataUrls[i], 'JPEG', 0, 0, SLIDE_W, SLIDE_H, undefined, 'FAST');
  }
  pdf.save(`${baseName}.pdf`);
}

async function captureSlidesAtScale(nodes: HTMLDivElement[], scale: number): Promise<string[]> {
  const dataUrls: string[] = [];
  const fontEmbedCSS = nodes[0] ? await getFontCss(nodes[0]) : undefined;
  for (const node of nodes) {
    await settleNode(node);
    const url = await toJpeg(node, { width: SLIDE_W, height: SLIDE_H, pixelRatio: scale, cacheBust: false, quality: 0.9, backgroundColor: '#fff', fontEmbedCSS });
    dataUrls.push(url);
  }
  return dataUrls;
}

export type VideoTransition =
  | 'none'
  | 'auto'
  | 'fade'
  | 'slide'
  | 'slide-up'
  | 'push'
  | 'zoom'
  | 'zoom-out'
  | 'wipe'
  | 'rotate'
  | 'blur'
  | 'glitch'
  | 'pixelate'
  | 'iris'
  | 'flip'
  | 'bars';

/** Named transitions in the order 'auto' cycles through them. */
export const VIDEO_TRANSITIONS: Exclude<VideoTransition, 'auto'>[] =
  ['fade', 'slide', 'slide-up', 'push', 'zoom', 'zoom-out', 'wipe', 'rotate', 'blur', 'glitch', 'pixelate', 'iris', 'flip', 'bars'];

const TRANS_INDEX: Record<Exclude<VideoTransition, 'auto'>, number> =
  VIDEO_TRANSITIONS.reduce((acc, name, i) => { acc[name] = i; return acc; }, {} as Record<Exclude<VideoTransition, 'auto'>, number>);
const TRANS_COUNT = VIDEO_TRANSITIONS.length;

export interface VideoRenderOpts {
  perSlideMs: number;
  fadeMs: number;
  accent: string;
  transition: VideoTransition;
  kenBurns: boolean;
}

export interface VideoPainter {
  /** Total loop duration in ms. */
  totalMs: number;
  /** Paint a single frame for the given elapsed time (ms) onto the canvas. */
  drawAt: (elapsed: number) => void;
}

/**
 * Build the frame painter shared by the MP4 export AND the live UI preview, so the
 * preview is exactly what gets downloaded. The target canvas must be SLIDE_W × SLIDE_H.
 */
export function makeVideoPainter(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], opts: VideoRenderOpts): VideoPainter {
  const { perSlideMs, fadeMs, accent, transition, kenBurns: kenBurnsOn } = opts;
  const totalMs = Math.max(1, imgs.length) * perSlideMs;

  // easeInOutCubic — smooth transitions
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  // Scratch canvas for the pixelate effect.
  const scratch = document.createElement('canvas');
  const sctx = scratch.getContext('2d');

  // Draw an image to cover the canvas with a Ken Burns transform + alpha.
  function paint(img: HTMLImageElement, scale: number, ox: number, oy: number, alpha: number, clipW?: number) {
    ctx.save();
    if (clipW !== undefined) { ctx.beginPath(); ctx.rect(0, 0, clipW, SLIDE_H); ctx.clip(); }
    ctx.globalAlpha = clamp01(alpha);
    const w = SLIDE_W * scale, h = SLIDE_H * scale;
    const x = (SLIDE_W - w) / 2 + ox, y = (SLIDE_H - h) / 2 + oy;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  }

  // Per-slide Ken Burns: gentle zoom-in with a drift whose direction varies by index.
  function kenBurns(idx: number, p: number) {
    if (!kenBurnsOn) return { scale: 1, ox: 0, oy: 0 };
    const scale = 1.03 + 0.06 * p;
    const dir = idx % 4;
    const amp = 26;
    const ox = (dir === 0 ? -1 : dir === 2 ? 1 : 0) * amp * (p - 0.5) * 2;
    const oy = (dir === 1 ? -1 : dir === 3 ? 1 : 0) * amp * (p - 0.5) * 2;
    return { scale, ox, oy };
  }

  function paintRotated(img: HTMLImageElement, scale: number, alpha: number, angle: number) {
    ctx.save();
    ctx.globalAlpha = clamp01(alpha);
    ctx.translate(SLIDE_W / 2, SLIDE_H / 2);
    ctx.rotate(angle);
    const w = SLIDE_W * scale, h = SLIDE_H * scale;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  // Horizontal squash/stretch around centre (used by flip).
  function paintScaleX(img: HTMLImageElement, sx: number, alpha: number) {
    ctx.save();
    ctx.globalAlpha = clamp01(alpha);
    ctx.translate(SLIDE_W / 2, SLIDE_H / 2);
    ctx.scale(Math.max(0.0001, sx), 1);
    const w = SLIDE_W * 1.03, h = SLIDE_H * 1.03;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function paintBlur(img: HTMLImageElement, scale: number, alpha: number, blurPx: number) {
    ctx.save();
    ctx.globalAlpha = clamp01(alpha);
    try { (ctx as any).filter = `blur(${Math.max(0, blurPx)}px)`; } catch { /* ignore */ }
    const w = SLIDE_W * scale, h = SLIDE_H * scale;
    ctx.drawImage(img, (SLIDE_W - w) / 2, (SLIDE_H - h) / 2, w, h);
    ctx.restore();
  }

  function paintGlitch(curImg: HTMLImageElement, nextImg: HTMLImageElement, idx: number, tp: number) {
    paint(nextImg, 1.03, 0, 0, 1);
    const slices = 16;
    const sh = Math.ceil(SLIDE_H / slices) + 1;
    for (let s = 0; s < slices; s++) {
      const sy = (SLIDE_H / slices) * s;
      const j = Math.sin((s + 1) * 7.3 + idx * 3 + tp * 18) * 70 * (1 - tp);
      ctx.save();
      ctx.globalAlpha = 1 - tp;
      ctx.drawImage(curImg, 0, sy, SLIDE_W, sh, j, sy, SLIDE_W, sh);
      ctx.restore();
    }
  }

  function drawAt(elapsed: number) {
    if (!imgs.length) return;
    const idx = Math.min(imgs.length - 1, Math.floor(elapsed / perSlideMs));
    const into = elapsed - idx * perSlideMs;
    const p = into / perSlideMs;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);

    const cur = kenBurns(idx, p);
    // 'none' = hard cuts (no blend); otherwise blend during the fade window.
    const transitioning = transition !== 'none' && into > perSlideMs - fadeMs && idx < imgs.length - 1;
    const tp = transitioning ? ease((into - (perSlideMs - fadeMs)) / fadeMs) : 0;
    // 'auto' advances one effect per slide; named picks a fixed effect.
    const transType = transition === 'auto' ? idx % TRANS_COUNT : (TRANS_INDEX[transition as Exclude<VideoTransition, 'auto'>] ?? 0);

    if (!transitioning) {
      paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1);
    } else {
      const next = imgs[idx + 1];
      switch (transType) {
        case 0: // fade — crossfade
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1 - tp);
          paint(next, 1.03, 0, 0, tp);
          break;
        case 1: // slide — current exits left, next enters from right
          paint(imgs[idx], cur.scale, cur.ox - SLIDE_W * tp, cur.oy, 1);
          paint(next, 1.03, SLIDE_W * (1 - tp), 0, 1);
          break;
        case 2: // slide-up — current exits up, next rises from below
          paint(imgs[idx], cur.scale, cur.ox, cur.oy - SLIDE_H * tp, 1);
          paint(next, 1.03, 0, SLIDE_H * (1 - tp), 1);
          break;
        case 3: // push — both move left together with an accent seam
          paint(imgs[idx], cur.scale, cur.ox - SLIDE_W * tp, cur.oy, 1);
          paint(next, 1.03, SLIDE_W * (1 - tp), 0, 1);
          ctx.save();
          ctx.globalAlpha = 1; ctx.fillStyle = accent;
          ctx.fillRect(SLIDE_W * (1 - tp) - 4, 0, 4, SLIDE_H);
          ctx.restore();
          break;
        case 4: // zoom — current zooms out + fades, next zooms in
          paint(imgs[idx], cur.scale + 0.18 * tp, cur.ox, cur.oy, 1 - tp);
          paint(next, 1.18 - 0.15 * tp, 0, 0, tp);
          break;
        case 5: // zoom-out — next opens up from small
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1 - tp);
          paint(next, 0.6 + 0.43 * tp, 0, 0, tp);
          break;
        case 6: // wipe — next revealed left→right with an accent seam
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1);
          paint(next, 1.03, 0, 0, 1, SLIDE_W * tp);
          ctx.save();
          ctx.globalAlpha = 1; ctx.fillStyle = accent;
          ctx.fillRect(SLIDE_W * tp - 6, 0, 6, SLIDE_H);
          ctx.restore();
          break;
        case 7: // rotate — next spins + scales into place
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1 - tp);
          paintRotated(next, 0.5 + 0.53 * tp, tp, (1 - tp) * 0.5);
          break;
        case 8: // blur — cross-dissolve through a blur
          paintBlur(imgs[idx], cur.scale, 1 - tp, tp * 26);
          paintBlur(next, 1.03, tp, (1 - tp) * 26);
          break;
        case 9: // glitch — slice-shatter reveal
          paintGlitch(imgs[idx], next, idx, tp);
          break;
        case 10: { // pixelate — dissolve through chunky pixels
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1 - tp);
          paint(next, 1.03, 0, 0, tp);
          const px = 1 + Math.sin(tp * Math.PI) * 46;
          if (px > 2 && sctx) {
            const sw = Math.max(1, Math.round(SLIDE_W / px));
            const sh = Math.max(1, Math.round(SLIDE_H / px));
            scratch.width = sw; scratch.height = sh;
            sctx.imageSmoothingEnabled = true;
            sctx.clearRect(0, 0, sw, sh);
            sctx.drawImage(ctx.canvas, 0, 0, sw, sh);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(scratch, 0, 0, sw, sh, 0, 0, SLIDE_W, SLIDE_H);
            ctx.imageSmoothingEnabled = true;
          }
          break;
        }
        case 11: { // iris — circular reveal
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1);
          ctx.save();
          ctx.beginPath();
          ctx.arc(SLIDE_W / 2, SLIDE_H / 2, tp * Math.hypot(SLIDE_W, SLIDE_H) * 0.55, 0, Math.PI * 2);
          ctx.clip();
          paint(next, 1.03, 0, 0, 1);
          ctx.restore();
          break;
        }
        case 12: // flip — horizontal 3D-style flip
          if (tp < 0.5) paintScaleX(imgs[idx], 1 - tp * 2, 1);
          else paintScaleX(next, (tp - 0.5) * 2, 1);
          break;
        default: { // 13: bars — venetian-blind reveal
          paint(imgs[idx], cur.scale, cur.ox, cur.oy, 1);
          const bars = 10;
          const bh = SLIDE_H / bars;
          for (let b = 0; b < bars; b++) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, b * bh, SLIDE_W, bh * tp);
            ctx.clip();
            paint(next, 1.03, 0, 0, 1);
            ctx.restore();
          }
          break;
        }
      }
    }

    // Top progress line + per-slide segment ticks
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, 0, SLIDE_W, 8);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, SLIDE_W * (elapsed / totalMs), 8);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    for (let i = 1; i < imgs.length; i++) ctx.fillRect((SLIDE_W / imgs.length) * i - 1, 0, 2, 8);
    ctx.restore();
  }

  return { totalMs, drawAt };
}

/**
 * FAST path — encode an MP4 with WebCodecs (hardware H.264) + mp4-muxer.
 * Frames are drawn and encoded as fast as the machine allows (typically several
 * times faster than real-time), producing a proper, universally-playable .mp4.
 * Returns null if WebCodecs / H.264 isn't available so the caller can fall back.
 */
async function encodeMp4WebCodecs(
  canvas: HTMLCanvasElement,
  painter: VideoPainter,
  fps: number,
): Promise<Blob | null> {
  const g: any = typeof globalThis !== 'undefined' ? globalThis : window;
  if (typeof g.VideoEncoder === 'undefined' || typeof g.VideoFrame === 'undefined') return null;

  const cfgBase = { width: SLIDE_W, height: SLIDE_H, bitrate: 9_000_000, framerate: fps };
  // High → Main → Baseline, all level 4.0 (enough for 1080×1350).
  const codecs = ['avc1.640028', 'avc1.4d0028', 'avc1.42E028'];
  let codec: string | null = null;
  for (const c of codecs) {
    try {
      const sup = await g.VideoEncoder.isConfigSupported({ codec: c, ...cfgBase });
      if (sup?.supported) { codec = c; break; }
    } catch { /* try next */ }
  }
  if (!codec) return null;

  let Muxer: any, ArrayBufferTarget: any;
  try {
    ({ Muxer, ArrayBufferTarget } = await import('mp4-muxer'));
  } catch {
    return null;
  }

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: 'avc', width: SLIDE_W, height: SLIDE_H, frameRate: fps },
    fastStart: 'in-memory', // moov atom up front → streamable, plays instantly
  });

  let encErr: any = null;
  const encoder = new g.VideoEncoder({
    output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
    error: (e: any) => { encErr = e; },
  });
  encoder.configure({ codec, ...cfgBase, avc: { format: 'avc' } });

  const totalMs = painter.totalMs;
  const frameCount = Math.max(1, Math.round((totalMs / 1000) * fps));
  const frameDurUs = Math.round(1_000_000 / fps);
  const gop = Math.max(1, fps * 2);

  for (let i = 0; i < frameCount; i++) {
    if (encErr) throw encErr;
    const t = Math.min(totalMs - 0.001, (i / fps) * 1000);
    painter.drawAt(t);
    const frame = new g.VideoFrame(canvas, { timestamp: i * frameDurUs, duration: frameDurUs });
    encoder.encode(frame, { keyFrame: i % gop === 0 });
    frame.close();
    // Keep the encoder queue bounded so memory stays flat on long videos.
    if (encoder.encodeQueueSize > 30) {
      await new Promise<void>(resolve => {
        const wait = () => (encoder.encodeQueueSize <= 10 ? resolve() : setTimeout(wait, 4));
        wait();
      });
    }
  }

  await encoder.flush();
  encoder.close();
  muxer.finalize();
  if (encErr) throw encErr;
  return new Blob([target.buffer], { type: 'video/mp4' });
}

/** SLOW fallback — real-time MediaRecorder (used only when WebCodecs is unavailable). */
async function recordMp4Realtime(
  canvas: HTMLCanvasElement,
  painter: VideoPainter,
  fps: number,
): Promise<{ blob: Blob; ext: string }> {
  const stream = canvas.captureStream(fps);
  const mimeType = pickMp4MimeType();
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 9_000_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  const done = new Promise<Blob>(resolve => { recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType })); });
  recorder.start();

  const t0 = performance.now();
  await new Promise<void>(resolve => {
    function frame() {
      const elapsed = performance.now() - t0;
      painter.drawAt(elapsed);
      if (elapsed < painter.totalMs) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });

  recorder.stop();
  const blob = await done;
  return { blob, ext: mimeType.includes('mp4') ? 'mp4' : 'webm' };
}

export interface VideoOpts {
  perSlideMs?: number;
  fadeMs?: number;
  fps?: number;
  accent?: string;
  transition?: VideoTransition;
  kenBurns?: boolean;
}

/** Render slides → an MP4 (or WebM fallback) Blob, without saving. */
export async function renderMp4Blob(nodes: HTMLDivElement[], opts?: VideoOpts): Promise<{ blob: Blob; ext: string }> {
  const perSlideMs = opts?.perSlideMs ?? 2000;
  const fadeMs = opts?.fadeMs ?? 480;
  const fps = opts?.fps ?? 30;
  const accent = opts?.accent ?? '#ffffff';
  const transition: VideoTransition = opts?.transition ?? 'auto';
  const kenBurnsOn = opts?.kenBurns ?? true;

  // Capture each slide once (1× = native canvas size, fast + lossless for video).
  const dataUrls = await captureSlides(nodes, 1);
  const imgs = await Promise.all(dataUrls.map(loadImage));

  const canvas = document.createElement('canvas');
  canvas.width = SLIDE_W;
  canvas.height = SLIDE_H;
  const ctx = canvas.getContext('2d')!;
  const painter = makeVideoPainter(ctx, imgs, { perSlideMs, fadeMs, accent, transition, kenBurns: kenBurnsOn });

  // Try the fast WebCodecs encoder first; fall back to real-time recording.
  try {
    const fast = await encodeMp4WebCodecs(canvas, painter, fps);
    if (fast && fast.size > 0) return { blob: fast, ext: 'mp4' };
  } catch (e) {
    console.warn('Fast MP4 encode failed, falling back to MediaRecorder:', e);
  }
  return recordMp4Realtime(canvas, painter, fps);
}

export async function downloadMp4(nodes: HTMLDivElement[], baseName: string, opts?: VideoOpts) {
  const { blob, ext } = await renderMp4Blob(nodes, opts);
  saveAs(blob, `${baseName}.${ext}`);
}

/** Bulk per-day video zip: one MP4 per post, using the chosen effect + options. */
export async function downloadDayMp4Zip(groups: PostGroup[], dayName: string, opts?: VideoOpts) {
  const zip = new JSZip();
  for (const g of groups) {
    const { blob, ext } = await renderMp4Blob(g.nodes, opts);
    zip.file(`post-${g.postIdx}.${ext}`, blob);
  }
  const out = await zip.generateAsync({ type: 'blob' });
  saveAs(out, `${dayName}-videos.zip`);
}

/**
 * Animated GIF export — a lightweight, universally-shareable version of the
 * carousel (holds each slide, crossfades between). Rendered at reduced
 * resolution to keep the file small. For full motion + effects, use the MP4.
 */
export async function downloadGif(nodes: HTMLDivElement[], baseName: string, opts?: { width?: number; holdMs?: number; fadeFrames?: number; fadeMs?: number }) {
  const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
  const W = opts?.width ?? 540;
  const H = Math.round((W * SLIDE_H) / SLIDE_W);
  const holdMs = opts?.holdMs ?? 1300;
  const fadeFrames = opts?.fadeFrames ?? 6;
  const fadeMs = opts?.fadeMs ?? 45;

  const dataUrls = await captureSlides(nodes);
  const imgs = await Promise.all(dataUrls.map(loadImage));

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const gif = GIFEncoder();

  const writeFrame = (delay: number) => {
    const { data } = ctx.getImageData(0, 0, W, H);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, W, H, { palette, delay });
  };

  for (let i = 0; i < imgs.length; i++) {
    // Held slide
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(imgs[i], 0, 0, W, H);
    writeFrame(holdMs);

    // Crossfade into the next slide
    if (i < imgs.length - 1) {
      for (let f = 1; f <= fadeFrames; f++) {
        const a = f / (fadeFrames + 1);
        ctx.globalAlpha = 1;
        ctx.drawImage(imgs[i], 0, 0, W, H);
        ctx.globalAlpha = a;
        ctx.drawImage(imgs[i + 1], 0, 0, W, H);
        writeFrame(fadeMs);
      }
    }
  }

  gif.finish();
  const blob = new Blob([gif.bytes() as unknown as BlobPart], { type: 'image/gif' });
  saveAs(blob, `${baseName}.gif`);
}

function pickMp4MimeType(): string {
  const candidates = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c)) return c;
  }
  return 'video/webm';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
