import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Sparkles,
  BarChart3,
  Rocket,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const Overview: React.FC = () => {
  const { currentRole, addToast } = useStore();
  const [data, setData] = useState<any>(null);
  const [funnelData, setFunnelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const [metrics, funnel] = await Promise.all([
        api.overview.getMetrics(),
        api.analytics.getFunnel()
      ]);
      setData(metrics);
      setFunnelData(funnel);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to load executive overview',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading ThreadIQ Executive Cockpit...</p>
        </div>
      </div>
    );
  }

  const kpis = data.kpis;

  const funnelChartData = funnelData?.steps?.map((s: any) => ({
    name: s.step_name.replace(' Initiated', '').replace(' Completed', ''),
    users: s.unique_users,
    drop: s.drop_off_from_previous_percent
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {currentRole} Cockpit
            </span>
            <span className="text-xs text-slate-400">1st-Party Telemetry Telemetry Synchronized</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Commerce Product Discovery & Operations Intelligence
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Unified view across customer research, fashion storefront telemetry, statistical A/B experimentation, supply chain inbound quality, and launch readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/ai-copilot"
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-brand-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4 text-brand-200" />
            <span>AI Copilot</span>
          </Link>
          <Link
            to="/reports-exports"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            Export Workbook
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Purchase Conversion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.purchase_conversion_rate}%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+0.8% vs last month</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Return Rate</span>
            <RotateCcw className="w-4 h-4 text-fashion-accent" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.return_rate_percent}%</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-1">
            <span>48% driven by sizing</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Launch Readiness</span>
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.launch_readiness_percent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">1 Blocker in North Zone</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Active Sprint Velocity</span>
            <Rocket className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.sprint_completion_percent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{kpis.sprint_points_completed} pts done</div>
        </div>
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-slate-500 block text-[10px]">Active SKUs:</span>
            <span className="font-bold text-slate-800">{kpis.total_products} Products</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-slate-500 block text-[10px]">Synthetic Shoppers:</span>
            <span className="font-bold text-slate-800">{(kpis?.total_customers ?? 0).toLocaleString()} Profiles</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-slate-500 block text-[10px]">A/B Experiments:</span>
            <span className="font-bold text-slate-800">{kpis.active_experiments_count} Running</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-slate-500 block text-[10px]">Critical Pain Points:</span>
            <span className="font-bold text-rose-600">{kpis.critical_pain_points_count} Priority 0</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">First-Party Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Unique user progression across 6 discovery & purchase milestones</p>
            </div>
            <Link
              to="/product-analytics"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Friction Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any) => [Number(value).toLocaleString() + ' users', 'Audience']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Platform Alerts & Blockers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Critical Attention Alerts</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time friction alarms synthesized from cross-functional modules.
            </p>

            <div className="space-y-3">
              {data.alerts?.map((alert: any) => (
                <Link
                  key={alert.id}
                  to={alert.link}
                  className="block p-3 rounded-xl border border-slate-200 hover:border-brand-500/50 hover:bg-slate-50/80 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{alert.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{alert.message}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Environment: Synthetic Sandbox</span>
            <Link to="/launch-readiness" className="font-semibold text-brand-600 hover:underline">
              View Checklist →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
