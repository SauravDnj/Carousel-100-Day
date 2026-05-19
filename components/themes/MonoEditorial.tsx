'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function MonoEditorialSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 100,
      fontFamily: '"Playfair Display", serif', overflow: 'hidden',
    }}>
      {/* Heavy top rule */}
      <div style={{ position: 'absolute', top: 60, left: 100, right: 100, height: 8, background: palette.text }} />

      {/* Masthead */}
      <div style={{ position: 'absolute', top: 78, left: 100, right: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{
          fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700,
          fontSize: 30, color: palette.text,
        }}>
          The Carousel
        </span>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 16,
          color: palette.text, letterSpacing: '0.25em', textTransform: 'uppercase',
        }}>
          № {dayLabel.replace('DAY ', '')} · Folio {String(index + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}
        </span>
      </div>
      {/* Thin secondary rule */}
      <div style={{ position: 'absolute', top: 120, left: 100, right: 100, height: 1, background: palette.text }} />

      {/* Body */}
      <div style={{ position: 'absolute', top: 180, left: 100, right: 100, bottom: 180, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start' }}>
        {slide.sticker && !isCover && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 22,
            fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 14,
            background: palette.text, color: palette.bg, padding: '5px 14px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
          }}>
            {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {isCover && slide.title ? <DropCap title={slide.title} palette={palette} /> : renderBody(slide, palette)}
      </div>

      {/* Big folio number bottom-left */}
      <div style={{
        position: 'absolute', bottom: 75, left: 100,
        fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700,
        fontSize: 110, lineHeight: 1, color: palette.text, opacity: 0.08,
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 110, left: 100, right: 100, height: 1, background: palette.text }} />
      <div style={{ position: 'absolute', bottom: 65, left: 100, right: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 22, color: palette.text }}>
            @{brand.instagram}
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: palette.muted, letterSpacing: '0.1em', marginTop: 2 }}>
            github.com/{brand.github} · linkedin.com/in/{brand.linkedin}
          </span>
        </div>
        <span style={{
          fontFamily: '"Playfair Display", serif', fontWeight: 700, fontStyle: 'italic', fontSize: 24, color: palette.text,
        }}>
          {index < total - 1 ? 'continue overleaf →' : 'fin.'}
        </span>
      </div>
    </div>
  );
}

function DropCap({ title, palette }: { title: string; palette: any }) {
  const first = title.slice(0, 1);
  const rest = title.slice(1);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        float: 'left', fontFamily: '"Playfair Display", serif', fontWeight: 900,
        fontSize: 280, lineHeight: 0.82, color: palette.text, marginRight: 22, marginTop: -8,
      }}>{first}</span>
      <h1 style={{
        fontFamily: '"Playfair Display", serif', fontWeight: 400, fontStyle: 'italic',
        fontSize: 100, lineHeight: 0.95, letterSpacing: '-0.02em', color: palette.text, margin: 0,
      }}>{rest}</h1>
    </div>
  );
}

function renderBody(slide: any, palette: any) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif', fontWeight: 700,
    fontSize: 80, lineHeight: 1.0, letterSpacing: '-0.02em', color: palette.text,
  };
  const subhead: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 400,
    fontSize: 30, lineHeight: 1.45, marginTop: 22, maxWidth: 820, color: palette.text, opacity: 0.85,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Playfair Display", serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 60 }}>{slide.title}</div>
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.surface} text={palette.text} border={`1px solid ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ol style={{ marginTop: 28, paddingLeft: 0, listStyle: 'none' }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{
              fontFamily: '"Playfair Display", serif', fontSize: 30, lineHeight: 1.35,
              marginBottom: 16, color: palette.text, display: 'flex', gap: 22,
              paddingBottom: 14, borderBottom: `1px solid ${palette.text}25`,
            }}>
              <span style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700,
                color: palette.text, fontSize: 42, lineHeight: 1, minWidth: 56,
              }}>{String(i + 1).padStart(2, '0')}</span>
              <span>{b}</span>
            </li>
          ))}
        </ol>
      </>
    );
  }
  return (
    <>
      <div style={headlineStyle}>{slide.title}</div>
      {slide.body && <div style={subhead}>{slide.body}</div>}
    </>
  );
}
