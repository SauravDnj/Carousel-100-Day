'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function MinimalSwissSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 90,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Top bar: thick rule */}
      <div style={{ position: 'absolute', top: 60, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ ...mono, color: palette.text }}>{dayLabel}</span>
        <span style={{ ...mono, color: palette.muted }}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      <div style={{ position: 'absolute', top: 100, left: 90, right: 90, height: 4, background: palette.text }} />

      {/* Body */}
      <div style={{ position: 'absolute', top: 160, left: 90, right: 90, bottom: 180, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start' }}>
        {slide.sticker && (
          <div style={{ ...mono, fontSize: 20, color: palette.accent2, marginBottom: 20 }}>
            — {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Big accent number */}
      {!isCover && (
        <div style={{
          position: 'absolute', right: -30, bottom: 130, fontSize: 360, fontWeight: 900,
          color: palette.accent2, opacity: 0.12, fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1,
        }}>{String(index + 1).padStart(2, '0')}</div>
      )}

      {/* Bottom rule + handle */}
      <div style={{ position: 'absolute', bottom: 100, left: 90, right: 90, height: 4, background: palette.text }} />
      <div style={{ position: 'absolute', bottom: 60, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ ...mono, color: palette.text }}>@{brand.instagram}</span>
          <span style={{ ...mono, color: palette.muted, fontSize: 16 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ ...mono, color: palette.text }}>→ swipe</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: isCover ? 130 : 88,
    lineHeight: 0.95,
    letterSpacing: '-0.04em',
    color: palette.text,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 32, lineHeight: 1.4, marginTop: 30, maxWidth: 820, color: palette.text,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 64 }}>{slide.title}</div>
        <div style={{ marginTop: 30 }}>
          <CodeBlock
            code={slide.code || ''}
            lang={slide.codeLang || 'python'}
            theme="light"
            background={palette.surface}
            text={palette.text}
            border={`1px solid ${palette.text}`}
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
            <li key={i} style={{ display: 'flex', gap: 24, paddingBottom: 18, marginBottom: 18, borderBottom: `1px solid ${palette.text}30` }}>
              <span style={{ ...mono, color: palette.accent2, fontWeight: 700, fontSize: 22, marginTop: 12 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 36, lineHeight: 1.2, fontWeight: 500 }}>{b}</span>
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

const mono: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase' };
