

const themeBtn = document.getElementById("themeBtn");


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");


  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});



const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("show");
});


let speechToken = 0;

function speakSequence(steps, rate = 0.85) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const token = ++speechToken; 
  let index = 0;

  function next() {
    if (token !== speechToken || index >= steps.length) return;
    const step = steps[index++];
    if (typeof step === "number") {
      setTimeout(next, step);
      return;
    }
    const message = new SpeechSynthesisUtterance(step);
    message.rate = rate;
    message.onend = next;
    message.onerror = next;
    window.speechSynthesis.speak(message);
  }
  next();
}
