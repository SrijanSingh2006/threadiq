import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Layers,
  Bell,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Check,
  Scale
} from 'lucide-react';
import { useStore, UserRole } from '../../store/useStore';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenCompare }) => {
  const {
    workspace,
    setWorkspace,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    currentRole,
    setRole,
    cart,
    compareList
  } = useStore();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles: UserRole[] = [
    'Product Manager',
    'Product Analyst',
    'UX Researcher',
    'Product Designer',
    'Engineer',
    'QA',
    'Operations',
    'Admin'
  ];

  const workspaces = [
    'ThreadIQ Main Commerce Workspace',
    'Myntra Ethnic Fashion Pod',
    'Gen Z Trend & Reels Lab'
  ];

  const dateRanges = ['Last 30 Days', 'Last 7 Days', 'Q1 2026', 'Year to Date'];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Workspace & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Workspace selector */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-brand-600" />
            <span className="truncate max-w-[180px]">{workspace}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showWorkspaceDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-40">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Pod
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setWorkspace(ws);
                    setShowWorkspaceDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-brand-50 flex items-center justify-between"
                >
                  <span className="truncate">{ws}</span>
                  {workspace === ws && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiments, pain points, SKUs, user stories, SOPs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Right: Actions, Date, Roles, Notifications */}
      <div className="flex items-center gap-3">
        {/* Date Selector */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent border-none text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            {dateRanges.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Telemetry Indicator Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          1st-Party Telemetry Live
        </div>

        {/* Comparison Trigger */}
        {compareList.length > 0 && (
          <button
            onClick={onOpenCompare}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            title="Open Product Comparison Drawer"
          >
            <Scale className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
              {compareList.length}
            </span>
          </button>
        )}

        {/* Cart Trigger */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          title="Open Shopping Bag"
        >
          <ShoppingBag className="w-4 h-4" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-fashion-accent text-white text-[10px] font-bold flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-40 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900">Platform Alerts</span>
                <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-medium">3 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/60">
                  <span className="font-semibold text-amber-900 block">Reverse Logistics SLA Blocker</span>
                  <span className="text-amber-700 text-[11px] block mt-0.5">
                    Courier partner contract pending sign-off in North Zone. Holding instant exchange release.
                  </span>
                </div>
                <div className="p-2 bg-brand-50 rounded-lg border border-brand-200/60">
                  <span className="font-semibold text-brand-900 block">A/B Test EXP-FIT-GUIDE-001</span>
                  <span className="text-brand-700 text-[11px] block mt-0.5">
                    Variant B reached 92% confidence with +6.2% lift in Add-to-Cart.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative border-l border-slate-200 pl-3">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-brand-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-40">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-brand-50 flex items-center justify-between"
                >
                  <span>{r}</span>
                  {currentRole === r && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
