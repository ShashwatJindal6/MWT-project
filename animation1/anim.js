const words = document.querySelectorAll(".word");
const lines = document.querySelectorAll(".line");
const textArea = document.querySelector(".text-area");

function animateLineWithWord(lineIndex) {
  if (lineIndex >= lines.length) return;

  const line = lines[lineIndex];
  const word = words[lineIndex];

  line.classList.add("show");

  if (word) {
    const target = document.getElementById(word.dataset.target);

    setTimeout(() => {
      const wordRect = word.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const dx = targetRect.left - wordRect.left;
      const dy = targetRect.top - wordRect.top;

      word.style.transform = `translate(${dx}px, ${dy}px)`;
      word.style.opacity = "0";

      setTimeout(() => {
        target.textContent = word.textContent;
        target.classList.add("filled");
        word.style.visibility = "hidden";
      }, 400);

    }, 100);
  }

  setTimeout(() => {
    animateLineWithWord(lineIndex + 1);
  }, 800);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    textArea.classList.remove("hidden");

    setTimeout(() => {
      animateLineWithWord(0);
    }, 5000);

  }, 10000);
});