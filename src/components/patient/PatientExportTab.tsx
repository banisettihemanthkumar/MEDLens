"use client";

import { Download, FileJson, FileSpreadsheet, Printer } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { RESPONSIBLE_AI_SUMMARY_DISCLAIMER } from "@/lib/summary";

interface PatientExportTabProps {
  patient: any;
  observations: any[];
  reports: any[];
}

export function PatientExportTab({ patient, observations, reports }: PatientExportTabProps) {
  const exportJson = () => {
    const data = {
      app: "MedLens Clinical Information Intelligence",
      disclaimer: RESPONSIBLE_AI_SUMMARY_DISCLAIMER,
      exportedAt: new Date().toISOString(),
      patient: {
        patientId: patient.patientId,
        age: patient.age,
        sex: patient.sex,
        symptoms: patient.symptoms,
        conditions: patient.conditions,
        allergies: patient.allergies,
        medications: patient.medications,
      },
      reports: reports.map((r) => ({
        id: r.id,
        title: r.title,
        fileName: r.fileName,
        reportDate: r.reportDate,
      })),
      observations: observations.map((o) => ({
        testName: o.testName,
        value: o.value,
        unit: o.unit,
        referenceText: o.referenceText,
        status: o.status,
        confidence: o.confidence,
        verificationStatus: o.verificationStatus,
        provenance: o.provenance,
        sourceExcerpt: o.sourceExcerpt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MedLens_${patient.patientId}_StructuredRecord.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = [
      "PatientID",
      "TestName",
      "ObservedValue",
      "Unit",
      "SourceReferenceRange",
      "CalculatedStatus",
      "Confidence",
      "VerificationStatus",
      "Provenance",
      "SourceExcerpt",
    ];

    const rows = observations.map((o) => [
      patient.patientId,
      `"${o.testName.replace(/"/g, '""')}"`,
      `"${o.value}"`,
      `"${o.unit || ""}"`,
      `"${(o.referenceText || "").replace(/"/g, '""')}"`,
      `"${o.status}"`,
      `"${(o.confidence * 100).toFixed(0)}%"`,
      `"${o.verificationStatus}"`,
      `"${o.provenance}"`,
      `"${(o.sourceExcerpt || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MedLens_${patient.patientId}_LabObservations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Export Structured Clinical Record</h2>
        <p className="text-xs text-slate-500 mt-1">
          Export verified observations, reference ranges, and complete provenance linkages
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportJson}
            className="flex flex-col items-start p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-300 transition-all text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-200 text-sky-600 group-hover:scale-105 transition-transform">
              <FileJson className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-slate-900">Structured JSON Export</h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Complete machine-readable schema with audit trails, raw excerpts, and provenance.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700">
              <Download className="h-3 w-3" /> Download .json
            </span>
          </button>

          <button
            onClick={exportCsv}
            className="flex flex-col items-start p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-200 text-emerald-600 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-slate-900">Spreadsheet CSV Export</h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Tabular lab values, units, reference intervals, and review statuses for Excel/Sheets.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <Download className="h-3 w-3" /> Download .csv
            </span>
          </button>

          <button
            onClick={handlePrint}
            className="flex flex-col items-start p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-200 text-indigo-600 group-hover:scale-105 transition-transform">
              <Printer className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-slate-900">Printable Clinical Summary</h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Clean, formatted printer view with legal non-diagnostic disclaimers and audit stamps.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700">
              <Printer className="h-3 w-3" /> Print Document
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
