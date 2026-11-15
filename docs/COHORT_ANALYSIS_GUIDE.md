# Cohort Retention Analysis Guide

## Cohort Definition
Customers are grouped into weekly or monthly cohorts based on the date of their first completed purchase (`first_order_date`).

## Retention Matrix Interpretation
- **Week 0**: $100\%$ of the cohort by definition.
- **Week 1 - 5**: Percentage of cohort members who place at least one repeat order in subsequent weeks.
- **Healthy Fashion Benchmark**: Week 1 retention $\ge 35\%$; Week 4 retention $\ge 24\%$.
- **Warning Threshold**: If Week 1 retention falls below $25\%$, trigger root-cause investigation into product quality or return dissatisfaction.\n