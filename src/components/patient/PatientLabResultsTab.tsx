"use client";

import { useState } from "react";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { Search, CheckCircle2, Edit3, XCircle, Flag } from "lucide-react";

interface PatientLabResultsTabProps {
  observations: any[];
  onVerify?: (id: string) => void;
}

export function PatientLabResultsTab({ observations: initialObs }: PatientLabResultsTabProps) {
  const [observations, setObservations] = useState(initialObs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = observations.filter((obs) => {
    const matchesSearch = obs.testName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === "OUT_OF_RANGE") return obs.status === "LOW" || obs.status === "HIGH";
    if (statusFilter === "PENDING") return obs.verificationStatus === "PENDING_REVIEW";
    if (statusFilter === "VERIFIED") return obs.verificationStatus === "VERIFIED";
    return true;
  });

  const handleQuickVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/observations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY" }),
      });
      if (res.ok) {
        const json = await res.json();
        setObservations((prev) =>
          prev.map((o) => (o.id === id ? json.observation : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search test names (e.g. Glucose, Hemoglobin)..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: "ALL", label: "All Tests" },
            { id: "OUT_OF_RANGE", label: "Outside Range" },
            { id: "PENDING", label: "Pending Review" },
            { id: "VERIFIED", label: "Verified" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === btn.id
                  ? "bg-[#0B192C] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Observations Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Test Name</th>
                <th className="py-3 px-4">Observed Value</th>
                <th className="py-3 px-4">Source Reference Range</th>
                <th className="py-3 px-4">Range Status</th>
                <th className="py-3 px-4">Provenance</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((obs) => (
                <tr key={obs.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{obs.testName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Page {obs.sourcePage || 1} • <ConfidenceBadge confidence={obs.confidence} />
                    </p>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                    {obs.value} <span className="text-xs font-normal text-slate-500">{obs.unit || ""}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {obs.referenceText || "Not provided in source"}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={obs.status} />
                  </td>
                  <td className="py-3 px-4">
                    <ProvenanceBadge type={obs.provenance} />
                  </td>
                  <td className="py-3 px-4">
                    <VerificationBadge status={obs.verificationStatus} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {obs.verificationStatus === "PENDING_REVIEW" ? (
                      <button
                        onClick={() => handleQuickVerify(obs.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verify</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
