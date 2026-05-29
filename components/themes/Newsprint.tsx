'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

const SERIF = '"Playfair Display", serif';
const MAST = '"Bebas Neue", sans-serif';
const MONO = '"JetBrains Mono", monospace';

export default function NewsprintSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const isCTA = slide.kind === 'cta';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, backgroundColor: palette.bg, color: palette.text,
      position: 'relative', padding: 64, fontFamily: SERIF, overflow: 'hidden',
    }}>
      {/* halftone speckle */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: `radial-gradient(${palette.text} 1px, transparent 1.4px)`,
        backgroundSize: '8px 8px',
      }} />

      {/* masthead */}
      <div style={{ position: 'absolute', top: 64, left: 64, right: 64, borderBottom: `4px double ${palette.text}`, paddingBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.1em', color: palette.muted }}>{dayLabel} · 100-DAY EDITION</span>
          <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.1em', color: palette.muted }}>No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <div style={{ fontFamily: MAST, fontSize: 70, lineHeight: 0.95, letterSpacing: '0.02em', textAlign: 'center', color: palette.text }}>
          THE DAILY DROP
        </div>
      </div>

      {/* main */}
      <div style={{ position: 'absolute', top: 250, left: 64, right: 64, bottom: 150, display: 'flex', flexDirection: 'column' }}>
        {renderBody(slide, palette, isCover, isCTA)}
      </div>

      {/* footer */}
      <div style={{ position: 'absolute', bottom: 64, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${palette.text}`, paddingTop: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 17, color: palette.text }}>By {brand.name} · @{brand.instagram}</span>
        <span style={{ fontFamily: SERIF, fontSize: 36, color: palette.accent2, lineHeight: 1 }}>{index < total - 1 ? '▸' : '∎'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean, isCTA: boolean) {
  const title = slide.title || '';
  const scale = title.length > 32 ? 0.74 : title.length > 22 ? 0.86 : 1;
  const headlineStyle: React.CSSProperties = {
    fontFamily: SERIF, fontWeight: 900, fontSize: Math.round((isCover || isCTA ? 96 : 70) * scale),
    lineHeight: 1.0, letterSpacing: '-0.01em', color: palette.text,
  };
  const bodyStyle: React.CSSProperties = { fontFamily: SERIF, fontSize: 32, lineHeight: 1.5, color: palette.text, marginTop: 22, maxWidth: 880 };

  if (slide.kind === 'cover' || slide.kind === 'cta') {
    return (
      <>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.25em', color: palette.accent2, marginBottom: 16, textTransform: 'uppercase' }}>Headline</div>
        <div style={headlineStyle}>{slide.title}</div>
        {slide.body && <div style={{ ...bodyStyle, fontStyle: 'italic', color: palette.muted }}>{slide.body}</div>}
      </>
    );
  }
  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font={SERIF} titleStyle={headlineStyle} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 26 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.surface} text="#1a1a1a" border={`2px solid ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ul style={{ marginTop: 26, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MAST, fontSize: 34, color: palette.accent2, lineHeight: 1, flexShrink: 0 }}>{String(i + 1)}</span>
              <span style={{ fontFamily: SERIF, fontSize: 33, lineHeight: 1.35, color: palette.text }}>{b}</span>
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
