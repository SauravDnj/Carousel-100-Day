import { Palette, PaletteId, ThemeId, ThemeMeta } from './types';

export const THEMES: ThemeMeta[] = [
  { id: 'retro-grid', name: 'Retro Grid', mood: 'y2k journal, graph-paper sticker collage', defaultPalette: 'retro-cream' },
  { id: 'dark-cyber', name: 'Dark Cyber', mood: 'neon terminal · hex grid · circuit traces', defaultPalette: 'cyber-neon' },
  { id: 'minimal-swiss', name: 'Minimal Swiss', mood: 'editorial, high-contrast, type-driven', defaultPalette: 'swiss-mono' },
  { id: 'pastel-soft', name: 'Pastel Soft', mood: 'soft gradients, rounded, calm', defaultPalette: 'pastel-rose' },
  { id: 'notebook', name: 'Notebook', mood: 'lined paper, handwritten, sketch', defaultPalette: 'paper-cream' },
  { id: 'glass', name: 'Glass', mood: 'frosted glassmorphism · blur · soft gradient', defaultPalette: 'glass-aurora' },
  { id: 'brutalist', name: 'Brutalist', mood: 'thick borders · hard shadows · raw blocks', defaultPalette: 'brutal-yellow' },
  { id: 'magazine', name: 'Magazine', mood: 'editorial · drop caps · side rule · serif', defaultPalette: 'mag-sunset' },
  { id: 'aurora', name: 'Aurora', mood: 'cosmic dark · aurora ribbons · starfield', defaultPalette: 'aurora-night' },
  { id: 'holographic', name: 'Holographic', mood: 'iridescent · chromatic rings · gradient text', defaultPalette: 'holo-prism' },
  { id: 'risograph', name: 'Risograph', mood: 'offset print · halftone · two-color overprint', defaultPalette: 'riso-fluo' },
  { id: 'comic', name: 'Comic', mood: 'halftone · POW burst · speech bubble · panel border', defaultPalette: 'comic-pop' },
  { id: 'y2k', name: 'Y2K', mood: 'chrome blobs · sparkles · gradient pills · 2000s revival', defaultPalette: 'y2k-chrome' },
  { id: 'holo-mesh', name: 'Holo Mesh', mood: '5-layer gradient mesh · iridescent · dreamy', defaultPalette: 'mesh-rainbow' },
  { id: 'cyber-glitch', name: 'Cyber Glitch', mood: 'RGB-offset · scanlines · CRT glow', defaultPalette: 'glitch-rgb' },
  { id: 'ascii', name: 'ASCII Art', mood: 'terminal box-drawing · monospace · phosphor', defaultPalette: 'ascii-green' },
  { id: 'tape', name: 'Tape', mood: 'VHS / cassette label · color bars · reel spool', defaultPalette: 'tape-vhs' },
  { id: 'cassette', name: 'Cassette B/W', mood: 'audio cassette · side A/B · two reels · mono', defaultPalette: 'cassette-mono' },
  { id: 'notebook-grid', name: 'Notebook Grid', mood: 'engineering grid · ruler · title block', defaultPalette: 'grid-engineer' },
  { id: 'glass-dark', name: 'Glass Dark', mood: 'dark glassmorphism · dev-tools · orbs', defaultPalette: 'gdark-midnight' },
  { id: 'mono-editorial', name: 'Mono Editorial', mood: 'pure B/W · drop cap · rules · serif', defaultPalette: 'mono-classic' },
];

export const PALETTES: Palette[] = [
  // Retro Grid
  { id: 'retro-cream', name: 'Cream + Coral', themeId: 'retro-grid', bg: '#EBE9CC', surface: '#FFFFFF', text: '#1F3A2E', muted: '#5B6A56', accent1: '#E94F2E', accent2: '#D8CFF0', accent3: '#8FA84E' },
  { id: 'retro-mint', name: 'Mint Sticker', themeId: 'retro-grid', bg: '#E4F0DB', surface: '#FFFFFF', text: '#1F3A2E', muted: '#5B6A56', accent1: '#F25C54', accent2: '#FFD166', accent3: '#118AB2' },
  { id: 'retro-peach', name: 'Peach Journal', themeId: 'retro-grid', bg: '#FFE8D6', surface: '#FFFFFF', text: '#3A2E1F', muted: '#7A5A3E', accent1: '#E63946', accent2: '#A8DADC', accent3: '#457B9D' },

  // Dark Cyber
  { id: 'cyber-neon', name: 'Neon Green', themeId: 'dark-cyber', bg: '#0A0E14', surface: '#11161E', text: '#E6F1FF', muted: '#7A8B9B', accent1: '#00FF9C', accent2: '#FF2A6D', accent3: '#05D9E8', pattern: 'hex' },
  { id: 'cyber-violet', name: 'Violet Drift', themeId: 'dark-cyber', bg: '#0B0518', surface: '#160A29', text: '#F0E9FF', muted: '#867CB0', accent1: '#B388FF', accent2: '#FF6EC7', accent3: '#7DF9FF', pattern: 'circuit' },
  { id: 'cyber-emerald', name: 'Emerald Matrix', themeId: 'dark-cyber', bg: '#04130D', surface: '#072018', text: '#D8FFE7', muted: '#6FA48C', accent1: '#39FF14', accent2: '#FFB000', accent3: '#00C2FF', pattern: 'hex' },
  { id: 'cyber-blade', name: 'Blade Runner', themeId: 'dark-cyber', bg: '#180A2A', surface: '#28144A', text: '#FFE9F1', muted: '#9080B0', accent1: '#FF0080', accent2: '#FFD700', accent3: '#00E5FF', pattern: 'circuit' },

  // Minimal Swiss
  { id: 'swiss-mono', name: 'Mono', themeId: 'minimal-swiss', bg: '#F4F1EA', surface: '#FFFFFF', text: '#111111', muted: '#7A7A7A', accent1: '#111111', accent2: '#E63946', accent3: '#FFB703' },
  { id: 'swiss-red', name: 'Red Hot', themeId: 'minimal-swiss', bg: '#F8F4EE', surface: '#FFFFFF', text: '#111111', muted: '#6E6E6E', accent1: '#E63946', accent2: '#111111', accent3: '#FFB703' },
  { id: 'swiss-blue', name: 'Cobalt', themeId: 'minimal-swiss', bg: '#EEF1F5', surface: '#FFFFFF', text: '#0B1B2B', muted: '#506678', accent1: '#0046FF', accent2: '#FF6B00', accent3: '#0B1B2B' },

  // Pastel Soft
  { id: 'pastel-rose', name: 'Rose Cloud', themeId: 'pastel-soft', bg: '#FFE6EE', surface: '#FFFFFF', text: '#3D2A3E', muted: '#866577', accent1: '#FF7AA2', accent2: '#B19CD8', accent3: '#FFD56B' },
  { id: 'pastel-sky', name: 'Sky Breeze', themeId: 'pastel-soft', bg: '#E0F0FF', surface: '#FFFFFF', text: '#1B2A4E', muted: '#5C7095', accent1: '#7AB8FF', accent2: '#FFB5A7', accent3: '#A8E6CF' },
  { id: 'pastel-sage', name: 'Sage Mist', themeId: 'pastel-soft', bg: '#E6F0E0', surface: '#FFFFFF', text: '#2E3D2A', muted: '#5E7256', accent1: '#A8D5BA', accent2: '#FFB5A7', accent3: '#FFD56B' },

  // Notebook
  { id: 'paper-cream', name: 'Cream Paper', themeId: 'notebook', bg: '#FBF7EE', surface: '#FFFFFF', text: '#2B2118', muted: '#7A6A55', accent1: '#D7472D', accent2: '#1F3A8A', accent3: '#0F766E' },
  { id: 'paper-blue', name: 'Blue Ruled', themeId: 'notebook', bg: '#F5F8FF', surface: '#FFFFFF', text: '#0F1B3D', muted: '#5C6B9A', accent1: '#E63946', accent2: '#1F3A8A', accent3: '#0F766E' },
  { id: 'paper-grid', name: 'Engineer Grid', themeId: 'notebook', bg: '#F2F2EC', surface: '#FFFFFF', text: '#222', muted: '#6E6E6E', accent1: '#D7472D', accent2: '#0F766E', accent3: '#1F3A8A' },

  // Glass
  { id: 'glass-aurora', name: 'Aurora', themeId: 'glass', bg: '#FFB5C2', surface: '#FFFFFF', text: '#2B0D3A', muted: '#5C3D6F', accent1: '#FF6EC7', accent2: '#A8C5FF', accent3: '#FFE066', pattern: 'mesh' },
  { id: 'glass-midnight', name: 'Midnight Glass', themeId: 'glass', bg: '#1F2D55', surface: '#FFFFFF', text: '#F0F4FF', muted: '#A8B3D8', accent1: '#7DD3FC', accent2: '#C084FC', accent3: '#34D399', pattern: 'mesh' },
  { id: 'glass-mint', name: 'Mint Glass', themeId: 'glass', bg: '#C7F0DB', surface: '#FFFFFF', text: '#0F3D2E', muted: '#3D6B5A', accent1: '#34D399', accent2: '#7DD3FC', accent3: '#FBBF24', pattern: 'mesh' },

  // Brutalist
  { id: 'brutal-yellow', name: 'Yellow Slab', themeId: 'brutalist', bg: '#FBE94B', surface: '#FFFFFF', text: '#0D0D0D', muted: '#3D3D3D', accent1: '#0D0D0D', accent2: '#FF3D3D', accent3: '#22C55E' },
  { id: 'brutal-pink', name: 'Hot Pink', themeId: 'brutalist', bg: '#FFB5D8', surface: '#FFFFFF', text: '#0D0D0D', muted: '#3D3D3D', accent1: '#0D0D0D', accent2: '#FFE066', accent3: '#5EEAD4' },
  { id: 'brutal-mono', name: 'Mono Brutal', themeId: 'brutalist', bg: '#FFFFFF', surface: '#F4F4F0', text: '#0D0D0D', muted: '#5D5D5D', accent1: '#0D0D0D', accent2: '#FF3D3D', accent3: '#FBE94B' },

  // Magazine
  { id: 'mag-sunset', name: 'Sunset Press', themeId: 'magazine', bg: '#F8EFE3', surface: '#FFFFFF', text: '#1A1410', muted: '#7A6655', accent1: '#D2492A', accent2: '#2A4D69', accent3: '#E8B341' },
  { id: 'mag-cobalt', name: 'Cobalt Print', themeId: 'magazine', bg: '#F0F2F7', surface: '#FFFFFF', text: '#0F1B3D', muted: '#5C6B85', accent1: '#1E40AF', accent2: '#DC2626', accent3: '#F59E0B' },
  { id: 'mag-mint', name: 'Mint Editorial', themeId: 'magazine', bg: '#E8F0EA', surface: '#FFFFFF', text: '#102818', muted: '#4D6655', accent1: '#0F766E', accent2: '#DC2626', accent3: '#F59E0B' },

  // Aurora — true cosmic dark, distinct from Dark Cyber
  { id: 'aurora-night', name: 'Aurora Night', themeId: 'aurora', bg: '#0A0F1F', surface: '#141B33', text: '#E8ECFF', muted: '#7989B3', accent1: '#8B5CF6', accent2: '#22D3EE', accent3: '#F472B6' },
  { id: 'aurora-deep-sea', name: 'Deep Sea', themeId: 'aurora', bg: '#031424', surface: '#0B2238', text: '#DCF4FF', muted: '#638FB5', accent1: '#06B6D4', accent2: '#10B981', accent3: '#FBBF24' },
  { id: 'aurora-amber', name: 'Amber Aurora', themeId: 'aurora', bg: '#1A0F08', surface: '#2A1F15', text: '#FFEDDC', muted: '#A8896B', accent1: '#F97316', accent2: '#EAB308', accent3: '#EC4899' },

  // Holographic
  { id: 'holo-prism', name: 'Prism', themeId: 'holographic', bg: '#FFE5F1', surface: '#FFFFFF', text: '#1F0F2E', muted: '#5C4470', accent1: '#FF6EC7', accent2: '#A8C5FF', accent3: '#FFE066' },
  { id: 'holo-pearl', name: 'Pearl', themeId: 'holographic', bg: '#E5F4FF', surface: '#FFFFFF', text: '#0A1F33', muted: '#4D6680', accent1: '#7DD3FC', accent2: '#C084FC', accent3: '#FECDD3' },
  { id: 'holo-chrome', name: 'Chrome', themeId: 'holographic', bg: '#F0F0F5', surface: '#FFFFFF', text: '#101020', muted: '#6B6B7F', accent1: '#A78BFA', accent2: '#60A5FA', accent3: '#34D399' },

  // Risograph
  { id: 'riso-fluo', name: 'Fluoro', themeId: 'risograph', bg: '#FFF6E5', surface: '#FFFFFF', text: '#1A1410', muted: '#7A6655', accent1: '#FF2D55', accent2: '#FFB400', accent3: '#00B4D8' },
  { id: 'riso-teal', name: 'Teal Press', themeId: 'risograph', bg: '#E8F4F0', surface: '#FFFFFF', text: '#0F2D26', muted: '#4D7066', accent1: '#0F766E', accent2: '#F97316', accent3: '#EC4899' },
  { id: 'riso-cherry', name: 'Cherry', themeId: 'risograph', bg: '#FFEEEE', surface: '#FFFFFF', text: '#1F0A0A', muted: '#7A4D4D', accent1: '#DC2626', accent2: '#1F3A8A', accent3: '#FBBF24' },

  // Comic
  { id: 'comic-pop', name: 'Pop', themeId: 'comic', bg: '#FFE066', surface: '#FFFFFF', text: '#0F0F1F', muted: '#5D5D6F', accent1: '#FF2D55', accent2: '#22D3EE', accent3: '#A78BFA' },
  { id: 'comic-noir', name: 'Noir', themeId: 'comic', bg: '#FAFAFA', surface: '#FFFFFF', text: '#0F0F0F', muted: '#5D5D5D', accent1: '#0F0F0F', accent2: '#FF2D55', accent3: '#FBE94B' },
  { id: 'comic-mint', name: 'Mint Pop', themeId: 'comic', bg: '#A8E6CF', surface: '#FFFFFF', text: '#0A2419', muted: '#3D5C50', accent1: '#FF2D55', accent2: '#FFE066', accent3: '#A78BFA' },

  // Y2K — chrome / metallic
  { id: 'y2k-chrome', name: 'Chrome Dreams', themeId: 'y2k', bg: '#E8EEFA', surface: '#FFFFFF', text: '#0F1428', muted: '#5C658A', accent1: '#8B5CF6', accent2: '#22D3EE', accent3: '#F472B6' },
  { id: 'y2k-bubble', name: 'Bubblegum', themeId: 'y2k', bg: '#FFE3F1', surface: '#FFFFFF', text: '#1F0F2E', muted: '#6E4A78', accent1: '#FF2D9C', accent2: '#22D3EE', accent3: '#FFD93D' },
  { id: 'y2k-cyber',  name: 'Cyber 2K', themeId: 'y2k', bg: '#0B1428', surface: '#1A2347', text: '#F0F4FF', muted: '#8A99C8', accent1: '#FF2D9C', accent2: '#22D3EE', accent3: '#FFD93D' },

  // Holo Mesh
  { id: 'mesh-rainbow', name: 'Rainbow Mesh', themeId: 'holo-mesh', bg: '#FFE5F1', surface: '#FFFFFF', text: '#1F0F2E', muted: '#5C4470', accent1: '#FF6EC7', accent2: '#A8C5FF', accent3: '#FFE066' },
  { id: 'mesh-ocean',   name: 'Ocean Mesh',   themeId: 'holo-mesh', bg: '#E5F4FF', surface: '#FFFFFF', text: '#0A1F33', muted: '#4D6680', accent1: '#22D3EE', accent2: '#A78BFA', accent3: '#34D399' },
  { id: 'mesh-sunset',  name: 'Sunset Mesh',  themeId: 'holo-mesh', bg: '#FFE8D6', surface: '#FFFFFF', text: '#3A1F08', muted: '#7A5A3E', accent1: '#F97316', accent2: '#EC4899', accent3: '#FBBF24' },

  // Cyber Glitch
  { id: 'glitch-rgb',   name: 'RGB Glitch',   themeId: 'cyber-glitch', bg: '#0A0A14', surface: '#11111E', text: '#FFFFFF', muted: '#7A7A8A', accent1: '#FF003C', accent2: '#FFD400', accent3: '#00FFFF' },
  { id: 'glitch-toxic', name: 'Toxic Glitch', themeId: 'cyber-glitch', bg: '#070C0A', surface: '#0F1B14', text: '#E8FFE8', muted: '#669966', accent1: '#39FF14', accent2: '#FF2D9C', accent3: '#00E5FF' },
  { id: 'glitch-mono',  name: 'Mono Glitch',  themeId: 'cyber-glitch', bg: '#0A0A0A', surface: '#1A1A1A', text: '#FAFAFA', muted: '#7A7A7A', accent1: '#FF003C', accent2: '#FFFFFF', accent3: '#FFD400' },

  // ASCII
  { id: 'ascii-green', name: 'Phosphor',  themeId: 'ascii', bg: '#040804', surface: '#0A140A', text: '#88FF88', muted: '#449944', accent1: '#33FF66', accent2: '#FFD000', accent3: '#00C2FF' },
  { id: 'ascii-amber', name: 'Amber CRT', themeId: 'ascii', bg: '#0E0700', surface: '#1A0F00', text: '#FFC470', muted: '#996A33', accent1: '#FF9933', accent2: '#FFE066', accent3: '#FF3D6E' },
  { id: 'ascii-mono',  name: 'Mono Term', themeId: 'ascii', bg: '#000000', surface: '#0A0A0A', text: '#E8E8E8', muted: '#7A7A7A', accent1: '#FFFFFF', accent2: '#FF003C', accent3: '#FFD000' },

  // Tape
  { id: 'tape-cream', name: 'Cream Label', themeId: 'tape', bg: '#F4ECDC', surface: '#FFFFFF', text: '#1F140A', muted: '#7A6A4A', accent1: '#D7472D', accent2: '#1F3A8A', accent3: '#FBBF24' },
  { id: 'tape-vhs',   name: 'VHS Stack',   themeId: 'tape', bg: '#FFF1E0', surface: '#FFFFFF', text: '#0F0F1F', muted: '#5C5C6E', accent1: '#FF2D55', accent2: '#22D3EE', accent3: '#FBBF24' },
  { id: 'tape-bbg',   name: 'Black + Yellow', themeId: 'tape', bg: '#FAFAF0', surface: '#FFFFFF', text: '#0A0A0A', muted: '#5A5A5A', accent1: '#FBBF24', accent2: '#0A0A0A', accent3: '#FF3D55' },

  // Cassette B/W — minimalist audio cassette
  { id: 'cassette-mono',      name: 'Mono Chrome',   themeId: 'cassette', bg: '#F4F4F0', surface: '#FFFFFF', text: '#0A0A0A', muted: '#5A5A5A', accent1: '#0A0A0A', accent2: '#5A5A5A', accent3: '#FBE94B' },
  { id: 'cassette-cream',     name: 'Cream Tape',    themeId: 'cassette', bg: '#F0E8D8', surface: '#FFFAF0', text: '#1A1410', muted: '#7A6655', accent1: '#1A1410', accent2: '#7A6655', accent3: '#D7472D' },
  { id: 'cassette-blueprint', name: 'Blueprint',     themeId: 'cassette', bg: '#1E3A5F', surface: '#2D4F7A', text: '#E6F0FF', muted: '#90A8C8', accent1: '#FFFFFF', accent2: '#A8B8D0', accent3: '#FFD93D' },

  // Notebook Grid
  { id: 'grid-engineer', name: 'Engineer',    themeId: 'notebook-grid', bg: '#F4F1EA', surface: '#FFFFFF', text: '#0A0A0A', muted: '#6B6B6B', accent1: '#D7472D', accent2: '#1F3A8A', accent3: '#0F766E' },
  { id: 'grid-dot',      name: 'Dot Grid',    themeId: 'notebook-grid', bg: '#FCFAF4', surface: '#FFFFFF', text: '#1A1410', muted: '#8A8270', accent1: '#FF6B35', accent2: '#0F766E', accent3: '#9333EA' },
  { id: 'grid-iso',      name: 'Isometric',   themeId: 'notebook-grid', bg: '#EBF4FF', surface: '#FFFFFF', text: '#0F1B3D', muted: '#5C6B85', accent1: '#1E40AF', accent2: '#0F766E', accent3: '#F59E0B' },

  // Glass Dark
  { id: 'gdark-midnight', name: 'Midnight',  themeId: 'glass-dark', bg: '#070B17', surface: '#0F1428', text: '#EEF2FF', muted: '#7A89B0', accent1: '#7DD3FC', accent2: '#C084FC', accent3: '#34D399' },
  { id: 'gdark-violet',   name: 'Violet',    themeId: 'glass-dark', bg: '#0F0820', surface: '#1A1235', text: '#F0E9FF', muted: '#9080B8', accent1: '#B388FF', accent2: '#FF6EC7', accent3: '#7DF9FF' },
  { id: 'gdark-emerald',  name: 'Emerald',   themeId: 'glass-dark', bg: '#04130D', surface: '#0A1F18', text: '#D8FFE7', muted: '#6FA48C', accent1: '#34D399', accent2: '#FBBF24', accent3: '#22D3EE' },

  // Mono Editorial
  { id: 'mono-classic', name: 'Classic',     themeId: 'mono-editorial', bg: '#F8F4ED', surface: '#FFFFFF', text: '#0A0A0A', muted: '#5A5A5A', accent1: '#0A0A0A', accent2: '#5A5A5A', accent3: '#0A0A0A' },
  { id: 'mono-warm',    name: 'Warm Press',  themeId: 'mono-editorial', bg: '#EFE6D2', surface: '#FBF5E6', text: '#1A140A', muted: '#7A6655', accent1: '#1A140A', accent2: '#7A6655', accent3: '#1A140A' },
  { id: 'mono-stark',   name: 'Stark',       themeId: 'mono-editorial', bg: '#FFFFFF', surface: '#F8F8F8', text: '#000000', muted: '#404040', accent1: '#000000', accent2: '#606060', accent3: '#000000' },
];

export function getPalette(id: PaletteId): Palette {
  const p = PALETTES.find(p => p.id === id);
  if (!p) throw new Error(`Unknown palette: ${id}`);
  return p;
}

export function palettesForTheme(themeId: ThemeId): Palette[] {
  return PALETTES.filter(p => p.themeId === themeId);
}

export function getTheme(id: ThemeId): ThemeMeta {
  const t = THEMES.find(t => t.id === id);
  if (!t) throw new Error(`Unknown theme: ${id}`);
  return t;
}
