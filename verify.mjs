import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('verify-shots', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1500, height: 1200 }, deviceScaleFactor: 1 });

// 1. Home page before any status set
{
  const page = await ctx.newPage();
  await page.goto('http://localhost:3737/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify-shots/home-with-filters.png', fullPage: false });
  await page.close();
  console.log('✓ home-with-filters');
}

// 2. Visit a post, star it, mark another as done — then go back to home
{
  const page = await ctx.newPage();
  await page.goto('http://localhost:3737/post/67/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Click Star button by partial text
  await page.locator('button:has-text("Star")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'verify-shots/post-starred.png', fullPage: false });

  // Navigate to next post, mark done
  await page.locator('button:has-text("Next Post")').first().click();
  await page.waitForTimeout(800);
  await page.locator('button:has-text("Mark done")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'verify-shots/post-done.png', fullPage: false });

  await page.close();
  console.log('✓ post-starred / post-done');
}

// 3. Return to home — should show status badges + correct counts
{
  const page = await ctx.newPage();
  await page.goto('http://localhost:3737/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // Scroll to Day 67 card so it's visible in screenshot
  await page.locator('text=The RAG Pipeline').scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'verify-shots/home-with-statuses.png', fullPage: true });
  await page.close();
  console.log('✓ home-with-statuses');
}

// 4. Random post click
{
  const page = await ctx.newPage();
  await page.goto('http://localhost:3737/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('button:has-text("Random post")').first().click();
  await page.waitForTimeout(1200);
  const url = page.url();
  console.log('✓ random clicked → landed on:', url);
  await page.screenshot({ path: 'verify-shots/after-random.png', fullPage: false });
  await page.close();
}

await browser.close();
