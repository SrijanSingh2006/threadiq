import React, { useState, useEffect } from 'react';
import {
  Compass,
  Lightbulb,
  Layers,
  Calculator,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const ProductDiscovery: React.FC = () => {
  const { addToast } = useStore();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [validations, setValidations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Opportunity Sizing Calculator state
  const [monthlyShoppers, setMonthlyShoppers] = useState(120000);
  const [avgOrderValue, setAvgOrderValue] = useState(2400);
  const [expectedAtcLift, setExpectedAtcLift] = useState(6.5);
  const [returnReductionPct, setReturnReductionPct] = useState(15.0);

  // Computed metrics
  const additionalOrdersMonthly = Math.round(monthlyShoppers * (expectedAtcLift / 100.0) * 0.28);
  const monthlyGmvUnlock = additionalOrdersMonthly * avgOrderValue;
  const annualGmvUnlock = monthlyGmvUnlock * 12;
  const annualReverseLogisticsSavings = Math.round(additionalOrdersMonthly * 12 * 0.18 * 140 * (returnReductionPct / 100.0));

  const loadDiscoveryData = async () => {
    setIsLoading(true);
    try {
      const [opps, vals] = await Promise.all([
        api.market.getOpportunities(),
        api.research.getValidations()
      ]);
      setOpportunities(opps);
      setValidations(vals);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading discovery data',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
            Problem Framing & Sizing
          </span>
          <span className="text-xs text-slate-500">Hypothesis Canvas</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Product Discovery & Opportunity Sizing</h1>
        <p className="text-xs text-slate-500 mt-1">
          Frame unstructured customer problems into falsifiable product hypotheses, cluster themes, and model business revenue uplift.
        </p>
      </div>

      {/* Discovery Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Theme 1: Sizing Confidence</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Asymmetric Regional Brand Fit</h3>
          <p className="text-xs text-slate-600">
            Ethnic wear displays highest variance in measurements. 48% of return volume stems from fit uncertainty.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700">
            Validated in Usability Lab • P0 Priority
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Theme 2: Visual Truth</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Studio Lighting Color Distortion</h3>
          <p className="text-xs text-slate-600">
            Customers receive garments where daylight color and texture differ significantly from studio photos.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-brand-600">
            Vendor Sizing SOP Required • In Discovery
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Theme 3: Discovery Speed</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Colloquial Fashion Vernacular</h3>
          <p className="text-xs text-slate-600">
            Shoppers query occasion terms ('Haldi look', 'Airport casual') triggering 8.4% zero-result searches.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700">
            Query Expansion Model Validated
          </div>
        </div>
      </div>

      {/* Opportunity Sizing Calculator */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold text-white">Interactive Opportunity Sizing Model</h2>
          </div>
          <span className="text-xs text-slate-400">Assumptions & Sensitivity Analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Monthly Active Shoppers</label>
            <input
              type="number"
              value={monthlyShoppers}
              onChange={(e) => setMonthlyShoppers(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Average Order Value (₹ INR)</label>
            <input
              type="number"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Expected Add-to-Cart Lift (%)</label>
            <input
              type="number"
              step="0.5"
              value={expectedAtcLift}
              onChange={(e) => setExpectedAtcLift(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Return Rate Reduction (%)</label>
            <input
              type="number"
              step="1.0"
              value={returnReductionPct}
              onChange={(e) => setReturnReductionPct(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        </div>

        {/* Calculated Results Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">Additional Monthly Orders</span>
            <span className="text-2xl font-bold text-white">+{additionalOrdersMonthly.toLocaleString()} Orders</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
            <span className="text-[11px] text-emerald-400 block mb-1">Projected Annual GMV Unlock</span>
            <span className="text-2xl font-bold text-emerald-300">₹{(annualGmvUnlock / 10000000).toFixed(2)} Cr</span>
          </div>

          <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-800/60">
            <span className="text-[11px] text-brand-300 block mb-1">Reverse Logistics Cost Saved</span>
            <span className="text-2xl font-bold text-brand-200">₹{(annualReverseLogisticsSavings / 100000).toFixed(1)} Lakhs</span>
          </div>
        </div>
      </div>

      {/* Discovery Opportunities List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Evaluated Market Opportunities</h3>
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {opp.status}
                  </span>
                  <span className="text-xs text-slate-400">Target: {opp.customer_segment}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{opp.market_problem}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{opp.customer_benefit}</p>
                <div className="text-[11px] text-indigo-700 font-semibold pt-1">
                  Recommendation: {opp.recommendation}
                </div>
              </div>

              <div className="w-56 shrink-0 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Value:</span>
                  <span className="font-bold text-emerald-700">{opp.potential_business_value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Complexity:</span>
                  <span className="font-semibold text-slate-700">{opp.product_complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence Score:</span>
                  <span className="font-bold text-brand-700">{opp.confidence_score} / 10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
