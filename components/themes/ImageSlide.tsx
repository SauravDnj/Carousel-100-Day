'use client';

import { ThemeSlideProps, SLIDE_W, SLIDE_H } from './types';

/**
 * A dedicated hero-image slide. Works the same across every theme — the uploaded
 * image is the star, framed and palette-matched, with the standard top bar +
 * brand footer so it sits naturally inside a carousel.
 */
export default function ImageSlide({ slide, index, total, palette, brand, dayLabel }: ThemeSlideProps) {
  const fit = slide.imageFit ?? 'cover';
  const hasTitle = !!slide.title;
  const hasCaption = !!slide.body;

  return (
    <div style={{
      width: SLIDE_W, height: SLIDE_H, backgroundColor: palette.bg, color: palette.text,
      position: 'relative', padding: 70, fontFamily: '"Inter", sans-serif', overflow: 'hidden',
    }}>
      {/* top bar */}
      <div style={{ position: 'absolute', top: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 22, color: palette.accent1, letterSpacing: '0.1em' }}>{dayLabel}</span>
        <Dots index={index} total={total} palette={palette} />
      </div>

      {hasTitle && (
        <div style={{
          position: 'absolute', top: 150, left: 70, right: 70,
          fontSize: 56, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: palette.text,
        }}>
          {slide.title}
        </div>
      )}

      {/* image frame */}
      <div style={{
        position: 'absolute',
        top: hasTitle ? 250 : 170,
        left: 70, right: 70,
        bottom: hasCaption ? 230 : 170,
        borderRadius: 24,
        overflow: 'hidden',
        background: palette.surface,
        border: `6px solid ${palette.text}`,
        boxShadow: `12px 12px 0 ${withAlpha(palette.accent1, 0.45)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {slide.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.image} alt={slide.title || 'slide image'} style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
        ) : (
          <span style={{ color: palette.muted, fontSize: 28, fontFamily: '"JetBrains Mono", monospace' }}>
            Upload an image in the editor
          </span>
        )}
      </div>

      {hasCaption && (
        <div style={{
          position: 'absolute', left: 70, right: 70, bottom: 150,
          fontSize: 28, lineHeight: 1.4, color: palette.muted,
        }}>
          {slide.body}
        </div>
      )}

      {/* bottom bar */}
      <div style={{ position: 'absolute', bottom: 70, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 18, color: palette.muted }}>@{brand.instagram}</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 44, color: palette.accent1, lineHeight: 1 }}>{index < total - 1 ? '→' : '★'}</span>
      </div>
    </div>
  );
}

/**
 * A framed "polaroid" photo pinned to a corner of any non-image slide. Sits above
 * the slide's own content so a screenshot or photo can decorate a text slide.
 */
export function ImageOverlay({ slide, palette }: { slide: ThemeSlideProps['slide']; palette: ThemeSlideProps['palette'] }) {
  if (!slide.image) return null;
  const size = slide.imageSize ?? 'md';
  const pos = slide.imagePos ?? 'tr';
  const w = size === 'sm' ? 300 : size === 'lg' ? 480 : 380;

  const rot = pos === 'tr' || pos === 'bl' ? 3 : -3;
  const place: React.CSSProperties = { position: 'absolute' };
  // keep clear of the top bar (~y70) and brand footer (~bottom 70)
  if (pos === 'tl') Object.assign(place, { top: 150, left: 60 });
  if (pos === 'tr') Object.assign(place, { top: 150, right: 60 });
  if (pos === 'bl') Object.assign(place, { bottom: 150, left: 60 });
  if (pos === 'br') Object.assign(place, { bottom: 150, right: 60 });

  return (
    <div style={{
      ...place,
      width: w,
      transform: `rotate(${rot}deg)`,
      background: '#fff',
      padding: 14,
      paddingBottom: 18,
      borderRadius: 6,
      boxShadow: '0 18px 48px rgba(0,0,0,0.45)',
      zIndex: 5,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slide.image} alt={slide.title || 'photo'} style={{ width: '100%', height: w, objectFit: 'cover', display: 'block', borderRadius: 2 }} />
    </div>
  );
}

function Dots({ index, total, palette }: { index: number; total: number; palette: ThemeSlideProps['palette'] }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i === index ? palette.accent1 : withAlpha(palette.text, 0.3) }} />
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
