import { getStore, newId } from "./store";
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
  const store = getStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) return [];

  const reports = store.reports
    .filter((r) => r.patientId === patientId)
    .map((r) => ({ ...r, observations: store.observations.filter((o) => o.reportId === r.id) }));

  const existingConflicts = store.conflicts.filter((c) => c.patientId === patientId);
  const detected: DetectedConflict[] = [];

  // 1. Check Allergy Inconsistencies
  if (patient.allergies) {
    const intakeAllergies = patient.allergies.toLowerCase();
    for (const rep of reports) {
      if (rep.rawText) {
        const text = rep.rawText.toLowerCase();
        if (text.includes("no known allergies") || text.includes("nkda") || text.includes("nka")) {
          if (!intakeAllergies.includes("none") && !intakeAllergies.includes("no known")) {
            detected.push({
              category: "ALLERGY",
              description: "Patient profile records allergies, but clinical report states 'No Known Allergies / NKDA'.",
              valueA: `Intake: "${patient.allergies}"`,
              valueB: `Report "${rep.title}": "No known allergies / NKDA noted"`,
              reportBId: rep.id,
            });
          }
        }
      }
    }
  }

  // 2. Cross-check Observation Value shifts across multiple reports
  const observationsByTest: Record<string, Array<{ reportTitle: string; reportId: string; value: string }>> = {};
  for (const report of reports) {
    for (const obs of report.observations) {
      const name = obs.testName.trim().toLowerCase();
      if (!observationsByTest[name]) observationsByTest[name] = [];
      observationsByTest[name].push({ reportTitle: report.title, reportId: report.id, value: obs.value });
    }
  }

  for (const [testName, list] of Object.entries(observationsByTest)) {
    if (list.length >= 2 && list[0].value !== list[1].value) {
      detected.push({
        category: "TEST_VALUE",
        description: `Discrepancy observed for "${testName.toUpperCase()}" between consecutive reports.`,
        valueA: `${list[0].reportTitle}: ${list[0].value}`,
        valueB: `${list[1].reportTitle}: ${list[1].value}`,
        reportAId: list[0].reportId,
        reportBId: list[1].reportId,
      });
    }
  }

  // Persist newly detected conflicts to in-memory store
  for (const item of detected) {
    const exists = existingConflicts.some(
      (c) => c.category === item.category && c.description === item.description
    );
    if (!exists) {
      store.conflicts.push({
        id: newId(),
        patientId,
        reportAId: item.reportAId || null,
        reportBId: item.reportBId || null,
        category: item.category,
        description: item.description,
        valueA: item.valueA,
        valueB: item.valueB,
        status: "NEEDS_REVIEW",
        resolvedBy: null,
        resolvedAt: null,
        createdAt: new Date(),
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
