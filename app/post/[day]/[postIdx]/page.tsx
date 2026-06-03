'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CarouselPreview from '@/components/CarouselPreview';
import VideoPreview from '@/components/VideoPreview';
import { downloadPngZip, downloadPdf, downloadMp4, downloadGif, VideoTransition, VIDEO_TRANSITIONS } from '@/lib/download';
import { getPalette, getTheme, palettesForTheme, THEMES } from '@/lib/palettes';
import { buildPostImagePrompt, buildSlideImagePrompt, buildAllSlidesPrompt } from '@/lib/imagePrompt';
import { getPostMeta, getSlides, getCaption } from '@/lib/content';
import { resolveSlides } from '@/lib/post-content';
import { nextPost, prevPost, nextDay, prevDay, TOTAL_DAYS, POSTS_PER_DAY } from '@/lib/curriculum';
import { BRAND, PaletteId, SlideContent, ThemeId } from '@/lib/types';
import { usePostStatus } from '@/lib/post-status';
import { usePreviewWidth } from '@/lib/useResponsive';

export default function PostPage() {
  const params = useParams<{ day: string; postIdx: string }>();
  const router = useRouter();
  const day = parseInt(params.day, 10);
  const postIdx = parseInt(params.postIdx, 10);

  const meta = getPostMeta(day, postIdx);
  const [themeId, setThemeId] = useState<ThemeId>('retro-grid');
  const [paletteId, setPaletteId] = useState<PaletteId>('retro-cream');
  const [busy, setBusy] = useState<string | null>(null);

  // Video / animation export options
  const [transition, setTransition] = useState<VideoTransition>('none');
  const [speedMs, setSpeedMs] = useState<number>(2000);
  const [kenBurns, setKenBurns] = useState<boolean>(false);
  // Image export quality: 1× ≈ HD (1080), 2× ≈ 2K, 3× ≈ 4K (default). Higher = sharper but slower.
  const [quality, setQuality] = useState<1 | 2 | 3>(3);
  // AI image-prompt target: whole post, all slides combined, or a specific slide index.
  const [promptSel, setPromptSel] = useState<number | 'post' | 'all'>('post');
  const previewW = usePreviewWidth(480);

  // when theme changes, switch to its default palette
  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!;
    setPaletteId(theme.defaultPalette);
  }, [themeId]);

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);
  // Start from the baseline (SSR-safe) then pick up any browser-saved edits/images.
  const [slides, setSlides] = useState<SlideContent[]>(() => getSlides(day, postIdx));
  useEffect(() => { setSlides(resolveSlides(day, postIdx)); }, [day, postIdx]);
  // Per-post status (starred / done). MUST stay above the early return below so the
  // hook order is stable even when a post URL is invalid (rules of hooks).
  const [status, setStatus] = usePostStatus(day, postIdx);

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

  // AI image-generation prompt — adapts to the selected theme + palette + topic.
  const promptCtx = {
    theme: getTheme(themeId),
    palette,
    topic: meta.day.theme,
    category: meta.day.category,
    angle: meta.post.angle,
  };
  const promptIdx: number | 'post' | 'all' =
    promptSel === 'all' ? 'all'
      : typeof promptSel === 'number' && promptSel < slides.length ? promptSel
        : 'post';
  const imagePrompt =
    promptIdx === 'all' ? buildAllSlidesPrompt(promptCtx, slides)
      : promptIdx === 'post' ? buildPostImagePrompt(promptCtx)
        : buildSlideImagePrompt(promptCtx, slides[promptIdx], promptIdx, slides.length);

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
    <main className="cf-main" style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => router.push('/')} style={ghostBtn}>← All days</button>
        <Link href={`/author/${day}/${postIdx}`} style={{ ...ghostBtn, textDecoration: 'none' }}>✎ Edit content</Link>
        <span style={{ color: '#666' }}>·</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#888', letterSpacing: '0.1em' }}>
          {dayLabel} · {postLabel} · {meta.post.angle}
        </span>
      </div>

      <h1 className="cf-h1" style={{ fontSize: 36, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
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

      <div className="cf-twocol" style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 40, alignItems: 'flex-start' }}>
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
            displayWidth={previewW}
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
            {/* Image quality — applies to PNG + PDF */}
            <label style={optLabel}>Image quality</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {([['HD', 1, '1080×1350'], ['2K', 2, '2160×2700'], ['4K', 3, '3240×4050']] as const).map(([lbl, q, dim]) => (
                <button key={q} onClick={() => setQuality(q)} style={segBtn(quality === q)} title={dim}>{lbl}</button>
              ))}
              <span style={{ alignSelf: 'center', fontSize: 11, color: '#666' }}>
                {quality === 3 ? '4K — sharpest, slowest' : quality === 1 ? 'HD — fastest' : '2K — sharp + fast'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadPngZip(nodes, baseName, quality);
              }, 'png')} disabled={!!busy} style={primaryBtn(busy === 'png')}>
                {busy === 'png' ? 'Rendering…' : '📦 PNG (zip)'}
              </button>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadPdf(nodes, baseName, quality);
              }, 'pdf')} disabled={!!busy} style={primaryBtn(busy === 'pdf')}>
                {busy === 'pdf' ? 'Rendering…' : '📄 PDF'}
              </button>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadMp4(nodes, baseName, { accent: palette.accent1, transition, perSlideMs: speedMs, kenBurns });
              }, 'mp4')} disabled={!!busy} style={primaryBtn(busy === 'mp4')}>
                {busy === 'mp4' ? 'Rendering…' : '🎬 MP4 / WebM'}
              </button>
              <button onClick={() => run(async () => {
                const nodes = ((window as any).__slideRefs as HTMLDivElement[]).filter(Boolean);
                await downloadGif(nodes, baseName);
              }, 'gif')} disabled={!!busy} style={primaryBtn(busy === 'gif')}>
                {busy === 'gif' ? 'Rendering…' : '🖼️ Animated GIF'}
              </button>
            </div>

            {/* Video & animation options (apply to the MP4) */}
            <div style={{ marginTop: 14, padding: 14, background: '#0e0e0e', border: '1px solid #1f1f1f', borderRadius: 10 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#777', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'JetBrains Mono' }}>
                🎬 Video options
              </div>

              {/* Live preview of the selected effect — uses the same painter as the MP4 */}
              <div style={{ marginBottom: 12 }}>
                <VideoPreview
                  transition={transition}
                  speedMs={speedMs}
                  kenBurns={kenBurns}
                  accent={palette.accent1}
                  captureKey={`${themeId}|${paletteId}|${slides.length}`}
                />
                <div style={{ fontSize: 11, color: '#666', textAlign: 'center', marginTop: 6, fontFamily: 'JetBrains Mono' }}>
                  Live preview · loops the “{transition}” effect
                </div>
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
              All rendering runs in your browser. No server, no cost, no upload. MP4/WebM = full motion + effects · GIF = lightweight loop · PNG/PDF = static for the Instagram &amp; LinkedIn carousel.
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

          {slides.some(s => s.detail && s.detail.trim()) && (
            <Section title="📖 Deep dive (full written explanation)">
              <div style={{ fontSize: 12, color: '#666', marginBottom: 14, lineHeight: 1.5 }}>
                The slides stay clean and scannable. Here's the in-depth explanation behind each one —
                great for the blog version, show notes, or studying the topic properly.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {slides.map((s, i) => (
                  (s.detail && s.detail.trim()) ? (
                    <div key={i} style={{ borderLeft: '3px solid #333', paddingLeft: 14 }}>
                      <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Slide {i + 1}{s.title ? ` · ${s.title}` : ''}
                      </div>
                      {s.detail.split('\n\n').map((para, pi) => (
                        <p key={pi} style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.65, color: '#ccc' }}>{para}</p>
                      ))}
                    </div>
                  ) : null
                ))}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(
                  slides.map((s, i) => s.detail && s.detail.trim()
                    ? `Slide ${i + 1}${s.title ? ` — ${s.title}` : ''}\n${s.detail.trim()}`
                    : '').filter(Boolean).join('\n\n')
                )}
                style={{ ...ghostBtn, marginTop: 14 }}
              >
                Copy full write-up
              </button>
            </Section>
          )}

          <Section title="🎨 AI image prompt (matches this theme + palette)">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <button onClick={() => setPromptSel('post')} style={segBtn(promptIdx === 'post')}>Whole post</button>
              <button onClick={() => setPromptSel('all')} style={segBtn(promptIdx === 'all')}>All slides</button>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setPromptSel(i)} style={segBtn(promptIdx === i)}>{i + 1}</button>
              ))}
            </div>
            <textarea
              readOnly
              value={imagePrompt}
              onFocus={e => e.currentTarget.select()}
              style={{
                width: '100%', minHeight: 180, background: '#0e0e0e', color: '#ddd',
                border: '1px solid #222', borderRadius: 8, padding: 12, fontFamily: 'JetBrains Mono',
                fontSize: 12, lineHeight: 1.5, resize: 'vertical',
              }}
            />
            <button onClick={() => navigator.clipboard.writeText(imagePrompt)} style={{ ...ghostBtn, marginTop: 8 }}>
              Copy prompt
            </button>
            <div style={{ fontSize: 12, color: '#666', marginTop: 8, lineHeight: 1.5 }}>
              Paste into Midjourney, DALL·E, Ideogram, etc. to generate an on-brand image, then upload it on the{' '}
              <Link href={`/author/${day}/${postIdx}`} style={{ color: '#888' }}>Edit content</Link> page.
              The prompt updates automatically with the selected theme + palette.
            </div>
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

  // Pick 6 representative hashtags so the caption reads cleanly + then dump the rest
  const tagsPrimary = meta.post.hashtags.slice(0, 6);
  const tagsRest    = meta.post.hashtags.slice(6);

  // Prefer the authored, topic-specific caption for this exact post. It replaces
  // the generic hook + "what you'll learn" block; the footer below is shared.
  const authored = getCaption(meta.day.day, meta.post.postIdx);

  let topicBlock: string;
  if (authored && authored.trim()) {
    topicBlock = authored.trim();
  } else {
    // Fallback: angle-specific generated hook + breakdown.
    const hooks: Record<string, string> = {
      'Concept':         `Most engineers I talk to have heard of ${stripWhatIs(theme)} but can't explain it in one sentence. This breaks it down.`,
      'Why It Matters':  `Why does ${stripWhatIs(theme)} actually matter on the job — and what happens when teams skip it.`,
      'How It Works':    `Step by step — how ${stripWhatIs(theme)} actually works, from input to output. No hand-waving.`,
      'Code Example':    `${stripWhatIs(theme)} in code — short, runnable, and the variation that ships in prod (not the toy version).`,
      'Common Mistakes': `5 mistakes I keep seeing with ${stripWhatIs(theme)} in real codebases — and how to avoid them.`,
    };
    const hook = hooks[angle] || `${theme} — ${angle.toLowerCase()}.`;
    topicBlock = [
      `${theme} — ${angle}`,
      '─'.repeat(28),
      '',
      hook,
      '',
      'WHAT YOU\'LL LEARN IN THIS POST:',
      angleBreakdown(angle, stripWhatIs(theme)),
    ].join('\n');
  }

  const lines = [
    topicBlock,
    '',
    `📌 Day ${meta.day.day} of 100 · Post ${meta.post.postIdx} of 5 · Category: ${cat}`,
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
