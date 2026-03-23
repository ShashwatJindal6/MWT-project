(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cats = Array.from(document.querySelectorAll(".l3-cat"));
  const previewImage = document.getElementById("l3-previewImage");
  const previewTitle = document.getElementById("l3-previewTitle");
  const previewSubtitle = document.getElementById("l3-previewSubtitle");

  const clearBtn = document.getElementById("l3-clearBtn");
  const viewBtn = document.getElementById("l3-viewBtn");
  const selectedCountEl = document.getElementById("l3-selectedCount");

  const countsEls = Array.from(document.querySelectorAll("[data-count-for]"));

  const categories = {
    development: {
      title: "Development",
      subtitle: "Practical fundamentals with crisp structure and confidence-building exercises.",
      accent: "#d4af37",
      img: buildSvg("Development", "#d4af37", "#07070a")
    },
    webdev: {
      title: "Web Development",
      subtitle: "Modern web skills: layout, interactive UI, and clean API integration.",
      accent: "#f4d77a",
      img: buildSvg("Web Development", "#f4d77a", "#07070a")
    },
    ai: {
      title: "Artificial Intelligence",
      subtitle: "Learn core concepts and build intuition for ML, deep learning, and beyond.",
      accent: "#d4af37",
      img: buildSvg("AI", "#d4af37", "#07070a")
    },
    devops: {
      title: "DevOps",
      subtitle: "Ship reliably with pipelines, containers, and operational clarity.",
      accent: "#f4d77a",
      img: buildSvg("DevOps", "#f4d77a", "#07070a")
    },
    aws: {
      title: "AWS Services",
      subtitle: "From IAM to compute and storage—structured cloud skills you can apply.",
      accent: "#d4af37",
      img: buildSvg("AWS", "#d4af37", "#07070a")
    }
  };

  function buildSvg(label, accent, bg) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${accent}" stop-opacity="1"/>
            <stop offset="1" stop-color="${accent}" stop-opacity="0.25"/>
          </linearGradient>
          <radialGradient id="r" cx="25%" cy="10%" r="70%">
            <stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>
            <stop offset="1" stop-color="${bg}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="520" rx="26" fill="${bg}"/>
        <rect width="1200" height="520" rx="26" fill="url(#r)"/>
        <rect x="70" y="70" width="1060" height="380" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(212,175,55,0.20)"/>
        <path d="M160 340 C 280 250, 420 420, 560 320 S 850 210, 1040 300" fill="none" stroke="url(#g)" stroke-width="10" stroke-linecap="round"/>
        <text x="96" y="170" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="44" font-weight="800" fill="rgba(255,255,255,0.95)">${escapeXml(label)}</text>
        <text x="96" y="228" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="20" font-weight="600" fill="rgba(255,255,255,0.70)">Hover to preview • Select to build your roadmap</text>
        <circle cx="1075" cy="145" r="16" fill="${accent}" opacity="0.95"/>
        <circle cx="1035" cy="185" r="8" fill="${accent}" opacity="0.55"/>
      </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function escapeXml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }

  function setPreview(categoryKey) {
    const c = categories[categoryKey];
    if (!c) return;

    previewTitle.textContent = c.title;
    previewSubtitle.textContent = c.subtitle;

    if (!prefersReduced) {
      previewImage.style.opacity = "0";
      previewImage.style.transition = "opacity 160ms var(--l3-ease)";
      setTimeout(() => {
        previewImage.src = c.img;
        previewImage.alt = `${c.title} course preview image`;
        previewImage.style.opacity = "1";
      }, 140);
    } else {
      previewImage.src = c.img;
      previewImage.alt = `${c.title} course preview image`;
    }
  }

  function updateCounts() {
    const checkboxes = Array.from(document.querySelectorAll(".l3-course"));
    const selected = checkboxes.filter((cb) => cb.checked);

    selectedCountEl.textContent = String(selected.length);

    const byCategory = new Map();
    for (const cb of selected) {
      const k = cb.dataset.category;
      byCategory.set(k, (byCategory.get(k) || 0) + 1);
    }

    for (const el of countsEls) {
      const key = el.getAttribute("data-count-for");
      const n = byCategory.get(key) || 0;
      el.textContent = `${n} selected`;
    }

    viewBtn.disabled = selected.length === 0;
  }

  cats.forEach((cat) => {
    const key = cat.dataset.category;
    const btn = cat.querySelector(".l3-cat__btn");
    const panel = cat.querySelector(".l3-cat__panel");

    btn.addEventListener("click", () => {
      const isOpen = cat.classList.contains("is-open");
      cat.classList.toggle("is-open", !isOpen);

      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.setAttribute("aria-hidden", String(isOpen));
    });

    cat.addEventListener("mouseenter", () => setPreview(key));
    cat.addEventListener("focusin", () => setPreview(key));
  });

  document.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains("l3-course")) return;
    updateCounts();
  });

  // Clear / view actions
  clearBtn.addEventListener("click", () => {
    document.querySelectorAll(".l3-course").forEach((cb) => {
      cb.checked = false;
    });
    updateCounts();
  });

  viewBtn.addEventListener("click", () => {
    const selected = Array.from(document.querySelectorAll(".l3-course:checked")).map((cb) => cb.value);
    // Production option: redirect with query string, or route to a “roadmap” page.
    // Keeping it minimal and safe:
    alert(`Your roadmap:\n\n${selected.join("\n")}`);
  });

  setPreview("development");
  updateCounts();
})();