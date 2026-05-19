'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDay } from '@/lib/curriculum';
import { getSlides } from '@/lib/content';
import { BRAND, PaletteId, ThemeId } from '@/lib/types';
import { getPalette, palettesForTheme, THEMES } from '@/lib/palettes';
import BulkRenderer from '@/components/BulkRenderer';
import { downloadDayPngZip, downloadDayPdfZip, PostGroup } from '@/lib/download';
import ThemeSlide from '@/components/themes';
import { SLIDE_W, SLIDE_H } from '@/components/themes/types';

export default function DayPage() {
  const params = useParams<{ day: string }>();
  const router = useRouter();
  const day = parseInt(params.day, 10);
  const d = getDay(day);

  const [themeId, setThemeId] = useState<ThemeId>('retro-grid');
  const [paletteId, setPaletteId] = useState<PaletteId>('retro-cream');
  const [busy, setBusy] = useState<string | null>(null);
  const [groups, setGroups] = useState<PostGroup[]>([]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!;
    setPaletteId(theme.defaultPalette);
  }, [themeId]);

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);

  if (!d) {
    return (
      <main style={{ padding: 40 }}>
        <p>Day not found.</p>
        <Link href="/">← Back</Link>
      </main>
    );
  }

  const dayLabel = `DAY ${String(day).padStart(3, '0')}`;
  const baseName = `day-${String(day).padStart(3, '0')}-${themeId}-${paletteId}`;

  const posts = d.posts.map(p => ({
    postIdx: p.postIdx,
    angle: p.angle,
    slides: getSlides(day, p.postIdx),
    dayLabel,
    postLabel: `POST ${p.postIdx} OF 5`,
  }));

  async function run(action: () => Promise<void>, label: string) {
    setBusy(label);
    try {
      await action();
    } catch (e) {
      console.error(e);
      alert('Render failed — check console.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => router.push('/')} style={ghostBtn}>← All days</button>
        <span style={{ color: '#666' }}>·</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#888', letterSpacing: '0.1em' }}>
          {dayLabel} · 5 posts × 8 slides
        </span>
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
        {d.theme}
      </h1>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>{d.category}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28, alignItems: 'center' }}>
        <button onClick={() => day > 1 && router.push(`/day/${day - 1}`)} disabled={day === 1} style={navBtn(day === 1)}>« Prev Day</button>
        <span style={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: 12, padding: '0 6px' }}>{dayLabel}</span>
        <button onClick={() => day < 100 && router.push(`/day/${day + 1}`)} disabled={day === 100} style={navBtn(day === 100)}>Next Day »</button>
      </div>

      {/* Theme + palette + bulk download controls */}
      <div style={{ background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: 14, padding: 20, marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <h3 style={sectionTitle}>Theme</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 18 }}>
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setThemeId(t.id)} style={chipBtn(t.id === themeId)}>{t.name}</button>
              ))}
            </div>
            <h3 style={sectionTitle}>Palette</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {palettesForTheme(themeId).map(p => (
                <button key={p.id} onClick={() => setPaletteId(p.id)} style={{ ...chipBtn(p.id === paletteId), display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start' }}>
                  <span style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', border: '1px solid #333' }}>
                    {[p.bg, p.accent1, p.accent2, p.accent3].map((c, i) => (
                      <span key={i} style={{ width: 10, height: 14, background: c }} />
                    ))}
                  </span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 style={sectionTitle}>Bulk download — all 5 posts × 8 slides</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => run(() => downloadDayPngZip(groups, baseName), 'png')} disabled={!!busy || groups.length === 0} style={primaryBtn(busy === 'png')}>
                {busy === 'png' ? 'Rendering…' : '📦 40 PNGs (zip)'}
              </button>
              <button onClick={() => run(() => downloadDayPdfZip(groups, baseName), 'pdf')} disabled={!!busy || groups.length === 0} style={primaryBtn(busy === 'pdf')}>
                {busy === 'pdf' ? 'Rendering…' : '📄 5 PDFs (zip)'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Bulk MP4 not offered — render videos per-post (heavy work for the browser).
            </div>
          </div>
        </div>
      </div>

      {/* 5-post grid (thumbnails) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {posts.map(p => (
          <Link key={p.postIdx} href={`/post/${day}/${p.postIdx}`} style={{
            display: 'block', background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: 12,
            padding: 12, textDecoration: 'none', color: '#eee',
          }}>
            <div style={{
              width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: 8,
              position: 'relative', background: palette.bg,
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: SLIDE_W, height: SLIDE_H, transform: `scale(${196 / SLIDE_W})`, transformOrigin: 'top left' }}>
                <ThemeSlide
                  themeId={themeId} slide={p.slides[0]} index={0} total={p.slides.length}
                  palette={palette} brand={BRAND} dayLabel={dayLabel} postLabel={p.postLabel}
                />
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#888' }}>Post {p.postIdx} / 5</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{p.angle}</div>
          </Link>
        ))}
      </div>

      {/* Off-screen full-size render */}
      <BulkRenderer
        posts={posts.map(p => ({ slides: p.slides, dayLabel: p.dayLabel, postLabel: p.postLabel }))}
        themeId={themeId}
        palette={palette}
        brand={BRAND}
        onReady={setGroups}
      />
    </main>
  );
}

const sectionTitle: React.CSSProperties = { fontSize: 11, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 };
function navBtn(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? '#0c0c0c' : '#161616', color: disabled ? '#444' : '#ddd',
    border: '1px solid ' + (disabled ? '#1a1a1a' : '#2a2a2a'),
    padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
  };
}
const ghostBtn: React.CSSProperties = { background: 'transparent', color: '#bbb', border: '1px solid #333', padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' };
function chipBtn(active: boolean): React.CSSProperties {
  return {
    padding: '10px 12px', borderRadius: 8, fontSize: 13,
    border: '1px solid ' + (active ? '#fff' : '#2a2a2a'),
    background: active ? '#fff' : '#161616',
    color: active ? '#000' : '#ddd', cursor: 'pointer', fontWeight: active ? 600 : 400,
    textAlign: 'left',
  };
}
function primaryBtn(busy: boolean): React.CSSProperties {
  return {
    padding: '12px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
    background: busy ? '#333' : '#fff', color: busy ? '#aaa' : '#000',
    border: '1px solid #2a2a2a', cursor: busy ? 'wait' : 'pointer',
  };
}
