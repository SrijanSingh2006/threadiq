# Funnel Analysis Guide & Calculation Methodology

## The 6-Stage Core Funnel
1. `Homepage Visit` (`homepage_viewed`)
2. `Search Initiated` (`search_submitted`)
3. `Product Detail Viewed` (`product_viewed`)
4. `Added to Cart` (`added_to_cart`)
5. `Checkout Started` (`checkout_started`)
6. `Purchase Completed` (`purchase_completed`)

## Computation Rules
- **Unique User Deduping**: Funnel steps measure unique `user_id` values per evaluation period to prevent power users from skewing stage ratios.
- **Stage Drop-Off**:
  $$\text{Drop-Off} = 100\% - \left(\frac{\text{Users in Step } N}{\text{Users in Step } N-1} \times 100\%\right)$$
- **Device Segment Comparison**: Evaluates mobile versus desktop to isolate responsive layout friction.\n