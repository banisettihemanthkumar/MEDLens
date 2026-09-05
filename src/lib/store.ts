/**
 * In-Memory Data Store for MEDLens
 *
 * Replaces Prisma/PostgreSQL with a zero-config in-memory store.
 * Pre-seeded with rich demo data. No DATABASE_URL, no env vars needed.
 * Data resets on server restart (serverless function cold start).
 */

import { hashPassword } from "./auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string | null;
  age: number;
  sex: string;
  symptoms: string | null;
  conditions: string | null;
  allergies: string | null;
  medications: string | null;
  otherInfo: string | null;
  reviewStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileData: string | null;
  rawText: string | null;
  reportDate: Date | null;
  processingStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalObservation {
  id: string;
  reportId: string;
  testName: string;
  value: string;
  unit: string | null;
  referenceText: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  status: string;
  observationNote: string | null;
  reportDate: Date | null;
  sourcePage: number;
  sourceExcerpt: string | null;
  confidence: number;
  verificationStatus: string;
  originalValue: string | null;
  originalUnit: string | null;
  originalReferenceText: string | null;
  editedBy: string | null;
  editedAt: Date | null;
  provenance: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conflict {
  id: string;
  patientId: string;
  reportAId: string | null;
  reportBId: string | null;
  category: string;
  description: string;
  valueA: string | null;
  valueB: string | null;
  status: string;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  eventType: string;
  title: string;
  description: string;
  metadata: string | null;
  actor: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  patientId: string | null;
  action: string;
  objectType: string;
  objectId: string;
  previousValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

// ─── In-Memory Store ──────────────────────────────────────────────────────────

interface Store {
  seeded: boolean;
  users: User[];
  patients: Patient[];
  reports: MedicalReport[];
  observations: MedicalObservation[];
  conflicts: Conflict[];
  timelineEvents: TimelineEvent[];
  auditLogs: AuditLog[];
}

const globalForStore = globalThis as unknown as { __medlensStore: Store };

function createEmptyStore(): Store {
  return {
    seeded: false,
    users: [],
    patients: [],
    reports: [],
    observations: [],
    conflicts: [],
    timelineEvents: [],
    auditLogs: [],
  };
}

export function getStore(): Store {
  if (!globalForStore.__medlensStore) {
    globalForStore.__medlensStore = createEmptyStore();
  }
  return globalForStore.__medlensStore;
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

let _idCounter = 1000;
export function newId(): string {
  return `mem_${Date.now()}_${++_idCounter}`;
}

// ─── Seed Demo Data ───────────────────────────────────────────────────────────

export async function ensureSeeded(): Promise<void> {
  const store = getStore();
  if (store.seeded) return;
  store.seeded = true;

  const now = new Date();
  const passwordHash = await hashPassword("MedLensDemo2026!");

  // Demo user
  const userId = newId();
  store.users.push({
    id: userId,
    email: "demo@medlens.health",
    name: "Dr. Elena Rostova, MD",
    passwordHash,
    role: "CLINICIAN",
    createdAt: now,
    updatedAt: now,
  });

  // ── Patient 1: Sarah Jenkins ──────────────────────────────────────────────
  const sarahId = newId();
  store.patients.push({
    id: sarahId,
    patientId: "PT-10482",
    name: "Sarah Jenkins",
    age: 42,
    sex: "Female",
    symptoms: "Mild fatigue over past 3 weeks, intermittent lightheadedness after morning runs.",
    conditions: "Mild seasonal allergic rhinitis",
    allergies: "Penicillin (urticaria/rash), Sulfa-containing antibiotics",
    medications: "OTC Multivitamin once daily, Vitamin D3 1,000 IU supplement",
    otherInfo: "Non-smoker, vegetarian diet for 6 years.",
    reviewStatus: "PARTIALLY_VERIFIED",
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-28"),
  });

  // Sarah — Report 1: CBC
  const cbcId = newId();
  store.reports.push({
    id: cbcId,
    patientId: sarahId,
    title: "Complete Blood Count (CBC) with Differential",
    fileName: "Sarah_Jenkins_CBC_Report.pdf",
    fileSize: 142850,
    mimeType: "application/pdf",
    fileData: null,
    rawText: `METRO CLINICAL LABORATORIES\nPATIENT: Sarah Jenkins | ID: PT-10482\nHemoglobin: 11.4 g/dL  Reference Range: 12.0 - 16.0 g/dL  [LOW]\nHematocrit: 34.2 %  Reference Range: 36.0 - 48.0 %  [LOW]\nWBC Count: 6.4 x10^3/uL  Reference Range: 4.5 - 11.0  [NORMAL]\nPlatelets: 268 x10^3/uL  Reference Range: 150 - 450  [NORMAL]\nAllergies on requisition: No Known Drug Allergies (NKDA)`,
    reportDate: new Date("2026-08-14"),
    processingStatus: "COMPLETED",
    createdAt: new Date("2026-08-14"),
    updatedAt: new Date("2026-08-14"),
  });

  const cbcObs = [
    { testName: "Hemoglobin", val: "11.4", unit: "g/dL", ref: "12.0 - 16.0", low: 12.0, high: 16.0, status: "LOW", note: "Value (11.4) is below source lower limit (12.0).", excerpt: "Hemoglobin: 11.4 g/dL  Reference Range: 12.0 - 16.0 g/dL  [LOW]", conf: 0.98, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
    { testName: "Hematocrit", val: "34.2", unit: "%", ref: "36.0 - 48.0", low: 36.0, high: 48.0, status: "LOW", note: "Value (34.2) is below source lower limit (36.0).", excerpt: "Hematocrit: 34.2 %  Reference Range: 36.0 - 48.0 %  [LOW]", conf: 0.97, verStatus: "PENDING_REVIEW", prov: "SOURCE_EXTRACTED" },
    { testName: "White Blood Cells (WBC)", val: "6.4", unit: "x10^3/uL", ref: "4.5 - 11.0", low: 4.5, high: 11.0, status: "NORMAL", note: "Value falls within the printed source reference range.", excerpt: "WBC Count: 6.4 x10^3/uL  Reference Range: 4.5 - 11.0  [NORMAL]", conf: 0.99, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
    { testName: "Platelets", val: "268", unit: "x10^3/uL", ref: "150 - 450", low: 150, high: 450, status: "NORMAL", note: "Value falls within the printed source reference range.", excerpt: "Platelets: 268 x10^3/uL  Reference Range: 150 - 450  [NORMAL]", conf: 0.99, verStatus: "PENDING_REVIEW", prov: "SOURCE_EXTRACTED" },
  ];
  for (const o of cbcObs) {
    store.observations.push({ id: newId(), reportId: cbcId, testName: o.testName, value: o.val, unit: o.unit, referenceText: o.ref, referenceLow: o.low, referenceHigh: o.high, status: o.status, observationNote: o.note, reportDate: new Date("2026-08-14"), sourcePage: 1, sourceExcerpt: o.excerpt, confidence: o.conf, verificationStatus: o.verStatus, originalValue: o.val, originalUnit: o.unit, originalReferenceText: o.ref, editedBy: null, editedAt: null, provenance: o.prov, createdAt: new Date("2026-08-14"), updatedAt: new Date("2026-08-14") });
  }

  // Sarah — Report 2: CMP
  const cmpId = newId();
  store.reports.push({
    id: cmpId,
    patientId: sarahId,
    title: "Comprehensive Metabolic & 25-OH Vitamin D Panel",
    fileName: "Sarah_Jenkins_CMP_Vitamin.pdf",
    fileSize: 168200,
    mimeType: "application/pdf",
    fileData: null,
    rawText: `METRO CLINICAL LABORATORIES\nFasting Glucose: 104 mg/dL  Reference Range: 70 - 99 mg/dL  [HIGH]\nSerum Creatinine: 0.88 mg/dL  Reference Range: 0.60 - 1.20 mg/dL  [NORMAL]\nVitamin D (25-OH): 18.2 ng/mL  Reference Range: 30.0 - 100.0 ng/mL  [LOW]\nFerritin: 14 ng/mL  Reference Range: 15 - 150 ng/mL  [LOW]`,
    reportDate: new Date("2026-08-28"),
    processingStatus: "COMPLETED",
    createdAt: new Date("2026-08-28"),
    updatedAt: new Date("2026-08-28"),
  });

  const cmpObs = [
    { testName: "Fasting Glucose", val: "104", unit: "mg/dL", ref: "70 - 99", low: 70, high: 99, status: "HIGH", note: "Value (104) exceeds source upper limit (99).", excerpt: "Fasting Glucose: 104 mg/dL  Reference Range: 70 - 99 mg/dL  [HIGH]", conf: 0.98, verStatus: "PENDING_REVIEW", prov: "SOURCE_EXTRACTED" },
    { testName: "Serum Creatinine", val: "0.88", unit: "mg/dL", ref: "0.60 - 1.20", low: 0.6, high: 1.2, status: "NORMAL", note: "Value falls within the printed source reference range.", excerpt: "Serum Creatinine: 0.88 mg/dL  Reference Range: 0.60 - 1.20 mg/dL  [NORMAL]", conf: 0.99, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
    { testName: "Vitamin D (25-OH)", val: "18.2", unit: "ng/mL", ref: "30.0 - 100.0", low: 30.0, high: 100.0, status: "LOW", note: "Value (18.2) is below source lower limit (30.0).", excerpt: "Vitamin D (25-OH): 18.2 ng/mL  Reference Range: 30.0 - 100.0 ng/mL  [LOW]", conf: 0.98, verStatus: "PENDING_REVIEW", prov: "SOURCE_EXTRACTED" },
    { testName: "Ferritin", val: "14", unit: "ng/mL", ref: "15 - 150", low: 15, high: 150, status: "LOW", note: "Value (14) is below source lower limit (15).", excerpt: "Ferritin: 14 ng/mL  Reference Range: 15 - 150 ng/mL  [LOW]", conf: 0.95, verStatus: "PENDING_REVIEW", prov: "SOURCE_EXTRACTED" },
  ];
  for (const o of cmpObs) {
    store.observations.push({ id: newId(), reportId: cmpId, testName: o.testName, value: o.val, unit: o.unit, referenceText: o.ref, referenceLow: o.low, referenceHigh: o.high, status: o.status, observationNote: o.note, reportDate: new Date("2026-08-28"), sourcePage: 1, sourceExcerpt: o.excerpt, confidence: o.conf, verificationStatus: o.verStatus, originalValue: o.val, originalUnit: o.unit, originalReferenceText: o.ref, editedBy: null, editedAt: null, provenance: o.prov, createdAt: new Date("2026-08-28"), updatedAt: new Date("2026-08-28") });
  }

  // Sarah — Conflict
  store.conflicts.push({ id: newId(), patientId: sarahId, reportAId: cbcId, reportBId: null, category: "ALLERGY", description: "Patient intake lists documented allergy to 'Penicillin (urticaria/rash)', whereas laboratory requisition header notes 'NKDA'.", valueA: "Intake: Penicillin (urticaria/rash), Sulfa-containing antibiotics", valueB: "Lab Requisition: NKDA (No Known Drug Allergies)", status: "NEEDS_REVIEW", resolvedBy: null, resolvedAt: null, createdAt: new Date("2026-08-14") });

  // Sarah — Timeline
  store.timelineEvents.push(...[
    { id: newId(), patientId: sarahId, eventType: "PATIENT_CREATED", title: "Patient Record Created", description: "New patient profile registered with user-provided demographic and intake details.", metadata: null, actor: "User Intake Form", createdAt: new Date("2026-08-01") },
    { id: newId(), patientId: sarahId, eventType: "REPORT_PROCESSED", title: "Complete Blood Count Processed", description: "4 structured laboratory observations extracted with source provenance.", metadata: null, actor: "MedLens Extraction Pipeline", createdAt: new Date("2026-08-14") },
    { id: newId(), patientId: sarahId, eventType: "HUMAN_VERIFICATION", title: "Clinician Verified Hemoglobin & WBC", description: "Hemoglobin 11.4 g/dL verified by Dr. Elena Rostova against source excerpt.", metadata: null, actor: "Dr. Elena Rostova, MD", createdAt: new Date("2026-08-15") },
    { id: newId(), patientId: sarahId, eventType: "REPORT_PROCESSED", title: "Metabolic Panel Processed", description: "4 observations extracted. Vitamin D deficiency and borderline glucose flagged.", metadata: null, actor: "MedLens Extraction Pipeline", createdAt: new Date("2026-08-28") },
  ]);

  // Sarah — Audit log
  store.auditLogs.push({ id: newId(), userId, patientId: sarahId, action: "VERIFY_OBSERVATION", objectType: "MedicalObservation", objectId: "Hemoglobin", previousValue: "PENDING_REVIEW", newValue: "VERIFIED", ipAddress: null, userAgent: null, createdAt: new Date("2026-08-15") });

  // ── Patient 2: Robert Chen ─────────────────────────────────────────────────
  const robertId = newId();
  store.patients.push({
    id: robertId,
    patientId: "PT-20815",
    name: "Robert Chen",
    age: 58,
    sex: "Male",
    symptoms: "Asymptomatic. Scheduled for routine annual executive health assessment.",
    conditions: "Essential hypertension (diagnosed 2021)",
    allergies: "No known drug allergies (NKDA)",
    medications: "Lisinopril 10 mg orally once daily",
    otherInfo: "Active runner, moderate aerobic exercise 3x/week.",
    reviewStatus: "VERIFIED",
    createdAt: new Date("2026-08-10"),
    updatedAt: new Date("2026-08-30"),
  });

  const lipidId = newId();
  store.reports.push({
    id: lipidId,
    patientId: robertId,
    title: "Lipid Profile & Atherogenic Risk Markers",
    fileName: "Robert_Chen_Lipid_Panel.pdf",
    fileSize: 139500,
    mimeType: "application/pdf",
    fileData: null,
    rawText: `CARDIOVASCULAR DIAGNOSTIC INSTITUTE\nTotal Cholesterol: 228 mg/dL  Reference Range: < 200 mg/dL  [HIGH]\nLDL Cholesterol: 146 mg/dL  Reference Range: < 100 mg/dL  [HIGH]\nHDL Cholesterol: 48 mg/dL  Reference Range: > 40 mg/dL  [NORMAL]\nTriglycerides: 170 mg/dL  Reference Range: < 150 mg/dL  [HIGH]`,
    reportDate: new Date("2026-08-30"),
    processingStatus: "COMPLETED",
    createdAt: new Date("2026-08-30"),
    updatedAt: new Date("2026-08-30"),
  });

  const lipidObs = [
    { testName: "Total Cholesterol", val: "228", unit: "mg/dL", ref: "< 200", low: null as number | null, high: 200, status: "HIGH", note: "Value (228) exceeds source upper limit (200).", excerpt: "Total Cholesterol: 228 mg/dL  Reference Range: < 200 mg/dL  [HIGH]", conf: 0.99, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
    { testName: "LDL Cholesterol", val: "146", unit: "mg/dL", ref: "< 100", low: null as number | null, high: 100, status: "HIGH", note: "Value (146) exceeds source upper limit (100).", excerpt: "LDL Cholesterol: 146 mg/dL  Reference Range: < 100 mg/dL  [HIGH]", conf: 0.98, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
    { testName: "HDL Cholesterol", val: "48", unit: "mg/dL", ref: "> 40", low: 40, high: null as number | null, status: "NORMAL", note: "Value falls within the printed source reference range.", excerpt: "HDL Cholesterol: 48 mg/dL  Reference Range: > 40 mg/dL  [NORMAL]", conf: 0.98, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
    { testName: "Triglycerides", val: "170", unit: "mg/dL", ref: "< 150", low: null as number | null, high: 150, status: "HIGH", note: "Value (170) exceeds source upper limit (150).", excerpt: "Triglycerides: 170 mg/dL  Reference Range: < 150 mg/dL  [HIGH]", conf: 0.97, verStatus: "VERIFIED", prov: "HUMAN_VERIFIED" },
  ];
  for (const o of lipidObs) {
    store.observations.push({ id: newId(), reportId: lipidId, testName: o.testName, value: o.val, unit: o.unit, referenceText: o.ref, referenceLow: o.low, referenceHigh: o.high, status: o.status, observationNote: o.note, reportDate: new Date("2026-08-30"), sourcePage: 1, sourceExcerpt: o.excerpt, confidence: o.conf, verificationStatus: o.verStatus, originalValue: o.val, originalUnit: o.unit, originalReferenceText: o.ref, editedBy: null, editedAt: null, provenance: o.prov, createdAt: new Date("2026-08-30"), updatedAt: new Date("2026-08-30") });
  }

  store.timelineEvents.push(...[
    { id: newId(), patientId: robertId, eventType: "PATIENT_CREATED", title: "Executive Profile Registered", description: "Patient profile created with user-provided details.", metadata: null, actor: "Clinical Coordinator", createdAt: new Date("2026-08-10") },
    { id: newId(), patientId: robertId, eventType: "HUMAN_VERIFICATION", title: "Lipid Profile Verified", description: "All 4 critical cardiovascular risk markers reviewed and approved.", metadata: null, actor: "Dr. Elena Rostova, MD", createdAt: new Date("2026-08-30") },
  ]);

  store.auditLogs.push({ id: newId(), userId, patientId: robertId, action: "VERIFY_OBSERVATION", objectType: "MedicalObservation", objectId: "Total Cholesterol", previousValue: "PENDING_REVIEW", newValue: "VERIFIED", ipAddress: null, userAgent: null, createdAt: new Date("2026-08-30") });
}

// ─── Query Helpers (mimic Prisma API shape) ───────────────────────────────────

export function getPatientWithRelations(id: string) {
  const store = getStore();
  const patient = store.patients.find((p) => p.id === id || p.patientId === id);
  if (!patient) return null;
  return enrichPatient(patient, store);
}

export function getAllPatients() {
  const store = getStore();
  return store.patients
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((p) => enrichPatient(p, store));
}

function enrichPatient(patient: Patient, store: Store) {
  const reports = store.reports
    .filter((r) => r.patientId === patient.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((r) => ({
      ...r,
      observations: store.observations.filter((o) => o.reportId === r.id),
    }));

  return {
    ...patient,
    reports,
    conflicts: store.conflicts
      .filter((c) => c.patientId === patient.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    timelineEvents: store.timelineEvents
      .filter((e) => e.patientId === patient.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    auditLogs: store.auditLogs
      .filter((l) => l.patientId === patient.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((l) => ({ ...l, patient })),
  };
}

export function getDashboardStats() {
  const store = getStore();
  const patients = store.patients;
  const reports = store.reports;
  const observations = store.observations;
  const conflicts = store.conflicts;
  const auditLogs = store.auditLogs;

  const recentPatients = patients
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8)
    .map((p) => ({
      ...p,
      reports: store.reports
        .filter((r) => r.patientId === p.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 1),
    }));

  const recentReports = reports
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map((r) => ({
      ...r,
      patient: patients.find((p) => p.id === r.patientId)!,
      observations: observations.filter((o) => o.reportId === r.id),
    }));

  const activeConflicts = conflicts
    .filter((c) => c.status === "NEEDS_REVIEW")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4)
    .map((c) => ({ ...c, patient: patients.find((p) => p.id === c.patientId)! }));

  const recentAuditLogs = auditLogs
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6)
    .map((l) => ({ ...l, patient: patients.find((p) => p.id === l.patientId) ?? null }));

  return {
    totalPatients: patients.length,
    reportsProcessed: reports.length,
    pendingObservations: observations.filter((o) => o.verificationStatus === "PENDING_REVIEW").length,
    verifiedObservations: observations.filter((o) => o.verificationStatus === "VERIFIED").length,
    recentPatients,
    recentReports,
    activeConflicts,
    recentAuditLogs,
  };
}
