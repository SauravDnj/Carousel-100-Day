'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function Y2KSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.accent2} 60%, ${palette.bg} 100%)`,
      color: palette.text, padding: 70, fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Chrome blob shapes */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="100%" height="100%">
        <defs>
          <linearGradient id="chrome1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.accent1} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor={palette.accent3} />
          </linearGradient>
          <linearGradient id="chrome2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.accent2} />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor={palette.accent1} />
          </linearGradient>
        </defs>
        <path d="M 0,200 Q 200,80 380,180 Q 580,290 750,160 Q 920,30 1080,140 L 1080,0 L 0,0 Z" fill="url(#chrome1)" opacity="0.6" />
        <path d="M 0,1150 Q 220,1280 420,1180 Q 620,1080 820,1200 Q 1000,1320 1080,1240 L 1080,1350 L 0,1350 Z" fill="url(#chrome2)" opacity="0.6" />
      </svg>

      {/* Sparkles */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="100%" height="100%">
        {[
          [80, 240], [950, 380], [180, 940], [880, 1080], [550, 760],
          [340, 420], [780, 220], [620, 1000],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${i * 20})`}>
            <path d="M 0,-14 L 3,-3 L 14,0 L 3,3 L 0,14 L -3,3 L -14,0 L -3,-3 Z" fill={palette.text} opacity={0.5} />
          </g>
        ))}
      </svg>

      {/* Cover blob centerpiece */}
      {isCover && (
        <svg style={{ position: 'absolute', top: 280, left: '50%', transform: 'translateX(-50%)', width: 480, height: 480, pointerEvents: 'none', opacity: 0.4 }} viewBox="0 0 200 200">
          <ellipse cx="100" cy="100" rx="90" ry="60" fill="url(#chrome1)" />
        </svg>
      )}

      {/* Top */}
      <div style={{ position: 'absolute', top: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 20,
          color: palette.bg, background: `linear-gradient(90deg, ${palette.accent1}, ${palette.accent2})`,
          padding: '6px 18px', borderRadius: 100, letterSpacing: '0.15em', textTransform: 'uppercase',
          boxShadow: `0 0 20px ${palette.accent1}80`,
        }}>★ {dayLabel} ★</span>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 22, color: palette.text }}>
          ▸ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 180, left: 70, right: 70, bottom: 160, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', zIndex: 5 }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 24,
            background: `linear-gradient(135deg, ${palette.accent1}, ${palette.accent3})`,
            color: palette.bg, padding: '8px 22px', borderRadius: 100,
            fontWeight: 800, fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: `0 8px 24px ${palette.accent1}60, inset 0 1px 0 #FFFFFF80`,
          }}>
            ⟡ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 20, color: palette.text }}>@{brand.instagram}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 14, color: palette.muted, marginTop: 2 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{
          background: `linear-gradient(135deg, ${palette.accent2}, ${palette.accent1})`,
          color: palette.bg, padding: '6px 20px', borderRadius: 100,
          fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 24,
          boxShadow: `0 6px 18px ${palette.accent1}50, inset 0 1px 0 #FFFFFF80`,
        }}>{index < total - 1 ? 'NEXT ▸' : '∞ END'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800,
    fontSize: isCover ? 120 : 84, lineHeight: 1.0, letterSpacing: '-0.03em',
    background: `linear-gradient(180deg, ${palette.text} 0%, ${palette.accent1} 100%)`,
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    color: palette.text, // fallback
    textShadow: `0 2px 30px ${palette.accent1}40`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 30, lineHeight: 1.45,
    marginTop: 24, maxWidth: 820, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 60 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 20 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.surface} text={palette.text}
            border={`2px solid ${palette.accent1}`} shadow={`0 12px 30px ${palette.accent1}30`} />
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
              padding: '14px 22px', borderRadius: 100,
              background: `linear-gradient(135deg, ${palette.surface}, ${palette.bg})`,
              border: `2px solid ${palette.accent1}40`,
              fontSize: 26, fontWeight: 600, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: `0 6px 16px ${palette.accent1}25, inset 0 1px 0 #FFFFFF80`,
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${palette.accent1}, ${palette.accent3})`,
                color: palette.bg, fontWeight: 800, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: `inset 0 1px 0 #FFFFFF80, 0 4px 12px ${palette.accent1}60`,
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
