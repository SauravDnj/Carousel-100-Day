'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getPostMeta, getSlides } from '@/lib/content';
import { BRAND, PaletteId, SlideContent, SlideKind, ThemeId } from '@/lib/types';
import { getPalette, palettesForTheme, THEMES } from '@/lib/palettes';
import CarouselPreview from '@/components/CarouselPreview';

const KINDS: SlideKind[] = ['cover', 'definition', 'why', 'how', 'steps', 'code', 'comparison', 'tips', 'mistake', 'visual', 'diagram', 'cta'];

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
  const [exportSnippet, setExportSnippet] = useState<string>('');

  useEffect(() => {
    setSlides(getSlides(day, postIdx));
  }, [day, postIdx]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!;
    setPaletteId(theme.defaultPalette);
  }, [themeId]);

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);
  if (!meta) return <main style={{ padding: 40 }}>Post not found. <Link href="/">← Back</Link></main>;

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
  const addSlide = () => setSlides(prev => [...prev, { kind: 'how', title: 'New slide', body: '' }]);
  const resetTemplate = () => setSlides(getSlides(day, postIdx));

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
    <main style={{ maxWidth: 1500, margin: '0 auto', padding: '24px 24px 80px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* LEFT — preview */}
        <div style={{ position: 'sticky', top: 16 }}>
          <CarouselPreview
            slides={slides}
            themeId={themeId}
            palette={palette}
            brand={BRAND}
            dayLabel={dayLabel}
            postLabel={postLabel}
            displayWidth={420}
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
            <button onClick={resetTemplate} style={ghostBtn}>↺ Reset to template</button>
            <button onClick={addSlide} style={ghostBtn}>＋ Add slide</button>
            {status && <span style={{ color: status.startsWith('✓') ? '#39FF14' : status.startsWith('⚠') ? '#FFB400' : '#888', fontSize: 13, alignSelf: 'center', marginLeft: 8 }}>{status}</span>}
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
              onChange={p => updateSlide(i, p)}
              onMove={d => moveSlide(i, d)}
              onRemove={() => removeSlide(i)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function SlideEditor({ slide, index, total, onChange, onMove, onRemove }: {
  slide: SlideContent; index: number; total: number;
  onChange: (p: Partial<SlideContent>) => void;
  onMove: (d: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [bulletsText, setBulletsText] = useState((slide.bullets || []).join('\n'));
  useEffect(() => setBulletsText((slide.bullets || []).join('\n')), [slide.bullets]);

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
          <select value={slide.kind} onChange={e => onChange({ kind: e.target.value as SlideKind })} style={selectStyle}>
            {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onMove(-1)} disabled={index === 0} style={iconBtn}>↑</button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} style={iconBtn}>↓</button>
          <button onClick={onRemove} style={{ ...iconBtn, color: '#FF6B6B' }}>✕</button>
        </div>
      </div>

      <Field label="Title">
        <input value={slide.title || ''} onChange={e => onChange({ title: e.target.value })} style={inputStyle} />
      </Field>

      <Field label="Body">
        <textarea value={slide.body || ''} onChange={e => onChange({ body: e.target.value })} rows={3} style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
      </Field>

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

      <Field label="Sticker (use DAY-X for auto-replace)">
        <input value={slide.sticker || ''} onChange={e => onChange({ sticker: e.target.value })} style={inputStyle} placeholder="e.g. DAY-X or CODE or VECTORS" />
      </Field>
    </div>
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
