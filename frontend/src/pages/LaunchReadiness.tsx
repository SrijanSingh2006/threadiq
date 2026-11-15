import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Download,
  Check,
  X,
  Layers,
  ArrowRight,
  RefreshCw,
  FileCheck2
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const LaunchReadiness: React.FC = () => {
  const { addToast } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [raciList, setRaciList] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [itemList, sumData, raci, riskList] = await Promise.all([
        api.operations.getLaunchChecklist(),
        api.operations.getLaunchSummary(),
        api.delivery.getRACI(),
        api.delivery.getRisks()
      ]);
      setItems(itemList);
      setSummary(sumData);
      setRaciList(raci);
      setRisks(riskList);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading launch readiness',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleItem = async (item: any) => {
    try {
      const updated = await api.operations.updateChecklistItem(item.id, {
        is_completed: !item.is_completed
      });
      const newItems = items.map((i) => (i.id === item.id ? updated : i));
      setItems(newItems);
      // Reload summary
      const sum = await api.operations.getLaunchSummary();
      setSummary(sum);
      addToast({
        type: updated.is_completed ? 'success' : 'info',
        title: `Gate Item ${updated.is_completed ? 'Cleared' : 'Reopened'}`,
        message: `"${item.item_title}" updated.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update failed', message: err.message });
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  const isBlocked = summary.blocked_items > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Production Gate Audit
            </span>
            <span className="text-xs text-slate-500">Cross-Functional Go / No-Go Protocol</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Launch Readiness & RACI Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">
            Rigorous 15-point release gate verification across Product, Design, Engineering, QA, Operations, Support, and Legal compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={api.reports.csvExportUrl('launch_readiness')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Sign-Off Pack</span>
          </a>
        </div>
      </div>

      {/* Readiness Score Banner */}
      <div
        className={`p-6 rounded-2xl text-white shadow-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isBlocked
            ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-amber-900/60'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-slate-800'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Target Release: v2.4.0 Production Candidate</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isBlocked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {summary.overall_status}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Overall Launch Readiness: {summary.readiness_percentage}%
          </h2>
          <p className="text-xs text-slate-300">
            {summary.completed_items} of {summary.total_items} checklist gates cleared. {summary.blocked_items} active blocker holding release.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block">Cleared Gates</span>
            <span className="font-bold text-emerald-400 text-base">{summary.completed_items} Passed</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block">Blockers</span>
            <span className={`font-bold text-base ${isBlocked ? 'text-rose-400' : 'text-slate-400'}`}>
              {summary.blocked_items} Critical
            </span>
          </div>
        </div>
      </div>

      {/* Active Blocker Alert */}
      {isBlocked && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-sm">Critical Launch Blocker Detected</span>
            <p className="mt-0.5">
              Gate #10 (Operations): Courier Partner contract SLA pending final sign-off for North Zone hub. Holding deployment to prevent reverse logistics delays.
            </p>
          </div>
        </div>
      )}

      {/* 15-Point Checklist Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Cross-Functional Gate Checklist</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 text-xs">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleItem(item)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    item.is_completed
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  {item.is_completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`font-bold ${
                        item.is_completed ? 'text-slate-800 line-through opacity-70' : 'text-slate-900'
                      }`}
                    >
                      {item.item_title}
                    </span>
                    {item.blocker_flag && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                        BLOCKER
                      </span>
                    )}
                  </div>
                  {item.blocker_reason && (
                    <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                      Blocker Reason: {item.blocker_reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-slate-500">
                <span className="text-[11px] font-semibold text-slate-700">{item.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RACI Matrix & Risk Register Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RACI Matrix */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">RACI Responsibility Matrix</h3>
            <p className="text-xs text-slate-500">Responsible, Accountable, Consulted, Informed owners</p>
          </div>

          <div className="space-y-2 text-xs">
            {raciList.map((raci) => (
              <div key={raci.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block">{raci.deliverable}</span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                  <div><strong>R:</strong> {raci.responsible}</div>
                  <div><strong>A:</strong> {raci.accountable}</div>
                  <div><strong>C:</strong> {raci.consulted}</div>
                  <div><strong>I:</strong> {raci.informed}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Register */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Risk & Blocker Register</h3>
            <p className="text-xs text-slate-500">Active operational & technical vulnerabilities</p>
          </div>

          <div className="space-y-2 text-xs">
            {risks.map((risk) => (
              <div key={risk.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{risk.title}</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {risk.severity} Severity
                  </span>
                </div>
                <p className="text-[11px] text-slate-600"><strong>Mitigation:</strong> {risk.mitigation_plan}</p>
                <span className="text-[10px] text-slate-400 block">Owner: {risk.owner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
