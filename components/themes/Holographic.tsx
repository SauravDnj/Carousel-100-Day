'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function HolographicSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: `conic-gradient(from 180deg at 50% 50%, ${palette.accent1}, ${palette.accent2}, ${palette.accent3}, ${palette.accent1})`,
      color: palette.text, padding: 0, fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Iridescent mesh layers */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 20% 30%, ${palette.accent2} 0%, transparent 50%)`, opacity: 0.7 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 70%, ${palette.accent3} 0%, transparent 50%)`, opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${palette.accent1} 0%, transparent 60%)`, opacity: 0.5 }} />
      {/* Chromatic rings */}
      <svg style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.4 }} width="100%" height="100%">
        <defs>
          <radialGradient id="holo-ring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.text} stopOpacity="0" />
            <stop offset="50%" stopColor={palette.text} stopOpacity="0.3" />
            <stop offset="100%" stopColor={palette.text} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="280" fill="none" stroke="url(#holo-ring)" strokeWidth="2" />
        <circle cx="50%" cy="50%" r="440" fill="none" stroke="url(#holo-ring)" strokeWidth="2" />
        <circle cx="50%" cy="50%" r="600" fill="none" stroke="url(#holo-ring)" strokeWidth="2" />
      </svg>

      {/* Card */}
      <div style={{
        position: 'absolute', top: 70, left: 70, right: 70, bottom: 70,
        background: hexToRgba(palette.surface, 0.15), backdropFilter: 'blur(50px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(50px) saturate(1.5)',
        border: `1.5px solid ${hexToRgba(palette.text, 0.25)}`, borderRadius: 40,
        padding: 60, display: 'flex', flexDirection: 'column',
        boxShadow: `inset 0 1px 0 ${hexToRgba(palette.text, 0.3)}, 0 30px 80px ${hexToRgba('#000000', 0.3)}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 20,
            letterSpacing: '0.2em', color: palette.text, textTransform: 'uppercase',
            background: hexToRgba(palette.text, 0.1), padding: '6px 14px', borderRadius: 100,
            border: `1px solid ${hexToRgba(palette.text, 0.2)}`,
          }}>◈ {dayLabel}</span>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 28, color: palette.text }}>
            {String(index + 1).padStart(2, '0')}<span style={{ opacity: 0.5 }}>/{String(total).padStart(2, '0')}</span>
          </span>
        </div>

        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginTop: 32,
            padding: '10px 24px', borderRadius: 100,
            background: `linear-gradient(135deg, ${palette.accent1}, ${palette.accent2}, ${palette.accent3})`,
            color: palette.bg, fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: `0 8px 24px ${hexToRgba(palette.accent1, 0.4)}`,
          }}>
            ✦ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', marginTop: isCover ? 0 : 28 }}>
          {renderBody(slide, palette, isCover)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 20, color: palette.text, opacity: 0.9 }}>@{brand.instagram}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 14, color: palette.text, opacity: 0.65 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{ fontSize: 42, color: palette.text, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>
        </div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800,
    fontSize: isCover ? 110 : 80, lineHeight: 1.0, letterSpacing: '-0.03em', color: palette.text,
    textShadow: `0 2px 30px ${hexToRgba(palette.accent1, 0.45)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 30, lineHeight: 1.45,
    marginTop: 24, maxWidth: 800, color: palette.text, opacity: 0.92,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 60 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 24 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={hexToRgba(palette.surface, 0.4)} text={palette.text}
            border={`1px solid ${hexToRgba(palette.text, 0.25)}`} />
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
              padding: '16px 22px', borderRadius: 16,
              background: hexToRgba(palette.text, 0.08),
              border: `1px solid ${hexToRgba(palette.text, 0.18)}`,
              fontSize: 28, fontWeight: 500, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 14,
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${palette.accent1}, ${palette.accent3})`,
                color: palette.bg, fontWeight: 800, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</span>
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

function hexToRgba(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
