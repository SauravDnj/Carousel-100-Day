'use client';

// Read an uploaded image File, downscale it on a canvas, and return a data URL.
// Downscaling keeps localStorage usage sane (full-res phone photos are multi-MB).
// PNGs are kept as PNG to preserve transparency; everything else becomes JPEG.

export interface DownscaleOptions {
  /** Longest edge in pixels. Default 1280. */
  maxDim?: number;
  /** JPEG quality 0..1. Default 0.82. */
  quality?: number;
}

export async function fileToDataUrl(file: File, opts: DownscaleOptions = {}): Promise<string> {
  const maxDim = opts.maxDim ?? 1280;
  const quality = opts.quality ?? 0.82;

  const rawUrl = await readAsDataUrl(file);
  const img = await loadImage(rawUrl);

  const { width, height } = img;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  // No resize needed and already small enough → keep the original bytes.
  if (scale === 1 && file.size < 600_000) return rawUrl;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return rawUrl;
  ctx.drawImage(img, 0, 0, w, h);

  const isPng = file.type === 'image/png';
  try {
    return isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality);
  } catch {
    return rawUrl;
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
