import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const SOPManagement: React.FC = () => {
  const { addToast } = useStore();
  const [sops, setSops] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedSopId, setExpandedSopId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New SOP Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Catalogue Quality');
  const [purpose, setPurpose] = useState('');
  const [scope, setScope] = useState('');
  const [owner, setOwner] = useState('Operations Lead');
  const [preconditions, setPreconditions] = useState('');
  const [stepText, setStepText] = useState('1. Ingest feed\n2. Run automated validation\n3. Verify measurements');
  const [expectedOutcome, setExpectedOutcome] = useState('');

  const loadSops = async () => {
    setIsLoading(true);
    try {
      const data = await api.operations.getSOPs(selectedCategory || undefined);
      setSops(data);
      if (data.length > 0 && expandedSopId === null) {
        setExpandedSopId(data[0].id);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading SOP documents',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSops();
  }, [selectedCategory]);

  const handleCreateSop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const steps = stepText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const created = await api.operations.createSOP({
        title,
        category,
        purpose,
        scope,
        owner,
        preconditions,
        step_by_step_json: JSON.stringify(steps),
        expected_outcome: expectedOutcome,
        version: 'v1.0',
        status: 'Active'
      });
      setSops([created, ...sops]);
      setIsModalOpen(false);
      setTitle('');
      setPurpose('');
      setScope('');
      setExpectedOutcome('');
      addToast({
        type: 'success',
        title: 'SOP Document Published',
        message: `Registered "${created.title}" in SOP repository.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to create SOP', message: err.message });
    }
  };

  const categories = [
    'Catalogue Quality',
    'Release Management',
    'Incident Escalation',
    'QA Signoff',
    'Launch Readiness'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Standard Operating Procedures
            </span>
            <span className="text-xs text-slate-500">Process Governance & Runbooks</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SOP Management & Governance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized operational execution frameworks governing catalogue quality review, product incident escalation, QA sign-off criteria, and launch readiness gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Draft New SOP</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            selectedCategory === ''
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Categories ({sops.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === c
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SOPs Accordion List */}
      <div className="space-y-4">
        {sops.map((sop) => {
          const isExpanded = expandedSopId === sop.id;
          let steps: string[] = [];
          try {
            steps = JSON.parse(sop.step_by_step_json || '[]');
          } catch {
            steps = [sop.step_by_step_json];
          }

          return (
            <div
              key={sop.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              {/* SOP Header Bar */}
              <div
                onClick={() => setExpandedSopId(isExpanded ? null : sop.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {sop.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {sop.version}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {sop.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{sop.title}</h3>
                  <p className="text-xs text-slate-500">{sop.purpose}</p>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block">Owner</span>
                    <span className="font-semibold text-slate-700">{sop.owner}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* SOP Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs bg-slate-50/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                      <span className="font-semibold text-slate-700 block mb-1">Scope & Applicability</span>
                      <p className="text-slate-600">{sop.scope}</p>
                    </div>
                    {sop.preconditions && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                        <span className="font-semibold text-slate-700 block mb-1">Preconditions & Entry Criteria</span>
                        <p className="text-slate-600">{sop.preconditions}</p>
                      </div>
                    )}
                  </div>

                  {/* Step-by-Step Procedure */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block text-xs">Standard Step-by-Step Procedure:</span>
                    <div className="space-y-1.5">
                      {steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs"
                        >
                          <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
                            {sIdx + 1}
                          </div>
                          <p className="text-slate-700 text-xs leading-relaxed">{st}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected Outcome */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Expected Outcome:</strong> {sop.expected_outcome}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New SOP Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Author Standard Operating Procedure (SOP)"
        subtitle="Standardize cross-functional operational protocols and quality criteria."
      >
        <form onSubmit={handleCreateSop} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">SOP Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Return Inspection & Refund Authorization Protocol"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Owner Role</label>
              <input
                type="text"
                required
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Purpose</label>
            <input
              type="text"
              required
              placeholder="State the objective and why this procedure exists..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Scope</label>
            <input
              type="text"
              required
              placeholder="Teams, services, or categories covered..."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Step-by-Step Procedure (One step per line)</label>
            <textarea
              required
              rows={4}
              value={stepText}
              onChange={(e) => setStepText(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Expected Outcome / SLA</label>
            <input
              type="text"
              required
              placeholder="e.g., Reverse refunds processed within 4 hours with 99.8% audit accuracy"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
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
              Save SOP
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
