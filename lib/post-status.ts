'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Per-post status, persisted in localStorage (Vercel-free-tier friendly).
 * Each post can be: starred, marked done, or neither.
 */

export type PostStatus = 'starred' | 'done' | null;
type StoreShape = Record<string, 'starred' | 'done'>;

const KEY = 'carousel.posts.v1';

function readStore(): StoreShape {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(s: StoreShape) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event('carousel-status-change'));
}

/** Subscribe to status changes — re-renders the calling component on update. */
function useStatuses(): StoreShape {
  const [statuses, setStatuses] = useState<StoreShape>({});

  useEffect(() => {
    setStatuses(readStore());
    const handler = () => setStatuses(readStore());
    window.addEventListener('storage', handler);
    window.addEventListener('carousel-status-change', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('carousel-status-change', handler);
    };
  }, []);

  return statuses;
}

export function useAllStatuses(): StoreShape {
  return useStatuses();
}

export function usePostStatus(day: number, postIdx: number): [PostStatus, (next: PostStatus) => void] {
  const all = useStatuses();
  const key = `${day}-${postIdx}`;
  const current = (all[key] as PostStatus) ?? null;

  const setStatus = useCallback((next: PostStatus) => {
    const s = readStore();
    if (next === null) delete s[key];
    else s[key] = next;
    writeStore(s);
  }, [key]);

  return [current, setStatus];
}

export function getStatus(day: number, postIdx: number): PostStatus {
  const s = readStore();
  return (s[`${day}-${postIdx}`] as PostStatus) ?? null;
}

export function countByStatus(): { starred: number; done: number; total: number } {
  const s = readStore();
  let starred = 0, done = 0;
  for (const v of Object.values(s)) {
    if (v === 'starred') starred++;
    if (v === 'done') done++;
  }
  return { starred, done, total: 500 };
}
