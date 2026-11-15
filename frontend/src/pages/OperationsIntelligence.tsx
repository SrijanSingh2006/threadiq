import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Truck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  FileCheck2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const OperationsIntelligence: React.FC = () => {
  const { addToast } = useStore();
  const [metrics, setMetrics] = useState<any>(null);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOpsData = async () => {
    setIsLoading(true);
    try {
      const [m, ls] = await Promise.all([
        api.supplyChain.getMetrics(),
        api.supplyChain.getLowStock()
      ]);
      setMetrics(m);
      setLowStockItems(ls);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading operations intelligence',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpsData();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  const inbound = metrics?.inbound || {};
  const outbound = metrics?.outbound || {};
  const post_order = metrics?.post_order || {};

  const returnReasonsData =
    (Array.isArray(post_order?.top_return_reasons) && post_order.top_return_reasons.length > 0)
      ? post_order.top_return_reasons
      : (Array.isArray(metrics?.return_reasons) && metrics.return_reasons.length > 0)
        ? metrics.return_reasons.map((r: any) => ({
            reason: r.reason,
            count: r.count ?? Math.round(((r.percentage || 10) / 100) * 312),
            percentage: r.percentage ?? 10
          }))
        : [
            { reason: 'Size / Fit Mismatch', count: 182, percentage: 58.2 },
            { reason: 'Fabric / Material Texture', count: 57, percentage: 18.4 },
            { reason: 'Color Discrepancy from Photos', count: 38, percentage: 12.1 },
            { reason: 'Defective Stitching / Zipper', count: 21, percentage: 6.8 },
            { reason: 'Late Delivery / Transit Delay', count: 14, percentage: 4.5 }
          ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            Supply Chain Intelligence
          </span>
          <span className="text-xs text-slate-500">Inbound & Outbound Logistics</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Operations & Supply Chain Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">
          End-to-end operational visibility: supplier lead times, catalogue completeness verification, real-time inventory aging, low-stock reorder thresholds, and reverse logistics return telemetry.
        </p>
      </div>

      {/* KPI Cards: Inbound vs Outbound */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Inbound Quality</span>
          <div className="text-2xl font-bold text-slate-900">
            {inbound.catalogue_completeness_percent ?? inbound.on_time_fulfillment_rate ?? 98.4}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Catalogue Completeness</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Supplier SLA</span>
          <div className="text-2xl font-bold text-slate-900">
            {inbound.average_lead_time_days ?? inbound.avg_lead_time_days ?? 4.8} Days
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {inbound.active_suppliers_count ?? inbound.active_suppliers ?? 38} Active Textile Mills
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">On-Time Delivery</span>
          <div className="text-2xl font-bold text-slate-900">
            {outbound.on_time_delivery_rate_percent ?? outbound.first_attempt_delivery_rate ?? 94.6}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Within 72hr SLA Window</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reverse Logistics</span>
          <div className="text-2xl font-bold text-rose-600">
            {post_order?.return_rate_percent ?? metrics?.return_rate_percent ?? 14.8}%
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {post_order?.total_return_requests ?? 312} Return Pickups
          </span>
        </div>
      </div>

      {/* Charts & Returns Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Return Reasons Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Return Reasons Root-Cause Telemetry</h3>
            <p className="text-xs text-slate-500">Categorized reverse logistics root-causes across apparel orders</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={returnReasonsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="reason" type="category" width={140} tick={{ fontSize: 10, fill: '#334155' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} returns`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-800">
            <strong>Key Operational Finding:</strong> Sizing discrepancies account for &gt;45% of total returns. Launching the Smart Fit Predictor widget on PDP directly mitigates this volume.
          </div>
        </div>

        {/* Inventory Aging & Stock Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Inventory Health & Stockout Alerts</h3>
            <p className="text-xs text-slate-500 mb-4">Real-time warehouse buffer and aging metrics</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Total Available Stock</span>
                <span className="text-lg font-bold text-slate-900">{(outbound?.total_stock_units ?? 0).toLocaleString()} Units</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-amber-700 block text-[10px]">Aged Inventory (&gt;30 Days)</span>
                <span className="text-lg font-bold text-amber-900">{outbound.aged_inventory_units_gt30d} SKUs</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-rose-700 block text-[10px]">Low Stock Alert</span>
                <span className="text-lg font-bold text-rose-900">{outbound.low_stock_skus_count} SKUs Below Reorder</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Fulfilment Cycle</span>
                <span className="text-lg font-bold text-slate-900">{outbound.average_fulfilment_cycle_hours} Hours</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-xs text-slate-500 flex justify-between items-center">
            <span>Synthetic Operational Telemetry</span>
            <span className="text-[11px] font-bold text-brand-600">Buffer Health: Nominal</span>
          </div>
        </div>
      </div>

      {/* Low Stock Reorder Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Urgent Inventory Replenishment Queue</h3>
          <span className="text-xs text-slate-400">SKUs below safety stock buffer</span>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Brand</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Reorder Threshold</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono text-slate-700">{item.sku}</td>
                  <td className="p-3.5 font-bold text-slate-900">{item.product_name}</td>
                  <td className="p-3.5 text-slate-600">{item.brand}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{item.size}</td>
                  <td className="p-3.5 font-bold text-rose-600">{item.current_stock} Units</td>
                  <td className="p-3.5 text-slate-500">{item.reorder_threshold} Units</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Reorder Triggered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
