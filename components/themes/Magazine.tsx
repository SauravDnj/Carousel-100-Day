'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function MagazineSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text,
      fontFamily: '"Playfair Display", serif', overflow: 'hidden',
    }}>
      {/* Color block side bar */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 80,
        background: palette.accent1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 0', color: palette.bg,
      }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          ISSUE 100 · {dayLabel}
        </span>
        <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700, fontSize: 36 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Headline strip */}
      <div style={{
        position: 'absolute', top: 50, left: 110, right: 60,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingBottom: 14, borderBottom: `2px solid ${palette.text}`,
      }}>
        <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 26, color: palette.muted }}>
          The Carousel — vol. {dayLabel.replace('DAY ', '')}
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 18, color: palette.muted, letterSpacing: '0.1em' }}>
          PG. {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content area */}
      <div style={{
        position: 'absolute', top: 130, left: 110, right: 60, bottom: 140,
        display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start',
      }}>
        {slide.sticker && !isCover && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 20,
            fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 16,
            color: palette.bg, background: palette.text, padding: '6px 14px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            ❚ {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}

        {/* Drop cap for cover */}
        {isCover && slide.title && (
          <DropCapTitle title={slide.title} palette={palette} />
        )}
        {!isCover && renderBody(slide, palette)}
      </div>

      {/* Bottom strip */}
      <div style={{
        position: 'absolute', bottom: 50, left: 110, right: 60,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingTop: 14, borderTop: `2px solid ${palette.text}`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 22, color: palette.text }}>
            @{brand.instagram}
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: palette.muted, letterSpacing: '0.1em' }}>
            github.com/{brand.github} · linkedin.com/in/{brand.linkedin}
          </span>
        </div>
        <span style={{
          fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700, fontSize: 30,
          color: palette.accent1,
        }}>
          {index < total - 1 ? 'continue →' : 'fin.'}
        </span>
      </div>
    </div>
  );
}

function DropCapTitle({ title, palette }: { title: string; palette: any }) {
  const first = title.slice(0, 1);
  const rest = title.slice(1);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        float: 'left', fontFamily: '"Playfair Display", serif', fontWeight: 700,
        fontSize: 260, lineHeight: 0.85, color: palette.accent1, marginRight: 18, marginTop: -8,
      }}>{first}</span>
      <h1 style={{
        fontFamily: '"Playfair Display", serif', fontWeight: 700, fontStyle: 'italic',
        fontSize: 96, lineHeight: 1.0, letterSpacing: '-0.02em', color: palette.text, margin: 0,
      }}>{rest}</h1>
    </div>
  );
}

function renderBody(slide: any, palette: any) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif', fontWeight: 700,
    fontSize: 78, lineHeight: 1.0, letterSpacing: '-0.02em', color: palette.text,
  };
  const subhead: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 400,
    fontSize: 28, lineHeight: 1.45, marginTop: 22, maxWidth: 820, color: palette.muted,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Playfair Display", serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
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
              fontFamily: '"Playfair Display", serif', fontSize: 30, lineHeight: 1.3,
              marginBottom: 18, color: palette.text, display: 'flex', gap: 18,
              paddingBottom: 16, borderBottom: `1px solid ${palette.text}25`,
            }}>
              <span style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700,
                color: palette.accent1, fontSize: 42, lineHeight: 1, minWidth: 60,
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
