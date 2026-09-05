import Link from "next/link";
import { prisma } from "@/lib/db";
import { seedDemoData } from "@/lib/demo";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/ui/StatCard";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  AlertTriangle,
  Upload,
  Activity,
  GitCompare,
  FileCheck
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Check if patients exist; if not, automatically seed demo data!
  const patientCount = await prisma.patient.count();
  if (patientCount === 0) {
    await seedDemoData();
  }

  // Fetch dashboard summary metrics
  const [
    totalPatients,
    reportsProcessed,
    pendingObservations,
    verifiedObservations,
    recentPatients,
    recentReports,
    activeConflicts,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.medicalReport.count(),
    prisma.medicalObservation.count({ where: { verificationStatus: "PENDING_REVIEW" } }),
    prisma.medicalObservation.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.patient.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: {
        reports: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.medicalReport.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        observations: true,
      },
    }),
    prisma.conflict.findMany({
      where: { status: "NEEDS_REVIEW" },
      take: 4,
      include: { patient: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { patient: true },
    }),
  ]);

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Welcome & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Clinical Information Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Traceable records, source document provenance, and human-in-the-loop review
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/patients/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B192C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3E62] transition-colors"
            >
              <UserPlus className="h-4 w-4 text-sky-400" />
              <span>+ Add Patient</span>
            </Link>
          </div>
        </div>

        {/* 4 STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Patients"
            value={totalPatients}
            subtitle="Registered clinical profiles"
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Reports Processed"
            value={reportsProcessed}
            subtitle="Laboratory & clinical documents"
            icon={FileText}
            variant="info"
          />
          <StatCard
            title="Pending Reviews"
            value={pendingObservations}
            subtitle="Awaiting clinician verification"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Verified Records"
            value={verifiedObservations}
            subtitle="Anchored with source provenance"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* ALERTS: Active Cross-Report Inconsistencies */}
        {activeConflicts.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    {activeConflicts.length} Cross-Report Inconsistenc{activeConflicts.length === 1 ? "y" : "ies"} Flagged
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Discrepancies detected between patient intake disclosures and laboratory report headers. Human verification required.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeConflicts.map((c) => (
                <div key={c.id} className="rounded-xl bg-white p-3 border border-amber-200 shadow-2xs flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">{c.category}</span>
                    <p className="text-xs font-semibold text-slate-800 truncate">{c.description}</p>
                    <p className="text-[11px] text-slate-400">Patient: {c.patient.name || c.patient.patientId}</p>
                  </div>
                  <Link
                    href={`/patients/${c.patient.id}#tab-conflicts`}
                    className="shrink-0 rounded-lg bg-amber-100 text-amber-900 px-2.5 py-1 text-xs font-semibold hover:bg-amber-200 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENT PATIENTS TABLE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Patients</h2>
              <p className="text-xs text-slate-500">
                Patient profiles, intake status, and recent documentation runs
              </p>
            </div>

            <Link
              href="/patients/new"
              className="text-xs font-semibold text-sky-700 hover:text-sky-900"
            >
              + Add Patient
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Age / Sex</th>
                  <th className="py-3 px-4">Last Report</th>
                  <th className="py-3 px-4">Review Status</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPatients.map((patient) => {
                  const lastReport = patient.reports[0];
                  return (
                    <tr
                      key={patient.id}
                      id={`patient-${patient.patientId}`}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-sky-900">
                        <Link href={`/patients/${patient.id}`} className="hover:underline">
                          {patient.patientId}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {patient.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {patient.age} y / {patient.sex}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {lastReport ? (
                          <span className="truncate max-w-xs block font-medium">
                            {lastReport.title}
                          </span>
                        ) : (
                          <span className="text-slate-400">No reports uploaded</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <VerificationBadge status={patient.reviewStatus} />
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {formatDate(patient.updatedAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span>Open Dossier</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-COLUMN SECTION: Recent Reports & Audit Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Recent Reports with Review Actions */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Medical Reports</h3>
                <p className="text-xs text-slate-500">
                  Uploaded documents processed through the extraction pipeline
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-slate-200/80 p-3.5 hover:border-slate-300 bg-slate-50/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{report.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        Patient: {report.patient.name || report.patient.patientId} • {report.observations.length} observations
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/reports/${report.id}/review`}
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#0B192C] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#1E3E62] transition-colors"
                  >
                    <span>Review</span>
                    <ArrowRight className="h-3 w-3 text-sky-400" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Activity & Audit Stream */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Activity & Audit Trail</h3>
                <p className="text-xs text-slate-500">Recent verification and system actions</p>
              </div>
            </div>

            <div className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="text-xs border-l-2 border-sky-500 pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Target: {log.objectType} {log.patient?.name ? `(${log.patient.name})` : ""}
                  </p>
                  {log.newValue && (
                    <p className="text-[10px] text-emerald-700 font-mono">
                      New: {log.newValue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
