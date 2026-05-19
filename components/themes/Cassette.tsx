'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function CassetteSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const sideLabel = index < total / 2 ? 'A' : 'B';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 60,
      fontFamily: '"Space Grotesk", sans-serif', overflow: 'hidden',
    }}>
      {/* Cassette body - slightly off-square */}
      <div style={{
        position: 'absolute', top: 80, left: 60, right: 60, bottom: 80,
        background: palette.surface, border: `4px solid ${palette.text}`,
        borderRadius: 18, display: 'flex', flexDirection: 'column',
        boxShadow: `8px 8px 0 ${palette.text}, 12px 12px 24px rgba(0,0,0,0.18)`,
        overflow: 'hidden',
      }}>
        {/* Side A/B tag */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          background: palette.text, color: palette.bg,
          padding: '6px 22px', borderBottomRightRadius: 14,
          fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 28, letterSpacing: '0.05em',
        }}>
          SIDE {sideLabel}
        </div>

        {/* TDK-style band across the top */}
        <div style={{
          position: 'absolute', top: 0, left: 130, right: 0, height: 50,
          borderBottom: `2px solid ${palette.text}`,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 22,
          fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, color: palette.text, letterSpacing: '0.18em',
        }}>
          CHROME · {dayLabel} · {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </div>

        {/* Tape reels - two circles */}
        <div style={{ position: 'absolute', top: 120, left: 110, right: 110, height: 130, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Reel palette={palette} />
          {/* Tape stripe between reels */}
          <div style={{ flex: 1, height: 14, margin: '0 12px', background: palette.text, borderRadius: 8, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, background: palette.bg, borderRadius: 4 }} />
          </div>
          <Reel palette={palette} />
        </div>

        {/* Body content area */}
        <div style={{
          position: 'absolute', top: 280, left: 40, right: 40, bottom: 70,
          display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start',
        }}>
          {slide.sticker && !isCover && (
            <div style={{
              display: 'inline-block', alignSelf: 'flex-start', marginBottom: 18,
              padding: '4px 14px', border: `2px solid ${palette.text}`,
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>· {slide.sticker.replace('DAY-X', dayLabel)} ·</div>
          )}
          {renderBody(slide, palette, isCover)}
        </div>

        {/* Bottom strip - handle + recording metadata */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 22px', borderTop: `2px solid ${palette.text}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: palette.bg }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 16, letterSpacing: '0.15em', color: palette.text }}>● REC · @{brand.instagram.toUpperCase()}</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 12, letterSpacing: '0.12em', color: palette.muted, marginTop: 2 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
          </div>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 18, color: palette.text, letterSpacing: '0.1em' }}>{index < total - 1 ? '▷▷ FF' : '◼ STOP'}</span>
        </div>
      </div>
    </div>
  );
}

function Reel({ palette }: { palette: any }) {
  return (
    <svg width="130" height="130" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill={palette.bg} stroke={palette.text} strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill="none" stroke={palette.text} strokeWidth="1" />
      <circle cx="50" cy="50" r="10" fill={palette.text} />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={50 + Math.cos(a) * 10} y1={50 + Math.sin(a) * 10} x2={50 + Math.cos(a) * 36} y2={50 + Math.sin(a) * 36} stroke={palette.text} strokeWidth="2.5" />;
      })}
    </svg>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900,
    fontSize: isCover ? 88 : 60, lineHeight: 1.0, letterSpacing: '-0.02em',
    color: palette.text, textTransform: 'uppercase',
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", sans-serif', fontSize: 26, lineHeight: 1.45,
    marginTop: 18, maxWidth: 720, color: palette.text, fontWeight: 500,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"Space Grotesk", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 50 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 48 }}>{slide.title}</div>
        <div style={{ marginTop: 16 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="light"
            background={palette.bg} text={palette.text} border={`2px solid ${palette.text}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ol style={{ marginTop: 18, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: `1px dashed ${palette.text}40`, fontSize: 24, lineHeight: 1.3, color: palette.text }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: palette.text, fontSize: 16, minWidth: 32 }}>0{i + 1}</span>
              <span>{b}</span>
            </li>
          ))}
        </ol>
      </>
    );
  }
  return <><div style={headlineStyle}>{slide.title}</div>{slide.body && <div style={bodyStyle}>{slide.body}</div>}</>;
}
