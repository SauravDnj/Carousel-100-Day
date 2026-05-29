'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getPostMeta, getSlides } from '@/lib/content';
import { BRAND, DiagramSpec, PaletteId, SlideContent, SlideKind, ThemeId } from '@/lib/types';
import { getPalette, getTheme, palettesForTheme, THEMES } from '@/lib/palettes';
import { buildSlideImagePrompt, PromptContext } from '@/lib/imagePrompt';
import CarouselPreview from '@/components/CarouselPreview';
import DiagramEditor, { diagramTemplate } from '@/components/DiagramEditor';
import { fileToDataUrl } from '@/lib/image-upload';
import { loadSlideOverride, saveSlideOverride, clearSlideOverride } from '@/lib/post-content';
import { usePreviewWidth } from '@/lib/useResponsive';

const KINDS: SlideKind[] = ['cover', 'definition', 'why', 'how', 'steps', 'code', 'comparison', 'tips', 'mistake', 'visual', 'diagram', 'image', 'cta'];
const BULLET_KINDS = new Set<SlideKind>(['why', 'how', 'steps', 'tips', 'comparison', 'mistake']);
const QUICK_EMOJI = ['🧠', '💡', '⚙️', '🔁', '🎯', '✅', '⚠️', '❌', '🚀', '📖', '🔍', '➡️', '🧰', '🗺️', '💻', '🔬', '📊', '🔖'];

export default function AuthorPage() {
  const params = useParams<{ day: string; postIdx: string }>();
  const router = useRouter();
  const day = parseInt(params.day, 10);
  const postIdx = parseInt(params.postIdx, 10);
  const meta = getPostMeta(day, postIdx);

  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [themeId, setThemeId] = useState<ThemeId>('retro-grid');
  const [paletteId, setPaletteId] = useState<PaletteId>('retro-cream');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [browserMsg, setBrowserMsg] = useState<string>('');
  const [exportSnippet, setExportSnippet] = useState<string>('');
  const [drafting, setDrafting] = useState(false);
  // Skip persisting on the very first render after a (day, postIdx) load.
  const skipPersist = useRef(true);

  useEffect(() => {
    skipPersist.current = true;
    setSlides(loadSlideOverride(day, postIdx) ?? getSlides(day, postIdx));
  }, [day, postIdx]);

  // Auto-save edits (text, ordering, images) to the browser so they persist and
  // show up on the read-only post page too.
  useEffect(() => {
    if (skipPersist.current) { skipPersist.current = false; return; }
    if (!slides.length) return;
    const res = saveSlideOverride(day, postIdx, slides);
    if (res.ok) setBrowserMsg('Saved in browser ✓');
    else if (res.quotaExceeded) setBrowserMsg('⚠ Browser storage full — remove some images.');
    else setBrowserMsg('');
  }, [slides, day, postIdx]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!;
    setPaletteId(theme.defaultPalette);
  }, [themeId]);

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);
  const previewW = usePreviewWidth(420);
  if (!meta) return <main style={{ padding: 40 }}>Post not found. <Link href="/">← Back</Link></main>;

  // Context for the per-slide AI image prompt (adapts to theme + palette + topic).
  const promptCtx: PromptContext = {
    theme: getTheme(themeId), palette, topic: meta.day.theme, category: meta.day.category, angle: meta.post.angle,
  };

  const dayLabel = `DAY ${String(day).padStart(3, '0')}`;
  const postLabel = `POST ${postIdx} OF 5`;

  const updateSlide = (i: number, patch: Partial<SlideContent>) => {
    setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  };
  const moveSlide = (i: number, dir: -1 | 1) => {
    setSlides(prev => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const removeSlide = (i: number) => setSlides(prev => prev.filter((_, idx) => idx !== i));
  const duplicateSlide = (i: number) => setSlides(prev => {
    const next = [...prev];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(prev[i])));
    return next;
  });
  const addSlide = () => setSlides(prev => [...prev, { kind: 'how', title: 'New slide', body: '' }]);
  const resetTemplate = () => {
    clearSlideOverride(day, postIdx);
    skipPersist.current = true;
    setSlides(getSlides(day, postIdx));
    setBrowserMsg('Reset to template — browser copy cleared.');
  };

  async function draftWithAI() {
    if (!meta) return;
    if (!window.confirm('Draft this post with AI? This replaces the current slides — Save afterwards to keep them.')) return;
    setDrafting(true);
    setStatus('✨ Drafting with AI… (this can take ~20s)');
    setExportSnippet('');
    try {
      const res = await fetch('/api/draft-slides', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic: meta.day.theme, angle: meta.post.angle, category: meta.day.category }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.slides) && data.slides.length) {
        setSlides(data.slides);
        setStatus(`✓ Drafted ${data.slides.length} slides with AI — review, then Save.`);
      } else {
        setStatus((data.reason === 'no_api_key' ? '⚠ ' : 'Error: ') + (data.message || 'Drafting failed.'));
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    } finally {
      setDrafting(false);
    }
  }

  async function save() {
    setBusy(true);
    setStatus('Saving…');
    setExportSnippet('');
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ day, postIdx, slides }),
      });
      const data = await res.json();
      if (data.saved) {
        setStatus(`✓ Saved to lib/sample-content.ts (key: ${data.key}). Refresh the post page to see it.`);
      } else {
        setStatus(`⚠ Production mode — copy the snippet below and paste it into lib/sample-content.ts.`);
        setExportSnippet(data.snippet || '');
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    } finally {
      setBusy(false);
    }
  }

  function copySnippet() {
    navigator.clipboard.writeText(exportSnippet);
    setStatus('Copied snippet to clipboard.');
  }

  return (
    <main className="cf-main" style={{ maxWidth: 1500, margin: '0 auto', padding: '24px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <button onClick={() => router.push('/')} style={ghostBtn}>← Home</button>
        <Link href={`/post/${day}/${postIdx}`} style={{ ...ghostBtn, textDecoration: 'none', display: 'inline-block' }}>View post →</Link>
        <span style={{ color: '#666' }}>·</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#888', letterSpacing: '0.1em' }}>
          {dayLabel} · {postLabel} · {meta.post.angle}
        </span>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>
        ✎ Authoring: {meta.day.theme}
      </h1>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
        {meta.day.category} · {slides.length} slides · edit below, click Save when done
      </div>

      <div className="cf-twocol" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* LEFT — preview */}
        <div className="cf-sticky" style={{ position: 'sticky', top: 16 }}>
          <CarouselPreview
            slides={slides}
            themeId={themeId}
            palette={palette}
            brand={BRAND}
            dayLabel={dayLabel}
            postLabel={postLabel}
            displayWidth={previewW}
          />
          <div style={{ marginTop: 16, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Theme</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
            {THEMES.map(t => (
              <button key={t.id} onClick={() => setThemeId(t.id)} style={chipBtn(t.id === themeId)}>{t.name}</button>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Palette</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
            {palettesForTheme(themeId).map(p => (
              <button key={p.id} onClick={() => setPaletteId(p.id)} style={{ ...chipBtn(p.id === paletteId), padding: 6 }}>
                <span style={{ display: 'flex', borderRadius: 3, overflow: 'hidden' }}>
                  {[p.bg, p.accent1, p.accent2, p.accent3].map((c, i) => (
                    <span key={i} style={{ width: 8, height: 14, background: c }} />
                  ))}
                </span>
                <span style={{ marginLeft: 6, fontSize: 11 }}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — editor */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={save} disabled={busy} style={primaryBtn(busy)}>💾 {busy ? 'Saving…' : 'Save'}</button>
            <button onClick={draftWithAI} disabled={drafting || busy} style={{ ...ghostBtn, borderColor: '#6E56CF', color: drafting ? '#888' : '#B7A6F3' }}>
              {drafting ? '✨ Drafting…' : '✨ Draft with AI'}
            </button>
            <button onClick={resetTemplate} style={ghostBtn}>↺ Reset to template</button>
            <button onClick={addSlide} style={ghostBtn}>＋ Add slide</button>
            {status && <span style={{ color: status.startsWith('✓') ? '#39FF14' : status.startsWith('⚠') ? '#FFB400' : '#888', fontSize: 13, alignSelf: 'center', marginLeft: 8 }}>{status}</span>}
            {browserMsg && <span style={{ color: browserMsg.startsWith('⚠') ? '#FFB400' : '#666', fontSize: 12, alignSelf: 'center', marginLeft: 'auto' }}>{browserMsg}</span>}
          </div>

          {exportSnippet && (
            <div style={{ background: '#101010', border: '1px solid #2a2a2a', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#888' }}>TypeScript snippet — paste into <code>lib/sample-content.ts</code></span>
                <button onClick={copySnippet} style={ghostBtn}>Copy</button>
              </div>
              <pre style={{ background: '#000', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 240, fontSize: 12, fontFamily: 'JetBrains Mono', color: '#ccc' }}>
                <code>{exportSnippet}</code>
              </pre>
            </div>
          )}

          {slides.map((s, i) => (
            <SlideEditor
              key={i}
              index={i}
              total={slides.length}
              slide={s}
              promptCtx={promptCtx}
              onChange={p => updateSlide(i, p)}
              onMove={d => moveSlide(i, d)}
              onRemove={() => removeSlide(i)}
              onDuplicate={() => duplicateSlide(i)}
            />
          ))}
          <button onClick={addSlide} style={{ ...ghostBtn, width: '100%', padding: 12, borderStyle: 'dashed', marginTop: 4 }}>＋ Add slide at end</button>
        </div>
      </div>
    </main>
  );
}

function SlideEditor({ slide, index, total, promptCtx, onChange, onMove, onRemove, onDuplicate }: {
  slide: SlideContent; index: number; total: number;
  promptCtx: PromptContext;
  onChange: (p: Partial<SlideContent>) => void;
  onMove: (d: -1 | 1) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const [bulletsText, setBulletsText] = useState((slide.bullets || []).join('\n'));
  useEffect(() => setBulletsText((slide.bullets || []).join('\n')), [slide.bullets]);

  const isDiagram = slide.kind === 'diagram';
  const isCode = slide.kind === 'code';
  const isImage = slide.kind === 'image';
  const showBullets = BULLET_KINDS.has(slide.kind);
  const showBody = !isDiagram; // every non-diagram slide can carry body text
  const bodyLabel = isImage ? 'Caption (shown under the image)' : isCode ? 'Caption / intro (optional)' : 'Body';

  return (
    <div style={{
      background: '#0e0e0e', border: '1px solid #222', borderRadius: 10,
      padding: 14, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#000', background: '#fff', padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>
            #{index + 1} / {total}
          </span>
          <select
            value={slide.kind}
            onChange={e => {
              const kind = e.target.value as SlideKind;
              // auto-init a diagram when switching to the diagram kind
              if (kind === 'diagram' && !slide.diagram) onChange({ kind, diagram: diagramTemplate('flow') });
              else onChange({ kind });
            }}
            style={selectStyle}
          >
            {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onMove(-1)} disabled={index === 0} style={iconBtn} title="Move up">↑</button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} style={iconBtn} title="Move down">↓</button>
          <button onClick={onDuplicate} style={iconBtn} title="Duplicate slide">⧉</button>
          <button onClick={onRemove} style={{ ...iconBtn, color: '#FF6B6B' }} title="Delete slide">✕</button>
        </div>
      </div>

      <Field label="Title">
        <input value={slide.title || ''} onChange={e => onChange({ title: e.target.value })} style={inputStyle} />
      </Field>

      {/* For image slides the picture is the point — show its uploader right up top. */}
      {isImage && <ImageField slide={slide} onChange={onChange} promptCtx={promptCtx} index={index} total={total} />}

      {showBody && (
        <Field label={bodyLabel}>
          <textarea value={slide.body || ''} onChange={e => onChange({ body: e.target.value })} rows={isCode ? 2 : 3} style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
        </Field>
      )}

      {showBullets && (
        <Field label="Bullets (one per line)">
          <textarea
            value={bulletsText}
            onChange={e => {
              setBulletsText(e.target.value);
              onChange({ bullets: e.target.value.split('\n').filter(l => l.trim()) });
            }}
            rows={4}
            style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </Field>
      )}

      {isCode && (
        <Field label="Code">
          <textarea value={slide.code || ''} onChange={e => onChange({ code: e.target.value })} rows={6}
            style={{ ...inputStyle, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: '#888' }}>lang:</span>
            {['python', 'typescript', 'javascript', 'sql', 'bash'].map(lang => (
              <button key={lang} onClick={() => onChange({ codeLang: lang })} style={{
                ...iconBtn, padding: '2px 8px', fontSize: 11,
                background: slide.codeLang === lang ? '#fff' : '#1a1a1a',
                color: slide.codeLang === lang ? '#000' : '#aaa',
              }}>{lang}</button>
            ))}
          </div>
        </Field>
      )}

      {isDiagram && (
        <Field label="Diagram">
          <DiagramEditor spec={slide.diagram} onChange={(d: DiagramSpec) => onChange({ diagram: d })} />
        </Field>
      )}

      {!isImage && <ImageField slide={slide} onChange={onChange} promptCtx={promptCtx} index={index} total={total} />}

      {/* Emoji + sticker row — applies to any slide */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Emoji">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input value={slide.emoji || ''} onChange={e => onChange({ emoji: e.target.value })} style={{ ...inputStyle, width: 64, textAlign: 'center' }} placeholder="🧠" />
            <button onClick={() => onChange({ emoji: '' })} style={{ ...iconBtn, fontSize: 11 }} title="Clear">clear</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {QUICK_EMOJI.map(em => (
              <button key={em} onClick={() => onChange({ emoji: em })} style={{
                background: slide.emoji === em ? '#fff' : '#1a1a1a', border: '1px solid #333',
                borderRadius: 5, padding: '2px 5px', fontSize: 15, cursor: 'pointer', lineHeight: 1,
              }}>{em}</button>
            ))}
          </div>
        </Field>
        <Field label="Sticker (use DAY-X for auto-replace)">
          <input value={slide.sticker || ''} onChange={e => onChange({ sticker: e.target.value })} style={inputStyle} placeholder="e.g. DAY-X or CODE" />
        </Field>
      </div>
    </div>
  );
}

function ImageField({ slide, onChange, promptCtx, index, total }: {
  slide: SlideContent;
  onChange: (p: Partial<SlideContent>) => void;
  promptCtx: PromptContext;
  index: number;
  total: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);
  const isImageKind = slide.kind === 'image';
  const fileRef = useRef<HTMLInputElement>(null);
  const imagePrompt = buildSlideImagePrompt(promptCtx, slide, index, total);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('Not an image file.'); return; }
    setErr('');
    setUploading(true);
    try {
      const url = await fileToDataUrl(file);
      onChange({ image: url });
    } catch {
      setErr('Could not read that image.');
    } finally {
      setUploading(false);
    }
  }

  const label = isImageKind ? 'Hero image' : 'Photo overlay (on this slide)';

  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {slide.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.image} alt="upload preview" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 6, border: '1px solid #333' }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...iconBtn, padding: '6px 12px' }}>
              {uploading ? 'Uploading…' : slide.image ? 'Replace image' : '⬆ Upload image'}
            </button>
            {slide.image && (
              <button onClick={() => onChange({ image: undefined })} style={{ ...iconBtn, padding: '6px 12px', color: '#FF6B6B' }}>Remove</button>
            )}
          </div>
          {err && <span style={{ fontSize: 11, color: '#FF6B6B' }}>{err}</span>}
          {!slide.image && <span style={{ fontSize: 11, color: '#666' }}>Stored in your browser, auto-downscaled. {isImageKind ? 'Fills the whole slide.' : 'Appears as a framed photo.'}</span>}
        </div>
      </div>

      {slide.image && isImageKind && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#888' }}>fit:</span>
          {(['cover', 'contain'] as const).map(f => (
            <button key={f} onClick={() => onChange({ imageFit: f })} style={{
              ...iconBtn, padding: '2px 8px', fontSize: 11,
              background: (slide.imageFit ?? 'cover') === f ? '#fff' : '#1a1a1a',
              color: (slide.imageFit ?? 'cover') === f ? '#000' : '#aaa',
            }}>{f}</button>
          ))}
        </div>
      )}

      {slide.image && !isImageKind && (
        <div style={{ display: 'flex', gap: 14, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#888' }}>corner:</span>
            {(['tl', 'tr', 'bl', 'br'] as const).map(p => (
              <button key={p} onClick={() => onChange({ imagePos: p })} style={{
                ...iconBtn, padding: '2px 8px', fontSize: 11, textTransform: 'uppercase',
                background: (slide.imagePos ?? 'tr') === p ? '#fff' : '#1a1a1a',
                color: (slide.imagePos ?? 'tr') === p ? '#000' : '#aaa',
              }}>{p}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#888' }}>size:</span>
            {(['sm', 'md', 'lg'] as const).map(s => (
              <button key={s} onClick={() => onChange({ imageSize: s })} style={{
                ...iconBtn, padding: '2px 8px', fontSize: 11,
                background: (slide.imageSize ?? 'md') === s ? '#fff' : '#1a1a1a',
                color: (slide.imageSize ?? 'md') === s ? '#000' : '#aaa',
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <details style={{ marginTop: 10 }}>
        <summary style={{ cursor: 'pointer', fontSize: 11, color: '#9ab', userSelect: 'none' }}>
          🎨 AI prompt to generate this image (matches theme + palette)
        </summary>
        <textarea
          readOnly
          value={imagePrompt}
          onFocus={e => e.currentTarget.select()}
          style={{ ...inputStyle, marginTop: 6, minHeight: 120, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, lineHeight: 1.5, resize: 'vertical' }}
        />
        <button
          onClick={() => { navigator.clipboard.writeText(imagePrompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{ ...iconBtn, padding: '4px 10px', marginTop: 6 }}
        >
          {copied ? 'Copied ✓' : 'Copy prompt'}
        </button>
      </details>
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

const ghostBtn: React.CSSProperties = { background: 'transparent', color: '#bbb', border: '1px solid #333', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' };
const iconBtn: React.CSSProperties = { background: '#1a1a1a', color: '#bbb', border: '1px solid #333', padding: '2px 8px', borderRadius: 4, fontSize: 12, cursor: 'pointer' };
const inputStyle: React.CSSProperties = { width: '100%', background: '#070707', color: '#eee', border: '1px solid #222', borderRadius: 6, padding: '8px 10px', fontSize: 13 };
const selectStyle: React.CSSProperties = { ...inputStyle, padding: '4px 8px', width: 'auto', fontSize: 12 };
function chipBtn(active: boolean): React.CSSProperties {
  return { padding: '6px 8px', borderRadius: 6, fontSize: 11, border: '1px solid ' + (active ? '#fff' : '#2a2a2a'), background: active ? '#fff' : '#161616', color: active ? '#000' : '#ddd', cursor: 'pointer', fontWeight: active ? 600 : 400, textAlign: 'left', display: 'flex', alignItems: 'center' };
}
function primaryBtn(busy: boolean): React.CSSProperties {
  return { padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: busy ? '#333' : '#fff', color: busy ? '#aaa' : '#000', border: 'none', cursor: busy ? 'wait' : 'pointer' };
}
