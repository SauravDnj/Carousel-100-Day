'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

const DISPLAY = '"Archivo Black", sans-serif';
const SANS = '"Fredoka", sans-serif';
const MONO = '"JetBrains Mono", monospace';

export default function MemphisSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const isCTA = slide.kind === 'cta';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, backgroundColor: palette.bg, color: palette.text,
      position: 'relative', padding: 72, fontFamily: SANS, overflow: 'hidden',
    }}>
      <Confetti palette={palette} seed={index} />

      {/* top bar */}
      <div style={{ position: 'absolute', top: 72, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <span style={{
          fontFamily: MONO, fontSize: 20, color: palette.bg, background: palette.accent1,
          padding: '6px 14px', borderRadius: 100, fontWeight: 700, letterSpacing: '0.08em',
        }}>{dayLabel}</span>
        <Dots index={index} total={total} palette={palette} />
      </div>

      {/* main */}
      <div style={{ position: 'absolute', top: 228, left: 72, right: 72, bottom: 176, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        {renderBody(slide, palette, isCover, isCTA)}
      </div>

      {/* footer */}
      <div style={{ position: 'absolute', bottom: 72, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
        <span style={{ fontFamily: MONO, fontSize: 18, color: palette.muted }}>@{brand.instagram}</span>
        <span style={{ fontFamily: DISPLAY, fontSize: 44, color: palette.accent1, lineHeight: 1 }}>{index < total - 1 ? '→' : '★'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean, isCTA: boolean) {
  const title = slide.title || '';
  const scale = title.length > 28 ? 0.74 : title.length > 20 ? 0.86 : 1;
  const headlineStyle: React.CSSProperties = {
    fontFamily: DISPLAY, fontSize: Math.round((isCover || isCTA ? 92 : 64) * scale), lineHeight: 1.02,
    letterSpacing: '-0.01em', color: palette.text,
  };
  const bodyStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 500, fontSize: 32, lineHeight: 1.45, color: palette.text, marginTop: 22, maxWidth: 860 };
  const shapeColors = [palette.accent1, palette.accent2, palette.accent3];

  if (slide.kind === 'cover' || slide.kind === 'cta') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ width: 180, height: 14, background: palette.accent2, borderRadius: 100, marginTop: 22 }} />
        {slide.body && <div style={bodyStyle}>{slide.body}</div>}
      </>
    );
  }
  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font={SANS} titleStyle={headlineStyle} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 28 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background="#ffffff" text="#1a1a1a" border={`3px solid ${palette.text}`} shadow={`8px 8px 0 ${palette.accent1}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ul style={{ marginTop: 28, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', gap: 18, marginBottom: 22, alignItems: 'center' }}>
              <ShapeBullet color={shapeColors[i % 3]} variant={i % 3} text={palette.bg} />
              <span style={{ fontSize: 33, lineHeight: 1.25, color: palette.text, fontWeight: 500 }}>{b}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <div style={headlineStyle}>{slide.title}</div>
      {slide.body && <div style={bodyStyle}>{slide.body}</div>}
    </>
  );
}

function ShapeBullet({ color, variant, text }: { color: string; variant: number; text: string }) {
  const base: React.CSSProperties = { width: 50, height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: text, fontWeight: 700, fontFamily: '"Archivo Black", sans-serif', fontSize: 22 };
  if (variant === 0) return <span style={{ ...base, background: color, borderRadius: '50%' }} />;
  if (variant === 1) return <span style={{ ...base, background: color, borderRadius: 8 }} />;
  return <span style={{ width: 0, height: 0, flexShrink: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderBottom: `50px solid ${color}` }} />;
}

function Confetti({ palette, seed }: { palette: any; seed: number }) {
  const rnd = (n: number) => { const v = Math.sin((seed + 1) * 41.3 + n * 12.7) * 4310.21; return v - Math.floor(v); };
  const colors = [palette.accent1, palette.accent2, palette.accent3];
  const shapes = Array.from({ length: 11 }).map((_, i) => ({
    x: rnd(i) * SLIDE_W,
    y: rnd(i + 20) * SLIDE_H,
    s: 26 + rnd(i + 40) * 44,
    c: colors[i % 3],
    k: i % 4,
    rot: rnd(i + 60) * 60 - 30,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.85, zIndex: 0 }}>
      {shapes.map((sp, i) => {
        const common: React.CSSProperties = { position: 'absolute', left: sp.x, top: sp.y, transform: `rotate(${sp.rot}deg)` };
        if (sp.k === 0) return <div key={i} style={{ ...common, width: sp.s, height: sp.s, borderRadius: '50%', border: `6px solid ${sp.c}` }} />;
        if (sp.k === 1) return <div key={i} style={{ ...common, width: sp.s, height: sp.s, background: sp.c, borderRadius: 6 }} />;
        if (sp.k === 2) return (
          <svg key={i} style={common} width={sp.s * 1.8} height={sp.s} viewBox="0 0 60 20">
            <path d="M0 10 Q 10 0, 20 10 T 40 10 T 60 10" stroke={sp.c} strokeWidth="5" fill="none" />
          </svg>
        );
        return <div key={i} style={{ width: 0, height: 0, position: 'absolute', left: sp.x, top: sp.y, borderLeft: `${sp.s / 2}px solid transparent`, borderRight: `${sp.s / 2}px solid transparent`, borderBottom: `${sp.s}px solid ${sp.c}`, transform: `rotate(${sp.rot}deg)` }} />;
      })}
    </div>
  );
}

function Dots({ index, total, palette }: { index: number; total: number; palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i === index ? palette.accent1 : 'transparent', border: `3px solid ${palette.accent1}` }} />
      ))}
    </div>
  );
}
