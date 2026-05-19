'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function PastelSoftSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: `linear-gradient(160deg, ${palette.bg} 0%, ${withAlpha(palette.accent2, 0.35)} 100%)`,
      color: palette.text, padding: 80, fontFamily: '"Fredoka", sans-serif', overflow: 'hidden',
    }}>
      {/* Floating blobs */}
      <Blob color={palette.accent1} size={300} style={{ top: -80, right: -80, opacity: 0.4 }} />
      <Blob color={palette.accent3} size={220} style={{ bottom: -60, left: -60, opacity: 0.5 }} />
      <Blob color={palette.accent2} size={140} style={{ top: '40%', right: 40, opacity: 0.6 }} />

      {/* Top */}
      <div style={topBar}>
        <div style={{
          background: palette.surface, padding: '10px 24px', borderRadius: 100,
          fontSize: 22, fontWeight: 600, color: palette.text, boxShadow: `0 4px 12px ${palette.text}15`,
        }}>
          ✦ {dayLabel}
        </div>
        <Dots index={index} total={total} palette={palette} />
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 200, left: 80, right: 80, bottom: 180, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start' }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 26,
            background: palette.accent1, color: palette.surface, padding: '12px 28px',
            borderRadius: 100, fontWeight: 700, fontSize: 24, letterSpacing: '0.04em',
            boxShadow: `0 8px 20px ${withAlpha(palette.accent1, 0.4)}`,
          }}>
            {slide.sticker.replace('DAY-X', dayLabel)}
          </div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom */}
      <div style={bottomBar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: palette.text }}>@{brand.instagram}</span>
          <span style={{ fontSize: 16, fontWeight: 500, color: palette.muted }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: palette.accent1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.surface,
          fontSize: 32, fontWeight: 700, boxShadow: `0 6px 16px ${withAlpha(palette.accent1, 0.45)}`,
        }}>→</div>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Fredoka", sans-serif', fontWeight: 700,
    fontSize: isCover ? 110 : 80, lineHeight: 1.05, letterSpacing: '-0.02em',
    color: palette.text,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"Fredoka", sans-serif', fontWeight: 400,
    fontSize: 32, lineHeight: 1.5, marginTop: 24, maxWidth: 820, color: palette.text,
  };

  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font='"Fredoka", sans-serif' titleStyle={{ ...headlineStyle, fontSize: 64 }} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 64 }}>{slide.title}</div>
        <div style={{ marginTop: 28 }}>
          <CodeBlock
            code={slide.code || ''}
            lang={slide.codeLang || 'python'}
            theme="light"
            background={palette.surface}
            text={palette.text}
            shadow={`0 10px 30px ${palette.text}15`}
          />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ul style={{ marginTop: 32, listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {slide.bullets.map((b: string, i: number) => {
            const accent = [palette.accent1, palette.accent2, palette.accent3][i % 3];
            return (
              <li key={i} style={{
                background: palette.surface, padding: '20px 28px', borderRadius: 24,
                fontSize: 30, fontWeight: 500, lineHeight: 1.3, color: palette.text,
                boxShadow: `0 6px 18px ${palette.text}10`,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <span style={{
                  width: 44, height: 44, borderRadius: '50%', background: accent,
                  color: palette.surface, fontWeight: 700, fontSize: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{i + 1}</span>
                {b}
              </li>
            );
          })}
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

const topBar: React.CSSProperties = { position: 'absolute', top: 70, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 };
const bottomBar: React.CSSProperties = { position: 'absolute', bottom: 70, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 };

function Dots({ index, total, palette }: { index: number; total: number; palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === index ? 36 : 12, height: 12, borderRadius: 6,
          background: i === index ? palette.accent1 : palette.surface,
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );
}

function Blob({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: color, filter: 'blur(40px)', ...style }} />
  );
}

function withAlpha(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
