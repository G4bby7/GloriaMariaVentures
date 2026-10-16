// ABC lessons: examples, sounds, filters, and vowel/consonant word search.
const letterList = document.getElementById("letterList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const countText = document.getElementById("countText");
const searchResult = document.getElementById("searchResult");
const exampleDetails = document.getElementById("exampleDetails");
const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
const vowels = "AEIOU";
let currentFilter = "all";
const letters = [
 {letter:"A",word:"Apple",emoji:"🍎",examples:[["Apple","🍎"],["Ant","🐜"],["Airplane","✈️"],["Alligator","🐊"]]},
 {letter:"B",word:"Ball",emoji:"⚽",examples:[["Ball","⚽"],["Book","📘"],["Bear","🐻"],["Banana","🍌"]]},
 {letter:"C",word:"Cat",emoji:"🐱",examples:[["Cat","🐱"],["Cake","🎂"],["Car","🚗"],["Cloud","☁️"]]},
 {letter:"D",word:"Dog",emoji:"🐶",examples:[["Dog","🐶"],["Duck","🦆"],["Drum","🥁"],["Dolphin","🐬"]]},
 {letter:"E",word:"Egg",emoji:"🥚",examples:[["Egg","🥚"],["Elephant","🐘"],["Eagle","🦅"],["Engine","🚂"]]},
 {letter:"F",word:"Fish",emoji:"🐟",examples:[["Fish","🐟"],["Flower","🌼"],["Frog","🐸"],["Fire truck","🚒"]]},
 {letter:"G",word:"Grapes",emoji:"🍇",examples:[["Grapes","🍇"],["Goat","🐐"],["Guitar","🎸"],["Gift","🎁"]]},
 {letter:"H",word:"Hat",emoji:"🎩",examples:[["Hat","🎩"],["House","🏠"],["Horse","🐴"],["Heart","❤️"]]},
 {letter:"I",word:"Ice cream",emoji:"🍦",examples:[["Ice cream","🍦"],["Igloo","🧊"],["Insect","🐞"],["Island","🏝️"]]},
 {letter:"J",word:"Juice",emoji:"🧃",examples:[["Juice","🧃"],["Jam","🍓"],["Jet","✈️"],["Jellyfish","🪼"]]},
 {letter:"K",word:"Kite",emoji:"🪁",examples:[["Kite","🪁"],["Kangaroo","🦘"],["Key","🔑"],["Koala","🐨"]]},
 {letter:"L",word:"Lion",emoji:"🦁",examples:[["Lion","🦁"],["Leaf","🍃"],["Lemon","🍋"],["Lollipop","🍭"]]},
 {letter:"M",word:"Moon",emoji:"🌙",examples:[["Moon","🌙"],["Monkey","🐒"],["Milk","🥛"],["Mountain","⛰️"]]},
 {letter:"N",word:"Nose",emoji:"👃",examples:[["Nose","👃"],["Nest","🪺"],["Noodle","🍜"],["Nurse","🧑‍⚕️"]]},
 {letter:"O",word:"Orange",emoji:"🍊",examples:[["Orange","🍊"],["Owl","🦉"],["Octopus","🐙"],["Oven","♨️"]]},
 {letter:"P",word:"Pig",emoji:"🐷",examples:[["Pig","🐷"],["Pizza","🍕"],["Pencil","✏️"],["Penguin","🐧"]]},
 {letter:"Q",word:"Queen",emoji:"👸",examples:[["Queen","👸"],["Quilt","🛏️"],["Question","❓"],["Quail","🐦"]]},
 {letter:"R",word:"Rainbow",emoji:"🌈",examples:[["Rainbow","🌈"],["Rabbit","🐰"],["Robot","🤖"],["Rocket","🚀"]]},
 {letter:"S",word:"Sun",emoji:"☀️",examples:[["Sun","☀️"],["Star","⭐"],["Snake","🐍"],["Sandwich","🥪"]]},
 {letter:"T",word:"Tree",emoji:"🌳",examples:[["Tree","🌳"],["Tiger","🐯"],["Train","🚆"],["Turtle","🐢"]]},
 {letter:"U",word:"Umbrella",emoji:"☂️",examples:[["Umbrella","☂️"],["Unicorn","🦄"],["Uniform","🥋"],["UFO","🛸"]]},
 {letter:"V",word:"Violin",emoji:"🎻",examples:[["Violin","🎻"],["Van","🚐"],["Volcano","🌋"],["Vegetables","🥦"]]},
 {letter:"W",word:"Watermelon",emoji:"🍉",examples:[["Watermelon","🍉"],["Whale","🐳"],["Watch","⌚"],["Window","🪟"]]},
 {letter:"X",word:"Xylophone",emoji:"🎶",examples:[["Xylophone","🎶"],["X-ray","🩻"],["Xerus","🐿️"],["Xmas tree","🎄"]]},
 {letter:"Y",word:"Yo-yo",emoji:"🪀",examples:[["Yo-yo","🪀"],["Yak","🐂"],["Yacht","🛥️"],["Yogurt","🥣"]]},
 {letter:"Z",word:"Zebra",emoji:"🦓",examples:[["Zebra","🦓"],["Zoo","🦒"],["Zipper","🤐"],["Zero","0️⃣"]]}
];
function playTone(frequency = 520) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + 0.2);
    oscillator.onended = () => ctx.close();
  } catch (error) { /* Audio may be unavailable in some browsers. */ }
}
const LETTER_PAUSE = 500; 
function speak(...steps) {
  playTone();
  speakSequence(steps, 0.82);
}
function analyzeSearch(value) {
  if (!searchResult) return;
  const clean = value.trim();
  if (!clean) {
    searchResult.textContent = "Search any word (example: banana) to identify its first letter and see all vowels and consonants.";
    return;
  }
  const chars = clean.toUpperCase().match(/[A-Z]/g) || [];
  if (!chars.length) {
    searchResult.textContent = "Please enter a word or letter that contains A–Z.";
    return;
  }
  const first = chars[0];
  const kind = vowels.includes(first) ? "vowel" : "consonant";
  const vowelLetters = chars.filter(char => vowels.includes(char));
  const consonantLetters = chars.filter(char => !vowels.includes(char));
  searchResult.replaceChildren();
  const heading = document.createElement("p");
  heading.append(document.createTextNode(`“${clean}” starts with ${first}. `));
  const result = document.createElement("strong");
  result.className = `${kind}-text`;
  result.textContent = kind.toUpperCase();
  heading.append(result);
  const breakdown = document.createElement("p");
  breakdown.textContent = `Vowels: ${vowelLetters.join(", ") || "None"} | Consonants: ${consonantLetters.join(", ") || "None"}`;
  searchResult.append(heading, breakdown);
}
function showExamples(item) {
  const kind = vowels.includes(item.letter) ? "vowel" : "consonant";
  exampleDetails.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = `Letter ${item.letter} ${item.letter.toLowerCase()}`;
  const type = document.createElement("p");
  type.textContent = `${item.letter} is a ${kind}. Choose an example to hear it.`;
  const grid = document.createElement("div");
  grid.className = "example-word-grid";
  item.examples.forEach(([word, emoji]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-word";
    button.innerHTML = `<span class="example-emoji">${emoji}</span><span>${word}</span><span class="sound-label">🔊 Hear word</span>`;
    button.addEventListener("click", () => speak(item.letter, LETTER_PAUSE, word, `${word} starts with ${item.letter}.`));
    grid.appendChild(button);
  });
  const repeat = document.createElement("button");
  repeat.type = "button";
  repeat.className = "btn btn-orange example-repeat";
  repeat.textContent = `🔊 Hear letter ${item.letter}`;
  repeat.addEventListener("click", () => speak(item.letter, LETTER_PAUSE, `${item.letter} is for ${item.examples.map(example => example[0]).join(", ")}.`));
  exampleDetails.append(title, type, grid, repeat);
  speak(item.letter, LETTER_PAUSE, item.word, LETTER_PAUSE, kind);
}
function showLetters() {
  const search = searchInput.value.trim().toLowerCase();
  letterList.replaceChildren();
  let count = 0;
  letters.forEach((item, index) => {
    const isVowel = vowels.includes(item.letter);
    if (currentFilter === "vowel" && !isVowel) return;
    if (currentFilter === "consonant" && isVowel) return;
    // A word search classifies any word; card filtering matches letters or known examples.
    const matches = !search || item.letter.toLowerCase() === search || item.word.toLowerCase().includes(search) || item.examples.some(example => example[0].toLowerCase().includes(search));
    if (!matches && search.length === 1 && /^[a-z]$/.test(search)) return;
    if (!matches && search.length > 1) return;
    count++;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "lesson-card interactive-card";
    card.setAttribute("aria-label", `Letter ${item.letter}, ${isVowel ? "vowel" : "consonant"}, click to see examples`);
    card.innerHTML = `<div class="lesson-top ${colors[index % colors.length]}">${item.letter}${item.letter.toLowerCase()}</div><span class="${isVowel ? "vowel-badge" : "consonant-badge"}">${isVowel ? "Vowel" : "Consonant"}</span><div class="lesson-bottom"><span class="emoji">${item.emoji}</span><p class="word">${item.word}</p><p class="example-hint">Click for 4 examples and sound</p></div>`;
    card.addEventListener("click", () => showExamples(item));
    letterList.appendChild(card);
  });
  countText.textContent = `Letters shown: ${count} of 26`;
  if (!count) {
    const message = document.createElement("p");
    message.textContent = "No matching lesson cards. The word checker above still identifies the vowels and consonants in your search.";
    letterList.appendChild(message);
  }
  analyzeSearch(searchInput.value);
}
searchInput.addEventListener("input", showLetters);
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  currentFilter = button.dataset.filter;
  showLetters();
}));
showLetters();
