'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function NotebookGridSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const variant = (palette.id || 'grid-engineer').replace('grid-', ''); // engineer | dot | iso

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 80,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Grid pattern */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }} width="100%" height="100%">
        <defs>
          {variant === 'engineer' && (
            <pattern id="ngrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={palette.accent2} strokeWidth="0.8" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke={palette.accent2} strokeWidth="1.5" />
            </pattern>
          )}
          {variant === 'dot' && (
            <pattern id="ngrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="1.8" fill={palette.muted} />
            </pattern>
          )}
          {variant === 'iso' && (
            <pattern id="ngrid" x="0" y="0" width="60" height="34.64" patternUnits="userSpaceOnUse">
              <path d="M 0,17.32 L 30,0 L 60,17.32 L 30,34.64 Z" fill="none" stroke={palette.accent2} strokeWidth="0.7" />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill="url(#ngrid)" />
      </svg>

      {/* Top-left corner: ruler marks */}
      <svg style={{ position: 'absolute', top: 60, left: 60, width: 200, height: 24, pointerEvents: 'none' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={i * 10} y1={0} x2={i * 10} y2={i % 5 === 0 ? 16 : 8} stroke={palette.text} strokeWidth="1.5" />
        ))}
        <line x1="0" y1="16" x2="200" y2="16" stroke={palette.text} strokeWidth="1.5" />
      </svg>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 110, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', zIndex: 5, paddingBottom: 10, borderBottom: `1.5px solid ${palette.text}` }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, color: palette.text, letterSpacing: '0.15em' }}>
          № {dayLabel.replace('DAY ', 'F-')} · REV.{String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 16, color: palette.muted }}>
          DRAWING {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 200, left: 80, right: 80, bottom: 160, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', zIndex: 5 }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 22,
            padding: '4px 14px', border: `2px solid ${palette.accent1}`, color: palette.accent1,
            fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>◇ {slide.sticker.replace('DAY-X', dayLabel)}</div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Title block bottom-right (drawing convention) */}
      <div style={{
        position: 'absolute', bottom: 70, right: 80, width: 340,
        border: `1.5px solid ${palette.text}`, padding: '8px 14px',
        background: palette.surface, zIndex: 5,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${palette.text}40`, paddingBottom: 4, marginBottom: 4 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: palette.muted, letterSpacing: '0.18em' }}>AUTHOR</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: palette.muted, letterSpacing: '0.18em' }}>SCALE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: palette.text }}>@{brand.instagram}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: palette.text }}>1 : 1</span>
        </div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: palette.muted, letterSpacing: '0.1em' }}>
          github.com/{brand.github} · linkedin.com/in/{brand.linkedin}
        </div>
      </div>

      {/* Next arrow bottom-left */}
      <div style={{ position: 'absolute', bottom: 80, left: 80, fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 700, color: palette.accent1, zIndex: 5, letterSpacing: '0.15em' }}>
        {index < total - 1 ? `→ NEXT (${index + 2}/${total})` : '◼ END'}
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
    fontSize: isCover ? 100 : 70, lineHeight: 1.0, letterSpacing: '-0.025em',
    color: palette.text,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 28, lineHeight: 1.5,
    marginTop: 22, maxWidth: 760, color: palette.text, fontWeight: 400,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 56 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 54 }}>{slide.title}</div>
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.surface} text={palette.text} border={`1.5px solid ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ol style={{ marginTop: 26, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 16, paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${palette.text}25`, fontSize: 26, lineHeight: 1.35, color: palette.text }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: palette.accent1, fontSize: 18, minWidth: 38 }}>[{String(i + 1).padStart(2, '0')}]</span>
              <span>{b}</span>
            </li>
          ))}
        </ol>
      </>
    );
  }
  return <><div style={headlineStyle}>{slide.title}</div>{slide.body && <div style={bodyStyle}>{slide.body}</div>}</>;
}
