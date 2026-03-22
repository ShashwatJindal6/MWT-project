const items = document.querySelectorAll(".item");
const track = document.querySelector(".track");
const loader = document.querySelector(".preloader");

let index = 0;
const itemHeight = 80;
const readTime = 1000;

function step() {
  if (index > 0) items[index - 1].classList.remove("active");

  if (index >= items.length) {
    end();
    return;
  }

  const y = -index * itemHeight;
  track.style.transition = "transform 1s cubic-bezier(.22,.61,.36,1)";
  track.style.transform = `translateY(${y}px)`;

  items[index].classList.add("active");

  setTimeout(() => {
    index++;
    step();
  }, 1000 + readTime);
}

function end() {
  loader.style.transition = "opacity 1s ease";
  loader.style.opacity = 0;
  setTimeout(() => loader.remove(), 1000);
}

window.addEventListener("load", () => {
  step();
});
