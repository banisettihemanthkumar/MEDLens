"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  Flag, 
  FileText, 
  Info, 
  ArrowLeft,
  Sparkles,
  Search,
  Check,
  History,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

export interface ObservationItem {
  id: string;
  reportId: string;
  testName: string;
  value: string;
  unit: string | null;
  referenceText: string | null;
  status: string;
  observationNote: string | null;
  sourcePage: number | null;
  sourceExcerpt: string | null;
  confidence: number;
  verificationStatus: string;
  originalValue: string | null;
  originalUnit: string | null;
  originalReferenceText: string | null;
  editedBy: string | null;
  editedAt: string | null;
  provenance: string;
}

interface SideBySideReviewProps {
  report: {
    id: string;
    patientId: string;
    title: string;
    fileName: string;
    fileSize: number;
    rawText: string | null;
    reportDate: string | null;
    createdAt: string;
  };
  patient: {
    id: string;
    patientId: string;
    name: string | null;
    age: number;
    sex: string;
  };
  initialObservations: ObservationItem[];
}

export function SideBySideReview({ report, patient, initialObservations }: SideBySideReviewProps) {
  const router = useRouter();
  const [observations, setObservations] = useState<ObservationItem[]>(initialObservations);
  const [activeObservationId, setActiveObservationId] = useState<string>(
    initialObservations[0]?.id || ""
  );
  const [editingObs, setEditingObs] = useState<ObservationItem | null>(null);
  const [editForm, setEditForm] = useState({
    testName: "",
    value: "",
    unit: "",
    referenceText: "",
    observationNote: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const activeObs = observations.find((o) => o.id === activeObservationId) || observations[0];

  const handleSelectObservation = (obs: ObservationItem) => {
    setActiveObservationId(obs.id);
  };

  const handleAction = async (obsId: string, action: "VERIFY" | "REJECT" | "FLAG") => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/observations/${obsId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const updated = await res.json();
        setObservations((prev) => prev.map((o) => (o.id === obsId ? updated.observation : o)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = (obs: ObservationItem) => {
    setEditingObs(obs);
    setEditForm({
      testName: obs.testName,
      value: obs.value,
      unit: obs.unit || "",
      referenceText: obs.referenceText || "",
      observationNote: obs.observationNote || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObs) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/observations/${editingObs.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "EDIT",
          ...editForm,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setObservations((prev) =>
          prev.map((o) => (o.id === editingObs.id ? updated.observation : o))
        );
        setEditingObs(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter observations
  const filteredObservations = observations.filter((obs) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "PENDING") return obs.verificationStatus === "PENDING_REVIEW";
    if (filterStatus === "VERIFIED") return obs.verificationStatus === "VERIFIED";
    if (filterStatus === "OUT_OF_RANGE") return obs.status === "LOW" || obs.status === "HIGH";
    return true;
  });

  const verifiedCount = observations.filter((o) => o.verificationStatus === "VERIFIED").length;
  const pendingCount = observations.filter((o) => o.verificationStatus === "PENDING_REVIEW").length;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] overflow-hidden">
      {/* Top Review Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/patients/${patient.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Patient Profile</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <h1 className="text-sm font-bold text-[#0B192C] flex items-center gap-2">
              <span>{report.title}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {patient.name || patient.patientId} • Age {patient.age} ({patient.sex})
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress metric */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-700">{verifiedCount} Verified</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-amber-600">{pendingCount} Pending Review</span>
          </div>

          <Link
            href={`/patients/${patient.id}#tab-overview`}
            className="rounded-xl bg-[#0B192C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1E3E62] transition-colors"
          >
            Complete Review
          </Link>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
        {/* LEFT COLUMN: Original Medical Report & Source Document Excerpt Viewer */}
        <div className="lg:col-span-6 border-r border-slate-200 bg-slate-50/80 flex flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-100/70 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-700" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Original Medical Source Document
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {report.fileName} • Page {activeObs?.sourcePage || 1}
            </span>
          </div>

          {/* Active Highlight Banner */}
          {activeObs && (
            <div className="border-b border-amber-200 bg-amber-50/90 px-4 py-2 text-xs text-amber-950 flex items-start gap-2.5 shrink-0">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-[11px] text-amber-900">
                  Tracing: {activeObs.testName}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-amber-950 bg-white/70 p-1.5 rounded border border-amber-200/70">
                  "{activeObs.sourceExcerpt || "Source excerpt registered"}"
                </p>
              </div>
            </div>
          )}

          {/* Document Content View */}
          <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-slate-800 space-y-1.5 leading-relaxed bg-white">
            {report.rawText ? (
              report.rawText.split("\n").map((line, idx) => {
                const isActiveLine =
                  activeObs?.sourceExcerpt &&
                  line.trim().length > 5 &&
                  (line.toLowerCase().includes(activeObs.testName.toLowerCase()) ||
                    activeObs.sourceExcerpt.toLowerCase().includes(line.trim().toLowerCase()));

                return (
                  <div
                    key={idx}
                    className={`py-0.5 px-2 rounded transition-colors ${
                      isActiveLine
                        ? "bg-amber-200/90 text-amber-950 font-bold border-l-4 border-amber-500 shadow-sm"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="inline-block w-8 text-slate-300 select-none text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400">
                Original report text stream is loading or empty.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Structured Observations & Verification Controls */}
        <div className="lg:col-span-6 bg-white flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Structured Extracted Records ({observations.length})
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: "ALL", label: "All" },
                { id: "PENDING", label: "Pending" },
                { id: "VERIFIED", label: "Verified" },
                { id: "OUT_OF_RANGE", label: "Out of Range" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    filterStatus === tab.id
                      ? "bg-[#0B192C] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredObservations.map((obs) => {
              const isSelected = obs.id === activeObservationId;

              return (
                <div
                  key={obs.id}
                  onClick={() => handleSelectObservation(obs)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/30 shadow-md ring-1 ring-sky-400"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{obs.testName}</h4>
                        <ProvenanceBadge type={obs.provenance} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Source Page: {obs.sourcePage || 1} •{" "}
                        <ConfidenceBadge confidence={obs.confidence} />
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <VerificationBadge status={obs.verificationStatus} />
                      <StatusBadge status={obs.status} />
                    </div>
                  </div>

                  {/* Core Value & Reference Details */}
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">REPORTED VALUE</span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {obs.value} {obs.unit || ""}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">SOURCE REFERENCE</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {obs.referenceText || "Not provided in source"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">ORIGINAL VALUE</span>
                      <p className="text-slate-600 mt-0.5">
                        {obs.originalValue || obs.value} {obs.originalUnit || obs.unit || ""}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">REVIEW TRAIL</span>
                      <p className="text-slate-600 mt-0.5 truncate">
                        {obs.editedBy ? `${obs.editedBy}` : "Unmodified"}
                      </p>
                    </div>
                  </div>

                  {/* Source Excerpt Quote */}
                  <div className="mt-2.5 rounded-lg border border-slate-200/60 bg-white px-3 py-1.5 text-[11px] text-slate-600 font-mono">
                    <span className="text-slate-400 select-none">Source quote: </span>"
                    {obs.sourceExcerpt}"
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(obs);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(obs.id, "FLAG");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      <Flag className="h-3.5 w-3.5 text-amber-600" />
                      <span>Flag</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(obs.id, "REJECT");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5 text-rose-600" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(obs.id, "VERIFY");
                      }}
                      disabled={isUpdating || obs.verificationStatus === "VERIFIED"}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{obs.verificationStatus === "VERIFIED" ? "Verified" : "Verify"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Observation Modal */}
      {editingObs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Human Verification & Field Edit
                </h3>
                <p className="text-xs text-slate-500">
                  Original extracted data is preserved in the permanent audit trail.
                </p>
              </div>
              <button
                onClick={() => setEditingObs(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Test Name</label>
                <input
                  type="text"
                  value={editForm.testName}
                  onChange={(e) => setEditForm({ ...editForm, testName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Value (Observed)
                  </label>
                  <input
                    type="text"
                    value={editForm.value}
                    onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Unit</label>
                  <input
                    type="text"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                    placeholder="e.g. g/dL, mg/dL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Source Reference Range
                </label>
                <input
                  type="text"
                  value={editForm.referenceText}
                  onChange={(e) => setEditForm({ ...editForm, referenceText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. 12.0 - 16.0 or Not provided in source"
                />
                <p className="mt-1 text-[10px] text-amber-600 font-medium">
                  Rule: Do not invent reference ranges not printed in the source.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Review Note</label>
                <textarea
                  value={editForm.observationNote}
                  onChange={(e) => setEditForm({ ...editForm, observationNote: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  placeholder="Reason for change or clinical note..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingObs(null)}
                  className="rounded-xl border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-[#0B192C] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3E62] disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save & Verify Value"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
