'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

const SANS = '"Space Grotesk", sans-serif';
const DISPLAY = '"Archivo Black", sans-serif';
const MONO = '"JetBrains Mono", monospace';

export default function VaporwaveSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';
  const isCTA = slide.kind === 'cta';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, color: palette.text,
      position: 'relative', padding: 70, fontFamily: SANS, overflow: 'hidden',
      background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.surface} 58%, ${palette.bg} 100%)`,
    }}>
      {/* neon sun */}
      <div style={{
        position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)',
        width: 460, height: 460, borderRadius: '50%',
        background: `linear-gradient(180deg, ${palette.accent3}, ${palette.accent1})`,
        opacity: 0.55, filter: 'blur(2px)',
      }} />
      {/* horizon perspective grid */}
      <HorizonGrid palette={palette} />

      {/* top bar */}
      <div style={{ position: 'absolute', top: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <span style={{ fontFamily: MONO, fontSize: 22, color: palette.accent2, letterSpacing: '0.18em', textShadow: `0 0 10px ${palette.accent2}` }}>▟ {dayLabel}</span>
        <Dots index={index} total={total} palette={palette} />
      </div>

      {/* main */}
      <div style={{ position: 'absolute', top: 230, left: 70, right: 70, bottom: 170, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        {renderBody(slide, palette, isCover, isCTA)}
      </div>

      {/* footer */}
      <div style={{ position: 'absolute', bottom: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
        <span style={{ fontFamily: MONO, fontSize: 18, color: palette.muted }}>@{brand.instagram}</span>
        <span style={{ fontFamily: DISPLAY, fontSize: 44, color: palette.accent1, lineHeight: 1, textShadow: `0 0 16px ${palette.accent1}` }}>{index < total - 1 ? '→' : '♡'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean, isCTA: boolean) {
  const title = slide.title || '';
  const scale = title.length > 28 ? 0.74 : title.length > 20 ? 0.86 : 1;
  const glow = `0 0 18px ${withAlpha(palette.accent1, 0.7)}`;
  const headlineStyle: React.CSSProperties = {
    fontFamily: DISPLAY, fontSize: Math.round((isCover || isCTA ? 92 : 62) * scale), lineHeight: 1.04,
    letterSpacing: '0.01em', color: palette.text, textShadow: glow,
  };
  const bodyStyle: React.CSSProperties = { fontFamily: SANS, fontSize: 31, lineHeight: 1.45, color: palette.text, marginTop: 24, maxWidth: 880 };

  if (slide.kind === 'cover' || slide.kind === 'cta') {
    return (
      <>
        <div style={{
          ...headlineStyle,
          background: `linear-gradient(180deg, ${palette.accent2}, ${palette.accent1})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textShadow: 'none',
        }}>{slide.title}</div>
        {slide.body && <div style={{ ...bodyStyle, color: palette.muted }}>{slide.body}</div>}
      </>
    );
  }
  if (slide.kind === 'diagram') {
    return <DiagramSlideBody slide={slide} palette={palette} font={SANS} titleStyle={headlineStyle} />;
  }
  if (slide.kind === 'code') {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <div style={{ marginTop: 30 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={withAlpha(palette.bg, 0.85)} text={palette.text}
            border={`1px solid ${withAlpha(palette.accent2, 0.6)}`} shadow={`0 0 30px ${withAlpha(palette.accent1, 0.4)}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>{slide.title}</div>
        <ul style={{ marginTop: 28, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <span style={{ color: palette.accent2, fontFamily: MONO, fontSize: 28, lineHeight: 1.3, textShadow: `0 0 10px ${palette.accent2}`, flexShrink: 0 }}>◆</span>
              <span style={{ fontSize: 32, lineHeight: 1.3, color: palette.text }}>{b}</span>
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

function HorizonGrid({ palette }: { palette: any }) {
  const c = withAlpha(palette.accent2, 0.5);
  const verticals = Array.from({ length: 17 });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, overflow: 'hidden', zIndex: 1 }}>
      {/* vertical converging lines */}
      {verticals.map((_, i) => {
        const t = i / (verticals.length - 1);
        const x = t * SLIDE_W;
        const vanish = SLIDE_W / 2;
        return (
          <div key={i} style={{
            position: 'absolute', bottom: 0, left: vanish, width: 2, height: 420,
            background: c, transformOrigin: 'bottom center',
            transform: `rotate(${(x - vanish) / 6}deg)`,
          }} />
        );
      })}
      {/* horizontal lines, denser near horizon */}
      {Array.from({ length: 9 }).map((_, i) => {
        const p = i / 8;
        const y = Math.pow(p, 2) * 420;
        return (
          <div key={'h' + i} style={{ position: 'absolute', left: 0, right: 0, bottom: y, height: 2, background: c }} />
        );
      })}
    </div>
  );
}

function Dots({ index, total, palette }: { index: number; total: number; palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i === index ? palette.accent1 : withAlpha(palette.text, 0.3), boxShadow: i === index ? `0 0 10px ${palette.accent1}` : 'none' }} />
      ))}
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
