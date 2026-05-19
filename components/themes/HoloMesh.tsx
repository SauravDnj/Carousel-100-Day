'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function HoloMeshSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 0,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Mesh gradient = 5 overlapping radial gradients */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 18% 22%, ${palette.accent1} 0%, transparent 45%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 82% 15%, ${palette.accent2} 0%, transparent 50%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 25% 80%, ${palette.accent3} 0%, transparent 50%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 90% 88%, ${palette.accent1} 0%, transparent 45%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${palette.accent2} 0%, transparent 35%)`, mixBlendMode: 'screen', opacity: 0.6 }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 60, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <div style={{
          background: hexToRgba(palette.text, 0.85), color: palette.bg,
          padding: '6px 18px', borderRadius: 100,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 18, fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          backdropFilter: 'blur(20px)',
        }}>◈ {dayLabel}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === index ? 30 : 8, height: 8, borderRadius: 4,
              background: i === index ? palette.text : hexToRgba(palette.text, 0.35),
              backdropFilter: 'blur(10px)',
            }} />
          ))}
        </div>
      </div>

      {/* Body card */}
      <div style={{
        position: 'absolute', top: 150, left: 60, right: 60, bottom: 140,
        padding: 50, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start',
        zIndex: 4,
      }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 26,
            padding: '8px 22px', borderRadius: 100,
            background: hexToRgba(palette.text, 0.85), color: palette.bg,
            fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>◇ {slide.sticker.replace('DAY-X', dayLabel)}</div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 60, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 20, color: palette.text, letterSpacing: '0.1em' }}>@{brand.instagram}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 14, color: palette.text, opacity: 0.65, letterSpacing: '0.1em' }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ fontSize: 36, color: palette.text, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800,
    fontSize: isCover ? 120 : 86, lineHeight: 0.98, letterSpacing: '-0.03em', color: palette.text,
    textShadow: `0 2px 30px ${hexToRgba(palette.text, 0.2)}, 0 0 60px ${hexToRgba(palette.accent1, 0.3)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 32, lineHeight: 1.45,
    marginTop: 26, maxWidth: 820, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 62 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={hexToRgba(palette.surface, 0.55)} text={palette.text}
            border={`1px solid ${hexToRgba(palette.text, 0.2)}`} />
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
              padding: '14px 22px', borderRadius: 16,
              background: hexToRgba(palette.text, 0.1),
              border: `1px solid ${hexToRgba(palette.text, 0.2)}`,
              fontSize: 28, fontWeight: 500, color: palette.text,
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: '50%', background: hexToRgba(palette.text, 0.85), color: palette.bg,
                fontWeight: 800, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</span>
              {b}
            </div>
          ))}
        </div>
      </>
    );
  }
  return <><div style={headlineStyle}>{slide.title}</div>{slide.body && <div style={bodyStyle}>{slide.body}</div>}</>;
}

function hexToRgba(hex: string, a: number) {
  const v = hex.replace('#', '');
  return `rgba(${parseInt(v.slice(0,2),16)},${parseInt(v.slice(2,4),16)},${parseInt(v.slice(4,6),16)},${a})`;
}
