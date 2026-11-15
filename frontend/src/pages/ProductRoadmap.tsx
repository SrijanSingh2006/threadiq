import React, { useState, useEffect } from 'react';
import {
  Map,
  Layers,
  ArrowUpDown,
  Plus,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  Calendar,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const ProductRoadmap: React.FC = () => {
  const { addToast } = useStore();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'rice' | 'timeline'>('rice');
  const [isLoading, setIsLoading] = useState(true);

  // New Initiative Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [quarter, setQuarter] = useState('Q1 2026');
  const [reach, setReach] = useState(80000);
  const [impact, setImpact] = useState(2.0);
  const [confidence, setConfidence] = useState(0.8);
  const [effort, setEffort] = useState(1.5);
  const [owner, setOwner] = useState('Aarav Sharma (PM)');

  const loadRoadmap = async () => {
    setIsLoading(true);
    try {
      const data = await api.delivery.getRoadmap();
      setInitiatives(data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading roadmap',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleCreateInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.delivery.createInitiative({
        title,
        objective,
        quarter,
        reach,
        impact,
        confidence,
        effort,
        owner,
        status: 'Planning'
      });
      setInitiatives([...initiatives, created]);
      setIsModalOpen(false);
      setTitle('');
      setObjective('');
      addToast({
        type: 'success',
        title: 'Roadmap Initiative Added',
        message: `Registered "${created.title}" with RICE score ${created.rice_score}.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to create initiative', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
              Prioritization Engine
            </span>
            <span className="text-xs text-slate-500">RICE Scoring Model</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Product Roadmap & RICE Prioritization</h1>
          <p className="text-xs text-slate-500 mt-1">
            Mathematical prioritization balancing Reach, Impact, Confidence, and Effort to drive maximum business GMV and reduce fashion return rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Initiative</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveView('rice')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeView === 'rice'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          RICE Prioritization Matrix
        </button>
        <button
          onClick={() => setActiveView('timeline')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeView === 'timeline'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Now / Next / Later Strategic View
        </button>
      </div>

      {/* VIEW 1: RICE TABLE */}
      {activeView === 'rice' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              Formula: <code className="font-mono bg-white px-2 py-0.5 rounded border font-bold text-brand-700">RICE = (Reach × Impact × Confidence) / Effort</code>
            </span>
            <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded">Sorted by Highest Leverage</span>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Rank & Initiative</th>
                  <th className="p-4">Quarter</th>
                  <th className="p-4">Reach</th>
                  <th className="p-4">Impact</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Effort</th>
                  <th className="p-4 text-brand-600 font-bold">RICE Score</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(initiatives) ? initiatives : []).map((init, idx) => {
                  const reach = Number(init.reach ?? 50000);
                  const impact = typeof init.impact === 'number' ? init.impact : (Number(init.impact) || 3.0);
                  const confidence = typeof init.confidence === 'number' ? init.confidence : (Number(init.confidence) || 0.8);
                  const effort = typeof init.effort === 'number' ? init.effort : (Number(init.effort) || 1.5);
                  const riceScore = typeof init.rice_score === 'number'
                    ? init.rice_score
                    : Math.round((reach * impact * confidence) / Math.max(effort, 0.1));

                  return (
                    <tr key={init.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-slate-600 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">{init.title}</span>
                            <span className="text-[11px] text-slate-500">{init.objective || init.summary || 'Drive fashion commerce discovery and lower returns.'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{init.quarter || 'Q1 2026'}</td>
                      <td className="p-4 font-mono text-slate-800">{reach.toLocaleString()}</td>
                      <td className="p-4 text-slate-700">{impact}x</td>
                      <td className="p-4 text-slate-700">{(confidence * 100).toFixed(0)}%</td>
                      <td className="p-4 text-slate-700">{effort} mo</td>
                      <td className="p-4 font-bold text-brand-700 text-sm font-mono">
                        {Math.round(riceScore).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                          {init.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: NOW / NEXT / LATER */}
      {activeView === 'timeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NOW */}
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-900">NOW (In Active Development)</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Q1 2026</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-brand-600">P0 Initiative</span>
              <h4 className="text-xs font-bold text-slate-900">Smart Size & Fit Intelligence Engine</h4>
              <p className="text-[11px] text-slate-500">
                Deploy ML recommendation widget on apparel PDPs to cut sizing return rates.
              </p>
            </div>
          </div>

          {/* NEXT */}
          <div className="space-y-3">
            <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 flex justify-between items-center text-xs">
              <span className="font-bold text-brand-900">NEXT (Validation & Sizing)</span>
              <span className="text-[10px] bg-brand-200 text-brand-800 px-1.5 py-0.2 rounded font-bold">Q2 2026</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-indigo-600">P1 Initiative</span>
              <h4 className="text-xs font-bold text-slate-900">1-Click Doorstep Instant Size Swap</h4>
              <p className="text-[11px] text-slate-500">
                Logistics integration for instant simultaneous delivery and return pickup.
              </p>
            </div>
          </div>

          {/* LATER */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">LATER (Discovery Backlog)</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold">H2 2026</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400">P2 Initiative</span>
              <h4 className="text-xs font-bold text-slate-900">Conversational Visual Outfit Stylist</h4>
              <p className="text-[11px] text-slate-500">
                Multi-modal outfit coordinate generator powered by Gemini generative models.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Initiative Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product Roadmap Initiative"
        subtitle="Define reach, impact, confidence, and engineering effort to calculate RICE ranking."
      >
        <form onSubmit={handleCreateInitiative} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Initiative Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Natural Daylight Image Viewer on PDP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Business Objective</label>
            <textarea
              required
              rows={2}
              placeholder="Explain target outcome, customer value, and return reduction goal..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reach (Users/Mo)</label>
              <input
                type="number"
                value={reach}
                onChange={(e) => setReach(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Impact (0.5 to 3.0)</label>
              <input
                type="number"
                step="0.5"
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Confidence (0.5 - 1.0)</label>
              <input
                type="number"
                step="0.1"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Effort (Person-Mo)</label>
              <input
                type="number"
                step="0.5"
                value={effort}
                onChange={(e) => setEffort(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
          </div>

          <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 flex justify-between items-center">
            <span className="font-semibold text-brand-900">Estimated RICE Score:</span>
            <span className="font-mono font-bold text-brand-700 text-sm">
              {Math.round((reach * impact * confidence) / Math.max(effort, 0.1)).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow"
            >
              Save Initiative
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
