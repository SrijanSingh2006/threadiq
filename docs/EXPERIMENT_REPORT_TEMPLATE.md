# Experiment Results Report Template

## 1. Experiment Overview
- **Experiment Code**: [e.g. EXP-FIT-GUIDE-001]
- **Feature Name**: Smart Size & Fit Predictor Widget
- **Evaluation Period**: [Start Date] to [End Date]
- **Primary Metric**: Add-to-Cart Conversion Rate

## 2. Results Summary
- **Control**: Sample size $n_1 = 1,420$, Conversions $x_1 = 352$ ($24.78\%$, $95\%$ CI: [$22.5\%$, $27.0\%$]).
- **Variant B**: Sample size $n_2 = 1,450$, Conversions $x_2 = 412$ ($28.41\%$, $95\%$ CI: [$26.1\%$, $30.7\%$]).
- **Relative Lift**: $+14.65\%$ (Absolute lift: $+3.63\%$)
- **Z-Score**: $2.24$ | **P-Value**: $0.025$ ($p < 0.05$)

## 3. Decision & Next Steps
- **Status**: Statistically Significant Positive Lift.
- **Decision**: Ship Variant to $100\%$ of traffic via Feature Flag `enable_smart_size_predictor`.\n