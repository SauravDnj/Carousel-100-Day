// Merge per-day authored files (lib/authored/day-N.json) into the canonical
// posts-content.json + posts-detail.json. Validates each day; only merges days
// that fully pass, and reports any day that needs a re-run.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dir = path.join(root, 'lib', 'authored');
const contentPath = path.join(root, 'lib', 'posts-content.json');
const detailPath = path.join(root, 'lib', 'posts-detail.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const detail = JSON.parse(fs.readFileSync(detailPath, 'utf8'));

const files = fs
  .readdirSync(dir)
  .filter((f) => /^day-\d+\.json$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

let merged = 0;
const problems = [];
const okDays = [];

for (const f of files) {
  let j;
  try {
    j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  } catch (e) {
    problems.push(`${f}: INVALID JSON (${e.message})`);
    continue;
  }
  if (!j || !j.content || !j.detail) {
    problems.push(`${f}: missing top-level content/detail`);
    continue;
  }
  const keys = Object.keys(j.content);
  let dayOk = keys.length === 5;
  if (keys.length !== 5) problems.push(`${f}: expected 5 posts, got ${keys.length}`);
  for (const k of keys) {
    const post = j.content[k];
    const det = j.detail[k];
    if (!post || !Array.isArray(post.slides) || post.slides.length === 0) {
      problems.push(`${f} ${k}: no slides`);
      dayOk = false;
      continue;
    }
    if (post.slides.length < 8) problems.push(`${f} ${k}: only ${post.slides.length} slides (<8)`);
    if (!post.caption || post.caption.split(/\s+/).length < 60) {
      problems.push(`${f} ${k}: caption missing/short`);
      dayOk = false;
    }
    if (!Array.isArray(det)) {
      problems.push(`${f} ${k}: no detail array`);
      dayOk = false;
      continue;
    }
    if (det.length !== post.slides.length) {
      problems.push(`${f} ${k}: detail ${det.length} != slides ${post.slides.length}`);
      dayOk = false;
    }
    if (post.slides[0] && post.slides[0].kind !== 'cover')
      problems.push(`${f} ${k}: first slide not cover`);
  }
  if (!dayOk) continue;
  for (const k of keys) {
    content[k] = j.content[k];
    detail[k] = j.detail[k];
  }
  merged++;
  okDays.push(parseInt(f.match(/\d+/)[0]));
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
fs.writeFileSync(detailPath, JSON.stringify(detail, null, 2));

console.log(`Merged ${merged} day-files (days: ${okDays.join(',')}).`);
console.log(`content keys=${Object.keys(content).length}, detail keys=${Object.keys(detail).length}`);
if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S) — these days were NOT merged / need a re-run:`);
  console.log(problems.join('\n'));
} else {
  console.log('No problems. All day-files merged cleanly.');
}
