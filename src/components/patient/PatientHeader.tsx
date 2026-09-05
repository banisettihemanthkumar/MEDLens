import Link from "next/link";
import { User, FileUp, GitCompare, Download, Calendar, Activity } from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";

interface PatientHeaderProps {
  patient: {
    id: string;
    patientId: string;
    name?: string | null;
    age: number;
    sex: string;
    reviewStatus: string;
    updatedAt: string | Date;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reportCount: number;
  conflictCount: number;
}

export function PatientHeader({
  patient,
  activeTab,
  setActiveTab,
  reportCount,
  conflictCount,
}: PatientHeaderProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reports", label: `Reports (${reportCount})` },
    { id: "lab-results", label: "Lab Results" },
    { id: "conflicts", label: `Conflicts ${conflictCount > 0 ? `(${conflictCount})` : ""}` },
    { id: "timeline", label: "Timeline & History" },
    { id: "audit", label: "Audit Log" },
    { id: "export", label: "Export Record" },
  ];

  return (
    <div className="border-b border-slate-200 bg-white pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white shadow-md">
              <User className="h-7 w-7 text-sky-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900">
                  {patient.name || patient.patientId}
                </h1>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {patient.patientId}
                </span>
                <VerificationBadge status={patient.reviewStatus} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{patient.age} years old</span>
                <span>•</span>
                <span>{patient.sex}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ProvenanceBadge type="USER_PROVIDED" />
                  <span className="text-[11px] text-slate-400">(Demographics)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/patients/${patient.id}/compare`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <GitCompare className="h-3.5 w-3.5 text-slate-500" />
              <span>Compare Reports</span>
            </Link>
            <Link
              href={`/patients/${patient.id}/upload`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B192C] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1E3E62] shadow-sm transition-colors"
            >
              <FileUp className="h-3.5 w-3.5 text-sky-400" />
              <span>Upload Medical Report</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-6 border-b border-transparent overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-sky-600 text-sky-700"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
