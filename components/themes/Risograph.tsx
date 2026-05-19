'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function RisographSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 80,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Two-color offset blobs (mimicking riso ink misregistration) */}
      <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', background: palette.accent1, top: -120, right: -100, mixBlendMode: 'multiply', opacity: 0.85 }} />
      <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', background: palette.accent2, top: -100, right: -80, mixBlendMode: 'multiply', opacity: 0.85 }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: palette.accent3, bottom: -80, left: -80, mixBlendMode: 'multiply', opacity: 0.7 }} />

      {/* Halftone dot texture overlay */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.15 }} width="100%" height="100%">
        <defs>
          <pattern id="halftone" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="2" fill={palette.text} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#halftone)" />
      </svg>

      {/* Paper noise via small inline dots */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08 }} width="100%" height="100%">
        {Array.from({ length: 220 }).map((_, i) => (
          <circle key={i} cx={`${(i * 97) % 100}%`} cy={`${(i * 53) % 100}%`} r={1} fill={palette.text} />
        ))}
      </svg>

      {/* Top tag */}
      <div style={{ position: 'absolute', top: 70, left: 80, display: 'flex', gap: 12, alignItems: 'center', zIndex: 5 }}>
        <span style={{ background: palette.text, color: palette.bg, padding: '6px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 18, fontWeight: 700, letterSpacing: '0.2em' }}>RISO</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, color: palette.text, letterSpacing: '0.15em' }}>// {dayLabel}</span>
      </div>
      <div style={{ position: 'absolute', top: 76, right: 80, fontFamily: '"JetBrains Mono", monospace', fontSize: 18, fontWeight: 600, color: palette.text, zIndex: 5 }}>
        ⬩ {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 160, left: 80, right: 80, bottom: 150, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', zIndex: 5 }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 24,
            background: palette.accent3, color: palette.text, padding: '8px 20px',
            fontWeight: 800, fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase',
            mixBlendMode: 'multiply', border: `2.5px solid ${palette.text}`, transform: 'rotate(-2deg)',
          }}>
            ▲ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 70, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, color: palette.text, letterSpacing: '0.1em' }}>@{brand.instagram.toUpperCase()}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 14, color: palette.muted, letterSpacing: '0.08em', marginTop: 2 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{
          background: palette.accent1, color: palette.bg, padding: '6px 18px',
          fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: 22, letterSpacing: '0.2em',
        }}>{index < total - 1 ? 'NEXT →' : 'END.'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900,
    fontSize: isCover ? 130 : 90, lineHeight: 0.95, letterSpacing: '-0.04em', color: palette.text,
    textTransform: 'uppercase',
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 30, lineHeight: 1.45,
    marginTop: 24, maxWidth: 820, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 20 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.surface} text={palette.text} border={`3px solid ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slide.bullets.map((b: string, i: number) => (
            <div key={i} style={{
              padding: '14px 22px', border: `3px solid ${palette.text}`,
              background: i % 2 === 0 ? palette.accent3 : palette.bg,
              fontSize: 26, fontWeight: 700, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 14, mixBlendMode: 'normal',
            }}>
              <span style={{
                background: palette.text, color: palette.bg, padding: '2px 10px',
                fontWeight: 900, fontSize: 18, fontFamily: '"JetBrains Mono", monospace',
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
