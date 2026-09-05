"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, Check } from "lucide-react";

interface PatientConflictsTabProps {
  patientId: string;
  conflicts: Array<{
    id: string;
    category: string;
    description: string;
    valueA: string | null;
    valueB: string | null;
    status: string;
    createdAt: string | Date;
  }>;
}

export function PatientConflictsTab({ patientId, conflicts: initialConflicts }: PatientConflictsTabProps) {
  const [conflicts, setConflicts] = useState(initialConflicts);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleResolve = async (id: string, status: "RESOLVED" | "DISMISSED") => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/conflicts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setConflicts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              Cross-Report Clinical Consistency Engine
            </h3>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              MedLens highlights discrepancies between patient-reported intake information and lab report headers. 
              <strong> MedLens never makes automated clinical choices;</strong> all discrepancies require human review.
            </p>
          </div>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
          <h4 className="mt-2 text-sm font-bold text-slate-900">No Active Inconsistencies</h4>
          <p className="text-xs text-slate-500 mt-1">
            All records and intake reports currently align without contradictory entries.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`rounded-2xl border p-5 bg-white shadow-sm transition-all ${
                conflict.status === "NEEDS_REVIEW"
                  ? "border-amber-300 ring-1 ring-amber-200"
                  : "border-slate-200 opacity-80"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    {conflict.category} CONFLICT
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    Potential Inconsistency Detected
                  </span>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    conflict.status === "NEEDS_REVIEW"
                      ? "bg-amber-100 text-amber-800 animate-pulse"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {conflict.status === "NEEDS_REVIEW" ? "Needs Human Review" : "Resolved by Reviewer"}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-700 leading-relaxed font-medium">
                {conflict.description}
              </p>

              {/* Side by side contradictory values */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Source A</span>
                  <p className="mt-1 font-mono text-slate-800 bg-white p-2 rounded border border-slate-200">
                    {conflict.valueA || "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Source B</span>
                  <p className="mt-1 font-mono text-slate-800 bg-white p-2 rounded border border-slate-200">
                    {conflict.valueB || "Not specified"}
                  </p>
                </div>
              </div>

              {conflict.status === "NEEDS_REVIEW" && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleResolve(conflict.id, "DISMISSED")}
                    disabled={isUpdating}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Dismiss Inconsistency
                  </button>
                  <button
                    onClick={() => handleResolve(conflict.id, "RESOLVED")}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Mark as Reconciled</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
