'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function AuroraSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 80,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Aurora streaks - flowing ribbons of color */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.85 }} width="100%" height="100%">
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.accent1} stopOpacity="0" />
            <stop offset="35%" stopColor={palette.accent1} stopOpacity="0.6" />
            <stop offset="65%" stopColor={palette.accent2} stopOpacity="0.5" />
            <stop offset="100%" stopColor={palette.accent3} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.accent3} stopOpacity="0" />
            <stop offset="50%" stopColor={palette.accent3} stopOpacity="0.4" />
            <stop offset="100%" stopColor={palette.accent2} stopOpacity="0" />
          </linearGradient>
          <filter id="aurora-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <path d="M -100,300 Q 300,180 600,260 T 1200,200 L 1200,500 Q 800,420 500,500 T -100,540 Z" fill="url(#aurora1)" filter="url(#aurora-blur)" />
        <path d="M -100,900 Q 400,820 700,900 T 1200,860 L 1200,1100 Q 800,1020 500,1080 T -100,1140 Z" fill="url(#aurora2)" filter="url(#aurora-blur)" />
      </svg>

      {/* Star field */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="100%" height="100%">
        {Array.from({ length: 80 }).map((_, i) => {
          const x = ((i * 137) % 100);
          const y = ((i * 89) % 100);
          const r = (i % 5) * 0.3 + 0.5;
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill={palette.text} opacity={0.3 + (i % 3) * 0.2} />;
        })}
      </svg>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 60, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', zIndex: 5 }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 20, letterSpacing: '0.18em', color: palette.accent3, textTransform: 'uppercase' }}>
          ✨ {dayLabel}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === index ? 22 : 6, height: 6, borderRadius: 3,
              background: i === index ? palette.accent2 : palette.muted, opacity: i === index ? 1 : 0.5,
            }} />
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 170, left: 80, right: 80, bottom: 160, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', zIndex: 5 }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 26,
            padding: '8px 22px', borderRadius: 100,
            background: `linear-gradient(90deg, ${palette.accent1} 0%, ${palette.accent2} 100%)`,
            color: palette.bg, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            ✨ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 60, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 20, color: palette.text, letterSpacing: '0.1em' }}>@{brand.instagram}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 14, color: palette.muted, letterSpacing: '0.1em' }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ fontSize: 36, color: palette.accent2, fontWeight: 700 }}>{index < total - 1 ? '↓' : '✦'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
    fontSize: isCover ? 120 : 80, lineHeight: 1.0, letterSpacing: '-0.03em', color: palette.text,
    textShadow: `0 0 40px ${hexToRgba(palette.accent1, 0.4)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 32, lineHeight: 1.5,
    marginTop: 28, maxWidth: 820, color: palette.text, opacity: 0.92,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 64 }}>{slide.title}</div>
        <div style={{ marginTop: 28 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={hexToRgba(palette.surface, 0.6)} text={palette.text}
            border={`1px solid ${hexToRgba(palette.accent3, 0.4)}`}
            shadow={`0 10px 40px ${hexToRgba(palette.accent1, 0.25)}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {slide.bullets.map((b: string, i: number) => (
            <div key={i} style={{
              padding: '18px 24px', borderRadius: 16,
              background: hexToRgba(palette.surface, 0.4),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hexToRgba(palette.accent3, 0.3)}`,
              fontSize: 28, fontWeight: 500, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${palette.accent1}, ${palette.accent2})`,
                color: palette.bg, fontWeight: 800, fontSize: 18,
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
