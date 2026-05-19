'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function GlassDarkSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: `radial-gradient(ellipse at 20% 10%, ${palette.accent1}40 0%, transparent 50%), radial-gradient(ellipse at 90% 90%, ${palette.accent2}30 0%, transparent 50%), ${palette.bg}`,
      color: palette.text, padding: 0, fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Floating blurred orbs */}
      <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', background: palette.accent1, filter: 'blur(110px)', opacity: 0.45, top: -80, left: -100 }} />
      <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: palette.accent3, filter: 'blur(140px)', opacity: 0.35, bottom: -120, right: -120 }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: palette.accent2, filter: 'blur(90px)', opacity: 0.4, top: '45%', right: '15%' }} />

      {/* Outer frosted card */}
      <div style={{
        position: 'absolute', top: 60, left: 60, right: 60, bottom: 60,
        background: hexToRgba(palette.surface, 0.4),
        backdropFilter: 'blur(40px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.3)',
        border: `1px solid ${hexToRgba(palette.text, 0.12)}`,
        borderRadius: 28, padding: 56,
        display: 'flex', flexDirection: 'column',
        boxShadow: `inset 0 1px 0 ${hexToRgba(palette.text, 0.1)}, 0 30px 80px rgba(0,0,0,0.45)`,
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: hexToRgba(palette.text, 0.06), padding: '6px 16px',
            borderRadius: 100, border: `1px solid ${hexToRgba(palette.text, 0.12)}`,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.accent1, boxShadow: `0 0 12px ${palette.accent1}` }} />
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 16, letterSpacing: '0.12em', color: palette.text, textTransform: 'uppercase' }}>
              {dayLabel} · LIVE
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: i === index ? 22 : 6, height: 6, borderRadius: 3,
                background: i === index ? palette.text : hexToRgba(palette.text, 0.25),
              }} />
            ))}
          </div>
        </div>

        {/* Sticker */}
        {slide.sticker && (
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start', marginTop: 30,
            padding: '6px 16px', borderRadius: 100,
            background: `linear-gradient(135deg, ${hexToRgba(palette.accent1, 0.25)}, ${hexToRgba(palette.accent2, 0.25)})`,
            border: `1px solid ${hexToRgba(palette.text, 0.18)}`,
            color: palette.text, fontWeight: 600, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase',
            backdropFilter: 'blur(20px)',
          }}>◆ {slide.sticker.replace('DAY-X', dayLabel)}</div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', marginTop: isCover ? 0 : 26 }}>
          {renderBody(slide, palette, isCover)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 24, borderTop: `1px solid ${hexToRgba(palette.text, 0.12)}` }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 18, color: palette.text, opacity: 0.9, letterSpacing: '0.1em' }}>@{brand.instagram}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 13, color: palette.text, opacity: 0.55, letterSpacing: '0.1em' }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{ fontSize: 32, color: palette.accent1, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>
        </div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
    fontSize: isCover ? 110 : 78, lineHeight: 1.0, letterSpacing: '-0.03em',
    color: palette.text, textShadow: `0 2px 30px ${hexToRgba(palette.accent1, 0.4)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 30, lineHeight: 1.45,
    marginTop: 26, maxWidth: 800, color: palette.text, opacity: 0.92, fontWeight: 400,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 60 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 56 }}>{slide.title}</div>
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={hexToRgba(palette.surface, 0.55)} text={palette.text}
            border={`1px solid ${hexToRgba(palette.text, 0.15)}`} />
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
              padding: '14px 22px', borderRadius: 14,
              background: hexToRgba(palette.text, 0.05),
              border: `1px solid ${hexToRgba(palette.text, 0.12)}`,
              fontSize: 26, fontWeight: 500, color: palette.text, lineHeight: 1.35,
              display: 'flex', alignItems: 'center', gap: 14,
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `linear-gradient(135deg, ${palette.accent1}, ${palette.accent2})`,
                color: palette.bg, fontWeight: 800, fontSize: 14,
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
