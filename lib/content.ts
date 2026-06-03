import { Category, DiagramSpec, PostAngle, PostTopic, SlideContent, DayTopic } from './types';
import { getPost } from './curriculum';
import { SAMPLE_CONTENT } from './sample-content';
import POSTS_CONTENT_JSON from './posts-content.json';
import POSTS_DETAIL_JSON from './posts-detail.json';

// Hand-authored, in-depth content for every post, keyed by "<day>-<postIdx>".
// Each entry holds a topic-specific Instagram `caption` plus the `slides`.
// This is the PRIMARY source: it takes precedence over SAMPLE_CONTENT and the
// generated template. Authored progressively in phases of 10 posts.
// JSON literal types are wider than our unions, so cast through `unknown`.
interface AuthoredPost { caption?: string; slides: SlideContent[] }
const POSTS_CONTENT = POSTS_CONTENT_JSON as unknown as Record<string, AuthoredPost>;

// Per-slide "Deep Dive" write-ups (2–3 paragraphs each), kept in a SEPARATE file
// so the slides file stays stable. Keyed by "<day>-<postIdx>" → string[] aligned
// to slide index. Merged onto each slide's `detail` field by getSlides().
const POSTS_DETAIL = POSTS_DETAIL_JSON as unknown as Record<string, string[]>;

// Per-category flavour data. Used to make the template fallback feel hand-tailored
// (real examples, real pitfalls, real tools) instead of generic "AI is cool" boilerplate.
interface CategoryFlavour {
  examples: string[];          // 5-8 real applications
  pitfall: string;             // the most common mistake
  pitfalls: string[];          // 3-5 specific failure modes
  stack: string[];             // 4-6 tools commonly used
  whyMatters: string[];        // 4-5 specific reasons this matters
  beginnerTrap: string;        // common beginner misconception
  expertTake: string;          // what experts know that beginners don't
  codeSeed: { lang: 'python' | 'typescript' | 'sql' | 'bash'; example: string };
}

const CATEGORY_FLAVOUR: Record<Category, CategoryFlavour> = {
  'AI Fundamentals': {
    examples: ['spam detection', 'photo face-grouping', 'maps ETA', 'voice assistants', 'recommender systems', 'fraud alerts', 'translation', 'autocorrect'],
    pitfall: 'Treating AI as magic instead of statistics + compute.',
    pitfalls: ['Believing the marketing — most "AI" is narrow ML', 'Skipping fundamentals and jumping straight to LLMs', 'Confusing confidence with correctness', 'Building "AI for AI\'s sake" with no real problem'],
    stack: ['scikit-learn', 'PyTorch', 'Hugging Face Transformers', 'OpenAI / Anthropic API', 'LangChain'],
    whyMatters: ['Every company is asking where AI fits in their stack', 'Foundations transfer across every advanced topic', 'Interviewers test these — even at senior levels', 'Helps you spot AI-snake-oil products from a mile away'],
    beginnerTrap: 'Thinking the latest LLM is "intelligent" — it\'s a sophisticated pattern matcher that can fail in stupid, confident ways.',
    expertTake: 'The hard part is rarely the model — it\'s the data pipeline, the eval setup, and the boundary between what the model handles and what code handles.',
    codeSeed: { lang: 'python', example: `from openai import OpenAI\nclient = OpenAI()\n\nresp = client.chat.completions.create(\n    model="gpt-4o-mini",\n    messages=[{"role": "user", "content": "Hello AI"}],\n)\nprint(resp.choices[0].message.content)` },
  },
  'Machine Learning': {
    examples: ['credit scoring', 'churn prediction', 'demand forecasting', 'A/B test analysis', 'customer segmentation', 'click-through prediction'],
    pitfall: 'Optimising accuracy on imbalanced data — your model just predicts the majority class.',
    pitfalls: ['Data leakage between train and test', 'Choosing accuracy on imbalanced classes', 'No baseline to compare against', 'Ignoring feature scaling for distance-based models', 'Tuning hyperparameters on the test set'],
    stack: ['scikit-learn', 'XGBoost', 'LightGBM', 'pandas', 'NumPy', 'mlflow'],
    whyMatters: ['Most production AI today is still classic ML, not LLMs', 'Far cheaper + faster than deep learning for tabular data', 'Easier to explain to stakeholders + auditors', 'Beats LLMs on structured data 9 times out of 10'],
    beginnerTrap: 'Reaching for deep learning when XGBoost on the raw features would have worked in 10 lines.',
    expertTake: 'The biggest wins come from feature engineering and data quality. The choice of algorithm matters less than people think — pick a strong baseline (GBDT) and iterate on inputs.',
    codeSeed: { lang: 'python', example: `from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import f1_score\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = RandomForestClassifier(n_estimators=300, random_state=42)\nmodel.fit(X_train, y_train)\nprint("f1:", f1_score(y_test, model.predict(X_test), average="macro"))` },
  },
  'Deep Learning': {
    examples: ['image classification', 'speech recognition', 'text generation', 'protein folding (AlphaFold)', 'medical imaging', 'self-driving perception'],
    pitfall: 'Stacking layers without normalising inputs — your gradients explode or vanish.',
    pitfalls: ['Forgetting to normalise inputs to mean 0, std 1', 'Sigmoid in deep networks (vanishing gradients)', 'Learning rate too high → NaN losses', 'Tiny batch sizes that don\'t use the GPU', 'No validation loop → silent overfitting'],
    stack: ['PyTorch', 'TensorFlow / Keras', 'Lightning', 'Weights & Biases', 'Hugging Face Accelerate', 'CUDA'],
    whyMatters: ['Powers every modern AI breakthrough (vision, speech, LLMs)', 'Compute scales linearly with data — the recipe finally works', 'Frameworks like PyTorch make it accessible in a weekend', 'Open-source weights mean you can run frontier models locally'],
    beginnerTrap: 'Tuning architectures endlessly when better data would give a 10x bigger win.',
    expertTake: 'The model is rarely the bottleneck. Throughput, mixed precision, gradient accumulation, and data loading are. Optimize those before adding more parameters.',
    codeSeed: { lang: 'python', example: `import torch\nimport torch.nn as nn\n\nclass MLP(nn.Module):\n    def __init__(self, in_dim, hidden, out_dim):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(in_dim, hidden), nn.ReLU(),\n            nn.Linear(hidden, hidden), nn.ReLU(),\n            nn.Linear(hidden, out_dim),\n        )\n    def forward(self, x):\n        return self.net(x)\n\nmodel = MLP(784, 256, 10)\noptim = torch.optim.AdamW(model.parameters(), lr=3e-4)` },
  },
  'NLP & LLMs': {
    examples: ['translation', 'summarisation', 'semantic search', 'sentiment analysis', 'named-entity extraction', 'code generation', 'chatbots'],
    pitfall: 'Comparing token counts across different tokenizers — they\'re not the same unit.',
    pitfalls: ['Mixing tokenizers across encoder + retrieval', 'Cutting context windows mid-sentence', 'No system prompt → unpredictable behaviour', 'Temperature too high → factual drift', 'Ignoring prompt injection on user input'],
    stack: ['Hugging Face Transformers', 'tiktoken', 'spaCy', 'OpenAI / Anthropic / Cohere APIs', 'vLLM', 'Llama.cpp'],
    whyMatters: ['LLMs are the most-asked-about topic in tech right now', 'One API call replaces months of classic NLP code', 'Every product is asking "can we add an LLM?"', 'Major comp differential — LLM engineers earn 20-40% more than ML generalists'],
    beginnerTrap: 'Thinking LLMs "understand" you. They\'re statistical next-token predictors with great context.',
    expertTake: 'Most LLM apps fail on evals, not on prompts. Build an eval set before you write a single prompt — otherwise you\'re flying blind.',
    codeSeed: { lang: 'python', example: `from anthropic import Anthropic\n\nclient = Anthropic()\nmessage = client.messages.create(\n    model="claude-3-5-sonnet-latest",\n    max_tokens=1024,\n    system="You are a precise technical writer.",\n    messages=[{"role": "user", "content": "Explain LoRA in 3 lines."}],\n)\nprint(message.content[0].text)` },
  },
  'RAG': {
    examples: ['doc Q&A bots', 'customer support deflection', 'research assistants', 'internal wikis', 'code-aware coding tools', 'enterprise knowledge search'],
    pitfall: 'Bad chunking. Every other RAG problem is downstream of this.',
    pitfalls: ['Cutting chunks mid-paragraph or mid-sentence', 'No reranking → recall is fine but precision is awful', 'Mixing embedding models across the index', 'Forgetting to cite sources in the LLM output', 'Not measuring retrieval quality separately from answer quality'],
    stack: ['LlamaIndex', 'LangChain', 'Chroma / Qdrant / pgvector / Pinecone', 'BGE / Cohere rerankers', 'text-embedding-3-small / large', 'OpenAI / Claude / Llama for generation'],
    whyMatters: ['Cheapest way to put a private knowledge base behind an LLM', 'Avoids fine-tuning costs + data lock-in', 'Citations make outputs auditable', 'Most "AI chat with your X" products are RAG underneath'],
    beginnerTrap: 'Believing "more chunks = better answers". Past top-5, recall plateaus and noise rises.',
    expertTake: 'Hybrid (BM25 + dense) + reranker beats pure dense almost everywhere. Measure recall@k AND precision@k separately. Eval is harder than the pipeline.',
    codeSeed: { lang: 'python', example: `from langchain_chroma import Chroma\nfrom langchain_openai import OpenAIEmbeddings\n\nvectordb = Chroma.from_documents(\n    docs,\n    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),\n    persist_directory="./chroma",\n)\nresults = vectordb.similarity_search("How does RAG work?", k=5)\nfor r in results:\n    print(r.page_content[:200])` },
  },
  'AI Agents': {
    examples: ['Claude Code / Cursor', 'browser-using agents', 'research agents', 'support deflection bots', 'sales follow-up agents', 'data analyst agents'],
    pitfall: 'Letting the agent loop forever without a step limit — bills get scary fast.',
    pitfalls: ['No step limit (infinite loops)', 'Too many tools — the model picks wrong one', 'Hallucinated tool names', 'No structured logging → unable to debug', 'No eval set → "feels working" is the only metric'],
    stack: ['Anthropic tools / OpenAI tool calling', 'LangGraph', 'Claude Code SDK', 'Mastra / CrewAI', 'OpenTelemetry', 'Langfuse / Helicone'],
    whyMatters: ['Agents are how AI moves from "answers" to "actions"', 'Long-running agents replace dashboards for many ops tasks', 'Tool-using agents are the dominant pattern in 2026', 'You can demo a useful one in a weekend'],
    beginnerTrap: 'Building a 12-tool agent in v1. Start with 2. Add tools only when the model demonstrably needs them.',
    expertTake: 'Tool design > prompt engineering. A tool with a precise schema and short error messages is worth 1000 lines of "you are a helpful agent..." preamble.',
    codeSeed: { lang: 'python', example: `from anthropic import Anthropic\nclient = Anthropic()\n\ntools = [{\n    "name": "search_docs",\n    "description": "Search the knowledge base.",\n    "input_schema": {"type": "object", "properties": {"q": {"type": "string"}}, "required": ["q"]},\n}]\nmsg = client.messages.create(\n    model="claude-3-5-sonnet-latest",\n    max_tokens=1024, tools=tools,\n    messages=[{"role": "user", "content": "Find info on LoRA"}],\n)\nprint(msg.content)` },
  },
  'Computer Vision': {
    examples: ['object detection (YOLO)', 'OCR (PaddleOCR, Tesseract)', 'face recognition', 'medical imaging', 'self-driving perception', 'AR filters'],
    pitfall: 'Forgetting to normalise pixel values — your model sees images very differently than you expect.',
    pitfalls: ['Pixel range mismatch (0-255 vs 0-1)', 'Resizing without preserving aspect ratio', 'Training on JPEGs, deploying on PNGs (compression artefacts)', 'Class imbalance in detection datasets'],
    stack: ['OpenCV', 'YOLO (Ultralytics)', 'PyTorch Vision', 'Roboflow', 'Albumentations', 'ONNX Runtime'],
    whyMatters: ['Vision unlocks new product categories (AR, robotics, security)', 'Compute is cheap, mature models exist for most tasks', 'On-device inference now feasible for phones + edge', 'Multimodal LLMs (GPT-4V, Claude Sonnet) make basic CV trivial'],
    beginnerTrap: 'Training a CNN from scratch when a fine-tuned YOLO would solve it in an afternoon.',
    expertTake: 'Almost every CV problem in 2026 starts with "fine-tune a pretrained model on a few hundred labelled examples". Greenfield training is rare.',
    codeSeed: { lang: 'python', example: `from ultralytics import YOLO\n\nmodel = YOLO("yolo11n.pt")           # pretrained\nresults = model("street.jpg", conf=0.3)\nfor r in results:\n    print(r.boxes.cls, r.boxes.conf, r.boxes.xyxy)` },
  },
  'Python': {
    examples: ['data scripts', 'web scrapers', 'ML pipelines', 'CLI tools', 'REST APIs', 'glue between systems', 'Jupyter notebooks'],
    pitfall: 'Mutable default arguments — they\'re shared across calls and bite you eventually.',
    pitfalls: ['def f(x=[]) — shared list across calls', 'Using `is` instead of `==` for equality', 'Forgetting `await` on async calls', 'No virtual environment → version conflicts', 'Importing heavy libs at module level'],
    stack: ['uv (package manager)', 'ruff (linter)', 'black (formatter)', 'pytest', 'mypy', 'rich (terminal output)'],
    whyMatters: ['#1 language for AI/ML/data', 'Huge ecosystem — every API has a Python client', 'Readable enough to onboard non-engineers', 'Free, cross-platform, batteries included'],
    beginnerTrap: 'Writing C-style for loops when comprehensions are 3x shorter and faster.',
    expertTake: 'Modern Python is async + type-hinted + uv-managed. If your project doesn\'t use those three, you\'re paying a tax for no reason.',
    codeSeed: { lang: 'python', example: `from dataclasses import dataclass\nfrom typing import Iterator\n\n@dataclass\nclass User:\n    name: str\n    score: int\n\ndef top_users(users: list[User], n: int) -> Iterator[User]:\n    return iter(sorted(users, key=lambda u: -u.score)[:n])\n\nfor u in top_users([User("a", 5), User("b", 9), User("c", 7)], 2):\n    print(u.name, u.score)` },
  },
  'JavaScript / TypeScript': {
    examples: ['web apps', 'REST/GraphQL APIs', 'CLIs', 'desktop apps (Electron)', 'browser extensions', 'serverless functions'],
    pitfall: 'Forgetting `await` on async calls — your Promise sits there unwaited.',
    pitfalls: ['Missing `await` (Promise<T> instead of T)', '== vs === (always use ===)', 'this binding in callbacks', 'Mutating React state directly', 'Forgetting `as const` for literal types'],
    stack: ['Node 22 + TypeScript', 'Vite / Next.js', 'Vitest', 'Biome (linter + formatter)', 'Drizzle / Prisma ORM', 'Zod (validation)'],
    whyMatters: ['Only language that runs everywhere (browser, server, edge, mobile)', 'TypeScript catches the bugs JS lets through', 'Largest package ecosystem on earth', 'AI tooling (Vercel AI SDK, LangChain JS) is first-class now'],
    beginnerTrap: 'Reaching for a framework when vanilla TS would do.',
    expertTake: 'TypeScript types are documentation that compiles. Spend time on your types — they save you in code review.',
    codeSeed: { lang: 'typescript', example: `type User = { id: string; name: string; score: number };\n\nasync function topUsers(n: number): Promise<User[]> {\n  const res = await fetch("/api/users");\n  const users: User[] = await res.json();\n  return users.sort((a, b) => b.score - a.score).slice(0, n);\n}\n\nconst top = await topUsers(5);\nconsole.log(top);` },
  },
  'SQL Databases': {
    examples: ['transactional apps', 'analytics + reporting', 'audit logs', 'multi-tenant SaaS', 'feature stores'],
    pitfall: 'Missing indexes on join + filter columns — your queries scale O(N²).',
    pitfalls: ['No index on JOIN / WHERE columns', 'SELECT * in hot paths', 'N+1 queries from your ORM', 'No connection pool → DB connection storm', 'Long-running transactions blocking writes'],
    stack: ['PostgreSQL', 'SQLAlchemy / Drizzle', 'pgcli or psql', 'pgAdmin', 'Datadog / pgAnalyze (monitoring)'],
    whyMatters: ['Every backend still has SQL underneath', 'PostgreSQL has eaten most other relational DBs', 'Knowing EXPLAIN ANALYZE separates juniors from seniors', 'Vector search is now in Postgres (pgvector)'],
    beginnerTrap: 'Adding indexes blindly — they speed up reads but slow writes.',
    expertTake: 'Read your slowest 10 queries every Monday. 80% of perf wins are in those queries, not in clever schema changes.',
    codeSeed: { lang: 'sql', example: `-- Find the top 10 customers by 30-day revenue\nSELECT c.id, c.name, SUM(o.amount_cents) / 100.0 AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\n  AND o.status = 'paid'\nGROUP BY c.id, c.name\nORDER BY revenue DESC\nLIMIT 10;` },
  },
  'NoSQL Databases': {
    examples: ['session storage (Redis)', 'feature stores', 'event sourcing', 'real-time leaderboards', 'caching layers'],
    pitfall: 'Treating MongoDB like SQL — joining at the app layer kills throughput.',
    pitfalls: ['App-side joins instead of denormalising', 'Unbounded queries (no pagination)', 'No TTLs on cache keys', 'Hot keys on a single shard', 'Mixing your cache and primary store accidentally'],
    stack: ['MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'KeyDB / Valkey', 'MeiliSearch / Typesense'],
    whyMatters: ['NoSQL solves problems SQL is bad at (caching, sessions, fast key-value)', 'Redis is in every modern backend stack', 'Vector / search hybrids are becoming NoSQL territory', 'Horizontal scaling is easier'],
    beginnerTrap: 'Picking MongoDB because "no schema" — schemas always exist; the question is who enforces them.',
    expertTake: 'Pick your DB based on access patterns, not on hype. Redis for fast K/V, Postgres for relations, vector DB for similarity, Snowflake for analytics.',
    codeSeed: { lang: 'python', example: `import redis\n\nr = redis.Redis(decode_responses=True)\n\n# leaderboard\nr.zadd("leaderboard", {"alice": 9001, "bob": 7500, "carol": 12000})\ntop3 = r.zrevrange("leaderboard", 0, 2, withscores=True)\nprint(top3)\n\n# session cache with TTL\nr.setex("session:abc123", 3600, '{"user_id": 42}')` },
  },
  'Vector Databases': {
    examples: ['semantic search', 'RAG retrieval', 'recommendation systems', 'image similarity', 'duplicate detection', 'fraud-pattern matching'],
    pitfall: 'Mixing embedding models within one index — your similarity scores become meaningless.',
    pitfalls: ['Mixing embedding models in one index', 'No metadata filters → expensive post-filtering', 'Forgetting to normalise vectors', 'k too high → noise eats signal', 'No reranking step → low precision'],
    stack: ['Chroma (local)', 'Qdrant', 'pgvector (Postgres)', 'Pinecone (managed)', 'Weaviate', 'FAISS (library)'],
    whyMatters: ['Foundation of every RAG + recommendation system', 'pgvector means you don\'t need a separate DB', 'Hybrid search (BM25 + dense) is the new default', 'ANN indexes make similarity scale to billions'],
    beginnerTrap: 'Believing you need a fancy managed vector DB. Chroma or pgvector is plenty for most apps.',
    expertTake: 'The vector DB is the easy part. The hard part is choosing the right embedding model, chunking strategy, and reranker.',
    codeSeed: { lang: 'python', example: `import chromadb\nfrom chromadb.utils import embedding_functions\n\nclient = chromadb.PersistentClient(path="./chroma_db")\ncoll = client.get_or_create_collection(\n    name="docs",\n    embedding_function=embedding_functions.OpenAIEmbeddingFunction(model_name="text-embedding-3-small"),\n)\ncoll.add(ids=["1","2","3"], documents=["RAG is...", "Vector DBs...", "Embeddings..."])\nprint(coll.query(query_texts=["What is RAG?"], n_results=2))` },
  },
  'AI Tools': {
    examples: ['chat apps', 'AI features in SaaS', 'document summarisers', 'voice assistants', 'data extractors', 'support deflection'],
    pitfall: 'Tightly coupling your code to one provider — when they change pricing or deprecate a model, you\'re stuck.',
    pitfalls: ['Hardcoding model names everywhere', 'No retries on transient API errors', 'No timeouts → hung requests', 'No fallback when API is down', 'Logging full prompts (with PII) to stdout'],
    stack: ['Anthropic SDK / OpenAI SDK / Vertex AI', 'LangChain / LlamaIndex', 'Hugging Face', 'OpenRouter (multi-provider)', 'Vercel AI SDK', 'Mastra'],
    whyMatters: ['Every product team is being asked to "add AI"', 'Knowing the tool tradeoffs saves weeks of vendor lock-in pain', 'Frontier models change every 3 months — design for swap-ability', 'OSS models are catching up faster than expected'],
    beginnerTrap: 'Building on one provider, hardcoding everything, then discovering they cut your context window.',
    expertTake: 'Abstract the model behind your own interface. Always have a fallback model. Always have an eval set.',
    codeSeed: { lang: 'python', example: `# Simple multi-provider wrapper\nfrom typing import Protocol\n\nclass LLM(Protocol):\n    def complete(self, prompt: str) -> str: ...\n\nclass Claude(LLM):\n    def __init__(self): ...\n    def complete(self, prompt): ...  # call Anthropic\n\nclass GPT(LLM):\n    def __init__(self): ...\n    def complete(self, prompt): ...  # call OpenAI\n\ndef get_llm() -> LLM:\n    # swap by env var; fallback if one is down\n    return Claude()` },
  },
  'Prompt Engineering': {
    examples: ['extraction prompts', 'classification', 'code review prompts', 'agent system prompts', 'evals + judges', 'creative writing'],
    pitfall: 'Vague instructions with no examples — the model fills in your gaps with guesses.',
    pitfalls: ['No system prompt → unpredictable persona', 'Too many constraints — model ignores half', 'Negative-only instructions ("don\'t do X")', 'No examples (zero-shot when 2-shot would crush it)', 'No format spec → unparseable output'],
    stack: ['Anthropic Console', 'OpenAI Playground', 'Promptfoo', 'LangSmith', 'Helicone / Langfuse', 'Inspect AI'],
    whyMatters: ['Same model + better prompt = 2x quality, free', 'Eval-driven prompting beats "feel good" tweaks', 'Most "AI apps" are 80% prompt design, 20% code', 'New job category — prompt engineers earn well'],
    beginnerTrap: 'Iterating on prompts without an eval set. You don\'t know if you\'re improving or just memorizing one example.',
    expertTake: 'Build the eval first. Then write the prompt. Then iterate the prompt against the eval. Without an eval, you\'re flying blind.',
    codeSeed: { lang: 'python', example: `SYSTEM = """You extract structured data from emails.\nOutput STRICTLY this JSON schema:\n{ \"sender\": str, \"subject\": str, \"intent\": \"refund\"|\"question\"|\"complaint\" }\nDo NOT include any explanation."""\n\nUSER = """From: jane@x.com\nSubject: Refund for order #999\nHi, I never received my order..."""\n\n# call your LLM with SYSTEM + USER; parse JSON.` },
  },
  'MLOps': {
    examples: ['model CI/CD', 'canary deployments', 'A/B testing models', 'drift monitoring', 'feature stores', 'experiment tracking'],
    pitfall: 'No model versioning — when prod regresses, you can\'t identify which checkpoint broke things.',
    pitfalls: ['No experiment tracking → reproducibility nightmare', 'No model registry → unknown what\'s in prod', 'No data versioning → "it worked yesterday"', 'No canary or shadow deploy', 'No drift / staleness alerts'],
    stack: ['MLflow', 'Weights & Biases', 'DVC', 'Docker + Kubernetes', 'BentoML / KServe', 'Prometheus + Grafana'],
    whyMatters: ['Most AI projects fail in production, not training', 'Compliance + audit needs versioning', 'A drifted model can hurt revenue silently', 'Hiring market values "can ship to prod" highly'],
    beginnerTrap: 'Optimising training infra before deployment infra. You\'ll need both, but inference patters break first.',
    expertTake: 'Treat your model like a database migration: versioned, reviewed, rollback-able. Without that, every deploy is a coin flip.',
    codeSeed: { lang: 'python', example: `import mlflow\n\nmlflow.set_experiment("rec-model")\nwith mlflow.start_run():\n    mlflow.log_param("lr", 3e-4)\n    mlflow.log_param("batch_size", 256)\n    # ... train ...\n    mlflow.log_metric("val_auc", 0.87)\n    mlflow.pytorch.log_model(model, "model")` },
  },
  'Data Engineering': {
    examples: ['ETL pipelines', 'feature stores', 'data warehouses', 'real-time streaming', 'CDC (change data capture)', 'dbt transforms'],
    pitfall: 'No idempotency in pipelines — re-running a job double-counts data and corrupts dashboards.',
    pitfalls: ['No idempotency (re-runs corrupt data)', 'No data validation between stages', 'Schema changes break downstream silently', 'No partition strategy → expensive scans', 'No SLA / alerting on pipeline lag'],
    stack: ['Airflow / Dagster / Prefect', 'dbt', 'Snowflake / BigQuery / Databricks', 'Kafka / Redpanda', 'Iceberg / Delta Lake', 'Great Expectations'],
    whyMatters: ['Modern AI is mostly a data problem disguised as an ML problem', 'Bad data → bad models → wrong decisions', 'Data engineers are the highest-paid IC role in many orgs', 'Every "we should do ML" project hits this wall first'],
    beginnerTrap: 'Writing custom Python scripts when dbt + Airflow would solve it cleaner.',
    expertTake: 'Idempotency, lineage, and tests are the three pillars. Everything else is implementation detail.',
    codeSeed: { lang: 'python', example: `# Idempotent upsert pattern\nINSERT INTO users (id, name, updated_at)\nVALUES (:id, :name, NOW())\nON CONFLICT (id) DO UPDATE\n  SET name = EXCLUDED.name,\n      updated_at = NOW()\nWHERE EXCLUDED.updated_at > users.updated_at;` },
  },
  'Math for ML': {
    examples: ['gradient descent', 'PCA (dimensionality reduction)', 'cosine similarity', 'K-means clustering', 'logistic regression', 'normal equations'],
    pitfall: 'Skipping the geometric intuition for the formula — math feels harder than it is.',
    pitfalls: ['Treating math as memorisation', 'Skipping linear algebra and hoping ML "works"', 'Confusing covariance with correlation', 'Not noticing log scales in plots'],
    stack: ['NumPy', '3Blue1Brown YouTube', 'Khan Academy', 'Strang Linear Algebra (MIT)', 'pen + paper', 'Manim (animations)'],
    whyMatters: ['Every model is just clever math', 'Interview pre-screens often test math basics', 'You\'ll debug faster when you understand the why', 'Reading papers becomes possible'],
    beginnerTrap: 'Avoiding linear algebra. You can\'t escape it — matmul is everywhere.',
    expertTake: 'Build intuition first (3B1B), then derive (textbook), then implement (NumPy). Skipping the first step is why math feels hard.',
    codeSeed: { lang: 'python', example: `import numpy as np\n\n# PCA in 5 lines\nX = X - X.mean(axis=0)\nU, S, Vt = np.linalg.svd(X, full_matrices=False)\nprincipal = Vt[:2]                # top 2 components\nprojected = X @ principal.T       # n × 2` },
  },
  'Production AI': {
    examples: ['LLM serving', 'cost controls', 'A/B testing models', 'rate limiting', 'fallback chains', 'streaming responses'],
    pitfall: 'No fallback when the model API is down — your product breaks the same day the provider has an outage.',
    pitfalls: ['No fallback model when primary fails', 'No streaming → bad UX', 'No retry / circuit breaker', 'No cost cap per request', 'No PII redaction before sending to a 3rd party'],
    stack: ['FastAPI / Hono / Express', 'Modal / Replicate / Together AI', 'Cloudflare AI / Vercel AI', 'Fly.io', 'Sentry / Datadog', 'Helicone / Langfuse'],
    whyMatters: ['Going from "works on my laptop" to "100k QPS" is a different sport', 'Production cost can dwarf training cost', 'Reliability bugs erode user trust fast', 'Compliance reviewers want logs + redaction'],
    beginnerTrap: 'Skipping streaming. Users wait 8 seconds and bounce.',
    expertTake: 'Build for graceful degradation — slow > broken, partial > nothing, fallback > 500.',
    codeSeed: { lang: 'python', example: `from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\n\napp = FastAPI()\n\n@app.get("/stream")\nasync def stream():\n    async def gen():\n        async for chunk in llm.stream("Tell a story"):\n            yield chunk.text\n    return StreamingResponse(gen(), media_type="text/plain")` },
  },
};

// Extra depth material — a one-line mental model + 3 key terms per category.
// Kept separate from CATEGORY_FLAVOUR so it can be added without touching the
// existing entries. Powers the "Mental model" + "Key terms" slides on every post.
interface CategoryDepth { mentalModel: string; keyTerms: string[]; deeper: string }
const CATEGORY_DEPTH: Record<Category, CategoryDepth> = {
  'AI Fundamentals': {
    mentalModel: 'Think of AI as a very fast pattern-matcher, not a thinker. It has read more than any human, yet understands nothing — it predicts what usually comes next. Useful when patterns hold, dangerous when they do not.',
    keyTerms: ['Model — a learned function from inputs to outputs', 'Inference — running a trained model on new data', 'Training — fitting the model to examples', 'Generalisation — performing on data it never saw'],
    deeper: 'The leap from "narrow" to "general" is not just scale — it is the difference between a tool tuned for one task and a system that transfers across tasks. Almost everything shipping today is narrow, even when the marketing says otherwise.',
  },
  'Machine Learning': {
    mentalModel: 'ML is curve-fitting with discipline. You show the machine labelled examples, it finds the line/boundary that separates them, and you pray that line also holds on data it has not seen. The whole craft is making that prayer come true.',
    keyTerms: ['Feature — an input signal the model reads', 'Label — the answer you want predicted', 'Loss — how wrong the model is right now', 'Overfitting — memorising train data, failing on new'],
    deeper: 'The biggest lever is almost never the algorithm — it is the features and the data quality. A boring model on great features beats a fancy model on raw noise nearly every time.',
  },
  'Deep Learning': {
    mentalModel: 'A neural net is a stack of tunable knobs (weights). Data flows forward to a prediction; the error flows backward and nudges every knob a little. Repeat millions of times and the knobs settle into something that works.',
    keyTerms: ['Neuron — a weighted sum + nonlinearity', 'Backprop — how gradients flow backward', 'Epoch — one full pass over the data', 'Learning rate — how big each update step is'],
    deeper: 'Depth lets the network build features on top of features — edges → shapes → objects. That hierarchy is why deep nets crush hand-engineered features on images, audio, and text.',
  },
  'NLP & LLMs': {
    mentalModel: 'An LLM is autocomplete trained on the internet. Give it text, it predicts the next token, again and again. Everything clever it does — reasoning, coding, translation — is an emergent side-effect of getting really, really good at that one game.',
    keyTerms: ['Token — a chunk of text (~¾ of a word)', 'Context window — how much it can read at once', 'Temperature — randomness of the output', 'Embedding — text turned into a vector of meaning'],
    deeper: 'Most LLM products fail on evaluation, not on prompting. The teams that win build a test set of real inputs first, then tune prompt + model against it — instead of eyeballing one nice demo.',
  },
  'RAG': {
    mentalModel: 'RAG is an open-book exam for an LLM. Instead of trusting the model to remember, you retrieve the relevant pages first and paste them into the prompt. The model then answers from the page in front of it, with a citation.',
    keyTerms: ['Chunk — a passage you index and retrieve', 'Embedding — vector that captures meaning', 'Retriever — finds the top-k relevant chunks', 'Reranker — reorders chunks by true relevance'],
    deeper: 'Hybrid retrieval (keyword BM25 + dense vectors) plus a reranker beats pure vector search almost everywhere. And you must measure retrieval quality separately from answer quality — they fail for different reasons.',
  },
  'AI Agents': {
    mentalModel: 'An agent is an LLM in a loop with tools. It thinks, calls a tool, reads the result, thinks again — until the task is done or a budget runs out. The model is the brain; the tools are the hands.',
    keyTerms: ['Tool — a function the model can call', 'Tool schema — the typed contract for a tool', 'Loop / step limit — guard against runaway cost', 'Trace — the logged sequence of thoughts + calls'],
    deeper: 'Tool design beats prompt engineering. A tool with a tight schema and short, honest error messages teaches the model more than paragraphs of "you are a helpful agent" preamble ever will.',
  },
  'Computer Vision': {
    mentalModel: 'To a model, an image is just a grid of numbers. Convolutions slide little filters over that grid to detect edges, then textures, then parts, then objects — building understanding from the pixels up.',
    keyTerms: ['Pixel normalisation — scaling values to a fixed range', 'Convolution — a sliding filter over the image', 'Bounding box — a detected object\'s rectangle', 'IoU — overlap score between boxes'],
    deeper: 'In 2026 almost every CV task starts by fine-tuning a pretrained model on a few hundred labelled images. Training from scratch is rare — transfer learning does the heavy lifting.',
  },
  'Python': {
    mentalModel: 'Python optimises for the reader, not the CPU. It is slow on paper but fast to write, and its ecosystem means the heavy lifting (NumPy, Pandas, Torch) is C under the hood. You write the glue; libraries do the work.',
    keyTerms: ['List vs tuple — mutable vs fixed sequence', 'Comprehension — build a list in one expression', 'Decorator — a function that wraps a function', 'Generator — lazy iterator that yields values'],
    deeper: 'Modern Python is type-hinted, async where it helps, and uv-managed. If your project skips all three you are paying a tax — slower onboarding, more runtime bugs, and dependency drift.',
  },
  'JavaScript / TypeScript': {
    mentalModel: 'JavaScript runs everywhere; TypeScript is JavaScript with a spell-checker for types. The types vanish at runtime but catch a whole class of bugs at compile time — they are documentation that actually stays true.',
    keyTerms: ['Promise — a value that arrives later', 'async/await — sync-looking async code', 'Type vs interface — two ways to shape data', 'Union type — "this OR that" in the type system'],
    deeper: 'Spend real time on your types. A precise type at a boundary (API response, function arg) prevents bugs you would otherwise find in production at 2 AM.',
  },
  'SQL Databases': {
    mentalModel: 'A relational DB is a spreadsheet that takes correctness seriously — typed columns, enforced relationships, and transactions that are all-or-nothing. Indexes are the table of contents that turn a full scan into an instant lookup.',
    keyTerms: ['Index — a lookup structure for fast reads', 'JOIN — combine rows across tables', 'Transaction — all-or-nothing unit of work', 'EXPLAIN — the query planner\'s playbook'],
    deeper: 'Read EXPLAIN ANALYZE on your slowest queries before touching the schema. Most performance wins live in a missing index or an N+1 pattern, not in clever redesigns.',
  },
  'NoSQL Databases': {
    mentalModel: 'NoSQL trades SQL\'s strict structure for speed and scale on specific access patterns. You shape the data the way you read it — denormalised, duplicated, fast. The schema still exists; you just enforce it in the app.',
    keyTerms: ['Key-value — the simplest, fastest store', 'Document — JSON-shaped records', 'TTL — auto-expiry on a key', 'Sharding — splitting data across machines'],
    deeper: 'Pick the store by access pattern, not by hype: Redis for hot key-value, Postgres for relations, a vector DB for similarity, a warehouse for analytics. Most apps need two, not one.',
  },
  'Vector Databases': {
    mentalModel: 'A vector DB stores meaning as coordinates. Similar things land near each other in high-dimensional space, so "find related" becomes "find nearest" — a geometry problem an ANN index can answer in milliseconds.',
    keyTerms: ['Embedding — meaning as a vector', 'Cosine similarity — angle-based closeness', 'ANN — approximate nearest-neighbour search', 'Metadata filter — narrow before you search'],
    deeper: 'The DB is the easy part. The hard parts are choosing the embedding model, the chunking strategy, and a reranker — those decide whether retrieval is actually relevant.',
  },
  'AI Tools': {
    mentalModel: 'Treat model providers like cloud regions: powerful, but interchangeable and occasionally down. Put your own thin interface in front, so swapping GPT for Claude for a local model is a config change, not a rewrite.',
    keyTerms: ['SDK — the provider\'s client library', 'Rate limit — requests allowed per window', 'Fallback — backup model when the primary fails', 'Token cost — what each call actually bills'],
    deeper: 'Abstract the model behind your own interface, always wire a fallback, and keep an eval set. Frontier models change every few months — design for swap-ability from day one.',
  },
  'Prompt Engineering': {
    mentalModel: 'A prompt is a spec, not a wish. The model fills every gap you leave with a guess, so the craft is removing ambiguity: a role, a format, a couple of examples, and a hard "do not" list.',
    keyTerms: ['System prompt — sets the persona + rules', 'Few-shot — examples baked into the prompt', 'Output schema — the exact shape you require', 'Eval — scoring prompts against real inputs'],
    deeper: 'Build the eval set first, then write the prompt, then iterate the prompt against the eval. Without a scoreboard you are not improving — you are just memorising one happy-path example.',
  },
  'MLOps': {
    mentalModel: 'MLOps is DevOps for models, where the data is part of the code. A deploy is reproducible only if you version the model, the data, and the config together — otherwise "it worked yesterday" becomes a haunting.',
    keyTerms: ['Registry — versioned store of models', 'Drift — input distribution shifting over time', 'Canary — release to a small slice first', 'Lineage — what data + code made this model'],
    deeper: 'Treat a model like a database migration: versioned, reviewed, and rollback-able. Most AI projects die in production, not in training — invest in the deploy path early.',
  },
  'Data Engineering': {
    mentalModel: 'A data pipeline is plumbing: raw data flows in, gets cleaned and reshaped at each stage, and lands somewhere queryable. The whole game is keeping the water clean and the pipes from bursting on a re-run.',
    keyTerms: ['Idempotency — re-runs do not double-count', 'ETL/ELT — extract, transform, load order', 'Partition — split data for cheap scans', 'Lineage — tracking data from source to table'],
    deeper: 'Idempotency, lineage, and tests are the three pillars. Get those right and the orchestration tool barely matters — get them wrong and no tool will save your dashboards.',
  },
  'Math for ML': {
    mentalModel: 'The math behind ML is mostly geometry in disguise. Vectors are arrows, dot products measure alignment, gradients point uphill. Build the picture first and the formulas stop looking scary.',
    keyTerms: ['Vector — a point/arrow in space', 'Dot product — how aligned two vectors are', 'Gradient — direction of steepest increase', 'Matrix — a transformation of space'],
    deeper: 'Intuition → derivation → implementation, in that order. Watch 3Blue1Brown for the picture, derive it once on paper, then code it in NumPy. Skipping the picture is why math feels hard.',
  },
  'Production AI': {
    mentalModel: 'Shipping AI is plumbing plus seatbelts. The model is one call in a system that must stream, retry, cap cost, redact PII, and degrade gracefully. Slow beats broken; partial beats nothing; fallback beats a 500.',
    keyTerms: ['Streaming — tokens as they generate', 'Circuit breaker — stop calling a dead service', 'Cost cap — max spend per request', 'PII redaction — scrub data before it leaves'],
    deeper: 'Design for graceful degradation. A cached or smaller-model answer that arrives beats a perfect answer that times out — users feel latency and outages far more than a slight quality dip.',
  },
};

function stripTheme(theme: string): string {
  return theme.replace(/^(What is|The|A Brief|A )\s+/i, '').replace(/[?!.]+$/, '');
}
function joinExamples(arr: string[]): string {
  return arr.slice(0, 5).join(' · ');
}
function short(s: string, n = 24): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

// ─── Auto-generated diagrams ───────────────────────────────────────
// Build a sensible DiagramSpec from the category flavour + topic so EVERY
// template post ships with at least one real visual, not just walls of text.

function mindmapFor(f: CategoryFlavour, t: string): DiagramSpec {
  return { kind: 'mindmap', center: t, branches: [
    { label: 'Used for',    sub: f.examples.slice(0, 2).map(s => short(s, 20)) },
    { label: 'Tooling',     sub: f.stack.slice(0, 2).map(s => short(s, 20)) },
    { label: 'Why it wins', sub: f.whyMatters.slice(0, 2).map(s => short(s, 22)) },
    { label: 'Watch out',   sub: f.pitfalls.slice(0, 2).map(s => short(s, 22)) },
  ] };
}

function pipelineFor(t: string): DiagramSpec {
  return { kind: 'pipeline', stages: [
    { label: 'Prepare',   detail: 'clean + shape the inputs' },
    { label: 'Transform', detail: `the core ${short(t, 14)} step` },
    { label: 'Interpret', detail: 'check + calibrate output' },
    { label: 'Iterate',   detail: 'measure, then improve' },
  ] };
}

function skipVsMasterFor(f: CategoryFlavour): DiagramSpec {
  return { kind: 'compare',
    left:  { title: 'Skip it', items: f.pitfalls.slice(0, 4).map(s => short(s, 30)) },
    right: { title: 'Master it', items: f.whyMatters.slice(0, 4).map(s => short(s, 30)) },
  };
}

function flowFor(t: string): DiagramSpec {
  return { kind: 'flow', nodes: [
    { label: 'Input',    sub: 'raw data' },
    { label: short(t, 12), sub: 'the engine' },
    { label: 'Output',   sub: 'result' },
    { label: 'Feedback', sub: 'improve' },
  ] };
}

function debugDecisionFor(): DiagramSpec {
  return { kind: 'decision', root: {
    question: 'Output looks wrong?',
    yes: { question: 'Checked the data?', yes: { leaf: 'Fix data first' }, no: { leaf: 'Inspect inputs' } },
    no:  { question: 'Have a baseline?',        yes: { leaf: 'Ship + monitor' },         no: { leaf: 'Build a baseline' } },
  } };
}

const CATEGORY_EMOJI: Record<Category, string> = {
  'AI Fundamentals': '🤖', 'Machine Learning': '📊', 'Deep Learning': '🧠',
  'NLP & LLMs': '💬', 'RAG': '🔎', 'AI Agents': '🛠️', 'Computer Vision': '👁️',
  'Python': '🐍', 'JavaScript / TypeScript': '🟨', 'SQL Databases': '🗄️',
  'NoSQL Databases': '⚡', 'Vector Databases': '🧭', 'AI Tools': '🧰',
  'Prompt Engineering': '✍️', 'MLOps': '🚀', 'Data Engineering': '🔧',
  'Math for ML': '📐', 'Production AI': '🏭',
};

// 8-9 slide skeletons per angle, each with richer body text + multi-bullet structure +
// a topical code block. Used when a post doesn't have hand-authored content.
function templateForAngle(theme: string, angle: PostAngle, category: Category): SlideContent[] {
  const f = CATEGORY_FLAVOUR[category];
  const d = CATEGORY_DEPTH[category];
  const t = stripTheme(theme);
  const e = CATEGORY_EMOJI[category];

  // Reusable depth slides shared across angles.
  const mentalModelSlide: SlideContent = { kind: 'definition', title: 'Mental model', body: d.mentalModel, emoji: '🧠' };
  const keyTermsSlide: SlideContent = { kind: 'tips', title: 'Key terms to know', bullets: d.keyTerms, emoji: '📖' };
  const goDeeperSlide: SlideContent = { kind: 'visual', title: 'Going deeper', body: d.deeper, emoji: '🔬' };

  switch (angle) {
    case 'Concept':
      return [
        { kind: 'cover', title: theme, sticker: 'DAY-X', emoji: e },
        { kind: 'definition', title: `What is ${t}?`, body: `${t} is one of the foundational ideas you keep running into when you build serious systems in ${category.toLowerCase()}. The first time you meet it, it feels abstract — a definition from a textbook. The second time, it explains a bug you spent two days chasing in production. By the third encounter, you start reaching for it on instinct. That's the moment fundamentals stop being theory and start saving you hours every week. This carousel covers the one-line definition, why it matters in real engineering, how it actually works under the hood, a minimal working example, and the trap every beginner falls into.`, emoji: '💡' },
        { kind: 'diagram', title: `The ${t} map`, diagram: mindmapFor(f, short(t, 14)), emoji: '🗺️' },
        mentalModelSlide,
        { kind: 'why', title: 'Why it matters', bullets: f.whyMatters, emoji: '🎯' },
        { kind: 'how', title: 'The core idea', bullets: [
          `Inputs flow into ${t}; outputs come out shaped by data + training, not hand-written rules.`,
          'The function inside is learned from examples — you give it pairs of (input, correct output) and it figures out the mapping.',
          'More data + better signal usually beats a smarter algorithm — Andrew Ng calls this "data-centric AI".',
          'Iteration matters more than the first model you ship — the v1 will be wrong in interesting ways.',
          'Most engineering effort is in the data pipeline + eval setup, not in the model itself.',
        ], emoji: '🧩' },
        keyTermsSlide,
        { kind: 'visual', title: 'Where it shows up', body: `In production you'll see ${t} powering — ${joinExamples(f.examples)}. The same primitive shows up across very different products because it solves a general class of problem. Once you spot the pattern in one domain, you start spotting it everywhere — and that's the moment senior engineers start trusting your architecture decisions. If your team has any of these features on the roadmap, ${t} is going to come up in design review.`, emoji: '🌍' },
        { kind: 'code', title: 'A starting point', code: f.codeSeed.example, codeLang: f.codeSeed.lang, emoji: '💻' },
        { kind: 'tips', title: 'Tools in this stack', bullets: f.stack.slice(0, 5), emoji: '🧰' },
        { kind: 'mistake', title: 'Beginner trap', body: f.beginnerTrap + ' If you remember one thing from this slide, make it that. The more confident the AI sounds, the more careful you need to be — confidence is not a substitute for correctness. The single biggest jump between a junior and a senior engineer in this space is the habit of asking "but how would I verify this?" before shipping.', emoji: '⚠️' },
        { kind: 'cta', title: 'Save this. Follow for more.', body: 'Tomorrow: the same topic from a different angle. Tag a friend who\'s learning — and drop a comment with the topic you want covered next.', sticker: 'DAY-X', emoji: '🔖' },
      ];
    case 'Why It Matters':
      return [
        { kind: 'cover', title: `Why ${t} matters`, sticker: 'DAY-X', emoji: e },
        { kind: 'definition', title: 'The problem before', body: `Teams that skip ${t} end up patching symptoms forever. Every bug feels like a mystery. Every paper feels like noise. Worse — hiring managers can tell within five minutes whether someone has actually used this idea or just memorised a definition. The pattern repeats across companies, stacks, and years.`, emoji: '🧩' },
        { kind: 'visual', title: 'Real impact today', body: `Used right now in — ${joinExamples(f.examples)}. The same idea, deployed thousands of times a second across products you use without thinking. Quiet engine behind a surprising amount of what works.`, emoji: '🌍' },
        mentalModelSlide,
        { kind: 'why', title: 'Concrete reasons it matters', bullets: f.whyMatters, emoji: '🎯' },
        { kind: 'diagram', title: 'Skip it vs master it', diagram: skipVsMasterFor(f), emoji: '⚖️' },
        goDeeperSlide,
        { kind: 'how', title: 'Where it shows up in your day', bullets: [
          'In production code — search, ranking, fraud, personalisation, support.',
          'In research papers — every recent paper builds on these primitives.',
          'In cloud APIs — the abstractions hide it; understanding helps you debug.',
          'In hiring loops — basic literacy at any senior+ level now.',
          'In product strategy — knowing what\'s possible shapes what you can ship.',
        ], emoji: '🗓️' },
        { kind: 'mistake', title: 'If you skip it…', body: `The classic failure mode is — ${f.pitfall} You\'ll hit it at the worst possible time, in production, with users watching. Better to grok it now in a quiet hour than at 2 AM with a pager going off.`, emoji: '⚠️' },
        { kind: 'code', title: 'Even the simplest version', code: f.codeSeed.example, codeLang: f.codeSeed.lang, emoji: '💻' },
        { kind: 'tips', title: 'Takeaway', bullets: [
          'Master fundamentals — they have a long shelf life.',
          'Build intuition before you memorise the formula.',
          'Apply it on a small project this week to lock it in.',
          'Teach it to someone — that\'s how you find your gaps.',
          'Read one related paper or RFC each month.',
        ], emoji: '✅' },
        { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X', emoji: '🔖' },
      ];
    case 'How It Works':
      return [
        { kind: 'cover', title: `How ${t} works`, sticker: 'DAY-X', emoji: '⚙️' },
        { kind: 'visual', title: 'The big picture', body: `Zoom out first. There are a few moving parts that fit on a napkin — inputs go in, get transformed, outputs come out, and feedback shapes the next iteration. Once you can sketch this, the rest is detail you can fill in as you need it.`, emoji: '🔭' },
        { kind: 'diagram', title: 'The pipeline', diagram: pipelineFor(t), emoji: '🔁' },
        mentalModelSlide,
        { kind: 'steps', title: 'Step 1 — Prepare', body: `Get your inputs into the right shape. This is the boring step everyone skips, and it\'s where most production bugs live. Normalise, deduplicate, handle nulls, check dtypes, validate ranges. Eighty percent of "model is broken" is actually "data is broken".`, emoji: '🧹' },
        { kind: 'steps', title: 'Step 2 — Run the core', body: `Apply the operation. The math can look intimidating in papers, but the intent is simple — turn inputs into a useful internal representation. Whether it\'s a hash, a linear projection, or 96 transformer layers, the abstraction is the same: input → representation.`, emoji: '⚙️' },
        { kind: 'steps', title: 'Step 3 — Interpret', body: `Take the output and check it makes sense. Confidence is not correctness — calibration matters. Plot distributions, spot-check edge cases, compare against a baseline. If the answer always looks right, you probably haven\'t tested hard enough.`, emoji: '🔍' },
        keyTermsSlide,
        { kind: 'how', title: 'Putting it together', bullets: [
          'Inputs flow forward through the pipeline.',
          'Errors / gradients flow backward when you train.',
          'Each iteration nudges parameters in a better direction.',
          'You stop when validation loss plateaus — not training loss.',
          'Then you measure on a held-out test set you\'ve never peeked at.',
        ], emoji: '🧩' },
        { kind: 'code', title: 'Reference implementation', code: f.codeSeed.example, codeLang: f.codeSeed.lang, emoji: '💻' },
        { kind: 'tips', title: 'Edge cases + pitfalls', bullets: f.pitfalls.slice(0, 5), emoji: '🪤' },
        { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X', emoji: '🔖' },
      ];
    case 'Code Example':
      return [
        { kind: 'cover', title: `${t} — in code`, sticker: 'DAY-X', emoji: '💻' },
        { kind: 'definition', title: 'Setup', body: `Before any code runs, get the stack right. For ${t} you\'ll want: ${f.stack.slice(0, 3).join(', ')}. Pinned versions in your lockfile. Virtual environment. Don\'t mix global + project installs — that\'s a half-day of debugging waiting to happen.`, emoji: '📦' },
        keyTermsSlide,
        { kind: 'code', title: 'Imports + setup', code: codeImports(f), codeLang: f.codeSeed.lang, emoji: '📥' },
        { kind: 'code', title: 'The core operation', code: f.codeSeed.example, codeLang: f.codeSeed.lang, emoji: '⚙️' },
        { kind: 'visual', title: 'What just happened', body: `We took an input, applied the operation, and produced an output we can use. The fun part starts when you scale this up — real data, real volume, real error modes. The 10-line version teaches you the API; the 1000-line version teaches you the system.`, emoji: '✨' },
        { kind: 'diagram', title: 'Data flow', diagram: flowFor(t), emoji: '➡️' },
        mentalModelSlide,
        { kind: 'tips', title: 'Variations to try', bullets: [
          'Vectorise — replace your inner loop with a NumPy or DataFrame op.',
          'Wrap it in a class with a clean ` + "`__init__`" + ` + ` + "`fit`" + ` + ` + "`predict`" + ` API.',
          'Add input validation (types, ranges, required fields).',
          'Write a test that runs in <1 second.',
          'Add structured logging so you can debug in prod.',
        ], emoji: '🧪' },
        { kind: 'mistake', title: 'Watch out', body: `Don\'t silently catch errors — they\'re the bug telling you something. Don\'t hardcode magic numbers — extract them to a config. Don\'t skip tests because "it works on my machine". And the classic failure mode here is — ${f.pitfall}`, emoji: '⚠️' },
        { kind: 'code', title: 'Make it production-ready', code: codeProductionish(f), codeLang: f.codeSeed.lang, emoji: '🚀' },
        { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X', emoji: '🔖' },
      ];
    default:
    case 'Common Mistakes':
      return [
        { kind: 'cover', title: `${t} — common mistakes`, sticker: 'DAY-X', emoji: '🚫' },
        mentalModelSlide,
        { kind: 'mistake', title: 'Mistake #1', body: `${f.pitfalls[0] || f.pitfall} You\'ll spot this one in code reviews from juniors who learned the API but not the why. The fix is almost always upstream — change how data flows in, not how the model is configured.`, emoji: '❌' },
        { kind: 'mistake', title: 'Mistake #2', body: `${f.pitfalls[1] || 'Skipping the baseline.'} Without a baseline you can\'t tell if your fancy model is actually helping. A logistic regression on raw features should beat untrained intuition.` },
        { kind: 'mistake', title: 'Mistake #3', body: `${f.pitfalls[2] || 'Optimising the wrong metric.'} Accuracy on imbalanced data, BLEU on creative tasks, perplexity for chat quality — all classic mismatches. Pick the metric that reflects what users will feel.` },
        { kind: 'mistake', title: 'Mistake #4', body: `${f.pitfalls[3] || 'No experiment tracking.'} If you can\'t reproduce yesterday\'s result, your future self has lost the game. mlflow, W&B, or even a CSV is better than nothing.` },
        { kind: 'mistake', title: 'Mistake #5', body: `${f.pitfalls[4] || 'Shipping without monitoring.'} The model that worked at launch will drift. Alert on input distribution shift + key business metrics. Quietly broken is worse than loudly broken.` },
        { kind: 'diagram', title: 'Debug it like this', diagram: debugDecisionFor(), emoji: '🧭' },
        keyTermsSlide,
        { kind: 'tips', title: 'Recap — the cure', bullets: [
          'Read the assumptions of every model you use.',
          'Clean data first, train second.',
          'Pick a metric that maps to user outcomes.',
          'Build a baseline before anything fancy.',
          'Monitor in production from day one.',
        ], emoji: '🩹' },
        { kind: 'code', title: 'A safer pattern', code: f.codeSeed.example, codeLang: f.codeSeed.lang, emoji: '🛡️' },
        { kind: 'cta', title: 'Save this. Follow for more.', sticker: 'DAY-X', emoji: '🔖' },
      ];
  }
}

function codeImports(f: CategoryFlavour): string {
  if (f.codeSeed.lang === 'python') return `# pinned in pyproject.toml\n# uv add ${f.stack.slice(0, 2).join(' ')}\n\nimport numpy as np\nimport pandas as pd`;
  if (f.codeSeed.lang === 'typescript') return `// pnpm add ${f.stack.slice(0, 2).join(' ')}\n\nimport { z } from "zod";\nimport type { Result } from "./types";`;
  if (f.codeSeed.lang === 'sql') return `-- targets PostgreSQL 16+\nCREATE EXTENSION IF NOT EXISTS pg_stat_statements;`;
  return `# bash\nset -euo pipefail`;
}
function codeProductionish(f: CategoryFlavour): string {
  if (f.codeSeed.lang === 'python') return `import logging\nfrom tenacity import retry, stop_after_attempt, wait_exponential\n\nlog = logging.getLogger(__name__)\n\n@retry(stop=stop_after_attempt(3),\n       wait=wait_exponential(multiplier=1, min=1, max=10))\ndef robust_call(payload: dict) -> dict:\n    log.info("calling", extra={"size": len(payload)})\n    # ... real call here ...\n    return {"ok": True}`;
  if (f.codeSeed.lang === 'typescript') return `export async function robustCall(payload: unknown) {\n  for (let i = 0; i < 3; i++) {\n    try { return await call(payload); }\n    catch (e) { await sleep(2 ** i * 1000); }\n  }\n  throw new Error("Gave up after 3 retries");\n}`;
  if (f.codeSeed.lang === 'sql') return `-- safer: idempotent + bounded\nEXPLAIN ANALYZE\nSELECT * FROM users WHERE id = ANY($1::uuid[])\nLIMIT 1000;`;
  return `# safer: idempotent, retried\nfor i in 1 2 3; do\n  curl -fsSL --retry 3 "$URL" && break\ndone`;
}

export function getSlides(day: number, postIdx: number): SlideContent[] {
  const key = `${day}-${postIdx}`;

  // 1. Authored JSON content (primary source). Merge in per-slide deep-dive
  //    details (aligned by index) without mutating the imported objects.
  const authored = POSTS_CONTENT[key];
  if (authored && authored.slides && authored.slides.length) {
    const details = POSTS_DETAIL[key];
    if (!details) return authored.slides;
    return authored.slides.map((s, i) =>
      details[i] && details[i].trim() ? { ...s, detail: details[i] } : s);
  }

  // 2. Legacy hand-authored TS content (kept as fallback).
  const sample = SAMPLE_CONTENT[key];
  if (sample) return sample;

  // 3. Generated template (last resort, until the post is authored).
  const ref = getPost(day, postIdx);
  if (!ref) return [];
  return templateForAngle(ref.day.theme, ref.post.angle, ref.day.category);
}

/** Topic-specific authored caption for a post, if one exists. */
export function getCaption(day: number, postIdx: number): string | undefined {
  return POSTS_CONTENT[`${day}-${postIdx}`]?.caption;
}

export function getPostMeta(day: number, postIdx: number): { day: DayTopic; post: PostTopic } | undefined {
  return getPost(day, postIdx);
}
