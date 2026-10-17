# Fuzzy Student Course Recommendation System
## Academic Project Documentation & Viva Reference Manual

---

### 1. Problem Statement
Traditional computer-aided educational guidance systems rely on hard, binary rule sets or static prerequisite gates (e.g., `IF GPA >= 3.5 AND Prereq_Passed == True`). Such crisp models fail to capture the nuances, uncertainties, and continuous spectrum of student interest, readiness, and academic adaptability. A student with high motivation and foundational skill may be unjustly blocked from pursuing an ambitious topic, while an advanced student might receive redundant recommendations.

### 2. Objectives and Scope
- **Objective:** Evolve the existing L3 Schools educational platform into an intelligent, explainable **Fuzzy Student Course Recommendation System** using a Mamdani-style Fuzzy Inference System (FIS).
- **Scope:**
  - Pure client-side JavaScript implementation requiring zero external backend or cloud APIs.
  - Evaluation across 22 existing courses grouped into five technical domains (Development, Web Development, AI, DevOps, AWS Services).
  - Explicit multi-stage fuzzy inference pipeline: Fuzzification, Rule Base Evaluation, Aggregation, and Centroid Defuzzification.
  - Transparent explainability featuring firing rules, antecedent strengths ($\alpha$), and comparison with a crisp linear baseline.

---

### 3. Existing System vs. Proposed Fuzzy System

| Feature / Dimension | Existing System | Proposed Fuzzy Recommendation System |
| :--- | :--- | :--- |
| **Course Selection** | Manual checkbox picking with visual SVG preview | Automated, personalized fuzzy inference ranking |
| **Decision Logic** | No algorithmic intelligence | Mamdani-style Fuzzy Inference System (FIS) |
| **Input Variables** | None (pure manual browsing) | Continuous: Interest (0–10), Skill Readiness (0–10), Academic Performance (0–100) |
| **Boundary Handling** | Hard steps or arbitrary exclusion | Overlapping piecewise continuous membership sets ($\mu \in [0, 1]$) |
| **Explainability** | None | Transparent fired rules ($\alpha$), antecedent degrees, and natural-language rationale |
| **Baseline Comparison** | N/A | Side-by-side comparison with a classical crisp linear weighted scoring baseline |

---

### 4. System Architecture

```
[ Student Preference Inputs ]
   ├── Subject Interest: x₁ ∈ [0, 10]
   ├── Skill Readiness: x₂ ∈ [0, 10]
   └── Academic Performance: x₃ ∈ [0, 100]
                 │
                 ▼
     ┌───────────────────────┐
     │    1. Fuzzification   │   Triangular & Trapezoidal MFs
     └───────────┬───────────┘
                 │  μ_Low, μ_Med, μ_High, etc.
                 ▼
     ┌───────────────────────┐
     │ 2. Mamdani Rule Base  │   Difficulty-adaptive IF-THEN rules
     └───────────┬───────────┘   AND = min, OR = max, Implication = min
                 │  Sliced Output Sets
                 ▼
     ┌───────────────────────┐
     │  3. Max-Aggregation   │   μ_agg(y) = max(μ_out,r(y))
     └───────────┬───────────┘
                 │
                 ▼
     ┌───────────────────────┐
     │ 4. Defuzzification    │   Centroid / Center of Gravity (COG)
     └───────────┬───────────┘   y* = (∑ y · μ_agg(y)) / (∑ μ_agg(y))
                 │
                 ▼
[ Ranked Course Recommendations & Explainable Viva Diagnostics ]
   ├── Suitability Score: y* ∈ [0, 100%]
   ├── Match Tiers (Highly Recommended, Recommended, Moderate, Poor)
   ├── Natural-Language Rationale
   └── Side-by-side Crisp Linear Baseline Comparison
```

---

### 5. Input Variables & Mathematical Membership Functions

All membership functions are defined over normalized continuous universes of discourse:

#### 5.1 Domain Interest: $x_1 \in [0, 10]$
- **Low $(x_1)$:** Trapezoid $[0, 0, 2.5, 5.0]$
  $$\mu_{\text{Low}}(x_1) = \begin{cases} 1 & x_1 \le 2.5 \\ \frac{5.0 - x_1}{2.5} & 2.5 < x_1 < 5.0 \\ 0 & x_1 \ge 5.0 \end{cases}$$
- **Medium $(x_1)$:** Triangle $[2.5, 5.0, 7.5]$
  $$\mu_{\text{Med}}(x_1) = \begin{cases} 0 & x_1 \le 2.5 \text{ or } x_1 \ge 7.5 \\ \frac{x_1 - 2.5}{2.5} & 2.5 < x_1 \le 5.0 \\ \frac{7.5 - x_1}{2.5} & 5.0 < x_1 < 7.5 \end{cases}$$
- **High $(x_1)$:** Trapezoid $[5.0, 7.5, 10.0, 10.0]$
  $$\mu_{\text{High}}(x_1) = \begin{cases} 0 & x_1 \le 5.0 \\ \frac{x_1 - 5.0}{2.5} & 5.0 < x_1 < 7.5 \\ 1 & x_1 \ge 7.5 \end{cases}$$

#### 5.2 Skill Readiness: $x_2 \in [0, 10]$
- **Beginner $(x_2)$:** Trapezoid $[0, 0, 2.5, 5.0]$
- **Intermediate $(x_2)$:** Triangle $[2.5, 5.0, 7.5]$
- **Advanced $(x_2)$:** Trapezoid $[5.0, 7.5, 10.0, 10.0]$

#### 5.3 Academic Performance: $x_3 \in [0, 100]$
- **Low $(x_3)$:** Trapezoid $[0, 0, 40.0, 60.0]$
- **Average $(x_3)$:** Triangle $[45.0, 65.0, 85.0]$
- **High $(x_3)$:** Trapezoid $[70.0, 85.0, 100.0, 100.0]$

#### 5.4 Output Variable: Suitability Score $y \in [0, 100]$
- **Poor $(y)$:** Trapezoid $[0, 0, 15.0, 35.0]$
- **Fair $(y)$:** Triangle $[25.0, 45.0, 65.0]$
- **Good $(y)$:** Triangle $[50.0, 70.0, 85.0]$
- **Excellent $(y)$:** Trapezoid $[75.0, 88.0, 100.0, 100.0]$

---

### 6. Fuzzy Rule Base & Difficulty Mapping

The rule base adapts dynamically according to course difficulty level:

#### Beginner Courses
1. **$R_{\text{BEG},1}$:** IF Interest is High AND Readiness is Beginner THEN Suitability is **Excellent**
2. **$R_{\text{BEG},2}$:** IF Interest is High AND Readiness is Intermediate THEN Suitability is **Good**
3. **$R_{\text{BEG},3}$:** IF Interest is High AND Readiness is Advanced THEN Suitability is **Fair** *(overqualified)*
4. **$R_{\text{BEG},4}$:** IF Interest is Medium AND (Readiness is Beginner OR Intermediate) THEN Suitability is **Good**
5. **$R_{\text{BEG},5}$:** IF Interest is Medium AND Readiness is Advanced THEN Suitability is **Fair**
6. **$R_{\text{BEG},6}$:** IF Interest is High AND Readiness is Beginner AND Academic is High THEN Suitability is **Excellent**
7. **$R_{\text{BEG},7}$:** IF Interest is Low THEN Suitability is **Poor**
8. **$R_{\text{BEG},8}$:** IF Readiness is Beginner AND Academic is Low AND Interest is Medium THEN Suitability is **Fair**

#### Intermediate Courses
1. **$R_{\text{INT},1}$:** IF Interest is High AND Readiness is Intermediate AND (Academic is Average OR High) THEN Suitability is **Excellent**
2. **$R_{\text{INT},2}$:** IF Interest is High AND Readiness is Intermediate AND Academic is Low THEN Suitability is **Good**
3. **$R_{\text{INT},3}$:** IF Interest is High AND Readiness is Advanced THEN Suitability is **Good**
4. **$R_{\text{INT},4}$:** IF Interest is High AND Readiness is Beginner AND Academic is High THEN Suitability is **Fair** *(can bridge with guidance)*
5. **$R_{\text{INT},5}$:** IF Readiness is Beginner AND (Academic is Low OR Average) THEN Suitability is **Poor**
6. **$R_{\text{INT},6}$:** IF Interest is Medium AND Readiness is Intermediate THEN Suitability is **Good**
7. **$R_{\text{INT},7}$:** IF Interest is Low THEN Suitability is **Poor**
8. **$R_{\text{INT},8}$:** IF Interest is Medium AND Readiness is Advanced AND Academic is High THEN Suitability is **Good**

#### Advanced Courses
1. **$R_{\text{ADV},1}$:** IF Interest is High AND Readiness is Advanced AND Academic is High THEN Suitability is **Excellent**
2. **$R_{\text{ADV},2}$:** IF Interest is High AND Readiness is Advanced AND Academic is Average THEN Suitability is **Good**
3. **$R_{\text{ADV},3}$:** IF Interest is High AND Readiness is Intermediate AND Academic is High THEN Suitability is **Good**
4. **$R_{\text{ADV},4}$:** IF Readiness is Beginner THEN Suitability is **Poor** *(unmet prerequisites)*
5. **$R_{\text{ADV},5}$:** IF Academic is Low THEN Suitability is **Poor**
6. **$R_{\text{ADV},6}$:** IF Interest is Medium AND Readiness is Advanced AND Academic is Average THEN Suitability is **Fair**
7. **$R_{\text{ADV},7}$:** IF Interest is Low THEN Suitability is **Poor**

---

### 7. Centroid Defuzzification Method (Center of Gravity / COG)

For discrete output steps $y \in [0, 100]$:
$$y^* = \frac{\sum_{y=0}^{100} y \cdot \mu_{\text{agg}}(y)}{\sum_{y=0}^{100} \mu_{\text{agg}}(y)}$$
where $\mu_{\text{agg}}(y) = \max_r \{ \min(\alpha_r, \mu_{\text{consequent}, r}(y)) \}$.

If no rules activate or denominator $\le 10^{-5}$, the engine deterministically yields a neutral midpoint ($50\%$).

---

### 8. Example Demonstration Profiles & Results

#### Profile A: Absolute Beginner
- **Inputs:** Interest = 9.0, Readiness = 1.5, Academics = 65%
- **Observed Ranking:**
  1. *AWS IAM & Access Control* [Beginner] -> **90.6% (Highly Recommended)**
  2. *C Fundamentals* [Beginner] -> **90.6% (Highly Recommended)**
  3. *Docker Essentials* [Beginner] -> **90.6% (Highly Recommended)**
  - *Algorithms (DSA) with C++* [Advanced] -> **16.6% (Poor Match - Prerequisites Unmet)**
- **Explanation:** Demonstrates that beginners are guided toward foundational courses and not penalized for lack of advanced readiness when evaluating introductory materials.

#### Profile B: Advanced Cloud / AI Aspirant
- **Inputs:** Interest = 9.5, Readiness = 8.5, Academics = 90%
- **Observed Ranking:**
  1. *Deep Learning Fundamentals* [Advanced] -> **90.6% (Highly Recommended)**
  2. *Algorithms (DSA) with C++* [Advanced] -> **90.6% (Highly Recommended)**
  3. *Kubernetes Starter* [Advanced] -> **90.6% (Highly Recommended)**
  - *HTML & CSS Mastery* [Beginner] -> **45.0% (Fair - Student is Overqualified)**

#### Profile C: CS Sophomore / Intermediate
- **Inputs:** Interest = 8.5, Readiness = 5.5, Academics = 78%
- **Observed Ranking:**
  1. *API Integration (REST)* [Intermediate] -> **83.8% (Highly Recommended)**
  2. *C++ OOP & Clean Code* [Intermediate] -> **83.8% (Highly Recommended)**
  3. *CI/CD with Pipelines* [Intermediate] -> **83.8% (Highly Recommended)**

---

### 9. Non-Fuzzy Baseline Comparison

The system includes a comparative non-fuzzy baseline using crisp linear weighted scoring:
$$\text{Score}_{\text{crisp}} = 0.40 \cdot (10 \cdot \text{Interest}) + 0.35 \cdot (10 \cdot \text{Readiness}) + 0.25 \cdot \text{Academic} - \text{Penalty}$$
where $\text{Penalty} = \max(0, (\text{PrereqRequired} - \text{Readiness}) \times 15)$.

**Key Academic Observation:**
Crisp linear scoring suffers from rigid "cliff effects" where an input change of $0.1$ around a threshold causes an abrupt swing in recommendation scores. The Mamdani FIS provides smooth, continuous gradations and realistic human-aligned inference.

---

### 10. Limitations & Future Work
- **Client-Side Storage:** Course enrollments are saved locally in `localStorage` without a multi-user database backend.
- **Future Improvements:**
  - Introduce adaptive neuro-fuzzy inference (ANFIS) to tune membership boundaries based on historical course completion rates.
  - Add multi-objective career path optimization (e.g., job role graphs).
