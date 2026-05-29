import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('verify-shots', { recursive: true });

const BASE = 'http://localhost:3737';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1500, height: 1400 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(`${BASE}/author/10/3`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Full page (shows editor stack incl. diagram editor + emoji picker)
await page.screenshot({ path: 'verify-shots/editor-full.png', fullPage: true });
console.log('✓ editor-full');

// Find a diagram slide editor (has the diagram type pills) and screenshot its card
const flowPill = page.locator('button:has-text("flow")').first();
await flowPill.scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(400);
await page.screenshot({ path: 'verify-shots/editor-diagram.png' });
console.log('✓ editor-diagram view');

// Interact: switch that diagram to "bars" and confirm no crash, preview still renders
await page.locator('button:has-text("bars")').first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: 'verify-shots/editor-bars.png' });
console.log('✓ switched a diagram to bars');

await browser.close();
console.log('DONE');
