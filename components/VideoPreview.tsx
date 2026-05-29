'use client';

import { useEffect, useRef, useState } from 'react';
import { makeVideoPainter, capturePreviewImages, VideoPainter, VideoTransition } from '@/lib/download';

interface Props {
  transition: VideoTransition;
  speedMs: number;
  kenBurns: boolean;
  accent: string;
  /** Changing this re-captures the slides (e.g. theme/palette/content changed). */
  captureKey: string;
}

/**
 * A small looping canvas that plays the currently-selected transition + effect on
 * the real slides — using the SAME painter the MP4 exporter uses, so the preview
 * matches the download exactly.
 *
 * Performance: capturing the off-screen slides to images (html-to-image) is the
 * expensive part, so we (1) debounce it, (2) capture only a few small frames,
 * (3) cancel stale captures, and (4) keep the previous preview animating while a
 * new capture runs — switching theme/palette never blanks or blocks the UI.
 */
export default function VideoPreview({ transition, speedMs, kenBurns, accent, captureKey }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const genRef = useRef(0);
  const [hasFrames, setHasFrames] = useState(false);
  const [capturing, setCapturing] = useState(true);

  // Debounced (re)capture whenever the theme/palette/content key changes.
  useEffect(() => {
    const myGen = ++genRef.current;
    const live = () => genRef.current === myGen;
    setCapturing(true);

    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const attempt = async () => {
      if (!live()) return;
      const nodes = (((window as any).__slideRefs as (HTMLDivElement | null)[]) || []).filter(Boolean) as HTMLDivElement[];
      if (!nodes.length) { retryTimer = setTimeout(attempt, 200); return; }
      try {
        const captured = await capturePreviewImages(nodes, 3, live);
        if (!live()) return;
        if (captured.length) { imgsRef.current = captured; setHasFrames(true); }
      } catch {
        /* keep previous frames */
      } finally {
        if (live()) setCapturing(false);
      }
    };

    // Wait for the off-screen nodes to re-render the new theme, then capture once.
    const debounce = setTimeout(attempt, 280);
    return () => { clearTimeout(debounce); if (retryTimer) clearTimeout(retryTimer); };
  }, [captureKey]);

  // Single rAF loop for the lifetime of the component. It reads imgsRef each frame,
  // so freshly-captured frames swap in seamlessly without restarting the loop.
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    let painter: VideoPainter | null = null;
    let builtFor: HTMLImageElement[] | null = null;

    const loop = () => {
      const canvas = canvasRef.current;
      const imgs = imgsRef.current;
      if (canvas && imgs.length) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (builtFor !== imgs) {
            painter = makeVideoPainter(ctx, imgs, { perSlideMs: speedMs, fadeMs: 480, accent, transition, kenBurns });
            builtFor = imgs;
          }
          const elapsed = (performance.now() - start) % painter!.totalMs;
          painter!.drawAt(elapsed);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speedMs, accent, transition, kenBurns]);

  return (
    <div style={{ position: 'relative', maxWidth: 240, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1350}
        style={{ width: '100%', display: 'block', borderRadius: 8, background: '#000', aspectRatio: '1080 / 1350' }}
      />
      {!hasFrames && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#888', fontSize: 12, fontFamily: 'JetBrains Mono', textAlign: 'center', padding: 12,
        }}>
          Preparing preview…
        </div>
      )}
      {hasFrames && capturing && (
        <div style={{
          position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#ddd',
          fontSize: 10, fontFamily: 'JetBrains Mono', padding: '3px 7px', borderRadius: 100,
        }}>
          updating…
        </div>
      )}
    </div>
  );
}
