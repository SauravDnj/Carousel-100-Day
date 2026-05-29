import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('verify-shots', { recursive: true });

const BASE = 'http://localhost:3737';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1500, height: 1250 }, deviceScaleFactor: 1 });

async function clickNext(page, n) {
  for (let i = 0; i < n; i++) {
    await page.locator('button:has-text("Next ›")').first().click();
    await page.waitForTimeout(450);
  }
}
async function selectTheme(page, name) {
  await page.locator(`button:has-text("${name}")`).first().click();
  await page.waitForTimeout(700);
}

// Template-backed posts (not in SAMPLE_CONTENT): day 12, posts 2..5 + 3
// 12 = "Gradient Descent, Visually" (Math for ML). postIdx → angle:
//   2 Why It Matters (compare), 3 How It Works (pipeline),
//   4 Code Example (flow), 5 Common Mistakes (decision)
const shots = [
  { url: `${BASE}/post/12/3`, next: 0, name: '01-howitworks-cover',   note: 'cover + emoji sticker + decor' },
  { url: `${BASE}/post/12/3`, next: 2, name: '02-howitworks-pipeline', note: 'generated pipeline diagram' },
  { url: `${BASE}/post/12/2`, next: 4, name: '03-why-compare',         note: 'generated compare diagram' },
  { url: `${BASE}/post/12/4`, next: 5, name: '04-code-flow',           note: 'generated flow diagram' },
  { url: `${BASE}/post/12/5`, next: 6, name: '05-mistakes-decision',   note: 'generated decision tree' },
];

for (const s of shots) {
  const page = await ctx.newPage();
  await page.goto(s.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  if (s.next) await clickNext(page, s.next);
  await page.screenshot({ path: `verify-shots/up-${s.name}.png`, fullPage: false });
  console.log(`✓ ${s.name} — ${s.note}`);
  await page.close();
}

// Same diagram slide in a few different themes to confirm no breakage
{
  const page = await ctx.newPage();
  await page.goto(`${BASE}/post/12/3`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await clickNext(page, 2); // pipeline diagram slide
  for (const theme of ['Dark Cyber', 'Glass', 'Brutalist', 'Comic', 'ASCII']) {
    await selectTheme(page, theme);
    await page.screenshot({ path: `verify-shots/up-theme-${theme.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: false });
    console.log(`✓ theme: ${theme}`);
  }
  await page.close();
}

// Authored post still works (1/1)
{
  const page = await ctx.newPage();
  await page.goto(`${BASE}/post/1/1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'verify-shots/up-authored-1-1.png', fullPage: false });
  console.log('✓ authored 1/1');
  await page.close();
}

await browser.close();
console.log('DONE');
