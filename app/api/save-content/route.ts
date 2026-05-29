import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Save authored slide content into lib/sample-content.ts.
 * Works ONLY in dev mode (filesystem is writable). In production it returns 200 + the
 * generated snippet for the user to copy/paste — Vercel serverless can't persist files.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { day, postIdx, slides } = body as { day: number; postIdx: number; slides: any[] };

  if (typeof day !== 'number' || typeof postIdx !== 'number' || !Array.isArray(slides)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const key = `${day}-${postIdx}`;
  const snippet = renderSnippet(key, slides);

  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev) {
    return NextResponse.json({ saved: false, mode: 'export', snippet, message: 'Production mode — copy snippet into sample-content.ts and redeploy.' });
  }

  try {
    const filePath = join(process.cwd(), 'lib', 'sample-content.ts');
    const original = await fs.readFile(filePath, 'utf8');
    const updated = upsertContent(original, key, snippet);
    await fs.writeFile(filePath, updated, 'utf8');
    return NextResponse.json({ saved: true, mode: 'fs', key });
  } catch (e: any) {
    return NextResponse.json({ saved: false, mode: 'error', snippet, error: e.message }, { status: 500 });
  }
}

/** Produce a TS object-literal snippet for a slide array, formatted to match
 *  the existing style in sample-content.ts. */
function renderSnippet(key: string, slides: any[]): string {
  const slideLines = slides.map(s => `    ${renderSlide(s)},`).join('\n');
  return `  '${key}': [\n${slideLines}\n  ],`;
}

function renderSlide(s: any): string {
  const parts: string[] = [`kind: '${s.kind}'`];
  if (s.title)    parts.push(`title: ${JSON.stringify(s.title)}`);
  if (s.body)     parts.push(`body: ${JSON.stringify(s.body)}`);
  if (s.bullets && s.bullets.length) parts.push(`bullets: ${JSON.stringify(s.bullets)}`);
  if (s.code)     parts.push(`code: ${JSON.stringify(s.code)}`);
  if (s.codeLang) parts.push(`codeLang: ${JSON.stringify(s.codeLang)}`);
  if (s.sticker)  parts.push(`sticker: ${JSON.stringify(s.sticker)}`);
  if (s.emoji)    parts.push(`emoji: ${JSON.stringify(s.emoji)}`);
  if (s.diagram)  parts.push(`diagram: ${JSON.stringify(s.diagram)}`);
  return `{ ${parts.join(', ')} }`;
}

/** Idempotent upsert — replace existing entry for `key` or insert before closing }; */
function upsertContent(file: string, key: string, snippet: string): string {
  const keyRegex = new RegExp(`(\\s*//[^\\n]*\\n)*\\s*'${escapeRegex(key)}':\\s*\\[[\\s\\S]*?\\],\\s*\\n`, 'm');
  if (keyRegex.test(file)) {
    return file.replace(keyRegex, `\n  // Day ${key.split('-')[0]} — saved from /author UI\n${snippet}\n`);
  }
  // Insert just before the closing `};` of the exported record.
  return file.replace(/\n\};\s*$/, `\n  // Day ${key.split('-')[0]} — saved from /author UI\n${snippet}\n};\n`);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
