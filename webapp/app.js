const words = [];
let currentCardIndex = 0;
let isDetailsVisible = false;

const curatedWordData = {
  confidence: {
    usage: 'Use “confidence” to talk about believing in yourself or trusting that something will happen.',
    phrases: ['build confidence', 'gain confidence', 'confidence boost'],
    example: 'After weeks of practice, her pronunciation improved and her confidence soared.'
  },
  inspire: {
    usage: '“Inspire” is a verb used when something makes you excited to do or feel something positive.',
    phrases: ['inspire a team', 'feel inspired by', 'inspire creativity'],
    example: 'Great teachers inspire students to keep exploring new words every day.'
  },
  clarify: {
    usage: 'Use “clarify” when you want to make an explanation simpler or easier to understand.',
    phrases: ['clarify a point', 'clarify instructions', 'ask for clarification'],
    example: 'The teacher paused to clarify how to stress the first syllable of the word.'
  },
  perspective: {
    usage: '“Perspective” refers to a point of view or a way of thinking about something.',
    phrases: ['from another perspective', 'broaden your perspective', 'personal perspective'],
    example: 'Reading English novels gave him a fresh perspective on storytelling.'
  },
  routine: {
    usage: '“Routine” describes a regular habit or schedule that you follow.',
    phrases: ['daily routine', 'study routine', 'break the routine'],
    example: 'Adding a five-minute review to her routine made vocabulary stick.'
  },
  collaboration: {
    usage: 'Use “collaboration” to describe people working together on a shared goal.',
    phrases: ['effective collaboration', 'collaboration skills', 'collaboration tools'],
    example: 'Pair work encouraged collaboration and more confident speaking.'
  },
  resilience: {
    usage: '“Resilience” is the ability to recover quickly from challenges or stress.',
    phrases: ['build resilience', 'emotional resilience', 'remarkable resilience'],
    example: 'He showed resilience by trying difficult tongue twisters again and again.'
  },
  immerse: {
    usage: 'Use “immerse” when someone is deeply involved in an activity or environment.',
    phrases: ['immerse yourself in', 'immersive learning', 'fully immersed'],
    example: 'Listening to English songs helped her immerse herself in natural phrases.'
  },
  concise: {
    usage: '“Concise” means expressing ideas in a clear and brief way.',
    phrases: ['concise summary', 'concise answer', 'keep it concise'],
    example: 'The teacher asked for a concise definition to check understanding.'
  },
  adapt: {
    usage: 'Use “adapt” when someone changes behavior to fit a new situation.',
    phrases: ['adapt quickly', 'adapt to change', 'adapt your style'],
    example: 'Students adapt faster when they meet words in meaningful sentences.'
  }
};

const connectors = ['in academic writing', 'during presentations', 'in daily conversations', 'while traveling abroad', 'in classroom teamwork'];
const reasons = ['to express the idea clearly', 'to sound natural', 'to show confidence', 'to connect ideas smoothly', 'to emphasize your point'];
const situations = ['The teacher smiled as', 'During a group discussion,', 'On the school radio,', 'While preparing for exams,', 'After watching an English film,'];

function getWordData(term) {
  const key = term.toLowerCase();
  if (curatedWordData[key]) return curatedWordData[key];

  const article = /^[aeiou]/i.test(term) ? 'an' : 'a';
  const usage = `Use “${term}” ${randomFrom(connectors)} ${randomFrom(reasons)}.`;
  const phrases = [`${randomFrom(['strong', 'practical', 'creative', 'balanced'])} ${term}`, `make ${article} ${term} plan`, `${term} skills`];
  const example = `${randomFrom(situations)} she used “${term}” to make her idea memorable for the class.`;
  return { usage, phrases, example };
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function parseWords(text) {
  return [...new Set(text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z'-]/g, '').trim())
    .filter((w) => w.length > 1 && /[a-zA-Z]/.test(w))
  )].slice(0, 400);
}

function updateStats() {
  const phraseCount = words.reduce((sum, item) => sum + item.phrases.length, 0);
  document.getElementById('statWords').textContent = words.length;
  document.getElementById('statPhrases').textContent = phraseCount;
  document.getElementById('statExamples').textContent = words.length;
  document.getElementById('wordCountLabel').textContent = `${words.length} words`;
  if (!words.length) {
    document.getElementById('cardProgress').textContent = '0 / 0';
  } else {
    const total = words.length;
    document.getElementById('cardProgress').textContent = `${Math.min(currentCardIndex + 1, total)} / ${total}`;
  }
}

function renderWords(filter = '') {
  const list = document.getElementById('wordList');
  list.innerHTML = '';
  const trimmed = filter.trim().toLowerCase();
  const filteredWords = trimmed
    ? words.filter((item) => item.term.toLowerCase().includes(trimmed))
    : words;

  filteredWords.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'word-card';

    const heading = document.createElement('div');
    heading.className = 'word-header';

    const title = document.createElement('h4');
    title.className = 'word-title';
    title.textContent = item.term;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'Insight ready';

    heading.appendChild(title);
    heading.appendChild(badge);

    const usage = document.createElement('p');
    usage.className = 'micro';
    usage.textContent = item.usage;

    const phrases = document.createElement('ul');
    phrases.className = 'phrases';
    item.phrases.forEach((phrase) => {
      const li = document.createElement('li');
      li.textContent = phrase;
      phrases.appendChild(li);
    });

    const example = document.createElement('div');
    example.className = 'example';
    example.textContent = item.example;

    card.appendChild(heading);
    card.appendChild(usage);
    card.appendChild(phrases);
    card.appendChild(example);

    list.appendChild(card);
  });

  if (!filteredWords.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No words yet. Upload a file to get started.';
    list.appendChild(empty);
  }
}

function refreshCard() {
  const cardWord = document.getElementById('cardWord');
  const cardUsage = document.getElementById('cardUsage');
  const revealBtn = document.getElementById('revealDetails');
  const markKnown = document.getElementById('markKnown');
  const markReview = document.getElementById('markReview');

  if (!words.length) {
    cardWord.textContent = 'Load words to begin';
    cardUsage.textContent = 'Upload a list to generate instant insights and sample sentences for practice.';
    revealBtn.disabled = true;
    markKnown.disabled = true;
    markReview.disabled = true;
    return;
  }

  const current = words[currentCardIndex % words.length];
  cardWord.textContent = current.term;
  cardUsage.innerText = isDetailsVisible
    ? `${current.usage}\n\nPhrases: ${current.phrases.join(', ')}\nExample: ${current.example}`
    : 'Tap “Reveal details” to check usage, phrases, and an example sentence.';
  revealBtn.disabled = false;
  markKnown.disabled = false;
  markReview.disabled = false;
  updateStats();
}

async function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'txt') {
    const text = await file.text();
    ingestText(text);
  } else if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await window.mammoth.extractRawText({ arrayBuffer });
    ingestText(value);
  } else if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n';
    }
    ingestText(text);
  } else {
    alert('Please upload a .txt, .docx, or .pdf file.');
  }
}

function ingestText(text) {
  const parsed = parseWords(text);
  const existing = new Set(words.map((item) => item.term.toLowerCase()));
  parsed.forEach((term) => {
    if (!existing.has(term.toLowerCase())) {
      const data = getWordData(term);
      words.push({ term, ...data });
      existing.add(term.toLowerCase());
    }
  });
  currentCardIndex = 0;
  isDetailsVisible = false;
  renderWords();
  refreshCard();
}

function setupEvents() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const searchBox = document.getElementById('searchBox');

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#3b82f6';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--border)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border)';
    const [file] = e.dataTransfer.files;
    if (file) handleFile(file);
  });

  fileInput.addEventListener('change', (e) => {
    const [file] = e.target.files;
    if (file) handleFile(file);
  });

  searchBox.addEventListener('input', (e) => {
    renderWords(e.target.value);
  });

  document.getElementById('startPractice').addEventListener('click', () => {
    currentCardIndex = 0;
    isDetailsVisible = false;
    refreshCard();
  });

  document.getElementById('revealDetails').addEventListener('click', () => {
    isDetailsVisible = true;
    refreshCard();
  });

  document.getElementById('markKnown').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % Math.max(words.length, 1);
    isDetailsVisible = false;
    refreshCard();
  });

  document.getElementById('markReview').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % Math.max(words.length, 1);
    isDetailsVisible = false;
    refreshCard();
  });

  document.getElementById('clearWords').addEventListener('click', () => {
    words.splice(0, words.length);
    currentCardIndex = 0;
    isDetailsVisible = false;
    renderWords();
    refreshCard();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  renderWords();
  refreshCard();
});
