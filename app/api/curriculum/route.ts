import { NextResponse } from 'next/server';
import { CURRICULUM } from '@/lib/curriculum';
import { SAMPLE_CONTENT } from '@/lib/sample-content';

export const runtime = 'nodejs';

/** GET /api/curriculum → every post with its topic/angle/category and whether it
 *  already has authored sample content. Used by scripts/draft-all-posts.mjs. */
export async function GET() {
  const posts: {
    day: number; postIdx: number; topic: string; category: string; angle: string; hasSample: boolean;
  }[] = [];
  for (const d of CURRICULUM) {
    for (const p of d.posts) {
      posts.push({
        day: d.day,
        postIdx: p.postIdx,
        topic: d.theme,
        category: d.category,
        angle: p.angle,
        hasSample: !!SAMPLE_CONTENT[`${d.day}-${p.postIdx}`],
      });
    }
  }
  return NextResponse.json({ ok: true, total: posts.length, posts });
}
