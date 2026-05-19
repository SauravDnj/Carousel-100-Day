'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

export default function RetroGridSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const isCTA = slide.kind === 'cta';

  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        backgroundColor: palette.bg,
        backgroundImage: `linear-gradient(${withAlpha(palette.accent1, 0.18)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(palette.accent1, 0.18)} 1px, transparent 1px)`,
        backgroundSize: '45px 45px',
        color: palette.text,
        position: 'relative',
        padding: 70,
        fontFamily: '"Playfair Display", serif',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div style={topBar}>
        <span style={{ ...mono, color: palette.text }}>(REMINDER)</span>
        <Dots index={index} total={total} palette={palette} />
      </div>

      {/* Sticker tag */}
      {slide.sticker && (
        <Ticket
          label={slide.sticker.replace('DAY-X', dayLabel)}
          palette={palette}
          style={{ position: 'absolute', top: 130, left: 70, transform: 'rotate(-4deg)' }}
        />
      )}

      {/* Main content */}
      <div style={{ position: 'absolute', top: 230, left: 70, right: 70, bottom: 180, display: 'flex', flexDirection: 'column' }}>
        {renderBody(slide, palette, isCover, isCTA)}
      </div>

      {/* Flower top-right on cover/cta */}
      {(isCover || isCTA) && <Flower palette={palette} style={{ position: 'absolute', top: 200, right: 60, transform: 'rotate(12deg)' }} />}

      {/* Bottom bar */}
      <div style={bottomBar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ ...mono, color: palette.text, fontSize: 18 }}>@{brand.instagram}</span>
          <span style={{ ...mono, color: palette.text, fontSize: 16, opacity: 0.75 }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ fontSize: 56, color: palette.accent1, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1, fontWeight: 700 }}>
          {index < total - 1 ? '→' : '♥'}
        </span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean, isCTA: boolean) {
  const title = slide.title || '';
  // Auto-scale headline so long titles fit. Flower sits top-right on cover/cta, so cap width.
  const len = title.length;
  const base = isCover || isCTA ? 110 : 88;
  const scale = len > 30 ? 0.72 : len > 22 ? 0.85 : 1;
  const headlineStyle = {
    fontFamily: '"Playfair Display", serif',
    fontSize: Math.round(base * scale),
    lineHeight: 1.0,
    letterSpacing: '-0.02em',
    color: palette.text,
    maxWidth: isCover || isCTA ? 620 : 880,
    wordBreak: 'normal' as const,
  };
  const bodyStyle = {
    fontFamily: '"Playfair Display", serif',
    fontSize: 32,
    lineHeight: 1.45,
    maxWidth: 820,
    marginTop: 24,
    color: palette.text,
  };

  if (slide.kind === 'cover' || slide.kind === 'cta') {
    return (
      <>
        <div style={headlineStyle}>{italicized(slide.title || '')}</div>
        {slide.body && <div style={bodyStyle}>{slide.body}</div>}
      </>
    );
  }
  if (slide.kind === 'diagram') {
    return (
      <DiagramSlideBody
        slide={slide}
        palette={palette}
        font='"Playfair Display", serif'
        titleStyle={{ ...headlineStyle, fontSize: Math.round(72 * scale), maxWidth: 880 }}
      />
    );
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: Math.round(72 * scale), maxWidth: 880 }}>{italicized(slide.title || '')}</div>
        <div style={{ marginTop: 36 }}>
          <CodeBlock
            code={slide.code || ''}
            lang={slide.codeLang || 'python'}
            theme="light"
            background="#fff"
            text={palette.text}
            border={`2px solid ${palette.text}`}
            shadow={`6px 6px 0 ${palette.text}`}
          />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: Math.round(72 * scale), maxWidth: 880 }}>{italicized(slide.title || '')}</div>
        <ul style={{ marginTop: 30, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
              <span style={{
                width: 56, height: 56, borderRadius: '50%', background: palette.accent1, color: palette.bg,
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700, fontSize: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `4px 4px 0 ${palette.text}`, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 34, lineHeight: 1.2 }}>{italicized(b)}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <div style={{ ...headlineStyle, fontSize: Math.round(80 * scale), maxWidth: 880 }}>{italicized(slide.title || '')}</div>
      {slide.body && <div style={bodyStyle}>{slide.body}</div>}
    </>
  );
}

function italicized(text: string) {
  // italicize words wrapped in *...*
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('*') && p.endsWith('*')) {
      return <em key={i} style={{ fontStyle: 'italic' }}>{p.slice(1, -1)}</em>;
    }
    return <span key={i}>{p}</span>;
  });
}

const topBar: React.CSSProperties = { position: 'absolute', top: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const bottomBar: React.CSSProperties = { position: 'absolute', bottom: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' };
const mono: React.CSSProperties = { fontFamily: '"JetBrains Mono", monospace', fontWeight: 500, fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase' };

function Dots({ index, total, palette }: { index: number; total: number; palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i === index ? palette.accent1 : palette.accent2 }} />
      ))}
    </div>
  );
}

function Ticket({ label, palette, style }: { label: string; palette: any; style?: React.CSSProperties }) {
  return (
    <div style={{
      ...style,
      background: palette.accent3,
      color: palette.bg,
      padding: '14px 40px',
      borderRadius: 100,
      fontFamily: '"Fredoka", sans-serif',
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      display: 'inline-block',
      boxShadow: `5px 5px 0 ${palette.text}`,
    }}>
      {label}
    </div>
  );
}

function Flower({ palette, style }: { palette: any; style?: React.CSSProperties }) {
  return (
    <div style={{ ...style, position: 'absolute', width: 180, height: 180 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i * 72) * (Math.PI / 180);
        return (
          <div key={i} style={{
            position: 'absolute', width: 80, height: 80, borderRadius: '50%',
            background: palette.accent1,
            top: 50 + Math.sin(angle) * -50,
            left: 50 + Math.cos(angle) * 50,
          }} />
        );
      })}
      <div style={{
        position: 'absolute', width: 80, height: 80, borderRadius: '50%',
        background: palette.accent2, top: 50, left: 50, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 36, height: 18, borderBottom: `4px solid ${palette.text}`, borderRadius: '0 0 36px 36px', marginTop: 8 }} />
      </div>
    </div>
  );
}

function withAlpha(hex: string, a: number) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
