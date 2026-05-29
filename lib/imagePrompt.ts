// Builds ready-to-paste AI image-generation prompts (Midjourney / DALL·E / etc.)
// that match the SELECTED visual theme + color palette + the post's topic, so a
// generated image fits the carousel's look. Prompts update live as the theme or
// palette changes.

import { Palette, SlideContent, ThemeMeta } from './types';

export interface PromptContext {
  theme: ThemeMeta;   // visual theme meta (name + mood)
  palette: Palette;   // selected palette (colors)
  topic: string;      // the post/day topic, e.g. "What is RAG?"
  category: string;   // e.g. "RAG"
  angle?: string;     // e.g. "Concept"
}

function paletteLine(p: Palette): string {
  return `background ${p.bg}, surface ${p.surface}, primary accent ${p.accent1}, ` +
    `secondary accent ${p.accent2}, tertiary accent ${p.accent3}, ink/text ${p.text}`;
}

// What each slide kind should visually depict.
const KIND_SUBJECT: Partial<Record<SlideContent['kind'], string>> = {
  cover:      'a bold hero key-visual that introduces the topic',
  cta:        'a friendly closing call-to-action visual',
  definition: 'a clear conceptual illustration that defines the idea',
  why:        'a visual conveying importance and real-world impact',
  how:        'a clean step-by-step process visual',
  steps:      'a sequential, numbered process illustration',
  code:       'an abstract developer / code / terminal workspace visual',
  comparison: 'a balanced side-by-side comparison visual',
  tips:       'a tidy checklist / quick-tips visual',
  mistake:    'a warning / common-pitfall visual',
  visual:     'a striking conceptual illustration',
  diagram:    'a clean infographic-style diagram',
  image:      'a photographic, editorial hero image',
};

const COMMON_RULES =
  'No text, no letters, no logos, no watermarks, no UI elements. High detail, crisp edges, professional finish.';
const FORMAT_LINE =
  'Format: vertical 4:5 aspect ratio (1080×1350 px), with clean negative space near the top for a headline overlay.';

/** A prompt for a hero image representing the whole post. */
export function buildPostImagePrompt(ctx: PromptContext): string {
  const { theme, palette, topic, category, angle } = ctx;
  return [
    `Create a high-quality, ${theme.name}-style image for an Instagram/LinkedIn carousel about "${topic}" (${category}${angle ? `, angle: ${angle}` : ''}).`,
    '',
    `Art direction: ${theme.mood}. Modern, polished, social-media ready.`,
    FORMAT_LINE,
    `Color palette — use ONLY these colors: ${paletteLine(palette)}.`,
    `Subject: a single clear focal concept representing ${topic}, rendered in the ${theme.name} aesthetic.`,
    COMMON_RULES,
    '',
    'Aspect ratio 4:5.',
  ].join('\n');
}

/** One document containing the whole-post prompt plus every slide's prompt. */
export function buildAllSlidesPrompt(ctx: PromptContext, slides: SlideContent[]): string {
  const header = `===== WHOLE POST =====\n${buildPostImagePrompt(ctx)}`;
  const perSlide = slides.map((s, i) =>
    `===== SLIDE ${i + 1}/${slides.length} · ${s.kind} =====\n${buildSlideImagePrompt(ctx, s, i, slides.length)}`,
  );
  return [header, ...perSlide].join('\n\n');
}

/** One document containing a hero prompt for every post passed in. */
export function buildAllPostsPrompt(posts: { angle?: string; ctx: PromptContext }[]): string {
  return posts.map((p, i) =>
    `===== POST ${i + 1}/${posts.length}${p.angle ? ` · ${p.angle}` : ''} =====\n${buildPostImagePrompt(p.ctx)}`,
  ).join('\n\n');
}

/** A prompt tailored to one specific slide's kind + content. */
export function buildSlideImagePrompt(ctx: PromptContext, slide: SlideContent, index: number, total: number): string {
  const { theme, palette, topic, category } = ctx;
  const subject = KIND_SUBJECT[slide.kind] ?? 'a conceptual illustration';
  const focus = [slide.title, slide.body].filter(Boolean).join(' — ').trim();
  return [
    `Create a ${theme.name}-style image (slide ${index + 1} of ${total}) for a carousel about "${topic}" (${category}).`,
    focus ? `This slide is about: ${focus}.` : '',
    `Depict ${subject}.`,
    '',
    `Art direction: ${theme.mood}. ${FORMAT_LINE}`,
    `Color palette — use ONLY these colors: ${paletteLine(palette)}.`,
    COMMON_RULES,
    '',
    'Aspect ratio 4:5.',
  ].filter(Boolean).join('\n');
}
