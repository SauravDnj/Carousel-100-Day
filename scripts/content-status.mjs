// Generates CONTENT-STATUS.md — a single live progress report for all 100 days
// (500 posts). Re-run any time to refresh: `node scripts/content-status.mjs`.
//
// Status per post (day-postIdx):
//   ✅ Completed  — present in lib/posts-content.json (canonical, merged) with a
//                   matching detail array in lib/posts-detail.json.
//   📝 Authored   — written to lib/authored/day-N.json but not yet merged.
//   ⏳ Pending    — not authored yet.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return {}; } };

const content = read(path.join(root, 'lib', 'posts-content.json'));
const detail = read(path.join(root, 'lib', 'posts-detail.json'));

// Theme/category plan (Days 1-100), mirrors lib/curriculum.ts PLAN.
const PLAN = [
  ['What is Artificial Intelligence?', 'AI Fundamentals'], ['Narrow AI vs General AI', 'AI Fundamentals'],
  ['AI vs ML vs Deep Learning', 'AI Fundamentals'], ['A Brief History of AI', 'AI Fundamentals'],
  ['Real-World AI Applications', 'AI Fundamentals'], ['AI Ethics & Bias', 'AI Fundamentals'],
  ['How Models Learn (Intuition)', 'AI Fundamentals'], ['Linear Algebra for ML', 'Math for ML'],
  ['Vectors, Dot Products & Cosine Similarity', 'Math for ML'], ['Probability for ML', 'Math for ML'],
  ['Statistics Essentials', 'Math for ML'], ['Calculus & Derivatives', 'Math for ML'],
  ['Gradient Descent, Visually', 'Math for ML'], ['Distance Metrics: L1, L2, Cosine', 'Math for ML'],
  ['Python Basics in 8 Slides', 'Python'], ['Python Data Structures', 'Python'],
  ['List & Dict Comprehensions', 'Python'], ['Functions, *args, **kwargs', 'Python'],
  ['Decorators Demystified', 'Python'], ['Classes & OOP in Python', 'Python'],
  ['Generators & Iterators', 'Python'], ['Async/Await in Python', 'Python'],
  ['Virtual Environments & uv', 'Python'], ['NumPy in 8 Slides', 'Python'],
  ['Pandas in 8 Slides', 'Python'], ['Matplotlib & Seaborn', 'Python'],
  ['What is Machine Learning?', 'Machine Learning'], ['Supervised Learning', 'Machine Learning'],
  ['Unsupervised Learning', 'Machine Learning'], ['Reinforcement Learning', 'Machine Learning'],
  ['Train / Validation / Test Splits', 'Machine Learning'], ['Cross Validation', 'Machine Learning'],
  ['Bias-Variance Tradeoff', 'Machine Learning'], ['Overfitting & Regularization', 'Machine Learning'],
  ['Linear Regression', 'Machine Learning'], ['Logistic Regression', 'Machine Learning'],
  ['Decision Trees', 'Machine Learning'], ['Random Forests', 'Machine Learning'],
  ['Gradient Boosting & XGBoost', 'Machine Learning'], ['Support Vector Machines', 'Machine Learning'],
  ['What is a Neural Network?', 'Deep Learning'], ['Activation Functions', 'Deep Learning'],
  ['Backpropagation, Step by Step', 'Deep Learning'], ['Convolutional Neural Networks', 'Deep Learning'],
  ['Recurrent Neural Networks', 'Deep Learning'], ['LSTMs & GRUs', 'Deep Learning'],
  ['Dropout & BatchNorm', 'Deep Learning'], ['The Transformer, Explained', 'Deep Learning'],
  ['Attention Mechanism', 'Deep Learning'], ['Self-Attention vs Cross-Attention', 'Deep Learning'],
  ['Positional Encodings', 'Deep Learning'], ['Embeddings, Visually', 'Deep Learning'],
  ['PyTorch in 8 Slides', 'Deep Learning'], ['TensorFlow in 8 Slides', 'Deep Learning'],
  ['What is NLP?', 'NLP & LLMs'], ['Tokenization Explained', 'NLP & LLMs'],
  ['BPE & WordPiece', 'NLP & LLMs'], ['Word2Vec & GloVe', 'NLP & LLMs'],
  ['Language Models 101', 'NLP & LLMs'], ['GPT vs BERT', 'NLP & LLMs'],
  ['Fine-Tuning LLMs', 'NLP & LLMs'], ['LoRA & QLoRA', 'NLP & LLMs'],
  ['Quantization (4-bit, 8-bit)', 'NLP & LLMs'], ['RLHF, DPO, PPO', 'NLP & LLMs'],
  ['Context Windows & KV Cache', 'NLP & LLMs'], ['Temperature, Top-p, Top-k', 'NLP & LLMs'],
  ['What is RAG?', 'RAG'], ['The RAG Pipeline', 'RAG'], ['Chunking Strategies', 'RAG'],
  ['Embedding Models Compared', 'RAG'], ['Vector Search Basics', 'RAG'],
  ['Hybrid Search (BM25 + Vector)', 'RAG'], ['Reranking with Cross-Encoders', 'RAG'],
  ['Evaluating RAG Quality', 'RAG'], ['What is an AI Agent?', 'AI Agents'],
  ['The ReAct Pattern', 'AI Agents'], ['Tool Calling / Function Calling', 'AI Agents'],
  ['Multi-Agent Systems', 'AI Agents'], ['LangChain Crash Course', 'AI Tools'],
  ['LlamaIndex Crash Course', 'AI Tools'], ['SQL vs NoSQL', 'SQL Databases'],
  ['PostgreSQL Essentials', 'SQL Databases'], ['Indexes & Query Plans', 'SQL Databases'],
  ['MongoDB in 8 Slides', 'NoSQL Databases'], ['Redis: Caching & Beyond', 'NoSQL Databases'],
  ['Pinecone for Vector Search', 'Vector Databases'], ['Weaviate Essentials', 'Vector Databases'],
  ['Qdrant in 8 Slides', 'Vector Databases'], ['Chroma for Local RAG', 'Vector Databases'],
  ['FAISS Deep Dive', 'Vector Databases'], ['pgvector: Postgres for AI', 'Vector Databases'],
  ['OpenAI & Claude APIs', 'AI Tools'], ['Hugging Face Hub', 'AI Tools'],
  ['Prompt Engineering 101', 'Prompt Engineering'], ['Chain-of-Thought Prompting', 'Prompt Engineering'],
  ['MLOps in 8 Slides', 'MLOps'], ['Docker for ML', 'MLOps'],
  ['Serving Models with FastAPI', 'Production AI'], ['Monitoring LLMs in Production', 'Production AI'],
  ['Build Your AI Portfolio', 'Production AI'],
];

// Load authored (un-merged) day-files.
const authoredDir = path.join(root, 'lib', 'authored');
const authored = {};
if (fs.existsSync(authoredDir)) {
  for (const f of fs.readdirSync(authoredDir)) {
    const m = f.match(/^day-(\d+)\.json$/);
    if (!m) continue;
    const j = read(path.join(authoredDir, f));
    if (j && j.content) authored[parseInt(m[1])] = j;
  }
}

function postStatus(day, idx) {
  const key = `${day}-${idx}`;
  const c = content[key];
  if (c && Array.isArray(c.slides) && c.slides.length && Array.isArray(detail[key]) && detail[key].length === c.slides.length) {
    return { state: 'done', slides: c.slides.length };
  }
  const a = authored[day];
  if (a && a.content && a.content[key] && Array.isArray(a.content[key].slides)) {
    const sl = a.content[key].slides.length;
    const dt = a.detail && Array.isArray(a.detail[key]) ? a.detail[key].length : 0;
    return { state: 'authored', slides: sl, match: dt === sl };
  }
  return { state: 'pending', slides: 0 };
}

const ICON = { done: '✅', authored: '📝', pending: '⏳' };
let totals = { done: 0, authored: 0, pending: 0, slides: 0 };
const rows = [];

for (let day = 1; day <= 100; day++) {
  const [theme, category] = PLAN[day - 1];
  const cells = [];
  let daySlides = 0;
  let dayStates = { done: 0, authored: 0, pending: 0 };
  for (let idx = 1; idx <= 5; idx++) {
    const s = postStatus(day, idx);
    totals[s.state]++;
    dayStates[s.state]++;
    daySlides += s.slides;
    totals.slides += s.slides;
    cells.push(s.slides ? `${ICON[s.state]}${s.slides}` : ICON[s.state]);
  }
  const dayIcon = dayStates.done === 5 ? '✅' : dayStates.pending === 5 ? '⏳' : '🔄';
  rows.push(`| ${dayIcon} ${day} | ${theme} | ${category} | ${cells.join(' ')} | ${daySlides || '—'} |`);
}

const totalPosts = 500;
const pct = ((totals.done / totalPosts) * 100).toFixed(1);
const barLen = 40;
const filled = Math.round((totals.done / totalPosts) * barLen);
const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

const md = `# Carousel Content — Build Status

_Auto-generated by \`scripts/content-status.mjs\`. Re-run to refresh._
_Last updated: ${stamp}_

## Overall: ${totals.done} / ${totalPosts} posts completed (${pct}%)

\`\`\`
${bar}  ${pct}%
\`\`\`

| State | Posts | Meaning |
|---|---|---|
| ✅ Completed | ${totals.done} | merged into \`posts-content.json\` + matching deep-dive details |
| 📝 Authored  | ${totals.authored} | written to \`lib/authored/\`, waiting to be merged |
| ⏳ Pending   | ${totals.pending} | not authored yet |

Total slides authored so far: **${totals.slides}**.

Legend per post cell: \`✅12\` = completed with 12 slides · \`📝12\` = authored (awaiting merge) · \`⏳\` = pending.
Day icon: ✅ all 5 done · 🔄 in progress · ⏳ none yet.

## Per-day breakdown (5 posts each: Concept · Why · How · Code · Mistakes)

| Day | Theme | Category | P1 P2 P3 P4 P5 | Slides |
|---|---|---|---|---|
${rows.join('\n')}
`;

fs.writeFileSync(path.join(root, 'CONTENT-STATUS.md'), md);
console.log(`Wrote CONTENT-STATUS.md — ${totals.done} done, ${totals.authored} authored(pending merge), ${totals.pending} pending. Slides: ${totals.slides}`);
