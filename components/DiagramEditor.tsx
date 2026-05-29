'use client';

// Structured editor for slide diagrams. Covers the common, list-based diagram
// kinds with friendly forms (flow, pipeline, compare, mindmap, bars, cycle,
// stack, timeline, network, vectors) and falls back to a live-validated JSON
// editor for the nested kinds (tree, decision, trace) and for power users.

import { useEffect, useState } from 'react';
import { DiagramSpec } from '@/lib/types';

const KINDS: DiagramSpec['kind'][] = [
  'flow', 'pipeline', 'compare', 'mindmap', 'bars', 'cycle', 'stack', 'timeline', 'network', 'vectors', 'tree', 'decision', 'trace',
];
const STRUCTURED = new Set<DiagramSpec['kind']>(['flow', 'pipeline', 'compare', 'mindmap', 'bars', 'cycle', 'stack', 'timeline', 'network', 'vectors']);

export function diagramTemplate(kind: DiagramSpec['kind']): DiagramSpec {
  switch (kind) {
    case 'flow':     return { kind: 'flow', nodes: [{ label: 'Input', sub: 'raw' }, { label: 'Process' }, { label: 'Output', sub: 'result' }] };
    case 'pipeline': return { kind: 'pipeline', stages: [{ label: 'Step 1', detail: 'first thing' }, { label: 'Step 2', detail: 'next thing' }, { label: 'Step 3', detail: 'last thing' }] };
    case 'compare':  return { kind: 'compare', left: { title: 'Option A', items: ['point one', 'point two'] }, right: { title: 'Option B', items: ['point one', 'point two'] } };
    case 'mindmap':  return { kind: 'mindmap', center: 'Topic', branches: [{ label: 'Branch 1', sub: ['a', 'b'] }, { label: 'Branch 2', sub: ['a', 'b'] }] };
    case 'bars':     return { kind: 'bars', bars: [{ label: 'A', value: 30 }, { label: 'B', value: 70 }], axisLabel: '' };
    case 'cycle':    return { kind: 'cycle', nodes: [{ label: 'Plan' }, { label: 'Do' }, { label: 'Check' }, { label: 'Act' }] };
    case 'stack':    return { kind: 'stack', levels: [{ label: 'UI', sub: 'top' }, { label: 'Logic' }, { label: 'Data', sub: 'base' }] };
    case 'timeline': return { kind: 'timeline', events: [{ year: '2020', label: 'Start' }, { year: '2024', label: 'Now' }] };
    case 'network':  return { kind: 'network', layers: [3, 4, 2], labels: ['Input', 'Hidden', 'Output'] };
    case 'vectors':  return { kind: 'vectors', vectors: [{ label: 'a', x: 0.6, y: 0.4 }, { label: 'b', x: -0.3, y: 0.5 }] };
    case 'tree':     return { kind: 'tree', root: { label: 'Root', children: [{ label: 'Child A' }, { label: 'Child B' }] } };
    case 'decision': return { kind: 'decision', root: { question: 'Is X true?', yes: { leaf: 'Do A' }, no: { leaf: 'Do B' } } };
    case 'trace':    return { kind: 'trace', lines: [{ text: '>>> run()', tone: 'input' }, { text: 'result = 42', tone: 'value' }, { text: 'done', tone: 'output' }] };
  }
}

export default function DiagramEditor({ spec, onChange }: { spec?: DiagramSpec; onChange: (s: DiagramSpec) => void }) {
  const cur = spec && spec.kind ? spec : diagramTemplate('flow');
  const [jsonMode, setJsonMode] = useState(!STRUCTURED.has(cur.kind));

  const setKind = (k: DiagramSpec['kind']) => {
    if (k !== cur.kind) onChange(diagramTemplate(k));
    setJsonMode(!STRUCTURED.has(k));
  };

  return (
    <div style={{ background: '#0b0b0b', border: '1px solid #242424', borderRadius: 8, padding: 12 }}>
      <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Diagram type</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {KINDS.map(k => (
          <button key={k} onClick={() => setKind(k)} style={pill(cur.kind === k)}>{k}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={() => setJsonMode(m => !m)} style={miniBtn(jsonMode)}>{jsonMode ? '⊞ Form' : '{ } JSON'}</button>
      </div>

      {jsonMode || !STRUCTURED.has(cur.kind)
        ? <JsonEditor spec={cur} onChange={onChange} />
        : <StructuredEditor spec={cur} onChange={onChange} />}
    </div>
  );
}

// ─── Structured forms ──────────────────────────────────────────────
function StructuredEditor({ spec, onChange }: { spec: DiagramSpec; onChange: (s: DiagramSpec) => void }) {
  switch (spec.kind) {
    case 'flow':
    case 'cycle': {
      const items = spec.kind === 'flow' ? spec.nodes : spec.nodes;
      return (
        <ListEditor
          items={items}
          cols={[{ key: 'label', label: 'Label' }, { key: 'sub', label: 'Sub' }]}
          newItem={{ label: 'New' }}
          onChange={next => onChange({ ...spec, nodes: next } as DiagramSpec)}
        />
      );
    }
    case 'pipeline':
      return (
        <ListEditor
          items={spec.stages}
          cols={[{ key: 'label', label: 'Label' }, { key: 'detail', label: 'Detail' }]}
          newItem={{ label: 'New step', detail: '' }}
          onChange={next => onChange({ ...spec, stages: next })}
        />
      );
    case 'stack':
      return (
        <ListEditor
          items={spec.levels}
          cols={[{ key: 'label', label: 'Label' }, { key: 'sub', label: 'Sub' }]}
          newItem={{ label: 'New level' }}
          onChange={next => onChange({ ...spec, levels: next })}
        />
      );
    case 'bars':
      return (
        <>
          <ListEditor
            items={spec.bars}
            cols={[{ key: 'label', label: 'Label' }, { key: 'value', label: 'Value', type: 'number' }, { key: 'sub', label: 'Unit' }]}
            newItem={{ label: 'New', value: 0 }}
            onChange={next => onChange({ ...spec, bars: next })}
          />
          <LabeledInput label="Axis label" value={spec.axisLabel || ''} onChange={v => onChange({ ...spec, axisLabel: v })} />
        </>
      );
    case 'timeline':
      return (
        <ListEditor
          items={spec.events}
          cols={[{ key: 'year', label: 'Year' }, { key: 'label', label: 'Label' }, { key: 'detail', label: 'Detail' }]}
          newItem={{ year: '', label: 'Event' }}
          onChange={next => onChange({ ...spec, events: next })}
        />
      );
    case 'mindmap':
      return (
        <>
          <LabeledInput label="Center" value={spec.center} onChange={v => onChange({ ...spec, center: v })} />
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '10px 0 4px' }}>Branches (sub = comma-separated)</div>
          <ListEditor
            items={spec.branches.map(b => ({ label: b.label, sub: (b.sub || []).join(', ') }))}
            cols={[{ key: 'label', label: 'Label' }, { key: 'sub', label: 'Sub items' }]}
            newItem={{ label: 'New branch', sub: '' }}
            onChange={rows => onChange({ ...spec, branches: rows.map((r: any) => ({ label: r.label, sub: String(r.sub || '').split(',').map((s: string) => s.trim()).filter(Boolean) })) })}
          />
        </>
      );
    case 'compare':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(['left', 'right'] as const).map(side => (
            <div key={side} style={{ background: '#0e0e0e', border: '1px solid #1f1f1f', borderRadius: 6, padding: 8 }}>
              <LabeledInput label={`${side} title`} value={spec[side].title} onChange={v => onChange({ ...spec, [side]: { ...spec[side], title: v } } as DiagramSpec)} />
              <LabeledTextarea label="Items (one per line)" value={spec[side].items.join('\n')} onChange={v => onChange({ ...spec, [side]: { ...spec[side], items: v.split('\n').filter(l => l.trim()) } } as DiagramSpec)} />
            </div>
          ))}
        </div>
      );
    case 'network':
      return (
        <>
          <LabeledInput label="Layers (comma numbers, e.g. 3,4,2)" value={spec.layers.join(',')} onChange={v => onChange({ ...spec, layers: v.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n)) })} />
          <LabeledInput label="Labels (comma)" value={(spec.labels || []).join(', ')} onChange={v => onChange({ ...spec, labels: v.split(',').map(s => s.trim()).filter(Boolean) })} />
        </>
      );
    case 'vectors':
      return (
        <ListEditor
          items={spec.vectors}
          cols={[{ key: 'label', label: 'Label' }, { key: 'x', label: 'X (-1..1)', type: 'number' }, { key: 'y', label: 'Y (-1..1)', type: 'number' }]}
          newItem={{ label: 'v', x: 0.5, y: 0.5 }}
          onChange={next => onChange({ ...spec, vectors: next })}
        />
      );
    default:
      return <JsonEditor spec={spec} onChange={onChange} />;
  }
}

// ─── Generic list-of-rows editor ───────────────────────────────────
interface Col { key: string; label: string; type?: 'text' | 'number' }
function ListEditor({ items, cols, newItem, onChange }: { items: any[]; cols: Col[]; newItem: any; onChange: (next: any[]) => void }) {
  const set = (i: number, key: string, val: any) => onChange(items.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#666', width: 18 }}>{i + 1}</span>
          {cols.map(c => (
            <input
              key={c.key}
              value={it[c.key] ?? ''}
              type={c.type === 'number' ? 'number' : 'text'}
              placeholder={c.label}
              onChange={e => set(i, c.key, c.type === 'number' ? Number(e.target.value) : e.target.value)}
              style={{ ...inp, flex: 1 }}
            />
          ))}
          <button onClick={() => move(i, -1)} disabled={i === 0} style={ic}>↑</button>
          <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={ic}>↓</button>
          <button onClick={() => remove(i)} style={{ ...ic, color: '#FF6B6B' }}>✕</button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { ...newItem }])} style={addBtn}>＋ Add row</button>
    </div>
  );
}

// ─── JSON fallback ─────────────────────────────────────────────────
function JsonEditor({ spec, onChange }: { spec: DiagramSpec; onChange: (s: DiagramSpec) => void }) {
  const [text, setText] = useState(() => JSON.stringify(spec, null, 2));
  const [err, setErr] = useState('');
  useEffect(() => { setText(JSON.stringify(spec, null, 2)); }, [spec.kind]); // reload when kind switches

  const apply = (v: string) => {
    setText(v);
    try {
      const parsed = JSON.parse(v);
      if (!parsed || typeof parsed !== 'object' || !parsed.kind) { setErr('Spec needs a "kind" field'); return; }
      setErr('');
      onChange(parsed as DiagramSpec);
    } catch (e: any) {
      setErr('Invalid JSON: ' + e.message);
    }
  };
  return (
    <div>
      <textarea value={text} onChange={e => apply(e.target.value)} rows={12} spellCheck={false}
        style={{ ...inp, width: '100%', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, resize: 'vertical', borderColor: err ? '#FF6B6B' : '#222' }} />
      {err && <div style={{ color: '#FF6B6B', fontSize: 11, marginTop: 4 }}>{err}</div>}
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={lbl}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} style={{ ...inp, width: '100%' }} />
    </div>
  );
}
function LabeledTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={lbl}>{label}</div>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} style={{ ...inp, width: '100%', resize: 'vertical' }} />
    </div>
  );
}

const inp: React.CSSProperties = { background: '#070707', color: '#eee', border: '1px solid #222', borderRadius: 5, padding: '6px 8px', fontSize: 12 };
const lbl: React.CSSProperties = { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 };
const ic: React.CSSProperties = { background: '#1a1a1a', color: '#bbb', border: '1px solid #333', borderRadius: 4, padding: '2px 7px', fontSize: 11, cursor: 'pointer' };
const addBtn: React.CSSProperties = { background: '#161616', color: '#ddd', border: '1px dashed #333', borderRadius: 5, padding: '5px 10px', fontSize: 11, cursor: 'pointer', marginTop: 4 };
function pill(active: boolean): React.CSSProperties {
  return { padding: '4px 10px', borderRadius: 100, fontSize: 11, border: '1px solid ' + (active ? '#fff' : '#2a2a2a'), background: active ? '#fff' : '#141414', color: active ? '#000' : '#bbb', cursor: 'pointer', fontWeight: active ? 600 : 400, fontFamily: 'JetBrains Mono' };
}
function miniBtn(active: boolean): React.CSSProperties {
  return { padding: '3px 9px', borderRadius: 5, fontSize: 11, border: '1px solid #2a2a2a', background: active ? '#222' : '#141414', color: '#bbb', cursor: 'pointer', fontFamily: 'JetBrains Mono' };
}
