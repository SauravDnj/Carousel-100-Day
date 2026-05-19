'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function CyberGlitchSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 70,
      fontFamily: '"JetBrains Mono", monospace', overflow: 'hidden',
    }}>
      {/* Heavy scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 2px, ${palette.text} 2px 3px)`,
      }} />
      {/* Glitch noise bars */}
      <div style={{
        position: 'absolute', top: '15%', left: 0, right: 0, height: 24,
        background: `linear-gradient(90deg, transparent, ${palette.accent1} 20%, ${palette.accent2} 50%, ${palette.accent1} 80%, transparent)`,
        opacity: 0.3, mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'absolute', top: '52%', left: 0, right: 0, height: 14,
        background: `linear-gradient(90deg, transparent, ${palette.accent2} 30%, transparent 60%)`,
        opacity: 0.25, mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'absolute', top: '78%', left: 0, right: 0, height: 8,
        background: `linear-gradient(90deg, transparent, ${palette.accent1} 50%, transparent)`,
        opacity: 0.4, mixBlendMode: 'screen',
      }} />

      {/* CRT glow vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: `inset 0 0 200px ${palette.bg}, inset 0 0 80px ${hexToRgba(palette.accent1, 0.15)}`,
      }} />

      {/* Top */}
      <div style={{ position: 'absolute', top: 56, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', zIndex: 5 }}>
        <span style={{ color: palette.accent1, fontWeight: 700, fontSize: 20, letterSpacing: '0.15em' }}>
          &gt;&gt; {dayLabel.toLowerCase().replace(' ', '_')}
        </span>
        <span style={{ color: palette.accent2, fontSize: 18, letterSpacing: '0.12em' }}>{String(index + 1).padStart(2, '0')}::{String(total).padStart(2, '0')}</span>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 170, left: 70, right: 70, bottom: 150, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', zIndex: 5 }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 22,
            padding: '4px 14px', border: `2px solid ${palette.accent2}`, color: palette.accent2,
            fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>// {slide.sticker.replace('DAY-X', dayLabel)}</div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 60, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: palette.accent2, fontSize: 18, letterSpacing: '0.12em', fontWeight: 700 }}>@{brand.instagram}</span>
          <span style={{ color: palette.muted, fontSize: 14, letterSpacing: '0.1em' }}>github.com/{brand.github} :: linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ color: palette.accent1, fontSize: 24, letterSpacing: '0.2em', fontWeight: 700 }}>{index < total - 1 ? '>>>' : '[END]'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  // Use RGB-offset trick via text-shadow with palette.accent1 and palette.accent3
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900,
    fontSize: isCover ? 110 : 78, lineHeight: 1.0, letterSpacing: '-0.02em', color: palette.text,
    textShadow: `-3px 0 0 ${palette.accent1}, 3px 0 0 ${palette.accent3}, 0 0 25px ${hexToRgba(palette.accent1, 0.4)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace', fontSize: 24, lineHeight: 1.6,
    marginTop: 26, maxWidth: 820, color: palette.text, opacity: 0.92,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 60 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 58 }}>{slide.title}</div>
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={palette.surface} text={palette.text}
            border={`1px solid ${palette.accent1}`} shadow={`0 0 30px ${hexToRgba(palette.accent1, 0.4)}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ul style={{ marginTop: 26, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14, fontSize: 24, lineHeight: 1.45, color: palette.text, fontFamily: '"JetBrains Mono", monospace' }}>
              <span style={{ color: palette.accent1, fontWeight: 700 }}>[{String(i + 1).padStart(2, '0')}]</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return <><div style={headlineStyle}>{slide.title}</div>{slide.body && <div style={bodyStyle}>{slide.body}</div>}</>;
}

function hexToRgba(hex: string, a: number) {
  const v = hex.replace('#', '');
  return `rgba(${parseInt(v.slice(0,2),16)},${parseInt(v.slice(2,4),16)},${parseInt(v.slice(4,6),16)},${a})`;
}
