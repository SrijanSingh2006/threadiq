# RICE Opportunity Prioritization Framework

## Formula & Definitions
$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

- **Reach ($R$)**: Number of unique shoppers affected per month.
- **Impact ($I$)**:
  - $3.0$ = Massive impact on conversion or return reduction.
  - $2.0$ = High impact.
  - $1.0$ = Medium impact.
  - $0.5$ = Low impact.
  - $0.25$ = Minimal impact.
- **Confidence ($C$)**:
  - $1.0$ ($100\%$) = High confidence backed by quantitative and usability lab data.
  - $0.8$ ($80\%$) = Medium confidence backed by qualitative interviews.
  - $0.5$ ($50\%$) = Low confidence / directional hypothesis.
- **Effort ($E$)**: Estimated person-months across engineering, design, and QA.

## Active Priority Ranking
| Initiative | Reach | Impact | Confidence | Effort | RICE Score | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Smart Size & Fit Predictor** | 120,000 | 3.0 | 0.85 | 1.5 | **204,000** | **P0 - Active Sprint** |
| **1-Click Doorstep Swap** | 65,000 | 2.5 | 0.80 | 2.0 | **65,000** | **P1 - Next Release** |
| **Colloquial Query Expansion** | 45,000 | 1.5 | 0.85 | 1.0 | **57,375** | **P1 - Next Release** |
| **Natural Daylight Image Toggle**| 50,000 | 1.5 | 0.70 | 1.5 | **35,000** | **P2 - Backlog** |
| **AR Virtual Fitting Room** | 25,000 | 1.5 | 0.40 | 4.0 | **3,750** | **Deprioritize** |\n