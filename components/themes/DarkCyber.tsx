'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function DarkCyberSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: `radial-gradient(circle at 30% 20%, ${palette.surface} 0%, ${palette.bg} 70%)`,
      color: palette.text, padding: 70, fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Hex grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08 }}>
        <defs>
          <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 56,16 56,42 30,56 4,42 4,16" fill="none" stroke={palette.accent1} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
      {/* Circuit traces */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18 }}>
        <g stroke={palette.accent3} strokeWidth="1.5" fill="none">
          <path d="M0,1100 L200,1100 L240,1140 L400,1140 L440,1100 L600,1100" />
          <path d="M1080,200 L880,200 L840,160 L680,160 L640,200 L500,200" />
          <path d="M0,300 L120,300 L160,260 L260,260" />
          <circle cx="200" cy="1100" r="4" fill={palette.accent3} />
          <circle cx="440" cy="1100" r="4" fill={palette.accent3} />
          <circle cx="840" cy="160" r="4" fill={palette.accent3} />
          <circle cx="640" cy="200" r="4" fill={palette.accent3} />
        </g>
      </svg>
      {/* Subtle scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(180deg, ${palette.text} 0 1px, transparent 1px 4px)`,
      }} />
      {/* Glow accents - two corners */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: palette.accent1, opacity: 0.1, filter: 'blur(80px)',
        top: -100, right: -150, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: palette.accent2, opacity: 0.08, filter: 'blur(90px)',
        bottom: -150, left: -100, pointerEvents: 'none',
      }} />
      {/* HUD frame corners */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="100%" height="100%">
        <g stroke={palette.accent1} strokeWidth="2" fill="none" opacity="0.7">
          <path d="M30,30 L30,80 M30,30 L80,30" />
          <path d="M1050,30 L1050,80 M1050,30 L1000,30" />
          <path d="M30,1320 L30,1270 M30,1320 L80,1320" />
          <path d="M1050,1320 L1050,1270 M1050,1320 L1000,1320" />
        </g>
      </svg>

      {/* Top bar */}
      <div style={topBar}>
        <span style={{ ...mono, color: palette.accent1 }}>$ {dayLabel.toLowerCase().replace(' ', '-')}.exe</span>
        <span style={{ ...mono, color: palette.muted }}>{index + 1} / {total}</span>
      </div>

      {/* Terminal corner brackets */}
      <Bracket palette={palette} style={{ top: 110, left: 70 }} />
      <Bracket palette={palette} style={{ top: 110, right: 70, transform: 'scaleX(-1)' }} />
      <Bracket palette={palette} style={{ bottom: 140, left: 70, transform: 'scaleY(-1)' }} />
      <Bracket palette={palette} style={{ bottom: 140, right: 70, transform: 'scale(-1)' }} />

      {/* Body */}
      <div style={{ position: 'absolute', top: 180, left: 70, right: 70, bottom: 180, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start' }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 24,
            padding: '8px 20px', border: `2px solid ${palette.accent1}`, color: palette.accent1,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 20, letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            ▸ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom bar */}
      <div style={bottomBar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ ...mono, color: palette.accent1, fontSize: 18 }}>@{brand.instagram}</span>
          <span style={{ ...mono, color: palette.muted, fontSize: 14 }}>github.com/{brand.github} :: linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ color: palette.accent1, fontFamily: '"JetBrains Mono", monospace', fontSize: 32, letterSpacing: '0.2em' }}>
          {index < total - 1 ? '>>>' : 'END_'}
        </span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: isCover ? 110 : 78,
    lineHeight: 1.0,
    letterSpacing: '-0.03em',
    color: palette.text,
    textShadow: `0 0 30px ${palette.accent1}40`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 28, lineHeight: 1.5, marginTop: 32, maxWidth: 820, color: palette.muted,
  };

  if (slide.kind === 'diagram') {
    return (
      <DiagramSlideBody
        slide={slide}
        palette={palette}
        font='"Space Grotesk", sans-serif'
        titleStyle={{ ...headlineStyle, fontSize: 64, color: palette.accent1 }}
      />
    );
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 64, color: palette.accent1 }}>{slide.title}</div>
        <div style={{ marginTop: 32 }}>
          <CodeBlock
            code={slide.code || ''}
            lang={slide.codeLang || 'python'}
            theme="dark"
            background={palette.surface}
            text={palette.text}
            border={`1px solid ${palette.accent1}40`}
            shadow={`0 0 40px ${palette.accent1}20`}
          />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ul style={{ marginTop: 36, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 22 }}>
              <span style={{ color: palette.accent1, fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 28, marginTop: 4 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 32, lineHeight: 1.3, color: palette.text }}>{b}</span>
            </li>
          ))}
        </ul>
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

const topBar: React.CSSProperties = { position: 'absolute', top: 60, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 };
const bottomBar: React.CSSProperties = { position: 'absolute', bottom: 60, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 };
const mono: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 22, letterSpacing: '0.08em' };

function Bracket({ palette, style }: { palette: any; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', width: 40, height: 40, borderTop: `3px solid ${palette.accent1}`, borderLeft: `3px solid ${palette.accent1}`, ...style }} />
  );
}
