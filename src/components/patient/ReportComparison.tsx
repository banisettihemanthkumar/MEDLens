"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { GitCompare, ArrowRight, Info, Check, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface ReportData {
  id: string;
  title: string;
  reportDate: string | Date | null;
  createdAt: string | Date;
  observations: Array<{
    id: string;
    testName: string;
    value: string;
    unit: string | null;
    referenceText: string | null;
    status: string;
  }>;
}

interface ReportComparisonProps {
  patientId: string;
  reports: ReportData[];
}

export function ReportComparison({ patientId, reports }: ReportComparisonProps) {
  const [reportAId, setReportAId] = useState<string>(reports[1]?.id || reports[0]?.id || "");
  const [reportBId, setReportBId] = useState<string>(reports[0]?.id || "");

  const reportA = reports.find((r) => r.id === reportAId);
  const reportB = reports.find((r) => r.id === reportBId);

  // Match tests across reports
  const allTestNames = Array.from(
    new Set([
      ...(reportA?.observations || []).map((o) => o.testName),
      ...(reportB?.observations || []).map((o) => o.testName),
    ])
  );

  const getDeltaIndicator = (valA?: string, valB?: string) => {
    if (!valA || !valB) return <Minus className="h-3 w-3 text-slate-300" />;
    const numA = parseFloat(valA);
    const numB = parseFloat(valB);
    if (isNaN(numA) || isNaN(numB)) {
      return valA !== valB ? <span className="text-[10px] text-sky-600 font-semibold">Changed</span> : <Minus className="h-3 w-3 text-slate-300" />;
    }
    if (numB > numA) {
      return (
        <span className="inline-flex items-center gap-0.5 text-rose-600 font-semibold text-[11px]">
          <ArrowUpRight className="h-3.5 w-3.5" />
          +{(numB - numA).toFixed(1)}
        </span>
      );
    }
    if (numB < numA) {
      return (
        <span className="inline-flex items-center gap-0.5 text-blue-600 font-semibold text-[11px]">
          <ArrowDownRight className="h-3.5 w-3.5" />
          {(numB - numA).toFixed(1)}
        </span>
      );
    }
    return <span className="text-[10px] text-slate-400">No shift</span>;
  };

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <GitCompare className="h-5 w-5 text-sky-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Compare Two Medical Reports</h2>
            <p className="text-xs text-slate-500">
              Direct longitudinal comparison of observations and source reference ranges
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Previous Report (Baseline)
            </label>
            <select
              value={reportAId}
              onChange={(e) => setReportAId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-sky-500 focus:outline-none"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({formatDate(r.reportDate || r.createdAt)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Current Report (Comparison)
            </label>
            <select
              value={reportBId}
              onChange={(e) => setReportBId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-sky-500 focus:outline-none"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({formatDate(r.reportDate || r.createdAt)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-[11px] text-sky-900 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" />
          <p>
            <strong>Note on Changes:</strong> Differences indicate shifts in reported numbers between lab documents. MedLens does not interpret whether a change is clinically favorable, adverse, or indicative of disease.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Observation / Test</th>
                <th className="py-3 px-4">Previous Value</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Reported Delta</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Previous Ref</th>
                <th className="py-3 px-4">Current Ref</th>
                <th className="py-3 px-4">Previous Status</th>
                <th className="py-3 px-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTestNames.map((testName) => {
                const obsA = reportA?.observations.find((o) => o.testName === testName);
                const obsB = reportB?.observations.find((o) => o.testName === testName);

                return (
                  <tr key={testName} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{testName}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {obsA ? obsA.value : "—"}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      {obsB ? obsB.value : "—"}
                    </td>
                    <td className="py-3 px-4">{getDeltaIndicator(obsA?.value, obsB?.value)}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {obsB?.unit || obsA?.unit || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {obsA?.referenceText || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {obsB?.referenceText || "—"}
                    </td>
                    <td className="py-3 px-4">
                      {obsA ? <StatusBadge status={obsA.status} /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      {obsB ? <StatusBadge status={obsB.status} /> : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
