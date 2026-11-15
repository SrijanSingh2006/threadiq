import { MOCK_DATA, MOCK_PRODUCTS } from './mockData';

const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // If status 200 and Content-Type is application/json, it's a real API response
    if (response.ok && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        const trimmed = text.trim();
        if (
          trimmed.startsWith('<') ||
          trimmed.toLowerCase().includes('<!doctype') ||
          trimmed.toLowerCase().includes('<html')
        ) {
          const fallback = getMockFallback<T>(endpoint, options);
          return fallback !== undefined ? fallback : getSafeGenericFallback<T>(endpoint);
        }
        return JSON.parse(text);
      } catch (parseErr) {
        const fallback = getMockFallback<T>(endpoint, options);
        return fallback !== undefined ? fallback : getSafeGenericFallback<T>(endpoint);
      }
    }

    // If response is HTML (Vercel SPA rewrite fallback returning <!doctype html>) or non-200
    const fallback = getMockFallback<T>(endpoint, options);
    if (fallback !== undefined) {
      return fallback;
    }

    // Try reading error text safely if not HTML
    try {
      const errorText = await response.text();
      const lower = errorText.toLowerCase();
      if (lower.includes('<!doctype') || lower.includes('<html') || lower.trim().startsWith('<')) {
        return getSafeGenericFallback<T>(endpoint);
      }

      let errorDetail = response.statusText;
      try {
        const parsed = JSON.parse(errorText);
        errorDetail = parsed.detail || errorDetail;
      } catch {}
      throw new Error(errorDetail || `Request failed with status ${response.status}`);
    } catch (readErr: any) {
      if (
        readErr.message &&
        !readErr.message.includes('<!doctype') &&
        !readErr.message.includes('<html') &&
        !readErr.message.includes('Unexpected token') &&
        !readErr.message.includes('is not valid JSON')
      ) {
        throw readErr;
      }
      return getSafeGenericFallback<T>(endpoint);
    }
  } catch (err: any) {
    // Network error, JSON parse failure on <!doctype, or offline mode
    const fallback = getMockFallback<T>(endpoint, options);
    if (fallback !== undefined) {
      return fallback;
    }
    return getSafeGenericFallback<T>(endpoint);
  }
}

function getSafeGenericFallback<T>(endpoint: string): T {
  const cleanEndpoint = endpoint.split('?')[0];
  // If endpoint represents a collection (plural), return empty array
  if (
    cleanEndpoint.endsWith('s') ||
    cleanEndpoint.includes('/list') ||
    cleanEndpoint.includes('catalog')
  ) {
    return [] as unknown as T;
  }
  return {} as unknown as T;
}

function getMockFallback<T>(endpoint: string, options: RequestInit): T | undefined {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const basePath = cleanEndpoint.split('?')[0];

  // 1. Direct match in MOCK_DATA
  if (MOCK_DATA[cleanEndpoint]) {
    return MOCK_DATA[cleanEndpoint] as T;
  }

  // 2. Base path match (ignore query params)
  if (MOCK_DATA[basePath]) {
    return MOCK_DATA[basePath] as T;
  }

  // Dynamic Experiment Statistics
  if (cleanEndpoint.includes('/experiments/') && cleanEndpoint.includes('/statistics')) {
    return {
      experiment_id: 1,
      control: { sample_size: 15420, conversions: 527, conversion_rate: 3.42, ci_lower_95: 3.13, ci_upper_95: 3.71 },
      variant: { sample_size: 15380, conversions: 638, conversion_rate: 4.15, ci_lower_95: 3.83, ci_upper_95: 4.47 },
      relative_lift_percent: 21.35,
      absolute_difference: 0.73,
      z_score: 3.48,
      p_value: 0.0005,
      is_significant: true,
      confidence_level: '99% Significant'
    } as unknown as T;
  }

  // Dynamic Sprint Burndown Trajectory
  if (cleanEndpoint.includes('/delivery/sprints/') && cleanEndpoint.includes('/burndown')) {
    const days = [
      { day: 'Day 1', ideal_remaining_points: 42, actual_remaining_points: 42 },
      { day: 'Day 2', ideal_remaining_points: 37.3, actual_remaining_points: 40 },
      { day: 'Day 3', ideal_remaining_points: 32.7, actual_remaining_points: 37 },
      { day: 'Day 4', ideal_remaining_points: 28.0, actual_remaining_points: 33 },
      { day: 'Day 5', ideal_remaining_points: 23.3, actual_remaining_points: 29 },
      { day: 'Day 6', ideal_remaining_points: 18.7, actual_remaining_points: 24 },
      { day: 'Day 7', ideal_remaining_points: 14.0, actual_remaining_points: 20 },
      { day: 'Day 8', ideal_remaining_points: 9.3, actual_remaining_points: 16 },
      { day: 'Day 9', ideal_remaining_points: 4.7, actual_remaining_points: 13 },
      { day: 'Day 10', ideal_remaining_points: 0, actual_remaining_points: 13 }
    ];
    return {
      sprint_id: 1,
      sprint_name: 'Sprint 14: Size Accuracy & Cart Conversion',
      total_committed_points: 42,
      completed_points: 13,
      remaining_points: 29,
      days
    } as unknown as T;
  }

  // 3. Dynamic Mutations (POST / PUT)
  if (options.method === 'POST' || options.method === 'PUT') {
    let body: any = {};
    try {
      body = JSON.parse(options.body as string || '{}');
    } catch {}

    const generatedId = Math.floor(1000 + Math.random() * 9000);

    if (cleanEndpoint.includes('/convert-to-pain-point')) {
      return { success: true, pain_point_id: generatedId, message: 'Converted successfully' } as unknown as T;
    }

    if (cleanEndpoint.startsWith('/storefront/checkout')) {
      return {
        order_number: `ORD-2025-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'CONFIRMED',
        total_amount: body.total_amount || 2410,
        delivery_estimate: '3-5 Business Days',
        message: 'Order simulated successfully. First-party purchase event tracked in database.'
      } as unknown as T;
    }

    if (cleanEndpoint.startsWith('/copilot/generate')) {
      const promptText = body.prompt || '';
      const workflow = body.workflow_type || 'Product Management Intelligence';

      return {
        insight: `### ThreadIQ Intelligence Output: ${workflow}

#### 1. Strategic Context & Data Grounding
Based on synthesized behavioral data across **62,450 sessions**, **100 catalog SKUs**, and **20,000 first-party product events**:
- **Primary Funnel Drop-off**: Size & Fit Selection accounts for **50.0%** of customer drop-offs on Western Wear and Ethnic categories.
- **Root Cause Friction**: 38.4% of sizing drop-offs stem from non-standard size charts across third-party brands, and 58.2% of post-purchase returns cite size mismatch.
- **Active Experimentation**: EXP-SIZE-FIT-01 demonstrates a **+18.0% conversion lift** ($p < 0.001$, 99% confidence interval $[1.12\\%, 3.20\\%]$).

#### 2. Key Actionable Recommendations
1. **Accelerate Universal Size Advisor Rollout**: Ramp up feature flag \`ff_size_recommender_v2\` from 50% to 100% across mobile web traffic.
2. **Implement UGC Daylight Customer Photos**: Replace flat studio color swatches with verified customer daylight photographs to reduce color-related returns by an estimated **3.2%**.
3. **Execute Automated Supplier Restock SOP**: Trigger 48-hour supplier alerts for high-velocity M and L size variants currently below safety stock threshold (< 5 units).

#### 3. Cross-Functional RACI & Delivery
- **Product & Design**: Finalize Figma WCAG-AA token specifications for size selector chips.
- **Engineering**: Land 1-click UPI intent checkout in Sprint 14 to capture ₹380,000 in monthly recovered GMV.
- **Operations**: Sign revised 3PL courier SLA guaranteeing 24-hour express return-to-exchange pickups.`,
        model: 'ThreadIQ Domain Knowledge Engine (Fallback Mode)',
        grounding_records_queried: 142
      } as unknown as T;
    }

    // Default object creation return
    return {
      id: generatedId,
      ...body,
      status: body.status || 'Active',
      created_at: new Date().toISOString()
    } as unknown as T;
  }

  // 4. Products list & Details
  if (cleanEndpoint.startsWith('/storefront/products')) {
    if (cleanEndpoint.includes('/recommendations')) {
      return MOCK_PRODUCTS.slice(0, 4) as unknown as T;
    }
    const matchId = cleanEndpoint.match(/\/storefront\/products\/(\d+)/);
    if (matchId) {
      const id = parseInt(matchId[1]);
      const prod = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
      return prod as unknown as T;
    }

    // Support query parameter filtering (category_id, brand_id, search, sort_by)
    if (cleanEndpoint.includes('?')) {
      const queryString = cleanEndpoint.split('?')[1];
      const params = new URLSearchParams(queryString);
      const catId = params.get('category_id');
      const brandId = params.get('brand_id');
      const search = params.get('search')?.toLowerCase();
      const sortBy = params.get('sort_by');

      let filtered = [...MOCK_PRODUCTS];
      if (catId) {
        filtered = filtered.filter(p => p.category_id === parseInt(catId));
      }
      if (brandId) {
        filtered = filtered.filter(p => p.brand_id === parseInt(brandId));
      }
      if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.brand?.name?.toLowerCase().includes(search));
      }
      if (sortBy === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
      return (filtered.length > 0 ? filtered : MOCK_PRODUCTS) as unknown as T;
    }

    return MOCK_PRODUCTS as unknown as T;
  }

  // 5. Categories & Brands
  if (cleanEndpoint.startsWith('/storefront/categories')) {
    return [
      { id: 1, name: 'Ethnic Wear', slug: 'ethnic-wear', product_count: 14 },
      { id: 2, name: 'Western Wear', slug: 'western-wear', product_count: 16 },
      { id: 3, name: 'Casual Shirts & Tops', slug: 'shirts-tops', product_count: 12 },
      { id: 4, name: 'Denim & Trousers', slug: 'denim-trousers', product_count: 10 },
      { id: 5, name: 'Dresses & Jumpsuits', slug: 'dresses-jumpsuits', product_count: 11 },
      { id: 6, name: 'Athleisure & Activewear', slug: 'athleisure', product_count: 9 },
      { id: 7, name: 'Footwear & Sneakers', slug: 'footwear', product_count: 10 },
      { id: 8, name: 'Winterwear & Jackets', slug: 'winterwear', product_count: 8 },
      { id: 9, name: 'Fashion Accessories', slug: 'accessories', product_count: 6 },
      { id: 10, name: 'Loungewear & Sleepwear', slug: 'loungewear', product_count: 4 }
    ] as unknown as T;
  }

  if (cleanEndpoint.startsWith('/storefront/brands')) {
    return [
      { id: 1, name: 'Roadster', tier: 'Fast Fashion' },
      { id: 2, name: 'HRX by Hrithik Roshan', tier: 'Athleisure' },
      { id: 3, name: 'Anouk', tier: 'Ethnic' },
      { id: 4, name: 'Tokyo Talkies', tier: 'Fast Fashion' },
      { id: 5, name: 'Mango', tier: 'Premium' },
      { id: 6, name: 'Mast & Harbour', tier: 'Mid-Range' },
      { id: 7, name: 'W for Woman', tier: 'Ethnic' },
      { id: 8, name: 'Dressberry', tier: 'Fast Fashion' },
      { id: 9, name: 'Taavi', tier: 'D2C' },
      { id: 10, name: 'Highlander', tier: 'Mid-Range' }
    ] as unknown as T;
  }

  // 6. Experiments sub-routes
  if (cleanEndpoint.includes('/statistics')) {
    return {
      experiment_code: 'EXP-SIZE-FIT-01',
      two_proportion_z_score: 3.94,
      p_value: 0.00004,
      confidence_interval_95: [1.12, 3.20],
      statistical_power: 0.98,
      is_statistically_significant: true,
      recommendation: 'Graduate Variant B (Personalized Fit Recommender) to 100% production rollout.'
    } as unknown as T;
  }

  // 7. Delivery sub-routes
  if (cleanEndpoint.includes('/burndown')) {
    return {
      sprint_number: 14,
      ideal_burndown: [38, 34, 30, 26, 22, 18, 14, 10, 6, 2, 0],
      actual_burndown: [38, 36, 32, 28, 26, 22, 19, 15, 12, null, null],
      days: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11']
    } as unknown as T;
  }

  // 8. Auth
  if (cleanEndpoint.startsWith('/auth/')) {
    return {
      id: 1,
      email: 'pm@threadiq.internal',
      full_name: 'Aarav Sharma',
      role: 'Product Manager',
      access_token: 'tiq_demo_jwt_token',
      token_type: 'bearer',
      user: {
        id: 1,
        email: 'pm@threadiq.internal',
        full_name: 'Aarav Sharma',
        role: 'Product Manager'
      }
    } as unknown as T;
  }

  // 9. Reports & Tableau
  if (cleanEndpoint.startsWith('/reports/catalog')) {
    return [
      { id: 'funnel_report', name: '6-Stage Funnel Conversion Report', format: 'CSV & XLSX', description: 'Session to purchase conversion rates and drop-offs.' },
      { id: 'orders_report', name: 'Order & Revenue Ledger', format: 'CSV & XLSX', description: 'Comprehensive transaction history with customer segments.' },
      { id: 'experiments_report', name: 'A/B Testing Statistical Summary', format: 'CSV & XLSX', description: 'Sample sizes, z-scores, p-values, and 95% confidence intervals.' },
      { id: 'supply_chain_report', name: 'Supplier & 3PL Logistics Scorecard', format: 'CSV & XLSX', description: 'Fulfillment rates, lead times, and return root causes.' }
    ] as unknown as T;
  }

  if (cleanEndpoint.startsWith('/reports/tableau/meta')) {
    return {
      database_type: 'PostgreSQL / Tableau Prep',
      connection_host: 'localhost:5432',
      database_name: 'threadiq',
      star_schema_tables: ['Fact_Product_Events', 'Fact_Orders', 'Dim_Products', 'Dim_Customers'],
      instructions: 'Connect Tableau Desktop or Tableau Prep to PostgreSQL using the credentials specified in .env.'
    } as unknown as T;
  }

  return getSafeGenericFallback<T>(endpoint);
}

export const api = {
  // Auth
  auth: {
    login: (creds: { email: string; password?: string }) =>
      fetchApi<any>('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
    getMe: () => fetchApi<any>('/auth/me'),
    switchRole: (role: string) =>
      fetchApi<any>('/auth/switch-role', { method: 'POST', body: JSON.stringify({ role }) }),
  },

  // Overview
  overview: {
    getMetrics: () => fetchApi<any>('/overview/metrics'),
  },

  // Research
  research: {
    getProjects: () => fetchApi<any[]>('/research/projects'),
    createProject: (data: any) =>
      fetchApi<any>('/research/projects', { method: 'POST', body: JSON.stringify(data) }),
    getInterviews: (projectId?: number) =>
      fetchApi<any[]>(`/research/interviews${projectId ? `?project_id=${projectId}` : ''}`),
    createInterview: (data: any) =>
      fetchApi<any>('/research/interviews', { method: 'POST', body: JSON.stringify(data) }),
    getSurveys: () => fetchApi<any[]>('/research/surveys'),
    createSurvey: (data: any) =>
      fetchApi<any>('/research/surveys', { method: 'POST', body: JSON.stringify(data) }),
    getPersonas: () => fetchApi<any[]>('/research/personas'),
    createPersona: (data: any) =>
      fetchApi<any>('/research/personas', { method: 'POST', body: JSON.stringify(data) }),
    getPainPoints: () => fetchApi<any[]>('/research/pain-points'),
    createPainPoint: (data: any) =>
      fetchApi<any>('/research/pain-points', { method: 'POST', body: JSON.stringify(data) }),
    getValidations: () => fetchApi<any[]>('/research/validations'),
    createValidation: (data: any) =>
      fetchApi<any>('/research/validations', { method: 'POST', body: JSON.stringify(data) }),
    getJourneyMap: () => fetchApi<any[]>('/research/journey-map'),
  },

  // Market
  market: {
    getResearch: () => fetchApi<any[]>('/market/research'),
    createResearch: (data: any) =>
      fetchApi<any>('/market/research', { method: 'POST', body: JSON.stringify(data) }),
    getCompetitors: () => fetchApi<any[]>('/market/competitors'),
    getOpportunities: () => fetchApi<any[]>('/market/opportunities'),
    createOpportunity: (data: any) =>
      fetchApi<any>('/market/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Storefront
  storefront: {
    getCategories: () => fetchApi<any[]>('/storefront/categories'),
    getBrands: () => fetchApi<any[]>('/storefront/brands'),
    getProducts: (params?: { category_id?: number; brand_id?: number; search?: string; sort_by?: string; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.category_id) q.set('category_id', String(params.category_id));
      if (params?.brand_id) q.set('brand_id', String(params.brand_id));
      if (params?.search) q.set('search', params.search);
      if (params?.sort_by) q.set('sort_by', params.sort_by);
      if (params?.limit) q.set('limit', String(params.limit));
      return fetchApi<any[]>(`/storefront/products?${q.toString()}`);
    },
    getProductDetail: (id: number) => fetchApi<any>(`/storefront/products/${id}`),
    getRecommendations: (id: number) => fetchApi<any[]>(`/storefront/products/${id}/recommendations`),
    checkout: (order: any) =>
      fetchApi<any>('/storefront/checkout', { method: 'POST', body: JSON.stringify(order) }),
    trackOrder: (orderNum: string) => fetchApi<any>(`/storefront/orders/${orderNum}`),
    requestReturn: (data: any) =>
      fetchApi<any>('/storefront/returns', { method: 'POST', body: JSON.stringify(data) }),
    requestExchange: (data: any) =>
      fetchApi<any>('/storefront/exchanges', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Analytics
  analytics: {
    recordEvent: (event: any) =>
      fetchApi<any>('/analytics/events', { method: 'POST', body: JSON.stringify(event) }),
    getRecentEvents: (limit: number = 30) => fetchApi<any[]>(`/analytics/events?limit=${limit}`),
    getFunnel: (device: string = 'all') => fetchApi<any>(`/analytics/funnel?device=${device}`),
    getRootCause: (stageName?: string) =>
      fetchApi<any>(`/analytics/root-cause${stageName ? `?stage_name=${encodeURIComponent(stageName)}` : ''}`),
    getCohorts: () => fetchApi<any>('/analytics/cohorts'),
    getRFM: () => fetchApi<any>('/analytics/rfm'),
    getMetrics: () => fetchApi<any[]>('/analytics/metrics'),
    getFeatureKPIs: () => fetchApi<any[]>('/analytics/feature-kpis'),
  },

  // Experiments
  experiments: {
    getExperiments: () => fetchApi<any[]>('/experiments'),
    getExperiment: (id: number) => fetchApi<any>(`/experiments/${id}`),
    createExperiment: (data: any) =>
      fetchApi<any>('/experiments', { method: 'POST', body: JSON.stringify(data) }),
    assignUser: (experiment_code: string, user_id: string) =>
      fetchApi<any>('/experiments/assign', { method: 'POST', body: JSON.stringify({ experiment_code, user_id }) }),
    getStatistics: (id: number) => fetchApi<any>(`/experiments/${id}/statistics`),
    getFeatureFlags: () => fetchApi<any[]>('/experiments/feature-flags/list'),
    updateFeatureFlag: (id: number, data: any) =>
      fetchApi<any>(`/experiments/feature-flags/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getUsabilityTasks: () => fetchApi<any[]>('/experiments/usability-tasks'),
    submitUsabilityResult: (data: any) =>
      fetchApi<any>('/experiments/usability-results', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Operations
  operations: {
    getFeedback: (team?: string) =>
      fetchApi<any[]>(`/operations/feedback${team ? `?team=${team}` : ''}`),
    submitFeedback: (data: any) =>
      fetchApi<any>('/operations/feedback', { method: 'POST', body: JSON.stringify(data) }),
    updateFeedback: (id: number, data: any) =>
      fetchApi<any>(`/operations/feedback/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    convertToPainPoint: (id: number) =>
      fetchApi<any>(`/operations/feedback/${id}/convert-to-pain-point`, { method: 'POST' }),
    getSOPs: (category?: string) =>
      fetchApi<any[]>(`/operations/sops${category ? `?category=${category}` : ''}`),
    createSOP: (data: any) =>
      fetchApi<any>('/operations/sops', { method: 'POST', body: JSON.stringify(data) }),
    updateSOP: (id: number, data: any) =>
      fetchApi<any>(`/operations/sops/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getReleases: () => fetchApi<any[]>('/operations/releases'),
    createRelease: (data: any) =>
      fetchApi<any>('/operations/releases', { method: 'POST', body: JSON.stringify(data) }),
    updateRelease: (id: number, data: any) =>
      fetchApi<any>(`/operations/releases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getKnowledge: (cat?: string) =>
      fetchApi<any[]>(`/operations/knowledge${cat ? `?category=${cat}` : ''}`),
    createKnowledge: (data: any) =>
      fetchApi<any>('/operations/knowledge', { method: 'POST', body: JSON.stringify(data) }),
    getLaunchChecklist: () => fetchApi<any[]>('/operations/launch-readiness'),
    getLaunchSummary: () => fetchApi<any>('/operations/launch-readiness/summary'),
    updateChecklistItem: (id: number, data: any) =>
      fetchApi<any>(`/operations/launch-readiness/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Program Delivery (Agile/Scrum)
  delivery: {
    getRoadmap: () => fetchApi<any[]>('/delivery/roadmap'),
    createInitiative: (data: any) =>
      fetchApi<any>('/delivery/roadmap', { method: 'POST', body: JSON.stringify(data) }),
    updateInitiative: (id: number, data: any) =>
      fetchApi<any>(`/delivery/roadmap/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getSprints: () => fetchApi<any[]>('/delivery/sprints'),
    getSprintBurndown: (id: number) => fetchApi<any>(`/delivery/sprints/${id}/burndown`),
    getStories: (sprintId?: number) =>
      fetchApi<any[]>(`/delivery/stories${sprintId ? `?sprint_id=${sprintId}` : ''}`),
    createStory: (data: any) =>
      fetchApi<any>('/delivery/stories', { method: 'POST', body: JSON.stringify(data) }),
    updateStory: (id: number, data: any) =>
      fetchApi<any>(`/delivery/stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    moveStory: (story_id: number, new_status: string, new_order: number = 0) =>
      fetchApi<any>('/delivery/stories/move', { method: 'POST', body: JSON.stringify({ story_id, new_status, new_order }) }),
    getRisks: () => fetchApi<any[]>('/delivery/risks'),
    getRACI: () => fetchApi<any[]>('/delivery/raci'),
  },

  // Supply Chain
  supplyChain: {
    getMetrics: () => fetchApi<any>('/supply-chain/metrics'),
    getLowStock: () => fetchApi<any[]>('/supply-chain/inventory/low-stock'),
  },

  // Copilot
  copilot: {
    generateInsight: (req: { prompt: string; workflow_type?: string; record_id?: string; context_data?: any }) =>
      fetchApi<any>('/copilot/generate', { method: 'POST', body: JSON.stringify(req) }),
  },

  // Reports
  reports: {
    getCatalog: () => fetchApi<any[]>('/reports/catalog'),
    excelExportUrl: () => `${API_BASE}/reports/export/excel`,
    csvExportUrl: (reportId: string) => `${API_BASE}/reports/export/csv/${reportId}`,
    getTableauMeta: () => fetchApi<any>('/reports/tableau/meta'),
  },

  // Settings
  settings: {
    getSettings: () => fetchApi<any>('/settings'),
    updateGeminiConfig: (data: { gemini_api_key?: string; gemini_model?: string }) =>
      fetchApi<any>('/settings/gemini-config', { method: 'POST', body: JSON.stringify(data) }),
    resetDemoData: () => fetchApi<any>('/settings/reset-demo-data', { method: 'POST' }),
    getAuditLogs: () => fetchApi<any[]>('/settings/audit-logs'),
  }
};
