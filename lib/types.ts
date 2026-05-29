// Core data model for the carousel factory.

export type Category =
  | 'AI Fundamentals'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'NLP & LLMs'
  | 'RAG'
  | 'AI Agents'
  | 'Computer Vision'
  | 'Python'
  | 'JavaScript / TypeScript'
  | 'SQL Databases'
  | 'NoSQL Databases'
  | 'Vector Databases'
  | 'AI Tools'
  | 'Prompt Engineering'
  | 'MLOps'
  | 'Data Engineering'
  | 'Math for ML'
  | 'Production AI';

export interface DayTopic {
  day: number;             // 1..100
  category: Category;
  theme: string;           // e.g. "Intro to Neural Networks"
  posts: PostTopic[];      // exactly 5
}

export interface PostTopic {
  postIdx: number;         // 1..5 within the day
  title: string;           // headline for the post
  angle: PostAngle;        // which lens
  hashtags: string[];      // 8-15 tags
  slides?: SlideContent[]; // optional fully-authored content; falls back to template
}

export type PostAngle =
  | 'Concept'
  | 'Why It Matters'
  | 'How It Works'
  | 'Code Example'
  | 'Common Mistakes'
  | 'Interview Q&A'
  | 'Real World'
  | 'Comparison'
  | 'Quick Tips';

export interface SlideContent {
  kind: SlideKind;
  title?: string;
  body?: string;
  bullets?: string[];
  code?: string;
  codeLang?: string;
  sticker?: string;
  emoji?: string;
  diagram?: DiagramSpec;
  /** Uploaded image as a data URL. On an `image` slide it's the hero;
   *  on any other slide it renders as a framed photo overlay. */
  image?: string;
  /** How an `image`-kind hero fits its frame. Default 'cover'. */
  imageFit?: 'cover' | 'contain';
  /** Corner for the photo overlay on non-image slides. Default 'tr'. */
  imagePos?: 'tl' | 'tr' | 'bl' | 'br';
  /** Size of the photo overlay on non-image slides. Default 'md'. */
  imageSize?: 'sm' | 'md' | 'lg';
}

export type SlideKind =
  | 'cover'
  | 'definition'
  | 'why'
  | 'how'
  | 'steps'
  | 'code'
  | 'comparison'
  | 'tips'
  | 'mistake'
  | 'visual'
  | 'cta'
  | 'diagram'
  | 'image';

export type DiagramSpec =
  | { kind: 'flow';     nodes: DiagramNode[] }
  | { kind: 'pipeline'; stages: DiagramStage[] }
  | { kind: 'network';  layers: number[]; labels?: string[] }
  | { kind: 'vectors';  vectors: DiagramVector[] }
  | { kind: 'cycle';    nodes: DiagramNode[] }
  | { kind: 'compare';  left: DiagramSide; right: DiagramSide }
  | { kind: 'stack';    levels: DiagramLevel[] }
  | { kind: 'tree';     root: DiagramTreeNode }
  | { kind: 'bars';     bars: DiagramBar[]; axisLabel?: string }
  | { kind: 'timeline'; events: DiagramEvent[] }
  | { kind: 'trace';    lines: TraceLine[] }
  | { kind: 'decision'; root: DecisionNode }
  | { kind: 'mindmap';  center: string; branches: MindBranch[] };

export interface DecisionNode {
  question: string;
  yes?: DecisionNode | { leaf: string };
  no?:  DecisionNode | { leaf: string };
}
export interface MindBranch { label: string; sub?: string[] }

export interface DiagramBar { label: string; value: number; sub?: string }
export interface DiagramEvent { year: string; label: string; detail?: string }
export interface TraceLine { text: string; tone?: 'input' | 'output' | 'comment' | 'value' | 'arrow' | 'plain' }

export interface DiagramNode { label: string; sub?: string; icon?: string }
export interface DiagramStage { label: string; icon?: string; detail?: string }
export interface DiagramVector { label: string; x: number; y: number; color?: string }
export interface DiagramSide { title: string; items: string[]; accent?: string }
export interface DiagramLevel { label: string; sub?: string }
export interface DiagramTreeNode { label: string; children?: DiagramTreeNode[] }

export type ThemeId = 'retro-grid' | 'dark-cyber' | 'minimal-swiss' | 'pastel-soft' | 'notebook' | 'glass' | 'brutalist' | 'magazine' | 'aurora' | 'holographic' | 'risograph' | 'comic' | 'y2k' | 'holo-mesh' | 'cyber-glitch' | 'ascii' | 'tape' | 'cassette' | 'notebook-grid' | 'glass-dark' | 'mono-editorial' | 'blueprint' | 'newsprint' | 'vaporwave' | 'memphis' | 'chalkboard';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  mood: string;
  defaultPalette: PaletteId;
}

export type PaletteId =
  | 'retro-cream'
  | 'retro-mint'
  | 'retro-peach'
  | 'cyber-neon'
  | 'cyber-violet'
  | 'cyber-emerald'
  | 'cyber-blade'
  | 'swiss-mono'
  | 'swiss-red'
  | 'swiss-blue'
  | 'pastel-rose'
  | 'pastel-sky'
  | 'pastel-sage'
  | 'paper-cream'
  | 'paper-blue'
  | 'paper-grid'
  | 'glass-aurora'
  | 'glass-midnight'
  | 'glass-mint'
  | 'brutal-yellow'
  | 'brutal-pink'
  | 'brutal-mono'
  | 'mag-sunset'
  | 'mag-cobalt'
  | 'mag-mint'
  | 'aurora-night'
  | 'aurora-deep-sea'
  | 'aurora-amber'
  | 'holo-prism'
  | 'holo-pearl'
  | 'holo-chrome'
  | 'riso-fluo'
  | 'riso-teal'
  | 'riso-cherry'
  | 'comic-pop'
  | 'comic-noir'
  | 'comic-mint'
  | 'y2k-chrome'
  | 'y2k-bubble'
  | 'y2k-cyber'
  | 'mesh-rainbow'
  | 'mesh-ocean'
  | 'mesh-sunset'
  | 'glitch-rgb'
  | 'glitch-toxic'
  | 'glitch-mono'
  | 'ascii-green'
  | 'ascii-amber'
  | 'ascii-mono'
  | 'tape-cream'
  | 'tape-vhs'
  | 'tape-bbg'
  | 'cassette-mono'
  | 'cassette-cream'
  | 'cassette-blueprint'
  | 'grid-engineer'
  | 'grid-dot'
  | 'grid-iso'
  | 'gdark-midnight'
  | 'gdark-violet'
  | 'gdark-emerald'
  | 'mono-classic'
  | 'mono-warm'
  | 'mono-stark'
  | 'blueprint-classic'
  | 'blueprint-noir'
  | 'blueprint-sepia'
  | 'news-classic'
  | 'news-tabloid'
  | 'news-vintage'
  | 'vapor-sunset'
  | 'vapor-miami'
  | 'vapor-night'
  | 'memphis-pop'
  | 'memphis-pastel'
  | 'memphis-bold'
  | 'chalk-green'
  | 'chalk-black'
  | 'chalk-blue'
  // —— extra palettes (round 2): 2 more per theme ——
  | 'retro-sky' | 'retro-berry'
  | 'cyber-ice' | 'cyber-sunset'
  | 'swiss-forest' | 'swiss-amber'
  | 'pastel-lilac' | 'pastel-peach'
  | 'paper-sage' | 'paper-rose'
  | 'glass-coral' | 'glass-violet'
  | 'brutal-blue' | 'brutal-green'
  | 'mag-rose' | 'mag-forest'
  | 'aurora-rose' | 'aurora-emerald'
  | 'holo-mint' | 'holo-sunset'
  | 'riso-indigo' | 'riso-mustard'
  | 'comic-sky' | 'comic-sunset'
  | 'y2k-lime' | 'y2k-violet'
  | 'mesh-violet' | 'mesh-lime'
  | 'glitch-cyan' | 'glitch-amber'
  | 'ascii-cyan' | 'ascii-magenta'
  | 'tape-teal' | 'tape-rose'
  | 'cassette-rust' | 'cassette-forest'
  | 'grid-sepia' | 'grid-rose'
  | 'gdark-rose' | 'gdark-amber'
  | 'mono-ink' | 'mono-slate'
  | 'blueprint-mint' | 'blueprint-rose'
  | 'news-ink' | 'news-sage'
  | 'vapor-lime' | 'vapor-ice'
  | 'memphis-sky' | 'memphis-mint'
  | 'chalk-rose' | 'chalk-sepia';

export interface Palette {
  id: PaletteId;
  name: string;
  themeId: ThemeId;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent1: string;
  accent2: string;
  accent3: string;
  /** optional decorative pattern overlay */
  pattern?: 'none' | 'dots' | 'lines' | 'grid' | 'hex' | 'circuit' | 'wave' | 'mesh';
}

export interface Brand {
  name: string;
  instagram: string;
  github: string;
  linkedin: string;
}

export const BRAND: Brand = {
  name: 'Saurav Danej',
  instagram: 'saurav_dnj_24',
  github: 'SauravDnj',
  linkedin: 'sauravdnj',
};
