import React, { useState, useEffect } from 'react';
import {
  KanbanSquare,
  Plus,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  User,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const SprintWorkspace: React.FC = () => {
  const { addToast } = useStore();
  const [sprints, setSprints] = useState<any[]>([]);
  const [activeSprint, setActiveSprint] = useState<any>(null);
  const [burndown, setBurndown] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Story Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [userRole, setUserRole] = useState('As a fashion shopper uncertain about sizing,');
  const [userNeed, setUserNeed] = useState('I want personalized fit recommendations on the product page,');
  const [businessValue, setBusinessValue] = useState('So that return rates decrease and purchase confidence increases.');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('1. Renders within 200ms\n2. Size guide opens\n3. Event tracked');
  const [storyPoints, setStoryPoints] = useState(5);
  const [priority, setPriority] = useState('High');
  const [owner, setOwner] = useState('Rohan Verma');

  const defaultBurndownDays = [
    { day: 'Day 1', ideal_remaining_points: 42, actual_remaining_points: 42 },
    { day: 'Day 2', ideal_remaining_points: 37.3, actual_remaining_points: 40 },
    { day: 'Day 3', ideal_remaining_points: 32.7, actual_remaining_points: 37 },
    { day: 'Day 4', ideal_remaining_points: 28.0, actual_remaining_points: 33 },
    { day: 'Day 5', ideal_remaining_points: 23.3, actual_remaining_points: 29 },
    { day: 'Day 6', ideal_remaining_points: 18.7, actual_remaining_points: 24 },
    { day: 'Day 7', ideal_remaining_points: 14.0, actual_remaining_points: 20 },
    { day: 'Day 8', ideal_remaining_points: 9.3, actual_remaining_points: 16 },
    { day: 'Day 9', ideal_remaining_points: 4.7, actual_remaining_points: 13 },
    { day: 'Day 10', ideal_remaining_points: 0, actual_remaining_points: 13 }
  ];

  const defaultStories = [
    { id: 1, title: 'Implement AI Fit Advisor widget on PDP', epic: 'Size & Fit Intelligence', status: 'done', story_points: 8, priority: 'P0', assignee: 'Rohan Verma', owner: 'Rohan Verma', user_role: 'shopper', user_need: 'accurate size recommendation', business_value: 'reduce returns by 18%', sprint_id: 1 },
    { id: 2, title: 'Add Customer Body Height/Weight filter to Reviews', epic: 'Customer Research & UGC', status: 'in_review', story_points: 5, priority: 'P1', assignee: 'Ananya Iyer', owner: 'Ananya Iyer', user_role: 'shopper', user_need: 'see reviews from people with my build', business_value: 'higher sizing confidence', sprint_id: 1 },
    { id: 3, title: 'First-party size selection telemetry pipeline', epic: 'Event Telemetry & Analytics', status: 'in_progress', story_points: 5, priority: 'P0', assignee: 'Diya Patel', owner: 'Diya Patel', user_role: 'analyst', user_need: 'track micro-dropoffs', business_value: 'granular friction diagnostics', sprint_id: 1 },
    { id: 4, title: 'One-click UPI intent payment integration', epic: 'Frictionless Checkout', status: 'in_progress', story_points: 8, priority: 'P1', assignee: 'Rohan Verma', owner: 'Rohan Verma', user_role: 'shopper', user_need: 'fast seamless UPI checkout', business_value: 'lower payment abandonment', sprint_id: 1 },
    { id: 5, title: 'Automated 48-Hour Inbound Supplier Restock Alert', epic: 'Supply Chain Operations', status: 'todo', story_points: 3, priority: 'P2', assignee: 'Vikram Rao', owner: 'Vikram Rao', user_role: 'ops manager', user_need: 'automated low stock alerts', business_value: 'prevent size stockouts', sprint_id: 1 },
    { id: 6, title: 'Doorstep size exchange logistics routing', epic: 'Reverse Logistics', status: 'backlog', story_points: 5, priority: 'P1', assignee: 'Vikram Rao', owner: 'Vikram Rao', user_role: 'shopper', user_need: 'doorstep size swap', business_value: 'save ₹140 per return', sprint_id: 1 },
    { id: 7, title: 'Edge network CDN caching for PDP images', epic: 'Performance & Vitals', status: 'qa', story_points: 3, priority: 'P2', assignee: 'Meera Nair', owner: 'Meera Nair', user_role: 'shopper', user_need: 'sub-second PDP load', business_value: 'Core Web Vitals compliance', sprint_id: 1 },
    { id: 8, title: 'Third-party brand sizing schema validator', epic: 'Catalog Operations', status: 'blocked', story_points: 5, priority: 'P1', assignee: 'Rohan Verma', owner: 'Rohan Verma', user_role: 'engineer', user_need: 'spec format enforcement', business_value: 'prevent faulty size charts', sprint_id: 1 }
  ];

  const loadSprintData = async () => {
    setIsLoading(true);
    try {
      const [sprintList, storyList] = await Promise.all([
        api.delivery.getSprints(),
        api.delivery.getStories()
      ]);
      const validSprints = Array.isArray(sprintList) && sprintList.length > 0 ? sprintList : [
        { id: 1, sprint_number: 14, name: 'Sprint 14: Size Accuracy & Cart Conversion', status: 'Active', start_date: '2025-02-10', end_date: '2025-02-24', total_points: 42, completed_points: 13, velocity: 32 }
      ];
      setSprints(validSprints);

      const active = validSprints.find((s) => s.status === 'Active') || validSprints[0];
      setActiveSprint(active);

      const validStories = Array.isArray(storyList) && storyList.length > 0 ? storyList : defaultStories;
      setStories(validStories);

      try {
        const bd = await api.delivery.getSprintBurndown(active.id);
        const burndownPoints = Array.isArray(bd) ? bd : (bd?.days || []);
        if (burndownPoints.length > 0) {
          setBurndown(burndownPoints);
        } else {
          setBurndown(defaultBurndownDays);
        }
      } catch {
        setBurndown(defaultBurndownDays);
      }
    } catch (err: any) {
      setBurndown(defaultBurndownDays);
      setStories(defaultStories);
      addToast({
        type: 'error',
        title: 'Error loading sprint workspace',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSprintData();
  }, []);

  const kanbanColumns = [
    { key: 'backlog', title: 'Backlog', color: 'border-slate-300' },
    { key: 'todo', title: 'To Do', color: 'border-blue-400' },
    { key: 'in_progress', title: 'In Progress', color: 'border-brand-500' },
    { key: 'in_review', title: 'In Review', color: 'border-purple-400' },
    { key: 'qa', title: 'QA', color: 'border-amber-400' },
    { key: 'blocked', title: 'Blocked', color: 'border-rose-500' },
    { key: 'done', title: 'Done', color: 'border-emerald-500' },
  ];

  const handleMoveStatus = async (storyId: number, newStatus: string) => {
    try {
      const updated = await api.delivery.moveStory(storyId, newStatus);
      setStories(stories.map((s) => (s.id === storyId ? updated : s)));
      if (selectedStory?.id === storyId) {
        setSelectedStory(updated);
      }
      addToast({
        type: 'info',
        title: 'Story Status Updated',
        message: `"${updated.title}" moved to ${newStatus.toUpperCase()}.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Move failed', message: err.message });
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.delivery.createStory({
        title,
        user_role: userRole,
        user_need: userNeed,
        business_value: businessValue,
        acceptance_criteria: acceptanceCriteria,
        priority,
        owner,
        story_points: storyPoints,
        status: 'todo',
        sprint_id: activeSprint?.id || 1
      });
      setStories([...stories, created]);
      setIsModalOpen(false);
      setTitle('');
      addToast({
        type: 'success',
        title: 'User Story Added',
        message: `Registered "${created.title}" in sprint backlog.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to create story', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
              Agile & Scrum Delivery
            </span>
            <span className="text-xs text-slate-500">Internal Sprint Tracking Board (Zero Jira Dependency)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sprint Workspace & Kanban</h1>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate cross-functional development across Product, Engineering, Design, and QA with internal Kanban workflows, acceptance criteria, and burn-down reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create User Story</span>
          </button>
        </div>
      </div>

      {/* Active Sprint Summary Banner */}
      {activeSprint && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">{activeSprint.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeSprint.status}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Sprint Goal:</strong> {activeSprint.goal}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block">Committed Points</span>
              <span className="font-bold text-slate-800">{burndown?.total_committed_points || 42} Pts</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] text-emerald-600 block">Completed</span>
              <span className="font-bold text-emerald-800">{burndown?.completed_points || 13} Pts</span>
            </div>
            <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-center">
              <span className="text-[10px] text-brand-600 block">Remaining</span>
              <span className="font-bold text-brand-800">{burndown?.remaining_points || 29} Pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Sprint Burndown Chart */}
      {burndown && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeSprint?.name || 'Sprint 14'} Burndown Trajectory</h3>
              <p className="text-xs text-slate-500">Ideal burn rate vs actual story points completed</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-400 inline-block" /> Ideal
              </span>
              <span className="flex items-center gap-1.5 text-brand-600 font-semibold">
                <span className="w-3 h-0.5 bg-brand-600 inline-block" /> Actual
              </span>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.isArray(burndown) ? burndown : (burndown?.days || [])} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} points`, name === 'actual_remaining_points' ? 'Actual' : 'Ideal']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="ideal_remaining_points" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="actual_remaining_points" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 7-Column Kanban Board */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {activeSprint?.name || 'Sprint 14'} Kanban Board (Click card to inspect or move)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-w-[1050px] overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const normalizeStatus = (status: string) => {
              const s = (status || '').toLowerCase().replace(/[\s-]+/g, '_');
              if (s === 'to_do') return 'todo';
              return s;
            };
            const columnStories = stories.filter((s) => normalizeStatus(s.status) === col.key);
            const totalPts = columnStories.reduce((sum, s) => sum + (Number(s.story_points) || 0), 0);

            return (
              <div
                key={col.key}
                className={`p-3 rounded-2xl bg-slate-50/70 border-t-4 ${col.color} border-slate-200 shadow-xs flex flex-col justify-between min-h-[420px]`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800">{col.title}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded border">
                      {columnStories.length} ({totalPts}pt)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {columnStories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => setSelectedStory(story)}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-500/60 hover:shadow-md transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">US-{story.id}</span>
                          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded">
                            {story.story_points} pts
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{story.title}</h4>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[80px]">{story.owner}</span>
                          </span>
                          <span className="font-semibold text-slate-600">{story.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Detail & Move Modal */}
      {selectedStory && (
        <Modal
          isOpen={Boolean(selectedStory)}
          onClose={() => setSelectedStory(null)}
          title={selectedStory.title}
          subtitle={`Story ID: US-${selectedStory.id} • ${selectedStory.story_points} Story Points • Priority: ${selectedStory.priority}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">User Story Narrative:</span>
              <p className="text-slate-700"><strong>As a:</strong> {selectedStory.user_role}</p>
              <p className="text-slate-700"><strong>I want:</strong> {selectedStory.user_need}</p>
              <p className="text-slate-700"><strong>So that:</strong> {selectedStory.business_value}</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 block">Acceptance Criteria (Gherkin):</span>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] whitespace-pre-line leading-relaxed">
                {selectedStory.acceptance_criteria}
              </div>
            </div>

            {/* Move Column Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block">Transition Kanban Stage:</span>
              <div className="flex flex-wrap gap-2">
                {kanbanColumns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => handleMoveStatus(selectedStory.id, col.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedStory.status === col.key
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Story Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Author Agile User Story"
        subtitle="Specify persona role, business justification, and testable acceptance criteria."
      >
        <form onSubmit={handleCreateStory} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Story Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Real-time Courier Live Tracking Milestone Webhook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Story Points (Fibonacci)</label>
              <select
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
              >
                {[1, 2, 3, 5, 8, 13].map((pt) => (
                  <option key={pt} value={pt}>{pt} Points</option>
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
                {['Critical', 'High', 'Medium', 'Low'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Assignee</label>
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
            <label className="font-semibold text-slate-700">Acceptance Criteria</label>
            <textarea
              required
              rows={3}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
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
              Create Story
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
