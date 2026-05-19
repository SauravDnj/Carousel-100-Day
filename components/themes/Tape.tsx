'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function TapeSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 50,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* VHS tape body - outer label */}
      <div style={{
        position: 'absolute', top: 70, left: 60, right: 60, bottom: 70,
        background: palette.surface, border: `5px solid ${palette.text}`,
        borderRadius: 12, padding: 40, display: 'flex', flexDirection: 'column',
        boxShadow: `10px 10px 0 ${palette.text}, 14px 14px 30px rgba(0,0,0,0.25)`,
      }}>
        {/* Color strip across the top - like a real VHS label */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(90deg, ${palette.accent1} 0%, ${palette.accent1} 33%, ${palette.accent2} 33%, ${palette.accent2} 66%, ${palette.accent3} 66%)`,
          borderBottom: `4px solid ${palette.text}`,
        }} />
        {/* Top label content */}
        <div style={{ position: 'absolute', top: 18, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: palette.text }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: 22, letterSpacing: '0.15em', background: palette.bg, padding: '4px 12px', border: `2.5px solid ${palette.text}` }}>
            CAROUSEL · {dayLabel}
          </span>
          <span style={{ background: palette.bg, color: palette.text, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 22, padding: '4px 12px', border: `2.5px solid ${palette.text}` }}>
            ◉ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Tape reels (decorative) */}
        <svg style={{ position: 'absolute', bottom: 30, right: 50, width: 130, height: 130, opacity: 0.7 }} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke={palette.text} strokeWidth="4" />
          <circle cx="50" cy="50" r="14" fill={palette.text} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={50 + Math.cos(a) * 15} y1={50 + Math.sin(a) * 15} x2={50 + Math.cos(a) * 36} y2={50 + Math.sin(a) * 36} stroke={palette.text} strokeWidth="3" />;
          })}
        </svg>

        {/* Sticker */}
        {slide.sticker && (
          <div style={{
            position: 'absolute', top: 110, left: 40,
            background: palette.accent3, color: palette.text,
            padding: '8px 18px', border: `3px solid ${palette.text}`,
            fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 22,
            transform: 'rotate(-3deg)', boxShadow: `4px 4px 0 ${palette.text}`,
          }}>★ {slide.sticker.replace('DAY-X', dayLabel)}</div>
        )}

        {/* Body */}
        <div style={{ flex: 1, marginTop: 130, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', position: 'relative', zIndex: 2 }}>
          {renderBody(slide, palette, isCover)}
        </div>

        {/* Bottom info strip */}
        <div style={{ position: 'absolute', bottom: 18, left: 28, right: 28, paddingTop: 12, borderTop: `3px dashed ${palette.text}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, color: palette.text, letterSpacing: '0.1em' }}>@{brand.instagram.toUpperCase()}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 13, color: palette.text, opacity: 0.7, letterSpacing: '0.1em' }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 22, color: palette.accent1, letterSpacing: '0.1em' }}>
            {index < total - 1 ? '▶▶ FFWD' : '■ STOP'}
          </span>
        </div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900,
    fontSize: isCover ? 100 : 72, lineHeight: 1.0, letterSpacing: '-0.02em',
    color: palette.text, textTransform: 'uppercase',
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 28, lineHeight: 1.45,
    marginTop: 20, maxWidth: 700, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 58 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 56 }}>{slide.title}</div>
        <div style={{ marginTop: 18 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.bg} text={palette.text} border={`3px solid ${palette.text}`} shadow={`4px 4px 0 ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 700 }}>
          {slide.bullets.map((b: string, i: number) => (
            <div key={i} style={{
              padding: '10px 18px', background: palette.bg, border: `3px solid ${palette.text}`,
              fontSize: 24, fontWeight: 700, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: `3px 3px 0 ${palette.text}`,
            }}>
              <span style={{
                background: palette.text, color: palette.bg, padding: '2px 8px',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 900,
              }}>{String(i + 1).padStart(2, '0')}</span>
              {b}
            </div>
          ))}
        </div>
      </>
    );
  }
  return <><div style={headlineStyle}>{slide.title}</div>{slide.body && <div style={bodyStyle}>{slide.body}</div>}</>;
}
