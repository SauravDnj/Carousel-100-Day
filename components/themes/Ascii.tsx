'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';
import CodeBlock from './CodeBlock';
import DiagramSlideBody from './renderDiagram';

const TOP    = '┌' + '─'.repeat(78) + '┐';
const BOTTOM = '└' + '─'.repeat(78) + '┘';

export default function AsciiSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const isCover = slide.kind === 'cover';

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, position: 'relative',
      background: palette.bg, color: palette.text, padding: 60,
      fontFamily: '"JetBrains Mono", monospace', overflow: 'hidden',
    }}>
      {/* CRT phosphor glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: `inset 0 0 120px ${palette.bg}, inset 0 0 60px ${hexToRgba(palette.accent1, 0.18)}`,
      }} />
      {/* Subtle scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 2px, ${palette.text} 2px 3px)`,
      }} />

      {/* Top box border */}
      <pre style={{ position: 'absolute', top: 40, left: 60, right: 60, color: palette.accent1, fontSize: 18, lineHeight: 1, margin: 0, whiteSpace: 'pre' }}>
        {TOP}
      </pre>
      <div style={{ position: 'absolute', top: 56, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', zIndex: 5 }}>
        <span style={{ color: palette.accent2, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em' }}>$ {dayLabel.toLowerCase().replace(' ', '_')}.txt</span>
        <span style={{ color: palette.muted, fontSize: 18, letterSpacing: '0.1em' }}>[{String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}]</span>
      </div>

      {/* Body */}
      <div style={{ position: 'absolute', top: 150, left: 80, right: 80, bottom: 150, display: 'flex', flexDirection: 'column', justifyContent: isCover ? 'center' : 'flex-start', zIndex: 5 }}>
        {slide.sticker && (
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start', marginBottom: 20,
            padding: '4px 16px', background: palette.accent1, color: palette.bg,
            fontWeight: 700, fontSize: 20, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>[ {slide.sticker.replace('DAY-X', dayLabel)} ]</div>
        )}
        {renderBody(slide, palette, isCover)}
      </div>

      {/* Bottom box border */}
      <pre style={{ position: 'absolute', bottom: 40, left: 60, right: 60, color: palette.accent1, fontSize: 18, lineHeight: 1, margin: 0, whiteSpace: 'pre' }}>
        {BOTTOM}
      </pre>
      <div style={{ position: 'absolute', bottom: 56, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: palette.accent1, fontSize: 18, letterSpacing: '0.1em', fontWeight: 700 }}>@{brand.instagram}</span>
          <span style={{ color: palette.muted, fontSize: 14, letterSpacing: '0.1em' }}>github.com/{brand.github} · linkedin.com/in/{brand.linkedin}</span>
        </div>
        <span style={{ color: palette.accent2, fontSize: 22, fontWeight: 700 }}>{index < total - 1 ? '──▶ ' + (index + 2) : '─ END ─'}</span>
      </div>
    </div>
  );
}

function renderBody(slide: any, palette: any, isCover: boolean) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace', fontWeight: 700,
    fontSize: isCover ? 80 : 60, lineHeight: 1.05, color: palette.accent1,
    textShadow: `0 0 16px ${hexToRgba(palette.accent1, 0.4)}`,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace', fontSize: 22, lineHeight: 1.7,
    marginTop: 22, maxWidth: 820, color: palette.text,
  };

  if (slide.kind === 'diagram') return <DiagramSlideBody slide={slide} palette={palette} font='"JetBrains Mono", monospace' titleStyle={{ ...headlineStyle, fontSize: 48 }} />;
  if (slide.kind === 'code') {
    return (
      <>
        <div style={{ ...headlineStyle, fontSize: 48 }}>&gt; {slide.title}</div>
        <div style={{ marginTop: 22 }}>
          <CodeBlock code={slide.code || ''} lang={slide.codeLang || 'python'} theme="dark"
            background={palette.surface} text={palette.text}
            border={`1px solid ${palette.accent1}`} />
        </div>
      </>
    );
  }
  if (slide.bullets) {
    return (
      <>
        <div style={headlineStyle}>&gt; {slide.title}</div>
        <ul style={{ marginTop: 22, listStyle: 'none', padding: 0 }}>
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12, fontSize: 22, lineHeight: 1.45, color: palette.text }}>
              <span style={{ color: palette.accent2, fontWeight: 700 }}>{i === slide.bullets.length - 1 ? '└──' : '├──'}</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return <><div style={headlineStyle}>&gt; {slide.title}</div>{slide.body && <div style={bodyStyle}>{slide.body}</div>}</>;
}

function hexToRgba(hex: string, a: number) {
  const v = hex.replace('#', '');
  return `rgba(${parseInt(v.slice(0,2),16)},${parseInt(v.slice(2,4),16)},${parseInt(v.slice(4,6),16)},${a})`;
}
