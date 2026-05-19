import { chromium } from 'playwright';
import { mkdirSync, statSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const DL = 'verify-downloads';
mkdirSync(DL, { recursive: true });
for (const f of readdirSync(DL)) try { unlinkSync(join(DL, f)); } catch {}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });

const page = await ctx.newPage();

console.log('1) Single-post downloads…');
await page.goto('http://localhost:3737/post/67/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

async function clickDownload(buttonRe, label) {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 120_000 }),
    page.getByRole('button', { name: buttonRe }).first().click(),
  ]);
  const path = join(DL, download.suggestedFilename());
  await download.saveAs(path);
  const sz = statSync(path).size;
  console.log(`   ✓ ${label}: ${download.suggestedFilename()} — ${(sz / 1024).toFixed(1)} KB`);
}

await clickDownload(/PNG \(zip\)/, 'PNG zip');
await page.waitForTimeout(2000);
await clickDownload(/^📄 PDF$/, 'PDF');
await page.waitForTimeout(2000);

console.log('2) Single-slide download…');
await page.getByRole('button', { name: /Next ›/ }).click();
await page.waitForTimeout(1000);
await clickDownload(/This slide/, 'single slide PNG');

console.log('3) Per-day bulk download (waiting 6s for BulkRenderer to mount)…');
await page.goto('http://localhost:3737/day/67', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);
const btn = page.getByRole('button', { name: /40 PNGs \(zip\)/ });
const disabled = await btn.isDisabled();
console.log(`   button disabled: ${disabled}`);
if (!disabled) {
  // bulk takes ~90s for 40 slides at 1.5x; give it 4 minutes
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 240_000 }),
    btn.click(),
  ]);
  const path = join(DL, download.suggestedFilename());
  await download.saveAs(path);
  const sz = statSync(path).size;
  console.log(`   ✓ per-day bulk PNG: ${download.suggestedFilename()} — ${(sz / 1024).toFixed(1)} KB`);
}

await browser.close();
console.log('\n=== All files in', DL, ':');
for (const f of readdirSync(DL)) {
  const sz = statSync(join(DL, f)).size;
  console.log(`  ${f} — ${(sz / 1024).toFixed(1)} KB`);
}
