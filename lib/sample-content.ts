import { SlideContent } from './types';

// Hand-authored content for representative posts. The rest fall back to templates.
// Keys are "<day>-<postIdx>", matching the post-trim curriculum (100 days).
// Note: stickers use the literal token "DAY-X" which is auto-replaced at render time.

export const SAMPLE_CONTENT: Record<string, SlideContent[]> = {

  // Day 1 — What is AI (Concept) — DEEPENED + DIAGRAMS
  '1-1': [
    { kind: 'cover', title: 'What is Artificial Intelligence?', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'AI is software that mimics tasks we used to think only humans could do — perceiving the world, reasoning about it, learning from data, and deciding what to do next. It is not magic; it is statistics + math + a lot of compute, wrapped in a friendly interface.' },
    { kind: 'diagram', title: 'AI is the umbrella', diagram: { kind: 'tree', root: {
      label: 'AI',
      children: [
        { label: 'Machine Learning', children: [{ label: 'Supervised' }, { label: 'Unsupervised' }, { label: 'Reinforcement' }] },
        { label: 'Rule-based',       children: [{ label: 'Expert systems' }, { label: 'Heuristics' }] },
        { label: 'Robotics',         children: [{ label: 'Vision' }, { label: 'Planning' }] },
      ],
    } } },
    { kind: 'why', title: 'Why everyone talks about it now', bullets: [
      'Foundation models can write, code, design, and reason at near-human level',
      'API access makes it 1,000× cheaper than hiring for many tasks',
      'Compounds with more data + more compute — no ceiling yet',
      'Every product team is being asked: "where does AI fit in?"'
    ] },
    { kind: 'diagram', title: 'AI growth (rough estimates)', diagram: { kind: 'bars', bars: [
      { label: '2018 — GPT-1', value: 1, sub: 'B params' },
      { label: '2020 — GPT-3', value: 175, sub: 'B params' },
      { label: '2022 — PaLM', value: 540, sub: 'B params' },
      { label: '2024 — Frontier', value: 1500, sub: 'B+ params' },
    ], axisLabel: 'parameters (billions)' } },
    { kind: 'visual', title: 'Where you meet AI every day', body: 'Spam filters · Photo face-grouping · Maps ETA · Netflix recs · Voice assistants · Chatbots · Bank fraud alerts · Real-time translation · Autocorrect · Camera scene mode · Search ranking. You probably interact with AI 50+ times before lunch.' },
    { kind: 'mistake', title: 'Common myth', body: 'AI is not sentient and it does not "know" things the way you do. It is a function that maps inputs to outputs — trained on patterns in data. When it works, it feels magical. When it fails, it fails in stupid, confident ways. Treat it as a powerful but fallible tool.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 3 — AI vs ML vs DL (Concept)
  '3-1': [
    { kind: 'cover', title: 'AI vs ML vs Deep Learning', sticker: 'DAY-X' },
    { kind: 'definition', title: 'They are nested', body: 'AI is the umbrella. Machine Learning sits inside it. Deep Learning sits inside ML. They are not three competitors — they are three concentric circles.' },
    { kind: 'how', title: 'AI', body: 'Any system that performs tasks we associate with intelligence — including rule-based systems with zero learning.' },
    { kind: 'how', title: 'Machine Learning', body: 'A subset of AI where the system learns patterns from data instead of being told the rules.' },
    { kind: 'how', title: 'Deep Learning', body: 'A subset of ML using neural networks with many layers. The thing behind GPT, image generators, and most modern AI.' },
    { kind: 'comparison', title: 'Quick cheat sheet', bullets: ['Need rules? → expert system (AI)', 'Need patterns from tabular data? → ML', 'Need images / text / audio? → Deep Learning'] },
    { kind: 'tips', title: 'When choosing', bullets: ['Start simple — try ML first', 'Reach for DL when data is unstructured', 'Bigger model ≠ better model'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 15 — Python Basics (Code Example)
  '15-4': [
    { kind: 'cover', title: 'Python Basics — in code', sticker: 'DAY-X' },
    { kind: 'code', title: 'Variables & types', code: `name = "Saurav"\nage = 24\nis_dev = True\nprint(f"{name}, {age}, {is_dev}")`, codeLang: 'python' },
    { kind: 'code', title: 'Lists & dicts', code: `langs = ["py", "js", "go"]\nuser = {"name": "Saurav", "lvl": 9}\nprint(langs[0], user["name"])`, codeLang: 'python' },
    { kind: 'code', title: 'Loops & conditions', code: `for lang in langs:\n    if lang == "py":\n        print("favourite!")\n    else:\n        print(lang)`, codeLang: 'python' },
    { kind: 'code', title: 'Functions', code: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("you"))`, codeLang: 'python' },
    { kind: 'code', title: 'Comprehensions', code: `squares = [x*x for x in range(5)]\nlookup = {x: x*x for x in range(5)}\nprint(squares, lookup)`, codeLang: 'python' },
    { kind: 'tips', title: 'Pythonic habits', bullets: ['Use f-strings', 'Prefer comprehensions over loops', 'Type-hint public functions', 'Run black + ruff'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 27 — What is ML (Concept) — WITH TREE DIAGRAM
  '27-1': [
    { kind: 'cover', title: 'What is Machine Learning?', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Machine Learning is the practice of teaching computers to find patterns in data so they can make predictions or decisions without being explicitly programmed.' },
    { kind: 'diagram', title: 'The ML landscape', diagram: { kind: 'tree', root: {
      label: 'Machine Learning',
      children: [
        { label: 'Supervised',     children: [{ label: 'Regression' }, { label: 'Classification' }] },
        { label: 'Unsupervised',   children: [{ label: 'Clustering' }, { label: 'Reduction' }] },
        { label: 'Reinforcement',  children: [{ label: 'Policy' }, { label: 'Q-learning' }] },
      ],
    } } },
    { kind: 'diagram', title: 'Traditional vs ML', diagram: { kind: 'compare',
      left:  { title: 'Traditional', items: ['You write the rules', 'Rules → output', 'Brittle on edge cases'] },
      right: { title: 'ML',          items: ['You give data + answers', 'Model learns the rules', 'Generalises better'] },
    } },
    { kind: 'visual', title: 'Real examples', body: 'Spam vs ham (supervised) · Customer segments (unsupervised) · Self-driving cars (reinforcement) · Recommender systems (mixed).' },
    { kind: 'mistake', title: 'It is not magic', body: 'ML is curve fitting at scale. Bad data → bad models. The biggest wins come from clean data, not fancy algorithms.' },
    { kind: 'tips', title: 'Start here', bullets: ['Try scikit-learn first', 'Pick a toy dataset', 'Build, evaluate, iterate', 'Read 1 paper / week'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 41 — What is a Neural Network (Concept) — WITH DIAGRAM
  '41-1': [
    { kind: 'cover', title: 'What is a Neural Network?', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'A neural network is a stack of simple math units (neurons) that, together, learn to map inputs to outputs by adjusting their internal weights.' },
    { kind: 'diagram', title: 'The architecture', diagram: { kind: 'network',
      layers: [4, 6, 6, 3],
      labels: ['Input', 'Hidden', 'Hidden', 'Output'],
    } },
    { kind: 'how', title: 'A single neuron', body: 'Take inputs · multiply by weights · sum them · pass through a non-linear function. That\'s it. One neuron. Stack thousands and you have GPT.' },
    { kind: 'how', title: 'Why "deep" matters', bullets: ['More layers = more abstract features', 'Early layers see edges', 'Middle layers see shapes', 'Late layers see objects / meaning'] },
    { kind: 'code', title: 'First model in PyTorch', code: `import torch.nn as nn\n\nnet = nn.Sequential(\n    nn.Linear(784, 128),\n    nn.ReLU(),\n    nn.Linear(128, 10),\n)`, codeLang: 'python' },
    { kind: 'mistake', title: 'Watch out for', body: 'Vanishing gradients · Overfitting · Forgetting to normalize inputs · Using the wrong activation (please don\'t put sigmoid in deep nets).' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 48 — Transformer (Concept)  [shifted from 49]
  '48-1': [
    { kind: 'cover', title: 'The Transformer, Explained', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'A transformer is a neural network that processes sequences using attention — letting every token "look at" every other token in parallel.' },
    { kind: 'visual', title: 'Why it replaced RNNs', body: 'RNNs walk through tokens one at a time. Transformers process them all at once. That\'s a giant win for GPUs — and for training on the whole internet.' },
    { kind: 'how', title: 'The three flavours', bullets: ['Encoder-only → BERT (understanding)', 'Decoder-only → GPT (generation)', 'Encoder-decoder → T5 (translation)'] },
    { kind: 'how', title: 'The secret sauce: attention', body: 'For each token, compute Query, Key, Value. Score how much every other token should influence it. Weighted sum the Values. Done — that\'s self-attention.' },
    { kind: 'visual', title: 'A block', body: 'Self-attention → add & norm → feed-forward → add & norm. Stack 12 (BERT-base), 96 (GPT-3), or 100+ (modern frontier).' },
    { kind: 'mistake', title: 'Common confusion', body: '"Attention" is not magic memory — it is a weighted average. The depth of the stack + scale of training is what makes the model "smart".' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 55 — What is NLP (Concept)  [shifted from 57]
  '55-1': [
    { kind: 'cover', title: 'What is NLP?', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Natural Language Processing is the field of teaching computers to read, understand, and generate human language.' },
    { kind: 'how', title: 'The pipeline', bullets: ['Tokenize → break text into pieces', 'Embed → turn tokens into vectors', 'Model → process the sequence', 'Decode → produce output'] },
    { kind: 'visual', title: 'Tasks NLP solves', body: 'Translation · Summarization · Q&A · Sentiment · NER · Chatbots · Code generation · Search · Grammar correction · Speech-to-text.' },
    { kind: 'comparison', title: 'Old NLP vs new NLP', bullets: ['Old: regex + rules + tiny models', 'New: one big LLM does almost everything', 'But classic NLP still wins at speed + cost'] },
    { kind: 'how', title: 'The 3 eras', bullets: ['Rules era (1950s–90s)', 'Statistical era (2000s)', 'Deep learning + LLM era (2010s →)'] },
    { kind: 'tips', title: 'Start playing', bullets: ['Hugging Face transformers', 'spaCy for classic NLP', 'OpenAI / Claude APIs', 'Build a small project'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 67 — What is RAG (Concept) — now WITH DIAGRAM
  '67-1': [
    { kind: 'cover', title: 'What is RAG?', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Retrieval-Augmented Generation lets an LLM look up info from your documents before answering — so it stops making things up.' },
    { kind: 'diagram', title: 'The RAG flow', diagram: { kind: 'flow', nodes: [
      { label: 'Question', sub: 'user query' },
      { label: 'Retrieve', sub: 'top-k chunks' },
      { label: 'Augment', sub: 'stuff in prompt' },
      { label: 'Generate', sub: 'LLM answer' },
    ] } },
    { kind: 'why', title: 'Why bother?', bullets: ['Fresh data without retraining', 'Real citations', 'Cheaper than fine-tuning', 'Works on private docs'] },
    { kind: 'visual', title: 'Mental model', body: 'Imagine an open-book exam. The LLM is the student. RAG is what hands it the right pages — right when it needs them.' },
    { kind: 'diagram', title: 'Chatbot vs RAG', diagram: { kind: 'compare',
      left:  { title: 'Plain LLM', items: ['Frozen knowledge', 'No citations', 'Hallucinates', 'Hard to update'] },
      right: { title: 'RAG',       items: ['Live data', 'Real citations', 'Grounded', 'Easy to update'] },
    } },
    { kind: 'tips', title: 'Stack to try', bullets: ['LlamaIndex or LangChain', 'OpenAI / Cohere embeddings', 'Chroma / Qdrant / pgvector', 'Cohere or BGE reranker'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 68 — The RAG Pipeline (Concept) — now WITH DIAGRAM
  '68-1': [
    { kind: 'cover', title: 'The RAG Pipeline, end to end', sticker: 'DAY-X' },
    { kind: 'diagram', title: 'The full pipeline', diagram: { kind: 'pipeline', stages: [
      { label: 'Ingest', detail: 'Load PDFs, Notion, web pages. Strip noise.' },
      { label: 'Chunk', detail: '~500-token windows with overlap. Respect semantic boundaries.' },
      { label: 'Embed', detail: 'text-embedding-3-small or BGE → vectors.' },
      { label: 'Index', detail: 'Push into Chroma / Qdrant / pgvector.' },
    ] } },
    { kind: 'steps', title: '5. Retrieve', body: 'Embed the user query. Run a similarity search. Optionally rerank with a cross-encoder for better precision.' },
    { kind: 'steps', title: '6. Generate', body: 'Stuff the top-k chunks into the prompt as context. Ask the LLM to answer using only what\'s there. Cite sources.' },
    { kind: 'diagram', title: 'Architecture stack', diagram: { kind: 'stack', levels: [
      { label: 'UI (chat)',           sub: 'React, Streamlit' },
      { label: 'Generation',          sub: 'GPT-4, Claude, Llama' },
      { label: 'Retrieval + rerank',  sub: 'BM25 + dense, BGE rerank' },
      { label: 'Embedding model',     sub: 'OpenAI, BGE, Cohere' },
      { label: 'Vector DB',           sub: 'Chroma, Qdrant, pgvector' },
    ] } },
    { kind: 'mistake', title: 'Common mistakes', body: 'Bad chunking · No reranking · Forgetting to include the source in the prompt · Mixing embedding models in one index.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 2 — Narrow AI vs General AI (Concept)
  '2-1': [
    { kind: 'cover', title: 'Narrow AI vs General AI', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Two very different things', body: 'Narrow AI = great at ONE thing (chess, speech-to-text, spam). General AI = human-level across ANY task. Today, everything you use is Narrow.' },
    { kind: 'comparison', title: 'Quick comparison', bullets: ['Narrow → single domain, real today', 'General → broad reasoning, still hypothetical', 'Strong → human-level (a.k.a. AGI)', 'Super → beyond human, sci-fi territory'] },
    { kind: 'visual', title: 'Examples around you', body: 'Siri · Google Translate · Tesla autopilot · GPT · Midjourney — every one of these is brilliant in its lane and useless outside of it.' },
    { kind: 'why', title: 'Why the distinction matters', bullets: ['Avoids overpromising AI capabilities', 'Sets correct expectations for stakeholders', 'Tells you where current research is headed'] },
    { kind: 'how', title: 'Are LLMs General?', body: 'They feel general but they\'re still pattern matchers on text. They struggle with novel reasoning, real-world action, and learning continuously. Closer than ever — not there yet.' },
    { kind: 'mistake', title: 'Marketing trap', body: 'When a product says "general purpose AI", check what it actually does. 99% of the time it\'s a clever Narrow system with a shiny UI.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 4 — A Brief History of AI — DEEPENED + TIMELINE
  '4-1': [
    { kind: 'cover', title: 'A Brief History of AI', sticker: 'DAY-X' },
    { kind: 'definition', title: '70+ years in 8 slides', body: 'AI did not appear with ChatGPT. It is a 70-year story of bursts of optimism, painful winters, and one breakthrough that finally stuck — backprop + GPUs + the internet\'s worth of data.' },
    { kind: 'diagram', title: 'The timeline', diagram: { kind: 'timeline', events: [
      { year: '1956', label: 'Dartmouth', detail: 'McCarthy coins "AI". The field is officially born.' },
      { year: '1986', label: 'Backprop', detail: 'Rumelhart, Hinton, Williams revive neural nets.' },
      { year: '2012', label: 'AlexNet',  detail: 'Deep learning crushes ImageNet using GPUs.' },
      { year: '2017', label: 'Transformer', detail: '"Attention Is All You Need" changes everything.' },
      { year: '2022', label: 'ChatGPT', detail: 'AI becomes a daily-use product for 100M+ people.' },
    ] } },
    { kind: 'steps', title: '1950s–70s — High hopes', body: 'Turing asks "Can machines think?" Symbolic AI dominates. People promise human-level AI in 20 years. The promises slip. The funding dries up. First AI Winter.' },
    { kind: 'steps', title: '1980s — Expert systems boom & bust', body: 'Rule-based "expert systems" briefly take over industry. They scale terribly and are brittle to anything outside the rule book. Second AI Winter follows.' },
    { kind: 'steps', title: '1997–2011 — Quiet progress', body: 'Deep Blue beats Kasparov at chess. Statistical methods quietly take over speech and translation. The field rebrands as "Machine Learning" to escape the stigma.' },
    { kind: 'steps', title: '2012 → 2017 — The Deep Learning revolution', body: 'AlexNet uses GPUs + a deep CNN to dominate ImageNet. The whole field pivots to deep learning. Word2Vec, dropout, batchnorm, ResNets — everything you read about today was invented in this five-year window.' },
    { kind: 'steps', title: '2017 → today — LLMs eat the world', body: 'Transformers replace RNNs. GPT-2, GPT-3, ChatGPT, Claude, Gemini, Llama. Models go from billions to trillions of parameters. AI moves from research labs to your phone in 5 years.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 5 — Real-World AI Applications (Concept)
  '5-1': [
    { kind: 'cover', title: 'Real-World AI Applications', sticker: 'DAY-X' },
    { kind: 'why', title: 'You use AI hourly', bullets: ['Spam filter on your email', 'Photo face-grouping on your phone', 'Maps ETA + traffic routing', 'Netflix / Spotify recommendations'] },
    { kind: 'how', title: 'Industries leveraging AI', bullets: ['Healthcare — diagnostics, drug discovery', 'Finance — fraud, credit scoring', 'Retail — recommendation, demand forecast', 'Manufacturing — defect detection'] },
    { kind: 'visual', title: 'The hot frontier', body: 'Generative AI — writing, coding, design, video. Agentic AI — software that takes actions on your behalf. Multimodal — text + image + audio in one model.' },
    { kind: 'comparison', title: 'Solved vs unsolved', bullets: ['Solved → narrow vision, narrow speech, text gen', 'Solved-ish → translation, summarisation, simple agents', 'Open → robust reasoning, embodied AI, AGI'] },
    { kind: 'tips', title: 'Where to start building', bullets: ['Pick a real problem you have', 'Wrap an LLM API around it', 'Ship in a week, iterate from real feedback'] },
    { kind: 'mistake', title: 'Don\'t', body: 'Don\'t build "AI for AI\'s sake". Pick a problem first. Then ask: does AI actually help here, or is a heuristic enough?' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 8 — Linear Algebra for ML (Concept)
  '8-1': [
    { kind: 'cover', title: 'Linear Algebra for ML', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Why you need it', body: 'Every neural network is matrix multiplication. Every embedding is a vector. If linear algebra clicks, half of ML becomes obvious.' },
    { kind: 'how', title: 'The 4 things to know', bullets: ['Vectors — direction + magnitude', 'Matrices — transformations', 'Dot product — similarity / projection', 'Matrix multiplication — chained transforms'] },
    { kind: 'visual', title: 'Intuition', body: 'A vector is an arrow in space. A matrix bends/rotates/scales that space. Multiplying = applying the transform.' },
    { kind: 'code', title: 'In NumPy', code: `import numpy as np\nA = np.array([[1, 2], [3, 4]])\nv = np.array([5, 6])\nprint(A @ v)  # matrix-vector multiply`, codeLang: 'python' },
    { kind: 'tips', title: 'Resources that click', bullets: ['3Blue1Brown — Essence of Linear Algebra', 'Khan Academy', 'Gilbert Strang MIT lectures', 'Practice in NumPy daily'] },
    { kind: 'mistake', title: 'Common trap', body: 'Memorising formulas without intuition. Always ask "what does this DO geometrically?" first.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 9 — Vectors & Cosine Similarity (Concept) — WITH VECTORS DIAGRAM
  '9-1': [
    { kind: 'cover', title: 'Vectors & Cosine Similarity', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Why this is everywhere', body: 'Every embedding model in 2026 — text, image, audio — outputs vectors. Cosine similarity tells you how "close in meaning" two vectors are. That\'s search. That\'s RAG. That\'s recommendation.' },
    { kind: 'diagram', title: 'Picture two vectors', diagram: { kind: 'vectors', vectors: [
      { label: '"dog"',  x:  0.8, y:  0.6 },
      { label: '"puppy"', x:  0.7, y:  0.7 },
      { label: '"car"',  x: -0.6, y:  0.5 },
    ] } },
    { kind: 'how', title: 'Dot product', body: 'Multiply elements pairwise, sum them up. Big positive = similar direction. Zero = perpendicular. Negative = opposite.' },
    { kind: 'how', title: 'Cosine similarity', body: 'Dot product, but normalised by both vector lengths. Gives a value from -1 (opposite) to 1 (identical). Ignores magnitude — pure angle.' },
    { kind: 'code', title: 'In code', code: `import numpy as np\n\ndef cosine(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nprint(cosine([1,0,0], [1,1,0]))  # 0.707`, codeLang: 'python' },
    { kind: 'tips', title: 'Quick tips', bullets: ['Always normalise embeddings before storing', 'Don\'t mix embedding models in one index', 'Cosine works better than Euclidean for embeddings'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 13 — Gradient Descent — DEEPENED + TRACE DIAGRAM
  '13-1': [
    { kind: 'cover', title: 'Gradient Descent, Visually', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Gradient descent is how every neural network learns: it takes tiny steps downhill on a multi-dimensional loss landscape until it can\'t go down any further. Same trick under every chatbot, image model, and recommender system.' },
    { kind: 'visual', title: 'The mental picture', body: 'You\'re blindfolded on a mountain. To find the valley, you feel which way slopes down, take a step that way, then re-orient. Repeat 10,000 times. That\'s gradient descent — except the mountain has a million dimensions and the steps are guided by calculus.' },
    { kind: 'how', title: 'The algorithm in 4 lines', bullets: [
      '1. Compute the loss → how wrong is the model right now?',
      '2. Compute the gradient → which direction does loss decrease fastest?',
      '3. Take a small step in that direction (size = learning rate)',
      '4. Repeat until loss stops shrinking',
    ] },
    { kind: 'diagram', title: 'Watching a training run', diagram: { kind: 'trace', lines: [
      { text: '$ python train.py --epochs 5', tone: 'comment' },
      { text: 'epoch 1 │ loss = 2.302  acc = 0.11', tone: 'value' },
      { text: 'epoch 2 │ loss = 1.481  acc = 0.55', tone: 'value' },
      { text: 'epoch 3 │ loss = 0.892  acc = 0.74', tone: 'value' },
      { text: 'epoch 4 │ loss = 0.421  acc = 0.86', tone: 'value' },
      { text: 'epoch 5 │ loss = 0.187  acc = 0.94', tone: 'output' },
      { text: '→ converged. saved weights.ckpt', tone: 'arrow' },
    ] } },
    { kind: 'comparison', title: '3 flavours of GD', bullets: [
      'Batch — use ALL data per step. Slow, stable, memory-hungry. Almost never used.',
      'Stochastic (SGD) — one example per step. Fast, noisy, can escape bad minima.',
      'Mini-batch — small batch (32–512). The actual default in every framework.',
    ] },
    { kind: 'code', title: 'One step, by hand', code: `# Simple regression: y = w*x\nloss = (y - w * x) ** 2\ngrad = -2 * x * (y - w * x)\nw -= learning_rate * grad   # the magic line`, codeLang: 'python' },
    { kind: 'mistake', title: 'Common pitfalls', body: 'Learning rate too high → loss oscillates or NaNs out. Too low → it never converges. Stuck in flat regions → use momentum / Adam. Loss decreasing but accuracy not improving → check the loss function matches the task.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 28 — Supervised Learning (Concept) - shifted from 30
  '28-1': [
    { kind: 'cover', title: 'Supervised Learning', sticker: 'DAY-X' },
    { kind: 'definition', title: 'The setup', body: 'You have data with labels: emails marked spam/not-spam, photos labelled cat/dog, houses with their prices. Your model learns to predict the label from the features.' },
    { kind: 'comparison', title: '2 main flavours', bullets: ['Classification → discrete labels (spam vs ham)', 'Regression → continuous values (house price)', 'Same setup, different output head'] },
    { kind: 'how', title: 'The standard loop', bullets: ['Split data: train / val / test', 'Train on train, tune on val', 'Final score on test', 'Never peek at test during training'] },
    { kind: 'visual', title: 'Real applications', body: 'Spam classifiers · Medical diagnosis · Credit scoring · Image recognition · Speech-to-text · Recommender ranking models.' },
    { kind: 'tips', title: 'Algorithms to know', bullets: ['Logistic Regression — fast, interpretable', 'Random Forest — strong baseline', 'XGBoost — wins Kaggle', 'Neural Nets — when data is unstructured'] },
    { kind: 'mistake', title: 'Biggest trap', body: 'Data leakage — accidentally letting test info into training. Your model will look amazing in dev and fail in prod. Always check.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 33 — Bias-Variance Tradeoff (Concept)
  '33-1': [
    { kind: 'cover', title: 'The Bias-Variance Tradeoff', sticker: 'DAY-X' },
    { kind: 'definition', title: 'The most important ML concept', body: 'Every model error breaks into bias (systematic, model is too simple) and variance (model overreacts to noise). The art of ML is balancing them.' },
    { kind: 'comparison', title: 'High bias vs high variance', bullets: ['High bias → underfit, misses real patterns', 'High variance → overfit, learns the noise', 'Goal → low bias AND low variance'] },
    { kind: 'visual', title: 'The dart-board mental model', body: 'Bias = your aim is off-center. Variance = your throws are scattered. You want tight clusters at the bullseye.' },
    { kind: 'how', title: 'What controls each', bullets: ['Simple models → high bias, low variance', 'Complex models → low bias, high variance', 'More data → reduces variance', 'Regularization → controls variance'] },
    { kind: 'tips', title: 'How to diagnose', bullets: ['Compare train vs val error', 'Train high + val high → bias (underfit)', 'Train low + val high → variance (overfit)', 'Both low → ship it'] },
    { kind: 'mistake', title: 'Common confusion', body: '"More layers always help" — wrong. More layers = lower bias but higher variance. With limited data, you might make things worse.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 49 — Attention Mechanism (Concept)
  '49-1': [
    { kind: 'cover', title: 'Attention, Demystified', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Attention lets a model decide which parts of the input matter most for each piece of the output — instead of squishing everything into one bottleneck.' },
    { kind: 'how', title: 'Three vectors per token', bullets: ['Query (Q) — what am I looking for?', 'Key (K) — what do I offer?', 'Value (V) — what info do I carry?'] },
    { kind: 'how', title: 'The recipe', body: 'For each token: score = Q · Kᵀ. Softmax the scores. Weighted sum of Values. The token now has a representation that pulls from the whole sequence.' },
    { kind: 'code', title: 'Scaled dot-product', code: `import torch\nimport torch.nn.functional as F\n\ndef attention(Q, K, V):\n    d = Q.size(-1)\n    scores = (Q @ K.transpose(-2, -1)) / d**0.5\n    weights = F.softmax(scores, dim=-1)\n    return weights @ V`, codeLang: 'python' },
    { kind: 'visual', title: 'Why it changed everything', body: 'Parallelisable (unlike RNNs). Captures long-range dependencies. Scales beautifully with compute. It\'s the engine behind every modern LLM.' },
    { kind: 'mistake', title: 'Common myth', body: '"Attention = memory" — no. It\'s a weighted average over the current context. There\'s no hidden state carried across calls. Memory is something agents bolt on top.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 56 — Tokenization Explained (Concept) - shifted from 58
  '56-1': [
    { kind: 'cover', title: 'Tokenization Explained', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Tokenization is the step where text gets chopped into pieces (tokens) that the model can crunch. "Hello world" → maybe ["Hello", " world"] → [15496, 1917].' },
    { kind: 'how', title: 'Why not char-by-char', bullets: ['Too long → blows context window', 'Loses word-level patterns', 'Slow inference'] },
    { kind: 'how', title: 'Why not whole words', bullets: ['Huge vocabulary (millions)', 'New words break it', 'Misspellings break it'] },
    { kind: 'comparison', title: 'Subword tokenization wins', bullets: ['BPE — used by GPT', 'WordPiece — used by BERT', 'SentencePiece — used by T5, Llama', 'Tiktoken — OpenAI\'s fast BPE'] },
    { kind: 'code', title: 'Try it', code: `import tiktoken\nenc = tiktoken.get_encoding("cl100k_base")\ntokens = enc.encode("Hello, world!")\nprint(tokens)  # [9906, 11, 1917, 0]`, codeLang: 'python' },
    { kind: 'mistake', title: 'Real-world gotcha', body: 'Different tokenizers = different counts. "ChatGPT cost $10 per million tokens" means whatever tokens THEIR tokenizer produces. Always check.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 19 — Decorators Demystified (Concept) — FULL CODE-RICH POST
  '19-1': [
    { kind: 'cover', title: 'Decorators Demystified', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'A decorator is a function that takes another function and returns a new function with extra behaviour. That\'s the whole idea. The @ syntax is just shorthand — `@my_decorator` above a function is the same as writing `my_function = my_decorator(my_function)` underneath.' },
    { kind: 'code', title: 'The minimal example', code: `def shout(fn):\n    def wrapper(*args, **kwargs):\n        result = fn(*args, **kwargs)\n        return result.upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"hello, {name}"\n\nprint(greet("saurav"))  # HELLO, SAURAV`, codeLang: 'python' },
    { kind: 'how', title: 'Why use them?', bullets: [
      'Add cross-cutting concerns (logging, retries, auth) without touching the function body',
      'Keep the main code readable — the decorator name documents the behaviour',
      'Reuse the same wrapping across dozens of functions',
      'They\'re central to web frameworks (Flask, FastAPI, Django) and ML libraries (functools)',
    ] },
    { kind: 'code', title: 'A real-world pattern', code: `import time, functools, logging\n\ndef timed(fn):\n    @functools.wraps(fn)            # preserves name + docstring\n    def wrapper(*args, **kwargs):\n        t0 = time.perf_counter()\n        result = fn(*args, **kwargs)\n        dt = time.perf_counter() - t0\n        logging.info(f"{fn.__name__} took {dt*1000:.1f}ms")\n        return result\n    return wrapper\n\n@timed\ndef expensive_query(user_id: int) -> dict:\n    # ... db call ...\n    return {"user_id": user_id}`, codeLang: 'python' },
    { kind: 'code', title: 'Decorators with arguments', code: `def retry(times: int = 3):\n    def decorator(fn):\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            for attempt in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception as e:\n                    if attempt == times - 1:\n                        raise\n        return wrapper\n    return decorator\n\n@retry(times=5)\ndef flaky_api_call(): ...`, codeLang: 'python' },
    { kind: 'mistake', title: 'Common pitfalls', body: 'Forgetting @functools.wraps → __name__ and docstring point to the wrapper, breaking debuggers and Sphinx. Stacking decorators in the wrong order → confusing behaviour. Mutating closure variables → unexpected shared state across calls.' },
    { kind: 'tips', title: 'Real uses you\'ll see', bullets: [
      '@app.route() in Flask / @app.get() in FastAPI',
      '@property, @staticmethod, @classmethod in OOP',
      '@functools.lru_cache for memoisation',
      '@pytest.fixture for test setup',
      '@dataclass for boilerplate-free classes',
    ] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 22 — Async/Await (Concept) — FULL POST
  '22-1': [
    { kind: 'cover', title: 'Async/Await in Python', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Async lets a single thread juggle many I/O-bound tasks by pausing one while it waits for the network/disk and running another. Not parallelism (multiple CPUs running at once) — concurrency (one CPU switching cleverly). When your code is mostly waiting on APIs or databases, async is a 10-100x speedup.' },
    { kind: 'visual', title: 'Sync vs async, intuitively', body: 'Sync = you cook one meal, wait for it to finish, then start the next. Async = you start three meals at once, stir whichever needs attention. The work isn\'t faster — the wait time overlaps.' },
    { kind: 'code', title: 'The sync version', code: `import time, requests\n\ndef fetch_all(urls: list[str]):\n    results = []\n    for url in urls:\n        results.append(requests.get(url).text)\n    return results\n\n# 10 URLs × 1s each = 10s\nfetch_all(["https://httpbin.org/delay/1"] * 10)`, codeLang: 'python' },
    { kind: 'code', title: 'The async version', code: `import asyncio, httpx\n\nasync def fetch_one(client, url):\n    r = await client.get(url)\n    return r.text\n\nasync def fetch_all(urls):\n    async with httpx.AsyncClient() as client:\n        return await asyncio.gather(\n            *(fetch_one(client, u) for u in urls)\n        )\n\n# Same 10 URLs × 1s each = ~1s total\nasyncio.run(fetch_all(["https://httpbin.org/delay/1"] * 10))`, codeLang: 'python' },
    { kind: 'how', title: 'When async helps (and when not)', bullets: [
      'Big win for I/O — APIs, DBs, files, websockets',
      'No win for CPU-bound work — use multiprocessing or Rust instead',
      'Frameworks: FastAPI, aiohttp, httpx, asyncpg, motor',
      'Mental model: every "await" is a yield point to the event loop',
    ] },
    { kind: 'mistake', title: 'Common pitfalls', body: 'Calling a sync function inside async code blocks the entire event loop — surprising stalls. Forgetting `await` returns a coroutine, not the value. Mixing requests + httpx in the same path. Running asyncio.run() inside another async function — raises RuntimeError.' },
    { kind: 'code', title: 'Pattern: rate-limited concurrent', code: `sem = asyncio.Semaphore(5)            # max 5 in flight\n\nasync def bounded(client, url):\n    async with sem:\n        return await fetch_one(client, url)\n\nasync with httpx.AsyncClient() as c:\n    await asyncio.gather(*(bounded(c, u) for u in urls))`, codeLang: 'python' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 24 — NumPy in 8 Slides (Concept) — FULL POST
  '24-1': [
    { kind: 'cover', title: 'NumPy in 8 Slides', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Why NumPy is everywhere', body: 'NumPy is the foundation under pandas, scikit-learn, PyTorch, TensorFlow, OpenCV, and every other data library. A NumPy array is a typed, contiguous block of memory that\'s 50-100x faster than a Python list for math. Every ML practitioner uses it every day, often without noticing.' },
    { kind: 'code', title: 'Arrays — the basics', code: `import numpy as np\n\na = np.array([1, 2, 3, 4])\nprint(a.shape)      # (4,)\nprint(a.dtype)      # int64\nprint(a.mean())     # 2.5\nprint(a * 2)        # [2 4 6 8] — element-wise\nprint(a @ a)        # 30        — dot product`, codeLang: 'python' },
    { kind: 'code', title: 'Reshape + broadcasting', code: `# A 3x4 matrix\nM = np.arange(12).reshape(3, 4)\nprint(M.shape)      # (3, 4)\n\n# Add a row vector to every row of M\nrow = np.array([10, 20, 30, 40])\nprint(M + row)      # broadcasts to shape (3, 4)\n\n# Transpose\nprint(M.T.shape)    # (4, 3)`, codeLang: 'python' },
    { kind: 'code', title: 'Vectorisation — speed wins', code: `# Slow: Python loop\ndef slow_sum_squares(xs):\n    return sum(x*x for x in xs)\n\n# Fast: NumPy vector op\ndef fast_sum_squares(xs):\n    return np.sum(xs * xs)\n\nxs = np.arange(1_000_000)\n# slow ~150ms · fast ~1.5ms · 100x`, codeLang: 'python' },
    { kind: 'how', title: 'The mental model', bullets: [
      'Arrays are typed + contiguous — NOT like Python lists',
      'Every elementwise op (+, *, sin, log) is vectorised — fast in C',
      'Broadcasting lets you operate on different-but-compatible shapes',
      'Slicing returns views (cheap) not copies — careful when you mutate',
      'Use .copy() when you actually need a copy',
    ] },
    { kind: 'code', title: 'Common patterns', code: `# Boolean mask\nx = np.arange(10)\nprint(x[x > 5])             # [6 7 8 9]\n\n# Random sampling\nrng = np.random.default_rng(42)\nprint(rng.normal(0, 1, size=(3, 3)))\n\n# Stats axis=0 is columns\nM = rng.normal(size=(100, 5))\nprint(M.mean(axis=0))       # mean per column`, codeLang: 'python' },
    { kind: 'mistake', title: 'Common traps', body: 'Mixing dtypes (int + float → upcast and a perf hit). Mutating views and being surprised when the original changes. for-loops over a NumPy array — almost always faster vectorised. Forgetting axis= and getting wrong-direction stats.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 25 — Pandas in 8 Slides (Concept) — FULL POST
  '25-1': [
    { kind: 'cover', title: 'Pandas in 8 Slides', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Pandas is Excel for Python — DataFrames are spreadsheets you can program. It runs on top of NumPy, gives you labelled rows and columns, and handles dirty real-world data: missing values, mixed types, dates, joins. Most data-science code is 70% pandas glue between models.' },
    { kind: 'code', title: 'Load → inspect → filter', code: `import pandas as pd\n\ndf = pd.read_csv("orders.csv")\nprint(df.shape)                       # (rows, cols)\nprint(df.head())                      # first 5 rows\nprint(df.dtypes)                      # column types\nprint(df.describe())                  # summary stats\n\nrecent = df[df["created_at"] > "2026-01-01"]\nprint(recent.shape)`, codeLang: 'python' },
    { kind: 'code', title: 'GroupBy — the killer feature', code: `# Total revenue per customer, top 10\ntop = (\n    df\n    .groupby("customer_id")\n    .agg(revenue=("amount", "sum"), orders=("id", "count"))\n    .sort_values("revenue", ascending=False)\n    .head(10)\n)\nprint(top)`, codeLang: 'python' },
    { kind: 'code', title: 'Joins (merge) just like SQL', code: `users = pd.read_csv("users.csv")\norders = pd.read_csv("orders.csv")\n\nmerged = orders.merge(users, on="user_id", how="left")\nprint(merged[["order_id", "user_name", "amount"]].head())`, codeLang: 'python' },
    { kind: 'how', title: 'Patterns you\'ll use weekly', bullets: [
      'df["col"].value_counts() — quick distribution check',
      'df.pivot_table() — Excel-style pivots in one line',
      'df.fillna(0) / df.dropna() — handle missing values',
      'pd.to_datetime() + .dt accessor — clean date handling',
      'df.apply() — when vectorised ops aren\'t enough (but try harder first)',
    ] },
    { kind: 'code', title: 'Common pitfall: chained assignment', code: `# BAD — sets value on a copy, not the DataFrame\ndf[df.col == "a"]["col"] = "b"   # silent warning, no effect\n\n# GOOD — use .loc with a single indexer\ndf.loc[df["col"] == "a", "col"] = "b"`, codeLang: 'python' },
    { kind: 'mistake', title: 'Common traps', body: 'Chained indexing assigns to a copy and silently does nothing. iterrows() is 100x slower than vectorised ops — almost never the right answer. Mixing index types (string vs int) breaks .loc lookups. Reading 5GB CSV without chunking blows up RAM.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 43 — Backpropagation (Concept) — FULL POST WITH DIAGRAM
  '43-1': [
    { kind: 'cover', title: 'Backpropagation, Step by Step', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'Backprop is the algorithm that figures out how much each weight in a neural network contributed to the wrong answer — so we know how to nudge them. It\'s the chain rule of calculus, applied recursively backward through every layer. Same idea has powered every neural network breakthrough since 1986.' },
    { kind: 'diagram', title: 'Forward + Backward', diagram: { kind: 'flow', nodes: [
      { label: 'Input',  sub: 'features' },
      { label: 'Layers', sub: 'matmuls + activations' },
      { label: 'Loss',   sub: 'how wrong?' },
      { label: '∂Loss/∂w', sub: 'gradients ←' },
    ] } },
    { kind: 'how', title: 'The two passes', bullets: [
      'Forward pass — input flows through layers, produces output + loss',
      'Backward pass — compute ∂Loss/∂w for every weight w',
      'Chain rule does the math; PyTorch / TF do the bookkeeping (autograd)',
      'Update each w with: w ← w − learning_rate × ∂Loss/∂w',
      'Repeat 10,000+ times until loss stops shrinking',
    ] },
    { kind: 'code', title: 'PyTorch — three magic lines', code: `import torch\n\nx = torch.randn(32, 10)             # batch of inputs\ny = torch.randint(0, 2, (32,))      # true labels\n\nlogits = model(x)                   # forward pass\nloss = criterion(logits, y)         # compute loss\n\nloss.backward()                     # backward — fills .grad on every param\noptim.step()                        # update weights\noptim.zero_grad()                   # reset for next iteration`, codeLang: 'python' },
    { kind: 'visual', title: 'The intuition', body: 'Imagine the loss as a hill in a high-dimensional space (one dimension per weight). The gradient points uphill. Backprop computes that gradient by walking backward through the network. You step in the opposite direction. Repeat until the bottom. That\'s training.' },
    { kind: 'mistake', title: 'Common pitfalls', body: 'Forgetting optim.zero_grad() — gradients accumulate across batches → garbage updates. Vanishing gradients in deep networks with sigmoid → use ReLU/GELU. Exploding gradients → use gradient clipping. Detaching tensors you actually want gradients on.' },
    { kind: 'tips', title: 'Production tips', bullets: [
      'Use torch.cuda.amp.autocast() for mixed precision — 2x faster, same accuracy',
      'Gradient accumulation when batch doesn\'t fit in VRAM',
      'Clip gradients with torch.nn.utils.clip_grad_norm_',
      'Watch your loss curve — both train AND val',
      'Save checkpoints regularly; resume on failure',
    ] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 44 — CNN (Concept) — FULL POST WITH DIAGRAM
  '44-1': [
    { kind: 'cover', title: 'Convolutional Neural Networks', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'CNNs are neural networks designed for grid-like data — images, videos, even audio spectrograms. Instead of treating every pixel as independent, they apply small filters that scan across the image, picking up edges, textures, and shapes. Same idea behind every photo app filter, every image classifier, and most medical imaging models.' },
    { kind: 'diagram', title: 'CNN architecture', diagram: { kind: 'pipeline', stages: [
      { label: 'Conv', detail: 'filters scan image, output feature maps' },
      { label: 'Pool', detail: 'downsample (max or avg)' },
      { label: 'Repeat', detail: 'stack conv+pool blocks' },
      { label: 'Classify', detail: 'flatten → dense → softmax' },
    ] } },
    { kind: 'how', title: 'Why convolutions?', bullets: [
      'Parameter sharing — one filter scans the whole image (fewer params)',
      'Translation invariance — a cat is a cat anywhere in the frame',
      'Hierarchical features — early layers see edges, late layers see "cat face"',
      'Local connectivity — each neuron sees a small patch, not the whole image',
    ] },
    { kind: 'code', title: 'Minimal PyTorch CNN', code: `import torch.nn as nn\n\nclass SmallCNN(nn.Module):\n    def __init__(self, num_classes=10):\n        super().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n        )\n        self.head = nn.Sequential(\n            nn.Flatten(),\n            nn.Linear(128 * 4 * 4, 256), nn.ReLU(), nn.Dropout(0.3),\n            nn.Linear(256, num_classes),\n        )\n    def forward(self, x):\n        return self.head(self.features(x))`, codeLang: 'python' },
    { kind: 'visual', title: 'What each layer "sees"', body: 'Layer 1: edges and color blobs. Layer 2: textures and corners. Layer 3: simple shapes (circles, parallel lines). Layer 5: object parts (eyes, wheels). Layer 8: whole objects ("cat", "car"). This hierarchy emerges from training — nobody hand-coded it.' },
    { kind: 'mistake', title: 'Common pitfalls', body: 'Training a CNN from scratch when you have <10k images — almost always worse than fine-tuning ResNet/ViT. Forgetting to normalise pixel values. Using max pool everywhere when avg pool is better for some tasks. Ignoring class imbalance in your dataset.' },
    { kind: 'tips', title: 'Modern CNN advice', bullets: [
      'Fine-tune a pretrained model first; train from scratch only if you must',
      'ResNet / EfficientNet / ConvNeXt are strong defaults',
      'For most new projects, ViT (Vision Transformer) might beat a CNN',
      'Use timm library — it has all the SOTA architectures pretrained',
      'Albumentations for fast data augmentation',
    ] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 62 — LoRA & QLoRA (Concept) — FULL POST WITH DIAGRAM
  '62-1': [
    { kind: 'cover', title: 'LoRA & QLoRA', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'LoRA (Low-Rank Adaptation) is the trick that makes fine-tuning massive LLMs cheap. Instead of updating all 7B parameters, you freeze the base model and train tiny "adapter" matrices alongside it. QLoRA goes further: quantize the frozen base to 4-bit so it fits on a single consumer GPU.' },
    { kind: 'diagram', title: 'LoRA architecture', diagram: { kind: 'compare',
      left:  { title: 'Full fine-tune', items: ['Update 7B params', 'Need 80GB+ VRAM', 'Slow + expensive', 'Risk: catastrophic forgetting'] },
      right: { title: 'LoRA',           items: ['Update ~10M params', '24GB consumer GPU', 'Fast + cheap', 'Base model stays intact'] },
    } },
    { kind: 'how', title: 'How LoRA works', bullets: [
      'Every weight matrix W is frozen — original LLM untouched',
      'Add two small matrices A (in × r) and B (r × out), r ≈ 8 or 16',
      'Effective weight = W + B × A — a tiny low-rank delta',
      'Only A and B are trained, ~0.1% of total params',
      'Merge adapters back into W at inference time, or keep them swappable',
    ] },
    { kind: 'code', title: 'LoRA with Hugging Face PEFT', code: `from peft import LoraConfig, get_peft_model\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B")\ntok = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B")\n\nlora = LoraConfig(\n    r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"],\n    lora_dropout=0.05, bias="none", task_type="CAUSAL_LM",\n)\nmodel = get_peft_model(model, lora)\nmodel.print_trainable_parameters()\n# trainable params: 8,388,608  ||  all params: 8,038,649,856  (0.10%)`, codeLang: 'python' },
    { kind: 'code', title: 'QLoRA — same recipe, less VRAM', code: `from transformers import BitsAndBytesConfig\nimport torch\n\nbnb = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type="nf4",\n    bnb_4bit_compute_dtype=torch.bfloat16,\n)\n\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Llama-3.1-8B", quantization_config=bnb,\n)\n# now LoRA on top — fits in 24GB`, codeLang: 'python' },
    { kind: 'mistake', title: 'Pitfalls', body: 'Choosing rank r too high (32+) — barely better than full fine-tune at much higher cost. Targeting wrong modules — at minimum q_proj + v_proj; often ALL linear layers helps. Forgetting to merge adapters before deployment if you want a single model file. Quality drop with overly aggressive 4-bit quantization.' },
    { kind: 'tips', title: 'When to use what', bullets: [
      'Have 1× A100? Full fine-tune small models, LoRA on 7B-13B',
      'Have 1× 4090 or 3090? QLoRA on 7B-13B',
      'Have only a Macbook? Use a hosted fine-tune (OpenAI, Anthropic, Together)',
      'Need many adapters (per-customer)? LoRA shines — switch adapters per request',
      'Production inference? Merge adapters into base weights for max speed',
    ] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 66 — Temperature, Top-p, Top-k (Concept) — FULL POST
  '66-1': [
    { kind: 'cover', title: 'Temperature, Top-p, Top-k', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'These are the three knobs that control how creative (or how factual) an LLM is when it generates the next token. Same model, same prompt, three knobs → wildly different outputs. Understanding them is the difference between "the model is random" and "I dialed in the model".' },
    { kind: 'how', title: 'Temperature — softens the distribution', bullets: [
      'temp = 0 → always picks the highest-probability token (deterministic, repetitive)',
      'temp = 0.7 → balanced; default for chat',
      'temp = 1.5 → very random; useful for creative writing',
      'temp = 2.0 → nonsense; the model basically rolls dice',
      'Formula: divide logits by temperature, then softmax',
    ] },
    { kind: 'how', title: 'Top-p (nucleus) — pick from top probability mass', bullets: [
      'top_p = 0.1 → only sample from tokens that make up 10% of mass (very tight)',
      'top_p = 0.9 → consider tokens making up 90% of mass (broad)',
      'Adaptive: number of candidates changes per step',
      'Modern default for chat: top_p = 0.95',
    ] },
    { kind: 'how', title: 'Top-k — pick from top-k candidates', bullets: [
      'top_k = 1 → greedy (same as temp = 0)',
      'top_k = 40 → typical; fixed-size shortlist',
      'Simpler than top_p but less adaptive',
      'Usually combine: top_k = 50 AND top_p = 0.95',
    ] },
    { kind: 'code', title: 'In code', code: `# OpenAI / OpenAI-compatible APIs\nresp = client.chat.completions.create(\n    model="gpt-4o-mini",\n    messages=msgs,\n    temperature=0.7,    # creativity\n    top_p=0.95,         # nucleus\n    max_tokens=512,\n    # top_k not exposed; baked into the model\n)\n\n# Anthropic Claude\nresp = client.messages.create(\n    model="claude-3-5-sonnet-latest",\n    max_tokens=512,\n    temperature=0.7, top_p=0.95, top_k=40,\n    messages=msgs,\n)`, codeLang: 'python' },
    { kind: 'visual', title: 'Recipes by task', body: 'Code generation → temp 0.2, top_p 0.95. Factual Q&A → temp 0.3. Chat → temp 0.7. Brainstorming → temp 1.0. Creative writing → temp 1.2. Always pin a seed for tests so you can reproduce.' },
    { kind: 'mistake', title: 'Common traps', body: 'Setting both temperature and top_p extreme — they interact weirdly. Asking for factual answers at temp 1.0 — model will confidently invent. Forgetting that temp 0 doesn\'t always mean reproducible (some implementations still have variance). Cargo-culting temp 0.7 for everything.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 69 — Chunking Strategies (Concept) — FULL RAG POST
  '69-1': [
    { kind: 'cover', title: 'Chunking Strategies for RAG', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Why chunking matters', body: 'Chunking is the silent killer of RAG quality. If your chunks cut sentences in half, your embeddings are garbage. If chunks are too big, retrieval drowns in noise. If too small, the model has no context. Picking the right strategy is the single highest-leverage RAG decision.' },
    { kind: 'diagram', title: 'Chunk size tradeoffs', diagram: { kind: 'compare',
      left:  { title: 'Small chunks (~200 tokens)', items: ['High precision', 'Fits more in prompt', 'Loses context', 'More embeddings to store'] },
      right: { title: 'Large chunks (~1000+)',     items: ['Keeps context', 'Fewer embeddings', 'Noisy retrieval', 'May exceed embed limit'] },
    } },
    { kind: 'how', title: 'The 5 main strategies', bullets: [
      '1. Fixed-size — split every N tokens. Simple, often awful.',
      '2. Sentence — split on . ! ? Respects boundaries.',
      '3. Recursive — try paragraph, then sentence, then word.',
      '4. Semantic — split where meaning shifts (slow but high quality).',
      '5. Document-aware — preserve headings, tables, code blocks intact.',
    ] },
    { kind: 'code', title: 'Recursive chunking with LangChain', code: `from langchain_text_splitters import RecursiveCharacterTextSplitter\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=500,\n    chunk_overlap=80,\n    separators=["\\n\\n", "\\n", ". ", " ", ""],\n)\n\nchunks = splitter.split_text(long_document)\nprint(f"Got {len(chunks)} chunks, avg size {sum(len(c) for c in chunks)/len(chunks):.0f}")`, codeLang: 'python' },
    { kind: 'code', title: 'Semantic chunking', code: `from langchain_experimental.text_splitter import SemanticChunker\nfrom langchain_openai import OpenAIEmbeddings\n\nsplitter = SemanticChunker(\n    OpenAIEmbeddings(model="text-embedding-3-small"),\n    breakpoint_threshold_type="percentile",\n    breakpoint_threshold_amount=95,\n)\n\nchunks = splitter.create_documents([long_document])`, codeLang: 'python' },
    { kind: 'tips', title: 'Practical defaults', bullets: [
      'Start with recursive, chunk_size=500, overlap=80',
      'Bump to 800-1000 if your domain has long structured passages',
      'For code: split on function/class boundaries, not character count',
      'For tables: keep the entire table as ONE chunk',
      'Always measure retrieval quality — recall@5 + precision@5',
    ] },
    { kind: 'mistake', title: 'Common chunking mistakes', body: 'No overlap → information at boundaries is lost forever. Splitting code mid-function. Splitting tables across chunks. Same chunk_size for all document types (a tweet vs a textbook chapter). Forgetting metadata — without title/source/section, retrieval can\'t filter intelligently.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 73 — Hybrid Search (Concept) — FULL POST WITH DIAGRAM
  '73-1': [
    { kind: 'cover', title: 'Hybrid Search (BM25 + Vector)', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Why hybrid wins', body: 'Pure vector search is great at meaning but terrible at exact terms (model numbers, error codes, IDs). Pure keyword search (BM25) is great at exact terms but blind to synonyms and paraphrases. Hybrid search combines both — and in production it beats either one alone by 15-30% on real retrieval benchmarks.' },
    { kind: 'diagram', title: 'The hybrid pipeline', diagram: { kind: 'flow', nodes: [
      { label: 'Query',    sub: 'user text' },
      { label: 'BM25',     sub: 'exact terms' },
      { label: 'Vectors',  sub: 'semantic' },
      { label: 'Fuse',     sub: 'RRF / weighted' },
      { label: 'Rerank',   sub: 'cross-encoder' },
    ] } },
    { kind: 'how', title: 'How the fusion works', bullets: [
      'Run query through both BM25 and dense retrieval',
      'Get top-50 from each — overlap is normal',
      'Fuse with Reciprocal Rank Fusion (RRF): score = Σ 1/(k + rank)',
      'Send top-20 fused results to a reranker (cross-encoder)',
      'Reranker is slower but much more accurate — final top-5 goes to the LLM',
    ] },
    { kind: 'code', title: 'Hybrid with Qdrant', code: `from qdrant_client import QdrantClient\nfrom qdrant_client.models import Prefetch, FusionQuery, Fusion\n\nclient = QdrantClient("http://localhost:6333")\n\nresults = client.query_points(\n    collection_name="docs",\n    prefetch=[\n        Prefetch(query=dense_embedding, using="dense", limit=50),\n        Prefetch(query=sparse_vector,    using="sparse", limit=50),\n    ],\n    query=FusionQuery(fusion=Fusion.RRF),\n    limit=20,\n)\nfor r in results.points[:5]:\n    print(r.score, r.payload["title"])`, codeLang: 'python' },
    { kind: 'code', title: 'Add a reranker', code: `from sentence_transformers import CrossEncoder\n\nreranker = CrossEncoder("BAAI/bge-reranker-large")\npairs = [(query, r.payload["text"]) for r in results.points]\nscores = reranker.predict(pairs)\nreranked = sorted(zip(scores, results.points), reverse=True)[:5]\nfor s, r in reranked:\n    print(f"{s:.3f}  {r.payload['title']}")`, codeLang: 'python' },
    { kind: 'tips', title: 'When hybrid is essential', bullets: [
      'Codebases / docs with function names, IDs, error codes',
      'Legal / medical with exact terminology',
      'Product catalogs with SKUs and model numbers',
      'Multilingual or named-entity-heavy domains',
      'Anywhere users mix natural language + jargon',
    ] },
    { kind: 'mistake', title: 'Common pitfalls', body: 'Skipping the reranker — BM25 + dense alone leaves ~10-15% accuracy on the table. Tuning weights instead of using RRF (which is parameter-free). Forgetting to lowercase + stem for BM25. Reranking too many candidates (40+) → latency explodes for marginal gain.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 81 — SQL vs NoSQL (Concept) — FULL POST
  '81-1': [
    { kind: 'cover', title: 'SQL vs NoSQL', sticker: 'DAY-X' },
    { kind: 'definition', title: 'The honest answer', body: 'There is no winner. SQL and NoSQL solve different problems and modern stacks usually use both — Postgres for relations + transactions, Redis for cache + sessions, sometimes a vector DB for embeddings. The question is never "which is better" but "which access pattern do I have?".' },
    { kind: 'diagram', title: 'When to use which', diagram: { kind: 'compare',
      left:  { title: 'SQL (Postgres)', items: ['Strong relations + joins', 'Transactions, ACID', 'Schema-enforced data', 'Reporting + analytics', 'Audit + compliance'] },
      right: { title: 'NoSQL (Mongo/Redis)', items: ['Fast key-value lookups', 'Flexible / nested docs', 'Caching + sessions', 'Real-time leaderboards', 'Event sourcing'] },
    } },
    { kind: 'how', title: 'Common pairings in real stacks', bullets: [
      'Postgres + Redis — primary store + cache layer (most common)',
      'Postgres + pgvector — relational data + embeddings in ONE DB',
      'MongoDB + Redis — flexible docs + ephemeral state',
      'DynamoDB + ElasticSearch — scale + search on AWS',
      'Snowflake + Postgres — OLAP for analytics, OLTP for app',
    ] },
    { kind: 'code', title: 'SQL — relational + joins', code: `-- Top customers by 30-day revenue\nSELECT c.id, c.name, SUM(o.amount_cents)::numeric / 100 AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\n  AND o.status = 'paid'\nGROUP BY c.id, c.name\nORDER BY revenue DESC\nLIMIT 10;`, codeLang: 'sql' },
    { kind: 'code', title: 'Redis — key-value + leaderboards', code: `import redis\nr = redis.Redis(decode_responses=True)\n\n# Increment a counter atomically\nr.incr("requests:today")\n\n# Sorted set (leaderboard)\nr.zadd("score:global", {"alice": 9001, "bob": 7500})\ntop = r.zrevrange("score:global", 0, 9, withscores=True)\n\n# Cache with TTL\nr.setex("user:42", 600, json.dumps(user_data))`, codeLang: 'python' },
    { kind: 'tips', title: 'How to choose', bullets: [
      'Many-to-many relations? → SQL',
      'Need transactions across records? → SQL',
      'High-throughput key-value or pub/sub? → Redis',
      'Flexible nested documents, no joins? → Mongo',
      'Embeddings + relational data? → pgvector',
      'Reporting / BI / OLAP? → Snowflake or BigQuery, not your app DB',
    ] },
    { kind: 'mistake', title: 'The common trap', body: '"NoSQL = no schema" is a lie — schemas always exist, the question is who enforces them. Picking NoSQL for "scale" before you\'ve hit Postgres limits is premature optimisation. Most apps under 1M users are perfectly fine on Postgres alone.' },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],

  // Day 75 — What is an AI Agent (Concept) — WITH ReAct DIAGRAM
  '75-1': [
    { kind: 'cover', title: 'What is an AI Agent?', sticker: 'DAY-X' },
    { kind: 'definition', title: 'In one line', body: 'An AI agent is an LLM that can use tools, observe results, and decide what to do next — looping until the goal is met.' },
    { kind: 'diagram', title: 'The ReAct loop', diagram: { kind: 'cycle', nodes: [
      { label: 'Think' },
      { label: 'Act' },
      { label: 'Observe' },
      { label: 'Reflect' },
    ] } },
    { kind: 'diagram', title: 'Chatbot vs Agent', diagram: { kind: 'compare',
      left:  { title: 'Chatbot',  items: ['1 turn in, 1 turn out', 'No tools', 'No memory', 'Just replies'] },
      right: { title: 'Agent',    items: ['Many turns', 'Calls tools', 'Has memory', 'Pursues goals'] },
    } },
    { kind: 'visual', title: 'Real examples', body: 'Code agents (Claude Code, Cursor) · Browser agents · Research agents · Customer support agents · Sales follow-up agents.' },
    { kind: 'mistake', title: 'Why most fail', body: 'They wander · They hallucinate tools · They never stop · They use the wrong tool · They forget the goal.' },
    { kind: 'tips', title: 'Build a baby agent', bullets: ['Pick 2-3 tools max', 'Define the goal sharply', 'Add a step limit', 'Log everything', 'Eval before shipping'] },
    { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X' },
  ],
};
