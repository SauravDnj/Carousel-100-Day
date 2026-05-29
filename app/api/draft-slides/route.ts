import { NextRequest, NextResponse } from 'next/server';
import { draftSlides, hasApiKey, DraftInput } from '@/lib/draftSlides';

// Drafting (with adaptive thinking) can take a while; give the route headroom.
export const maxDuration = 120;
export const runtime = 'nodejs';

/**
 * POST /api/draft-slides
 *  - Single:  { topic, angle, category, count? }            → { ok, slides }
 *  - Batch:   { batch: [{ topic, angle, category, count?, day?, postIdx? }, ...] }
 *                                                            → { ok, results: [...] }
 * When ANTHROPIC_API_KEY is missing it returns 200 with { ok:false, reason:'no_api_key' }
 * so the UI can show a friendly message instead of a hard error.
 */
export async function POST(req: NextRequest) {
  if (!hasApiKey()) {
    return NextResponse.json({
      ok: false,
      reason: 'no_api_key',
      message: 'AI drafting needs a Groq API key. Add GROQ_API_KEYS=gsk_...,gsk_... to .env.local and restart the dev server.',
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 });
  }

  // Batch mode
  if (Array.isArray(body?.batch)) {
    const results: any[] = [];
    for (const item of body.batch as (DraftInput & { day?: number; postIdx?: number })[]) {
      if (!item?.topic || !item?.angle || !item?.category) {
        results.push({ ...item, ok: false, error: 'topic, angle, category required' });
        continue;
      }
      try {
        const slides = await draftSlides(item);
        results.push({ day: item.day, postIdx: item.postIdx, ok: true, slides });
      } catch (e: any) {
        results.push({ day: item.day, postIdx: item.postIdx, ok: false, error: e?.message ?? 'draft failed' });
      }
    }
    return NextResponse.json({ ok: true, results });
  }

  // Single mode
  const { topic, angle, category, count } = body ?? {};
  if (!topic || !angle || !category) {
    return NextResponse.json({ ok: false, message: 'topic, angle, and category are required.' }, { status: 400 });
  }
  try {
    const slides = await draftSlides({ topic, angle, category, count });
    return NextResponse.json({ ok: true, slides });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? 'Drafting failed.' }, { status: 500 });
  }
}
