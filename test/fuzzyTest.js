const { COURSE_CATALOG } = require("../courses/courseData.js");
const FuzzyEngine = require("../courses/fuzzyEngine.js");

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log("==================================================");
console.log("  TEST SUITE 1: MEMBERSHIP FUNCTION BOUNDARY TESTS");
console.log("==================================================");

// Trapezoid test: [0, 0, 2.5, 5] (Interest Low)
const intLow = FuzzyEngine.MF_DEFINITIONS.interest.low;
assert(intLow(0) === 1.0, "Interest Low at 0 should be 1.0");
assert(intLow(1.0) === 1.0, "Interest Low at 1.0 should be 1.0");
assert(intLow(2.5) === 1.0, "Interest Low at 2.5 should be 1.0");
assert(Math.abs(intLow(3.75) - 0.5) < 0.001, "Interest Low at 3.75 should be 0.5");
assert(intLow(5.0) === 0.0, "Interest Low at 5.0 should be 0.0");
assert(intLow(10.0) === 0.0, "Interest Low at 10.0 should be 0.0");

// Triangle test: [2.5, 5.0, 7.5] (Interest Medium)
const intMed = FuzzyEngine.MF_DEFINITIONS.interest.medium;
assert(intMed(2.5) === 0.0, "Interest Med at 2.5 should be 0.0");
assert(Math.abs(intMed(3.75) - 0.5) < 0.001, "Interest Med at 3.75 should be 0.5");
assert(intMed(5.0) === 1.0, "Interest Med at 5.0 should be 1.0");
assert(Math.abs(intMed(6.25) - 0.5) < 0.001, "Interest Med at 6.25 should be 0.5");
assert(intMed(7.5) === 0.0, "Interest Med at 7.5 should be 0.0");

// Trapezoid test: [5.0, 7.5, 10, 10] (Interest High)
const intHigh = FuzzyEngine.MF_DEFINITIONS.interest.high;
assert(intHigh(5.0) === 0.0, "Interest High at 5.0 should be 0.0");
assert(Math.abs(intHigh(6.25) - 0.5) < 0.001, "Interest High at 6.25 should be 0.5");
assert(intHigh(7.5) === 1.0, "Interest High at 7.5 should be 1.0");
assert(intHigh(10.0) === 1.0, "Interest High at 10.0 should be 1.0");

console.log("\n==================================================");
console.log("  TEST SUITE 2: FUZZIFICATION & PARTITION OF UNITY");
console.log("==================================================");

// At any point in [2.5, 5.0], Low + Medium = 1.0 (fuzzy partition)
for (let x = 2.5; x <= 5.0; x += 0.5) {
  const sum = intLow(x) + intMed(x) + intHigh(x);
  assert(Math.abs(sum - 1.0) < 0.01, `Partition sum at x=${x} is ~1.0 (actual: ${sum.toFixed(3)})`);
}

console.log("\n==================================================");
console.log("  TEST SUITE 3: CENTROID DEFUZZIFICATION VALIDITY");
console.log("==================================================");

// Extreme boundary test 1: All zeroes
const extremeZero = { interest: 0, skillReadiness: 0, academicPerformance: 0 };
const zeroRecs = FuzzyEngine.recommendCourses(extremeZero, COURSE_CATALOG);
assert(zeroRecs.length === COURSE_CATALOG.length, "Evaluates all 22 courses for profile zero");
assert(!Number.isNaN(zeroRecs[0].suitabilityScore), "Defuzzified score is not NaN for zero inputs");
assert(zeroRecs[0].suitabilityScore >= 0 && zeroRecs[0].suitabilityScore <= 100, "Defuzzified score in [0, 100]");

// Extreme boundary test 2: All maximums (10, 10, 100)
const extremeMax = { interest: 10, skillReadiness: 10, academicPerformance: 100 };
const maxRecs = FuzzyEngine.recommendCourses(extremeMax, COURSE_CATALOG);
assert(!Number.isNaN(maxRecs[0].suitabilityScore), "Defuzzified score is not NaN for max inputs");
assert(maxRecs[0].suitabilityScore >= 75, "Max student gets high suitability for advanced courses");

console.log("\n==================================================");
console.log("  TEST SUITE 4: ACADEMIC PROFILE RANKINGS & DIFFERENTIATION");
console.log("==================================================");

// Profile A: Absolute Beginner (Interest: 9, Skill: 1, Academic: 60)
const profileNovice = { interest: 9, skillReadiness: 1, academicPerformance: 60 };
const noviceRecs = FuzzyEngine.recommendCourses(profileNovice, COURSE_CATALOG);

console.log("\nTop 3 recommendations for Novice Beginner (Interest: 9, Skill: 1, Acad: 60):");
noviceRecs.slice(0, 3).forEach((r, i) => {
  console.log(`  ${i + 1}. [${r.course.difficulty.toUpperCase()}] ${r.course.title} -> Score: ${r.suitabilityScore}%`);
});

const topNoviceCourse = noviceRecs[0].course;
assert(topNoviceCourse.difficulty === "beginner", "Top recommended course for Novice is Beginner level");

const lowestNoviceCourse = noviceRecs[noviceRecs.length - 1].course;
assert(lowestNoviceCourse.difficulty === "advanced", "Lowest recommended course for Novice is Advanced level");

// Profile B: Advanced Engineer (Interest: 9, Skill: 9, Academic: 90)
const profileAdvanced = { interest: 9, skillReadiness: 9, academicPerformance: 90 };
const advRecs = FuzzyEngine.recommendCourses(profileAdvanced, COURSE_CATALOG);

console.log("\nTop 3 recommendations for Advanced Engineer (Interest: 9, Skill: 9, Acad: 90):");
advRecs.slice(0, 3).forEach((r, i) => {
  console.log(`  ${i + 1}. [${r.course.difficulty.toUpperCase()}] ${r.course.title} -> Score: ${r.suitabilityScore}%`);
});

const topAdvCourse = advRecs[0].course;
assert(topAdvCourse.difficulty === "advanced", "Top recommended course for Advanced student is Advanced level");

// Profile C: Intermediate Developer (Interest: 8, Skill: 5.5, Academic: 70)
const profileInter = { interest: 8, skillReadiness: 5.5, academicPerformance: 70 };
const interRecs = FuzzyEngine.recommendCourses(profileInter, COURSE_CATALOG);

console.log("\nTop 3 recommendations for Intermediate Dev (Interest: 8, Skill: 5.5, Acad: 70):");
interRecs.slice(0, 3).forEach((r, i) => {
  console.log(`  ${i + 1}. [${r.course.difficulty.toUpperCase()}] ${r.course.title} -> Score: ${r.suitabilityScore}%`);
});

const topInterCourse = interRecs[0].course;
assert(topInterCourse.difficulty === "intermediate" || topInterCourse.difficulty === "beginner", "Intermediate student receives appropriate level");

console.log("\n==================================================");
console.log("  TEST SUITE 5: EXPLAINABILITY & BASELINE TRACE");
console.log("==================================================");

const sampleEval = noviceRecs[0];
assert(sampleEval.firedRules.length > 0, "Evaluation includes activated fuzzy rules");
assert(sampleEval.explanation.length > 10, "Evaluation produces plain-English explanation");
assert(typeof sampleEval.baselineComparison.fuzzyScore === "number", "Includes fuzzy suitability score");
assert(typeof sampleEval.baselineComparison.crispScore === "number", "Includes crisp baseline score for comparison");

console.log(`\nSample explanation: "${sampleEval.explanation}"`);
console.log(`Sample firing rules count: ${sampleEval.firedRules.length}`);
console.log(`Top rule: ${sampleEval.firedRules[0].description} (Strength α = ${sampleEval.firedRules[0].strength.toFixed(3)})`);

console.log("\n==================================================");
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed.`);
console.log("==================================================");

if (passedTests === totalTests) {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓");
}

console.log("\n==================================================");
console.log("  TEST SUITE 6: ROBUSTNESS & MALFORMED DATA TESTS");
console.log("==================================================");

// Malformed / NaN inputs
const malformedInput = { interest: "invalid", skillReadiness: null, academicPerformance: undefined };
const malformedEval = FuzzyEngine.recommendCourses(malformedInput, COURSE_CATALOG);
assert(malformedEval.length === COURSE_CATALOG.length, "Handles non-numeric and null student inputs safely");
assert(!Number.isNaN(malformedEval[0].suitabilityScore), "Malformed input does not result in NaN score");

// Empty catalog
const emptyRecs = FuzzyEngine.recommendCourses({ interest: 5, skillReadiness: 5, academicPerformance: 50 }, []);
assert(Array.isArray(emptyRecs) && emptyRecs.length === 0, "Gracefully handles empty course catalog");

// Catalog with course missing difficulty or prerequisites
const robustCheck = FuzzyEngine.evaluateCourse(
  { interest: 8, skillReadiness: 6, academicPerformance: 75 },
  { title: "Incomplete Course", category: "test", categoryName: "Testing" }
);
assert(!Number.isNaN(robustCheck.suitabilityScore), "Handles course with missing difficulty metadata");
assert(robustCheck.suitabilityScore >= 0 && robustCheck.suitabilityScore <= 100, "Incomplete course produces valid score");

console.log("\n==================================================");
console.log(`UPDATED TOTAL: ${passedTests} / ${totalTests} tests passed.`);
console.log("==================================================");
