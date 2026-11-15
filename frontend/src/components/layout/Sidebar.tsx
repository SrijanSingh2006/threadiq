import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  Compass,
  TrendingUp,
  ShoppingBag,
  BarChart3,
  FlaskConical,
  Map,
  Boxes,
  MessageSquareShare,
  FileCheck2,
  Rocket,
  KanbanSquare,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkle
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar, currentRole } = useStore();

  const navigationGroups: NavGroup[] = [
    {
      groupName: 'STRATEGY & DISCOVERY',
      items: [
        { name: 'Overview', path: '/', icon: LayoutDashboard },
        { name: 'Customer Research', path: '/customer-research', icon: Users2, badge: 'Live' },
        { name: 'Product Discovery', path: '/product-discovery', icon: Compass },
        { name: 'Market Intelligence', path: '/market-intelligence', icon: TrendingUp },
      ]
    },
    {
      groupName: 'EXPERIENCE & VALIDATION',
      items: [
        { name: 'Storefront Prototype', path: '/storefront', icon: ShoppingBag, badge: '100 SKUs' },
        { name: 'Product Analytics', path: '/product-analytics', icon: BarChart3 },
        { name: 'Experimentation Lab', path: '/experimentation', icon: FlaskConical, badge: '2 Active' },
      ]
    },
    {
      groupName: 'DELIVERY & OPERATIONS',
      items: [
        { name: 'Product Roadmap', path: '/roadmap', icon: Map },
        { name: 'Sprint Workspace', path: '/sprint-workspace', icon: KanbanSquare, badge: 'Sprint 42' },
        { name: 'Operations Intelligence', path: '/operations-intelligence', icon: Boxes },
        { name: 'Stakeholder Feedback', path: '/stakeholder-feedback', icon: MessageSquareShare },
        { name: 'SOP Management', path: '/sop-management', icon: FileCheck2 },
        { name: 'Release Management', path: '/release-management', icon: Rocket },
        { name: 'Launch Readiness', path: '/launch-readiness', icon: CheckCircle2, badge: '86%' },
      ]
    },
    {
      groupName: 'INTELLIGENCE & SYSTEM',
      items: [
        { name: 'AI Product Copilot', path: '/ai-copilot', icon: Sparkles, badge: 'Gemini' },
        { name: 'Reports & Exports', path: '/reports-exports', icon: FileSpreadsheet },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
      ]
    }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-fashion-accent flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                THREAD<span className="text-fashion-accent">IQ</span>
              </span>
              <span className="text-[10px] uppercase font-medium text-slate-400 tracking-wider">
                Commerce PM Suite
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isSidebarCollapsed && (
              <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {group.groupName}
              </h3>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between w-full truncate">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-800 text-brand-300 border border-slate-700/60 group-hover:border-brand-500/40">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Role Card at bottom */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-2 rounded-xl bg-slate-800/40 border border-slate-800`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {currentRole.slice(0, 2).toUpperCase()}
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">Aarav Sharma</span>
              <span className="text-[10px] font-medium text-brand-400 truncate">{currentRole}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
