#!/usr/bin/env node
/**
 * Draft slide text for many/all posts with Claude and save them into
 * lib/sample-content.ts (via the /api/save-content route, dev only).
 *
 * Prerequisites:
 *   1. Run the dev server in another terminal:   npm run dev
 *   2. Put your Groq keys in .env.local:          GROQ_API_KEYS=gsk_...,gsk_...
 *
 * Usage:
 *   node scripts/draft-all-posts.mjs                 # all posts WITHOUT existing content
 *   node scripts/draft-all-posts.mjs --from 1 --to 10   # only days 1..10
 *   node scripts/draft-all-posts.mjs --force         # also re-draft posts that already have content
 *   BASE_URL=http://localhost:3001 node scripts/draft-all-posts.mjs
 *
 * It is resumable: by default it skips posts that already have authored content,
 * so you can stop (Ctrl-C) and re-run to continue. Each post costs API tokens.
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const args = process.argv.slice(2);
const force = args.includes('--force');
const getArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : undefined;
};
const from = getArg('--from');
const to = getArg('--to');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let curriculum;
  try {
    const res = await fetch(`${BASE}/api/curriculum`);
    curriculum = await res.json();
  } catch (e) {
    console.error(`\n✗ Could not reach ${BASE}. Is the dev server running (npm run dev)?\n`);
    process.exit(1);
  }

  let posts = curriculum.posts;
  if (from !== undefined) posts = posts.filter((p) => p.day >= from);
  if (to !== undefined) posts = posts.filter((p) => p.day <= to);
  const todo = posts.filter((p) => force || !p.hasSample);

  console.log(`\n${posts.length} posts in range · ${todo.length} to draft${force ? ' (--force)' : ' (skipping existing)'}.\n`);

  let done = 0, failed = 0;
  for (const p of todo) {
    const tag = `Day ${String(p.day).padStart(3, '0')} · post ${p.postIdx} · ${p.angle}`;
    process.stdout.write(`  ${tag} … `);
    try {
      const draftRes = await fetch(`${BASE}/api/draft-slides`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic: p.topic, angle: p.angle, category: p.category }),
      });
      const draft = await draftRes.json();
      if (!draft.ok) {
        if (draft.reason === 'no_api_key') {
          console.error(`\n\n✗ ${draft.message}\n`);
          process.exit(1);
        }
        console.log(`✗ ${draft.message || 'draft failed'}`);
        failed++;
        continue;
      }
      const saveRes = await fetch(`${BASE}/api/save-content`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ day: p.day, postIdx: p.postIdx, slides: draft.slides }),
      });
      const save = await saveRes.json();
      if (save.saved) {
        console.log(`✓ ${draft.slides.length} slides saved`);
        done++;
      } else {
        console.log(`✓ drafted but not saved (${save.mode || 'prod mode'}) — run the dev server to persist`);
        failed++;
      }
    } catch (e) {
      console.log(`✗ ${e.message}`);
      failed++;
    }
    await sleep(400); // be gentle on rate limits
  }

  console.log(`\nDone. ${done} saved, ${failed} failed/skipped.\n`);
}

main();
