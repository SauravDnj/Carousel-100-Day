'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brand, Palette, SlideContent, SlideKind, ThemeId } from '@/lib/types';
import ThemeSlide from './themes';
import { SLIDE_W, SLIDE_H } from './themes/types';
import { Sparkle, Star, Bolt, Blob, DotCluster } from './themes/stickers';
import { downloadSinglePng } from '@/lib/download';

interface Props {
  slides: SlideContent[];
  themeId: ThemeId;
  palette: Palette;
  brand: Brand;
  dayLabel: string;
  postLabel: string;
  /** scale shown in browser (image always rendered at 1080×1350) */
  displayWidth?: number;
  /** base filename for single-slide downloads */
  baseName?: string;
}

export interface CarouselPreviewHandle {
  goToSlide: (i: number) => void;
  getSlideElement: (i: number) => HTMLDivElement | null;
  getAllSlideElements: () => (HTMLDivElement | null)[];
  total: number;
}

export default function CarouselPreview({ slides, themeId, palette, brand, dayLabel, postLabel, displayWidth = 480, baseName }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const total = slides.length;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIndex(i => (i + 1) % total), 2200);
    return () => clearInterval(id);
  }, [playing, total]);

  // Keep the index in range when slides are added/removed in the editor.
  useEffect(() => {
    setIndex(i => (i > total - 1 ? Math.max(0, total - 1) : i));
  }, [total]);

  const scale = displayWidth / SLIDE_W;
  const displayH = SLIDE_H * scale;
  const currentSlide = slides[index];

  // Expose refs so parent can capture them for download
  useEffect(() => {
    (window as any).__slideRefs = slideRefs.current;
  }, [slides, themeId, palette]);

  if (!currentSlide) {
    return (
      <div style={{ width: displayWidth, height: displayH, borderRadius: 16, background: '#101010', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 14 }}>
        No slides yet
      </div>
    );
  }

  return (
    <div>
      <div style={{
        position: 'relative', width: displayWidth, height: displayH,
        borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        background: '#000',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: 'absolute', inset: 0, transformOrigin: 'top left' }}
          >
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: SLIDE_W, height: SLIDE_H, position: 'relative' }}>
              {/* The slide enters with a kind-aware motion (cover pops, diagram rises, rest slide in) */}
              <motion.div
                initial={entranceFor(currentSlide.kind).initial}
                animate={entranceFor(currentSlide.kind).animate}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: SLIDE_W, height: SLIDE_H, transformOrigin: 'center' }}
              >
                <ThemeSlide
                  themeId={themeId}
                  slide={currentSlide}
                  index={index}
                  total={total}
                  palette={palette}
                  brand={brand}
                  dayLabel={dayLabel}
                  postLabel={postLabel}
                />
              </motion.div>
              {/* Animated decoration layer — preview only, palette-driven, varies per slide */}
              <DecorLayer palette={palette} seed={index} kind={currentSlide.kind} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Off-screen, full-size renders for download. Hidden from view but in DOM. */}
      <div style={{ position: 'absolute', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden>
        {slides.map((s, i) => (
          <div key={i} ref={el => { slideRefs.current[i] = el; }} style={{ width: SLIDE_W, height: SLIDE_H, position: 'relative' }}>
            <ThemeSlide
              themeId={themeId} slide={s} index={i} total={total} palette={palette}
              brand={brand} dayLabel={dayLabel} postLabel={postLabel}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0} style={btn(index === 0)}>‹ Prev</button>
        <button onClick={() => setPlaying(p => !p)} style={btn(false)}>{playing ? '❚❚ Pause' : '▶ Play'}</button>
        <button onClick={() => setIndex(i => Math.min(total - 1, i + 1))} disabled={index === total - 1} style={btn(index === total - 1)}>Next ›</button>
        {baseName && (
          <button
            onClick={async () => {
              const node = slideRefs.current[index];
              if (node) await downloadSinglePng(node, `${baseName}-slide-${String(index + 1).padStart(2, '0')}`);
            }}
            style={btn(false)}
            title="Download this slide as PNG"
          >⬇ This slide</button>
        )}
        <span style={{ marginLeft: 'auto', color: '#888', fontSize: 13, fontFamily: 'JetBrains Mono' }}>
          {index + 1} / {total}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} style={{
            flex: 1, height: 4, border: 'none', borderRadius: 2, cursor: 'pointer',
            background: i === index ? '#fff' : '#333',
          }} />
        ))}
      </div>
    </div>
  );
}

function btn(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? '#1a1a1a' : '#222', color: disabled ? '#555' : '#eee',
    border: '1px solid #333', padding: '8px 14px', borderRadius: 8, fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

// Kind-aware entrance: covers pop, diagrams/visuals rise, code zooms, the rest slide in.
function entranceFor(kind: SlideKind): { initial: any; animate: any } {
  switch (kind) {
    case 'cover':
    case 'cta':
      return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };
    case 'diagram':
    case 'visual':
      return { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 } };
    case 'code':
      return { initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 } };
    default:
      return { initial: { opacity: 0, x: 70 }, animate: { opacity: 1, x: 0 } };
  }
}

// Preview-only animated stickers/decorations. Deterministic per slide (seed) so
// shapes stay put between renders but vary slide-to-slide. Never captured to PNG.
function DecorLayer({ palette, seed, kind }: { palette: Palette; seed: number; kind: SlideKind }) {
  const rnd = (n: number) => { const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453; return v - Math.floor(v); };
  const accents = [palette.accent1, palette.accent2, palette.accent3];
  const dense = kind === 'code' || kind === 'diagram';
  const showcase = kind === 'cover' || kind === 'cta';
  const sparkles = (dense ? [0] : [0, 1, 2]).map(i => ({
    x: 70 + rnd(i + 1) * (SLIDE_W - 220),
    y: 150 + rnd(i + 5) * (SLIDE_H - 420),
    size: 28 + rnd(i + 9) * 28,
    dur: 2.2 + rnd(i + 13) * 1.6,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
      {showcase && (
        <motion.div
          style={{ position: 'absolute', right: -60, bottom: -40, opacity: 0.16 }}
          animate={{ scale: [1, 1.06, 1], rotate: [0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Blob color={palette.accent2} size={440} />
        </motion.div>
      )}
      {sparkles.map((sp, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: sp.x, top: sp.y }}
          animate={{ scale: [0.5, 1.15, 0.5], opacity: [0.25, 0.85, 0.25], rotate: [0, 180, 360] }}
          transition={{ duration: sp.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
        >
          <Sparkle color={accents[i % accents.length]} size={sp.size} />
        </motion.div>
      ))}
      <motion.div
        style={{ position: 'absolute', right: 78, top: 100 }}
        animate={{ y: [0, -16, 0], rotate: [-6, 8, -6] }}
        transition={{ duration: 4 + rnd(20) * 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {seed % 2 === 0
          ? <Star color={palette.accent2} size={44} stroke={palette.text} />
          : <Bolt color={palette.accent1} size={44} stroke={palette.text} />}
      </motion.div>
      {!dense && (
        <motion.div
          style={{ position: 'absolute', left: 56, bottom: 140, opacity: 0.5 }}
          animate={{ y: [0, -22, 0], x: [0, 10, 0] }}
          transition={{ duration: 5 + rnd(30) * 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <DotCluster color={palette.accent3} size={110} />
        </motion.div>
      )}
    </div>
  );
}
