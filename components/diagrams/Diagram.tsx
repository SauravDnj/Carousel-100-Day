'use client';

import { DiagramSpec, Palette } from '@/lib/types';

interface Props {
  spec: DiagramSpec;
  palette: Palette;
  width?: number;
  height?: number;
  font?: string;
}

export default function Diagram({ spec, palette, width = 880, height = 600, font = '"Space Grotesk", sans-serif' }: Props) {
  switch (spec.kind) {
    case 'flow':     return <FlowDiagram spec={spec}     palette={palette} width={width} height={height} font={font} />;
    case 'pipeline': return <PipelineDiagram spec={spec} palette={palette} width={width} height={height} font={font} />;
    case 'network':  return <NetworkDiagram spec={spec}  palette={palette} width={width} height={height} font={font} />;
    case 'vectors':  return <VectorsDiagram spec={spec}  palette={palette} width={width} height={height} font={font} />;
    case 'cycle':    return <CycleDiagram spec={spec}    palette={palette} width={width} height={height} font={font} />;
    case 'compare':  return <CompareDiagram spec={spec}  palette={palette} width={width} height={height} font={font} />;
    case 'stack':    return <StackDiagram spec={spec}    palette={palette} width={width} height={height} font={font} />;
    case 'tree':     return <TreeDiagram spec={spec}     palette={palette} width={width} height={height} font={font} />;
    case 'bars':     return <BarsDiagram spec={spec}     palette={palette} width={width} height={height} font={font} />;
    case 'timeline': return <TimelineDiagram spec={spec} palette={palette} width={width} height={height} font={font} />;
    case 'trace':    return <TraceDiagram spec={spec}    palette={palette} width={width} height={height} font={font} />;
    case 'decision': return <DecisionDiagram spec={spec} palette={palette} width={width} height={height} font={font} />;
    case 'mindmap':  return <MindmapDiagram spec={spec}  palette={palette} width={width} height={height} font={font} />;
  }
}

interface DProps<S> { spec: S; palette: Palette; width: number; height: number; font: string }

// ─── FLOW (horizontal A → B → C → D) ───────────────────────────────
function FlowDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'flow' }>>) {
  const n = spec.nodes.length;
  const boxW = Math.min(180, (width - (n - 1) * 40) / n);
  const boxH = 110;
  const gap = (width - n * boxW) / (n - 1 || 1);
  const cy = height / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ overflow: 'visible' }}>
      {spec.nodes.map((node, i) => {
        const x = i * (boxW + gap);
        const color = pickAccent(palette, i);
        return (
          <g key={i}>
            <rect x={x} y={cy - boxH / 2} width={boxW} height={boxH} rx={14} fill={color} stroke={palette.text} strokeWidth={3} />
            <text x={x + boxW / 2} y={cy - 8} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={22} fill={palette.bg}>
              {truncate(node.label, 14)}
            </text>
            {node.sub && (
              <text x={x + boxW / 2} y={cy + 22} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={14} fill={palette.bg} opacity={0.85}>
                {truncate(node.sub, 18)}
              </text>
            )}
            {i < n - 1 && (
              <Arrow from={{ x: x + boxW + 4, y: cy }} to={{ x: x + boxW + gap - 4, y: cy }} color={palette.accent1} stroke={palette.text} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── PIPELINE (numbered stages with detail) ────────────────────────
function PipelineDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'pipeline' }>>) {
  const n = spec.stages.length;
  const boxW = Math.min(190, (width - (n - 1) * 30) / n);
  const boxH = Math.min(220, height - 80);
  const gap = (width - n * boxW) / (n - 1 || 1);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ overflow: 'visible' }}>
      {spec.stages.map((s, i) => {
        const x = i * (boxW + gap);
        const color = pickAccent(palette, i);
        return (
          <g key={i}>
            <rect x={x} y={20} width={boxW} height={boxH} rx={16} fill={palette.surface} stroke={palette.text} strokeWidth={3} />
            <circle cx={x + 36} cy={56} r={22} fill={color} stroke={palette.text} strokeWidth={2.5} />
            <text x={x + 36} y={64} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={24} fill={palette.bg}>{i + 1}</text>
            <text x={x + 16} y={114} fontFamily={font} fontWeight={700} fontSize={22} fill={palette.text}>{truncate(s.label, 16)}</text>
            {s.detail && wrapText(s.detail, x + 16, 152, boxW - 32, 17, palette.muted, font).map((t, k) => <text key={k} {...t} />)}
            {i < n - 1 && (
              <Arrow from={{ x: x + boxW + 4, y: 20 + boxH / 2 }} to={{ x: x + boxW + gap - 4, y: 20 + boxH / 2 }} color={palette.accent1} stroke={palette.text} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── NETWORK (layered neural net) ─────────────────────────────────
function NetworkDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'network' }>>) {
  const layers = spec.layers;
  const labels = spec.labels || [];
  const xs = layers.map((_, i) => (width - 60) * (i / (layers.length - 1 || 1)) + 30);
  const positions = layers.map((count, li) => {
    const xpos = xs[li];
    const step = (height - 140) / (count + 1);
    return Array.from({ length: count }, (_, ni) => ({ x: xpos, y: 70 + step * (ni + 1) }));
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {/* connections */}
      {positions.slice(0, -1).map((layer, li) =>
        layer.map((a, i) => positions[li + 1].map((b, j) => (
          <line key={`${li}-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={palette.muted} strokeOpacity={0.35} strokeWidth={1.2} />
        )))
      )}
      {/* neurons */}
      {positions.map((layer, li) => layer.map(({ x, y }, i) => {
        const color = li === 0 ? palette.accent2 : li === positions.length - 1 ? palette.accent1 : palette.accent3;
        return <circle key={`${li}-${i}`} cx={x} cy={y} r={20} fill={color} stroke={palette.text} strokeWidth={2.5} />;
      }))}
      {/* labels */}
      {xs.map((x, li) => (
        <text key={li} x={x} y={height - 30} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={16} fill={palette.text} fontWeight={600}>
          {labels[li] || `L${li}`}
        </text>
      ))}
    </svg>
  );
}

// ─── VECTORS (2D vector space) ─────────────────────────────────────
function VectorsDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'vectors' }>>) {
  const cx = width / 2, cy = height / 2;
  const scale = Math.min(width, height) * 0.4;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {/* axes */}
      <line x1={50} y1={cy} x2={width - 50} y2={cy} stroke={palette.muted} strokeWidth={2} strokeDasharray="6 6" />
      <line x1={cx} y1={50} x2={cx} y2={height - 50} stroke={palette.muted} strokeWidth={2} strokeDasharray="6 6" />
      {/* grid dots */}
      {Array.from({ length: 11 }).map((_, i) =>
        Array.from({ length: 9 }).map((_, j) => (
          <circle key={`${i}-${j}`} cx={50 + i * ((width - 100) / 10)} cy={50 + j * ((height - 100) / 8)} r={1.5} fill={palette.muted} opacity={0.4} />
        ))
      )}
      {/* vectors */}
      {spec.vectors.map((v, i) => {
        const tx = cx + v.x * scale, ty = cy - v.y * scale;
        const color = v.color || pickAccent(palette, i);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={tx} y2={ty} stroke={color} strokeWidth={5} strokeLinecap="round" />
            <polygon points={arrowHead(cx, cy, tx, ty, 12)} fill={color} />
            <text x={tx + 14} y={ty - 8} fontFamily={font} fontWeight={700} fontSize={20} fill={palette.text}>{v.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── CYCLE (circular flow, e.g. ReAct loop) ────────────────────────
function CycleDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'cycle' }>>) {
  const cx = width / 2, cy = height / 2;
  const r = Math.min(width, height) * 0.32;
  const n = spec.nodes.length;
  const pts = spec.nodes.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {/* connecting arcs */}
      {pts.map((p, i) => {
        const next = pts[(i + 1) % n];
        return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke={palette.accent1} strokeWidth={3} markerEnd="url(#cycle-arrow)" />;
      })}
      <defs>
        <marker id="cycle-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <polygon points="0,0 10,5 0,10" fill={palette.accent1} />
        </marker>
      </defs>
      {/* nodes */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={62} fill={pickAccent(palette, i)} stroke={palette.text} strokeWidth={3} />
          <text x={p.x} y={p.y + 8} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={22} fill={palette.bg}>
            {truncate(spec.nodes[i].label, 10)}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── COMPARE (side-by-side) ────────────────────────────────────────
function CompareDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'compare' }>>) {
  const colW = (width - 40) / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {([['left', spec.left, 0], ['right', spec.right, colW + 40]] as const).map(([side, data, x]) => {
        const color = data.accent || (side === 'left' ? palette.accent2 : palette.accent1);
        return (
          <g key={side}>
            <rect x={x as number} y={20} width={colW} height={height - 40} rx={20} fill={palette.surface} stroke={palette.text} strokeWidth={3} />
            <rect x={x as number} y={20} width={colW} height={70} rx={20} fill={color} />
            <text x={(x as number) + colW / 2} y={66} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={26} fill={palette.bg}>{data.title}</text>
            {data.items.map((it, i) => (
              <g key={i}>
                <circle cx={(x as number) + 36} cy={120 + i * 48} r={9} fill={color} />
                {wrapText(it, (x as number) + 60, 126 + i * 48, colW - 80, 18, palette.text, font).slice(0, 1).map((t, k) => <text key={k} {...t} />)}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── STACK (vertical architecture stack) ───────────────────────────
function StackDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'stack' }>>) {
  const n = spec.levels.length;
  const boxH = (height - 40 - (n - 1) * 10) / n;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {spec.levels.map((lvl, i) => {
        const y = 20 + i * (boxH + 10);
        const color = pickAccent(palette, i);
        return (
          <g key={i}>
            <rect x={40} y={y} width={width - 80} height={boxH} rx={14} fill={color} stroke={palette.text} strokeWidth={3} />
            <text x={64} y={y + boxH / 2 + 8} fontFamily={font} fontWeight={800} fontSize={26} fill={palette.bg}>{lvl.label}</text>
            {lvl.sub && (
              <text x={width - 64} y={y + boxH / 2 + 6} textAnchor="end" fontFamily="JetBrains Mono" fontSize={18} fill={palette.bg} opacity={0.85}>
                {lvl.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── TREE (decision tree / hierarchy) ──────────────────────────────
function TreeDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'tree' }>>) {
  // Simple 2-level tree
  const root = spec.root;
  const children = root.children || [];
  const cx = width / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      <g>
        <rect x={cx - 110} y={30} width={220} height={70} rx={12} fill={palette.accent1} stroke={palette.text} strokeWidth={3} />
        <text x={cx} y={74} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={24} fill={palette.bg}>{root.label}</text>
      </g>
      {children.map((c, i) => {
        const x = (width / (children.length + 1)) * (i + 1);
        return (
          <g key={i}>
            <line x1={cx} y1={100} x2={x} y2={180} stroke={palette.text} strokeWidth={2.5} />
            <rect x={x - 90} y={180} width={180} height={64} rx={10} fill={palette.accent2} stroke={palette.text} strokeWidth={3} />
            <text x={x} y={220} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={20} fill={palette.bg}>{truncate(c.label, 16)}</text>
            {(c.children || []).map((g, j) => {
              const gx = x - 70 + j * 90;
              return (
                <g key={j}>
                  <line x1={x} y1={244} x2={gx} y2={310} stroke={palette.text} strokeWidth={2} />
                  <rect x={gx - 60} y={310} width={120} height={50} rx={8} fill={palette.surface} stroke={palette.text} strokeWidth={2} />
                  <text x={gx} y={340} textAnchor="middle" fontFamily={font} fontSize={16} fill={palette.text}>{truncate(g.label, 12)}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ─── BARS (horizontal bar chart) ───────────────────────────────────
function BarsDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'bars' }>>) {
  const maxV = Math.max(...spec.bars.map(b => b.value), 1);
  const n = spec.bars.length;
  const barH = Math.min(54, (height - 40 - (n - 1) * 18) / n);
  const labelW = 200;
  const barAreaW = width - labelW - 100;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {spec.bars.map((b, i) => {
        const y = 30 + i * (barH + 18);
        const bw = (b.value / maxV) * barAreaW;
        const color = pickAccent(palette, i);
        return (
          <g key={i}>
            <text x={labelW - 14} y={y + barH / 2 + 7} textAnchor="end" fontFamily={font} fontWeight={700} fontSize={22} fill={palette.text}>{truncate(b.label, 18)}</text>
            <rect x={labelW} y={y} width={bw} height={barH} fill={color} stroke={palette.text} strokeWidth={2.5} rx={4} />
            <rect x={labelW + bw} y={y} width={Math.max(0, barAreaW - bw)} height={barH} fill={palette.surface} stroke={palette.text} strokeWidth={2.5} strokeOpacity={0.3} rx={4} />
            <text x={labelW + bw + 12} y={y + barH / 2 + 6} fontFamily="JetBrains Mono" fontWeight={700} fontSize={20} fill={palette.text}>{b.value}{b.sub ? ` ${b.sub}` : ''}</text>
          </g>
        );
      })}
      {spec.axisLabel && (
        <text x={width / 2} y={height - 8} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={16} fill={palette.muted}>{spec.axisLabel}</text>
      )}
    </svg>
  );
}

// ─── TIMELINE (horizontal events with year markers) ────────────────
function TimelineDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'timeline' }>>) {
  const n = spec.events.length;
  const lineY = height / 2;
  const spacing = (width - 100) / (n - 1 || 1);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {/* main line */}
      <line x1={50} y1={lineY} x2={width - 50} y2={lineY} stroke={palette.text} strokeWidth={4} />
      {spec.events.map((e, i) => {
        const x = 50 + i * spacing;
        const above = i % 2 === 0;
        const color = pickAccent(palette, i);
        return (
          <g key={i}>
            {/* tick */}
            <circle cx={x} cy={lineY} r={14} fill={color} stroke={palette.text} strokeWidth={3} />
            {/* connector */}
            <line x1={x} y1={lineY + (above ? -14 : 14)} x2={x} y2={lineY + (above ? -60 : 60)} stroke={palette.text} strokeWidth={2.5} />
            {/* year tag */}
            <rect x={x - 50} y={lineY + (above ? -100 : 70)} width={100} height={32} rx={6} fill={color} stroke={palette.text} strokeWidth={2.5} />
            <text x={x} y={lineY + (above ? -78 : 92)} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={18} fill={palette.bg}>{e.year}</text>
            {/* label */}
            <text x={x} y={lineY + (above ? -118 : 162)} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={20} fill={palette.text}>{truncate(e.label, 18)}</text>
            {e.detail && wrapText(e.detail, x - 90, lineY + (above ? -98 : 188), 180, 14, palette.muted, font).slice(0, 2).map((t, k) => <text key={k} {...t} textAnchor="middle" />)}
          </g>
        );
      })}
    </svg>
  );
}

// ─── TRACE (ASCII-style execution trace) ───────────────────────────
function TraceDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'trace' }>>) {
  const lineH = 32;
  const padX = 30, padY = 30;
  const colorFor = (tone?: TraceLine['tone']): string => {
    switch (tone) {
      case 'input':   return palette.accent1;
      case 'output':  return palette.accent2;
      case 'comment': return palette.muted;
      case 'value':   return palette.accent3;
      case 'arrow':   return palette.accent1;
      default:        return palette.text;
    }
  };
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      <rect x={0} y={0} width={width} height={height} rx={12} fill={palette.surface} stroke={palette.text} strokeWidth={3} />
      <line x1={padX} y1={56} x2={width - padX} y2={56} stroke={palette.text} strokeWidth={1.5} strokeOpacity={0.3} />
      <text x={padX} y={36} fontFamily="JetBrains Mono" fontWeight={700} fontSize={16} fill={palette.muted}>$ python trace.py</text>
      {spec.lines.slice(0, 14).map((ln, i) => (
        <text key={i} x={padX} y={padY + 60 + i * lineH} fontFamily="JetBrains Mono" fontWeight={ln.tone === 'arrow' ? 700 : 500} fontSize={20} fill={colorFor(ln.tone)}>
          {ln.text}
        </text>
      ))}
    </svg>
  );
}

// keep type imports next to consumers
import type { TraceLine, DecisionNode } from '@/lib/types';

// ─── DECISION TREE (with yes/no branches + leaves) ─────────────────
function DecisionDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'decision' }>>) {
  // Render up to 2 levels deep; each internal node is a diamond (question), leaves are rounded rects.
  const root = spec.root;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {renderNode(root, width / 2, 50, width / 2 - 40, 0)}
    </svg>
  );

  function renderNode(node: DecisionNode | { leaf: string } | undefined, cx: number, cy: number, half: number, depth: number): React.ReactNode {
    if (!node) return null;
    if ('leaf' in node) return renderLeaf(node.leaf, cx, cy);
    return (
      <g>
        {/* diamond for the question */}
        <polygon
          points={`${cx},${cy - 36} ${cx + 130},${cy} ${cx},${cy + 36} ${cx - 130},${cy}`}
          fill={pickAccent(palette, depth)} stroke={palette.text} strokeWidth={3}
        />
        {wrapText(node.question, cx - 110, cy - 8, 220, 18, palette.bg, font).slice(0, 2).map((t, k) => <text key={k} {...t} textAnchor="middle" x={cx} fontWeight={700} />)}
        {/* Edges + recursion */}
        {(['yes', 'no'] as const).map((side, i) => {
          const child = node[side];
          if (!child) return null;
          const xDir = side === 'yes' ? -1 : 1;
          const childCx = cx + xDir * Math.max(half, 140);
          const childCy = cy + 140;
          return (
            <g key={side}>
              <line x1={cx + xDir * 110} y1={cy + 24} x2={childCx} y2={childCy - 38} stroke={palette.text} strokeWidth={2.5} />
              <text x={(cx + childCx) / 2 + xDir * 16} y={(cy + childCy) / 2} fontFamily="JetBrains Mono" fontWeight={700} fontSize={16} fill={palette.muted}>
                {side.toUpperCase()}
              </text>
              {renderNode(child, childCx, childCy, Math.max(half / 2, 100), depth + 1)}
            </g>
          );
        })}
      </g>
    );
  }
  function renderLeaf(text: string, cx: number, cy: number) {
    const w = Math.min(260, text.length * 12 + 50);
    return (
      <g>
        <rect x={cx - w / 2} y={cy - 28} width={w} height={56} rx={28} fill={palette.surface} stroke={palette.text} strokeWidth={3} />
        <text x={cx} y={cy + 7} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={20} fill={palette.text}>{truncate(text, 22)}</text>
      </g>
    );
  }
}

// ─── MINDMAP (central node with radial branches) ───────────────────
function MindmapDiagram({ spec, palette, width, height, font }: DProps<Extract<DiagramSpec, { kind: 'mindmap' }>>) {
  const cx = width / 2, cy = height / 2;
  const r = Math.min(width, height) * 0.32;
  const n = spec.branches.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%">
      {/* central */}
      <circle cx={cx} cy={cy} r={88} fill={palette.accent1} stroke={palette.text} strokeWidth={3.5} />
      <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={24} fill={palette.bg}>{truncate(spec.center, 14)}</text>

      {spec.branches.map((b, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        const color = pickAccent(palette, i);
        const labelW = Math.min(220, b.label.length * 14 + 32);
        return (
          <g key={i}>
            <path d={`M ${cx + Math.cos(angle) * 88},${cy + Math.sin(angle) * 88} Q ${cx + Math.cos(angle) * (r * 0.6)},${cy + Math.sin(angle) * (r * 0.6) + 20} ${x},${y}`} stroke={palette.text} strokeWidth={2.5} fill="none" />
            <rect x={x - labelW / 2} y={y - 28} width={labelW} height={56} rx={14} fill={color} stroke={palette.text} strokeWidth={3} />
            <text x={x} y={y + 8} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={20} fill={palette.bg}>{truncate(b.label, 16)}</text>
            {(b.sub || []).slice(0, 2).map((s, k) => {
              const sx = x + Math.cos(angle) * 80;
              const sy = y + 50 + k * 28;
              return <text key={k} x={sx} y={sy} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={15} fill={palette.muted}>· {truncate(s, 22)}</text>;
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ─── helpers ───────────────────────────────────────────────────────
function pickAccent(p: Palette, i: number): string {
  const arr = [p.accent1, p.accent2, p.accent3];
  return arr[i % arr.length];
}
function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
function Arrow({ from, to, color, stroke }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; stroke: string }) {
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x - 14} y2={to.y} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <polygon points={`${to.x},${to.y} ${to.x - 16},${to.y - 9} ${to.x - 16},${to.y + 9}`} fill={color} stroke={stroke} strokeWidth={1.5} />
    </g>
  );
}
function arrowHead(x0: number, y0: number, x1: number, y1: number, size: number): string {
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const p1x = x1, p1y = y1;
  const p2x = x1 - size * Math.cos(angle - 0.5), p2y = y1 - size * Math.sin(angle - 0.5);
  const p3x = x1 - size * Math.cos(angle + 0.5), p3y = y1 - size * Math.sin(angle + 0.5);
  return `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;
}
function wrapText(text: string, x: number, y: number, maxWidth: number, fontSize: number, fill: string, font: string) {
  // Naive char-based wrap (rough). Returns props for each <text> tspan-equivalent.
  const approxCharsPerLine = Math.max(8, Math.floor(maxWidth / (fontSize * 0.55)));
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > approxCharsPerLine) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4).map((line, i) => ({
    x, y: y + i * (fontSize * 1.25),
    fontFamily: font, fontSize, fill,
    children: line,
  }));
}
