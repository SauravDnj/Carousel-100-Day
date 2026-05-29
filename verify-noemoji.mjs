import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1500, height: 1250 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:3737/post/10/3', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
// cover
await page.screenshot({ path: 'verify-shots/noemoji-cover.png' });
// advance to a content slide (mental model)
for (let i = 0; i < 3; i++) { await page.locator('button:has-text("Next ›")').first().click(); await page.waitForTimeout(360); }
await page.screenshot({ path: 'verify-shots/noemoji-content.png' });
console.log('done');
await browser.close();
