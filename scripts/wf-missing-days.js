export const meta = {
  name: 'author-carousel-missing-days',
  description: 'Re-author the carousel days that failed in the first pass (14, 18, 58-100), one agent per day writing lib/authored/day-N.json',
  phases: [{ title: 'Author', detail: '45 agents, one per missing day' }],
}

const DAYS = [
  { day: 14, theme: 'Distance Metrics: L1, L2, Cosine', category: 'Math for ML' },
  { day: 18, theme: 'Functions, *args, **kwargs', category: 'Python' },
  { day: 58, theme: 'Word2Vec & GloVe', category: 'NLP & LLMs' },
  { day: 59, theme: 'Language Models 101', category: 'NLP & LLMs' },
  { day: 60, theme: 'GPT vs BERT', category: 'NLP & LLMs' },
  { day: 61, theme: 'Fine-Tuning LLMs', category: 'NLP & LLMs' },
  { day: 62, theme: 'LoRA & QLoRA', category: 'NLP & LLMs' },
  { day: 63, theme: 'Quantization (4-bit, 8-bit)', category: 'NLP & LLMs' },
  { day: 64, theme: 'RLHF, DPO, PPO', category: 'NLP & LLMs' },
  { day: 65, theme: 'Context Windows & KV Cache', category: 'NLP & LLMs' },
  { day: 66, theme: 'Temperature, Top-p, Top-k', category: 'NLP & LLMs' },
  { day: 67, theme: 'What is RAG?', category: 'RAG' },
  { day: 68, theme: 'The RAG Pipeline', category: 'RAG' },
  { day: 69, theme: 'Chunking Strategies', category: 'RAG' },
  { day: 70, theme: 'Embedding Models Compared', category: 'RAG' },
  { day: 71, theme: 'Vector Search Basics', category: 'RAG' },
  { day: 72, theme: 'Hybrid Search (BM25 + Vector)', category: 'RAG' },
  { day: 73, theme: 'Reranking with Cross-Encoders', category: 'RAG' },
  { day: 74, theme: 'Evaluating RAG Quality', category: 'RAG' },
  { day: 75, theme: 'What is an AI Agent?', category: 'AI Agents' },
  { day: 76, theme: 'The ReAct Pattern', category: 'AI Agents' },
  { day: 77, theme: 'Tool Calling / Function Calling', category: 'AI Agents' },
  { day: 78, theme: 'Multi-Agent Systems', category: 'AI Agents' },
  { day: 79, theme: 'LangChain Crash Course', category: 'AI Tools' },
  { day: 80, theme: 'LlamaIndex Crash Course', category: 'AI Tools' },
  { day: 81, theme: 'SQL vs NoSQL', category: 'SQL Databases' },
  { day: 82, theme: 'PostgreSQL Essentials', category: 'SQL Databases' },
  { day: 83, theme: 'Indexes & Query Plans', category: 'SQL Databases' },
  { day: 84, theme: 'MongoDB in 8 Slides', category: 'NoSQL Databases' },
  { day: 85, theme: 'Redis: Caching & Beyond', category: 'NoSQL Databases' },
  { day: 86, theme: 'Pinecone for Vector Search', category: 'Vector Databases' },
  { day: 87, theme: 'Weaviate Essentials', category: 'Vector Databases' },
  { day: 88, theme: 'Qdrant in 8 Slides', category: 'Vector Databases' },
  { day: 89, theme: 'Chroma for Local RAG', category: 'Vector Databases' },
  { day: 90, theme: 'FAISS Deep Dive', category: 'Vector Databases' },
  { day: 91, theme: 'pgvector: Postgres for AI', category: 'Vector Databases' },
  { day: 92, theme: 'OpenAI & Claude APIs', category: 'AI Tools' },
  { day: 93, theme: 'Hugging Face Hub', category: 'AI Tools' },
  { day: 94, theme: 'Prompt Engineering 101', category: 'Prompt Engineering' },
  { day: 95, theme: 'Chain-of-Thought Prompting', category: 'Prompt Engineering' },
  { day: 96, theme: 'MLOps in 8 Slides', category: 'MLOps' },
  { day: 97, theme: 'Docker for ML', category: 'MLOps' },
  { day: 98, theme: 'Serving Models with FastAPI', category: 'Production AI' },
  { day: 99, theme: 'Monitoring LLMs in Production', category: 'Production AI' },
  { day: 100, theme: 'Build Your AI Portfolio', category: 'Production AI' },
]

const GOLD_CAPTION = `An AI isn't "objective" just because it's math. It learns from data made by humans — and it inherits our blind spots. ⚖️

Bias in AI means systematic unfairness toward some group, usually because the training data reflects an unfair world. The model doesn't invent the bias; it faithfully copies and often amplifies it.

INSIDE THIS POST:
• what "AI ethics" and "bias" actually mean
• the 5 ethical dimensions beyond bias
• where bias actually comes from
• why "fair" has no single definition
• why "the algorithm is neutral" is a myth

Understand the failure modes before you trust the output. Save it. 👇`

const GOLD_DETAIL = `The framing here corrects a common misconception: that bias lives in 'the algorithm' and can be patched there. In reality it enters at every stage of the pipeline. It comes in when you decide whose data to collect, when humans assign labels, when the model amplifies whatever patterns it finds, when you choose who the system gets used on, and when feedback flows back to shape future data.

The practical implication is that fixing one stage while ignoring the others just relocates the problem. Effective fairness work has to address the whole pipeline, which is why knowing the full map matters so much.`

const SCHEMA = {
  type: 'object',
  required: ['day', 'ok', 'posts'],
  properties: {
    day: { type: 'number' },
    ok: { type: 'boolean' },
    filePath: { type: 'string' },
    posts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'slideCount', 'detailCount', 'captionWords'],
        properties: {
          key: { type: 'string' },
          slideCount: { type: 'number' },
          detailCount: { type: 'number' },
          captionWords: { type: 'number' },
        },
      },
    },
  },
}

function buildPrompt(d) {
  const N = d.day
  return `You are authoring ONE day of the Instagram/LinkedIn carousel series "100 Days of AI" by Saurav Danej. This is professional, in-depth educational content. Author **Day ${N}: "${d.theme}"** (category: ${d.category}).

A day = EXACTLY 5 posts, postIdx 1..5, each using one of these 5 angles IN ORDER:
1 = Concept, 2 = Why It Matters, 3 = How It Works, 4 = Code Example, 5 = Common Mistakes.
The 5 posts must be genuinely different from each other (different lens on "${d.theme}"), not 5 rewrites of the same thing.

For EACH of the 5 posts produce three things:

(A) caption — 120-180 words. Structure: a punchy hook line (you MAY use ONE emoji) -> 1-2 short framing paragraphs -> a line "INSIDE THIS POST:" followed by 4-6 bullet lines each starting with "• " -> a 1-line CTA ("Save it. 👇" style). NO hashtags, NO URLs, NO "Day X" counter (the page appends those automatically). Specific to this post's angle + topic.

(B) slides — an array of 11-13 SlideContent objects:
  - slides[0] = { "kind": "cover", "title": <punchy post-specific headline>, "sticker": "DAY-X" }  (use the LITERAL string "DAY-X"; the app replaces it with the real day number at render time)
  - last slide = { "kind": "cta", "title": <save/follow line, e.g. "Save this. Follow for Day ${N + 1}.">, "sticker": "DAY-X", "body": <1-line teaser of the next post/day> }
  - the 9-11 middle slides: pick a varied mix of kinds from: "definition","why","how","steps","comparison","tips","mistake","visual","code","diagram". Include AT LEAST ONE "code" slide and 1-2 "diagram" slides per post. For the post 4 (Code Example angle), make it code-heavy: 3-4 "code" slides.
  - each middle slide has a "title" plus EITHER a "body" (2-4 sentences, ~40-70 words) OR "bullets" (3-5 short items). Optionally add "emoji". Keep slide text TIGHT — it renders on a 1080x1350 image and clips if long.
  - "code" slides: set "code" (real, runnable, correct snippet — escape newlines as \\n in JSON) and "codeLang" (e.g. "python","bash","sql","javascript","typescript").
  - DO NOT put a "detail" field inside slides. Details go in the separate detail map below.

(C) detail — an array of strings, length MUST EQUAL that post's slides array length (one entry per slide, in order, INCLUDING cover and cta). Each entry = a 2-3 paragraph deep-dive write-up expanding that slide for the post page, paragraphs separated by "\\n\\n". This is where the real depth lives (the slide image stays short). Cover/cta entries can be 1-2 paragraphs.

Allowed diagram shapes (use diagram.kind = one of these, and ONLY these shapes):
- {"kind":"flow","nodes":[{"label":"..","sub":".."}]}
- {"kind":"pipeline","stages":[{"label":"..","detail":"..","icon":".."}]}
- {"kind":"network","layers":[3,4,2],"labels":["in","hidden","out"]}
- {"kind":"cycle","nodes":[{"label":"..","sub":".."}]}
- {"kind":"compare","left":{"title":"..","items":["..",".."]},"right":{"title":"..","items":["..",".."]}}
- {"kind":"stack","levels":[{"label":"..","sub":".."}]}
- {"kind":"tree","root":{"label":"..","children":[{"label":"..","children":[]}]}}
- {"kind":"bars","bars":[{"label":"..","value":80,"sub":".."}],"axisLabel":".."}
- {"kind":"timeline","events":[{"year":"2017","label":"..","detail":".."}]}
- {"kind":"trace","lines":[{"text":"..","tone":"input|output|comment|value|arrow|plain"}]}
- {"kind":"decision","root":{"question":"..","yes":{"leaf":".."},"no":{"question":"..","yes":{"leaf":".."},"no":{"leaf":".."}}}}
- {"kind":"mindmap","center":"..","branches":[{"label":"..","sub":["..",".."]}]}
- {"kind":"vectors","vectors":[{"label":"a","x":3,"y":1,"color":"#f00"}]}
Vary which diagram kinds you use across the 5 posts.

STYLE: direct, second-person, concrete, confident, no fluff or hype. Match the standard of these examples.
--- GOLD caption example ---
${GOLD_CAPTION}
--- GOLD code slide example ---
{"kind":"code","title":"0. Install + import","code":"# pip install scikit-learn\\nfrom sklearn.datasets import load_iris\\nfrom sklearn.model_selection import train_test_split","codeLang":"python","emoji":"📦"}
--- GOLD detail example (tone/length for ONE entry) ---
${GOLD_DETAIL}
--- end examples ---

OUTPUT: Use the Write tool to write EXACTLY ONE file at this absolute path:
D:/Saurav/personal/Carousel/Code/lib/authored/day-${N}.json
The file must be VALID JSON with this EXACT shape:
{
  "content": {
    "${N}-1": { "caption": "...", "slides": [ ...11-13 objects... ] },
    "${N}-2": { "caption": "...", "slides": [ ... ] },
    "${N}-3": { "caption": "...", "slides": [ ... ] },
    "${N}-4": { "caption": "...", "slides": [ ... ] },
    "${N}-5": { "caption": "...", "slides": [ ... ] }
  },
  "detail": {
    "${N}-1": [ "para\\n\\npara", ... ],
    "${N}-2": [ ... ],
    "${N}-3": [ ... ],
    "${N}-4": [ ... ],
    "${N}-5": [ ... ]
  }
}
CRITICAL CHECKS before you finish:
- Valid JSON: double quotes only, NO trailing commas, newlines inside strings escaped as \\n.
- For all 5 posts: detail[key].length === content[key].slides.length (count them).
- Each post has 11-13 slides, first is "cover", last is "cta", at least one "code" slide.
IMPORTANT: After writing the file successfully, you MUST call the StructuredOutput tool to return the summary (day, ok=true, filePath, and per-post key/slideCount/detailCount/captionWords). Do not end your turn without calling it.`
}

phase('Author')
const results = await parallel(
  DAYS.map((d) => () =>
    agent(buildPrompt(d), { label: `day-${d.day}: ${d.theme}`, phase: 'Author', schema: SCHEMA })
  )
)

const done = results.filter(Boolean)
const failedToReturn = DAYS.filter((d) => !done.find((r) => r && r.day === d.day)).map((d) => d.day)
return {
  daysRequested: DAYS.length,
  daysReturned: done.length,
  failedToReturn,
  summary: done.map((r) => ({ day: r.day, posts: (r.posts || []).length, ok: r.ok })),
}
