import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
mkdirSync('verify-shots', { recursive: true });

const BASE = 'http://localhost:3737';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1500, height: 1250 }, deviceScaleFactor: 1, acceptDownloads: true });

// Day 10 / post 3 = "List & Dict Comprehensions" (Python) · How It Works → TEMPLATE (not authored)
const TEMPLATE_POST = `${BASE}/post/10/3`;

async function clickNext(page, n) {
  for (let i = 0; i < n; i++) {
    await page.locator('button:has-text("Next ›")').first().click();
    await page.waitForTimeout(360);
  }
}

// 1) Deeper content — slide count on a template post
{
  const page = await ctx.newPage();
  await page.goto(TEMPLATE_POST, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const slidesText = await page.locator('text=/\\d+ slides/').first().textContent().catch(() => '?');
  console.log('TEMPLATE slide count (Day 10 / How It Works):', slidesText);
  // screenshot the Mental model slide (index 3) + Key terms (index 7)
  await clickNext(page, 3);
  await page.screenshot({ path: 'verify-shots/deep-mentalmodel.png' });
  await clickNext(page, 4);
  await page.screenshot({ path: 'verify-shots/deep-keyterms.png' });
  console.log('✓ deeper content screenshots');
  await page.close();
}

// 2) Per-theme sticker placement on a content slide
{
  const page = await ctx.newPage();
  await page.goto(TEMPLATE_POST, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await clickNext(page, 1); // visual slide (has emoji)
  for (const theme of ['Retro Grid', 'Dark Cyber', 'Glass', 'Brutalist', 'Comic', 'ASCII Art', 'Y2K', 'Holographic']) {
    await page.getByRole('button', { name: theme, exact: true }).first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `verify-shots/stk-${theme.replace(/\s+/g, '-').toLowerCase()}.png` });
    console.log('✓ sticker placement:', theme);
  }
  await page.close();
}

// 3) MP4/WebM with selected options — use EXACT button names to avoid the
//    preview's "↓ This slide" button.
{
  const page = await ctx.newPage();
  await page.goto(TEMPLATE_POST, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'slide', exact: true }).click(); // transition
  await page.getByRole('button', { name: 'Fast', exact: true }).click();   // speed
  await page.getByRole('button', { name: 'None', exact: true }).click();   // Ken Burns off → faster, simpler
  await page.waitForTimeout(300);
  const dl = page.waitForEvent('download', { timeout: 180000 });
  await page.locator('button:has-text("MP4 / WebM")').click();
  const d = await dl;
  const out = 'verify-shots/test-video.bin';
  await d.saveAs(out);
  console.log('✓ Video downloaded:', d.suggestedFilename(), '→', statSync(out).size, 'bytes');
  await page.close();
}

await browser.close();
console.log('DONE');
