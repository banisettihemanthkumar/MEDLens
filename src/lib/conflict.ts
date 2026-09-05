import { prisma } from "./db";
import { createTimelineEvent } from "./audit";

export interface DetectedConflict {
  category: "ALLERGY" | "MEDICATION" | "AGE" | "TEST_VALUE" | "REFERENCE_RANGE" | "DEMOGRAPHIC";
  description: string;
  valueA: string;
  valueB: string;
  reportAId?: string;
  reportBId?: string;
}

/**
 * Scans patient records and reports to detect contradictions and inconsistencies.
 * Does not make automated clinical decisions; flags for human review.
 */
export async function detectPatientConflicts(patientId: string): Promise<DetectedConflict[]> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      reports: {
        include: { observations: true },
        orderBy: { createdAt: "desc" },
      },
      conflicts: true,
    },
  });

  if (!patient) return [];

  const detected: DetectedConflict[] = [];

  // 1. Check Allergy Inconsistencies between User Intake and Reports
  if (patient.allergies) {
    const intakeAllergies = patient.allergies.toLowerCase();
    for (const rep of patient.reports) {
      if (rep.rawText) {
        const text = rep.rawText.toLowerCase();
        if (text.includes("no known allergies") || text.includes("nkda") || text.includes("nka")) {
          if (!intakeAllergies.includes("none") && !intakeAllergies.includes("no known")) {
            detected.push({
              category: "ALLERGY",
              description: "Patient profile records allergies, but clinical report states 'No Known Allergies / NKDA'.",
              valueA: `Intake: "${patient.allergies}"`,
              valueB: `Report "${rep.title}": "No known allergies / NKDA noted"`,
              reportAId: undefined,
              reportBId: rep.id,
            });
          }
        }
      }
    }
  }

  // 2. Cross-check Observation Value shifts across multiple reports
  const observationsByTest: Record<string, Array<{ reportTitle: string; reportId: string; value: string; date: Date | null }>> = {};
  for (const report of patient.reports) {
    for (const obs of report.observations) {
      const normalizedName = obs.testName.trim().toLowerCase();
      if (!observationsByTest[normalizedName]) {
        observationsByTest[normalizedName] = [];
      }
      observationsByTest[normalizedName].push({
        reportTitle: report.title,
        reportId: report.id,
        value: obs.value,
        date: obs.reportDate || report.createdAt,
      });
    }
  }

  for (const [testName, list] of Object.entries(observationsByTest)) {
    if (list.length >= 2) {
      const latest = list[0];
      const previous = list[1];
      if (latest.value !== previous.value) {
        // Only log if significant difference in numerical or categorical observation
        detected.push({
          category: "TEST_VALUE",
          description: `Discrepancy observed for "${testName.toUpperCase()}" between consecutive reports.`,
          valueA: `${latest.reportTitle}: ${latest.value}`,
          valueB: `${previous.reportTitle}: ${previous.value}`,
          reportAId: latest.reportId,
          reportBId: previous.reportId,
        });
      }
    }
  }

  // Persist newly detected conflicts to database if not already logged
  for (const item of detected) {
    const exists = patient.conflicts.some(
      (c) => c.category === item.category && c.description === item.description
    );
    if (!exists) {
      await prisma.conflict.create({
        data: {
          patientId,
          reportAId: item.reportAId || null,
          reportBId: item.reportBId || null,
          category: item.category,
          description: item.description,
          valueA: item.valueA,
          valueB: item.valueB,
          status: "NEEDS_REVIEW",
        },
      });

      await createTimelineEvent({
        patientId,
        eventType: "CONFLICT_DETECTED",
        title: "Potential Data Inconsistency Flagged",
        description: item.description,
        metadata: { category: item.category, valueA: item.valueA, valueB: item.valueB },
        actor: "MedLens Consistency Engine",
      });
    }
  }

  return detected;
}
