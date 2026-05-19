'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function GlassSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: `linear-gradient(135deg, ${palette.bg} 0%, ${palette.accent2} 50%, ${palette.accent1} 100%)`,
      color: palette.text, padding: 0, fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Floating shapes behind glass */}
      <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: palette.accent3, opacity: 0.7, top: -80, left: -80, filter: 'blur(2px)' }} />
      <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', background: palette.accent1, opacity: 0.65, bottom: -120, right: -120 }} />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: palette.surface, opacity: 0.45, top: '40%', left: '55%' }} />
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: palette.accent2, opacity: 0.6, top: '60%', left: '10%' }} />

      {/* Frosted glass card */}
      <div style={{
        position: 'absolute', top: 60, left: 60, right: 60, bottom: 60,
        background: hexToRgba(palette.surface, 0.18),
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: `1.5px solid ${hexToRgba(palette.surface, 0.5)}`,
        borderRadius: 32, padding: 64,
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 30px 80px ${hexToRgba(palette.text, 0.3)}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 18, fontWeight: 500,
            letterSpacing: '0.15em', color: palette.text, opacity: 0.7, textTransform: 'uppercase',
          }}>· {dayLabel}</span>
          <Dots index={index} total={total} palette={palette} />
        </div>

        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginTop: 36,
            background: hexToRgba(palette.surface, 0.4), backdropFilter: 'blur(10px)',
            padding: '10px 24px', borderRadius: 100, fontSize: 18, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: palette.text,
            border: `1px solid ${hexToRgba(palette.surface, 0.6)}`,
          }}>
            ◆ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', marginTop: isCover ? 0 : 32 }}>
          {renderBody(slide, palette, isCover)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 18, color: palette.text, opacity: 0.85, letterSpacing: '0.12em', textTransform: 'uppercase' }}>@{brand.instagram}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: palette.text, opacity: 0.6, letterSpacing: '0.1em' }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{ fontSize: 42, color: palette.text, opacity: 0.85, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>
        </div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800,
    fontSize: isCover ? 110 : 78, lineHeight: 1.0, letterSpacing: '-0.03em',
    color: palette.text, textShadow: `0 2px 20px ${hexToRgba(palette.text, 0.15)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 30, lineHeight: 1.45,
    marginTop: 24, maxWidth: 800, color: palette.text, opacity: 0.92,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 24 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={hexToRgba(palette.surface, 0.5)} text={palette.text} border={`1px solid ${hexToRgba(palette.text, 0.2)}`} />
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
              background: hexToRgba(palette.surface, 0.35),
              backdropFilter: 'blur(20px)', border: `1px solid ${hexToRgba(palette.surface, 0.5)}`,
              fontSize: 28, fontWeight: 500, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: '50%', background: palette.accent1,
                color: palette.surface, fontWeight: 800, fontSize: 18,
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

function Dots({ index, total, palette }: { index: number; total: number; palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === index ? 28 : 8, height: 8, borderRadius: 4,
          background: i === index ? palette.text : hexToRgba(palette.text, 0.3),
          transition: 'all .3s',
        }} />
      ))}
    </div>
  );
}

function hexToRgba(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
