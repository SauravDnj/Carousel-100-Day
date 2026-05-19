// Fix UTF-8 double-encoding caused by PowerShell Set-Content -Encoding utf8 on files
// that contained non-ASCII glyphs. Also fixes the linkedlinkedin double-replacement.
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dir = 'D:/Saurav/personal/Carousel/Code/components/themes';
const files = readdirSync(dir).filter(f => f.endsWith('.tsx'));

let total = 0;
for (const f of files) {
  const p = join(dir, f);
  const buf = readFileSync(p);
  const utf8 = buf.toString('utf8');

  // Detect mojibake: presence of "Â" sequences usually means UTF-8 was decoded as Latin-1
  // then re-encoded as UTF-8. Undo by treating the UTF-8 string as Latin-1 bytes, then
  // decoding those bytes as UTF-8.
  let fixed = utf8;
  if (/Â[·\s]|â€|â†|â˜|â–|â—|â„/.test(utf8)) {
    fixed = Buffer.from(utf8, 'latin1').toString('utf8');
  }

  // Patch the linkedlinkedin double-replacement bug
  fixed = fixed.replace(/linkedlinkedin\.com/g, 'linkedin.com');

  if (fixed !== utf8) {
    writeFileSync(p, fixed, 'utf8');
    console.log(`fixed ${f}`);
    total++;
  }
}
console.log(`\n${total} files fixed`);
