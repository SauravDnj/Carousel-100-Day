'use client';

import { useEffect, useRef } from 'react';
import ThemeSlide from './themes';
import { SLIDE_W, SLIDE_H } from './themes/types';
import { Brand, Palette, SlideContent, ThemeId } from '@/lib/types';

interface PostRender {
  slides: SlideContent[];
  dayLabel: string;
  postLabel: string;
}

interface Props {
  posts: PostRender[];
  themeId: ThemeId;
  palette: Palette;
  brand: Brand;
  /** Called with a flat list of slide DOM nodes per post, in order. */
  onReady?: (groups: { postIdx: number; nodes: HTMLDivElement[] }[]) => void;
}

/**
 * Off-screen renderer for bulk download. Renders all slides for all posts at full size,
 * hidden from view. The parent registers a callback to receive the DOM nodes for capture.
 */
export default function BulkRenderer({ posts, themeId, palette, brand, onReady }: Props) {
  const refs = useRef<Record<number, (HTMLDivElement | null)[]>>({});

  useEffect(() => {
    if (!onReady) return;
    const groups = posts.map((_, pIdx) => ({
      postIdx: pIdx + 1,
      nodes: (refs.current[pIdx + 1] || []).filter(Boolean) as HTMLDivElement[],
    }));
    // Slight delay so layout/fonts settle.
    const id = setTimeout(() => onReady(groups), 400);
    return () => clearTimeout(id);
  }, [posts, themeId, palette, onReady]);

  return (
    <div style={{ position: 'absolute', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden>
      {posts.map((p, pIdx) => (
        <div key={pIdx}>
          {p.slides.map((slide, sIdx) => {
            const postIdx = pIdx + 1;
            return (
              <div
                key={sIdx}
                ref={el => {
                  if (!refs.current[postIdx]) refs.current[postIdx] = [];
                  refs.current[postIdx][sIdx] = el;
                }}
                style={{ width: SLIDE_W, height: SLIDE_H }}
              >
                <ThemeSlide
                  themeId={themeId}
                  slide={slide}
                  index={sIdx}
                  total={p.slides.length}
                  palette={palette}
                  brand={brand}
                  dayLabel={p.dayLabel}
                  postLabel={p.postLabel}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
