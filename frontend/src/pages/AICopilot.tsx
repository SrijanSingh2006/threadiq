import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Cpu,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const AICopilot: React.FC = () => {
  const { addToast } = useStore();
  const [selectedWorkflow, setSelectedWorkflow] = useState('feedback_summarisation');
  const [customPrompt, setCustomPrompt] = useState('Synthesize customer feedback regarding sizing discrepancies and propose a prioritized product hypothesis.');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const workflows = [
    { id: 'feedback_summarisation', label: '1. Feedback Summarisation', prompt: 'Synthesize customer interviews and stakeholder feedback regarding sizing discrepancies.' },
    { id: 'customer_pain_point_extraction', label: '2. Pain-Point Extraction', prompt: 'Extract prioritized friction points across the customer shopping journey with severity ratings.' },
    { id: 'product_hypothesis_suggestions', label: '6. Product Hypotheses', prompt: 'Formulate testable product hypotheses addressing size selection anxiety on fashion PDPs.' },
    { id: 'user_story_generation', label: '8. User Story Generator', prompt: 'Generate an Agile user story with Gherkin acceptance criteria for Smart Size Recommender.' },
    { id: 'rice_prioritisation_suggestions', label: '13. RICE Prioritisation', prompt: 'Evaluate discovery opportunities using RICE formula and recommend Q1 sprint priorities.' },
    { id: 'release_note_generation', label: '14. Release Notes Draft', prompt: 'Draft executive release notes for v2.4.0 Summer Discovery & Size Intelligence Release.' },
    { id: 'experiment_plan_generation', label: '11. Experiment Plan', prompt: 'Draft statistical A/B test plan for sticky size chips with sample size power calculations.' },
    { id: 'sentiment_and_theme_analysis', label: '3. Theme Analysis', prompt: 'Cluster customer friction into high-leverage themes across ethnic vs western fashion.' },
  ];

  const handleExecute = async (overrideWorkflow?: string, overridePrompt?: string) => {
    const wf = overrideWorkflow || selectedWorkflow;
    const p = overridePrompt || customPrompt;
    setIsLoading(true);
    setResponse(null);

    try {
      const result = await api.copilot.generateInsight({
        workflow_type: wf,
        prompt: p
      });
      setResponse(result);
      addToast({
        type: 'success',
        title: 'Copilot Analysis Generated',
        message: `Synthesized via ${result.engine_mode}.`
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Copilot generation failed',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetSelect = (preset: any) => {
    setSelectedWorkflow(preset.id);
    setCustomPrompt(preset.prompt);
    handleExecute(preset.id, preset.prompt);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.summary_markdown);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
    addToast({ type: 'info', title: 'Copied to Clipboard', message: 'Markdown analysis copied.' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>AI Product Copilot</span>
          </span>
          <span className="text-xs text-slate-500">Grounded in Active Platform DB Records</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">AI Product Management Copilot</h1>
        <p className="text-xs text-slate-500 mt-1">
          Assists fashion commerce PMs with feedback summarization, hypothesis formulation, Gherkin user story authoring, RICE advisory, and release notes compilation.
        </p>
      </div>

      {/* Workflow Presets Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Preset Product Workflows (Select to execute):
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {workflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => handlePresetSelect(wf)}
              className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap shadow-xs ${
                selectedWorkflow === wf.id
                  ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {wf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Input Box */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Copilot Prompt & Directive</label>
          <textarea
            rows={3}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Instruct the AI Copilot on what to analyze or synthesize..."
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-brand-600" />
            <span>Dual Engine: Google Gemini API (Live) + Deterministic Domain Intelligence (Fallback)</span>
          </div>

          <button
            onClick={() => handleExecute()}
            disabled={isLoading || !customPrompt.trim()}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Context...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Copilot Response Output Card */}
      {response && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                  {response.engine_mode}
                </span>
                <span className="text-xs text-slate-400 font-medium">Model: {response.model_name}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{response.title}</h2>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>

          {/* Rendered Markdown Analysis */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line space-y-3">
            {response.summary_markdown}
          </div>

          {/* Actionable Next Steps */}
          {response.actionable_items?.length > 0 && (
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Recommended Action Items:</span>
              <div className="space-y-1.5">
                {response.actionable_items.map((act: string, aIdx: number) => (
                  <div key={aIdx} className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grounding & Database Citations */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Application Grounding & Source Citations:</span>
            <div className="flex flex-wrap gap-1.5">
              {response.source_records_cited?.map((cit: string, cIdx: number) => (
                <span key={cIdx} className="bg-white border border-slate-200 px-2 py-1 rounded text-[11px] text-slate-600 font-mono">
                  {cit}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              {response.confidence_note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
