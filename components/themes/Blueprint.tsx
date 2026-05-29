'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

const SANS = '"Space Grotesk", sans-serif';
const MONO = '"JetBrains Mono", monospace';

export default function BlueprintSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const isCTA = slide.kind === 'cta';
  const line = withAlpha(palette.accent1, 0.16);

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, backgroundColor: palette.bg, color: palette.text,
      position: 'relative', padding: 70, fontFamily: SANS, overflow: 'hidden',
    }}>
      {/* drafting grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: '54px 54px',
      }} />
      {/* outer drafting frame */}
      <div style={{ position: 'absolute', inset: 34, border: `2px solid ${withAlpha(palette.accent1, 0.55)}` }} />
      <div style={{ position: 'absolute', inset: 46, border: `1px solid ${withAlpha(palette.accent1, 0.3)}` }} />

      {/* top bar */}
      <div style={{ position: 'absolute', top: 72, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 22, color: palette.accent2, letterSpacing: '0.14em' }}>⊹ {dayLabel}</span>
        <span style={{ fontFamily: MONO, fontSize: 20, color: palette.muted, letterSpacing: '0.1em' }}>FIG. {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      </div>

      {/* main */}
      <div style={{ position: 'absolute', top: 224, left: 78, right: 78, bottom: 176, display: 'flex', flexDirection: 'column' }}>
        {renderBody(slide, palette, isCover, isCTA)}
      </div>

      {/* title block */}
      <div style={{ position: 'absolute', bottom: 72, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${withAlpha(palette.accent1, 0.4)}`, paddingTop: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 18, color: palette.text }}>@{brand.instagram}</span>
          <span style={{ fontFamily: MONO, fontSize: 14, color: palette.muted }}>SCALE 1:1 · DRAWN BY {brand.name.toUpperCase()}</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 44, color: palette.accent3, lineHeight: 1 }}>{index < total - 1 ? '→' : '✦'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean, isCTA: boolean) {
  const title = slide.title || '';
  const scale = title.length > 30 ? 0.78 : title.length > 22 ? 0.88 : 1;
  const headlineStyle: React.CSSProperties = {
    fontFamily: SANS, fontSize: Math.round((isCover || isCTA ? 92 : 64) * scale), lineHeight: 1.04,
    fontWeight: 700, letterSpacing: '-0.01em', color: palette.text,
  };
  const bodyStyle: React.CSSProperties = { fontFamily: MONO, fontSize: 28, lineHeight: 1.5, color: palette.text, marginTop: 24, maxWidth: 880 };

  if (slide.kind === 'cover' || slide.kind === 'cta') {
    return (
      <>
        <div style={{ fontFamily: MONO, fontSize: 22, color: palette.accent2, letterSpacing: '0.2em', marginBottom: 14 }}>— SPECIFICATION —</div>
        <div style={headlineStyle}>{slide.title}</div>
        {slide.body && <div style={{ ...bodyStyle, color: palette.muted }}>{slide.body}</div>}
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
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={palette.surface} text={palette.text}
            border={`1px solid ${withAlpha(palette.accent1, 0.5)}`} />
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
            <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: MONO, fontSize: 24, color: palette.accent2, lineHeight: 1.4, flexShrink: 0 }}>[{String(i + 1).padStart(2, '0')}]</span>
              <span style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.4, color: palette.text }}>{b}</span>
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

function withAlpha(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
