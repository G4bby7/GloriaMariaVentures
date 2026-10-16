
const lessonRoot = document.getElementById("lessonList");
const lessonPanel = document.getElementById("lessonDetails");
const lessonColors = ["red", "orange", "yellow", "green", "blue", "purple"];
const LESSON_PAUSE = 500; // 0.5 second pagitan

function lessonTone(frequency = 520) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = "sine"; osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
    osc.onended = () => ctx.close();
  } catch (error) { /* Audio may be unavailable. */ }
}

function sayLesson(item) {
  lessonTone();
  
  speakSequence([item.name, LESSON_PAUSE, item.say], 0.85);
}

function showLesson(item) {
  lessonPanel.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = `${item.name} ${item.emoji}`;
  const text = document.createElement("p");
  text.className = "big-count";
  text.textContent = item.say;
  const hear = document.createElement("button");
  hear.type = "button";
  hear.className = "btn btn-orange";
  hear.textContent = `🔊 Hear ${item.name}`;
  hear.addEventListener("click", () => sayLesson(item));
  lessonPanel.append(title, text, hear);
  sayLesson(item);
}

function renderLessons() {
  lessonRoot.replaceChildren();
  window.LESSON.groups.forEach(group => {
    if (group.title) {
      const heading = document.createElement("h2");
      heading.textContent = group.title;
      lessonRoot.appendChild(heading);
    }
    const grid = document.createElement("div");
    grid.className = "lesson-grid";
    group.items.forEach((item, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "lesson-card interactive-card";
      card.setAttribute("aria-label", `${item.name}. Click to hear.`);
      const bg = item.hex ? ` style="background:${item.hex};${item.hex === "#ffffff" ? "color:#333;" : ""}"` : "";
      card.innerHTML = `<div class="lesson-top ${lessonColors[index % lessonColors.length]}"${bg}>${item.emoji}</div><div class="lesson-bottom"><p class="word">${item.name}</p><p class="example-hint">Click to hear</p></div>`;
      card.addEventListener("click", () => showLesson(item));
      grid.appendChild(card);
    });
    lessonRoot.appendChild(grid);
  });
}
renderLessons();
