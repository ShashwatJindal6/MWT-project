const STORAGE_KEY = "l3_preloader_seen";

const items = document.querySelectorAll(".item");
const track = document.querySelector(".track");
const loader = document.querySelector(".preloader");

function removeLoader() {
  if (loader) loader.remove();
}

function finishPreloader(animated) {
  if (!loader) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch (e) {}

  if (!animated) {
    removeLoader();
    return;
  }

  loader.style.transition = "opacity 1s ease";
  loader.style.opacity = "0";
  setTimeout(removeLoader, 1000);
}

let index = 0;
const itemHeight = 80;
const readTime = 1000;

function step() {
  if (index > 0) items[index - 1].classList.remove("active");

  if (index >= items.length) {
    finishPreloader(true);
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

function init() {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      finishPreloader(false);
      return;
    }
  } catch (e) {
  }

  window.addEventListener("load", () => {
    step();
  });
}

init();
