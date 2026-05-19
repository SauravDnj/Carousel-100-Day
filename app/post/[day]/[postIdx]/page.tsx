'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CarouselPreview from '@/components/CarouselPreview';
import { downloadPngZip, downloadPdf, downloadMp4 } from '@/lib/download';
import { getPalette, palettesForTheme, THEMES } from '@/lib/palettes';
import { getPostMeta, getSlides } from '@/lib/content';
import { nextPost, prevPost, nextDay, prevDay, TOTAL_DAYS, POSTS_PER_DAY } from '@/lib/curriculum';
import { BRAND, PaletteId, ThemeId } from '@/lib/types';
import { usePostStatus } from '@/lib/post-status';

export default function PostPage() {
  const params = useParams<{ day: string; postIdx: string }>();
  const router = useRouter();
  const day = parseInt(params.day, 10);
  const postIdx = parseInt(params.postIdx, 10);

  const meta = getPostMeta(day, postIdx);
  const [themeId, setThemeId] = useState<ThemeId>('retro-grid');
  const [paletteId, setPaletteId] = useState<PaletteId>('retro-cream');
  const [busy, setBusy] = useState<string | null>(null);

  // when theme changes, switch to its default palette
  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!;
    setPaletteId(theme.defaultPalette);
  }, [themeId]);

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);
  const slides = useMemo(() => getSlides(day, postIdx), [day, postIdx]);

  if (!meta) {
    return (
      <main style={{ padding: 40 }}>
        <p>Post not found.</p>
        <Link href="/">← Back</Link>
      </main>
    );
  }

  const dayLabel = `DAY ${String(day).padStart(3, '0')}`;
  const postLabel = `POST ${postIdx} OF 5`;
  const baseName = `day-${String(day).padStart(3, '0')}-post-${postIdx}-${themeId}-${paletteId}`;
  const themePalettes = palettesForTheme(themeId);

  const caption = buildCaption(meta);

  // Navigation
  const pP = prevPost(day, postIdx);
  const nP = nextPost(day, postIdx);
  const pD = prevDay(day, postIdx);
  const nD = nextDay(day, postIdx);
  const navTo = (target: { day: number; postIdx: number } | undefined) => {
    if (!target) return;
    router.push(`/post/${target.day}/${target.postIdx}`);
  };
  const goRandom = () => {
    let d: number, p: number;
    do {
      d = Math.floor(Math.random() * TOTAL_DAYS) + 1;
      p = Math.floor(Math.random() * POSTS_PER_DAY) + 1;
    } while (d === day && p === postIdx);
    router.push(`/post/${d}/${p}`);
  };

  // Per-post status (starred / done)
  const [status, setStatus] = usePostStatus(day, postIdx);
  const toggleStarred = () => setStatus(status === 'starred' ? null : 'starred');
  const toggleDone    = () => setStatus(status === 'done'    ? null : 'done');

  async function run(action: () => Promise<void>, label: string) {
    setBusy(label);
    try {
      // Grab off-screen refs from the preview component
      const nodes = ((window as any).__slideRefs as (HTMLDivElement | null)[]).filter(Boolean) as HTMLDivElement[];
      if (nodes.length === 0) throw new Error('No slides to render');
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => router.push('/')} style={ghostBtn}>← All days</button>
        <Link href={`/author/${day}/${postIdx}`} style={{ ...ghostBtn, textDecoration: 'none' }}>✎ Edit content</Link>
        <span style={{ color: '#666' }}>·</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#888', letterSpacing: '0.1em' }}>
          {dayLabel} · {postLabel} · {meta.post.angle}
        </span>
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
        {meta.day.theme}
      </h1>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
        {meta.day.category} · {slides.length} slides
      </div>

      {/* Navigation strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28, alignItems: 'center' }}>
        <button onClick={() => navTo(pD)} disabled={!pD} style={navBtn(!pD)}>« Prev Day</button>
        <button onClick={() => navTo(pP)} disabled={!pP} style={navBtn(!pP)}>‹ Prev Post</button>
        <span style={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: 12, padding: '0 6px' }}>
          {dayLabel} · {postLabel}
        </span>
        <button onClick={() => navTo(nP)} disabled={!nP} style={navBtn(!nP)}>Next Post ›</button>
        <button onClick={() => navTo(nD)} disabled={!nD} style={navBtn(!nD)}>Next Day »</button>
        <span style={{ flex: 1 }} />
        <button onClick={goRandom} style={navBtn(false)} title="Jump to a random post">🎲 Random</button>
        <button onClick={toggleStarred} style={statusBtn(status === 'starred', '#FFB400')} title="Star this post">
          {status === 'starred' ? '★ Starred' : '☆ Star'}
        </button>
        <button onClick={toggleDone} style={statusBtn(status === 'done', '#22C55E')} title="Mark this post as done">
          {status === 'done' ? '✓ Done' : '○ Mark done'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 40, alignItems: 'flex-start' }}>
        {/* Preview column */}
        <div>
          <CarouselPreview
            slides={slides}
            themeId={themeId}
            palette={palette}
            brand={BRAND}
            dayLabel={dayLabel}
            postLabel={postLabel}
            baseName={baseName}
          />
        </div>

        {/* Controls column */}
        <div>
          <Section title="Theme">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setThemeId(t.id)}
                  style={chipBtn(t.id === themeId)}>
                  {t.name}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Palette">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {themePalettes.map(p => (
                <button key={p.id} onClick={() => setPaletteId(p.id)} style={{
                  ...chipBtn(p.id === paletteId),
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start',
                }}>
                  <span style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', border: '1px solid #333' }}>
                    {[p.bg, p.accent1, p.accent2, p.accent3].map((c, i) => (
                      <span key={i} style={{ width: 12, height: 16, background: c }} />
                    ))}
                  </span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Download">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadPngZip(nodes, baseName);
              }, 'png')} disabled={!!busy} style={primaryBtn(busy === 'png')}>
                {busy === 'png' ? 'Rendering…' : '📦 PNG (zip)'}
              </button>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadPdf(nodes, baseName);
              }, 'pdf')} disabled={!!busy} style={primaryBtn(busy === 'pdf')}>
                {busy === 'pdf' ? 'Rendering…' : '📄 PDF'}
              </button>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadMp4(nodes, baseName);
              }, 'mp4')} disabled={!!busy} style={primaryBtn(busy === 'mp4')}>
                {busy === 'mp4' ? 'Rendering…' : '🎬 MP4 / WebM'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              All rendering runs in your browser. No server, no cost, no upload.
            </div>
          </Section>

          <Section title="Caption (tap to copy)">
            <textarea
              readOnly
              value={caption}
              onFocus={e => e.currentTarget.select()}
              style={{
                width: '100%', minHeight: 220, background: '#0e0e0e', color: '#ddd',
                border: '1px solid #222', borderRadius: 8, padding: 12, fontFamily: 'JetBrains Mono',
                fontSize: 12, lineHeight: 1.5,
              }}
            />
            <button onClick={() => navigator.clipboard.writeText(caption)} style={{ ...ghostBtn, marginTop: 8 }}>
              Copy caption
            </button>
          </Section>
        </div>
      </div>
    </main>
  );
}

function buildCaption(meta: NonNullable<ReturnType<typeof getPostMeta>>): string {
  const theme = meta.day.theme;
  const angle = meta.post.angle;
  const cat = meta.day.category;

  // Angle-specific hook in the first line — what's the carousel actually about?
  const hooks: Record<string, string> = {
    'Concept':         `Most engineers I talk to have heard of ${stripWhatIs(theme)} but can't explain it in one sentence. This breaks it down.`,
    'Why It Matters':  `Why does ${stripWhatIs(theme)} actually matter on the job — and what happens when teams skip it.`,
    'How It Works':    `Step by step — how ${stripWhatIs(theme)} actually works, from input to output. No hand-waving.`,
    'Code Example':    `${stripWhatIs(theme)} in code — short, runnable, and the variation that ships in prod (not the toy version).`,
    'Common Mistakes': `5 mistakes I keep seeing with ${stripWhatIs(theme)} in real codebases — and how to avoid them.`,
  };
  const hook = hooks[angle] || `${theme} — ${angle.toLowerCase()}.`;

  // Pick 6 representative hashtags so the caption reads cleanly + then dump the rest
  const tagsPrimary = meta.post.hashtags.slice(0, 6);
  const tagsRest    = meta.post.hashtags.slice(6);

  const lines = [
    `${theme} — ${angle}`,
    '─'.repeat(28),
    '',
    hook,
    '',
    `📌 Day ${meta.day.day} of 100 · Post ${meta.post.postIdx} of 5 · Category: ${cat}`,
    '',
    'WHAT YOU\'LL LEARN IN THIS POST:',
    angleBreakdown(angle, stripWhatIs(theme)),
    '',
    'WHY I MADE THIS:',
    'I\'m doing 100 days of carousel posts — five per day, eight slides each — covering AI, ML, RAG, programming, databases, and the full AI-engineering stack. Every post is the explainer I wish I had when I was learning this topic.',
    '',
    `Today's topic — ${theme} — sits inside ${cat}. If you find this useful, save it so you can come back, and follow for the daily drop. The next four posts on this topic go deeper: why it matters, how it works internally, a code walkthrough, and the common mistakes.`,
    '',
    '🔁 Save this carousel · 👥 Tag a friend who\'s learning',
    '💬 What\'s a topic you want covered? Comment below.',
    '',
    `🔗 LINKS`,
    `  · Instagram: @${BRAND.instagram}`,
    `  · GitHub: github.com/${BRAND.github}`,
    `  · LinkedIn: linkedin.com/in/${BRAND.linkedin}`,
    '',
    tagsPrimary.join(' '),
    tagsRest.length ? '.\n.\n.\n' + tagsRest.join(' ') : '',
  ];
  return lines.filter(l => l !== undefined).join('\n');
}

function stripWhatIs(s: string): string {
  return s.replace(/^(What is|The|A Brief|A )\s+/i, '').replace(/[?!.]+$/, '');
}

function angleBreakdown(angle: string, topic: string): string {
  switch (angle) {
    case 'Concept': return [
      `1. What ${topic} actually is — in one line, then expanded`,
      `2. Why every AI engineer keeps running into it`,
      `3. The core idea — broken into 4 moving parts`,
      `4. Where you meet it in real products`,
      `5. The minimal code example that proves the concept`,
      `6. The beginner trap to avoid`,
    ].join('\n');
    case 'Why It Matters': return [
      `1. The problem that existed before ${topic}`,
      `2. Real-world products powered by it today`,
      `3. 4 concrete reasons it matters on the job`,
      `4. The mistake teams make when they skip it`,
      `5. Takeaways you can apply this week`,
    ].join('\n');
    case 'How It Works': return [
      `1. The big-picture flow on a napkin`,
      `2. Step 1 — preparing the inputs`,
      `3. Step 2 — the core operation`,
      `4. Step 3 — interpreting the output`,
      `5. Edge cases + pitfalls`,
    ].join('\n');
    case 'Code Example': return [
      `1. The stack + setup`,
      `2. The minimal example`,
      `3. Walkthrough of what happens`,
      `4. Variations to try`,
      `5. The production-ready version`,
    ].join('\n');
    case 'Common Mistakes': return [
      `1. Mistake — bad data quality`,
      `2. Mistake — no baseline`,
      `3. Mistake — wrong metric`,
      `4. Mistake — no monitoring`,
      `5. The cure — a recap checklist`,
    ].join('\n');
    default: return `Open the carousel for the full breakdown.`;
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 12, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{title}</h3>
      {children}
    </section>
  );
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', color: '#bbb', border: '1px solid #333',
  padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
};
function navBtn(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? '#0c0c0c' : '#161616', color: disabled ? '#444' : '#ddd',
    border: '1px solid ' + (disabled ? '#1a1a1a' : '#2a2a2a'),
    padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
  };
}
function statusBtn(active: boolean, accent: string): React.CSSProperties {
  return {
    background: active ? accent : '#161616', color: active ? '#0a0a0a' : '#ccc',
    border: '1px solid ' + (active ? accent : '#2a2a2a'),
    padding: '8px 14px', borderRadius: 8, fontSize: 13,
    fontWeight: active ? 700 : 500, cursor: 'pointer',
    fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
  };
}
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
