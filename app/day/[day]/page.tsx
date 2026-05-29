'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDay } from '@/lib/curriculum';
import { getSlides } from '@/lib/content';
import { resolveSlides, saveSlideOverride } from '@/lib/post-content';
import { BRAND, PaletteId, SlideContent, ThemeId } from '@/lib/types';
import { getPalette, getTheme, palettesForTheme, THEMES } from '@/lib/palettes';
import { buildAllPostsPrompt } from '@/lib/imagePrompt';
import BulkRenderer from '@/components/BulkRenderer';
import { downloadDayPngZip, downloadDayPdfZip, downloadDayMp4Zip, PostGroup, VideoTransition, VIDEO_TRANSITIONS } from '@/lib/download';
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
  // Browser-saved per-post edits/images (empty on first render → SSR-safe).
  const [overrides, setOverrides] = useState<Record<number, SlideContent[]>>({});
  // The 40 full-size off-screen render nodes are heavy, so only mount them when a
  // bulk download is actually requested — keeps the day page snappy to open.
  const [bulkMounted, setBulkMounted] = useState(false);
  const [pending, setPending] = useState<null | 'png' | 'pdf' | 'mp4'>(null);
  // Video options for the bulk MP4 export.
  const [transition, setTransition] = useState<VideoTransition>('none');
  const [speedMs, setSpeedMs] = useState<number>(2000);
  const [kenBurns, setKenBurns] = useState<boolean>(false);
  // AI batch drafting state.
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState('');

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!;
    setPaletteId(theme.defaultPalette);
  }, [themeId]);

  useEffect(() => {
    const dd = getDay(day);
    if (!dd) return;
    const map: Record<number, SlideContent[]> = {};
    for (const p of dd.posts) map[p.postIdx] = resolveSlides(day, p.postIdx);
    setOverrides(map);
  }, [day]);

  // Once the off-screen nodes are mounted + ready, run the pending bulk download.
  useEffect(() => {
    if (!pending) return;
    const count = getDay(day)?.posts.length ?? 0;
    if (count === 0 || groups.length < count) return; // wait for all refs
    const name = `day-${String(day).padStart(3, '0')}-${themeId}-${paletteId}`;
    const kind = pending;
    setPending(null);
    setBusy(kind);
    (async () => {
      try {
        if (kind === 'png') await downloadDayPngZip(groups, name);
        else if (kind === 'pdf') await downloadDayPdfZip(groups, name);
        else await downloadDayMp4Zip(groups, name, { transition, perSlideMs: speedMs, kenBurns, accent: getPalette(paletteId).accent1 });
      } catch (e) {
        console.error(e);
        alert('Render failed — check console.');
      } finally {
        setBusy(null);
        setBulkMounted(false); // release the heavy off-screen nodes again
      }
    })();
  }, [pending, groups, day, themeId, paletteId, transition, speedMs, kenBurns]);

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

  // One copyable document with an AI image prompt for all 5 posts of this day.
  const allPostsPrompt = buildAllPostsPrompt(
    d.posts.map(p => ({
      angle: p.angle,
      ctx: { theme: getTheme(themeId), palette, topic: d.theme, category: d.category, angle: p.angle },
    })),
  );

  const posts = d.posts.map(p => ({
    postIdx: p.postIdx,
    angle: p.angle,
    slides: overrides[p.postIdx] ?? getSlides(day, p.postIdx),
    dayLabel,
    postLabel: `POST ${p.postIdx} OF 5`,
  }));
  const totalSlides = posts.reduce((n, p) => n + p.slides.length, 0);

  async function draftAllWithAI() {
    if (!d) return;
    if (!window.confirm(`Draft all ${d.posts.length} posts for this day with AI? This overwrites their slides (saved in your browser).`)) return;
    setAiBusy(true);
    setAiMsg(`✨ Drafting ${d.posts.length} posts… (this can take 1-2 min)`);
    try {
      const batch = d.posts.map(p => ({ day, postIdx: p.postIdx, topic: d.theme, angle: p.angle, category: d.category }));
      const res = await fetch('/api/draft-slides', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ batch }),
      });
      const data = await res.json();
      if (!data.ok) {
        setAiMsg((data.reason === 'no_api_key' ? '⚠ ' : 'Error: ') + (data.message || 'Drafting failed.'));
        return;
      }
      const next = { ...overrides };
      let saved = 0;
      for (const r of data.results as { postIdx: number; ok: boolean; slides?: SlideContent[] }[]) {
        if (r.ok && Array.isArray(r.slides) && r.slides.length) {
          saveSlideOverride(day, r.postIdx, r.slides);
          next[r.postIdx] = r.slides;
          saved++;
        }
      }
      setOverrides(next);
      setAiMsg(`✓ Drafted ${saved}/${d.posts.length} posts — saved in your browser. Open ✎ to edit.`);
    } catch (e: any) {
      setAiMsg('Error: ' + e.message);
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <main className="cf-main" style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => router.push('/')} style={ghostBtn}>← All days</button>
        <span style={{ color: '#666' }}>·</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#888', letterSpacing: '0.1em' }}>
          {dayLabel} · {posts.length} posts · {totalSlides} slides
        </span>
      </div>

      <h1 className="cf-h1" style={{ fontSize: 36, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
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
        <div className="cf-daygrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
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
            <h3 style={sectionTitle}>Bulk download — {posts.length} posts · {totalSlides} slides</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => { setGroups([]); setBusy('png'); setPending('png'); setBulkMounted(true); }} disabled={!!busy} style={primaryBtn(busy === 'png')}>
                {busy === 'png' ? 'Rendering…' : `📦 ${totalSlides} PNGs (zip)`}
              </button>
              <button onClick={() => { setGroups([]); setBusy('pdf'); setPending('pdf'); setBulkMounted(true); }} disabled={!!busy} style={primaryBtn(busy === 'pdf')}>
                {busy === 'pdf' ? 'Rendering…' : `📄 ${posts.length} PDFs (zip)`}
              </button>
              <button onClick={() => { setGroups([]); setBusy('mp4'); setPending('mp4'); setBulkMounted(true); }} disabled={!!busy} style={{ ...primaryBtn(busy === 'mp4'), gridColumn: '1 / -1' }}>
                {busy === 'mp4' ? 'Rendering videos…' : `🎬 ${posts.length} MP4s (zip)`}
              </button>
            </div>

            {/* Video options — apply to the bulk MP4 export */}
            <div style={{ marginTop: 14, padding: 14, background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 10 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#777', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'JetBrains Mono' }}>
                🎬 Video options
              </div>
              <label style={optLabel}>Transition / effect</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {(['none', 'auto', ...VIDEO_TRANSITIONS] as VideoTransition[]).map(tr => (
                  <button key={tr} onClick={() => setTransition(tr)} style={segBtn(transition === tr)}>{tr}</button>
                ))}
              </div>
              <label style={optLabel}>Speed</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {([['Fast', 1200], ['Normal', 2000], ['Slow', 3000]] as const).map(([lbl, ms]) => (
                  <button key={ms} onClick={() => setSpeedMs(ms)} style={segBtn(speedMs === ms)}>{lbl}</button>
                ))}
              </div>
              <label style={optLabel}>Effect</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setKenBurns(true)} style={segBtn(kenBurns)}>Ken Burns zoom</button>
                <button onClick={() => setKenBurns(false)} style={segBtn(!kenBurns)}>None</button>
              </div>
            </div>

            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              One MP4 per post, zipped. Fast H.264 encode on Chrome/Edge. All rendering runs in your browser.
            </div>
          </div>
        </div>
      </div>

      {/* AI batch drafting */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={draftAllWithAI} disabled={aiBusy} style={{
          padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: aiBusy ? 'wait' : 'pointer',
          background: aiBusy ? '#241b3d' : '#6E56CF', color: '#fff', border: '1px solid #6E56CF',
        }}>
          {aiBusy ? '✨ Drafting…' : `✨ Draft all ${d.posts.length} posts with AI`}
        </button>
        {aiMsg && (
          <span style={{ fontSize: 13, color: aiMsg.startsWith('✓') ? '#39FF14' : aiMsg.startsWith('⚠') ? '#FFB400' : '#aaa' }}>{aiMsg}</span>
        )}
        <span style={{ fontSize: 12, color: '#666' }}>Drafts slide text with Groq (needs GROQ_API_KEYS). Saved per-post in your browser.</span>
      </div>

      {/* 5-post grid (thumbnails) */}
      <div className="cf-cardgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
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

      {/* AI image prompts for all 5 posts */}
      <div style={{ background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: 14, padding: 20, marginTop: 28 }}>
        <h3 style={sectionTitle}>🎨 AI image prompts — all 5 posts (matches this theme + palette)</h3>
        <textarea
          readOnly
          value={allPostsPrompt}
          onFocus={e => e.currentTarget.select()}
          style={{
            width: '100%', minHeight: 220, background: '#0b0b0b', color: '#ddd', border: '1px solid #222',
            borderRadius: 8, padding: 12, fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.5, resize: 'vertical',
          }}
        />
        <button onClick={() => navigator.clipboard.writeText(allPostsPrompt)} style={{ ...ghostBtn, marginTop: 8 }}>
          Copy all prompts
        </button>
        <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
          Paste into Midjourney, DALL·E, Ideogram, etc. Updates with the selected theme + palette.
        </div>
      </div>

      {/* Off-screen full-size render — only mounted once a bulk download is requested */}
      {bulkMounted && (
        <BulkRenderer
          posts={posts.map(p => ({ slides: p.slides, dayLabel: p.dayLabel, postLabel: p.postLabel }))}
          themeId={themeId}
          palette={palette}
          brand={BRAND}
          onReady={setGroups}
        />
      )}
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
const optLabel: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#888', marginBottom: 6,
  fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', textTransform: 'uppercase',
};
function segBtn(active: boolean): React.CSSProperties {
  return {
    padding: '6px 12px', borderRadius: 6, fontSize: 12, textTransform: 'capitalize',
    border: '1px solid ' + (active ? '#fff' : '#2a2a2a'),
    background: active ? '#fff' : '#161616', color: active ? '#000' : '#bbb',
    cursor: 'pointer', fontWeight: active ? 600 : 400, fontFamily: 'JetBrains Mono',
  };
}
