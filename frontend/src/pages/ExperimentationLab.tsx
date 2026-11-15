import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Download,
  FileText,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const ExperimentationLab: React.FC = () => {
  const { addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'experiments' | 'feature_flags' | 'usability_testing'>('experiments');
  
  const [experiments, setExperiments] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [usabilityTasks, setUsabilityTasks] = useState<any[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Experiment Modal state
  const [isNewExpOpen, setIsNewExpOpen] = useState(false);
  const [expName, setExpName] = useState('');
  const [expCode, setExpCode] = useState('');
  const [expHypothesis, setExpHypothesis] = useState('');
  const [expSolution, setExpSolution] = useState('');
  const [expPrimaryKpi, setExpPrimaryKpi] = useState('Add-to-Cart Conversion Rate');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [exps, flags, tasks] = await Promise.all([
        api.experiments.getExperiments(),
        api.experiments.getFeatureFlags(),
        api.experiments.getUsabilityTasks()
      ]);
      setExperiments(exps);
      setFeatureFlags(flags);
      setUsabilityTasks(tasks);

      if (exps.length > 0) {
        handleSelectExperiment(exps[0]);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading experiment data',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectExperiment = async (exp: any) => {
    setSelectedExperiment(exp);
    setIsStatsLoading(true);
    try {
      const stats = await api.experiments.getStatistics(exp.id);
      setStatsData(stats);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error calculating statistics',
        message: err.message
      });
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleToggleFlag = async (flag: any) => {
    try {
      const updated = await api.experiments.updateFeatureFlag(flag.id, {
        is_enabled: !flag.is_enabled
      });
      setFeatureFlags(featureFlags.map((f) => (f.id === flag.id ? updated : f)));
      addToast({
        type: 'info',
        title: `Feature Flag "${flag.name}" Updated`,
        message: `Status is now ${updated.is_enabled ? 'ENABLED' : 'DISABLED'}.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to update flag', message: err.message });
    }
  };

  const handleSliderChange = async (flagId: number, rollout: number) => {
    try {
      const updated = await api.experiments.updateFeatureFlag(flagId, {
        rollout_percentage: rollout
      });
      setFeatureFlags(featureFlags.map((f) => (f.id === flagId ? updated : f)));
    } catch (err: any) {}
  };

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.experiments.createExperiment({
        name: expName,
        code: expCode,
        problem_statement: 'Friction identified during customer journey testing.',
        customer_pain_point: 'Uncertainty during purchase flow.',
        hypothesis: expHypothesis,
        proposed_solution: expSolution,
        primary_kpi: expPrimaryKpi,
        success_criteria: 'Statistically significant relative lift >= +5% with p < 0.05.',
        status: 'Running'
      });
      setExperiments([created, ...experiments]);
      setIsNewExpOpen(false);
      setExpName('');
      setExpCode('');
      setExpHypothesis('');
      setExpSolution('');
      addToast({
        type: 'success',
        title: 'A/B Experiment Launched',
        message: `Experiment ${created.code} is now actively bucketing users.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to create experiment', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              Two-Proportion Z-Testing
            </span>
            <span className="text-xs text-slate-500">Validation Lab & Feature Flags</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Experimentation & Validation Lab</h1>
          <p className="text-xs text-slate-500 mt-1">
            Statistically sound A/B testing engine: hash-based user assignment, z-score, p-value calculations, 95% confidence intervals, and feature flag kill-switches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewExpOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Launch A/B Test</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('experiments')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeTab === 'experiments'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          A/B Experiments & Statistical Reports ({experiments.length})
        </button>
        <button
          onClick={() => setActiveTab('feature_flags')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeTab === 'feature_flags'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Feature Flags & Rollout Control ({featureFlags.length})
        </button>
        <button
          onClick={() => setActiveTab('usability_testing')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeTab === 'usability_testing'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Usability Lab Studies
        </button>
      </div>

      {/* TAB 1: EXPERIMENTS & STATISTICAL ANALYSIS */}
      {activeTab === 'experiments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Experiment List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Active Experiments
            </span>
            {experiments.map((exp) => {
              const isSelected = selectedExperiment?.id === exp.id;
              return (
                <div
                  key={exp.id}
                  onClick={() => handleSelectExperiment(exp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-brand-700 bg-brand-100/60 px-1.5 py-0.2 rounded">
                      {exp.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {exp.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{exp.name}</h3>
                  <div className="text-[11px] text-slate-500 mt-2 flex justify-between">
                    <span>Split: {exp.traffic_split_percent}/{100 - exp.traffic_split_percent}</span>
                    <span>Owner: {exp.owner}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistical Engine Deep Dive */}
          <div className="lg:col-span-2 space-y-4">
            {selectedExperiment && statsData && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-brand-600">{statsData.experiment_code}</span>
                    <span className="text-xs text-slate-400">Statistical Engine: SciPy Normal CDF</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{statsData.experiment_name}</h2>
                  <p className="text-xs text-slate-600 mt-1">{selectedExperiment.hypothesis}</p>
                </div>

                {/* Primary Metric Comparison Cards */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Control */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-slate-500 font-semibold">
                      <span>Control (Baseline)</span>
                      <span>n = {statsData.control.sample_size.toLocaleString()}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {statsData.control.conversion_rate}%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      95% CI: [{statsData.control.ci_lower_95}%, {statsData.control.ci_upper_95}%]
                    </div>
                  </div>

                  {/* Variant */}
                  <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-200 space-y-2">
                    <div className="flex justify-between items-center text-brand-800 font-semibold">
                      <span>Variant B (Solution)</span>
                      <span>n = {statsData.variant.sample_size.toLocaleString()}</span>
                    </div>
                    <div className="text-2xl font-bold text-brand-900 flex items-center gap-2">
                      <span>{statsData.variant.conversion_rate}%</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {statsData.relative_lift_percent > 0 ? `+${statsData.relative_lift_percent}%` : `${statsData.relative_lift_percent}%`}
                      </span>
                    </div>
                    <div className="text-[11px] text-brand-700">
                      95% CI: [{statsData.variant.ci_lower_95}%, {statsData.variant.ci_upper_95}%]
                    </div>
                  </div>
                </div>

                {/* Statistical Significance & Power Banner */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Hypothesis Test Evaluation (α = 0.05)</span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full ${
                        statsData.is_statistically_significant
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {statsData.is_statistically_significant ? 'Statistically Significant' : 'Inconclusive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-800">
                      <span className="text-slate-400 block text-[10px]">Z-Score</span>
                      <span className="font-bold text-white text-sm">{statsData.z_score}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800">
                      <span className="text-slate-400 block text-[10px]">P-Value</span>
                      <span className="font-bold text-white text-sm">{statsData.p_value}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800">
                      <span className="text-slate-400 block text-[10px]">Confidence</span>
                      <span className="font-bold text-white text-sm">{statsData.confidence_level_percent}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <span className="font-semibold text-white">Decision:</span> {statsData.decision}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{statsData.conclusion}</p>
                </div>

                {/* Guardrail Metrics */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-900 block">Guardrail Metrics Health</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {Object.entries(statsData.guardrail_status).map(([k, v]: any) => (
                      <div key={k} className="p-2 rounded-lg bg-white border border-slate-200/60">
                        <span className="font-semibold text-slate-700 block capitalize">{k.replace(/_/g, ' ')}:</span>
                        <span className="text-emerald-700 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FEATURE FLAGS */}
      {activeTab === 'feature_flags' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Instant runtime kill-switches and staged percentage rollouts (0% to 100%).</span>
            <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded">Zero-Deploy Control</span>
          </div>

          <div className="space-y-3">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{flag.name}</h3>
                    <code className="bg-slate-100 text-slate-600 font-mono text-[10px] px-1.5 py-0.5 rounded">
                      {flag.key}
                    </code>
                  </div>
                  <p className="text-xs text-slate-500">{flag.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  {/* Rollout slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Rollout:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={flag.rollout_percentage}
                      onChange={(e) => handleSliderChange(flag.id, Number(e.target.value))}
                      className="w-24 accent-brand-600 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-slate-800 w-8 text-right">
                      {flag.rollout_percentage}%
                    </span>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggleFlag(flag)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${
                      flag.is_enabled
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {flag.is_enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USABILITY TESTING */}
      {activeTab === 'usability_testing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usabilityTasks.map((task) => (
              <div key={task.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-600">Task #{task.id}</span>
                  <span className="text-[10px] text-slate-400">Max Duration: {task.max_duration_seconds}s</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                <p className="text-xs text-slate-600">{task.scenario}</p>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                  <span className="font-semibold text-slate-700 block">Expected Happy Path:</span>
                  <p className="text-slate-600">{task.expected_steps}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Experiment Modal */}
      <Modal
        isOpen={isNewExpOpen}
        onClose={() => setIsNewExpOpen(false)}
        title="Create New A/B Experiment"
        subtitle="Specify falsifiable hypothesis, primary metric, and traffic allocation."
      >
        <form onSubmit={handleCreateExperiment} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Experiment Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Personalized Sizing Banner on PDP"
              value={expName}
              onChange={(e) => setExpName(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Experiment Code</label>
              <input
                type="text"
                required
                placeholder="EXP-SIZE-003"
                value={expCode}
                onChange={(e) => setExpCode(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary KPI</label>
              <select
                value={expPrimaryKpi}
                onChange={(e) => setExpPrimaryKpi(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                <option value="Add-to-Cart Conversion Rate">Add-to-Cart Conversion Rate</option>
                <option value="Checkout Initiation Rate">Checkout Initiation Rate</option>
                <option value="Product Return Rate">Product Return Rate</option>
                <option value="Search Click-Through Rate">Search Click-Through Rate</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Test Hypothesis</label>
            <textarea
              required
              rows={2}
              placeholder="IF we implement [solution], THEN [metric] will increase by [X%] because [reason]..."
              value={expHypothesis}
              onChange={(e) => setExpHypothesis(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Proposed Solution Details</label>
            <input
              type="text"
              required
              placeholder="Describe UI changes for Variant B..."
              value={expSolution}
              onChange={(e) => setExpSolution(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewExpOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow"
            >
              Start Experiment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
