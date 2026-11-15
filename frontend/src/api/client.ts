const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      errorDetail = parsed.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail || `Request failed with status ${response.status}`);
  }

  return response.json();
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
