'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function ComicSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 60,
      fontFamily: '"Fredoka", sans-serif', overflow: 'hidden',
    }}>
      {/* Halftone radial dots */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18 }} width="100%" height="100%">
        <defs>
          <pattern id="comic-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="3.5" fill={palette.text} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#comic-dots)" />
      </svg>

      {/* Big POW burst behind cover */}
      {isCover && (
        <svg style={{ position: 'absolute', top: 80, right: -100, width: 600, height: 600 }} viewBox="0 0 200 200">
          <polygon
            points="100,10 120,70 180,50 145,100 200,130 130,135 145,195 95,150 50,195 60,135 0,140 50,100 10,55 70,75"
            fill={palette.accent1} stroke={palette.text} strokeWidth="3"
            transform="rotate(8 100 100)"
          />
        </svg>
      )}

      {/* Panel border */}
      <div style={{
        position: 'absolute', top: 60, left: 60, right: 60, bottom: 60,
        border: `6px solid ${palette.text}`, borderRadius: 18,
        background: palette.surface, padding: 50,
        display: 'flex', flexDirection: 'column',
        boxShadow: `12px 12px 0 ${palette.text}`,
      }}>
        {/* Top panel header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 14, borderBottom: `4px solid ${palette.text}`,
        }}>
          <div style={{
            background: palette.accent1, color: palette.text, padding: '6px 18px',
            border: `3px solid ${palette.text}`,
            fontFamily: '"Fredoka", sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em',
            transform: 'rotate(-2deg)',
          }}>
            ★ {dayLabel}
          </div>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 26, color: palette.text }}>
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Speech bubble for sticker */}
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginTop: 28,
            background: palette.accent2, color: palette.text,
            border: `4px solid ${palette.text}`, borderRadius: 60,
            padding: '12px 26px', fontWeight: 800, fontSize: 24,
            transform: 'rotate(-2deg)', position: 'relative',
            boxShadow: `5px 5px 0 ${palette.text}`,
          }}>
            ⚡ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', marginTop: 28 }}>
          {renderBody(slide, palette, isCover)}
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 14, borderTop: `4px solid ${palette.text}`,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, fontSize: 22, color: palette.text }}>@{brand.instagram}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 13, color: palette.text, opacity: 0.7, marginTop: 2 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{
            background: palette.accent3, color: palette.text, padding: '6px 18px',
            border: `3px solid ${palette.text}`,
            fontFamily: '"Fredoka", sans-serif', fontWeight: 900, fontSize: 26,
          }}>{index < total - 1 ? 'WHAM →' : '★ FIN ★'}</span>
        </div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Fredoka", sans-serif', fontWeight: 700,
    fontSize: isCover ? 120 : 84, lineHeight: 1.0, letterSpacing: '-0.02em', color: palette.text,
    WebkitTextStroke: `2px ${palette.text}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Fredoka", sans-serif', fontSize: 30, lineHeight: 1.45,
    marginTop: 24, maxWidth: 820, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Fredoka", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 20 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background="#FFFFFF" text={palette.text} border={`4px solid ${palette.text}`} shadow={`6px 6px 0 ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {slide.bullets.map((b: string, i: number) => (
            <div key={i} style={{
              padding: '14px 22px', border: `4px solid ${palette.text}`, borderRadius: 14,
              background: [palette.accent1, palette.accent2, palette.accent3, palette.surface][i % 4],
              fontSize: 28, fontWeight: 700, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: `4px 4px 0 ${palette.text}`,
            }}>
              <span style={{
                background: palette.text, color: palette.bg, padding: '4px 12px', borderRadius: 6,
                fontWeight: 900, fontSize: 20, fontFamily: '"Space Grotesk", sans-serif',
              }}>{String(i + 1).padStart(2, '0')}</span>
              {b}
            </div>
          ))}
        </div>
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
