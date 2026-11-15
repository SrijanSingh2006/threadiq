import { create } from 'zustand';
import { api } from '../api/client';

export type UserRole =
  | 'Product Manager'
  | 'Product Analyst'
  | 'UX Researcher'
  | 'Product Designer'
  | 'Engineer'
  | 'QA'
  | 'Operations'
  | 'Admin';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface CartItem {
  id: string;
  product: any;
  size: string;
  quantity: number;
}

interface AppState {
  // User & Role
  currentRole: UserRole;
  userName: string;
  userEmail: string;
  setRole: (role: UserRole) => void;

  // Workspace & Navigation
  workspace: string;
  setWorkspace: (ws: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Storefront & Cart
  cart: CartItem[];
  addToCart: (product: any, size: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  compareList: any[];
  toggleCompare: (product: any) => void;
  clearCompare: () => void;

  // Telemetry Session & Experimentation
  userId: string;
  sessionId: string;
  experimentVariants: Record<string, string>;
  setExperimentVariant: (code: string, variant: string) => void;
  trackInteraction: (eventName: string, meta?: { productId?: number; category?: string; query?: string; properties?: any }) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const getInitialSessionId = () => {
  const existing = sessionStorage.getItem('tiq_session_id');
  if (existing) return existing;
  const newId = `sess_${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('tiq_session_id', newId);
  return newId;
};

export const useStore = create<AppState>((set, get) => ({
  currentRole: 'Product Manager',
  userName: 'Aarav Sharma',
  userEmail: 'pm@threadiq.internal',
  setRole: (role) => {
    set({ currentRole: role });
    api.auth.switchRole(role).catch(() => {});
    get().addToast({
      type: 'info',
      title: `Switched Role to ${role}`,
      message: `UI views and permissions aligned with ${role} workflows.`
    });
  },

  workspace: 'ThreadIQ Main Commerce Workspace',
  setWorkspace: (ws) => set({ workspace: ws }),
  dateRange: 'Last 30 Days',
  setDateRange: (range) => set({ dateRange: range }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Cart
  cart: [],
  addToCart: (product, size) => {
    const existingIndex = get().cart.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );
    if (existingIndex > -1) {
      const updated = [...get().cart];
      updated[existingIndex].quantity += 1;
      set({ cart: updated });
    } else {
      const newItem: CartItem = {
        id: `${product.id}_${size}_${Date.now()}`,
        product,
        size,
        quantity: 1,
      };
      set({ cart: [...get().cart, newItem] });
    }

    // Fire first-party analytics event
    get().trackInteraction('added_to_cart', {
      productId: product.id,
      category: product.category?.name,
      properties: { size, price: product.price }
    });

    get().addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.name} (Size: ${size}) added to your simulated cart.`
    });
  },
  removeFromCart: (itemId) => {
    set({ cart: get().cart.filter((item) => item.id !== itemId) });
  },
  clearCart: () => set({ cart: [] }),

  // Wishlist
  wishlist: [],
  toggleWishlist: (productId) => {
    const current = get().wishlist;
    const exists = current.includes(productId);
    const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
    set({ wishlist: updated });

    if (!exists) {
      get().trackInteraction('wishlist_added', { productId });
      get().addToast({
        type: 'info',
        title: 'Saved to Wishlist',
        message: 'Product bookmarked in your personal collection.'
      });
    }
  },

  // Comparison
  compareList: [],
  toggleCompare: (product) => {
    const current = get().compareList;
    const exists = current.some((p) => p.id === product.id);
    if (exists) {
      set({ compareList: current.filter((p) => p.id !== product.id) });
    } else {
      if (current.length >= 4) {
        get().addToast({
          type: 'warning',
          title: 'Comparison Limit Reached',
          message: 'You can compare up to 4 items simultaneously.'
        });
        return;
      }
      set({ compareList: [...current, product] });
      get().trackInteraction('product_compared', { productId: product.id });
    }
  },
  clearCompare: () => set({ compareList: [] }),

  // Telemetry & Experiments
  userId: 'USR-CUST-10491',
  sessionId: getInitialSessionId(),
  experimentVariants: {},
  setExperimentVariant: (code, variant) => {
    set((state) => ({
      experimentVariants: { ...state.experimentVariants, [code]: variant }
    }));
  },
  trackInteraction: (eventName, meta) => {
    const state = get();
    const activeAssignments = Object.entries(state.experimentVariants)
      .map(([code, variant]) => `${code}:${variant}`)
      .join(';');

    api.analytics.recordEvent({
      event_name: eventName,
      user_id: state.userId,
      session_id: state.sessionId,
      product_id: meta?.productId,
      product_category: meta?.category,
      search_query: meta?.query,
      device_type: 'desktop',
      experiment_assignment: activeAssignments || 'EXP-FIT-GUIDE-001:variant_b',
      properties_json: JSON.stringify(meta?.properties || { viewport: '1440x900' }),
      is_synthetic: false
    }).catch(() => {
      // Background non-blocking
    });
  },

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  }
}));
