'use client';

import { useEffect, useState } from 'react';

/**
 * Returns a preview width that never exceeds the viewport. On desktop it stays at
 * `max`; on a narrow phone it shrinks to fit (minus side padding), so the fixed
 * 1080×1350 carousel preview scales down instead of overflowing the screen.
 */
export function usePreviewWidth(max: number, sidePadding = 24): number {
  const [w, setW] = useState(max);
  useEffect(() => {
    const calc = () => setW(Math.max(220, Math.min(max, window.innerWidth - sidePadding * 2)));
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('orientationchange', calc);
    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('orientationchange', calc);
    };
  }, [max, sidePadding]);
  return w;
}
