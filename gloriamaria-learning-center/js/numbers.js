// Number lessons: examples, spoken numbers, sound effects, and a small quiz.
const numberList = document.getElementById("numberList");
const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
const numberExamples = [
 {number:1,word:"One",emoji:"⭐",examples:["🍎","⚽","🐱","🌼"]},
 {number:2,word:"Two",emoji:"🐤",examples:["👀","👟","🍐","🦋"]},
 {number:3,word:"Three",emoji:"🍓",examples:["🚗","🍪","🐸","🎈"]},
 {number:4,word:"Four",emoji:"🍩",examples:["🦋","🐟","🍓","🚀"]},
 {number:5,word:"Five",emoji:"🐟",examples:["⭐","🍎","🌸","🎁"]},
 {number:6,word:"Six",emoji:"🌸",examples:["🍌","🐝","🎾","🐢"]},
 {number:7,word:"Seven",emoji:"🍪",examples:["🌈","🐞","🍬","🧸"]},
 {number:8,word:"Eight",emoji:"🚗",examples:["🐙","🍇","✏️","🦆"]},
 {number:9,word:"Nine",emoji:"🦋",examples:["🎈","🍓","🐠","🌟"]},
 {number:10,word:"Ten",emoji:"🎈",examples:["🍎","⭐","🐣","🍭"]}
];
function playNumberSound(text, number = 1) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx(), oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 360 + number * 35;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.22);
      oscillator.onended = () => ctx.close();
    }
  } catch (error) { /* Audio may be unavailable. */ }
  speakSequence(Array.isArray(text) ? text : [text], 0.85);
}
// Bibilang mula 1 hanggang sa number. Halimbawa 3 -> "1", pause, "2", pause, "3"
const COUNT_PAUSE = 500; // 0.5 second sa pagitan ng bawat bilang
function countSteps(total) {
  const steps = [];
  for (let i = 1; i <= total; i++) {
    steps.push(String(i));
    if (i < total) steps.push(COUNT_PAUSE);
  }
  return steps;
}
function showNumberDetails(item) {
  const panel = document.getElementById("numberDetails");
  panel.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = `Let's count ${item.word.toLowerCase()}!`;
  const big = document.createElement("p");
  big.className = "big-count";
  big.textContent = Array.from({length:item.number}, (_, i) => item.examples[i % item.examples.length]).join(" ");
  const count = document.createElement("p");
  count.textContent = `Number: ${item.number} | Word: ${item.word}`;
  const steps = document.createElement("p");
  steps.className = "count-steps";
  steps.textContent = `Count aloud: ${Array.from({length:item.number}, (_, i) => i + 1).join(" · ")}`;
  const examples = document.createElement("p");
  examples.textContent = `Try these examples: ${item.examples.join(" ")}`;
  const hear = document.createElement("button");
  hear.type = "button";
  hear.className = "btn btn-orange";
  hear.textContent = `🔊 Hear ${item.word}`;
  hear.addEventListener("click", () => playNumberSound([String(item.number), COUNT_PAUSE, ...countSteps(item.number), COUNT_PAUSE, `${item.word}!`], item.number));
  panel.append(title, big, count, steps, examples, hear);
  playNumberSound([String(item.number), COUNT_PAUSE, ...countSteps(item.number), COUNT_PAUSE, `${item.word}!`], item.number);
}
function renderNumbers() {
  numberList.replaceChildren();
  numberExamples.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "lesson-card interactive-card";
    card.setAttribute("aria-label", `Number ${item.number}, ${item.word}. Click to count and hear.`);
    card.innerHTML = `<div class="lesson-top ${colors[index % colors.length]}">${item.number}</div><div class="lesson-bottom"><p class="word">${item.word}</p><p class="emoji">${item.emoji.repeat(Math.min(item.number, 10))}</p><p class="example-hint">Click to count and hear</p></div>`;
    card.addEventListener("click", () => showNumberDetails(item));
    numberList.appendChild(card);
  });
}
// Number challenge
const startQuiz = document.getElementById("startNumberQuiz");
const numberQuestion = document.getElementById("numberQuestion");
const numberChoices = document.getElementById("numberChoices");
const numberFeedback = document.getElementById("numberFeedback");
const numberScore = document.getElementById("numberScore");
let quizAnswer = null;
let score = 0;
function startNumberQuestion() {
  quizAnswer = Math.floor(Math.random() * 10) + 1;
  const item = numberExamples[quizAnswer - 1];
  numberQuestion.textContent = `Which number is ${item.word.toLowerCase()}? Count: ${item.emoji.repeat(Math.min(quizAnswer, 10))}`;
  numberChoices.replaceChildren();
  const choices = new Set([quizAnswer]);
  while (choices.size < 4) choices.add(Math.floor(Math.random() * 10) + 1);
  [...choices].sort(() => Math.random() - 0.5).forEach(number => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-choice";
    button.textContent = number;
    button.addEventListener("click", () => {
      if (quizAnswer === null) return;
      if (number === quizAnswer) {
        score++;
        numberFeedback.textContent = "🎉 Correct! Great counting!";
        playNumberSound("Correct! Great counting!", number);
      } else {
        numberFeedback.textContent = `Good try! The correct answer is ${quizAnswer}.`;
        playNumberSound([String(quizAnswer), COUNT_PAUSE, ...countSteps(quizAnswer), COUNT_PAUSE, item.word], quizAnswer);
      }
      numberScore.textContent = `Score: ${score}`;
      quizAnswer = null;
      numberChoices.querySelectorAll("button").forEach(choice => choice.disabled = true);
      startQuiz.textContent = "Next Question";
    });
    numberChoices.appendChild(button);
  });
  numberFeedback.textContent = "Choose the correct number.";
  playNumberSound(`Which number is ${item.word}?`, quizAnswer);
}
if (startQuiz) startQuiz.addEventListener("click", startNumberQuestion);
renderNumbers();
