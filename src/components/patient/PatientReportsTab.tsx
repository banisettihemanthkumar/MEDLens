import Link from "next/link";
import { FileText, ArrowRight, Upload, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PatientReportsTabProps {
  patientId: string;
  reports: Array<{
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    reportDate: string | Date | null;
    processingStatus: string;
    observations: any[];
    createdAt: string | Date;
  }>;
}

export function PatientReportsTab({ patientId, reports }: PatientReportsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Uploaded Medical Documents</h2>
          <p className="text-xs text-slate-500">
            Source records parsed and ready for side-by-side verification
          </p>
        </div>
        <Link
          href={`/patients/${patientId}/upload`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B192C] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3E62] transition-colors"
        >
          <Upload className="h-3.5 w-3.5 text-sky-400" />
          <span>Upload New Report</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const verifiedCount = (report.observations || []).filter(
            (o) => o.verificationStatus === "VERIFIED"
          ).length;
          const totalObs = (report.observations || []).length;

          return (
            <div
              key={report.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{report.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {report.fileName} • {(report.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  {report.processingStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">REPORT DATE</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {formatDate(report.reportDate || report.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">VERIFICATION PROGRESS</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {verifiedCount} / {totalObs} Verified
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  {totalObs} extracted observation{totalObs === 1 ? "" : "s"}
                </span>

                <Link
                  href={`/reports/${report.id}/review`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                >
                  <span>Side-by-Side Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
