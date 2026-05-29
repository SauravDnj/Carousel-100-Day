'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CURRICULUM, TOTAL_DAYS, POSTS_PER_DAY } from '@/lib/curriculum';
import { BRAND, Category } from '@/lib/types';
import { useAllStatuses, countByStatus } from '@/lib/post-status';

const CATEGORY_COLORS: Record<string, string> = {
  'AI Fundamentals': '#FFD166',
  'Math for ML': '#A8DADC',
  'Python': '#FFE066',
  'Machine Learning': '#06D6A0',
  'Deep Learning': '#118AB2',
  'NLP & LLMs': '#EF476F',
  'RAG': '#FF6B6B',
  'AI Agents': '#B388FF',
  'AI Tools': '#FFB400',
  'SQL Databases': '#7DC4E4',
  'NoSQL Databases': '#82E0AA',
  'Vector Databases': '#C39BD3',
  'Prompt Engineering': '#F8B500',
  'MLOps': '#80DEEA',
  'Data Engineering': '#F4A261',
  'Computer Vision': '#9D4EDD',
  'JavaScript / TypeScript': '#F7DF1E',
  'Production AI': '#06D6A0',
};

type StatusFilter = 'all' | 'starred' | 'done' | 'unmarked';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<Category | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const statuses = useAllStatuses();
  const counts = useMemo(() => {
    // Recompute when statuses change
    let starred = 0, done = 0;
    for (const v of Object.values(statuses)) {
      if (v === 'starred') starred++;
      if (v === 'done') done++;
    }
    return { starred, done, total: TOTAL_DAYS * POSTS_PER_DAY };
  }, [statuses]);

  const cats = useMemo(() => {
    const s = new Set<Category>();
    CURRICULUM.forEach(d => s.add(d.category));
    return ['All' as const, ...Array.from(s)];
  }, []);

  // A day "matches" the status filter if AT LEAST one of its posts matches
  const filtered = CURRICULUM.filter(d => {
    if (activeCat !== 'All' && d.category !== activeCat) return false;
    if (query && !`${d.theme} ${d.category}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (statusFilter !== 'all') {
      const anyMatch = d.posts.some(p => {
        const s = statuses[`${d.day}-${p.postIdx}`] ?? null;
        if (statusFilter === 'starred') return s === 'starred';
        if (statusFilter === 'done') return s === 'done';
        if (statusFilter === 'unmarked') return s === null;
        return true;
      });
      if (!anyMatch) return false;
    }
    return true;
  });

  const goRandom = () => {
    const d = Math.floor(Math.random() * TOTAL_DAYS) + 1;
    const p = Math.floor(Math.random() * POSTS_PER_DAY) + 1;
    router.push(`/post/${d}/${p}`);
  };

  return (
    <main className="cf-main" style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px 80px' }}>
      <header style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase' }}>
          @saurav_dnj_24 · github.com/SauravDnj · linkedin.com/in/sauravdnj
        </div>
        <h1 className="cf-h1" style={{ fontSize: 56, fontWeight: 700, margin: '12px 0 8px', letterSpacing: '-0.03em' }}>
          100-Day Carousel Factory
        </h1>
        <p style={{ color: '#9aa', fontSize: 18, maxWidth: 760, lineHeight: 1.5 }}>
          100 days × 5 posts/day × 8 slides per post — AI, ML, RAG, programming, databases, and the AI tool stack.
          Pick a theme, swap the palette, preview the animation, and download as PNGs, PDF, or MP4.
        </p>

        {/* Status summary */}
        <div style={{ marginTop: 18, display: 'flex', gap: 14, fontSize: 13, color: '#888', alignItems: 'center', flexWrap: 'wrap' }}>
          <span><span style={{ color: '#FFB400' }}>★</span> {counts.starred} starred</span>
          <span><span style={{ color: '#22C55E' }}>✓</span> {counts.done} done</span>
          <span>· {counts.total - counts.done} to go</span>
          <button onClick={goRandom} style={randomBtn}>🎲 Random post</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search topics…"
          style={{
            flex: 1, minWidth: 280, background: '#111', border: '1px solid #2a2a2a',
            padding: '12px 16px', color: '#eee', borderRadius: 8, fontSize: 15,
          }}
        />
      </div>

      {/* Status filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {([['all','All'],['starred','★ Starred'],['done','✓ Done'],['unmarked','○ Not marked']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setStatusFilter(id)} style={{
            padding: '6px 12px', borderRadius: 100, fontSize: 12,
            border: '1px solid ' + (statusFilter === id ? '#fff' : '#2a2a2a'),
            background: statusFilter === id ? '#fff' : 'transparent',
            color: statusFilter === id ? '#000' : '#888',
            cursor: 'pointer', fontWeight: statusFilter === id ? 600 : 400,
            fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c as any)}
            style={{
              padding: '8px 14px', borderRadius: 100, fontSize: 13,
              border: '1px solid ' + (activeCat === c ? '#fff' : '#333'),
              background: activeCat === c ? '#fff' : 'transparent',
              color: activeCat === c ? '#000' : '#bbb',
              cursor: 'pointer', fontWeight: activeCat === c ? 600 : 400,
            }}
          >{c}</button>
        ))}
      </div>

      <div className="cf-cardgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {filtered.map(d => (
          <div key={d.day} style={{
            background: '#111', border: '1px solid #1f1f1f', borderRadius: 14,
            padding: 20, transition: 'border-color .15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontFamily: 'JetBrains Mono', fontSize: 11, color: '#000', background: '#fff',
                padding: '3px 8px', borderRadius: 4, letterSpacing: '0.1em', fontWeight: 700,
              }}>DAY {String(d.day).padStart(3, '0')}</span>
              <span style={{
                fontSize: 11, color: '#111', background: CATEGORY_COLORS[d.category] || '#fff',
                padding: '3px 10px', borderRadius: 100, fontWeight: 600,
              }}>{d.category}</span>
            </div>
            <Link href={`/day/${d.day}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: '8px 0 14px', lineHeight: 1.2 }}>{d.theme} <span style={{ color: '#666', fontSize: 13 }}>→</span></h3>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {d.posts.map(p => {
                const s = statuses[`${d.day}-${p.postIdx}`] ?? null;
                const isStar = s === 'starred';
                const isDone = s === 'done';
                return (
                  <Link
                    key={p.postIdx}
                    href={`/post/${d.day}/${p.postIdx}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: isDone ? '#10250F' : isStar ? '#241B05' : '#191919',
                      padding: '8px 12px', borderRadius: 8, textDecoration: 'none',
                      color: '#ccc', fontSize: 13,
                      border: '1px solid ' + (isDone ? '#1F4012' : isStar ? '#3D2F0A' : '#222'),
                    }}
                  >
                    <span><span style={{ color: '#666' }}>{String(p.postIdx)}/5 ·</span> {p.angle}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isStar && <span style={{ color: '#FFB400', fontSize: 13 }}>★</span>}
                      {isDone && <span style={{ color: '#22C55E', fontSize: 13 }}>✓</span>}
                      <span style={{ color: '#666' }}>→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: 80, color: '#555', fontSize: 12, textAlign: 'center', lineHeight: 1.8 }}>
        <div>
          Built by Saurav Danej ·{' '}
          <a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>Instagram</a>
          {' · '}
          <a href={`https://github.com/${BRAND.github}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>GitHub</a>
          {' · '}
          <a href={`https://linkedin.com/in/${BRAND.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>LinkedIn</a>
        </div>
        <div>500 posts · 26 themes · 132 palettes</div>
      </footer>
    </main>
  );
}

const randomBtn: React.CSSProperties = {
  marginLeft: 'auto', background: '#161616', color: '#ddd', border: '1px solid #2a2a2a',
  padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
  fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
};
