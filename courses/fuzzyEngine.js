/**
 * L3 Schools - Fuzzy Student Course Recommendation Engine
 * Mamdani-style Fuzzy Inference System (FIS) in pure vanilla JavaScript.
 *
 * Implements:
 * 1. Fuzzification (Piecewise Triangular & Trapezoidal Membership Functions)
 * 2. Course-Adaptive Mamdani Fuzzy Rule Base (Difficulty & Domain aware)
 * 3. Max-Union Fuzzy Aggregation
 * 4. Centroid (Center of Gravity / COG) Defuzzification
 * 5. Explainable Inference Trace (Fired rules, Antecedent strengths, Membership degrees)
 * 6. Non-Fuzzy Crisp Baseline Comparator (for academic viva & demonstration)
 */

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.FuzzyRecommendationEngine = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // -------------------------------------------------------------
  // 1. MEMBERSHIP FUNCTIONS (Piecewise Linear)
  // -------------------------------------------------------------

  /**
   * Trapezoidal membership function.
   * Handles left-shoulder (a === b) and right-shoulder (c === d).
   */
  function trapezoid(x, a, b, c, d) {
    if (x <= a) return a === b ? 1.0 : 0.0;
    if (x >= d) return c === d ? 1.0 : 0.0;
    if (x >= b && x <= c) return 1.0;
    if (x > a && x < b) return (x - a) / (b - a);
    if (x > c && x < d) return (d - x) / (d - c);
    return 0.0;
  }

  /**
   * Triangular membership function.
   */
  function triangle(x, a, b, c) {
    if (x <= a || x >= c) return 0.0;
    if (x === b) return 1.0;
    if (x > a && x < b) return (x - a) / (b - a);
    if (x > b && x < c) return (c - x) / (c - b);
    return 0.0;
  }

  // Linguistic Term Definitions & Boundaries
  const MF_DEFINITIONS = {
    // Student Interest in domain/subject: [0, 10]
    interest: {
      low: (x) => trapezoid(x, 0, 0, 2.5, 5.0),
      medium: (x) => triangle(x, 2.5, 5.0, 7.5),
      high: (x) => trapezoid(x, 5.0, 7.5, 10.0, 10.0)
    },
    // Student Skill Readiness: [0, 10]
    skillReadiness: {
      beginner: (x) => trapezoid(x, 0, 0, 2.5, 5.0),
      intermediate: (x) => triangle(x, 2.5, 5.0, 7.5),
      advanced: (x) => trapezoid(x, 5.0, 7.5, 10.0, 10.0)
    },
    // Academic Performance: [0, 100]
    academicPerformance: {
      low: (x) => trapezoid(x, 0, 0, 40.0, 60.0),
      average: (x) => triangle(x, 45.0, 65.0, 85.0),
      high: (x) => trapezoid(x, 70.0, 85.0, 100.0, 100.0)
    },
    // Output: Recommendation Suitability Score: [0, 100]
    suitability: {
      poor: (y) => trapezoid(y, 0, 0, 15.0, 35.0),
      fair: (y) => triangle(y, 25.0, 45.0, 65.0),
      good: (y) => triangle(y, 50.0, 70.0, 85.0),
      excellent: (y) => trapezoid(y, 75.0, 88.0, 100.0, 100.0)
    }
  };

  // -------------------------------------------------------------
  // 2. FUZZIFICATION
  // -------------------------------------------------------------

  function fuzzifyStudent(student) {
    const interest = Math.max(0, Math.min(10, Number(student.interest) || 0));
    const readiness = Math.max(0, Math.min(10, Number(student.skillReadiness) || 0));
    const academic = Math.max(0, Math.min(100, Number(student.academicPerformance) || 0));

    return {
      interest: {
        raw: interest,
        low: MF_DEFINITIONS.interest.low(interest),
        medium: MF_DEFINITIONS.interest.medium(interest),
        high: MF_DEFINITIONS.interest.high(interest)
      },
      skillReadiness: {
        raw: readiness,
        beginner: MF_DEFINITIONS.skillReadiness.beginner(readiness),
        intermediate: MF_DEFINITIONS.skillReadiness.intermediate(readiness),
        advanced: MF_DEFINITIONS.skillReadiness.advanced(readiness)
      },
      academicPerformance: {
        raw: academic,
        low: MF_DEFINITIONS.academicPerformance.low(academic),
        average: MF_DEFINITIONS.academicPerformance.average(academic),
        high: MF_DEFINITIONS.academicPerformance.high(academic)
      }
    };
  }

  // -------------------------------------------------------------
  // 3. FUZZY RULE EVALUATION (Difficulty & Course Adaptive)
  // -------------------------------------------------------------

  /**
   * Evaluates the Mamdani rule base for a specific course difficulty.
   * Returns an array of activated rules with antecedent strengths (alpha).
   */
  function evaluateRules(fuzzyInput, courseDifficulty) {
    const int = fuzzyInput.interest;
    const ready = fuzzyInput.skillReadiness;
    const acad = fuzzyInput.academicPerformance;

    const diff = (courseDifficulty || "beginner").toLowerCase();
    const rules = [];

    function addRule(id, description, antecedentAlpha, consequentTerm) {
      if (antecedentAlpha > 0.0001) {
        rules.push({
          id,
          description,
          strength: antecedentAlpha,
          consequent: consequentTerm
        });
      }
    }

    if (diff === "beginner") {
      // Beginner courses: ideal for high interest beginners & early intermediates
      addRule(
        "R_BEG_1",
        "IF Interest is High AND Readiness is Beginner THEN Suitability is Excellent",
        Math.min(int.high, ready.beginner),
        "excellent"
      );
      addRule(
        "R_BEG_2",
        "IF Interest is High AND Readiness is Intermediate THEN Suitability is Good",
        Math.min(int.high, ready.intermediate),
        "good"
      );
      addRule(
        "R_BEG_3",
        "IF Interest is High AND Readiness is Advanced THEN Suitability is Fair",
        Math.min(int.high, ready.advanced),
        "fair" // Advanced student is overqualified
      );
      addRule(
        "R_BEG_4",
        "IF Interest is Medium AND (Readiness is Beginner OR Intermediate) THEN Suitability is Good",
        Math.min(int.medium, Math.max(ready.beginner, ready.intermediate)),
        "good"
      );
      addRule(
        "R_BEG_5",
        "IF Interest is Medium AND Readiness is Advanced THEN Suitability is Fair",
        Math.min(int.medium, ready.advanced),
        "fair"
      );
      addRule(
        "R_BEG_6",
        "IF Interest is High AND Readiness is Beginner AND Academic is High THEN Suitability is Excellent",
        Math.min(int.high, ready.beginner, acad.high),
        "excellent"
      );
      addRule(
        "R_BEG_7",
        "IF Interest is Low THEN Suitability is Poor",
        int.low,
        "poor"
      );
      addRule(
        "R_BEG_8",
        "IF Readiness is Beginner AND Academic is Low AND Interest is Medium THEN Suitability is Fair",
        Math.min(ready.beginner, acad.low, int.medium),
        "fair"
      );
    } else if (diff === "intermediate") {
      // Intermediate courses: best for intermediate readiness, high interest, avg/high academics
      addRule(
        "R_INT_1",
        "IF Interest is High AND Readiness is Intermediate AND (Academic is Average OR High) THEN Suitability is Excellent",
        Math.min(int.high, ready.intermediate, Math.max(acad.average, acad.high)),
        "excellent"
      );
      addRule(
        "R_INT_2",
        "IF Interest is High AND Readiness is Intermediate AND Academic is Low THEN Suitability is Good",
        Math.min(int.high, ready.intermediate, acad.low),
        "good"
      );
      addRule(
        "R_INT_3",
        "IF Interest is High AND Readiness is Advanced THEN Suitability is Good",
        Math.min(int.high, ready.advanced),
        "good"
      );
      addRule(
        "R_INT_4",
        "IF Interest is High AND Readiness is Beginner AND Academic is High THEN Suitability is Fair",
        Math.min(int.high, ready.beginner, acad.high),
        "fair" // Capable beginner, but bridging needed
      );
      addRule(
        "R_INT_5",
        "IF Readiness is Beginner AND (Academic is Low OR Average) THEN Suitability is Poor",
        Math.min(ready.beginner, Math.max(acad.low, acad.average)),
        "poor" // Insufficient foundational prep
      );
      addRule(
        "R_INT_6",
        "IF Interest is Medium AND Readiness is Intermediate THEN Suitability is Good",
        Math.min(int.medium, ready.intermediate),
        "good"
      );
      addRule(
        "R_INT_7",
        "IF Interest is Low THEN Suitability is Poor",
        int.low,
        "poor"
      );
      addRule(
        "R_INT_8",
        "IF Interest is Medium AND Readiness is Advanced AND Academic is High THEN Suitability is Good",
        Math.min(int.medium, ready.advanced, acad.high),
        "good"
      );
    } else if (diff === "advanced") {
      // Advanced courses: require high readiness and strong academic ability
      addRule(
        "R_ADV_1",
        "IF Interest is High AND Readiness is Advanced AND Academic is High THEN Suitability is Excellent",
        Math.min(int.high, ready.advanced, acad.high),
        "excellent"
      );
      addRule(
        "R_ADV_2",
        "IF Interest is High AND Readiness is Advanced AND Academic is Average THEN Suitability is Good",
        Math.min(int.high, ready.advanced, acad.average),
        "good"
      );
      addRule(
        "R_ADV_3",
        "IF Interest is High AND Readiness is Intermediate AND Academic is High THEN Suitability is Good",
        Math.min(int.high, ready.intermediate, acad.high),
        "good" // Ambitious leap supported by high intellect
      );
      addRule(
        "R_ADV_4",
        "IF Readiness is Beginner THEN Suitability is Poor",
        ready.beginner,
        "poor" // Serious prerequisite gap
      );
      addRule(
        "R_ADV_5",
        "IF Academic is Low THEN Suitability is Poor",
        acad.low,
        "poor"
      );
      addRule(
        "R_ADV_6",
        "IF Interest is Medium AND Readiness is Advanced AND Academic is Average THEN Suitability is Fair",
        Math.min(int.medium, ready.advanced, acad.average),
        "fair"
      );
      addRule(
        "R_ADV_7",
        "IF Interest is Low THEN Suitability is Poor",
        int.low,
        "poor"
      );
    }

    return rules;
  }

  // -------------------------------------------------------------
  // 4. AGGREGATION & DEFUZZIFICATION (Centroid Method / COG)
  // -------------------------------------------------------------

  /**
   * Aggregates rule consequents using Mamdani min-implication and max-aggregation,
   * then computes the discrete Centroid defuzzification over [0, 100].
   */
  function defuzzifyCentroid(rules) {
    if (!rules || rules.length === 0) {
      return 50.0; // Default neutral score if no rules fire
    }

    // Determine maximal activation for each consequent term
    const termMaxStrengths = {
      poor: 0,
      fair: 0,
      good: 0,
      excellent: 0
    };

    rules.forEach((r) => {
      if (termMaxStrengths[r.consequent] !== undefined) {
        termMaxStrengths[r.consequent] = Math.max(termMaxStrengths[r.consequent], r.strength);
      }
    });

    let numerator = 0.0;
    let denominator = 0.0;

    // Discretize y from 0 to 100 in steps of 1 (101 points)
    for (let y = 0; y <= 100; y += 1) {
      // Sliced membership of each term
      const muPoor = Math.min(termMaxStrengths.poor, MF_DEFINITIONS.suitability.poor(y));
      const muFair = Math.min(termMaxStrengths.fair, MF_DEFINITIONS.suitability.fair(y));
      const muGood = Math.min(termMaxStrengths.good, MF_DEFINITIONS.suitability.good(y));
      const muExcellent = Math.min(termMaxStrengths.excellent, MF_DEFINITIONS.suitability.excellent(y));

      // Union aggregation (MAX)
      const muAgg = Math.max(muPoor, muFair, muGood, muExcellent);

      numerator += y * muAgg;
      denominator += muAgg;
    }

    if (denominator <= 0.00001) {
      return 50.0; // Fallback to mid-scale if denominator is negligible
    }

    const cog = numerator / denominator;
    return Math.round(cog * 10) / 10;
  }

  // -------------------------------------------------------------
  // 5. EXPLAINABILITY & REASONING GENERATION
  // -------------------------------------------------------------

  function generateExplanation(student, course, suitabilityScore, topRules) {
    const diff = course.difficulty;
    const readiness = Number(student.skillReadiness) || 0;
    const interest = Number(student.interest) || 0;
    const academic = Number(student.academicPerformance) || 0;

    const reasons = [];

    // 1. Difficulty & Readiness compatibility
    if (diff === "beginner") {
      if (readiness <= 4) {
        reasons.push("Ideal match for your foundational skill level with zero required prerequisites.");
      } else if (readiness <= 7) {
        reasons.push("Suitable as a refresher or quick portfolio builder, though some concepts will be familiar.");
      } else {
        reasons.push("Your advanced skill level exceeds this introductory scope; consider higher-level alternatives.");
      }
    } else if (diff === "intermediate") {
      if (readiness >= 4 && readiness <= 7) {
        reasons.push("Directly calibrated for your intermediate readiness and practical development goals.");
      } else if (readiness < 4) {
        if (academic >= 75) {
          reasons.push("Challenging pace: your strong academic capability allows you to attempt it with foundational catch-up.");
        } else {
          reasons.push("Requires prior fundamentals; taking introductory prerequisites first is strongly advised.");
        }
      } else {
        reasons.push("Reinforces your intermediate competencies while offering rapid project completion.");
      }
    } else if (diff === "advanced") {
      if (readiness >= 7 && academic >= 65) {
        reasons.push("Excellent pairing for your advanced competencies and proven problem-solving readiness.");
      } else if (readiness < 5) {
        reasons.push("High prerequisite barrier: requires foundational and intermediate mastery before enrolling.");
      } else {
        reasons.push("Ambitious curriculum: demanding topics will test and stretch your technical abilities.");
      }
    }

    // 2. Interest alignment
    if (interest >= 7.5) {
      reasons.push(`Strong alignment with your high enthusiasm in ${course.categoryName}.`);
    } else if (interest >= 4.5) {
      reasons.push(`Moderate interest match in ${course.categoryName}.`);
    } else {
      reasons.push(`Low stated interest in ${course.categoryName}; recommended mainly for core breadth.`);
    }

    return reasons.join(" ");
  }

  // -------------------------------------------------------------
  // 6. NON-FUZZY CRISP BASELINE (For Academic Comparison)
  // -------------------------------------------------------------

  /**
   * Classical linear weighted baseline with rigid step thresholds.
   * Useful during viva / college project demonstration to illustrate
   * how crisp logic creates sudden cliff-edges while fuzzy logic
   * gracefully handles gradations of student readiness.
   */
  function calculateCrispBaseline(student, course) {
    const interest = Number(student.interest) || 0;
    const readiness = Number(student.skillReadiness) || 0;
    const academic = Number(student.academicPerformance) || 0;

    // Fixed linear weights
    const wInterest = 0.40;
    const wReadiness = 0.35;
    const wAcademic = 0.25;

    // Normalized scores (0-100)
    const normInterest = interest * 10;
    const normAcademic = academic;

    // Crisp penalty for readiness below minimum prerequisite
    let normReadiness = readiness * 10;
    let penalty = 0;

    const minReq = course.minSkillReadiness || 1;
    if (readiness < minReq) {
      // Rigid cliff penalty
      penalty = (minReq - readiness) * 15;
    }

    let score = wInterest * normInterest + wReadiness * normReadiness + wAcademic * normAcademic - penalty;
    score = Math.max(0, Math.min(100, Math.round(score * 10) / 10));

    return {
      score,
      method: "Crisp Linear Weighted Baseline",
      weights: { interest: wInterest, readiness: wReadiness, academic: wAcademic },
      appliedPenalty: penalty
    };
  }

  // -------------------------------------------------------------
  // 7. COURSE EVALUATION & RANKING
  // -------------------------------------------------------------

  /**
   * Evaluates a single course against the student profile using fuzzy inference.
   */
  function evaluateCourse(student, course, options) {
    const opts = options || {};
    // Domain match factor: If user selected a specific domain, penalize unrelated domains slightly or filter
    const targetCategory = opts.categoryFilter || null;
    let domainMultiplier = 1.0;
    if (targetCategory && targetCategory !== "all") {
      domainMultiplier = (course.category === targetCategory) ? 1.0 : 0.65;
    }

    // Fuzzify student profile
    const fuzzyStudent = fuzzifyStudent(student);

    // Evaluate rules for this course difficulty
    const rules = evaluateRules(fuzzyStudent, course.difficulty);

    // Defuzzify to obtain crisp suitability score
    let baseScore = defuzzifyCentroid(rules);

    // Adjust by domain filter weight if specified
    let finalScore = baseScore * domainMultiplier;
    finalScore = Math.max(5, Math.min(99.5, Math.round(finalScore * 10) / 10));

    // Sort firing rules by strength descending
    const sortedRules = rules.slice().sort((a, b) => b.strength - a.strength);

    // Generate human explanation
    const explanation = generateExplanation(student, course, finalScore, sortedRules);

    // Baseline comparison
    const baseline = calculateCrispBaseline(student, course);

    // Assign suitability badge
    let label = "Poor Match";
    let badgeClass = "l3-match-poor";
    if (finalScore >= 80) {
      label = "Highly Recommended";
      badgeClass = "l3-match-excellent";
    } else if (finalScore >= 65) {
      label = "Recommended";
      badgeClass = "l3-match-good";
    } else if (finalScore >= 45) {
      label = "Moderate Match";
      badgeClass = "l3-match-fair";
    }

    return {
      course,
      suitabilityScore: finalScore,
      suitabilityLabel: label,
      badgeClass,
      explanation,
      fuzzyInputs: fuzzyStudent,
      firedRules: sortedRules,
      activeRuleCount: sortedRules.length,
      baselineComparison: {
        fuzzyScore: finalScore,
        crispScore: baseline.score,
        difference: Math.round((finalScore - baseline.score) * 10) / 10
      }
    };
  }

  /**
   * Evaluates and ranks the entire course catalog for a student.
   */
  function recommendCourses(student, catalog, options) {
    if (!catalog || !Array.isArray(catalog)) return [];

    const results = catalog.map((course) => evaluateCourse(student, course, options));

    // Deterministic sorting: descending by suitabilityScore, then alphabetically by title
    results.sort((a, b) => {
      if (b.suitabilityScore !== a.suitabilityScore) {
        return b.suitabilityScore - a.suitabilityScore;
      }
      return a.course.title.localeCompare(b.course.title);
    });

    return results;
  }

  // -------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------
  return {
    MF_DEFINITIONS,
    trapezoid,
    triangle,
    fuzzifyStudent,
    evaluateRules,
    defuzzifyCentroid,
    generateExplanation,
    calculateCrispBaseline,
    evaluateCourse,
    recommendCourses
  };
});
