// Comprehensive mock data fallback for live web deployment
export const MOCK_DATA: Record<string, any> = {
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
      { id: 3, type: 'success', title: 'A/B Test Significant', message: 'EXP-SIZE-FIT-01 reached 99.1% statistical confidence with +14.2% lift.', timestamp: '1h ago' }
    ],
    recent_activity: [
      { id: 1, user: 'Aarav Sharma', role: 'Product Manager', action: 'Approved PRD', target: 'Size & Fit Recommender v2.1', time: '15m ago' },
      { id: 2, user: 'Diya Patel', role: 'Product Analyst', action: 'Ran Cohort Analysis', target: 'Week 42 Retention Heatmap', time: '42m ago' },
      { id: 3, user: 'Rohan Verma', role: 'Engineer', action: 'Toggled Feature Flag', target: 'ff_instant_checkout_v2 (50% rollout)', time: '2h ago' }
    ]
  },

  '/analytics/funnel?device=all': {
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

  '/research/personas': [
    {
      id: 1,
      persona_code: 'GEN-Z',
      name: 'Riya - The Gen-Z Trend Hunter',
      age_range: '18-24',
      occupation: 'College Student / Intern',
      income_bracket: 'Tier 1 Metro (Allowance / ₹25k)',
      archetype: 'Trend-First Fast Fashion',
      primary_goals: 'Discover viral Instagram/Pinterest styles under ₹1,500 with zero wait time.',
      pain_points: 'Inconsistent sizing across trendy brands; return pickups take 4+ days.',
      preferred_categories: 'Western Wear, Crop Tops, Oversized Hoodies, Chunky Sneakers',
      device_preference: 'Mobile App (iOS/Android)',
      price_sensitivity: 'High',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      persona_code: 'CORP-PRO',
      name: 'Arjun - The Urban Professional',
      age_range: '28-36',
      occupation: 'Tech Lead / Consultant',
      income_bracket: '₹18L - ₹35L / annum',
      archetype: 'Quality & Convenience First',
      primary_goals: 'Build a durable smart-casual wardrobe without spending hours scrolling.',
      pain_points: 'Linen and shirt sizing differs drastically between formal and casual fits.',
      preferred_categories: 'Casual Shirts, Slim Chinos, Linen Blazers, Minimal Loafers',
      device_preference: 'Mobile Web & Desktop',
      price_sensitivity: 'Low',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      persona_code: 'OCCASION',
      name: 'Pooja - The Festive & Ethnic Connoisseur',
      age_range: '26-42',
      occupation: 'Marketing Director & Homemaker',
      income_bracket: '₹12L - ₹25L / annum',
      archetype: 'Authenticity & Craft Enthusiast',
      primary_goals: 'Find authentic handcrafted kurtas, lehengas, and artisanal jewelry for weddings.',
      pain_points: 'Fabric drape and real color vibrancy look totally different in customer photos vs studio lights.',
      preferred_categories: 'Ethnic Wear, Anarkalis, Pure Cotton Sarees, Statement Jewelry',
      device_preference: 'Mobile App (Android)',
      price_sensitivity: 'Medium',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      persona_code: 'VALUE-FAM',
      name: 'Sunita - The Value Family Shopper',
      age_range: '35-50',
      occupation: 'School Educator',
      income_bracket: '₹8L - ₹15L / annum',
      archetype: 'Budget Optimizer & Multi-Cart',
      primary_goals: 'Maximize festive discounts, bundle kidswear and family casuals in single shipments.',
      pain_points: 'High delivery fees on split shipments; complex coupon discount conditions.',
      preferred_categories: 'Loungewear, Kids Casuals, Everyday Kurtas, Cotton Trousers',
      device_preference: 'Desktop & Mobile App',
      price_sensitivity: 'High',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 5,
      persona_code: 'ACTIVE',
      name: 'Kabir - The Athleisure Enthusiast',
      age_range: '22-32',
      occupation: 'Product Specialist & Marathoner',
      income_bracket: '₹10L - ₹20L / annum',
      archetype: 'Performance & Fit Driven',
      primary_goals: 'Performance gym wear, sweat-wicking tees, and trail-running sneakers.',
      pain_points: 'Compression tights roll down; lack of stretch elasticity specs.',
      preferred_categories: 'Athleisure, Compression Tights, Dry-Fit Tees, Training Shorts',
      device_preference: 'Mobile App',
      price_sensitivity: 'Medium',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    }
  ],

  '/research/pain-points': [
    { id: 1, title: 'Size Chart Inconsistency Across Partner Brands', stage: 'Size & Fit Selection', severity: 'Critical', frequency: 342, impact: 'High', status: 'In Validation', proposed_solution: 'AI Body-Measurement Predictor & Universal Fit Score' },
    { id: 2, title: 'Color Discrepancy Between Studio Photos and Real Daylight', stage: 'Product Detail (PDP)', severity: 'High', frequency: 219, impact: 'High', status: 'Validated', proposed_solution: 'UGC Daylight Customer Photo Carousel' },
    { id: 3, title: 'Stockout on High-Demand Sizes (M/L) in Fast-Moving Western Wear', stage: 'Size & Fit Selection', severity: 'High', frequency: 188, impact: 'High', status: 'In Validation', proposed_solution: 'Automated 48-Hour Supplier Restock Triggers' },
    { id: 4, title: 'Surprise Delivery Surcharges at Final Payment Step', stage: 'Order Placed (Purchase)', severity: 'High', frequency: 164, impact: 'Medium', status: 'Backlog', proposed_solution: 'Upfront Transparent Shipping Threshold Banner' },
    { id: 5, title: 'Return Pickup Slowness in Tier 2/Tier 3 Pin Codes', stage: 'Post-Purchase & Returns', severity: 'Medium', frequency: 142, impact: 'Medium', status: 'In Validation', proposed_solution: 'PUDO Partner Locker & Drop-Off Network' }
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

  '/operations/sops': [
    { id: 1, sop_code: 'SOP-FIT-001', title: 'Brand Sizing Discrepancy & Spec Calibration Protocol', category: 'Catalog Operations', version: '2.0', owner: 'Aarav Sharma', last_reviewed: '2025-02-10', content: 'Standard operating procedure for auditing partner brand size charts when return rates exceed 18%.' },
    { id: 2, sop_code: 'SOP-OPS-002', title: 'Flash Sale Fulfillment & Gateway Failover Protocol', category: 'Platform Operations', version: '1.4', owner: 'Vikram Rao', last_reviewed: '2025-01-28', content: 'Step-by-step contingency checklist for payment gateway timeouts and carrier capacity allocation during peak sale events.' }
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

  '/market/competitors': [
    { competitor: 'Myntra (Market Leader)', market_share: '38%', strengths: 'Vast brand catalog, Studio influencers, robust logistics', weaknesses: 'App interface clutter, complex return approval friction', threat_level: 'High' },
    { competitor: 'Ajio (Reliance Retail)', market_share: '24%', strengths: 'Aggressive pricing, exclusive international high-street brands', weaknesses: 'Delivery delays, customer support resolution latency', threat_level: 'High' },
    { competitor: 'Nykaa Fashion', market_share: '14%', strengths: 'Curated premium fashion, loyal luxury beauty crossover audience', weaknesses: 'Higher price points, limited budget apparel selection', threat_level: 'Medium' },
    { competitor: 'Tata CLiQ', market_share: '9%', strengths: 'Omnichannel store-to-door network, luxury authorized warranty', weaknesses: 'Slower app discovery velocity, smaller youth demographic', threat_level: 'Low' }
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
