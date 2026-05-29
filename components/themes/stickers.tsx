'use client';

// Shared sticker / badge / decoration system.
//
// IMPORTANT: everything here is STATIC (plain SVG + divs, no framer-motion).
// These components are rendered inside the off-screen capture nodes that become
// PNG / PDF / MP4, so they must paint their final state immediately. The preview
// layer wraps them in motion.* for animation — never animate them here.

import { Palette, ThemeId } from '@/lib/types';

export function withAlpha(hex: string, a: number): string {
  const v = (hex || '#000000').replace('#', '');
  if (v.length < 6) return hex;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function pickAccent(p: Palette, i: number): string {
  const arr = [p.accent1, p.accent2, p.accent3];
  return arr[((i % arr.length) + arr.length) % arr.length];
}

interface ShapeProps {
  color: string;
  size?: number;
  stroke?: string;
  style?: React.CSSProperties;
}

/** Circular badge holding an emoji — the primary per-slide sticker. */
export function EmojiBadge({
  emoji, palette, size = 92, rotate = -8, ring, style,
}: {
  emoji: string;
  palette: Palette;
  size?: number;
  rotate?: number;
  ring?: string;
  style?: React.CSSProperties;
}) {
  const ringColor = ring || palette.accent1;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: palette.surface,
        border: `4px solid ${ringColor}`,
        boxShadow: `5px 6px 0 ${withAlpha(palette.text, 0.85)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotate(${rotate}deg)`,
        fontSize: Math.round(size * 0.5), lineHeight: 1,
        ...style,
      }}
    >
      <span style={{ filter: 'saturate(1.1)' }}>{emoji}</span>
    </div>
  );
}

/** Pill-shaped label sticker, e.g. "DAY 071". */
export function PillSticker({
  label, palette, accent, rotate = -3, style,
}: {
  label: string;
  palette: Palette;
  accent?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const bg = accent || palette.accent3;
  return (
    <div style={{
      background: bg, color: palette.bg,
      padding: '12px 28px', borderRadius: 100,
      fontFamily: '"JetBrains Mono", monospace', fontWeight: 800,
      fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase',
      transform: `rotate(${rotate}deg)`, display: 'inline-block',
      boxShadow: `4px 4px 0 ${palette.text}`,
      ...style,
    }}>
      {label}
    </div>
  );
}

export function Star({ color, size = 60, stroke, style }: ShapeProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden>
      <path
        d="M12 1.5l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.7 5.9 20.6l1.4-6.7-5-4.6 6.8-.8z"
        fill={color} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ color, size = 44, style }: ShapeProps) {
  return (
    <svg viewBox="0 0 14 14" width={size} height={size} style={style} fill={color} aria-hidden>
      <path d="M7 0 L8 5 L13 6 L8 7 L7 14 L6 7 L0 6 L6 5 Z" />
    </svg>
  );
}

export function Bolt({ color, size = 56, stroke, style }: ShapeProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden>
      <path d="M13 1L3 14h7l-1 9 11-14h-7z" fill={color} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} strokeLinejoin="round" />
    </svg>
  );
}

export function Blob({ color, size = 120, style }: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={style} aria-hidden>
      <path
        fill={color}
        d="M44 -64C58 -54 70 -42 75 -27C80 -12 78 6 71 22C64 38 52 52 36 61C20 70 0 74 -19 71C-38 68 -56 58 -67 42C-78 26 -82 4 -78 -16C-74 -36 -62 -54 -46 -64C-30 -74 -10 -76 7 -78C24 -80 30 -74 44 -64Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function ArrowSticker({ color, size = 70, stroke, style }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 24" width={size} height={size * 0.5} style={style} aria-hidden>
      <path d="M2 12h38m0 0l-10-8m10 8l-10 8" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A scattered cluster of dots — soft background decoration. */
export function DotCluster({ color, size = 120, style }: ShapeProps) {
  const dots = [
    [10, 10, 7], [40, 22, 5], [22, 48, 6], [60, 14, 4], [50, 55, 7], [14, 78, 5], [78, 60, 6], [40, 88, 5],
  ];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden>
      {dots.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity={0.85} />
      ))}
    </svg>
  );
}

/** Decorative torn-tape strip. */
export function TapeStrip({ color, size = 160, style }: ShapeProps) {
  return (
    <div style={{
      width: size, height: Math.round(size * 0.22),
      background: withAlpha(color, 0.65),
      transform: style?.transform,
      ...style,
    }} aria-hidden />
  );
}

// ─── Per-theme emoji sticker variants ──────────────────────────────
// Each theme gets a sticker whose SHAPE matches its aesthetic (a frosted
// chip for glass themes, a terminal bracket for cyber themes, a torn tag
// for print themes, …) plus a placement chosen to dodge that theme's bars.

export type StickerVariant = 'circle' | 'terminal' | 'frost' | 'tag' | 'ticket' | 'burst';
export type StickerCorner = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'mid-right' | 'mid-left';

export function EmojiSticker({
  emoji, palette, variant = 'circle', size = 86, rotate = -8,
}: {
  emoji: string;
  palette: Palette;
  variant?: StickerVariant;
  size?: number;
  rotate?: number;
}) {
  const glyph = <span style={{ fontSize: Math.round(size * 0.46), lineHeight: 1 }}>{emoji}</span>;
  const base: React.CSSProperties = {
    width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transform: `rotate(${rotate}deg)`,
  };
  switch (variant) {
    case 'terminal':
      return (
        <div style={{
          ...base, transform: `rotate(${rotate * 0.3}deg)`,
          background: withAlpha(palette.bg, 0.7), color: palette.text,
          border: `3px solid ${palette.accent1}`,
          boxShadow: `0 0 22px ${withAlpha(palette.accent1, 0.5)}, inset 0 0 14px ${withAlpha(palette.accent1, 0.18)}`,
          fontFamily: '"JetBrains Mono", monospace',
        }}>{glyph}</div>
      );
    case 'frost':
      return (
        <div style={{
          ...base, borderRadius: 22,
          background: withAlpha(palette.surface, 0.32),
          border: `1.5px solid ${withAlpha(palette.surface, 0.65)}`,
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          boxShadow: `0 14px 36px ${withAlpha(palette.text, 0.28)}`,
        }}>{glyph}</div>
      );
    case 'tag':
      return (
        <div style={{
          width: size * 1.18, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `rotate(${rotate}deg)`, borderRadius: 14,
          background: palette.accent3, color: palette.bg,
          boxShadow: `5px 5px 0 ${palette.text}`, border: `3px solid ${palette.text}`,
        }}>{glyph}</div>
      );
    case 'ticket':
      return (
        <div style={{
          ...base, borderRadius: 100, background: palette.surface,
          border: `3px solid ${palette.accent1}`, boxShadow: `4px 4px 0 ${withAlpha(palette.text, 0.6)}`,
        }}>{glyph}</div>
      );
    case 'burst':
      return (
        <div style={{ position: 'relative', ...base }}>
          <svg viewBox="0 0 100 100" width={size * 1.35} height={size * 1.35} style={{ position: 'absolute' }} aria-hidden>
            <path
              d="M50 2l9 16 18-8-6 19 19 5-15 12 12 16-19-3-3 19-15-12-15 12-3-19-19 3 12-16-15-12 19-5-6-19 18 8z"
              fill={palette.accent1} stroke={palette.text} strokeWidth={3} strokeLinejoin="round"
            />
          </svg>
          <span style={{ position: 'relative', fontSize: Math.round(size * 0.4), lineHeight: 1 }}>{emoji}</span>
        </div>
      );
    case 'circle':
    default:
      return <EmojiBadge emoji={emoji} palette={palette} size={size} rotate={rotate} />;
  }
}

interface ThemeStickerCfg { variant: StickerVariant; corner: StickerCorner; rotate: number; size?: number }

// Tuned per theme: shape matches the mood, corner dodges that theme's chrome.
export const THEME_STICKER: Record<ThemeId, ThemeStickerCfg> = {
  'retro-grid':     { variant: 'circle',   corner: 'mid-right',    rotate: -8 },
  'dark-cyber':     { variant: 'terminal', corner: 'mid-right',    rotate: 0 },
  'minimal-swiss':  { variant: 'ticket',   corner: 'bottom-right', rotate: -4 },
  'pastel-soft':    { variant: 'circle',   corner: 'mid-right',    rotate: -10 },
  'notebook':       { variant: 'tag',      corner: 'mid-right',    rotate: -7 },
  'glass':          { variant: 'frost',    corner: 'mid-right',    rotate: -6 },
  'brutalist':      { variant: 'tag',      corner: 'mid-right',    rotate: 5 },
  'magazine':       { variant: 'tag',      corner: 'mid-right',    rotate: -6 },
  'aurora':         { variant: 'frost',    corner: 'mid-right',    rotate: -6 },
  'holographic':    { variant: 'frost',    corner: 'mid-right',    rotate: -6 },
  'risograph':      { variant: 'burst',    corner: 'mid-right',    rotate: -4 },
  'comic':          { variant: 'burst',    corner: 'mid-right',    rotate: -6 },
  'y2k':            { variant: 'tag',      corner: 'mid-right',    rotate: -6 },
  'holo-mesh':      { variant: 'frost',    corner: 'mid-right',    rotate: -6 },
  'cyber-glitch':   { variant: 'terminal', corner: 'mid-right',    rotate: 0 },
  'ascii':          { variant: 'terminal', corner: 'mid-right',    rotate: 0 },
  'tape':           { variant: 'tag',      corner: 'mid-right',    rotate: 6 },
  'cassette':       { variant: 'terminal', corner: 'mid-right',    rotate: 0 },
  'notebook-grid':  { variant: 'terminal', corner: 'mid-right',    rotate: -3 },
  'glass-dark':     { variant: 'frost',    corner: 'mid-right',    rotate: -6 },
  'mono-editorial': { variant: 'ticket',   corner: 'bottom-right', rotate: -3 },
  'blueprint':      { variant: 'terminal', corner: 'mid-right',    rotate: 0 },
  'newsprint':      { variant: 'tag',      corner: 'mid-right',    rotate: -4 },
  'vaporwave':      { variant: 'frost',    corner: 'mid-right',    rotate: -6 },
  'memphis':        { variant: 'burst',    corner: 'mid-right',    rotate: -6 },
  'chalkboard':     { variant: 'tag',      corner: 'mid-right',    rotate: -5 },
};

function cornerStyle(corner: StickerCorner): React.CSSProperties {
  switch (corner) {
    case 'top-right':    return { top: 150, right: 30 };
    case 'top-left':     return { top: 150, left: 30 };
    case 'bottom-right': return { bottom: 150, right: 30 };
    case 'bottom-left':  return { bottom: 150, left: 30 };
    case 'mid-left':     return { top: '50%', left: 24, transform: 'translateY(-50%)' };
    case 'mid-right':
    default:             return { top: '50%', right: 24, transform: 'translateY(-50%)' };
  }
}

/**
 * Per-slide static sticker layer baked into every export. Looks up the theme's
 * sticker config so each theme shows a shape + placement that fits its style.
 * Static only (no motion) — it lives inside the capture nodes.
 */
export function SlideStickerLayer({
  emoji, palette, themeId,
}: {
  emoji?: string;
  palette: Palette;
  themeId: ThemeId;
}) {
  if (!emoji) return null;
  const cfg = THEME_STICKER[themeId] ?? { variant: 'circle' as StickerVariant, corner: 'mid-right' as StickerCorner, rotate: -8 };
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
      <div style={{ position: 'absolute', ...cornerStyle(cfg.corner) }}>
        <EmojiSticker emoji={emoji} palette={palette} variant={cfg.variant} rotate={cfg.rotate} size={cfg.size ?? 84} />
      </div>
    </div>
  );
}
