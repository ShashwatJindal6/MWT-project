/**
 * L3 Schools - Fuzzy Course Recommendation UI Controller
 * Wires the Mamdani Fuzzy Engine, course catalog, interactive sliders,
 * preset academic profiles, and explainability cards.
 */

(function () {
  "use strict";

  // Check dependencies
  const catalog = window.COURSE_CATALOG || [];
  const engine = window.FuzzyRecommendationEngine;

  if (!engine) {
    console.error("FuzzyRecommendationEngine not loaded.");
    return;
  }

  // DOM Elements
  const interestSlider = document.getElementById("l3-slider-interest");
  const interestVal = document.getElementById("l3-val-interest");
  const readinessSlider = document.getElementById("l3-slider-readiness");
  const readinessVal = document.getElementById("l3-val-readiness");
  const readinessQualifier = document.getElementById("l3-qualifier-readiness");
  const academicSlider = document.getElementById("l3-slider-academic");
  const academicVal = document.getElementById("l3-val-academic");
  const academicQualifier = document.getElementById("l3-qualifier-academic");
  const categorySelect = document.getElementById("l3-select-category");

  const resultsList = document.getElementById("l3-results-list");
  const resultsCount = document.getElementById("l3-results-count");
  const filterTabs = Array.from(document.querySelectorAll(".l3-filter-tab"));
  const presetBtns = Array.from(document.querySelectorAll(".l3-preset-btn"));

  // Viva membership display elements
  const vivaInterestBars = document.getElementById("l3-viva-interest-bars");
  const vivaReadinessBars = document.getElementById("l3-viva-readiness-bars");
  const vivaAcademicBars = document.getElementById("l3-viva-academic-bars");

  // State
  let currentDifficultyFilter = "all";
  let savedCourses = new Set();

  // Load saved roadmap from localStorage (compatible with courses.html)
  try {
    const raw = localStorage.getItem("l3_selected_courses");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedCourses = new Set(parsed);
      }
    }
  } catch (e) {
    console.warn("Could not read local roadmap", e);
  }

  // Preset Student Profiles for College Demonstrations & Viva
  const PRESET_PROFILES = {
    beginner: {
      interest: 9.0,
      skillReadiness: 1.5,
      academicPerformance: 65,
      category: "all",
      name: "Absolute Beginner"
    },
    sophomore: {
      interest: 8.5,
      skillReadiness: 5.5,
      academicPerformance: 78,
      category: "all",
      name: "CS Sophomore"
    },
    webdev: {
      interest: 9.0,
      skillReadiness: 5.0,
      academicPerformance: 70,
      category: "webdev",
      name: "Self-Taught Web Developer"
    },
    ai_aspirant: {
      interest: 9.5,
      skillReadiness: 8.5,
      academicPerformance: 92,
      category: "ai",
      name: "Advanced AI / Systems Aspirant"
    },
    transitioner: {
      interest: 7.5,
      skillReadiness: 1.0,
      academicPerformance: 55,
      category: "development",
      name: "Career Transitioner"
    }
  };

  function updateQualifiers(readiness, academic) {
    if (readiness <= 3.5) {
      readinessQualifier.textContent = "Novice / Foundational — Best for introductory modules";
    } else if (readiness <= 7.0) {
      readinessQualifier.textContent = "Intermediate / Competent — Ready for applied project courses";
    } else {
      readinessQualifier.textContent = "Advanced / Proficient — Ready for rigorous algorithms & architectures";
    }

    if (academic >= 80) {
      academicQualifier.textContent = "High Standing — Strong theoretical & problem-solving aptitude";
    } else if (academic >= 60) {
      academicQualifier.textContent = "Average Standing — Solid balance of concepts and application";
    } else {
      academicQualifier.textContent = "Foundational Standing — Needs pacing and structured exercises";
    }
  }

  function getStudentInputs() {
    return {
      interest: parseFloat(interestSlider.value),
      skillReadiness: parseFloat(readinessSlider.value),
      academicPerformance: parseFloat(academicSlider.value),
      category: categorySelect.value
    };
  }

  function renderVivaBars(fuzzyInputs) {
    if (!vivaInterestBars || !vivaReadinessBars || !vivaAcademicBars) return;

    function renderTermGroup(el, terms) {
      el.innerHTML = Object.entries(terms)
        .map(([term, val]) => {
          const pct = Math.round(val * 100);
          return `
            <div class="l3-membership-item">
              <span class="l3-membership-label">${term.charAt(0).toUpperCase() + term.slice(1)}</span>
              <div class="l3-membership-bar-wrap" aria-hidden="true">
                <div class="l3-membership-bar-fill" style="width: ${pct}%"></div>
              </div>
              <span class="l3-membership-val">${val.toFixed(2)}</span>
            </div>
          `;
        })
        .join("");
    }

    renderTermGroup(vivaInterestBars, {
      Low: fuzzyInputs.interest.low,
      Medium: fuzzyInputs.interest.medium,
      High: fuzzyInputs.interest.high
    });

    renderTermGroup(vivaReadinessBars, {
      Beginner: fuzzyInputs.skillReadiness.beginner,
      Intermediate: fuzzyInputs.skillReadiness.intermediate,
      Advanced: fuzzyInputs.skillReadiness.advanced
    });

    renderTermGroup(vivaAcademicBars, {
      Low: fuzzyInputs.academicPerformance.low,
      Average: fuzzyInputs.academicPerformance.average,
      High: fuzzyInputs.academicPerformance.high
    });
  }

  function renderRecommendations() {
    const student = getStudentInputs();

    interestVal.textContent = student.interest.toFixed(1);
    readinessVal.textContent = student.skillReadiness.toFixed(1);
    academicVal.textContent = `${Math.round(student.academicPerformance)}%`;

    updateQualifiers(student.skillReadiness, student.academicPerformance);

    // Run fuzzy recommendation engine
    const ranked = engine.recommendCourses(student, catalog, {
      categoryFilter: student.category
    });

    // Update Viva diagnostic bars
    if (ranked.length > 0) {
      renderVivaBars(ranked[0].fuzzyInputs);
    }

    // Apply difficulty filter tab
    const filtered = ranked.filter((item) => {
      if (currentDifficultyFilter === "all") return true;
      return item.course.difficulty.toLowerCase() === currentDifficultyFilter;
    });

    resultsCount.innerHTML = `Showing <span>${filtered.length}</span> recommended course${filtered.length === 1 ? "" : "s"}`;

    if (filtered.length === 0) {
      resultsList.innerHTML = `
        <div class="l3-rec-card" style="text-align: center; padding: 40px 20px;">
          <p class="l3-rec-card__desc">No courses match the active difficulty filter. Try selecting "All Difficulties".</p>
        </div>
      `;
      return;
    }

    resultsList.innerHTML = filtered
      .map((item, index) => {
        const c = item.course;
        const isTop = index === 0 && item.suitabilityScore >= 75;
        const isSaved = savedCourses.has(c.title);

        const diffPillClass = `l3-pill--diff-${c.difficulty.toLowerCase()}`;

        // Top 2 firing rules for quick card preview
        const ruleSnippets = item.firedRules
          .slice(0, 3)
          .map((r) => `
            <div class="l3-rule-chip">
              <span>${escapeHtml(r.description)}</span>
              <span class="l3-rule-alpha">α = ${r.strength.toFixed(2)}</span>
            </div>
          `)
          .join("");

        return `
          <article class="l3-rec-card ${isTop ? "l3-rec-card--top" : ""}" data-course-id="${c.id}">
            <div class="l3-rec-card__main">
              <div>
                <header class="l3-rec-card__head">
                  <span class="l3-rec-card__rank">#${index + 1} Match</span>
                  <span class="l3-pill l3-pill--cat">${escapeHtml(c.categoryName)}</span>
                  <span class="l3-pill ${diffPillClass}">${escapeHtml(c.difficulty)}</span>
                </header>

                <h3 class="l3-rec-card__title">${escapeHtml(c.title)}</h3>
                <p class="l3-rec-card__desc">${escapeHtml(c.description)}</p>

                <div class="l3-rec-explanation">
                  <strong>Why recommended:</strong> ${escapeHtml(item.explanation)}
                </div>

                <div class="l3-rec-meta">
                  <span class="l3-rec-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ~${c.estimatedHours} hrs self-paced
                  </span>
                  <span class="l3-rec-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    Prereqs: ${escapeHtml(c.prerequisites.join(", "))}
                  </span>
                </div>
              </div>

              <div class="l3-rec-score-box ${item.badgeClass}">
                <div class="l3-score-num">${item.suitabilityScore.toFixed(0)}<small>%</small></div>
                <div class="l3-score-label">${escapeHtml(item.suitabilityLabel)}</div>
              </div>
            </div>

            <div class="l3-rec-actions">
              <button class="l3-btn-diag" type="button" data-toggle-diag="${c.id}" aria-expanded="false">
                <span>Fuzzy Rule Trace &amp; Baseline</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <button class="l3-btn-roadmap ${isSaved ? "is-saved" : ""}" type="button" data-course-title="${escapeHtml(c.title)}">
                ${isSaved ? "Saved to Roadmap ✓" : "+ Add to Roadmap"}
              </button>
            </div>

            <div class="l3-diag-drawer" id="diag-${c.id}" aria-hidden="true">
              <div class="l3-diag-grid">
                <div>
                  <h4 class="l3-diag-section-title">Activated Fuzzy Rules (Mamdani MIN-MAX)</h4>
                  <div class="l3-rules-list">
                    ${ruleSnippets || '<p style="font-size: 11.5px; color: rgba(255,255,255,0.5);">Default fallback inference fired.</p>'}
                  </div>
                </div>

                <div>
                  <h4 class="l3-diag-section-title">Fuzzy vs. Crisp Baseline Comparison</h4>
                  <div class="l3-baseline-card">
                    <div class="l3-baseline-row">
                      <span>Fuzzy Centroid Suitability:</span>
                      <strong>${item.suitabilityScore.toFixed(1)}%</strong>
                    </div>
                    <div class="l3-baseline-row">
                      <span>Crisp Linear Baseline:</span>
                      <strong>${item.baselineComparison.crispScore.toFixed(1)}%</strong>
                    </div>
                    <div class="l3-baseline-row" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 4px; margin-top: 4px;">
                      <span>Fuzzy Margin Difference:</span>
                      <strong style="color: ${item.baselineComparison.difference >= 0 ? '#34d399' : '#f87171'}">
                        ${item.baselineComparison.difference >= 0 ? "+" : ""}${item.baselineComparison.difference.toFixed(1)}%
                      </strong>
                    </div>
                    <p style="margin: 8px 0 0; font-size: 11px; color: rgba(255,255,255,0.55); line-height: 1.4;">
                      Notice how the fuzzy engine models student potential smoothly without the harsh penalty cliffs of hard thresholding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    attachCardEventListeners();
  }

  function attachCardEventListeners() {
    // Toggle diagnostics drawer
    document.querySelectorAll("[data-toggle-diag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle-diag");
        const drawer = document.getElementById(`diag-${id}`);
        if (!drawer) return;

        const isOpen = drawer.classList.contains("is-open");
        drawer.classList.toggle("is-open", !isOpen);
        btn.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        drawer.setAttribute("aria-hidden", String(isOpen));
      });
    });

    // Save to Roadmap button
    document.querySelectorAll(".l3-btn-roadmap").forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-course-title");
        if (!title) return;

        if (savedCourses.has(title)) {
          savedCourses.delete(title);
          btn.classList.remove("is-saved");
          btn.textContent = "+ Add to Roadmap";
        } else {
          savedCourses.add(title);
          btn.classList.add("is-saved");
          btn.textContent = "Saved to Roadmap ✓";
        }

        try {
          localStorage.setItem("l3_selected_courses", JSON.stringify(Array.from(savedCourses)));
        } catch (e) {
          console.warn("Could not save to localStorage", e);
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Event Listeners for Sliders & Category Select
  [interestSlider, readinessSlider, academicSlider].forEach((slider) => {
    slider.addEventListener("input", () => {
      // Clear preset button active states when manually adjusting
      presetBtns.forEach((b) => b.classList.remove("is-active"));
      renderRecommendations();
    });
  });

  categorySelect.addEventListener("change", renderRecommendations);

  // Difficulty Filter Tabs
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      currentDifficultyFilter = tab.getAttribute("data-diff") || "all";
      renderRecommendations();
    });
  });

  // Preset Academic Profiles
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetKey = btn.getAttribute("data-preset");
      const profile = PRESET_PROFILES[presetKey];
      if (!profile) return;

      presetBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      interestSlider.value = profile.interest;
      readinessSlider.value = profile.skillReadiness;
      academicSlider.value = profile.academicPerformance;
      categorySelect.value = profile.category;

      renderRecommendations();
    });
  });

  // Initial Run
  renderRecommendations();
})();
