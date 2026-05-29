'use client';

// Per-post slide overrides persisted in the browser (localStorage).
//
// The authored content shipped in `lib/sample-content.ts` is the baseline. When a
// user edits a post in /author (text, ordering, or uploaded images) we store the
// full slide array here so the edits — and the embedded image data URLs — survive
// reloads and show up on the read-only /post page too. Clearing an override falls
// back to the template / sample baseline.

import { SlideContent } from './types';
import { getSlides } from './content';

const KEY_PREFIX = 'carousel:slides:';

function key(day: number, postIdx: number): string {
  return `${KEY_PREFIX}${day}-${postIdx}`;
}

export function loadSlideOverride(day: number, postIdx: number): SlideContent[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key(day, postIdx));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as SlideContent[];
    return null;
  } catch {
    return null;
  }
}

export interface SaveResult {
  ok: boolean;
  /** true when the write failed because localStorage is full */
  quotaExceeded?: boolean;
}

export function saveSlideOverride(day: number, postIdx: number, slides: SlideContent[]): SaveResult {
  if (typeof window === 'undefined') return { ok: false };
  try {
    window.localStorage.setItem(key(day, postIdx), JSON.stringify(slides));
    return { ok: true };
  } catch (e: any) {
    const quotaExceeded =
      e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014);
    return { ok: false, quotaExceeded };
  }
}

export function clearSlideOverride(day: number, postIdx: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key(day, postIdx));
  } catch {
    /* ignore */
  }
}

export function hasSlideOverride(day: number, postIdx: number): boolean {
  return loadSlideOverride(day, postIdx) !== null;
}

/** The slides to actually render: a saved override if present, else the baseline. */
export function resolveSlides(day: number, postIdx: number): SlideContent[] {
  return loadSlideOverride(day, postIdx) ?? getSlides(day, postIdx);
}
