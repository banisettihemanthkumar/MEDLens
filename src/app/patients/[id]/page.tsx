import { notFound } from "next/navigation";
import { ensureSeeded, getPatientWithRelations } from "@/lib/store";
import { PatientProfileClient } from "./PatientProfileClient";

export const dynamic = "force-dynamic";

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  await ensureSeeded();

  const patient = getPatientWithRelations(id);
  if (!patient) notFound();

  const allObservations = patient.reports.flatMap((r) => r.observations);

  return (
    <PatientProfileClient
      patient={patient}
      reports={patient.reports}
      observations={allObservations}
      conflicts={patient.conflicts}
      timelineEvents={patient.timelineEvents}
      auditLogs={patient.auditLogs}
    />
  );
}
