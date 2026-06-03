import fs from 'node:fs';

const CONTENT = new URL('../lib/posts-content.json', import.meta.url);
const DETAIL  = new URL('../lib/posts-detail.json',  import.meta.url);
const content = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));
const detail  = JSON.parse(fs.readFileSync(DETAIL,  'utf8'));

// ----------------------------------------------------------------------------
// DAY 7 — How Models Learn (Intuition)  (category: AI Fundamentals)
// Angles: Concept / Why It Matters / How It Works / Code Example / Common Mistakes
// Intuition only — no heavy math (calculus/gradient-descent math comes Week 2).
// ----------------------------------------------------------------------------

const posts = {};

// ===== 7-1 — Concept ========================================================
posts['7-1'] = {
  caption:
`"The model learned it" sounds like magic. It isn't. Learning is just: guess, measure how wrong you were, adjust, repeat. 🎯

That loop — run a few thousand times — turns a random set of numbers into something that recognises faces or writes code. No understanding, no intuition. Just relentless error-correction.

INSIDE THIS POST:
• the one-sentence definition of "learning"
• the dart-throwing analogy that makes it click
• parameters, loss, and what training really does
• memorising vs generalising
• why the model doesn't actually "understand"

Demystify the magic word. Save it. 👇`,
  slides: [
    { kind: 'cover', title: 'How Models Learn', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Learning = reducing error',
      body: "Strip away the mystique and machine learning is one idea: make a prediction, measure how wrong it is, nudge the model to be a little less wrong, and repeat. Do that millions of times and 'wrong' shrinks toward 'right'. That's the whole engine." },
    { kind: 'visual', title: 'Like learning to throw darts',
      body: "Your first throw misses left. You don't solve physics — you just adjust right a bit and throw again. Miss high? Aim lower. Each throw uses the last miss to correct the next. A model 'learns' exactly this way: every error tells it which direction to adjust." },
    { kind: 'diagram', title: 'The learning loop',
      diagram: { kind: 'cycle', nodes: [
        { label: 'Predict', sub: 'make a guess' },
        { label: 'Measure error', sub: 'how wrong?' },
        { label: 'Adjust', sub: 'nudge the knobs' },
        { label: 'Repeat', sub: 'thousands of times' },
      ] } },
    { kind: 'definition', title: 'Parameters: the knobs',
      body: "A model is a formula with adjustable numbers called parameters (or weights). Learning means finding good values for those knobs. A small model has hundreds; a large language model has billions. Training is just the search for the right settings." },
    { kind: 'definition', title: 'Loss: the wrongness score',
      body: "To improve, a model needs to measure how wrong it is — that single number is the loss. High loss means bad predictions; low loss means good ones. Every adjustment the model makes is aimed at one goal: push the loss down." },
    { kind: 'definition', title: 'Training = minimising loss',
      body: "Put it together: training is the process of tweaking the knobs to make the loss as small as possible. The model isn't reasoning toward an answer — it's rolling downhill on a 'wrongness' landscape, one small step at a time, until it can't get much lower." },
    { kind: 'visual', title: 'From random to skilled',
      body: "At the start, the knobs are random and the model is useless — pure noise. After a thousand rounds of guess-measure-adjust, the same model predicts well. Nothing was added but error-correction. Skill emerged from repetition, not insight." },
    { kind: 'comparison', title: 'Memorising vs generalising',
      bullets: [
        "Memorising: nails the training data, fails on new data",
        "Generalising: learns the real pattern, works on unseen data",
        "Generalising is the actual goal of learning",
        "A parrot repeats; a learner predicts what it hasn't seen",
      ] },
    { kind: 'mistake', title: "It doesn't 'understand'",
      body: "Because the output looks intelligent, we assume comprehension. But the model only found number settings that minimise error on its data. It has no concept of meaning — it's a spectacularly good pattern-fitter. Mistaking that for understanding is the central beginner illusion." },
    { kind: 'cta', title: 'Save this. Follow for Day 8.', sticker: 'DAY-X',
      body: "Next: why understanding how models learn makes you far better at using them." },
  ],
};

// ===== 7-2 — Why It Matters =================================================
posts['7-2'] = {
  caption:
`Most people treat a model as a magic box: input goes in, answer comes out, who knows why. That's exactly why they can't fix it when it breaks. 🔧

Once you understand that a model just learned patterns from data to minimise error, every weird behaviour suddenly has a cause you can chase — usually in the data, not the model.

INSIDE THIS POST:
• why "magic box" thinking holds you back
• how the learning view helps you debug
• why the data is the real teacher
• the bug that's almost always your fault, not the model's
• how to read a training curve

Stop guessing. Start diagnosing. Save it. 👇`,
  slides: [
    { kind: 'cover', title: 'Why "How Models Learn" Matters', sticker: 'DAY-X' },
    { kind: 'definition', title: 'You can\'t fix a black box',
      body: "If a model is pure magic to you, then when it misbehaves you have nothing to grab onto. Understanding that it learned patterns to reduce error turns every failure into a question with an answer: what in the data or the setup pushed it there?" },
    { kind: 'why', title: 'Why a beginner should care',
      bullets: [
        "You can debug failures instead of just shrugging",
        "You'll fix the data — where most problems actually live",
        "You can read training curves and know what's wrong",
        "You stop fearing the model and start steering it",
      ] },
    { kind: 'visual', title: 'It demystifies the magic',
      body: "The gap between 'AI is incomprehensible sorcery' and 'AI minimises error on data' is the gap between a user and a practitioner. The learning view doesn't make models less impressive — it makes them debuggable, predictable, and yours to control." },
    { kind: 'definition', title: 'The data is the teacher',
      body: "A model learns whatever its data shows it — nothing more. Good data teaches good patterns; biased or sparse data teaches bad ones. So when a model behaves badly, the first suspect is almost never the algorithm. It's what you fed it." },
    { kind: 'how', title: 'How this shows up at work',
      bullets: [
        "A model 'fails' → you inspect the data first",
        "Accuracy is great in training, awful live → overfitting",
        "Loss won't go down → learning rate or data issue",
        "Reading curves tells you what to change next",
      ] },
    { kind: 'comparison', title: 'Black box vs understanding',
      bullets: [
        "Black box: 'it's broken, no idea why' → stuck",
        "Understanding: 'loss plateaued → check the data'",
        "Black box: tweak randomly and hope",
        "Understanding: form a hypothesis, test it, fix it",
      ] },
    { kind: 'definition', title: 'Garbage in, garbage learned',
      body: "Because the model only knows its data, the highest-leverage work is almost always improving the data, not the model. Beginners tune the algorithm for days; pros fix the three mislabelled examples that were poisoning everything. Know where the leverage is." },
    { kind: 'mistake', title: 'Blaming the model',
      body: "When results disappoint, the reflex is to swap models or add complexity. But most of the time the model learned exactly what the data taught — the fault is in the data, the labels, or the metric. Blaming the model sends you fixing the wrong thing." },
    { kind: 'tips', title: 'Put the intuition to work',
      bullets: [
        "When it fails, ask 'what did the data teach it?'",
        "Always check training vs test performance",
        "Watch the loss curve — it tells a story",
        "Improve data before reaching for a fancier model",
      ] },
    { kind: 'cta', title: 'Save this. Follow for Day 8.', sticker: 'DAY-X',
      body: "Next: the training loop, step by step — exactly how the adjusting happens." },
  ],
};

// ===== 7-3 — How It Works ===================================================
posts['7-3'] = {
  caption:
`Every model on earth — from a 3-line regression to GPT — trains with the same 4-step loop. 🔁

Predict → measure the error → figure out which way to adjust → take a small step. Repeat until the error stops shrinking. That's "training" in four moves, no PhD required.

INSIDE THIS POST:
• the 4 steps of every training loop
• loss: turning "wrong" into a number
• gradients: which way is downhill
• learning rate: how big a step to take
• epochs, batches, and reading the loss curve

See the loop once and "training a model" stops being mysterious. Save it. 👇`,
  slides: [
    { kind: 'cover', title: 'How Training Actually Works', sticker: 'DAY-X' },
    { kind: 'visual', title: 'One loop, every model',
      body: "Whether it's a tiny regression or a giant language model, training is the same four-step loop repeated: predict, measure error, find the adjustment direction, take a small step. The scale differs wildly; the recipe doesn't." },
    { kind: 'diagram', title: 'The training loop',
      diagram: { kind: 'pipeline', stages: [
        { label: 'Forward pass', detail: 'make a prediction' },
        { label: 'Compute loss', detail: 'how wrong?' },
        { label: 'Backward pass', detail: 'which way to adjust' },
        { label: 'Update weights', detail: 'take a small step' },
      ] } },
    { kind: 'steps', title: '1. Make a prediction',
      body: "Feed an example through the model with its current knobs and get an output — the 'forward pass'. Early on this prediction is basically random, because the knobs haven't been tuned yet. That's fine: it's the raw material the next step measures." },
    { kind: 'steps', title: '2. Measure the error',
      body: "Compare the prediction to the true answer and compute the loss — a single number capturing how wrong the model was. This is the model's only feedback signal. Without a way to measure wrongness, there's no direction to improve in." },
    { kind: 'steps', title: '3. Find which way to adjust',
      body: "The gradient answers one question: if I nudge each knob, does the loss go up or down? Intuitively, it points downhill on the wrongness landscape. You don't need the calculus yet — just the idea that the model can sense which direction reduces error." },
    { kind: 'steps', title: '4. Take a small step',
      body: "Move each knob a little in the downhill direction. How far is set by the learning rate. Too big and you overshoot the valley; too small and training crawls. One step barely helps — but thousands of steps compound into a skilled model." },
    { kind: 'how', title: 'Epochs & batches',
      bullets: [
        "One pass through all the data = one epoch",
        "Training runs for many epochs (often dozens to thousands)",
        "Data is fed in small batches, not all at once",
        "Each batch = one predict-measure-adjust step",
      ] },
    { kind: 'diagram', title: 'Loss falls over time',
      diagram: { kind: 'bars', axisLabel: 'Loss (lower = better)', bars: [
        { label: 'Epoch 0', value: 100, sub: 'random' },
        { label: 'Epoch 100', value: 38, sub: 'learning' },
        { label: 'Epoch 500', value: 9, sub: 'good' },
        { label: 'Epoch 1000', value: 2, sub: 'trained' },
      ] } },
    { kind: 'visual', title: 'Walking downhill in fog',
      body: "Picture the loss as a foggy valley you can't see across. You can only feel the slope under your feet. So you step downhill, feel again, step again. Gradient descent is exactly this: no map of the whole landscape, just the local slope, one step at a time." },
    { kind: 'mistake', title: 'Getting the step size wrong',
      body: "The learning rate is the knob beginners most often break. Too high and the loss explodes or bounces forever, never settling. Too low and training takes ages or stalls. Most 'my model won't learn' problems trace straight back to this single number." },
    { kind: 'cta', title: 'Save this. Follow for Day 8.', sticker: 'DAY-X',
      body: "Next: we watch a model actually learn — in a few lines of Python." },
  ],
};

// ===== 7-4 — Code Example ===================================================
posts['7-4'] = {
  caption:
`You can watch a model learn in ~10 lines of Python — no framework, no magic. 👀

We'll teach it the rule y = 2x starting from a wrong guess, and watch the weight crawl from 0 toward 2 as the loss melts away. This tiny loop is the same idea that trains billion-parameter models.

INSIDE THIS POST:
• the data and a deliberately-wrong starting guess
• prediction + loss in two lines
• the gradient and one downhill step
• the loop that makes it learn
• the one-line library version that does the same thing

Watch learning happen, line by line. Save the code. 👇`,
  slides: [
    { kind: 'cover', title: 'Watch a Model Learn — In Code', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Teach it y = 2x',
      body: "We'll build the smallest possible learner: a model with one knob, w, trying to discover that y = 2x. It starts with w = 0 (wrong) and we'll watch the training loop nudge it to 2 — the whole guess-measure-adjust cycle, in plain Python." },
    { kind: 'code', title: '1. Data + a wrong guess',
      code: `import numpy as np

x = np.array([1, 2, 3, 4], dtype=float)
y = 2 * x            # the true rule (model doesn't know it)
w = 0.0              # our guess — starts wrong
lr = 0.01            # learning rate: step size`,
      codeLang: 'python' },
    { kind: 'code', title: '2. Predict + measure error',
      code: `pred = w * x                       # current prediction
loss = np.mean((pred - y) ** 2)    # mean squared error
print(round(loss, 2))              # -> 30.0  (very wrong)`,
      codeLang: 'python' },
    { kind: 'code', title: '3. Find the slope, take a step',
      code: `grad = np.mean(2 * x * (w * x - y))  # which way is downhill?
w = w - lr * grad                    # step that way
print(round(w, 3))                   # -> 0.3  (moving toward 2)`,
      codeLang: 'python' },
    { kind: 'code', title: '4. The loop that learns',
      code: `for epoch in range(1000):
    grad = np.mean(2 * x * (w * x - y))
    w -= lr * grad

print(round(w, 3))   # -> 2.0   it learned the rule!`,
      codeLang: 'python' },
    { kind: 'visual', title: 'What just happened',
      body: "The knob started at 0 and, guided only by the error, crawled to 2.0 — the true rule — with the loss falling to near zero. Nobody told it the answer. It found it by repeatedly measuring its own wrongness and stepping downhill. That's learning." },
    { kind: 'code', title: '5. The library version',
      code: `from sklearn.linear_model import LinearRegression

model = LinearRegression().fit(x.reshape(-1, 1), y)
print(round(model.coef_[0], 3))   # -> 2.0  same answer`,
      codeLang: 'python' },
    { kind: 'tips', title: 'From scratch vs library',
      bullets: [
        "From scratch: you SEE the loop — best for learning",
        "Library: optimised, robust, what you'll use in practice",
        "Both do the identical thing: minimise loss",
        "Understand the loop, then let the library run it",
      ] },
    { kind: 'mistake', title: 'A learning rate that explodes',
      body: "Set lr = 1.0 in that loop and watch w shoot to infinity instead of settling at 2 — the steps overshoot the valley and diverge. It's the single most common 'my training broke' bug, and now you can see exactly why it happens." },
    { kind: 'cta', title: 'Save this. Follow for Day 8.', sticker: 'DAY-X',
      body: "Next: the 5 mistakes that quietly wreck a model's learning." },
  ],
};

// ===== 7-5 — Common Mistakes ================================================
posts['7-5'] = {
  caption:
`Your model scored 99% in training and 60% in the real world. Congratulations — you've hit the #1 mistake in ML. 📉

Overfitting, data leakage, no test split, judging by training accuracy: these are the traps that make a model look brilliant and perform terribly. Here are five, and the fixes.

INSIDE THIS POST:
• overfitting vs underfitting
• data leakage (the silent killer)
• why you MUST split train and test
• why training accuracy lies
• the fixes that actually work

The difference between a demo and a deployable model. Save it. 👇`,
  slides: [
    { kind: 'cover', title: 'How Learning Goes Wrong — 5 Mistakes', sticker: 'DAY-X' },
    { kind: 'definition', title: 'Learning can fail quietly',
      body: "A model can reduce its loss beautifully and still be useless — because it learned the wrong thing. These five mistakes all share that trap: the training numbers look great while the real-world performance quietly falls apart." },
    { kind: 'mistake', title: '#1 — Overfitting',
      body: "The model memorises the training data — including its noise and quirks — instead of the real pattern. It scores near-perfect in training and badly on anything new. It's the student who memorised the answer key but can't handle a different exam." },
    { kind: 'mistake', title: '#2 — Underfitting',
      body: "The opposite: the model is too simple (or trained too briefly) to capture the pattern at all. It does poorly even on the training data. Underfitting is a model that didn't learn enough; overfitting is one that 'learned' the wrong things." },
    { kind: 'mistake', title: '#3 — Data leakage',
      body: "Information from the answer sneaks into the inputs — like using a 'date_paid' column to predict who will pay. The model looks magically accurate in testing, then collapses live, because that clue won't exist at prediction time. The silent killer of ML projects." },
    { kind: 'mistake', title: '#4 — No train/test split',
      body: "If you test on the same data you trained on, of course it scores well — it has seen the answers. You must hold out data the model never trained on, and judge it only on that. Skip this and every accuracy number you report is a lie." },
    { kind: 'mistake', title: '#5 — Trusting training accuracy',
      body: "Training accuracy measures memorisation, not skill. The only number that matters is performance on unseen data. A model boasting 99% on data it trained on tells you nothing about whether it will work in the real world." },
    { kind: 'diagram', title: 'Underfit vs overfit',
      diagram: { kind: 'compare',
        left:  { title: 'Underfit', items: ['Too simple', 'Misses the pattern', 'Bad on train AND test', 'Fix: more power / training'] },
        right: { title: 'Overfit', items: ['Too complex', 'Memorises noise', 'Great on train, bad on test', 'Fix: more data / simpler model'] } } },
    { kind: 'tips', title: 'The fixes',
      bullets: [
        "Always split data into train and test (and validation)",
        "Judge only on data the model never saw",
        "Hunt for leakage: 'would I have this clue at predict time?'",
        "Overfit? more data, simpler model, regularisation",
        "Underfit? more features, more capacity, train longer",
      ] },
    { kind: 'cta', title: 'Day 7 done. Follow for Day 8.', sticker: 'DAY-X',
      body: "Next: Week 2 begins — Linear Algebra for ML, the language all this math is written in." },
  ],
};

// ---------------------------------------------------------------------------
// DETAILS
// ---------------------------------------------------------------------------
const details = {
  '7-1': [
    "Welcome to Day 7 — the last day of Week 1, and the one that ties the fundamentals together. We've covered what AI is, the narrow/general ladder, the AI/ML/DL hierarchy, the field's history, where it's applied, and how it goes wrong. Today we open the box and ask: how does a model actually learn anything at all?\n\nThe promise of this post is demystification without math. By the end, the sentence 'the model learned it' will stop sounding like magic and start sounding like a mechanical process you could describe to a friend. That intuition is the foundation for Week 2's math — you'll understand what the equations are *for* before you meet them.",
    "Here's the single most important idea in machine learning, stated plainly: learning is making a prediction, measuring how wrong it is, nudging the model to be slightly less wrong, and repeating. There's no insight, no reasoning, no spark of comprehension — just relentless error-correction run at enormous scale.\n\nWhat makes this powerful is that 'wrong' is something you can measure as a number, and 'less wrong' is a direction you can move in. So the whole of training becomes a mechanical descent: keep adjusting in whatever direction reduces the wrongness. Run that loop millions of times on good data, and a pile of random numbers becomes a system that recognises faces or drafts essays. Everything else in machine learning is detail on top of this one loop.",
    "The dart analogy makes the loop intuitive because you've lived it. Your first dart misses to the left. You don't pull out a physics textbook to compute air resistance and release angle — you just think 'too far left' and aim a bit right on the next throw. Miss high? Aim lower. Each throw's error informs the next adjustment.\n\nThat is precisely how a model learns: every prediction it makes is a throw, every error is a 'miss left/right', and every adjustment nudges it closer to the bullseye. You don't need to understand the underlying machinery to improve — you just need to know which way you missed and correct toward the target. The model has no more 'understanding' of its task than you have of aerodynamics when you adjust your aim. It just corrects, throw after throw.",
    "This cycle diagram is the whole post in four words: Predict, Measure error, Adjust, Repeat. Drawing it as a loop rather than a line is deliberate — learning isn't a one-shot event, it's a cycle that runs thousands or millions of times, each pass leaving the model a little better than the last.\n\nThe value of holding this loop in your head is that it's universal. The smallest regression and the largest language model both run exactly this cycle; only the scale and the complexity of the 'knobs' change. Whenever you read about 'training' a model — any model — you can mentally drop it into this four-step loop and know roughly what's happening. It's the master pattern that makes the entire field comprehensible.",
    "Parameters are the adjustable numbers inside a model — the 'knobs' the learning loop turns. A model is really just a formula with blanks in it, and the parameters are the values that fill those blanks. Learning is nothing more than searching for knob settings that make the formula produce good predictions.\n\nThe scale of this search is what's mind-bending. A simple line-fitting model has two parameters; a small neural network has thousands; a large language model has hundreds of billions. Training is the process of tuning all of them simultaneously. When you hear that a model 'has 70 billion parameters', that's 70 billion knobs that the training loop adjusted. Understanding parameters as tunable knobs is what makes the next idea — minimising loss — click: training is just turning those knobs to reduce wrongness.",
    "Loss is the number that makes learning possible, because you can't improve what you can't measure. The loss is a single value summarising how wrong the model's predictions are: a big number means terrible predictions, a small number means good ones. Every learning system needs one, because it's the feedback signal the whole loop steers by.\n\nThe choice of how to measure wrongness matters (different tasks use different loss functions), but the role is always the same: convert 'how badly did I do?' into one number the model can try to shrink. This is why the dart analogy works — 'how far from the bullseye' is a loss. Without a measurable loss, the model would have no idea which adjustments help and which hurt. Loss is the compass; minimising it is the journey.",
    "Now the pieces combine into a clean definition: training is tweaking the parameters to make the loss as small as possible. That's it. The model isn't reasoning its way to answers or building understanding — it's rolling downhill on a landscape of 'wrongness', taking small steps that each lower the loss a little.\n\nThe mental image to keep is a ball rolling into a valley. The valley floor is low loss (good predictions); the slopes are high loss (bad predictions). Training releases the ball and lets it roll down, parameter step by parameter step, until it settles near the bottom. This reframes the whole intimidating enterprise of 'training an AI' as a search for the lowest point on a surface — mechanical, goal-directed, and entirely free of magic. Week 2's math is mostly about how to find that downhill direction efficiently.",
    "This slide captures the almost eerie part: skill emerges from pure repetition. At training step zero, the parameters are random and the model's output is noise — it's genuinely useless. After thousands of rounds of guess-measure-adjust, the identical model, same architecture, makes accurate predictions. Nothing was added except error-correction.\n\nThat's worth sitting with, because it's counterintuitive. We associate competence with understanding, design, or insight — yet here competence appeared from a dumb loop applied relentlessly. The model didn't get smarter in any human sense; its knobs just found settings that happen to produce good answers. This is both the magic and the limitation of machine learning: extraordinary capability with no comprehension underneath. Recognising that the skill is real but the understanding is absent is exactly the calibration this whole day is building toward.",
    "The distinction between memorising and generalising is the difference between a model that's useless and one that's valuable. A model that memorises nails every example it was trained on but falls apart on anything new — it stored the answers rather than learning the rule. A model that generalises has captured the underlying pattern, so it works on data it has never seen.\n\nGeneralising is the entire point of learning. We don't train models to recite their training data — we train them to handle the future, the unseen, the real-world inputs that weren't in the dataset. The parrot-versus-learner framing makes it vivid: a parrot repeats what it heard, while a learner can respond to something genuinely new. This distinction sets up tomorrow's mistakes post directly — overfitting is exactly the failure of memorising when you wanted generalising.",
    "The central illusion this day exists to dispel: because a model's output looks intelligent, we assume there's understanding behind it. There isn't. The model found parameter settings that minimise error on its training data — it is a spectacularly capable pattern-fitter with no concept of meaning, truth, or the world.\n\nThis matters enormously for using AI well. If you believe the model 'understands', you'll over-trust it, be blindsided by its confident nonsense, and misjudge where it'll fail. If you understand it's fitting patterns to reduce loss, you'll expect it to stumble on inputs unlike its training data, to lack genuine reasoning, and to state falsehoods with total confidence. The capability is real and impressive; the understanding is absent. Holding both truths at once — without the awe or the dismissiveness — is the mark of someone who genuinely gets how models learn.",
    "That's the foundation: learning is guess-measure-adjust-repeat, parameters are the knobs, loss is the wrongness score, training minimises it, and the resulting skill is pattern-fitting, not understanding. Save this — it's the mental model that makes every later topic, especially Week 2's math, click into place.\n\nTomorrow's post makes the case for why this intuition is so practically valuable — how seeing a model as a learner (not a magic box) transforms you from someone who uses AI into someone who can debug, steer, and improve it."
  ],
  '7-2': [
    "Welcome to Day 7, post 2. Yesterday's post explained how models learn; today argues why that understanding is one of the highest-return things a beginner can acquire. The core claim: the difference between a 'magic box' and a 'learner' is the difference between being stuck and being able to fix things.\n\nMost people treat models as inscrutable oracles — input goes in, answer comes out, and when something's wrong they have no idea where to look. This post shows how the learning view, even at the intuitive level from post 1, converts that helplessness into a systematic ability to diagnose and improve. It's the practical payoff of demystifying the magic word.",
    "The opening argument is blunt: you cannot fix a black box. If a model is pure magic to you, then when it produces garbage you have nothing to grab onto — no hypothesis, no place to start, just frustration and random tweaking. Mystery and debuggability are opposites.\n\nThe learning view changes that completely. Once you know the model learned patterns from data to minimise error, every failure becomes a question with a findable answer: what in the data or the training setup pushed it toward this behaviour? You move from 'it's broken and I'm helpless' to 'something taught it this — let me trace what'. That shift, from mystery to mechanism, is what makes a model something you can actually work on rather than merely pray to.",
    "Four concrete payoffs of understanding learning. You can debug failures instead of shrugging — a failed prediction becomes a clue, not a dead end. You'll fix the data, where the majority of real problems actually live, instead of fruitlessly swapping algorithms. You can read training curves and diagnose what's going wrong from their shape. And you stop fearing the model and start steering it.\n\nThat last one is subtle but important. Fear of the unknown keeps beginners passive — they accept whatever the model does because they don't feel entitled to question it. Understanding flips that: the model is just a learner that did exactly what its data and settings dictated, so of course you can change the outcome by changing the inputs. Each payoff turns intimidation into agency.",
    "This slide names the real prize: the learning view is the boundary between a user and a practitioner. A user experiences AI as incomprehensible sorcery and can only consume its outputs. A practitioner sees 'a system minimising error on data' and can shape, fix, and improve it. Same technology, completely different relationship to it.\n\nCrucially, demystifying doesn't diminish the technology — a trained model is still astonishing. It just makes it tractable. Knowing how a car engine works doesn't make cars less useful; it makes you able to diagnose a rattle instead of fearing it. The same is true here. The learning intuition keeps all the model's power while stripping away the helplessness, which is exactly the trade you want as you move from observer to builder.",
    "This is the highest-leverage single idea in the post: the data is the teacher, and a model learns whatever its data shows it — no more, no less. Good data teaches good patterns; biased, sparse, or mislabelled data teaches bad ones, faithfully. The model is a mirror, not a mind.\n\nThe practical consequence is a reflex worth building: when a model misbehaves, suspect the data first, not the algorithm. This runs against the beginner instinct, which is to assume the fancy model is the sophisticated part and therefore the likely culprit. But the model just did its job — it minimised error on what you gave it. If that produced bad behaviour, the lesson it learned came from somewhere, and that somewhere is almost always the data, the labels, or the metric you chose.",
    "How the learning view pays off day to day, concretely. A model 'fails'? Inspect the data first — what did it actually learn from? Accuracy great in training but awful live? That's the classic signature of overfitting (tomorrow's topic). Loss refuses to go down? Suspect the learning rate or a data problem. And reading the loss curve's shape tells you what to change next.\n\nNotice that each of these is a specific diagnosis tied to the learning mechanics from post 1. Without that mechanical understanding, all you'd have is 'it's not working'. With it, the symptom points to a cause and the cause points to a fix. This is what it means to debug machine learning rather than guess at it — and it's only possible because you understand training as a process with knowable failure modes.",
    "This comparison crystallises the whole post. Black box: 'it's broken, no idea why' — so you tweak randomly and hope, which is slow, frustrating, and often makes things worse. Understanding: 'the loss plateaued, so let me check the data' — you form a hypothesis, test it, and fix the actual problem.\n\nThe deeper contrast is between hoping and reasoning. Random tweaking is gambling; hypothesis-driven debugging is engineering. The learning intuition is what gives you hypotheses to test — 'maybe it overfit', 'maybe the learning rate is too high', 'maybe a feature is leaking'. Each is a checkable claim with a known remedy. The black-box user has none of these; they're reduced to superstition. This is why even an intuitive grasp of learning, with no heavy math, already makes you dramatically more effective.",
    "'Garbage in, garbage learned' sharpens the data-is-teacher point into a directive about where to spend your effort. Since the model only knows its data, the highest-leverage work is almost always improving the data — fixing labels, filling representation gaps, removing leakage — not tuning the algorithm.\n\nThe contrast with beginner behaviour is stark and instructive. Newcomers spend days tweaking model hyperparameters for tiny gains, while a pro finds the three mislabelled examples that were quietly poisoning the whole training set and fixes them in minutes for a huge gain. Knowing where the leverage lives — in the data, overwhelmingly — is what separates efficient practitioners from those spinning their wheels. The model is usually fine; the teaching material is where the problems and the opportunities both hide.",
    "The mistake this guards against is the reflex to blame the model. Results disappoint, and the instinct is to reach for a bigger model, a trendier architecture, more layers — anything but the data. But most of the time the model learned exactly what the data taught it; it did its job perfectly. The fault lies in the data, the labels, or the chosen metric.\n\nBlaming the model is costly because it sends you fixing the wrong thing — you burn time on the algorithm while the real problem, in the data, sits untouched and keeps producing the same failure with every new model you try. The discipline is to default to suspecting the inputs and the objective before the model itself. Nine times out of ten, that's where the answer is, and the learning view from post 1 is exactly what makes that diagnosis natural.",
    "The closing tips operationalise the whole post into reflexes. When a model fails, ask 'what did the data teach it?' — making data your first suspect. Always check training versus test performance, because the gap between them diagnoses overfitting at a glance. Watch the loss curve, because its shape tells a story about what's happening inside training. And improve the data before reaching for a fancier model, because that's where the leverage is.\n\nThese aren't advanced techniques — they're habits available to anyone who understands learning at the intuitive level this week teaches. Adopt them and you'll diagnose problems that leave black-box users stuck, and you'll fix them faster and more reliably. That practical edge, earned from a non-mathematical understanding of how models learn, is the entire return on investment this post is arguing for.",
    "The takeaway: understanding how models learn turns you from a helpless user of a magic box into someone who can debug, steer, and improve real systems — mostly by fixing the data, where the leverage lives. Save this the next time a model misbehaves and you're tempted to blame the algorithm.\n\nTomorrow we zoom into the mechanics. Day 7, post 3 walks through the training loop step by step — prediction, loss, gradient, and the small step — so the four-move cycle from post 1 becomes something you understand in detail, not just in outline."
  ],
  '7-3': [
    "Welcome to Day 7, post 3. Post 1 gave you the four-step loop in outline; this post walks through each step in detail so you understand what's actually happening inside 'training'. The reassuring headline: every model on earth, from a three-line regression to a giant language model, trains with this same loop.\n\nThe goal is to take the mystery out of the word 'training'. People say 'we trained the model' as if it were an arcane ritual, but it's four concrete, repeatable moves. Once you can name and explain each one — predict, measure, find the direction, step — training becomes a process you understand rather than a black-box incantation you trust on faith.",
    "The unifying claim sets the frame: it's one loop for every model. A tiny linear regression and a hundred-billion-parameter language model differ enormously in scale and complexity, but the training recipe is identical — predict, measure error, find the adjustment direction, take a small step, repeat.\n\nThis is genuinely liberating, because it means you don't need a different mental model for each kind of AI. Learn the loop once and you understand the training of all of them in principle. The differences are in the details — how predictions are computed, how the loss is defined, how the step is taken — but the skeleton never changes. When you read that some new model was 'trained on trillions of tokens', you can drop it straight into this four-step loop and know what that sentence means.",
    "This pipeline diagram names the four steps in their technical terms, which you'll meet constantly: forward pass (make a prediction), compute loss (measure wrongness), backward pass (work out which way to adjust each knob), and update weights (take the small step). The arrows show one full iteration; in reality this pipeline runs over and over.\n\nLearning the jargon matters because it's everywhere in ML writing and tooling. 'Forward pass' and 'backward pass' (often 'backprop') sound intimidating until you map them to the plain-English loop from post 1 — they're just 'guess' and 'figure out how to adjust'. The diagram is your translation key: whenever a tutorial or paper uses these terms, you can decode them back to predict-measure-direction-step and stay oriented instead of lost in vocabulary.",
    "Step one, the forward pass: feed an example through the model with its current parameter settings and read off the output. Early in training, when the knobs are still random or near-random, this prediction is essentially garbage — and that's completely fine. It's not supposed to be good yet; it's the raw material the next step evaluates.\n\nThe thing to internalise is that the forward pass is just 'apply the formula as it currently stands'. There's nothing clever happening here — the model takes the input, runs it through its current knobs, and produces a number or a label. All the learning happens in the steps that follow, which measure how bad this prediction was and adjust accordingly. The forward pass is the model showing its current (initially terrible) work so the loop has something to critique.",
    "Step two, compute the loss: compare the prediction to the true answer and collapse 'how wrong was it?' into a single number. This is the model's only feedback signal — the entire learning process is steered by this one value and the desire to make it smaller.\n\nIt's worth appreciating how much rides on this step. Without a measurable loss, the model would have no way to know whether an adjustment helped or hurt — it'd be throwing darts in the dark with no sense of where the board is. The loss is what turns aimless flailing into directed improvement. Different problems measure wrongness differently (squared error for numbers, other losses for categories), but the role is always identical: produce the one number that the rest of the loop will work to minimise. Measure wrongness, and improvement becomes possible.",
    "Step three is the one that sounds scary and isn't, at the intuitive level: the gradient. It answers a single question — if I nudge each knob a little, does the loss go up or down? Bundle those answers together and you get a direction: which way to move all the knobs to reduce wrongness. Intuitively, it points downhill on the loss landscape.\n\nThe key message is that you don't need the calculus yet (that's Week 2). For now, just hold the idea that the model can *sense the local slope* — it can tell which direction reduces error from where it currently stands. That's all the gradient is at this level: a downhill-pointing arrow. The math of how it's computed (backpropagation) is genuinely elegant, but it's an implementation detail layered on top of this simple, graspable idea. Direction-finding, not magic.",
    "Step four, take a small step: move each knob a little in the downhill direction the gradient pointed out. How far you move is governed by the learning rate. Too big a step and you overshoot the valley floor, possibly bouncing around or flying off entirely; too small and training crawls painfully or stalls before it gets anywhere useful.\n\nThe crucial intuition is that one step barely matters — it nudges the loss down a fraction. The power comes from compounding: thousands or millions of tiny, well-directed steps accumulate into a model that's gone from random to skilled. It's the dart-throwing loop from post 1, made precise: each step is one corrected throw. This is also where the learning rate earns its reputation as the trickiest knob, which the mistakes slide will return to. Small, repeated, well-aimed steps are the whole secret.",
    "These bullets cover the vocabulary of how the loop is actually run over a dataset. One full pass through all the training data is an 'epoch', and training typically runs for many epochs — dozens, hundreds, sometimes thousands. The data isn't fed all at once but in small chunks called batches, and each batch triggers one predict-measure-adjust step.\n\nUnderstanding this structure demystifies phrases like 'we trained for 50 epochs' or 'batch size 32'. An epoch is just 'the model has now seen every example once'; running many epochs means the model revisits the data repeatedly, refining its knobs a little more each pass. Batching is mostly a practical matter — it's more efficient and more stable than processing one example at a time or the entire dataset at once. These terms describe the rhythm of training, and now you can read them fluently.",
    "This bar chart shows the payoff of the whole loop: loss falling over epochs. At epoch zero the loss is high (the model is random); by epoch 100 it's dropped sharply (rapid early learning); by epoch 500 it's low (good); by epoch 1000 it's near zero (trained). The characteristic shape — fast drop, then a gradual flattening — is the signature of healthy training.\n\nReading loss curves is a core practical skill, and this is the ideal version: steady descent levelling off near the bottom. In post 2 we noted that the curve's shape diagnoses problems — a curve that won't drop signals a learning-rate or data issue; one that drops then rises signals overfitting. So this isn't just a pretty picture of success; it's the reference shape against which you'll compare your real, messier curves to figure out what's going wrong and what to change.",
    "The fog-and-valley image is the intuition for gradient descent, and it's worth holding onto. Imagine you're standing somewhere on a hilly landscape blanketed in thick fog. You can't see the valley you're trying to reach — you can only feel the slope of the ground right under your feet. So you step downhill, feel the new slope, step again, and repeat.\n\nThat's exactly the model's situation. It can't see the whole loss landscape — it has no map of where the lowest point is. All it can sense is the local slope (the gradient) at its current parameter settings. So it steps downhill, recomputes, and steps again, inching toward a low point one move at a time. This image explains both the method's power and its limits: it'll reliably find a nearby valley, but with only local slope information it can't guarantee it found the deepest valley of all — a subtlety that becomes important later.",
    "The mistakes slide flags the learning rate as the knob beginners break most often, because it's the one with the least forgiving failure modes. Set it too high and the steps overshoot the valley — the loss explodes upward or bounces around forever, never settling. Set it too low and training either takes an eternity or stalls out before reaching a good solution.\n\nThe reason this is worth flagging now is that a huge fraction of 'my model won't learn' problems trace straight back to this single number. Before suspecting anything exotic, a seasoned practitioner checks the learning rate. It's the highest-probability culprit when training misbehaves, and tomorrow's code post will let you see divergence happen live by cranking it up. Knowing that the learning rate is both critical and commonly misconfigured saves you hours of chasing the wrong problem when training goes sideways.",
    "So training is four moves — forward pass, compute loss, backward pass, update — repeated until the loss stops shrinking, with epochs and batches setting the rhythm and the learning rate setting the step size. Save this; it's the detailed version of the loop that underlies literally every trained model.\n\nTomorrow we stop describing and start running. Day 7, post 4 implements this exact loop in about ten lines of Python and watches a model learn the rule y = 2x from a wrong starting guess — turning the abstract four steps into code you can read and run."
  ],
  '7-4': [
    "Welcome to Day 7, post 4 — the code post. We've described the training loop in outline and in detail; now we run it. In about ten lines of plain Python — no deep-learning framework, no magic — we'll watch a model learn, and you'll see the guess-measure-adjust cycle turn a wrong number into the right one before your eyes.\n\nThe task is deliberately the simplest possible: learn that y = 2x. Starting from a wrong guess, the model will discover the rule on its own, guided only by its own errors. The smallness is the point — with one knob and four data points, nothing is hidden, so you can watch every part of the loop from post 3 do its job. The same loop, scaled up, trains billion-parameter models.",
    "The setup establishes the smallest meaningful learner: a model with a single knob, w, trying to discover the rule y = 2x. We start it at w = 0, which is wrong (it would predict zero for everything), and let the training loop nudge it toward the correct value of 2.\n\nKeeping it to one parameter is a deliberate teaching choice. Real models have thousands to billions of knobs adjusting at once, which is impossible to watch. With a single knob, you can literally print its value and see it crawl toward the answer step by step. Everything you'll see — the prediction, the loss, the gradient, the update — is the full training loop from post 3, just shrunk until it fits in your head. Master it here and the only thing that changes at scale is the number of knobs.",
    "This first snippet lays out the ingredients. x is our input data, four numbers. y is the true output, computed as 2 * x — but the model doesn't get to see that rule; it only sees the input-output pairs and must infer the relationship. w = 0.0 is our deliberately-wrong starting guess for the knob, and lr = 0.01 is the learning rate, the step size from post 3.\n\nNotice what the model 'knows' and doesn't. It knows the inputs and the correct outputs (its training data); it does *not* know the rule connecting them — that's what it's trying to learn. Starting w at zero guarantees it begins wrong, so we can watch it improve. And the learning rate is set small and sensible; later we'll see what happens when it's not. These four lines are the entire problem setup — data, a wrong guess, and a step size.",
    "Here's one pass of the first two loop steps from post 3. The prediction is w * x — the model applies its current knob to the inputs. The loss is the mean squared error: the average of the squared differences between predictions and true answers. Printing it shows 30.0 — a big number, because with w = 0 every prediction is zero and badly wrong.\n\nThis is the forward pass and the loss computation made concrete. Squaring the errors does two useful things: it makes all errors positive (so they don't cancel out) and it punishes big misses more than small ones. The single number 30.0 is the model's entire feedback signal — its measure of 'how wrong am I right now?'. The whole rest of the process exists to drive that number down. Watch it: 30.0 now, near zero by the end.",
    "This snippet is the heart of learning: the gradient and the step. The gradient line computes which way the loss changes as w changes — the downhill direction from post 3. The update, w = w - lr * grad, moves w a small step in that downhill direction. After one step, w has gone from 0 to about 0.3 — small, but unmistakably moving toward the target of 2.\n\nDon't worry about deriving the gradient formula (that's Week 2's calculus); focus on what it does. It senses the slope of the loss with respect to the knob, and the update nudges the knob downhill. That minus sign is crucial — we move *against* the gradient because we want to go down, not up. This single step is the entire learning mechanism in miniature. Everything else is just doing this over and over, which is exactly the next slide.",
    "This is where it all comes together: wrap the gradient-and-step in a loop that runs 1000 times, and the model learns. Each iteration recomputes the downhill direction from the current w and takes another small step. We don't even print inside the loop — we just let it run and check the result at the end: w is now 2.0, the true rule.\n\nThis is the complete training loop from post 3, in four lines. The model started knowing nothing about the relationship, made a terrible guess, and — guided solely by repeatedly measuring its own error and stepping downhill — discovered that y = 2x. No one told it the answer; it found it. That's not a metaphor for learning, it *is* learning, in its most stripped-down form. Every trained model you've ever heard of does fundamentally this, with more knobs and more steps.",
    "This slide steps back to register what just happened, because it's genuinely remarkable. A knob that started at 0, with no knowledge of the rule, crawled to exactly 2.0 — guided by nothing but its own measured wrongness — while the loss melted from 30 to near zero. The model discovered the underlying pattern through pure error-correction.\n\nThis is the moment the whole week's intuition pays off. 'The model learned it' is no longer a magic phrase; you just watched the mechanism, line by line. There was no understanding, no insight — just a number stepping downhill on a wrongness landscape until it landed at the answer. Internalising this concrete example is worth more than any amount of abstract description, because now when you hear about models 'learning' anything, you have a real, mechanical picture of what that word denotes.",
    "Having built the loop by hand, this snippet shows the way you'd actually do it in practice: scikit-learn's LinearRegression, fit in a single line, which returns a coefficient of 2.0 — the identical answer. The library ran the same kind of optimisation we wrote by hand, just faster, more robustly, and with far less code.\n\nThe pairing is intentional and important. The from-scratch version is for *understanding* — it makes the loop visible so you know what's happening. The library version is for *doing* — it's optimised, battle-tested, and what you'll use in real work. Neither is 'better'; they serve different purposes. The danger is using libraries without ever understanding the loop, which leaves you helpless when training misbehaves. Build it once by hand, then let the library run it for the rest of your career, confident you know what's inside.",
    "These tips frame the relationship between the two versions you just saw. From scratch: you see the loop, which is unbeatable for learning and for building real intuition. Library: optimised, robust, and what you'll reach for in practice. Both do the identical thing — minimise loss — so neither is more 'real' than the other.\n\nThe guiding principle is 'understand the loop, then let the library run it'. This is the healthy relationship with abstraction in general: you build something by hand once to understand it, then use the well-engineered tool forever after, but with the understanding that lets you debug it when it breaks. Engineers who only ever call .fit() are fine until something goes wrong, at which point the loop they never learned becomes the thing they desperately need. You've now built it, so you'll never be in that position.",
    "The mistakes slide makes the learning-rate warning from post 3 tangible: change lr from 0.01 to 1.0 in that loop, and instead of settling at 2, w shoots off toward infinity. The steps are now so large they overshoot the valley floor every time, bouncing higher and higher — the loss diverges instead of converging.\n\nThis is the single most common 'my training broke' bug, and you can now reproduce it and see exactly why it happens. It's not mysterious: too big a step in the downhill direction overshoots the bottom, lands somewhere worse, and the next overshoot is bigger still. The fix is simply a smaller learning rate. Having watched both the working version (lr = 0.01, converges to 2) and the broken one (lr = 1.0, diverges), you now own a piece of debugging intuition that will save you real time when a future model refuses to learn.",
    "So learning is runnable, not magic: data plus a wrong guess, predict and measure the loss, find the slope and step downhill, loop until it converges — and a library does the same in one line. Save the snippets; building this once is the surest way to truly understand training. And note the learning-rate lesson — it's the bug you'll hit most.\n\nTomorrow closes Day 7 with the five mistakes that quietly wreck a model's learning — overfitting, leakage, and friends — the traps that make a model look brilliant in training and fail in the real world. After that, Week 2 opens with the math this all rests on, starting with linear algebra."
  ],
  '7-5': [
    "Welcome to the final post of Day 7 — and of Week 1. We've seen how models learn, why that matters, the training loop in detail, and learning in live code. Now we cover the ways learning goes wrong, because a model that minimises its loss beautifully can still be completely useless if it learned the wrong thing.\n\nThese five mistakes share a single, dangerous signature: the training numbers look great while real-world performance quietly falls apart. That gap — impressive in the lab, broken in the wild — is the defining failure mode of machine learning, and recognising its causes is what separates a deployable model from a misleading demo. Treat this as the checklist that keeps your training honest.",
    "The framing sets up all five mistakes: learning can fail quietly. A model can drive its loss down to near zero and still be worthless, because low loss on the training data only proves it fit *that data* — not that it learned the real, generalisable pattern. The numbers can look like success while masking failure.\n\nThis is the trap that catches beginners over and over, because it's counterintuitive. You worked hard, the loss dropped, the accuracy is high — surely that's good? Not necessarily. The whole point of post 1's memorising-versus-generalising distinction returns here: a model that memorised its training data shows excellent training numbers and dismal real-world results. These five mistakes are the specific mechanisms by which that quiet failure happens, and each has a tell and a fix.",
    "Mistake one, overfitting, is the most important failure mode in all of machine learning. The model memorises its training data — including the random noise and quirks specific to that particular dataset — instead of the underlying pattern. The result: near-perfect training scores and poor performance on anything new.\n\nThe student analogy nails it: overfitting is memorising the answer key rather than understanding the subject. Ace the exact questions you studied, fail any variation. This connects directly to post 1's memorise-versus-generalise distinction — overfitting is memorising winning when you wanted generalising. It happens when a model is too complex for the amount of data, or trained too long, so it has the capacity and opportunity to fit noise. It's so central that recognising its signature — great on train, bad on test — is a core ML skill.",
    "Mistake two, underfitting, is overfitting's mirror image. Here the model is too simple, or trained too briefly, to capture the pattern at all — so it performs poorly even on the training data it was supposed to learn. It didn't memorise too much; it learned too little.\n\nThe contrast is clarifying: underfitting is a model that hasn't learned enough, while overfitting is one that 'learned' the wrong things (the noise). Both fail to generalise, but for opposite reasons and with opposite fixes. Underfitting shows up as mediocre performance everywhere — train and test alike — which is actually easier to spot than overfitting's deceptive train-test gap. The cure is more capacity, more features, or more training, whereas overfitting needs the opposite. Knowing which one you have tells you which direction to move, and confusing them sends you the wrong way.",
    "Mistake three, data leakage, is the silent killer because it produces fantastic results that are entirely fake. Leakage happens when information from the answer sneaks into the inputs — the classic example being a 'date_paid' column used to predict who will pay. Of course the model is accurate: it's effectively peeking at the answer.\n\nThe devastating part is the timing of the collapse. The model looks magically good in testing, so you ship it confidently — and then it fails in production, because the leaky clue won't exist at actual prediction time (you can't know the payment date before the payment happens). Leakage is insidious precisely because it masquerades as success right up until deployment. The defence is a single sharp question, in the fixes slide: 'would I actually have this information at the moment I need to predict?'.",
    "Mistake four, no train/test split, is the most basic error and still alarmingly common. If you evaluate the model on the same data it trained on, of course it scores well — it has already seen those exact answers. You've measured memorisation, not skill, and the number is meaningless.\n\nThe fix is foundational to all of machine learning: hold out a portion of data the model never trains on, and judge it only on that unseen set. This is the entire reason the train/test split exists — it's the one honest way to estimate how the model will do on the new data it'll face in the real world. Skip it and every accuracy figure you report is a lie, not because you're dishonest but because you're measuring the wrong thing. This split is non-negotiable; it's the bedrock of trustworthy evaluation.",
    "Mistake five, trusting training accuracy, is the thread tying the others together. Training accuracy measures how well the model memorised data it has already seen — which tells you almost nothing about whether it learned a useful, generalisable pattern. A model boasting 99% on its training data may be brilliant or may be hopelessly overfit; the training number alone can't distinguish them.\n\nThe only number that matters is performance on unseen data — the held-out test set. That's the figure that estimates real-world skill, and it's the one to quote, watch, and optimise. Beginners get seduced by high training accuracy because it feels like achievement and it's the number that's easiest to produce. Discipline is reporting and trusting test performance instead. Whenever you see an impressive accuracy claim, the right reflex is to ask: 'on training data or on held-out data?' — because only one of those answers means anything.",
    "This comparison puts underfitting and overfitting side by side so their opposite natures are unmistakable. Underfit: too simple, misses the pattern, performs badly on both training and test data, fixed by adding power or training longer. Overfit: too complex, memorises noise, great on training but bad on test, fixed by more data or a simpler model.\n\nThe single most useful diagnostic is the train-versus-test gap. Bad on both? Underfitting — the model never learned enough. Great on train but bad on test? Overfitting — it memorised instead of generalising. That gap is your compass, and it points to opposite fixes, which is why diagnosing correctly matters so much: adding complexity cures underfitting but worsens overfitting, and vice versa. Most of practical model-tuning is reading this gap and moving in the right direction along the underfit-overfit spectrum toward the sweet spot in between.",
    "The fixes pull all five mistakes into an actionable checklist. Always split data into train and test (and ideally a validation set too) — the foundation of honest evaluation. Judge only on data the model never saw. Hunt for leakage with the question 'would I have this clue at prediction time?'. If overfitting, add data, simplify the model, or apply regularisation. If underfitting, add features or capacity, or train longer.\n\nNotice these fixes come in opposite pairs because the mistakes do — which is the whole point. Effective model development is largely the disciplined application of this checklist: split honestly, evaluate on unseen data, watch for leakage, diagnose the train-test gap, and move along the complexity spectrum toward the sweet spot. None of it requires advanced math — just the rigour to test honestly and the intuition, built across this week, to read what the results are telling you.",
    "That closes Day 7 and Week 1. You now understand how models learn (guess-measure-adjust), why it matters, the training loop in detail, learning in live code, and the five ways it quietly goes wrong. Save this checklist — overfitting and leakage will be lifelong companions, and catching them early is what makes a model deployable.\n\nTomorrow opens Week 2: the math that all of this rests on, starting with Linear Algebra for ML. Don't worry — we approach it the same way, intuition first. You've spent a week learning what models do and how they learn; now you'll meet the language, vectors and matrices, in which that learning is actually written."
  ],
};

// ---- merge & write ---------------------------------------------------------
for (const k of Object.keys(posts)) content[k] = posts[k];
for (const k of Object.keys(details)) detail[k] = details[k];

fs.writeFileSync(CONTENT, JSON.stringify(content, null, 2) + '\n', 'utf8');
fs.writeFileSync(DETAIL,  JSON.stringify(detail,  null, 2) + '\n', 'utf8');

let slideCount = 0, detailCount = 0;
for (const k of Object.keys(posts)) slideCount += posts[k].slides.length;
for (const k of Object.keys(details)) detailCount += details[k].length;
console.log('Day 7: added', Object.keys(posts).length, 'posts,', slideCount, 'slides,', detailCount, 'detail entries.');
