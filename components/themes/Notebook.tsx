'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function NotebookSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  // Ruled lines every 50px, red margin at left 130px
  const ruled = `repeating-linear-gradient(180deg, transparent 0 49px, ${withAlpha(palette.accent2, 0.18)} 49px 50px)`;

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, overflow: 'hidden',
      fontFamily: '"Caveat", cursive',
    }}>
      {/* Ruled paper */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: ruled, pointerEvents: 'none' }} />
      {/* Red margin line */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 130, width: 2, background: withAlpha(palette.accent1, 0.6) }} />
      {/* Three-hole punches */}
      {[200, 670, 1140].map(y => (
        <div key={y} style={{ position: 'absolute', left: 40, top: y, width: 30, height: 30, borderRadius: '50%', background: palette.surface, boxShadow: `inset 2px 2px 4px ${palette.text}30` }} />
      ))}

      {/* Top */}
      <div style={{ position: 'absolute', top: 50, left: 170, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: '"Caveat", cursive', fontSize: 36, color: palette.accent1 }}>✎ {dayLabel}</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 22, color: palette.muted }}>p. {index + 1} / {total}</span>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 150, left: 170, right: 70, bottom: 160, display: 'flex', flexDirection: 'column' }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 20,
            background: '#FFF59D', color: palette.text, padding: '8px 22px',
            fontFamily: '"Caveat", cursive', fontSize: 32, fontWeight: 700,
            transform: 'rotate(-2deg)', boxShadow: `3px 3px 0 ${palette.text}30`,
          }}>
            ★ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 50, left: 170, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"Caveat", cursive', fontSize: 32, color: palette.text, lineHeight: 1.1 }}>— @{brand.instagram}</span>
          <span style={{ fontFamily: '"Caveat", cursive', fontSize: 22, color: palette.muted, lineHeight: 1.1 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ fontFamily: '"Caveat", cursive', fontSize: 44, color: palette.accent1, fontWeight: 700 }}>
          {index < total - 1 ? 'turn →' : 'the end ♥'}
        </span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Caveat", cursive', fontWeight: 700,
    fontSize: isCover ? 140 : 100, lineHeight: 1.0, color: palette.text,
  };
  const underline = <div style={{ height: 4, background: palette.accent1, marginTop: 6, marginBottom: 16, width: '60%' }} />;
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Caveat", cursive', fontSize: 42, lineHeight: 1.3, maxWidth: 820, color: palette.text, marginTop: 16,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Caveat", cursive' titleStyle={headlineStyle} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        {underline}
        <div style={{ marginTop: 16, transform: 'rotate(-0.5deg)' }}>
          <CodeBlock
            code={slide.code || ''}
            lang={slide.codeLang || 'python'}
            theme="light"
            background={palette.surface}
            text={palette.text}
            border={`2px dashed ${palette.text}`}
          />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        {underline}
        <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 10, fontFamily: '"Caveat", cursive', fontSize: 40, lineHeight: 1.25 }}>
              <span style={{ color: palette.accent1, fontWeight: 700, fontSize: 44 }}>{['→','✓','★','◆','✦','•','∙','◊'][i % 8]}</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <div style={headlineStyle}>{slide.title}</div>
      {underline}
      {slide.body && <div style={bodyStyle}>{slide.body}</div>}
    </>
  );
}

function withAlpha(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
