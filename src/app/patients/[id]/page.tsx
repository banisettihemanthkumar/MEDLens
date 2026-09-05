import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PatientProfileClient } from "./PatientProfileClient";

export const dynamic = "force-dynamic";

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;

  let patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      reports: {
        include: { observations: true },
        orderBy: { createdAt: "desc" },
      },
      conflicts: {
        orderBy: { createdAt: "desc" },
      },
      timelineEvents: {
        orderBy: { createdAt: "desc" },
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!patient) {
    patient = await prisma.patient.findUnique({
      where: { patientId: id },
      include: {
        reports: {
          include: { observations: true },
          orderBy: { createdAt: "desc" },
        },
        conflicts: {
          orderBy: { createdAt: "desc" },
        },
        timelineEvents: {
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  if (!patient) {
    notFound();
  }

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
