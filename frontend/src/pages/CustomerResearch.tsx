import React, { useState, useEffect } from 'react';
import {
  Users2,
  FileQuestion,
  UserCheck,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Smile,
  Frown,
  Meh,
  Sparkles,
  TrendingDown,
  Layers
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const CustomerResearch: React.FC = () => {
  const { addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'pain_points' | 'journey_map' | 'personas' | 'interviews' | 'surveys' | 'validation' | 'projects'>('pain_points');
  
  const [painPoints, setPainPoints] = useState<any[]>([]);
  const [journeyStages, setJourneyStages] = useState<any[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [validations, setValidations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Pain Point Modal state
  const [isPainPointModalOpen, setIsPainPointModalOpen] = useState(false);
  const [newPainTitle, setNewPainTitle] = useState('');
  const [newPainDesc, setNewPainDesc] = useState('');
  const [newPainSegment, setNewPainSegment] = useState('Gen Z Trendsetter');
  const [newPainStage, setNewPainStage] = useState('Size Selection');
  const [newPainSeverity, setNewPainSeverity] = useState('High');
  const [newPainOpportunity, setNewPainOpportunity] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pp, jm, per, inv, srv, val, prj] = await Promise.all([
        api.research.getPainPoints(),
        api.research.getJourneyMap(),
        api.research.getPersonas(),
        api.research.getInterviews(),
        api.research.getSurveys(),
        api.research.getValidations(),
        api.research.getProjects()
      ]);
      setPainPoints(pp);
      setJourneyStages(jm);
      setPersonas(per);
      setInterviews(inv);
      setSurveys(srv);
      setValidations(val);
      setProjects(prj);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading research data',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePainPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.research.createPainPoint({
        title: newPainTitle,
        description: newPainDesc,
        customer_segment: newPainSegment,
        journey_stage: newPainStage,
        severity: newPainSeverity,
        frequency: 'Frequent',
        customer_impact: 4,
        business_impact: 4,
        status: 'Discovered',
        proposed_opportunity: newPainOpportunity
      });
      setPainPoints([created, ...painPoints]);
      setIsPainPointModalOpen(false);
      setNewPainTitle('');
      setNewPainDesc('');
      setNewPainOpportunity('');
      addToast({
        type: 'success',
        title: 'Pain Point Logged',
        message: `Registered "${created.title}" in problem discovery board.`
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to create pain point',
        message: err.message
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              Discovery Engine
            </span>
            <span className="text-xs text-slate-500">Customer Problem Space</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Research & Discovery</h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover customer problems, map multi-stage emotional journey curves, synthesize interview cohorts, and formulate validated product hypotheses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPainPointModalOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Pain Point</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'pain_points', label: 'Pain Points Tracker', count: painPoints.length },
          { key: 'journey_map', label: 'Customer Journey Map', count: journeyStages.length },
          { key: 'validation', label: 'Problem Validation', count: validations.length },
          { key: 'personas', label: 'Personas', count: personas.length },
          { key: 'interviews', label: 'User Interviews', count: interviews.length },
          { key: 'surveys', label: 'Surveys & Feedback', count: surveys.length },
          { key: 'projects', label: 'Research Projects', count: projects.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: PAIN POINTS TRACKER */}
      {activeTab === 'pain_points' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Showing {painPoints.length} prioritized customer friction records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPoints.map((pp) => {
              const isCrit = pp.severity === 'Critical';
              const isHigh = pp.severity === 'High';

              return (
                <div
                  key={pp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {pp.journey_stage}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {pp.severity} Severity
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{pp.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{pp.description}</p>

                    <div className="p-3 bg-slate-50 rounded-xl mt-3 text-[11px] space-y-1 border border-slate-100">
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700">Segment:</span> {pp.customer_segment}
                      </div>
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700">Evidence:</span> {pp.supporting_feedback}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {pp.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Impact: {pp.customer_impact}/5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER JOURNEY MAP */}
      {activeTab === 'journey_map' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
            <div>
              <span className="font-bold block">10-Stage Fashion Commerce Shopping Journey</span>
              <span>Emotional highs & drop-off vulnerabilities from discovery through post-order exchange.</span>
            </div>
            <span className="font-semibold bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-sm">
              Average Drop-Off Rate: 28.4%
            </span>
          </div>

          <div className="space-y-3">
            {journeyStages.map((stage) => {
              const isFrictionHigh = stage.drop_off_possibility > 30;
              return (
                <div
                  key={stage.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200">
                      {stage.stage_order}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{stage.stage_name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">Emotion: {stage.customer_emotion}</span>
                    </div>
                  </div>

                  <div className="flex-1 text-xs space-y-1">
                    <div className="text-slate-700">
                      <span className="font-semibold text-slate-900">Activity:</span> {stage.customer_activity}
                    </div>
                    <div className="text-rose-700 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                      <span className="font-bold">Friction:</span> {stage.friction_point}
                    </div>
                  </div>

                  <div className="w-64 shrink-0 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drop-off Risk:</span>
                      <span className={`font-bold ${isFrictionHigh ? 'text-rose-600' : 'text-slate-800'}`}>
                        {stage.drop_off_possibility}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Linked KPI:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[120px]">{stage.related_kpi}</span>
                    </div>
                    <div className="text-[11px] text-brand-700 font-semibold pt-1 border-t border-slate-200/60">
                      Opportunity: {stage.proposed_improvement}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PROBLEM VALIDATION */}
      {activeTab === 'validation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validations.map((val) => {
              const isVal = val.validation_outcome === 'Validated';
              const isInconc = val.validation_outcome === 'Inconclusive';

              return (
                <div key={val.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Validation Hypothesis #{val.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVal
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isInconc
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {val.validation_outcome}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    "{val.hypothesis}"
                  </h3>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-700">Evidence:</span> {val.evidence}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Method:</span> {val.validation_method} ({val.test_participants_count} participants)
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Observed Behaviour:</span> {val.observed_behaviour}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Source: {val.research_source}</span>
                    <span className="font-semibold text-brand-600">Confidence: {val.confidence_level}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PERSONAS */}
      {activeTab === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div key={persona.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-fashion-accent text-white font-bold text-base flex items-center justify-center shadow-md">
                    {persona.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{persona.name}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{persona.age_range} • {persona.customer_segment}</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-brand-800 bg-brand-50 p-2 rounded-lg mb-3">
                  "{persona.tagline}"
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block">Motivation:</span>
                    <span className="text-slate-600">{persona.shopping_motivation}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Core Frustrations:</span>
                    <span className="text-rose-600">{persona.common_frustrations}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Preferred Categories:</span>
                    <span className="text-slate-600">{persona.preferred_categories}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Return Behaviour:</span>
                    <span className="text-slate-500">{persona.return_behaviour}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-400 flex justify-between">
                <span>Frequency: {persona.shopping_frequency}</span>
                <span className="font-semibold text-slate-700">{persona.spending_preference}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: USER INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Showing verified qualitative interview logs (Demo dataset labelled synthetic).</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Audio & Transcripts Logged</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((inv) => (
              <div key={inv.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">{inv.participant_id}</span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {inv.customer_segment}
                  </span>
                </div>

                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block mb-0.5">Objective:</span>
                  <p className="text-slate-600">{inv.objective}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">Researcher Observation:</span>
                    <p className="text-slate-600 italic">"{inv.observations}"</p>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-700 block">Identified Friction:</span>
                    <p className="text-rose-600">{inv.pain_points}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-700 block">Product Opportunity:</span>
                    <p className="text-brand-900">{inv.opportunities}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Ref: {inv.evidence_reference}</span>
                  <span className="italic">{inv.is_synthetic ? 'Synthetic Demo Record' : 'Real Customer Record'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SURVEYS */}
      {activeTab === 'surveys' && (
        <div className="space-y-4">
          {surveys.map((srv) => (
            <div key={srv.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{srv.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {srv.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">{srv.description}</p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block">Survey Questions ({srv.questions?.length || 0}):</span>
                {srv.questions?.map((q: any) => (
                  <div key={q.id} className="p-2.5 bg-slate-50 rounded-lg text-xs flex justify-between items-center border border-slate-100">
                    <span className="text-slate-800 font-medium">{q.question_text}</span>
                    <span className="text-[10px] font-semibold uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                      {q.question_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: RESEARCH PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((prj) => (
              <div key={prj.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-600">{prj.business_area}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {prj.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{prj.name}</h3>
                <p className="text-xs text-slate-600">{prj.objective}</p>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                  <div><span className="font-semibold text-slate-700">Target Segment:</span> {prj.target_customer_segment}</div>
                  <div><span className="font-semibold text-slate-700">Research Questions:</span> {prj.research_questions}</div>
                  <div><span className="font-semibold text-slate-700">Owner:</span> {prj.owner}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Pain Point Modal */}
      <Modal
        isOpen={isPainPointModalOpen}
        onClose={() => setIsPainPointModalOpen(false)}
        title="Record Discovered Customer Pain Point"
        subtitle="Catalog validated customer friction to feed product discovery and roadmap prioritization."
      >
        <form onSubmit={handleCreatePainPoint} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Pain Point Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Inconsistent Size Scales Across Regional Brands"
              value={newPainTitle}
              onChange={(e) => setNewPainTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Detailed Description & Evidence</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the customer struggle, context, and why it happens..."
              value={newPainDesc}
              onChange={(e) => setNewPainDesc(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Journey Stage</label>
              <select
                value={newPainStage}
                onChange={(e) => setNewPainStage(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                {['Homepage', 'Search', 'Product Listing', 'Product Details', 'Size Selection', 'Cart', 'Checkout', 'Delivery', 'Returns & Exchanges'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Severity</label>
              <select
                value={newPainSeverity}
                onChange={(e) => setNewPainSeverity(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                {['Critical', 'High', 'Medium', 'Low'].map((sev) => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Proposed Product Opportunity</label>
            <input
              type="text"
              placeholder="e.g., Build ML Smart Size Recommender widget on PDP"
              value={newPainOpportunity}
              onChange={(e) => setNewPainOpportunity(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPainPointModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow-md"
            >
              Save to Discovery Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
