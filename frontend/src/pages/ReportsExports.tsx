import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Database,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Table,
  FileText
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';

export const ReportsExports: React.FC = () => {
  const { addToast } = useStore();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [tableauMeta, setTableauMeta] = useState<any>(null);

  useEffect(() => {
    Promise.all([api.reports.getCatalog(), api.reports.getTableauMeta()])
      .then(([cats, meta]) => {
        setCatalog(cats);
        setTableauMeta(meta);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Export & BI Hub
          </span>
          <span className="text-xs text-slate-500">Tableau & Excel Compatibility</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Reports, Exports & Tableau Support</h1>
        <p className="text-xs text-slate-500 mt-1">
          Export verified analytical data in multi-sheet Microsoft Excel (XLSX) format, clean CSV fact/dimension files, or connect directly to Tableau via PostgreSQL dimensional models.
        </p>
      </div>

      {/* Executive Master Download Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white shadow-xl border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400">Executive Master Workbook</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              OpenPyXL / XLSX
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">Full Platform Intelligence Workbook (.xlsx)</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Contains Fact_Product_Events, Fact_Orders, Dim_Products, Dim_Customers, Pain Points, and Launch Checklist across formatted individual tabs.
          </p>
        </div>

        <a
          href={api.reports.excelExportUrl()}
          download="ThreadIQ_Executive_Intelligence_Report.xlsx"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Master Excel Workbook</span>
        </a>
      </div>

      {/* Tableau Support & Star Schema Specification */}
      {tableauMeta && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Tableau Dimensional Data Model (Star Schema)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Host: {tableauMeta.connection_host}</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {tableauMeta.instructions} All fact tables are denormalized for direct drag-and-drop analysis without circular joins.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">Fact Tables (Measures & Events):</span>
              <div className="flex flex-wrap gap-1.5">
                {tableauMeta.star_schema?.fact_tables?.map((f: string) => (
                  <code key={f} className="bg-white border border-slate-200 px-2 py-1 rounded font-mono text-[11px] text-brand-700">
                    {f}
                  </code>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 block">Dimension Tables (Attributes & Cohorts):</span>
              <div className="flex flex-wrap gap-1.5">
                {tableauMeta.star_schema?.dimension_tables?.map((d: string) => (
                  <code key={d} className="bg-white border border-slate-200 px-2 py-1 rounded font-mono text-[11px] text-indigo-700">
                    {d}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 16 Individual Reports Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Enterprise Report Catalog (16 Formats)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {catalog.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all text-xs"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {rep.category}
                </span>
                <h4 className="font-bold text-slate-900 leading-snug">{rep.title}</h4>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                  {rep.format}
                </span>
                <a
                  href={api.reports.csvExportUrl(rep.id)}
                  download={`ThreadIQ_${rep.id}.csv`}
                  className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Export CSV</span>
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
