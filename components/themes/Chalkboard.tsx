'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

const HAND = '"Caveat", cursive';
const MONO = '"JetBrains Mono", monospace';

export default function ChalkboardSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const isCTA = slide.kind === 'cta';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, backgroundColor: palette.bg, color: palette.text,
      position: 'relative', padding: 70, fontFamily: HAND, overflow: 'hidden',
    }}>
      {/* chalk dust / vignette */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)` }} />
      {/* wooden-ish dashed frame */}
      <div style={{ position: 'absolute', inset: 40, border: `3px dashed ${withAlpha(palette.text, 0.4)}`, borderRadius: 10 }} />

      {/* top bar */}
      <div style={{ position: 'absolute', top: 70, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 20, color: palette.accent1, letterSpacing: '0.12em' }}>✎ {dayLabel}</span>
        <span style={{ fontFamily: MONO, fontSize: 18, color: palette.muted }}>{String(index + 1)} / {total}</span>
      </div>

      {/* main */}
      <div style={{ position: 'absolute', top: 210, left: 78, right: 78, bottom: 170, display: 'flex', flexDirection: 'column' }}>
        {renderBody(slide, palette, isCover, isCTA)}
      </div>

      {/* footer */}
      <div style={{ position: 'absolute', bottom: 70, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: MONO, fontSize: 17, color: palette.muted }}>@{brand.instagram}</span>
        <span style={{ fontFamily: HAND, fontSize: 54, fontWeight: 700, color: palette.accent1, lineHeight: 1 }}>{index < total - 1 ? '→' : '♥'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean, isCTA: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: HAND, fontWeight: 700, fontSize: isCover || isCTA ? 130 : 96, lineHeight: 1.0,
    color: palette.text,
  };
  const bodyStyle: React.CSSProperties = { fontFamily: HAND, fontWeight: 500, fontSize: 46, lineHeight: 1.3, color: palette.text, marginTop: 18, maxWidth: 880 };

  const Underline = () => (
    <svg width="420" height="16" viewBox="0 0 420 16" style={{ display: 'block', marginTop: 6 }}>
      <path d="M2 9 Q 120 2, 240 8 T 418 7" stroke={palette.accent1} strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );

  if (slide.kind === 'cover' || slide.kind === 'cta') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <Underline />
        {slide.body && <div style={{ ...bodyStyle, color: palette.muted }}>{slide.body}</div>}
      </>
    );
  }
  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font={HAND} titleStyle={headlineStyle} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <Underline />
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={palette.surface} text={palette.text}
            border={`2px dashed ${withAlpha(palette.text, 0.5)}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <Underline />
        <ul style={{ marginTop: 18, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'baseline' }}>
              <span style={{ color: palette.accent2, fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: 1, flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: HAND, fontWeight: 500, fontSize: 46, lineHeight: 1.2, color: palette.text }}>{b}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <div style={headlineStyle}>{slide.title}</div>
      <Underline />
      {slide.body && <div style={bodyStyle}>{slide.body}</div>}
    </>
  );
}

function withAlpha(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
