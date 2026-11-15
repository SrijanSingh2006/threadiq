import React, { useState, useEffect } from 'react';
import {
  MessageSquareShare,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  Layers
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const StakeholderFeedback: React.FC = () => {
  const { addToast } = useStore();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // New Feedback modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stakeholderName, setStakeholderName] = useState('Pooja Hegde');
  const [team, setTeam] = useState('Merchandising');
  const [businessArea, setBusinessArea] = useState('Ethnic Wear');
  const [feedbackType, setFeedbackType] = useState('Friction report');
  const [priority, setPriority] = useState('High');
  const [evidence, setEvidence] = useState('');

  const loadFeedback = async () => {
    setIsLoading(true);
    try {
      const data = await api.operations.getFeedback(selectedTeam || undefined);
      setFeedbackList(data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading feedback',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [selectedTeam]);

  const handleConvertToPainPoint = async (fbId: number) => {
    try {
      const result = await api.operations.convertToPainPoint(fbId);
      setFeedbackList(
        feedbackList.map((f) =>
          f.id === fbId ? { ...f, status: 'Converted to Pain Point', pain_point_id: result.pain_point_id } : f
        )
      );
      addToast({
        type: 'success',
        title: 'Converted to Pain Point',
        message: `Linked feedback #${fbId} to Discovery Board (Pain Point #${result.pain_point_id}).`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Conversion failed', message: err.message });
    }
  };

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.operations.submitFeedback({
        title,
        description,
        stakeholder_name: stakeholderName,
        team,
        business_area: businessArea,
        feedback_type: feedbackType,
        priority,
        evidence,
        owner: 'Aarav Sharma (PM)',
        status: 'New'
      });
      setFeedbackList([created, ...feedbackList]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setEvidence('');
      addToast({
        type: 'success',
        title: 'Stakeholder Feedback Logged',
        message: 'Feedback registered in operational triage queue.'
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to submit feedback', message: err.message });
    }
  };

  const teams = ['Merchandising', 'Logistics', 'Customer Support', 'Marketing', 'Category Management'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              Voice of Business
            </span>
            <span className="text-xs text-slate-500">Cross-Functional Operational Triage</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Stakeholder Feedback & Triage</h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture friction reports, quality alerts, and feature requests from Merchandising, Logistics, and Customer Support; convert insights directly into product pain points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>
        </div>
      </div>

      {/* Team Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setSelectedTeam('')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            selectedTeam === ''
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Departments ({feedbackList.length})
        </button>
        {teams.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTeam(t)}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              selectedTeam === t
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {feedbackList.map((fb) => {
          const isUrgent = fb.priority === 'Urgent';
          const isConverted = fb.status === 'Converted to Pain Point';

          return (
            <div
              key={fb.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {fb.team}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {fb.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400">Area: {fb.business_area}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{fb.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fb.description}</p>

                {fb.evidence && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 border border-slate-100">
                    <span className="font-semibold text-slate-700">Evidence Link:</span> {fb.evidence}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Reported by: <strong>{fb.stakeholder_name}</strong></span>
                  <span>Owner: {fb.owner}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col items-end gap-2 text-xs">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    isConverted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {fb.status}
                </span>

                {!isConverted && (
                  <button
                    onClick={() => handleConvertToPainPoint(fb.id)}
                    className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-semibold text-xs flex items-center gap-1 border border-brand-200 transition-colors"
                  >
                    <span>Convert to Pain Point</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Feedback Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Stakeholder Feedback"
        subtitle="Log operational friction, policy recommendations, or merchant concerns."
      >
        <form onSubmit={handleCreateFeedback} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Feedback Title</label>
            <input
              type="text"
              required
              placeholder="e.g., High Return Spike on Winter Jackets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Description & Observations</label>
            <textarea
              required
              rows={3}
              placeholder="Elaborate on operational friction, affected categories, or customer sentiment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reporting Team</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                {['Urgent', 'High', 'Medium', 'Low'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Evidence (Tickets, Links, Logs)</label>
            <input
              type="text"
              placeholder="e.g., Zendesk Ticket Batch #9421; Courier SLA report"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
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
              Log Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
