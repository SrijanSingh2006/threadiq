import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const Settings: React.FC = () => {
  const { addToast } = useStore();
  const [sysSettings, setSysSettings] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, logs] = await Promise.all([
        api.settings.getSettings(),
        api.settings.getAuditLogs()
      ]);
      setSysSettings(s);
      setModel(s.gemini_model || 'gemini-1.5-flash');
      setAuditLogs(logs);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading settings',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.settings.updateGeminiConfig({
        gemini_api_key: apiKey,
        gemini_model: model
      });
      setSysSettings({
        ...sysSettings,
        gemini_api_configured: res.gemini_api_configured,
        gemini_model: res.gemini_model,
        gemini_mode_label: res.gemini_api_configured ? 'Live Google Gemini API' : 'Deterministic Domain Intelligence (Demo Fallback)'
      });
      addToast({
        type: 'success',
        title: 'Gemini Configuration Saved',
        message: res.message
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to update Gemini settings', message: err.message });
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all databases and re-seed 100 products, 5,000 customers, and 20,000 product events?')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await api.settings.resetDemoData();
      addToast({
        type: 'success',
        title: 'Platform Re-Seeded',
        message: 'All synthetic datasets have been freshly loaded.'
      });
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Reset failed', message: err.message });
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading || !sysSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
            System Administration
          </span>
          <span className="text-xs text-slate-500">Security & Environment</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings & AI Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage Google Gemini credentials, database backend connections, synthetic data integrity, and inspect audit logs.
        </p>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Database Engine</span>
          <span className="font-bold text-slate-900 text-sm block">{sysSettings.database_backend}</span>
          <span className="text-emerald-600 font-semibold block">Relational Schema Verified</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">AI Copilot Mode</span>
          <span className="font-bold text-slate-900 text-sm block">{sysSettings.gemini_mode_label}</span>
          <span className="text-brand-600 font-semibold block">Model: {sysSettings.gemini_model}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Integrity</span>
          <span className="font-bold text-slate-900 text-sm block">Synthetic Benchmark</span>
          <span className="text-slate-500 block">Clearly Labelled Demo Dataset</span>
        </div>
      </div>

      {/* Google Gemini API Configuration Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900">Google Gemini API Credentials</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Provide your Gemini API key to activate live generative AI capabilities. If unconfigured or quota-exceeded, ThreadIQ automatically runs verified deterministic fashion-commerce domain intelligence.
        </p>

        <form onSubmit={handleSaveGemini} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">GEMINI_API_KEY</label>
            <input
              type="password"
              placeholder={sysSettings.gemini_api_configured ? "••••••••••••••••••••••••••••••••" : "Paste your Google Gemini API key (AIzaSy...)"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">GEMINI_MODEL</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800"
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (Next-Gen Preview)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setApiKey('');
                handleSaveGemini(new Event('submit') as any);
              }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Clear Stored Key
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-xs shadow-md transition-all"
            >
              Save AI Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Reset Card */}
      <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Reset & Re-Seed Synthetic Demo Data</h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Drops existing tables, re-runs Alembic migrations, and reloads the pristine 100 fashion products, 5,000 customers, 20,000 events, 2,000 orders, and operational documents.
          </p>
        </div>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2 disabled:opacity-50"
        >
          {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          <span>{isResetting ? 'Re-Seeding Database...' : 'Reset Demo Data'}</span>
        </button>
      </div>

      {/* Audit Log Viewer */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">System Activity & Audit Log</h3>
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-900">{log.action}</td>
                  <td className="p-3.5 font-mono text-slate-600">{log.entity}</td>
                  <td className="p-3.5 text-slate-700">{log.user_name || 'System'}</td>
                  <td className="p-3.5 text-slate-500 truncate max-w-xs">{log.details}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
