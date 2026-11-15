# A/B Testing & Statistical Methodology Plan

## Two-Proportion Z-Test Formulation
- **Null Hypothesis ($H_0$)**: $p_1 = p_2$ (Conversion rate in Variant is identical to Control).
- **Alternative Hypothesis ($H_1$)**: $p_1 \ne p_2$ (Statistically significant difference).

## Mathematical Formulation
- Sample conversion rates: $p_1 = \frac{x_1}{n_1}$, $p_2 = \frac{x_2}{n_2}$.
- Pooled proportion: $p_{\text{pool}} = \frac{x_1 + x_2}{n_1 + n_2}$.
- Pooled standard error:
  $$SE_{\text{pool}} = \sqrt{p_{\text{pool}}(1 - p_{\text{pool}}) \left(\frac{1}{n_1} + \frac{1}{n_2}\right)}$$
- Test statistic:
  $$Z = \frac{p_2 - p_1}{SE_{\text{pool}}}$$
- Decision rule: Ship variant if $p < 0.05$ and sample size is adequate for $80\%$ statistical power.\n