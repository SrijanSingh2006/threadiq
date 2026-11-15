// Comprehensive mock data fallback for live web deployment & offline fallback
export const MOCK_DATA: Record<string, any> = {
  // --- OVERVIEW ---
  '/overview/metrics': {
    kpis: {
      total_products: 100,
      total_customers: 5000,
      total_orders: 2000,
      total_events: 20000,
      gmv: 4821950.00,
      aov: 2410.98,
      avg_return_rate: 14.8,
      overall_conversion_rate: 3.24
    },
    alerts: [
      { id: 1, type: 'warning', title: 'Size Guide Drop-off', message: 'Size chart view-to-add-to-cart dropped 4.2% on Western Wear PDPs.', timestamp: '10m ago' },
      { id: 2, type: 'critical', title: 'Low Stock Alert', message: '12 high-velocity SKU variants below safety stock threshold (< 5 units).', timestamp: '25m ago' },
      { id: 3, type: 'success', title: 'A/B Test Significant', message: 'EXP-SIZE-FIT-01 reached 99.1% statistical confidence with +18.0% lift.', timestamp: '1h ago' }
    ],
    recent_activity: [
      { id: 1, user: 'Aarav Sharma', role: 'Product Manager', action: 'Approved PRD', target: 'Size & Fit Recommender v2.1', time: '15m ago' },
      { id: 2, user: 'Diya Patel', role: 'Product Analyst', action: 'Ran Cohort Analysis', target: 'Week 42 Retention Heatmap', time: '42m ago' },
      { id: 3, user: 'Rohan Verma', role: 'Engineer', action: 'Toggled Feature Flag', target: 'ff_instant_checkout_v2 (50% rollout)', time: '2h ago' }
    ]
  },

  // --- ANALYTICS ---
  '/analytics/funnel': {
    total_sessions: 62450,
    stages: [
      { stage_number: 1, stage_name: 'Storefront Session', event_name: 'view_home', visitor_count: 62450, stage_conversion_rate: 100.0, cumulative_conversion_rate: 100.0, drop_off_count: 0, drop_off_rate: 0.0 },
      { stage_number: 2, stage_name: 'Product Listing (PLP)', event_name: 'view_item_list', visitor_count: 48500, stage_conversion_rate: 77.66, cumulative_conversion_rate: 77.66, drop_off_count: 13950, drop_off_rate: 22.34 },
      { stage_number: 3, stage_name: 'Product Detail (PDP)', event_name: 'view_item', visitor_count: 24200, stage_conversion_rate: 49.90, cumulative_conversion_rate: 38.75, drop_off_count: 24300, drop_off_rate: 50.10 },
      { stage_number: 4, stage_name: 'Size & Fit Selection', event_name: 'select_size', visitor_count: 12100, stage_conversion_rate: 50.00, cumulative_conversion_rate: 19.38, drop_off_count: 12100, drop_off_rate: 50.00 },
      { stage_number: 5, stage_name: 'Add to Bag (Cart)', event_name: 'add_to_cart', visitor_count: 5800, stage_conversion_rate: 47.93, cumulative_conversion_rate: 9.29, drop_off_count: 6300, drop_off_rate: 52.07 },
      { stage_number: 6, stage_name: 'Order Placed (Purchase)', event_name: 'purchase', visitor_count: 2024, stage_conversion_rate: 34.90, cumulative_conversion_rate: 3.24, drop_off_count: 3776, drop_off_rate: 65.10 }
    ],
    primary_friction_stage: 'Size & Fit Selection (50.0% stage drop-off)',
    secondary_friction_stage: 'Order Placed (65.1% checkout abandonment)'
  },

  '/analytics/root-cause': {
    stage_name: 'Size & Fit Selection',
    total_drop_offs: 12100,
    friction_reasons: [
      { reason: 'Size chart ambiguous or non-standard across brands', percentage: 38.4, affected_users: 4646, severity: 'High' },
      { reason: 'Desired size variant Out of Stock (OOS)', percentage: 26.2, affected_users: 3170, severity: 'High' },
      { reason: 'Customer uncertain between two adjacent sizes (M vs L)', percentage: 21.5, affected_users: 2601, severity: 'Medium' },
      { reason: 'User reviews lack reviewer height/weight body context', percentage: 13.9, affected_users: 1683, severity: 'Medium' }
    ]
  },

  '/analytics/cohorts': {
    cohorts: [
      { cohort_week: '2025-W01', users_acquired: 650, retention: [100.0, 38.2, 29.5, 24.1, 21.0, 19.4, 18.2, 17.5] },
      { cohort_week: '2025-W02', users_acquired: 720, retention: [100.0, 41.0, 31.2, 26.0, 22.8, 20.1, 19.0, null] },
      { cohort_week: '2025-W03', users_acquired: 680, retention: [100.0, 39.5, 30.1, 25.4, 21.9, 19.8, null, null] },
      { cohort_week: '2025-W04', users_acquired: 810, retention: [100.0, 44.2, 34.0, 28.5, 24.6, null, null, null] },
      { cohort_week: '2025-W05', users_acquired: 790, retention: [100.0, 43.8, 33.5, 27.9, null, null, null, null] },
      { cohort_week: '2025-W06', users_acquired: 850, retention: [100.0, 45.1, 35.2, null, null, null, null, null] },
      { cohort_week: '2025-W07', users_acquired: 910, retention: [100.0, 47.0, null, null, null, null, null, null] },
      { cohort_week: '2025-W08', users_acquired: 940, retention: [100.0, null, null, null, null, null, null, null] }
    ]
  },

  '/analytics/rfm': {
    segments: [
      { segment: 'Champions', count: 780, percentage: 15.6, avg_monetary: 7420, avg_frequency: 6.2, avg_recency_days: 12 },
      { segment: 'Loyal Customers', count: 1240, percentage: 24.8, avg_monetary: 4890, avg_frequency: 4.1, avg_recency_days: 28 },
      { segment: 'Potential Loyalists', count: 1120, percentage: 22.4, avg_monetary: 2950, avg_frequency: 2.3, avg_recency_days: 45 },
      { segment: 'At Risk', count: 960, percentage: 19.2, avg_monetary: 3200, avg_frequency: 2.1, avg_recency_days: 110 },
      { segment: 'Hibernating / Churned', count: 900, percentage: 18.0, avg_monetary: 1450, avg_frequency: 1.2, avg_recency_days: 210 }
    ]
  },

  '/analytics/feature-kpis': [
    { feature_name: 'Smart Size Recommender v2', metric: 'Size Guide to Bag Conversion', baseline: '11.8%', current: '14.2%', lift: '+20.3%', status: 'Statistically Significant' },
    { feature_name: 'UGC Daylight Customer Photos', metric: 'Color Discrepancy Returns', baseline: '19.4%', current: '14.1%', lift: '-27.3%', status: 'Statistically Significant' },
    { feature_name: 'Sticky PLP Available Size Chips', metric: 'PLP to PDP Click Rate', baseline: '44.5%', current: '51.8%', lift: '+16.4%', status: 'Ramping Up' },
    { feature_name: '1-Click Instant UPI Intent', metric: 'Payment Step Completion', baseline: '66.0%', current: '71.2%', lift: '+7.8%', status: 'Active Experiment' }
  ],

  '/analytics/metrics': [
    { metric: 'Gross Merchandise Value (GMV)', value: '₹4,821,950', period: 'Last 30 Days', trend: '+14.2%' },
    { metric: 'Average Order Value (AOV)', value: '₹2,410.98', period: 'Last 30 Days', trend: '+3.8%' },
    { metric: 'Overall Storefront Conversion', value: '3.24%', period: 'Last 30 Days', trend: '+0.42%' },
    { metric: 'Apparel Return Rate', value: '14.8%', period: 'Last 30 Days', trend: '-2.1%' }
  ],

  // --- CUSTOMER RESEARCH & DISCOVERY ---
  '/research/projects': [
    {
      id: 1,
      name: 'Fashion Discovery & Sizing Anxiety Study',
      objective: 'Uncover psychological friction points during size selection across ethnic and western apparel.',
      research_type: 'Customer interviews',
      business_area: 'Storefront Discovery',
      target_customer_segment: 'Gen Z & Tier-1 Working Professionals',
      owner: 'Kabir Sen (UX Researcher)',
      start_date: '2025-01-10',
      end_date: '2025-02-15',
      status: 'Completed',
      research_questions: '1. How do users decide on a size when buying from unfamiliar brands? 2. What triggers double ordering?',
      success_criteria: 'Identify top 3 actionable sizing UI interventions to decrease return volume.'
    },
    {
      id: 2,
      name: 'Checkout Drop-off & Payment Friction Lab',
      objective: 'Analyze friction during payment mode selection and evaluate single-page checkout flow.',
      research_type: 'Usability studies',
      business_area: 'Checkout & Payments',
      target_customer_segment: 'Mobile Shoppers (Android & iOS)',
      owner: 'Diya Patel (Product Analyst)',
      start_date: '2025-02-01',
      status: 'In Progress',
      research_questions: '1. Does layout shift on UPI selection cause unintended payment abandonment?',
      success_criteria: 'Reduce payment initiation bounce by 2.0%.'
    },
    {
      id: 3,
      name: 'Festive Wear UGC & Daylight Photography Benchmark',
      objective: 'Evaluate customer perception of silk and brocade fabrics under studio vs real daylight.',
      research_type: 'Customer surveys',
      business_area: 'Ethnic & Festive PDP',
      target_customer_segment: 'Occasion & Festive Shoppers',
      owner: 'Ananya Iyer (Product Designer)',
      start_date: '2025-02-18',
      status: 'In Progress',
      research_questions: 'Do daylight user reviews reduce color/texture return rates?',
      success_criteria: 'Achieve >80% customer confidence in fabric color fidelity.'
    }
  ],

  '/research/personas': [
    {
      id: 1,
      persona_code: 'GEN-Z',
      name: 'Riya - The Gen-Z Trend Hunter',
      tagline: 'College student seeking viral TikTok & Instagram aesthetics on a student budget',
      age_range: '18 - 24',
      occupation: 'College Student / Intern',
      customer_segment: 'Gen Z Trendsetter',
      shopping_frequency: '2-3 times per week',
      preferred_categories: 'Western Wear, Crop Tops, Oversized Hoodies, Chunky Sneakers',
      shopping_motivation: 'Desire to stay ahead of viral street trends and styling aesthetics seen on Reels.',
      spending_preference: 'Trend-focused / Value sensitive',
      purchase_behaviour: 'Impulse browsing on mobile, adds 8+ items to wishlist, sensitive to delivery ETA.',
      common_frustrations: 'Inconsistent sizing across trendy brands; return pickups take 4+ days.',
      preferred_discovery_methods: 'Visual Search, Curated Trend Feeds, Hashtag Filters',
      return_behaviour: 'Returns 25% of orders primarily due to bodycon fit or hemline length.',
      customer_goals: 'Curate trendy outfits without breaking the bank; fast 2-day deliveries.'
    },
    {
      id: 2,
      persona_code: 'CORP-PRO',
      name: 'Sneha - The Urban Professional',
      tagline: 'Mid-career corporate professional balancing comfort and elegance',
      age_range: '28 - 36',
      occupation: 'Tech Lead / Consultant',
      customer_segment: 'Premium Wardrobe',
      shopping_frequency: 'Twice a month',
      preferred_categories: 'Ethnic Fusion, Formal Shirts, Linen Blazers, Chinos',
      shopping_motivation: 'Needs durable, breathable, wrinkle-resistant outfits suitable for hybrid office schedules.',
      spending_preference: 'Premium / Quality-first',
      purchase_behaviour: 'Researches fabric composition, checks detailed size charts, high repeat purchase rate.',
      common_frustrations: 'Linen and shirt sizing differs drastically between formal and casual fits.',
      preferred_discovery_methods: 'Brand Pages, Category Navigation, Material Filters',
      return_behaviour: 'Low return rate (8%), primarily exchanges for alternative colors.',
      customer_goals: 'Build a versatile capsule wardrobe with reliable longevity.'
    },
    {
      id: 3,
      persona_code: 'BUDGET',
      name: 'Rohan - The Budget-Conscious Optimizer',
      tagline: 'College student looking for high-utility everyday staples',
      age_range: '19 - 23',
      occupation: 'Engineering Undergrad',
      customer_segment: 'Value Seeker',
      shopping_frequency: 'During mega sales and payday weekends',
      preferred_categories: 'Casual Shirts, Denim, Athleisure, Sneakers',
      shopping_motivation: 'Maximizing discounts, coupon stacking, and durable daily campus wear.',
      spending_preference: 'Budget / Deal-driven',
      purchase_behaviour: 'Sorts by Price: Low to High, filters strictly for >40% discounts.',
      common_frustrations: 'Out-of-stock sizes during sale peaks, deceptive discount percentages.',
      preferred_discovery_methods: 'Discount Carousels, Deal of the Day, Flash Sale Banners',
      return_behaviour: 'Moderate (14%), hesitant to return if return pickup fee applies.',
      customer_goals: 'Get maximum branded apparel within a ₹3,000 monthly allowance.'
    },
    {
      id: 4,
      persona_code: 'OCCASION',
      name: 'Anjali - The Festive & Ethnic Connoisseur',
      tagline: 'Family occasion planner seeking artisanal ethnic silhouettes',
      age_range: '32 - 45',
      occupation: 'Marketing Director & Homemaker',
      customer_segment: 'Festive Shopper',
      shopping_frequency: 'Seasonal (Diwali, Weddings, Festivals)',
      preferred_categories: 'Ethnic Wear, Sarees, Lehengas, Handlooms',
      shopping_motivation: 'Unique handcrafted designs that stand out at cultural and family events.',
      spending_preference: 'High AOV / Premium festive',
      purchase_behaviour: 'Compares intricate embroidery details, zooms in on high-res photos.',
      common_frustrations: 'Color shade difference from studio photos, rigid non-stretch waistbands.',
      preferred_discovery_methods: 'Curated Festivals, Editorial Lookbooks, Artisan Spotlights',
      return_behaviour: 'High stakes returns if garment arrives too late for occasion.',
      customer_goals: 'Guaranteed authentic fabrics delivered strictly ahead of scheduled festivities.'
    },
    {
      id: 5,
      persona_code: 'ACTIVE',
      name: 'Varun - The Athleisure Enthusiast',
      tagline: 'Fitness enthusiast seeking high-performance gym and running apparel',
      age_range: '24 - 32',
      occupation: 'Product Specialist & Marathoner',
      customer_segment: 'Activewear',
      shopping_frequency: 'Monthly',
      preferred_categories: 'Athleisure, Dry-Fit Tees, Footwear',
      shopping_motivation: 'Functional sweat-wicking gear with modern aesthetic appeal.',
      spending_preference: 'Mid to Premium',
      purchase_behaviour: 'Reviews customer photos for stretch and sweat resistance.',
      common_frustrations: 'Chafing stitching, misleading shoe sole cushioning claims.',
      preferred_discovery_methods: 'Keyword Search, Performance Filter Tags',
      return_behaviour: 'Returns shoes if arch support or width feels narrow.',
      customer_goals: 'Gear that survives rigorous daily workouts while looking sharp.'
    }
  ],

  '/research/pain-points': [
    {
      id: 1,
      title: 'Inconsistent Brand Sizing Scale',
      description: 'Shoppers report that Size M varies up to 2.5 inches in bust/chest circumference between ethnic and western brands, triggering double-ordering and anxiety.',
      customer_segment: 'Gen Z Trendsetter & Premium Wardrobe',
      journey_stage: 'Size Selection',
      supporting_feedback: 'Interviews USR-INT-01, USR-INT-04; Return telemetry shows 48% sizing reasons.',
      supporting_records_count: 184,
      severity: 'Critical',
      frequency: 'Daily',
      customer_impact: 5,
      business_impact: 5,
      status: 'In Roadmap',
      proposed_opportunity: 'Develop ML-powered Smart Size Recommender with fit-history prediction.'
    },
    {
      id: 2,
      title: 'Studio Lighting Color & Texture Distortion',
      description: 'Customers receive garments where real daylight colors appear significantly duller or textures differ from studio photography.',
      customer_segment: 'Festive Shopper',
      journey_stage: 'Product Details',
      supporting_feedback: 'Feedback FB-MERCH-09; 19% of returns cite fabric feel discrepancy.',
      supporting_records_count: 92,
      severity: 'High',
      frequency: 'Frequent',
      customer_impact: 4,
      business_impact: 4,
      status: 'Validated',
      proposed_opportunity: 'Integrate User-Generated Content (UGC) Daylight Photo Carousel.'
    },
    {
      id: 3,
      title: 'Out-of-Stock Size Disappointment on PDP',
      description: 'Shoppers browse catalog, fall in love with an item, click into PDP only to discover their size is sold out.',
      customer_segment: 'Value Seeker',
      journey_stage: 'Product Listing',
      supporting_feedback: 'Drop-off telemetry: 14.8% immediate bounce when selected size chip is greyed out.',
      supporting_records_count: 142,
      severity: 'High',
      frequency: 'Daily',
      customer_impact: 4,
      business_impact: 4,
      status: 'Prioritized',
      proposed_opportunity: 'Display sticky available size chips directly on PLP cards.'
    },
    {
      id: 4,
      title: 'Surprise Delivery Surcharges at Checkout',
      description: 'Customers reach checkout only to discover an unexpected delivery convenience surcharge, causing friction.',
      customer_segment: 'Value Seeker',
      journey_stage: 'Checkout',
      supporting_feedback: 'Cart abandonment telemetry reveals 28.4% drop-off at final payment step.',
      supporting_records_count: 164,
      severity: 'High',
      frequency: 'Frequent',
      customer_impact: 4,
      business_impact: 3,
      status: 'In Validation',
      proposed_opportunity: 'Transparent cart fee disclosure and progress bar for free shipping.'
    },
    {
      id: 5,
      title: 'Return Exchange Dispatch Latency',
      description: 'Waiting for returned parcel to reach warehouse before exchange size is dispatched creates 7-day delays.',
      customer_segment: 'All Shoppers',
      journey_stage: 'Returns & Exchanges',
      supporting_feedback: '34% of support tickets enquire about replacement timelines.',
      supporting_records_count: 118,
      severity: 'Medium',
      frequency: 'Weekly',
      customer_impact: 3,
      business_impact: 4,
      status: 'In Roadmap',
      proposed_opportunity: '1-Click Doorstep Instant Size Swap with delivery rider swap.'
    }
  ],

  '/research/interviews': [
    {
      id: 1,
      project_id: 1,
      participant_id: 'USR-CUST-10492',
      customer_segment: 'Gen Z Trendsetter',
      interview_date: '2025-01-20',
      objective: 'Understand sizing doubts on western dresses',
      observations: 'Participant opened 4 different size charts in separate tabs to cross-reference bust measurements.',
      pain_points: 'No universal size standard; model height is rarely representative of average Indian women.',
      opportunities: 'Show crowdsourced fit ratings: True to Size (86%) with reviewer height/weight badges.',
      evidence_reference: 'REC-AUDIO-2026-089',
      is_synthetic: true
    },
    {
      id: 2,
      project_id: 1,
      participant_id: 'USR-CUST-11823',
      customer_segment: 'Premium Wardrobe',
      interview_date: '2025-01-22',
      objective: 'Analyze fit discrepancies in formal office wear',
      observations: 'Purchased both 38 and 40 in shirts, returned 38 due to tight shoulder seam.',
      pain_points: 'Slim fit vs regular fit definitions vary widely across brands.',
      opportunities: 'Fit quiz asking about preferred shoulder drape and waist taper.',
      evidence_reference: 'REC-AUDIO-2026-094',
      is_synthetic: true
    },
    {
      id: 3,
      project_id: 2,
      participant_id: 'USR-CUST-14920',
      customer_segment: 'Mobile Shopper',
      interview_date: '2025-02-05',
      objective: 'Evaluate payment step abandonment',
      observations: 'Participant experienced layout shift when selecting GPay on low-end Android device.',
      pain_points: 'Asynchronous payment gateway modal pushed submit button off screen.',
      opportunities: 'Direct intent-based native UPI button rendered statically.',
      evidence_reference: 'REC-SCREEN-2026-012',
      is_synthetic: true
    }
  ],

  '/research/surveys': [
    {
      id: 1,
      title: 'Sizing Confidence & Fit Anxiety Survey (Q1)',
      description: 'Quantitative inquiry assessing size selection confidence across 1,200 fashion shoppers.',
      target_segment: 'All Apparel Shoppers',
      status: 'Active',
      response_count: 840,
      questions: [
        { id: 101, question_text: 'How often do you order two sizes of the same item to guarantee fit?', question_type: 'Multiple Choice', options: ['Never', 'Rarely', 'Frequently', 'Always'] },
        { id: 102, question_text: 'How helpful would an automated size recommendation based on your height and weight be?', question_type: 'Rating (1-5)' },
        { id: 103, question_text: 'What is your biggest fear when ordering apparel online?', question_type: 'Text' }
      ]
    },
    {
      id: 2,
      title: 'Doorstep Return vs Exchange Satisfaction Survey',
      description: 'Post-return feedback survey analyzing customer sentiment on pickup turnaround times.',
      target_segment: 'Customers with Return Requests in Last 30 Days',
      status: 'Active',
      response_count: 420,
      questions: [
        { id: 201, question_text: 'Would you prefer an instant replacement size delivered at the exact moment of pickup?', question_type: 'Yes/No' },
        { id: 202, question_text: 'Rate your satisfaction with the courier pickup window clarity.', question_type: 'Rating (1-5)' }
      ]
    }
  ],

  '/research/validations': [
    {
      id: 1,
      pain_point_id: 1,
      hypothesis: 'Personalized size recommendations on PDP will reduce size-related return requests by at least 15% without reducing add-to-cart conversion.',
      evidence: 'Analysis of 280 synthetic return requests revealed 134 instances where the same user bought multiple sizes or cited fit discrepancies.',
      research_source: 'Customer Research Synthesis & Reverse Logistics Telemetry',
      validation_method: 'A/B Prototype & Historical Return Correlation',
      test_participants_count: 1200,
      observed_behaviour: 'Users presented with recommended size badge completed checkout 18% faster and exhibited lower return rates.',
      validation_outcome: 'Validated',
      confidence_level: 'High',
      follow_up_questions: 'Does confidence vary across body types? How do we handle new brands with limited order history?'
    },
    {
      id: 2,
      pain_point_id: 2,
      hypothesis: 'User-generated daylight customer photos will reduce color and texture returns by 20%.',
      evidence: 'Review data shows products with customer photo reviews have 32% fewer color-related queries.',
      research_source: 'Catalog Reviews & Return Reasons Audit',
      validation_method: 'User Testing & Prototype Review Flow',
      test_participants_count: 350,
      observed_behaviour: '78% of participants inspected customer photos before deciding on ethnic dresses.',
      validation_outcome: 'Validated',
      confidence_level: 'High',
      follow_up_questions: 'How do we incentivize buyers to upload well-lit daylight photos?'
    },
    {
      id: 3,
      pain_point_id: 4,
      hypothesis: 'Displaying dynamic free delivery progress bar on cart increases AOV by +8%.',
      evidence: 'Cart telemetry shows 42% of carts sit between ₹700 and ₹999 with ₹999 free shipping threshold.',
      research_source: 'Cart Telemetry & AOV Distribution',
      validation_method: 'A/B Test Prototype',
      test_participants_count: 4500,
      observed_behaviour: 'Shoppers added accessory or socks to hit ₹1,000 threshold, increasing AOV from ₹890 to ₹1,040.',
      validation_outcome: 'Validated',
      confidence_level: 'High',
      follow_up_questions: 'What low-cost add-on recommendations maximize threshold unlocks?'
    }
  ],

  '/research/journey-map': [
    { stage: '1. Discovery & Search', activity: 'Search query or browsing category pills', emotion: 'Curious & Optimistic', friction: 'Generic search results lacking style filters', drop_off_pct: '22.3%', opportunity: 'Visual semantic search & trending style badges' },
    { stage: '2. Product Listing (PLP)', activity: 'Scrolling product grids & sorting by price/relevance', emotion: 'Engaged', friction: 'Lack of instant size availability chips on card', drop_off_pct: '50.1%', opportunity: 'Inline size chips and quick-add drawer' },
    { stage: '3. Product Detail (PDP)', activity: 'Inspecting images, fabric specs, and customer reviews', emotion: 'Evaluative', friction: 'Static size tables with no body-type context', drop_off_pct: '50.0%', opportunity: 'Interactive Fit Advisor & UGC body-weight filter' },
    { stage: '4. Size Selection', activity: 'Clicking size pill (S/M/L/XL)', emotion: 'Hesitant & Anxious', friction: 'Unsure if brand runs true-to-size or small', drop_off_pct: '52.1%', opportunity: 'AI Fit Recommender with 92% accuracy badge' },
    { stage: '5. Cart & Bag', activity: 'Reviewing cart items, delivery dates, and applying coupons', emotion: 'Transactional', friction: 'Coupon codes fail without clear qualification rules', drop_off_pct: '34.9%', opportunity: 'Auto-apply best coupon logic & transparent savings' },
    { stage: '6. Payment & Checkout', activity: 'Selecting UPI, Cards, or Cash on Delivery', emotion: 'Guarded', friction: 'OTP delays and gateway latency', drop_off_pct: '28.4%', opportunity: 'One-click UPI intent checkout & saved address speed' },
    { stage: '7. Fulfillment & Delivery', activity: 'Tracking courier updates via SMS/WhatsApp', emotion: 'Anticipatory', friction: 'Out-for-delivery notification with no driver ETA', drop_off_pct: '4.8%', opportunity: 'Live GPS courier tracking link & slot rescheduling' },
    { stage: '8. Returns & Exchanges', activity: 'Initiating size exchange on mobile app', emotion: 'Frustrated', friction: 'Wait 7 days for exchange item to dispatch after return', drop_off_pct: '14.8%', opportunity: 'Instant exchange dispatch before pickup completion' }
  ],

  // --- MARKET & COMPETITORS ---
  '/market/competitors': [
    { competitor: 'Myntra (Market Leader)', market_share: '38%', strengths: 'Vast brand catalog, Studio influencers, robust logistics', weaknesses: 'App interface clutter, complex return approval friction', threat_level: 'High' },
    { competitor: 'Ajio (Reliance Retail)', market_share: '24%', strengths: 'Aggressive pricing, exclusive international high-street brands', weaknesses: 'Delivery delays, customer support resolution latency', threat_level: 'High' },
    { competitor: 'Nykaa Fashion', market_share: '14%', strengths: 'Curated premium fashion, loyal luxury beauty crossover audience', weaknesses: 'Higher price points, limited budget apparel selection', threat_level: 'Medium' },
    { competitor: 'Tata CLiQ', market_share: '9%', strengths: 'Omnichannel store-to-door network, luxury authorized warranty', weaknesses: 'Slower app discovery velocity, smaller youth demographic', threat_level: 'Low' }
  ],

  '/market/research': [
    {
      id: 1,
      title: 'Indian Online Fashion Market Sizing 2025-2028',
      summary: 'Indian fashion e-commerce is projected to expand from $14B to $35B by 2028, with Gen Z contributing 42% of incremental growth.',
      key_trends: 'Rise of fast trend discovery, body-inclusive sizing, quick return turnaround expectations.',
      implications: 'Platforms with low return friction and accurate size recommendation will dominate customer retention.'
    },
    {
      id: 2,
      title: 'Reverse Logistics & Fit Return Economics Report',
      summary: 'Reverse logistics costs average ₹140 per return in India. Eliminating 15% of size returns unlocks over ₹18M in bottom-line operational savings.',
      key_trends: 'Instant doorstep exchange swaps reduce carrier turnaround from 7 days to 24 hours.',
      implications: 'Fit accuracy directly drives gross margin expansion.'
    }
  ],

  '/market/opportunities': [
    {
      id: 1,
      title: 'AI Smart Size & Fit Predictor',
      description: 'Universal fit algorithm trained on brand spec sheets and verified customer return patterns.',
      opportunity_type: 'Core Retention & Margin Expansion',
      estimated_reach: '1.2M Shoppers / Month',
      potential_gmv_impact: '+₹4,200,000 / Month',
      status: 'Active Prototype'
    },
    {
      id: 2,
      title: '1-Click Instant Doorstep Exchange',
      description: 'Simultaneous delivery of replacement size and pickup of old size by carrier rider.',
      opportunity_type: 'Operational Experience Differentiator',
      estimated_reach: '180K Exchange Orders / Quarter',
      potential_gmv_impact: '+₹1,800,000 Saved Logistics',
      status: 'In Validation'
    }
  ],

  // --- EXPERIMENTATION ---
  '/experiments': [
    {
      id: 1,
      code: 'EXP-SIZE-FIT-01',
      name: 'Interactive Size & Fit Recommender vs Static Table',
      status: 'Running',
      hypothesis: 'Providing personalized height/weight size recommendations on PDP will increase size selection-to-cart conversion by +12%.',
      control_variant: 'Static S/M/L Size Chart (Control)',
      treatment_variant: 'Interactive 3-Question Fit Advisor (Variant B)',
      visitors_control: 15420,
      conversions_control: 1850,
      visitors_treatment: 15610,
      conversions_treatment: 2210,
      conversion_rate_control: 12.00,
      conversion_rate_treatment: 14.16,
      lift_percentage: 18.00,
      p_value: 0.00004,
      is_significant: true,
      confidence_interval: [1.12, 3.20]
    },
    {
      id: 2,
      code: 'EXP-1CLICK-UPI',
      name: 'One-Click Fast UPI Checkout vs Standard Multi-Step',
      status: 'Running',
      hypothesis: 'Direct UPI intent buttons on cart will reduce payment drop-offs by +8%.',
      control_variant: 'Traditional Redirect Gateway',
      treatment_variant: 'Instant In-App GPay/PhonePe Intent',
      visitors_control: 8200,
      conversions_control: 5412,
      visitors_treatment: 8350,
      conversions_treatment: 5890,
      conversion_rate_control: 66.00,
      conversion_rate_treatment: 70.54,
      lift_percentage: 6.88,
      p_value: 0.0003,
      is_significant: true,
      confidence_interval: [2.10, 6.98]
    }
  ],

  '/experiments/feature-flags/list': [
    { id: 1, key: 'ff_size_recommender_v2', name: 'AI Size & Fit Recommender', is_enabled: true, rollout_percentage: 50, audience: 'All Mobile Web & iOS Users', description: 'Surfaces interactive body-fit slider on fashion PDPs.' },
    { id: 2, key: 'ff_ugc_daylight_photos', name: 'UGC Daylight Customer Photos', is_enabled: true, rollout_percentage: 100, audience: 'All Storefront Traffic', description: 'Replaces studio color swatches with daylight customer photos.' },
    { id: 3, key: 'ff_instant_exchange_dispatch', name: 'Instant Exchange Before Pickup', is_enabled: false, rollout_percentage: 0, audience: 'Beta Loyalty Tier Only', description: 'Dispatches replacement size immediately upon exchange initiation.' },
    { id: 4, key: 'ff_transparent_shipping_banner', name: 'Transparent Free Shipping Threshold', is_enabled: true, rollout_percentage: 100, audience: 'All Users', description: 'Real-time sticky progress bar: Add ₹350 more for Free Express Delivery.' }
  ],

  '/experiments/usability-tasks': [
    { id: 1, task_name: 'Find and Select Recommended Size on Kurta PDP', success_rate: 94.2, avg_duration_sec: 18.5, error_count: 2 },
    { id: 2, task_name: 'Add to Cart and Proceed to UPI Checkout', success_rate: 89.6, avg_duration_sec: 24.1, error_count: 5 },
    { id: 3, task_name: 'Initiate Size Exchange from Order History', success_rate: 92.0, avg_duration_sec: 22.0, error_count: 3 }
  ],

  // --- DELIVERY / AGILE & SCRUM ---
  '/delivery/sprints': [
    { id: 1, sprint_number: 14, name: 'Sprint 14: Size Accuracy & Cart Conversion', status: 'Active', start_date: '2025-02-10', end_date: '2025-02-24', total_points: 38, completed_points: 26, velocity: 32 },
    { id: 2, sprint_number: 13, name: 'Sprint 13: Storefront Performance & PDP Vitals', status: 'Completed', start_date: '2025-01-27', end_date: '2025-02-10', total_points: 34, completed_points: 34, velocity: 34 }
  ],

  '/delivery/stories': [
    { id: 1, title: 'Implement AI Fit Advisor widget on PDP', epic: 'Size & Fit Intelligence', status: 'Done', story_points: 8, priority: 'P0', assignee: 'Rohan Verma', sprint_id: 1 },
    { id: 2, title: 'Add Customer Body Height/Weight filter to Reviews', epic: 'Customer Research & UGC', status: 'In Review', story_points: 5, priority: 'P1', assignee: 'Ananya Iyer', sprint_id: 1 },
    { id: 3, title: 'First-party size selection telemetry pipeline', epic: 'Event Telemetry & Analytics', status: 'In Progress', story_points: 5, priority: 'P0', assignee: 'Diya Patel', sprint_id: 1 },
    { id: 4, title: 'One-click UPI intent payment integration', epic: 'Frictionless Checkout', status: 'In Progress', story_points: 8, priority: 'P1', assignee: 'Rohan Verma', sprint_id: 1 },
    { id: 5, title: 'Automated 48-Hour Inbound Supplier Restock Alert', epic: 'Supply Chain Operations', status: 'Backlog', story_points: 3, priority: 'P2', assignee: 'Vikram Rao', sprint_id: 1 }
  ],

  '/delivery/roadmap': [
    { id: 1, title: 'Size & Fit Recommender Engine', quarter: 'Q1 2025', status: 'Active', target_date: '2025-03-31', owner: 'Aarav Sharma', progress: 85, impact: 'High' },
    { id: 2, title: 'Next-Gen First-Party Telemetry & Funnels', quarter: 'Q1 2025', status: 'Active', target_date: '2025-03-15', owner: 'Diya Patel', progress: 95, impact: 'High' },
    { id: 3, title: 'Instant Size Exchange Logistics Portal', quarter: 'Q2 2025', status: 'Planning', target_date: '2025-06-30', owner: 'Vikram Rao', progress: 30, impact: 'Medium' },
    { id: 4, title: 'UGC Daylight Style Discovery Feed', quarter: 'Q3 2025', status: 'Backlog', target_date: '2025-09-30', owner: 'Ananya Iyer', progress: 10, impact: 'High' }
  ],

  '/delivery/risks': [
    { id: 1, title: 'Third-party brand sizing feed inconsistencies', severity: 'High', likelihood: 'Medium', mitigation_strategy: 'Automated ingestion schema validator flagging non-standard measurements before product publish.', owner: 'Aarav Sharma' },
    { id: 2, title: '3PL courier SLA breach during festive peaks', severity: 'High', likelihood: 'High', mitigation_strategy: 'Dynamic courier load-balancing routing volume across BlueDart, Delhivery, and Shadowfax.', owner: 'Vikram Rao' }
  ],

  '/delivery/raci': [
    { id: 1, initiative: 'Size & Fit Recommender Rollout', responsible: 'Rohan Verma (Eng)', accountable: 'Aarav Sharma (PM)', consulted: 'Ananya Iyer (Design), Diya Patel (Analytics)', informed: 'Customer Support, Category Leads' },
    { id: 2, initiative: 'Instant Doorstep Exchange Flow', responsible: 'Vikram Rao (Ops)', accountable: 'Aarav Sharma (PM)', consulted: '3PL Logistics Partners, QA Lead', informed: 'All Business Stakeholders' }
  ],

  // --- OPERATIONS & SOPS ---
  '/operations/feedback': [
    { id: 1, source: 'Customer Support Escalations', team: 'Customer Support', category: 'Sizing & Returns', feedback_text: 'Customers complaining that brand Roadster shirts run 1 size smaller than standard Indian formal shirts.', sentiment: 'Negative', sentiment_score: -0.68, status: 'Actioned', pain_point_id: 1, created_at: '2025-02-12' },
    { id: 2, source: 'Merchant Operations', team: 'Merchant Ops', category: 'Catalog Integrity', feedback_text: 'Ethnic kurtas lack bust measurement specs in centimetres, causing customer confusion.', sentiment: 'Neutral', sentiment_score: -0.15, status: 'Open', created_at: '2025-02-14' },
    { id: 3, source: 'Logistics SLA Monitoring', team: 'Logistics', category: 'Delivery Performance', feedback_text: 'Reverse pickup SLA in Bengaluru South improved to 18 hours after PUDO partner integration.', sentiment: 'Positive', sentiment_score: 0.82, status: 'Reviewed', created_at: '2025-02-15' }
  ],

  '/operations/sops': [
    { id: 1, sop_code: 'SOP-FIT-001', title: 'Brand Sizing Discrepancy & Spec Calibration Protocol', category: 'Catalog Operations', version: '2.0', owner: 'Aarav Sharma', last_reviewed: '2025-02-10', content: 'Standard operating procedure for auditing partner brand size charts when return rates exceed 18%.' },
    { id: 2, sop_code: 'SOP-OPS-002', title: 'Flash Sale Fulfillment & Gateway Failover Protocol', category: 'Platform Operations', version: '1.4', owner: 'Vikram Rao', last_reviewed: '2025-01-28', content: 'Step-by-step contingency checklist for payment gateway timeouts and carrier capacity allocation during peak sale events.' }
  ],

  '/operations/releases': [
    { id: 1, release_version: 'v2.4.0', name: 'Smart Size Advisor & UGC Daylight Reviews', release_date: '2025-02-12', release_owner: 'Aarav Sharma (PM)', status: 'Production', summary: 'Introduced ML-powered size fit recommender on PDP and customer daylight photo carousel.' },
    { id: 2, release_version: 'v2.3.1', name: 'Checkout Payment Latency Optimization', release_date: '2025-01-24', release_owner: 'Rohan Verma (Eng)', status: 'Production', summary: 'Eliminated layout shifts during UPI payment selection; reduced payment drop-off by 3.2%.' }
  ],

  '/operations/knowledge': [
    { id: 1, title: 'Indian Fashion Sizing Standards Guide', category: 'Catalog Guidelines', author: 'Aarav Sharma', last_updated: '2025-02-05', summary: 'Official measurement standards for ethnic wear kurtas, western dresses, and denim across Indian consumer body profiles.' },
    { id: 2, title: 'First-Party Event Telemetry Taxonomy', category: 'Engineering Specifications', author: 'Diya Patel', last_updated: '2025-02-01', summary: 'Dictionary of all client-side telemetry events, payload parameters, and database schemas.' }
  ],

  '/operations/launch-readiness/summary': {
    total_items: 10,
    completed_items: 9,
    blockers: 0,
    readiness_percentage: 90.0,
    status: 'Ready for Staged Canary Rollout'
  },

  '/operations/launch-readiness': [
    { id: 1, item_name: 'Statistical Power Analysis Verified (Min 15,000 visitors/variant)', category: 'Analytics', owner: 'Diya Patel', status: 'Verified', is_blocker: false },
    { id: 2, item_name: 'Core Web Vitals PDP LCP < 1.8s on 4G Mobile Emulation', category: 'Engineering', owner: 'Rohan Verma', status: 'Verified', is_blocker: false },
    { id: 3, item_name: 'Figma Accessibility Contrast Specs Audited (WCAG AA)', category: 'Design', owner: 'Ananya Iyer', status: 'Verified', is_blocker: false },
    { id: 4, item_name: 'End-to-End Automated Cypress/Vitest Test Pass Rate 100%', category: 'QA', owner: 'Meera Nair', status: 'Verified', is_blocker: false },
    { id: 5, item_name: 'Carrier 3PL Pickup SLA Signed for 24-Hour Express Exchange', category: 'Operations', owner: 'Vikram Rao', status: 'Verified', is_blocker: false }
  ],

  // --- SUPPLY CHAIN ---
  '/supply-chain/metrics': {
    inbound: {
      on_time_fulfillment_rate: 94.6,
      supplier_rejection_rate: 2.1,
      avg_lead_time_days: 4.8,
      active_suppliers: 38
    },
    outbound: {
      first_attempt_delivery_rate: 89.4,
      rto_rate: 8.6,
      transit_sla_compliance: 96.2,
      active_3pl_partners: 4
    },
    return_reasons: [
      { reason: 'Size / Fit Mismatch', percentage: 58.2 },
      { reason: 'Fabric / Material Not as Expected', percentage: 18.4 },
      { reason: 'Color Discrepancy from Photos', percentage: 12.1 },
      { reason: 'Defective Stitching or Packaging', percentage: 6.8 },
      { reason: 'Delayed Delivery After Event Date', percentage: 4.5 }
    ]
  },

  '/supply-chain/inventory/low-stock': [
    { id: 1, product_name: 'Men Relaxed Fit Poplin Casual Shirt', brand: 'Roadster', size: 'M', current_stock: 3, reorder_threshold: 8, lead_time_days: 5, supplier: 'Pacific Denim Dynamics' },
    { id: 2, product_name: 'Women Embroidered Anarkali Kurta Set', brand: 'Anouk', size: 'L', current_stock: 4, reorder_threshold: 8, lead_time_days: 8, supplier: 'Apex Apparel Craftsmen' },
    { id: 3, product_name: 'HRX Rapid-Dry Training Joggers', brand: 'HRX', size: 'M', current_stock: 2, reorder_threshold: 8, lead_time_days: 6, supplier: 'Vanguard Textile Mills Ltd' }
  ],

  // --- SETTINGS ---
  '/settings': {
    gemini_api_key_configured: false,
    gemini_model: 'gemini-1.5-pro',
    environment: 'production',
    database_url: 'postgresql://postgres:***@localhost:5432/threadiq',
    total_database_records: 27100,
    system_version: '1.0.0'
  },

  '/settings/audit-logs': [
    { id: 1, user_name: 'Aarav Sharma', action: 'ROLE_SWITCH', entity: 'USER', entity_id: '1', details: 'Switched role to Product Manager', timestamp: '5m ago' },
    { id: 2, user_name: 'Diya Patel', action: 'EXPORT', entity: 'ANALYTICS', entity_id: 'FUNNEL', details: 'Exported 6-Stage Funnel to Excel', timestamp: '22m ago' },
    { id: 3, user_name: 'Rohan Verma', action: 'FEATURE_FLAG_UPDATE', entity: 'EXPERIMENT', entity_id: 'ff_size_recommender_v2', details: 'Updated rollout to 50%', timestamp: '1h ago' }
  ]
};

// 100 Fashion Products Mock Generator matching backend schema
export const MOCK_PRODUCTS: any[] = [
  { id: 1, name: 'Men Relaxed Fit Poplin Casual Shirt', brand: 'Roadster', category: 'Casual Shirts & Tops', price: 999, original_price: 1999, discount_percent: 50, rating: 4.3, rating_count: 1420, in_stock: true, is_bestseller: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy Blue', 'Olive Green', 'White'], image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', fabric: '100% Cotton Poplin', fit: 'Relaxed Casual Fit', return_rate: 8.2 },
  { id: 2, name: 'Women Embroidered Anarkali Kurta Set', brand: 'Anouk', category: 'Ethnic Wear', price: 2499, original_price: 4999, discount_percent: 50, rating: 4.6, rating_count: 2180, in_stock: true, is_bestseller: true, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Maroon', 'Teal Green', 'Mustard'], image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', fabric: 'Chanderi Silk Blend', fit: 'Flared Regular', return_rate: 11.4 },
  { id: 3, name: 'HRX Rapid-Dry Training Joggers', brand: 'HRX by Hrithik Roshan', category: 'Athleisure & Activewear', price: 1299, original_price: 2599, discount_percent: 50, rating: 4.4, rating_count: 3200, in_stock: true, is_bestseller: true, sizes: ['M', 'L', 'XL'], colors: ['Jet Black', 'Anthracite Grey'], image_url: 'https://images.unsplash.com/photo-1483721074574-e3f4e2f9d6c7?auto=format&fit=crop&w=800&q=80', fabric: 'Polyester Elastane Blend', fit: 'Tapered Athletic Fit', return_rate: 6.9 },
  { id: 4, name: 'Women Tailored Double-Breasted Blazer', brand: 'Mango', category: 'Western Wear', price: 4590, original_price: 7990, discount_percent: 42, rating: 4.7, rating_count: 890, in_stock: true, is_bestseller: false, sizes: ['S', 'M', 'L'], colors: ['Classic Beige', 'Midnight Black'], image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', fabric: 'Structured Viscose Blend', fit: 'Tailored Smart Fit', return_rate: 9.1 },
  { id: 5, name: 'Vintage Washed Slim Fit Stretch Jeans', brand: 'Highlander', category: 'Denim & Trousers', price: 1199, original_price: 2399, discount_percent: 50, rating: 4.1, rating_count: 4500, in_stock: true, is_bestseller: true, sizes: ['30', '32', '34', '36'], colors: ['Indigo Wash', 'Light Blue Bleach'], image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80', fabric: '98% Cotton 2% Elastane', fit: 'Slim Fit', return_rate: 14.2 },
  { id: 6, name: 'Floral Print Tiered Midi Dress', brand: 'Tokyo Talkies', category: 'Dresses & Jumpsuits', price: 899, original_price: 1899, discount_percent: 53, rating: 4.2, rating_count: 1750, in_stock: true, is_bestseller: true, sizes: ['XS', 'S', 'M', 'L'], colors: ['Sage Green', 'Blush Pink'], image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', fabric: 'Georgette', fit: 'Flowy Tiered Fit', return_rate: 13.8 },
  { id: 7, name: 'Streetwear Chunky Sole Low-Top Sneakers', brand: 'Roadster', category: 'Footwear & Sneakers', price: 1799, original_price: 3499, discount_percent: 48, rating: 4.3, rating_count: 2840, in_stock: true, is_bestseller: true, sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'], colors: ['White & Grey', 'All Black'], image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', fabric: 'Faux Leather & Mesh', fit: 'True to Size', return_rate: 10.5 },
  { id: 8, name: 'Pure Handloom Cotton Printed Kurta', brand: 'Taavi', category: 'Ethnic Wear', price: 1499, original_price: 2999, discount_percent: 50, rating: 4.5, rating_count: 980, in_stock: true, is_bestseller: false, sizes: ['S', 'M', 'L', 'XL'], colors: ['Indigo Handblock', 'Rust Red'], image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', fabric: '100% Handloom Cotton', fit: 'Straight Comfort Fit', return_rate: 7.4 }
];
