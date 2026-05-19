// Per-file targeted glyph restoration. Each entry is [filename, old, new].
// Uses literal string replace (not regex) for safety. Glyphs written as
// \uXXXX escapes so this script stays ASCII-safe.
import { readFileSync, writeFileSync } from 'fs';

const fixes = [
  // RetroGrid: → / ♥
  ['components/themes/RetroGrid.tsx', "{index < total - 1 ? '� ' : '�\"�'}", "{index < total - 1 ? '→' : '♥'}"],

  // Aurora: ↓ / ✦
  ['components/themes/Aurora.tsx', "/* Aurora streaks � flowing ribbons of color */", "/* Aurora streaks - flowing ribbons of color */"],
  ['components/themes/Aurora.tsx', "�S� {dayLabel}", "✨ {dayLabel}"],
  ['components/themes/Aurora.tsx', "�S� {slide.sticker.replace('DAY-X', dayLabel)}", "✨ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Aurora.tsx', "{index < total - 1 ? '� ' : '�S�'}", "{index < total - 1 ? '↓' : '✦'}"],

  // Brutalist: ★ / → / ∎
  ['components/themes/Brutalist.tsx', "��& {slide.sticker.replace('DAY-X', dayLabel)}", "★ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Brutalist.tsx', "{index < total - 1 ? '�  NEXT' : '��} END'}", "{index < total - 1 ? '→ NEXT' : '∎ END'}"],

  // Cassette: comments + REC + arrows
  ['components/themes/Cassette.tsx', "/* Cassette body � slightly off-square */", "/* Cassette body - slightly off-square */"],
  ['components/themes/Cassette.tsx', "/* Tape reels � two circles */", "/* Tape reels - two circles */"],
  ['components/themes/Cassette.tsx', "/* Bottom strip � handle + recording metadata */", "/* Bottom strip - handle + recording metadata */"],
  // Cassette has '● REC ·' pattern at line 73 - the bullet may also be broken. Let me read first.

  // Comic: ★ / WHAM →
  ['components/themes/Comic.tsx', "��& {dayLabel}", "★ {dayLabel}"],
  ['components/themes/Comic.tsx', "�a� {slide.sticker.replace('DAY-X', dayLabel)}", "⚡ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Comic.tsx', "{index < total - 1 ? 'WHAM � ' : '��& FIN ��&'}", "{index < total - 1 ? 'WHAM →' : '★ FIN ★'}"],

  // DarkCyber: — (em dash) in a comment + sticker arrow
  ['components/themes/DarkCyber.tsx', "/* Glow accents � two corners */", "/* Glow accents - two corners */"],
  ['components/themes/DarkCyber.tsx', "�� {slide.sticker.replace('DAY-X', dayLabel)}", "▸ {slide.sticker.replace('DAY-X', dayLabel)}"],

  // Glass: ◆ / → / ✦
  ['components/themes/Glass.tsx', "�  {slide.sticker.replace('DAY-X', dayLabel)}", "◆ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Glass.tsx', "{index < total - 1 ? '� ' : '�S�'}", "{index < total - 1 ? '→' : '✦'}"],

  // GlassDark: ◆ sticker + arrow
  ['components/themes/GlassDark.tsx', "}}>�  {slide.sticker.replace('DAY-X', dayLabel)}", "}}>◆ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/GlassDark.tsx', "{index < total - 1 ? '� ' : '�S�'}", "{index < total - 1 ? '→' : '✦'}"],

  // Holographic: ◈ tag, ✦ sticker, → /✦
  ['components/themes/Holographic.tsx', "}}>�� {dayLabel}", "}}>◈ {dayLabel}"],
  ['components/themes/Holographic.tsx', "�S� {slide.sticker.replace('DAY-X', dayLabel)}", "✦ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Holographic.tsx', "{index < total - 1 ? '� ' : '�S�'}", "{index < total - 1 ? '→' : '✦'}"],

  // HoloMesh: ◈ / ◇ / → / ✦
  ['components/themes/HoloMesh.tsx', "}}>�� {dayLabel}", "}}>◈ {dayLabel}"],
  ['components/themes/HoloMesh.tsx', "}}>�! {slide.sticker.replace('DAY-X', dayLabel)}", "}}>◇ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/HoloMesh.tsx', "{index < total - 1 ? '� ' : '�S�'}", "{index < total - 1 ? '→' : '✦'}"],

  // Magazine: em-dash + sticker hex + arrow
  ['components/themes/Magazine.tsx', "The Carousel � vol. {dayLabel.replace('DAY ', '')}", "The Carousel — vol. {dayLabel.replace('DAY ', '')}"],
  ['components/themes/Magazine.tsx', "� {slide.sticker.replace('DAY-X', dayLabel)}", "❚ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Magazine.tsx', "{index < total - 1 ? 'continue � ' : 'fin.'}", "{index < total - 1 ? 'continue →' : 'fin.'}"],

  // MinimalSwiss: em-dash / swipe arrow
  ['components/themes/MinimalSwiss.tsx', "� {slide.sticker.replace('DAY-X', dayLabel)}", "— {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/MinimalSwiss.tsx', "<span style={{ ...mono, color: palette.text }}>�  swipe</span>", "<span style={{ ...mono, color: palette.text }}>→ swipe</span>"],

  // MonoEditorial: № (№) + continue
  ['components/themes/MonoEditorial.tsx', "� {dayLabel.replace('DAY ', '')}", "№ {dayLabel.replace('DAY ', '')}"],
  ['components/themes/MonoEditorial.tsx', "{index < total - 1 ? 'continue overleaf � ' : 'fin.'}", "{index < total - 1 ? 'continue overleaf →' : 'fin.'}"],

  // Notebook: 📝 (📝) / ★ sticker / em dash before handle / turn → / the end ♥ / bullet glyphs
  ['components/themes/Notebook.tsx', "�x� {dayLabel}", "📝 {dayLabel}"],
  ['components/themes/Notebook.tsx', "��& {slide.sticker.replace('DAY-X', dayLabel)}", "★ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Notebook.tsx', "� @{brand.instagram}", "— @{brand.instagram}"],
  ['components/themes/Notebook.tsx', "{index < total - 1 ? 'turn � ' : 'the end �\"�'}", "{index < total - 1 ? 'turn →' : 'the end ♥'}"],
  ['components/themes/Notebook.tsx', "['� ', '�S', '��&', '� ', '�S�', '⬢', '��\"',", "['→', '✓', '★', '◆', '✦', '•', '∙', '◊',"],

  // NotebookGrid: № / ◇ sticker / → NEXT / ◼ END
  ['components/themes/NotebookGrid.tsx', "� {dayLabel.replace('DAY ', 'F-')}", "№ {dayLabel.replace('DAY ', 'F-')}"],
  ['components/themes/NotebookGrid.tsx', "}}>�! {slide.sticker.replace('DAY-X', dayLabel)}", "}}>◇ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/NotebookGrid.tsx', "{index < total - 1 ? `�  NEXT (${index + 2}/${total})` : '�� END'}", "{index < total - 1 ? `→ NEXT (${index + 2}/${total})` : '◼ END'}"],

  // PastelSoft: ✦ sticker
  ['components/themes/PastelSoft.tsx', "�S� {dayLabel}", "✦ {dayLabel}"],
  ['components/themes/PastelSoft.tsx', "}}>� </div>", "}}>→</div>"],

  // Risograph: ▲ sticker / NEXT →
  ['components/themes/Risograph.tsx', "�� {slide.sticker.replace('DAY-X', dayLabel)}", "▲ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Risograph.tsx', "{index < total - 1 ? 'NEXT � ' : 'END.'}", "{index < total - 1 ? 'NEXT →' : 'END.'}"],

  // Tape: comments + ◉ + ★ sticker + ▶▶ FFWD / ■ STOP
  ['components/themes/Tape.tsx', "/* VHS tape body � outer label */", "/* VHS tape body - outer label */"],
  ['components/themes/Tape.tsx', "/* Color strip across the top � like a real VHS label */", "/* Color strip across the top - like a real VHS label */"],
  ['components/themes/Tape.tsx', "�0 {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}", "◉ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}"],
  ['components/themes/Tape.tsx', "}}>��& {slide.sticker.replace('DAY-X', dayLabel)}", "}}>★ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Tape.tsx', "{index < total - 1 ? '���� FFWD' : '�� STOP'}", "{index < total - 1 ? '▶▶ FFWD' : '■ STOP'}"],

  // Y2K: ★ tag, ▸ idx, ⟡ sticker, NEXT ▸ / ∞ END
  ['components/themes/Y2K.tsx', "}}>��& {dayLabel} ��&</span>", "}}>★ {dayLabel} ★</span>"],
  ['components/themes/Y2K.tsx', "�� {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}", "▸ {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}"],
  ['components/themes/Y2K.tsx', "�x� {slide.sticker.replace('DAY-X', dayLabel)}", "⟡ {slide.sticker.replace('DAY-X', dayLabel)}"],
  ['components/themes/Y2K.tsx', "{index < total - 1 ? 'NEXT ��' : '��~ END'}", "{index < total - 1 ? 'NEXT ▸' : '∞ END'}"],

  // ASCII: box drawing TOP/BOTTOM, NEXT arrow, tree branches
  ['components/themes/Ascii.tsx', "const TOP    = '�R' + '��'.repeat(78) + '��';", "const TOP    = '┌' + '─'.repeat(78) + '┐';"],
  ['components/themes/Ascii.tsx', "const BOTTOM = '�' + '��'.repeat(78) + '��';", "const BOTTOM = '└' + '─'.repeat(78) + '┘';"],
  ['components/themes/Ascii.tsx', "{index < total - 1 ? '������ ' + (index + 2) : '��� END ���'}", "{index < total - 1 ? '──▶ ' + (index + 2) : '─ END ─'}"],
  ['components/themes/Ascii.tsx', "{i === 0 ? '�S���' : i === slide.bullets.length - 1 ? '�", "{i === 0 ? '├──' : i === slide.bullets.length - 1 ? '└──' : '├──"],
];

let touched = new Set();
for (const [file, oldStr, newStr] of fixes) {
  const c = readFileSync(file, 'utf8');
  if (c.includes(oldStr)) {
    writeFileSync(file, c.replaceAll(oldStr, newStr), 'utf8');
    touched.add(file);
  } else {
    // try .replace with the same pattern (single replacement)
    if (c.indexOf(oldStr) !== -1) console.log('SKIPPED (not found exact):', file, oldStr.slice(0, 40));
  }
}
console.log(`\nFiles touched: ${touched.size}`);
for (const f of touched) console.log('  -', f);
