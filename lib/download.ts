'use client';

// Client-side rendering of slides → PNG / PDF / MP4.
// We capture the off-screen full-size DOM nodes (1080x1350) using html-to-image,
// then bundle into ZIP, PDF (jsPDF), or MP4 (MediaRecorder painting frames to a canvas).

import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SLIDE_W = 1080;
const SLIDE_H = 1350;

export async function downloadSinglePng(node: HTMLDivElement, fileName: string) {
  const url = await toPng(node, {
    width: SLIDE_W, height: SLIDE_H, pixelRatio: 2, cacheBust: true, backgroundColor: '#000',
  });
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.png`;
  a.click();
}

export async function captureSlides(nodes: HTMLDivElement[]): Promise<string[]> {
  const dataUrls: string[] = [];
  for (const node of nodes) {
    // Wait a frame to ensure fonts loaded
    await new Promise(r => requestAnimationFrame(r));
    const url = await toPng(node, {
      width: SLIDE_W,
      height: SLIDE_H,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#000',
    });
    dataUrls.push(url);
  }
  return dataUrls;
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
  for (const node of nodes) {
    await new Promise(r => requestAnimationFrame(r));
    const url = await toPng(node, { width: SLIDE_W, height: SLIDE_H, pixelRatio: scale, cacheBust: true, backgroundColor: '#000' });
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

export async function downloadPngZip(nodes: HTMLDivElement[], baseName: string) {
  const dataUrls = await captureSlides(nodes);
  const zip = new JSZip();
  for (let i = 0; i < dataUrls.length; i++) {
    const base64 = dataUrls[i].split(',')[1];
    zip.file(`${baseName}-slide-${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${baseName}.zip`);
}

export async function downloadPdf(nodes: HTMLDivElement[], baseName: string) {
  // Use lower pixel ratio for PDF to keep file size reasonable
  const dataUrls = await captureSlidesAtScale(nodes, 1.5);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [SLIDE_W, SLIDE_H], compress: true });
  for (let i = 0; i < dataUrls.length; i++) {
    if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'portrait');
    pdf.addImage(dataUrls[i], 'JPEG', 0, 0, SLIDE_W, SLIDE_H, undefined, 'FAST');
  }
  pdf.save(`${baseName}.pdf`);
}

async function captureSlidesAtScale(nodes: HTMLDivElement[], scale: number): Promise<string[]> {
  // Re-import inside fn to avoid hoisting issues
  const { toJpeg } = await import('html-to-image');
  const dataUrls: string[] = [];
  for (const node of nodes) {
    await new Promise(r => requestAnimationFrame(r));
    const url = await toJpeg(node, { width: SLIDE_W, height: SLIDE_H, pixelRatio: scale, cacheBust: true, quality: 0.88, backgroundColor: '#fff' });
    dataUrls.push(url);
  }
  return dataUrls;
}

export async function downloadMp4(nodes: HTMLDivElement[], baseName: string, opts?: { perSlideMs?: number; fadeMs?: number; fps?: number }) {
  const perSlideMs = opts?.perSlideMs ?? 1800;
  const fadeMs = opts?.fadeMs ?? 350;
  const fps = opts?.fps ?? 30;

  // 1) Capture every slide as an image
  const dataUrls = await captureSlides(nodes);
  const imgs = await Promise.all(dataUrls.map(loadImage));

  // 2) Paint frames onto a canvas, stream via MediaRecorder
  const canvas = document.createElement('canvas');
  canvas.width = SLIDE_W;
  canvas.height = SLIDE_H;
  const ctx = canvas.getContext('2d')!;
  const stream = canvas.captureStream(fps);

  const mimeType = pickMp4MimeType();
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  const done = new Promise<Blob>(resolve => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });
  recorder.start();

  // Paint loop using requestAnimationFrame so the captureStream picks up changes.
  const totalMs = imgs.length * perSlideMs;
  const t0 = performance.now();
  await new Promise<void>(resolve => {
    function frame() {
      const elapsed = performance.now() - t0;
      const localIdx = Math.min(imgs.length - 1, Math.floor(elapsed / perSlideMs));
      const intoSlide = elapsed - localIdx * perSlideMs;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
      ctx.globalAlpha = 1;
      ctx.drawImage(imgs[localIdx], 0, 0, SLIDE_W, SLIDE_H);

      // Crossfade into next slide
      if (intoSlide > perSlideMs - fadeMs && localIdx < imgs.length - 1) {
        const alpha = (intoSlide - (perSlideMs - fadeMs)) / fadeMs;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(imgs[localIdx + 1], 0, 0, SLIDE_W, SLIDE_H);
      }
      if (elapsed < totalMs) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });

  recorder.stop();
  const blob = await done;
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
  saveAs(blob, `${baseName}.${ext}`);
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
