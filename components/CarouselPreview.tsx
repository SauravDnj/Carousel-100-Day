'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brand, Palette, SlideContent, ThemeId } from '@/lib/types';
import ThemeSlide from './themes';
import { SLIDE_W, SLIDE_H } from './themes/types';
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
              {/* The slide itself enters with a subtle slide+fade */}
              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: SLIDE_W, height: SLIDE_H }}
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
              {/* Sparkle — preview only */}
              <motion.div
                style={{
                  position: 'absolute', top: 28, right: 28, width: 20, height: 20,
                  pointerEvents: 'none',
                }}
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 0.9, 0.3], rotate: [0, 180, 360] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 14 14" fill={palette.accent1}>
                  <path d="M7 0 L8 5 L13 6 L8 7 L7 14 L6 7 L0 6 L6 5 Z" />
                </svg>
              </motion.div>
              {/* Floating dot decoration */}
              <motion.div
                style={{ position: 'absolute', bottom: 100, left: 50, width: 12, height: 12, borderRadius: '50%', background: palette.accent2, pointerEvents: 'none' }}
                animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Off-screen, full-size renders for download. Hidden from view but in DOM. */}
      <div style={{ position: 'absolute', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden>
        {slides.map((s, i) => (
          <div key={i} ref={el => { slideRefs.current[i] = el; }} style={{ width: SLIDE_W, height: SLIDE_H }}>
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
