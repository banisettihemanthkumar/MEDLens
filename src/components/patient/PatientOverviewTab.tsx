import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { Sparkles, ShieldAlert, FileText, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { generatePatientFriendlySummary } from "@/lib/summary";

interface PatientOverviewTabProps {
  patient: {
    id: string;
    patientId: string;
    name?: string | null;
    symptoms?: string | null;
    conditions?: string | null;
    allergies?: string | null;
    medications?: string | null;
    otherInfo?: string | null;
  };
  observations: any[];
  reports: any[];
}

export function PatientOverviewTab({ patient, observations, reports }: PatientOverviewTabProps) {
  const summary = generatePatientFriendlySummary(
    observations.map((o) => ({
      testName: o.testName,
      value: o.value,
      unit: o.unit,
      status: o.status,
      referenceText: o.referenceText,
    })),
    reports[0]?.title || "Aggregated Clinical Reports"
  );

  return (
    <div className="space-y-6">
      {/* Non-Diagnostic AI Medical Summary Card */}
      <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/20 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Patient-Friendly Clinical Summary
              </h2>
              <p className="text-[11px] text-slate-500">
                Algorithmic synthesis of source-verified report data
              </p>
            </div>
          </div>
          <ProvenanceBadge type="AI_GENERATED" />
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Observations</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{summary.stats.totalObservations}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Within Source Range</span>
            <p className="text-xl font-bold text-emerald-800 mt-0.5">{summary.stats.normalCount}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-700">Outside Source Range</span>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{summary.stats.outOfRangeCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-600">Not Assessed (No Range)</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{summary.stats.notAssessedCount}</p>
          </div>
        </div>

        {/* Structured Text Breakdown */}
        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-sky-100">
          <div>
            <strong className="text-slate-900 block font-semibold">Report Overview:</strong>
            <p className="mt-0.5 text-slate-600">{summary.overviewText}</p>
          </div>
          <div>
            <strong className="text-emerald-900 block font-semibold">Within Source-Provided Ranges:</strong>
            <p className="mt-0.5 text-slate-600">{summary.inRangeText}</p>
          </div>
          <div>
            <strong className="text-amber-900 block font-semibold">Outside Source-Provided Ranges:</strong>
            <p className="mt-0.5 text-slate-600">{summary.outOfRangeText}</p>
          </div>
          <div>
            <strong className="text-slate-800 block font-semibold">Not Assessed:</strong>
            <p className="mt-0.5 text-slate-600">{summary.notAssessedText}</p>
          </div>
        </div>

        {/* Strict Medical Disclaimer Box */}
        <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-[11px] text-slate-600 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
          <p>
            <strong>Important:</strong> {summary.disclaimer}
          </p>
        </div>
      </div>

      {/* User-Provided Information Intake Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Patient Intake Information
            </h3>
            <p className="text-[11px] text-slate-500">
              Reported directly during clinical registration; not independently validated by lab report.
            </p>
          </div>
          <ProvenanceBadge type="USER_PROVIDED" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Symptoms / Reason for Visit
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {patient.symptoms || "None reported"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Existing Conditions
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {patient.conditions || "None reported"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Documented Allergies
            </span>
            <p className="text-xs text-rose-800 font-semibold">
              {patient.allergies || "No known allergies"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Medications
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {patient.medications || "None reported"}
            </p>
          </div>
        </div>

        {patient.otherInfo && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Additional Context
            </span>
            <p className="text-xs text-slate-700 mt-1">{patient.otherInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
