import { chromium } from 'playwright';
import { readdir, mkdir } from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const slidesDir = join(__dirname, 'slides');
const outDir = join(__dirname, 'output');

const WIDTH = 1080;
const HEIGHT = 1350;

async function main() {
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(slidesDir))
    .filter(f => f.endsWith('.html'))
    .sort();

  console.log(`Found ${files.length} slides. Rendering at ${WIDTH}x${HEIGHT}...`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
  });

  for (const file of files) {
    const filePath = resolve(slidesDir, file);
    const fileUrl = pathToFileURL(filePath).href;
    const outName = file.replace(/\.html$/, '.png');
    const outPath = join(outDir, outName);

    const page = await context.newPage();
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    // give fonts a beat to load
    await page.waitForTimeout(800);
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
      omitBackground: false,
    });
    await page.close();
    console.log(`  ✓ ${outName}`);
  }

  await browser.close();
  console.log(`\nDone. PNGs in: ${outDir}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
