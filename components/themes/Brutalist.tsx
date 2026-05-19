'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function BrutalistSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 60,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Big block decoration */}
      <div style={{ position: 'absolute', width: 220, height: 220, background: palette.accent1, top: -40, right: -40, transform: 'rotate(15deg)' }} />
      <div style={{ position: 'absolute', width: 160, height: 160, background: palette.accent2, bottom: -30, left: -30, transform: 'rotate(-12deg)' }} />

      {/* Thick black border frame */}
      <div style={{
        position: 'absolute', top: 60, left: 60, right: 60, bottom: 60,
        border: `8px solid ${palette.text}`, padding: 50,
        background: palette.surface, display: 'flex', flexDirection: 'column',
        boxShadow: `16px 16px 0 ${palette.accent1}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: `4px solid ${palette.text}` }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: 22,
            letterSpacing: '0.05em', textTransform: 'uppercase', color: palette.text,
            background: palette.accent3, padding: '6px 14px',
          }}>// {dayLabel}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 22, color: palette.text }}>
            {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </div>

        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginTop: 24,
            background: palette.text, color: palette.bg, padding: '10px 20px',
            fontWeight: 900, fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase',
            transform: 'rotate(-2deg)',
          }}>
            ★ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', marginTop: 24 }}>
          {renderBody(slide, palette, isCover)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: `4px solid ${palette.text}` }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 20, color: palette.text }}>@{brand.instagram.toUpperCase()}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: 14, color: palette.muted, marginTop: 2 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{
            fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 32,
            background: palette.accent1, color: palette.text, padding: '6px 18px',
          }}>{index < total - 1 ? '→ NEXT' : '∎ END'}</span>
        </div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900,
    fontSize: isCover ? 130 : 86, lineHeight: 0.95, letterSpacing: '-0.04em',
    color: palette.text, textTransform: 'uppercase',
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 30, lineHeight: 1.4,
    marginTop: 24, maxWidth: 820, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 20 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.surface} text={palette.text} border={`4px solid ${palette.text}`} shadow={`8px 8px 0 ${palette.accent2}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slide.bullets.map((b: string, i: number) => (
            <div key={i} style={{
              padding: '14px 20px', border: `4px solid ${palette.text}`,
              background: i % 2 === 0 ? palette.accent3 : palette.surface,
              fontSize: 26, fontWeight: 700, color: palette.text,
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: `5px 5px 0 ${palette.text}`,
            }}>
              <span style={{
                background: palette.text, color: palette.bg, padding: '4px 10px',
                fontWeight: 900, fontSize: 18, fontFamily: '"JetBrains Mono", monospace',
              }}>{String(i + 1).padStart(2, '0')}</span>
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
