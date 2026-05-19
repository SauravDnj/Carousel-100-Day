import { Category, DayTopic, PostAngle, PostTopic } from './types';

// 100-day plan. Each day has a `theme` (the topic), a `category`, and 5 angled posts.
// The 5 angles are consistent so the audience knows what to expect each day.

const ANGLES: PostAngle[] = ['Concept', 'Why It Matters', 'How It Works', 'Code Example', 'Common Mistakes'];

interface DaySeed { theme: string; category: Category; }

// Authored topic plan — 100 entries.
const PLAN: DaySeed[] = [
  // Week 1 — AI Fundamentals
  { theme: 'What is Artificial Intelligence?', category: 'AI Fundamentals' },
  { theme: 'Narrow AI vs General AI', category: 'AI Fundamentals' },
  { theme: 'AI vs ML vs Deep Learning', category: 'AI Fundamentals' },
  { theme: 'A Brief History of AI', category: 'AI Fundamentals' },
  { theme: 'Real-World AI Applications', category: 'AI Fundamentals' },
  { theme: 'AI Ethics & Bias', category: 'AI Fundamentals' },
  { theme: 'How Models Learn (Intuition)', category: 'AI Fundamentals' },
  // Week 2 — Math for ML
  { theme: 'Linear Algebra for ML', category: 'Math for ML' },
  { theme: 'Vectors, Dot Products & Cosine Similarity', category: 'Math for ML' },
  { theme: 'Probability for ML', category: 'Math for ML' },
  { theme: 'Statistics Essentials', category: 'Math for ML' },
  { theme: 'Calculus & Derivatives', category: 'Math for ML' },
  { theme: 'Gradient Descent, Visually', category: 'Math for ML' },
  { theme: 'Distance Metrics: L1, L2, Cosine', category: 'Math for ML' },
  // Week 3 — Python
  { theme: 'Python Basics in 8 Slides', category: 'Python' },
  { theme: 'Python Data Structures', category: 'Python' },
  { theme: 'List & Dict Comprehensions', category: 'Python' },
  { theme: 'Functions, *args, **kwargs', category: 'Python' },
  { theme: 'Decorators Demystified', category: 'Python' },
  { theme: 'Classes & OOP in Python', category: 'Python' },
  { theme: 'Generators & Iterators', category: 'Python' },
  // Week 4 — Python continued + tooling
  { theme: 'Async/Await in Python', category: 'Python' },
  { theme: 'Virtual Environments & uv', category: 'Python' },
  { theme: 'NumPy in 8 Slides', category: 'Python' },
  { theme: 'Pandas in 8 Slides', category: 'Python' },
  { theme: 'Matplotlib & Seaborn', category: 'Python' },
  // Week 5 — ML basics
  { theme: 'What is Machine Learning?', category: 'Machine Learning' },
  { theme: 'Supervised Learning', category: 'Machine Learning' },
  { theme: 'Unsupervised Learning', category: 'Machine Learning' },
  { theme: 'Reinforcement Learning', category: 'Machine Learning' },
  { theme: 'Train / Validation / Test Splits', category: 'Machine Learning' },
  { theme: 'Cross Validation', category: 'Machine Learning' },
  { theme: 'Bias-Variance Tradeoff', category: 'Machine Learning' },
  // Week 6 — Classic ML
  { theme: 'Overfitting & Regularization', category: 'Machine Learning' },
  { theme: 'Linear Regression', category: 'Machine Learning' },
  { theme: 'Logistic Regression', category: 'Machine Learning' },
  { theme: 'Decision Trees', category: 'Machine Learning' },
  { theme: 'Random Forests', category: 'Machine Learning' },
  { theme: 'Gradient Boosting & XGBoost', category: 'Machine Learning' },
  { theme: 'Support Vector Machines', category: 'Machine Learning' },
  // Week 7 — Deep Learning basics
  { theme: 'What is a Neural Network?', category: 'Deep Learning' },
  { theme: 'Activation Functions', category: 'Deep Learning' },
  { theme: 'Backpropagation, Step by Step', category: 'Deep Learning' },
  { theme: 'Convolutional Neural Networks', category: 'Deep Learning' },
  { theme: 'Recurrent Neural Networks', category: 'Deep Learning' },
  { theme: 'LSTMs & GRUs', category: 'Deep Learning' },
  { theme: 'Dropout & BatchNorm', category: 'Deep Learning' },
  // Week 8 — Transformers + frameworks
  { theme: 'The Transformer, Explained', category: 'Deep Learning' },
  { theme: 'Attention Mechanism', category: 'Deep Learning' },
  { theme: 'Self-Attention vs Cross-Attention', category: 'Deep Learning' },
  { theme: 'Positional Encodings', category: 'Deep Learning' },
  { theme: 'Embeddings, Visually', category: 'Deep Learning' },
  { theme: 'PyTorch in 8 Slides', category: 'Deep Learning' },
  { theme: 'TensorFlow in 8 Slides', category: 'Deep Learning' },
  // Week 9 — NLP / LLMs
  { theme: 'What is NLP?', category: 'NLP & LLMs' },
  { theme: 'Tokenization Explained', category: 'NLP & LLMs' },
  { theme: 'BPE & WordPiece', category: 'NLP & LLMs' },
  { theme: 'Word2Vec & GloVe', category: 'NLP & LLMs' },
  { theme: 'Language Models 101', category: 'NLP & LLMs' },
  { theme: 'GPT vs BERT', category: 'NLP & LLMs' },
  // Week 10 — LLM training/inference
  { theme: 'Fine-Tuning LLMs', category: 'NLP & LLMs' },
  { theme: 'LoRA & QLoRA', category: 'NLP & LLMs' },
  { theme: 'Quantization (4-bit, 8-bit)', category: 'NLP & LLMs' },
  { theme: 'RLHF, DPO, PPO', category: 'NLP & LLMs' },
  { theme: 'Context Windows & KV Cache', category: 'NLP & LLMs' },
  { theme: 'Temperature, Top-p, Top-k', category: 'NLP & LLMs' },
  // Week 11 — RAG
  { theme: 'What is RAG?', category: 'RAG' },
  { theme: 'The RAG Pipeline', category: 'RAG' },
  { theme: 'Chunking Strategies', category: 'RAG' },
  { theme: 'Embedding Models Compared', category: 'RAG' },
  { theme: 'Vector Search Basics', category: 'RAG' },
  { theme: 'Hybrid Search (BM25 + Vector)', category: 'RAG' },
  { theme: 'Reranking with Cross-Encoders', category: 'RAG' },
  // Week 12 — RAG advanced + Agents
  { theme: 'Evaluating RAG Quality', category: 'RAG' },
  { theme: 'What is an AI Agent?', category: 'AI Agents' },
  { theme: 'The ReAct Pattern', category: 'AI Agents' },
  { theme: 'Tool Calling / Function Calling', category: 'AI Agents' },
  { theme: 'Multi-Agent Systems', category: 'AI Agents' },
  { theme: 'LangChain Crash Course', category: 'AI Tools' },
  { theme: 'LlamaIndex Crash Course', category: 'AI Tools' },
  // Week 13 — Databases
  { theme: 'SQL vs NoSQL', category: 'SQL Databases' },
  { theme: 'PostgreSQL Essentials', category: 'SQL Databases' },
  { theme: 'Indexes & Query Plans', category: 'SQL Databases' },
  { theme: 'MongoDB in 8 Slides', category: 'NoSQL Databases' },
  { theme: 'Redis: Caching & Beyond', category: 'NoSQL Databases' },
  { theme: 'Pinecone for Vector Search', category: 'Vector Databases' },
  { theme: 'Weaviate Essentials', category: 'Vector Databases' },
  // Week 14 — Vector DBs + Tools
  { theme: 'Qdrant in 8 Slides', category: 'Vector Databases' },
  { theme: 'Chroma for Local RAG', category: 'Vector Databases' },
  { theme: 'FAISS Deep Dive', category: 'Vector Databases' },
  { theme: 'pgvector: Postgres for AI', category: 'Vector Databases' },
  { theme: 'OpenAI & Claude APIs', category: 'AI Tools' },
  { theme: 'Hugging Face Hub', category: 'AI Tools' },
  // Week 15 — Production AI
  { theme: 'Prompt Engineering 101', category: 'Prompt Engineering' },
  { theme: 'Chain-of-Thought Prompting', category: 'Prompt Engineering' },
  { theme: 'MLOps in 8 Slides', category: 'MLOps' },
  { theme: 'Docker for ML', category: 'MLOps' },
  { theme: 'Serving Models with FastAPI', category: 'Production AI' },
  { theme: 'Monitoring LLMs in Production', category: 'Production AI' },
  { theme: 'Build Your AI Portfolio', category: 'Production AI' },
];

if (PLAN.length !== 100) {
  throw new Error(`Curriculum plan must have 100 days, got ${PLAN.length}`);
}

// Category → hashtag pool. We pick 8-12 per post.
const HASHTAGS: Record<Category, string[]> = {
  'AI Fundamentals': ['#AI', '#ArtificialIntelligence', '#TechExplained', '#100DaysOfAI', '#LearnAI', '#AIBasics', '#AIForBeginners', '#FutureOfAI', '#TechEducation', '#AIDaily', '#Innovation'],
  'Machine Learning': ['#MachineLearning', '#ML', '#DataScience', '#MLBasics', '#100DaysOfML', '#LearnML', '#DataScientist', '#MLEngineer', '#AIML', '#PredictiveAnalytics'],
  'Deep Learning': ['#DeepLearning', '#NeuralNetworks', '#PyTorch', '#TensorFlow', '#DL', '#AIResearch', '#NeuralNets', '#100DaysOfDL', '#AIEngineer', '#DeepNeuralNetworks'],
  'NLP & LLMs': ['#NLP', '#LLM', '#LargeLanguageModels', '#GPT', '#LLMOps', '#NaturalLanguageProcessing', '#OpenAI', '#Anthropic', '#GenAI', '#GenerativeAI', '#LLMEngineer'],
  'RAG': ['#RAG', '#RetrievalAugmentedGeneration', '#VectorSearch', '#Embeddings', '#LLM', '#GenAI', '#AIEngineer', '#100DaysOfRAG', '#LangChain', '#LlamaIndex'],
  'AI Agents': ['#AIAgents', '#Agents', '#AutonomousAI', '#ToolUse', '#FunctionCalling', '#ReAct', '#MultiAgent', '#LangGraph', '#AgenticAI', '#LLMAgents'],
  'Computer Vision': ['#ComputerVision', '#CV', '#OpenCV', '#YOLO', '#ImageRecognition', '#CNN', '#DeepLearning', '#AIVision', '#100DaysOfCV'],
  'Python': ['#Python', '#PythonDeveloper', '#PythonProgramming', '#LearnPython', '#100DaysOfPython', '#Coding', '#Programming', '#PythonTips', '#CodeNewbie', '#DevCommunity'],
  'JavaScript / TypeScript': ['#JavaScript', '#TypeScript', '#WebDev', '#NodeJS', '#100DaysOfCode', '#Programming', '#FrontEnd', '#FullStack', '#TSLove', '#JSDev'],
  'SQL Databases': ['#SQL', '#PostgreSQL', '#Database', '#DataEngineering', '#DBA', '#BackEnd', '#100DaysOfSQL', '#Postgres', '#RDBMS'],
  'NoSQL Databases': ['#NoSQL', '#MongoDB', '#Redis', '#Database', '#BackEnd', '#DataEngineering', '#DevOps', '#WebDev', '#DocumentDB'],
  'Vector Databases': ['#VectorDB', '#VectorDatabase', '#Pinecone', '#Weaviate', '#Qdrant', '#Chroma', '#FAISS', '#pgvector', '#Embeddings', '#RAG', '#SemanticSearch'],
  'AI Tools': ['#AITools', '#LangChain', '#LlamaIndex', '#OpenAI', '#HuggingFace', '#Claude', '#AIEngineer', '#GenAI', '#AIStack', '#DevTools'],
  'Prompt Engineering': ['#PromptEngineering', '#PromptEngineer', '#LLMPrompts', '#GenAI', '#PromptDesign', '#AITips', '#ChainOfThought', '#FewShot', '#AIWriting'],
  'MLOps': ['#MLOps', '#DataOps', '#Docker', '#Kubernetes', '#MLEngineering', '#DevOps', '#ModelDeployment', '#CI/CD', '#MLPipeline'],
  'Data Engineering': ['#DataEngineering', '#ETL', '#DataPipeline', '#Airflow', '#Snowflake', '#Databricks', '#DataStack', '#BigData'],
  'Math for ML': ['#MathForML', '#LinearAlgebra', '#Statistics', '#Probability', '#Calculus', '#DataScienceMath', '#MLMath', '#100DaysOfMath'],
  'Production AI': ['#ProductionAI', '#AIEngineering', '#FastAPI', '#ModelServing', '#AIInProduction', '#MLOps', '#AIDeployment', '#AIatScale'],
};

function pickHashtags(category: Category, _angle: PostAngle, count = 10): string[] {
  const pool = HASHTAGS[category];
  // Always include a few foundational tags then sample the rest.
  const must = ['#100DaysOfCarousel', '#AILearning', '#TechCarousel', '#sauravdnj'];
  const fromPool = pool.slice(0, Math.max(count - must.length, 0));
  return [...must, ...fromPool];
}

export function buildCurriculum(): DayTopic[] {
  return PLAN.map((seed, idx) => {
    const day = idx + 1;
    const posts: PostTopic[] = ANGLES.map((angle, j) => ({
      postIdx: j + 1,
      angle,
      title: `${seed.theme} — ${angle}`,
      hashtags: pickHashtags(seed.category, angle, 10),
    }));
    return {
      day,
      category: seed.category,
      theme: seed.theme,
      posts,
    };
  });
}

export const CURRICULUM = buildCurriculum();

export function getDay(day: number): DayTopic | undefined {
  return CURRICULUM.find(d => d.day === day);
}

export function getPost(day: number, postIdx: number): { day: DayTopic; post: PostTopic } | undefined {
  const d = getDay(day);
  if (!d) return undefined;
  const p = d.posts.find(p => p.postIdx === postIdx);
  if (!p) return undefined;
  return { day: d, post: p };
}

export const TOTAL_DAYS = 100;
export const POSTS_PER_DAY = 5;

/** Navigation helpers. Return undefined when we'd run off the end of the curriculum. */
export function nextPost(day: number, postIdx: number): { day: number; postIdx: number } | undefined {
  if (postIdx < POSTS_PER_DAY) return { day, postIdx: postIdx + 1 };
  if (day < TOTAL_DAYS) return { day: day + 1, postIdx: 1 };
  return undefined;
}

export function prevPost(day: number, postIdx: number): { day: number; postIdx: number } | undefined {
  if (postIdx > 1) return { day, postIdx: postIdx - 1 };
  if (day > 1) return { day: day - 1, postIdx: POSTS_PER_DAY };
  return undefined;
}

export function nextDay(day: number, postIdx: number): { day: number; postIdx: number } | undefined {
  if (day < TOTAL_DAYS) return { day: day + 1, postIdx };
  return undefined;
}

export function prevDay(day: number, postIdx: number): { day: number; postIdx: number } | undefined {
  if (day > 1) return { day: day - 1, postIdx };
  return undefined;
}
