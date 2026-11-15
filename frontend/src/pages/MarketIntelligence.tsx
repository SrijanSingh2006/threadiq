import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Globe,
  Award,
  CheckCircle2,
  XCircle,
  Minus,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const MarketIntelligence: React.FC = () => {
  const { addToast } = useStore();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'trends'>('matrix');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [compData, resData] = await Promise.all([
        api.market.getCompetitors(),
        api.market.getResearch()
      ]);
      setCompetitors(compData);
      setResearch(resData);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading market intelligence',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dimensions = [
    'Product Discovery',
    'Search Experience',
    'Size Guidance',
    'Checkout Experience',
    'Returns & Exchanges'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Competitive Benchmarking
          </span>
          <span className="text-xs text-slate-500">Market Research Repository</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Market & Competitor Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">
          Systematic feature evaluation against direct peers (Ajio, Nykaa Fashion) and global benchmarks (Zara, H&M) to identify whitespace opportunities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeTab === 'matrix'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Competitor Comparison Matrix
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-3 py-2 border-b-2 rounded-t-lg transition-all ${
            activeTab === 'trends'
              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Market Trends & Research Repository ({research.length})
        </button>
      </div>

      {/* TAB 1: COMPETITOR MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              Benchmarking across 5 enterprise players: <strong>ThreadIQ</strong> vs <strong>Ajio</strong>, <strong>Zara</strong>, <strong>Nykaa</strong>, and <strong>H&M</strong>.
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Synthetic Benchmark Audit</span>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 w-44">Experience Dimension</th>
                  <th className="p-4 bg-brand-50/60 text-brand-900 font-bold border-x border-brand-200/40">ThreadIQ (Target)</th>
                  <th className="p-4">Ajio</th>
                  <th className="p-4">Zara</th>
                  <th className="p-4">Nykaa Fashion</th>
                  <th className="p-4">H&M</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">1. Product Discovery</td>
                  <td className="p-4 bg-brand-50/30 font-semibold text-brand-900 border-x border-brand-200/40">
                    AI Curated feeds + Occasion vernacular
                  </td>
                  <td className="p-4 text-slate-600">Category deep menus; festive landing pages</td>
                  <td className="p-4 text-slate-600">Minimalist lookbooks; editorial photography</td>
                  <td className="p-4 text-slate-600">Influencer reels & beauty cross-sell</td>
                  <td className="p-4 text-slate-600">Trend edits; sustainable collections</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">2. Search Experience</td>
                  <td className="p-4 bg-brand-50/30 font-semibold text-brand-900 border-x border-brand-200/40">
                    Sub-second autocomplete + Typo semantic tolerance
                  </td>
                  <td className="p-4 text-slate-600">Standard keyword match; slower mobile latency</td>
                  <td className="p-4 text-slate-600">Clean visual search; sparse text results</td>
                  <td className="p-4 text-slate-600">Brand priority boost; tag-based autocomplete</td>
                  <td className="p-4 text-slate-600">Basic text search with category pills</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">3. Size Guidance</td>
                  <td className="p-4 bg-brand-50/30 font-semibold text-brand-900 border-x border-brand-200/40">
                    Smart Size Predictor + Fit-history badges
                  </td>
                  <td className="p-4 text-slate-600">Static 2D size tables; high user doubt</td>
                  <td className="p-4 text-slate-600">Leading 'What is my size?' slider tool</td>
                  <td className="p-4 text-slate-600">Garment measurements only; no personal ML</td>
                  <td className="p-4 text-slate-600">Interactive body measurement estimator</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">4. Checkout Experience</td>
                  <td className="p-4 bg-brand-50/30 font-semibold text-brand-900 border-x border-brand-200/40">
                    Single-page checkout with zero layout shift
                  </td>
                  <td className="p-4 text-slate-600">Multi-step redirect; high payment friction</td>
                  <td className="p-4 text-slate-600">Quick guest checkout with ApplePay/Card</td>
                  <td className="p-4 text-slate-600">Unified cart with Nykaa Beauty</td>
                  <td className="p-4 text-slate-600">Member points auto-redeem at payment</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">5. Returns & Exchanges</td>
                  <td className="p-4 bg-brand-50/30 font-semibold text-brand-900 border-x border-brand-200/40">
                    1-Click Doorstep Instant Replacement Swap
                  </td>
                  <td className="p-4 text-slate-600">7-10 day turnaround; pickup inspection delay</td>
                  <td className="p-4 text-slate-600">Drop-off at physical store or courier fee</td>
                  <td className="p-4 text-slate-600">Customer care verification required</td>
                  <td className="p-4 text-slate-600">In-store free return or carrier return fee</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TRENDS & MARKET RESEARCH */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {research.map((res) => (
            <div key={res.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {res.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Reliability: {res.reliability}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.topic}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{res.finding}</p>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                <span className="font-semibold text-slate-700 block">Product Implication:</span>
                <p className="text-brand-950 font-medium">{res.implication}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Source: {res.source}</span>
                <span className="italic">{res.is_synthetic ? 'Synthetic Benchmark' : 'Verified Source'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
