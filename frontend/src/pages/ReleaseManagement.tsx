import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  Check,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const ReleaseManagement: React.FC = () => {
  const { addToast } = useStore();
  const [releases, setReleases] = useState<any[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Release modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [releaseName, setReleaseName] = useState('');
  const [version, setVersion] = useState('v2.5.0');
  const [releaseOwner, setReleaseOwner] = useState('Aarav Sharma (PM)');
  const [changesSummary, setChangesSummary] = useState('');
  const [featuresText, setFeaturesText] = useState('1-Click Doorstep Instant Size Swap\nLogistics Courier Slot Picker');

  const loadReleases = async () => {
    setIsLoading(true);
    try {
      const data = await api.operations.getReleases();
      setReleases(data);
      if (data.length > 0) {
        setSelectedRelease(data[0]);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading releases',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const handleApproveRelease = async (releaseId: number) => {
    try {
      const updated = await api.operations.updateRelease(releaseId, {
        release_approval_status: 'Approved',
        qa_status: 'QA Approved'
      });
      setReleases(releases.map((r) => (r.id === releaseId ? updated : r)));
      setSelectedRelease(updated);
      addToast({
        type: 'success',
        title: 'Release Approved for Production',
        message: `Version ${updated.version} signed off by Product & QA leadership.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Approval failed', message: err.message });
    }
  };

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const created = await api.operations.createRelease({
        release_name: releaseName,
        version,
        release_owner: releaseOwner,
        features_json: JSON.stringify(features),
        changes_summary: changesSummary,
        target_date: new Date(Date.now() + 14 * 86400000).toISOString(),
        qa_status: 'In QA',
        engineering_status: 'Code Frozen',
        known_issues_json: JSON.stringify(['Cross-browser regression testing underway in Safari mobile sandbox']),
        release_notes: `### ThreadIQ ${version} Production Candidate\n\n- Key Deliverables: ${features.join(', ')}\n- Rollout Strategy: 10% Canary on Day 1 ramping to 100% over 72 hours.`,
        release_approval_status: 'Pending Approval'
      });

      setReleases([created, ...releases]);
      setSelectedRelease(created);
      setIsModalOpen(false);
      setReleaseName('');
      setChangesSummary('');
      addToast({
        type: 'success',
        title: 'Release Candidate Created',
        message: `Version ${created.version} registered in release pipeline.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to create release', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              Release Governance
            </span>
            <span className="text-xs text-slate-500">Production Promotion Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Release Management & Notes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track software release candidates, engineering freeze status, QA sign-offs, known issues register, and automated customer support handover documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Release Candidate</span>
          </button>
        </div>
      </div>

      {/* Main Release Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Release List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Version Timeline ({releases.length})
          </span>
          {releases.map((rel) => {
            const isSelected = selectedRelease?.id === rel.id;
            const isApproved = rel.release_approval_status === 'Approved';

            return (
              <div
                key={rel.id}
                onClick={() => setSelectedRelease(rel)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded">
                    {rel.version}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rel.release_approval_status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-1">{rel.release_name}</h3>
                <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                  <span>QA: {rel.qa_status}</span>
                  <span>Eng: {rel.engineering_status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Release Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedRelease && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600">{selectedRelease.version}</span>
                    <span className="text-xs text-slate-400">• Owner: {selectedRelease.release_owner}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedRelease.release_name}</h2>
                </div>

                {selectedRelease.release_approval_status !== 'Approved' && (
                  <button
                    onClick={() => handleApproveRelease(selectedRelease.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve for Production</span>
                  </button>
                )}
              </div>

              {/* Status Chips Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">QA Status</span>
                  <span className="font-bold text-slate-800">{selectedRelease.qa_status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Engineering Status</span>
                  <span className="font-bold text-slate-800">{selectedRelease.engineering_status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Target Launch</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedRelease.target_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Changes Summary */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block">Summary of Changes & Impact:</span>
                <p className="text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {selectedRelease.changes_summary}
                </p>
              </div>

              {/* Included Features */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Delivered Features & User Stories:</span>
                <div className="space-y-1.5">
                  {JSON.parse(selectedRelease.features_json || '[]').map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Release Notes Preview */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Executive Release Notes:</span>
                  <span className="text-[10px] text-slate-400 font-mono">Format: Markdown</span>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-line border border-slate-800">
                  {selectedRelease.release_notes || 'No release notes compiled yet.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Release Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Release Candidate"
        subtitle="Bundle verified user stories into a staged release manifest."
      >
        <form onSubmit={handleCreateRelease} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Release Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Summer Discovery Release"
                value={releaseName}
                onChange={(e) => setReleaseName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Version String</label>
              <input
                type="text"
                required
                placeholder="v2.5.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Changes Summary</label>
            <textarea
              required
              rows={2}
              placeholder="Key architectural improvements and customer value delivered..."
              value={changesSummary}
              onChange={(e) => setChangesSummary(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Delivered Features (One per line)</label>
            <textarea
              required
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
            />
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
              Create Release Candidate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
