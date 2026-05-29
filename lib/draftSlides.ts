// Server-only: drafts carousel slide text with Groq (free, OpenAI-compatible API).
// Rotates across multiple GROQ_API_KEYS and fails over on rate limits. Asks the
// model for JSON (response_format json_object), then parses + normalizes into
// SlideContent[]. Never import this from client code — it reads the keys.

import { SlideContent, SlideKind } from './types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

/** Read the configured Groq keys (supports GROQ_API_KEYS=comma,sep or single GROQ_API_KEY). */
function getKeys(): string[] {
  const multi = process.env.GROQ_API_KEYS ?? '';
  const single = process.env.GROQ_API_KEY ?? '';
  return [...multi.split(','), single]
    .map(k => k.trim())
    .filter(Boolean);
}

/** Whether at least one Groq key is configured (used for graceful UI messaging). */
export function hasApiKey(): boolean {
  return getKeys().length > 0;
}

// Spread load across keys: each call starts at a different key.
let rotation = 0;

// Kinds the model is allowed to draft. (Diagram/image slides are authored manually.)
const DRAFT_KINDS: SlideKind[] = [
  'cover', 'definition', 'why', 'how', 'steps', 'code',
  'comparison', 'tips', 'mistake', 'visual', 'cta',
];
const KIND_SET = new Set<string>(DRAFT_KINDS);
const CODE_LANGS = new Set(['python', 'typescript', 'javascript', 'sql', 'bash']);

const SYSTEM_PROMPT = `You are an expert technical educator who writes punchy, accurate Instagram/LinkedIn carousel posts about AI, ML, programming, and databases, for developers and students.

You will be given a TOPIC, CATEGORY, and ANGLE. Draft the slides for one carousel post.

Hard rules:
- The FIRST slide is kind "cover": a punchy hook title + an optional one-line body. No bullets.
- The LAST slide is kind "cta": a save/follow call-to-action.
- In between, use kinds that fit the angle:
  - "definition" / "visual": title + 2-4 sentence body.
  - "why" / "how" / "steps" / "tips" / "comparison" / "mistake": title + 3-5 short bullets.
  - "code": title + a SHORT, correct, runnable snippet in "code" (under ~14 lines) with "codeLang" set.
- Include at least one "code" slide for technical topics.
- Titles are short headlines (<= ~8 words). Bodies are 2-4 sentences. Bullets are <= ~12 words, 3-5 per slide.
- Be concrete and correct: real tools, real APIs, real pitfalls. No filler.
- You may wrap 1-3 key phrases per text field in *asterisks* for emphasis.
- Give each slide a single relevant "emoji".

Match the ANGLE:
- "Concept": what it is, mental model, why it matters, a minimal code example, the beginner trap.
- "Why It Matters": the problem before, real impact, concrete reasons, what breaks if skipped.
- "How It Works": big picture, step-by-step, a reference snippet, edge cases.
- "Code Example": setup, the core snippet, a walkthrough, variations, the production-ready version.
- "Common Mistakes": 4-5 specific mistakes (one per slide), then a recap + safer pattern.

OUTPUT FORMAT — respond with ONLY a JSON object, no prose, exactly this shape:
{
  "slides": [
    {
      "kind": one of ["cover","definition","why","how","steps","code","comparison","tips","mistake","visual","cta"],
      "title": "string (required)",
      "body": "string (optional)",
      "bullets": ["string", ...] (optional),
      "code": "string (optional, code slides only)",
      "codeLang": one of ["python","typescript","javascript","sql","bash"] (optional),
      "emoji": "single emoji (optional)"
    }
  ]
}`;

export interface DraftInput {
  topic: string;
  angle: string;
  category: string;
  /** Target slide count (clamped to 6-10). Default 9. */
  count?: number;
}

interface GroqMessage { role: 'system' | 'user'; content: string; }

/** Call Groq, rotating through keys and failing over on 429/5xx. */
async function callGroq(messages: GroqMessage[]): Promise<string> {
  const keys = getKeys();
  if (keys.length === 0) throw new Error('No Groq API key configured.');
  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
  const start = rotation++ % keys.length;

  let lastError = 'Groq request failed.';
  for (let i = 0; i < keys.length; i++) {
    const key = keys[(start + i) % keys.length];
    let res: Response;
    try {
      res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens: 8000,
          response_format: { type: 'json_object' },
          messages,
        }),
      });
    } catch (e: any) {
      lastError = `Network error: ${e?.message ?? e}`;
      continue; // try next key
    }

    if (res.ok) {
      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content ?? '';
      if (!text) throw new Error('Empty response from Groq.');
      return text;
    }

    // 429 (rate limit) or 5xx → try the next key. 401/400 → surface immediately.
    const bodyText = await res.text().catch(() => '');
    lastError = `Groq ${res.status}: ${bodyText.slice(0, 200)}`;
    if (res.status === 429 || res.status >= 500) continue;
    throw new Error(lastError);
  }
  throw new Error(`All Groq keys exhausted. ${lastError}`);
}

/** Coerce a loosely-shaped model object into a valid SlideContent. */
function normalizeSlide(raw: any): SlideContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const kind: SlideKind = KIND_SET.has(raw.kind) ? raw.kind : 'visual';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null;
  const slide: SlideContent = { kind, title };
  if (typeof raw.body === 'string' && raw.body.trim()) slide.body = raw.body.trim();
  if (Array.isArray(raw.bullets)) {
    const bullets = raw.bullets.filter((b: any) => typeof b === 'string' && b.trim()).map((b: string) => b.trim());
    if (bullets.length) slide.bullets = bullets;
  }
  if (typeof raw.code === 'string' && raw.code.trim()) slide.code = raw.code;
  if (typeof raw.codeLang === 'string' && CODE_LANGS.has(raw.codeLang)) slide.codeLang = raw.codeLang;
  if (typeof raw.emoji === 'string' && raw.emoji.trim()) slide.emoji = raw.emoji.trim().slice(0, 4);
  return slide;
}

/** Draft an 8-10 slide carousel post. Throws on API errors. */
export async function draftSlides(input: DraftInput): Promise<SlideContent[]> {
  const count = Math.min(10, Math.max(6, Math.round(input.count ?? 9)));
  const userMessage =
    `TOPIC: "${input.topic}"\n` +
    `CATEGORY: ${input.category}\n` +
    `ANGLE: ${input.angle}\n\n` +
    `Draft exactly ${count} slides for this post, following all the rules. Respond with JSON only.`;

  const text = await callGroq([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ]);

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Some models wrap JSON in stray text — extract the first {...} block.
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Could not parse the drafted slides.');
    parsed = JSON.parse(m[0]);
  }

  const rawSlides = Array.isArray(parsed?.slides) ? parsed.slides : Array.isArray(parsed) ? parsed : [];
  const slides = rawSlides.map(normalizeSlide).filter((s: SlideContent | null): s is SlideContent => s !== null);
  if (slides.length === 0) throw new Error('The draft contained no usable slides.');
  return slides;
}
