"use client";

import { useState } from "react";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientOverviewTab } from "@/components/patient/PatientOverviewTab";
import { PatientReportsTab } from "@/components/patient/PatientReportsTab";
import { PatientLabResultsTab } from "@/components/patient/PatientLabResultsTab";
import { PatientConflictsTab } from "@/components/patient/PatientConflictsTab";
import { PatientTimelineTab } from "@/components/patient/PatientTimelineTab";
import { PatientAuditTab } from "@/components/patient/PatientAuditTab";
import { PatientExportTab } from "@/components/patient/PatientExportTab";

interface PatientProfileClientProps {
  patient: any;
  reports: any[];
  observations: any[];
  conflicts: any[];
  timelineEvents: any[];
  auditLogs: any[];
}

export function PatientProfileClient({
  patient,
  reports,
  observations,
  conflicts,
  timelineEvents,
  auditLogs,
}: PatientProfileClientProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <PatientHeader
        patient={patient}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reportCount={reports.length}
        conflictCount={conflicts.filter((c) => c.status === "NEEDS_REVIEW").length}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === "overview" && (
          <PatientOverviewTab patient={patient} observations={observations} reports={reports} />
        )}
        {activeTab === "reports" && (
          <PatientReportsTab patientId={patient.id} reports={reports} />
        )}
        {activeTab === "lab-results" && (
          <PatientLabResultsTab observations={observations} />
        )}
        {activeTab === "conflicts" && (
          <PatientConflictsTab patientId={patient.id} conflicts={conflicts} />
        )}
        {activeTab === "timeline" && (
          <PatientTimelineTab events={timelineEvents} />
        )}
        {activeTab === "audit" && (
          <PatientAuditTab auditLogs={auditLogs} />
        )}
        {activeTab === "export" && (
          <PatientExportTab patient={patient} observations={observations} reports={reports} />
        )}
      </main>
    </div>
  );
}
