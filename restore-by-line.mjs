// Line-number based replacement. For each (file, lineNumber, newLineContent),
// we replace that line entirely. This bypasses the broken-byte matching problem.
import { readFileSync, writeFileSync } from 'fs';

// Each entry: [file, lineNumber (1-based), full replacement line]
const fixes = [
  ['components/themes/Ascii.tsx', 7,  `const TOP    = '┌' + '─'.repeat(78) + '┐';`],
  ['components/themes/Ascii.tsx', 8,  `const BOTTOM = '└' + '─'.repeat(78) + '┘';`],
  ['components/themes/Ascii.tsx', 60, `        <span style={{ color: palette.accent2, fontSize: 22, fontWeight: 700 }}>{index < total - 1 ? '──▶ ' + (index + 2) : '─ END ─'}</span>`],
  ['components/themes/Ascii.tsx', 97, `            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12, fontSize: 22, lineHeight: 1.45, color: palette.text }}>`],
  // Line 97 might be the bullets li — need to keep tree branches inside. The grep showed it was the bullet markers.
  // Let me check that one separately.

  ['components/themes/Aurora.tsx', 16, `      {/* Aurora streaks - flowing ribbons of color */}`],
  ['components/themes/Aurora.tsx', 84, `        <span style={{ fontSize: 36, color: palette.accent2, fontWeight: 700 }}>{index < total - 1 ? '↓' : '✦'}</span>`],

  ['components/themes/Brutalist.tsx', 61, `          }}>{index < total - 1 ? '→ NEXT' : '∎ END'}</span>`],

  ['components/themes/Cassette.tsx', 17, `      {/* Cassette body - slightly off-square */}`],
  ['components/themes/Cassette.tsx', 45, `        {/* Tape reels - two circles */}`],
  ['components/themes/Cassette.tsx', 70, `        {/* Bottom strip - handle + recording metadata */}`],
  ['components/themes/Cassette.tsx', 73, `            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 16, letterSpacing: '0.15em', color: palette.text }}>● REC · @{brand.instagram.toUpperCase()}</span>`],
  ['components/themes/Cassette.tsx', 76, `          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: 18, color: palette.text, letterSpacing: '0.1em' }}>{index < total - 1 ? '▷▷ FF' : '◼ STOP'}</span>`],

  ['components/themes/Comic.tsx', 94, `          }}>{index < total - 1 ? 'WHAM →' : '★ FIN ★'}</span>`],

  ['components/themes/DarkCyber.tsx', 42, `      {/* Glow accents - two corners */}`],
  ['components/themes/DarkCyber.tsx', 83, `            ▸ {slide.sticker.replace('DAY-X', dayLabel)}`],

  ['components/themes/Glass.tsx', 49, `            ◆ {slide.sticker.replace('DAY-X', dayLabel)}</div>`],
  ['components/themes/Glass.tsx', 62, `          <span style={{ fontSize: 42, color: palette.text, opacity: 0.85, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>`],

  ['components/themes/GlassDark.tsx', 63, `          }}>◆ {slide.sticker.replace('DAY-X', dayLabel)}</div>`],
  ['components/themes/GlassDark.tsx', 75, `          <span style={{ fontSize: 32, color: palette.accent1, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>`],

  ['components/themes/Holographic.tsx', 49, `          }}>◈ {dayLabel}</span>`],
  ['components/themes/Holographic.tsx', 76, `          <span style={{ fontSize: 42, color: palette.text, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>`],

  ['components/themes/HoloMesh.tsx', 31, `        }}>◈ {dayLabel}</div>`],
  ['components/themes/HoloMesh.tsx', 55, `          }}>◇ {slide.sticker.replace('DAY-X', dayLabel)}</div>`],
  ['components/themes/HoloMesh.tsx', 66, `        <span style={{ fontSize: 36, color: palette.text, fontWeight: 700 }}>{index < total - 1 ? '→' : '✦'}</span>`],

  ['components/themes/Magazine.tsx', 38, `          The Carousel — vol. {dayLabel.replace('DAY ', '')}`],
  ['components/themes/Magazine.tsx', 57, `            ❚ {slide.sticker.replace('DAY-X', dayLabel)}`],
  ['components/themes/Magazine.tsx', 86, `          {index < total - 1 ? 'continue →' : 'fin.'}`],

  ['components/themes/MinimalSwiss.tsx', 27, `            — {slide.sticker.replace('DAY-X', dayLabel)}`],
  ['components/themes/MinimalSwiss.tsx', 48, `        <span style={{ ...mono, color: palette.text }}>→ swipe</span>`],

  ['components/themes/MonoEditorial.tsx', 31, `          № {dayLabel.replace('DAY ', '')} · Folio {String(index + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}`],
  ['components/themes/MonoEditorial.tsx', 75, `          {index < total - 1 ? 'continue overleaf →' : 'fin.'}`],

  ['components/themes/Notebook.tsx', 29, `        <span style={{ fontFamily: '"Caveat", cursive', fontSize: 36, color: palette.accent1 }}>✎ {dayLabel}</span>`],
  ['components/themes/Notebook.tsx', 51, `          <span style={{ fontFamily: '"Caveat", cursive', fontSize: 32, color: palette.text, lineHeight: 1.1 }}>— @{brand.instagram}</span>`],
  ['components/themes/Notebook.tsx', 55, `          {index < total - 1 ? 'turn →' : 'the end ♥'}`],
  ['components/themes/Notebook.tsx', 101, `              <span style={{ color: palette.accent1, fontWeight: 700, fontSize: 44 }}>{['→','✓','★','◆','✦','•','∙','◊'][i % 8]}</span>`],

  ['components/themes/NotebookGrid.tsx', 51, `          № {dayLabel.replace('DAY ', 'F-')} · REV.{String(index + 1).padStart(2, '0')}`],
  ['components/themes/NotebookGrid.tsx', 65, `          }}>◇ {slide.sticker.replace('DAY-X', dayLabel)}</div>`],
  ['components/themes/NotebookGrid.tsx', 91, `        {index < total - 1 ? \`→ NEXT (\${index + 2}/\${total})\` : '◼ END'}`],

  ['components/themes/PastelSoft.tsx', 27, `        }}>✦ {dayLabel}</span>`],
  ['components/themes/PastelSoft.tsx', 57, `        }}>→</div>`],

  ['components/themes/Risograph.tsx', 56, `            ▲ {slide.sticker.replace('DAY-X', dayLabel)}</div>`],
  ['components/themes/Risograph.tsx', 71, `        }}>{index < total - 1 ? 'NEXT →' : 'END.'}</span>`],

  ['components/themes/Tape.tsx', 16, `      {/* VHS tape body - outer label */}`],
  ['components/themes/Tape.tsx', 23, `        {/* Color strip across the top - like a real VHS label */}`],
  ['components/themes/Tape.tsx', 35, `            ◉ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}`],
  ['components/themes/Tape.tsx', 57, `          }}>★ {slide.sticker.replace('DAY-X', dayLabel)}</div>`],
  ['components/themes/Tape.tsx', 72, `            {index < total - 1 ? '▶▶ FFWD' : '■ STOP'}`],

  ['components/themes/Y2K.tsx', 60, `        }}>★ {dayLabel} ★</span>`],
  ['components/themes/Y2K.tsx', 62, `          ▸ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}`],
  ['components/themes/Y2K.tsx', 76, `            ⟡ {slide.sticker.replace('DAY-X', dayLabel)}`],
  ['components/themes/Y2K.tsx', 93, `        }}>{index < total - 1 ? 'NEXT ▸' : '∞ END'}</span>`],

  ['components/themes/RetroGrid.tsx', 56, `          {index < total - 1 ? '→' : '♥'}`],
];

// Group by file
const byFile = {};
for (const [file, lineNo, content] of fixes) {
  byFile[file] = byFile[file] || [];
  byFile[file].push([lineNo, content]);
}

let touched = 0;
for (const [file, entries] of Object.entries(byFile)) {
  const c = readFileSync(file, 'utf8');
  const lines = c.split('\n');
  for (const [lineNo, content] of entries) {
    lines[lineNo - 1] = content;
  }
  writeFileSync(file, lines.join('\n'), 'utf8');
  touched++;
}
console.log(`${touched} files restored`);
