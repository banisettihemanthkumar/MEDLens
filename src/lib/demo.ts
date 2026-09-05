import { prisma } from "./db";
import { hashPassword } from "./auth";

export async function seedDemoData() {
  try {
    // 1. Create default Clinician user
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@medlens.health" },
    });

    let demoUser = existingUser;
    if (!demoUser) {
      const passwordHash = await hashPassword("MedLensDemo2026!");
      demoUser = await prisma.user.create({
        data: {
          email: "demo@medlens.health",
          name: "Dr. Elena Rostova, MD",
          passwordHash,
          role: "CLINICIAN",
        },
      });
    }

    // 2. Patient 1: Sarah Jenkins
    let sarah = await prisma.patient.findUnique({
      where: { patientId: "PT-10482" },
    });

    if (!sarah) {
      sarah = await prisma.patient.create({
        data: {
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
        },
      });

      // Timeline event: Patient creation
      await prisma.timelineEvent.create({
        data: {
          patientId: sarah.id,
          eventType: "PATIENT_CREATED",
          title: "Patient Record Created",
          description: "New patient profile registered with user-provided demographic and intake details.",
          actor: "User Intake Form",
        },
      });

      // Report 1 for Sarah: CBC with Differential
      const cbcReport = await prisma.medicalReport.create({
        data: {
          patientId: sarah.id,
          title: "Complete Blood Count (CBC) with Differential",
          fileName: "Sarah_Jenkins_CBC_Report.pdf",
          fileSize: 142850,
          mimeType: "application/pdf",
          rawText: `METRO CLINICAL LABORATORIES
PATIENT: Sarah Jenkins | ID: PT-10482 | DOB: 1984-04-12 | SEX: F
SPECIMEN: Whole Blood EDTA | COLLECTED: 2026-08-14 08:30 AM
ORDERING PHYSICIAN: Dr. Michael Vance, MD

COMPLETE BLOOD COUNT (CBC) WITH AUTOMATED DIFFERENTIAL:
Hemoglobin: 11.4 g/dL          Reference Range: 12.0 - 16.0 g/dL   [LOW]
Hematocrit: 34.2 %             Reference Range: 36.0 - 48.0 %      [LOW]
WBC Count: 6.4 x10^3/uL        Reference Range: 4.5 - 11.0 x10^3/uL [NORMAL]
RBC Count: 3.92 x10^6/uL       Reference Range: 4.00 - 5.20 x10^6/uL [LOW]
Platelets: 268 x10^3/uL        Reference Range: 150 - 450 x10^3/uL  [NORMAL]
MCV: 82.1 fL                   Reference Range: 80.0 - 100.0 fL    [NORMAL]
MCH: 27.2 pg                   Reference Range: 27.0 - 33.0 pg     [NORMAL]
MCHC: 33.3 g/dL                Reference Range: 32.0 - 36.0 g/dL   [NORMAL]
RDW-CV: 14.8 %                 Reference Range: 11.5 - 15.0 %      [NORMAL]
Neutrophils: 58.2 %            Reference Range: 40.0 - 70.0 %      [NORMAL]
Lymphocytes: 31.4 %            Reference Range: 20.0 - 45.0 %      [NORMAL]
Monocytes: 7.1 %               Reference Range: 2.0 - 10.0 %       [NORMAL]

CLINICAL NOTES:
No cellular atypia seen.
Allergies on requisition note: No Known Drug Allergies (NKDA) reported by urgent intake staff.`,
          reportDate: new Date("2026-08-14"),
          processingStatus: "COMPLETED",
        },
      });

      // Observations for CBC
      const cbcObservations = [
        {
          testName: "Hemoglobin",
          val: "11.4",
          unit: "g/dL",
          ref: "12.0 - 16.0",
          low: 12.0,
          high: 16.0,
          status: "LOW",
          note: "Value (11.4) is below source lower limit (12.0).",
          excerpt: "Hemoglobin: 11.4 g/dL          Reference Range: 12.0 - 16.0 g/dL   [LOW]",
          conf: 0.98,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
        {
          testName: "Hematocrit",
          val: "34.2",
          unit: "%",
          ref: "36.0 - 48.0",
          low: 36.0,
          high: 48.0,
          status: "LOW",
          note: "Value (34.2) is below source lower limit (36.0).",
          excerpt: "Hematocrit: 34.2 %             Reference Range: 36.0 - 48.0 %      [LOW]",
          conf: 0.97,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
        {
          testName: "White Blood Cells (WBC)",
          val: "6.4",
          unit: "x10^3/uL",
          ref: "4.5 - 11.0",
          low: 4.5,
          high: 11.0,
          status: "NORMAL",
          note: "Value falls within the printed source reference range.",
          excerpt: "WBC Count: 6.4 x10^3/uL        Reference Range: 4.5 - 11.0 x10^3/uL [NORMAL]",
          conf: 0.99,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
        {
          testName: "Platelets",
          val: "268",
          unit: "x10^3/uL",
          ref: "150 - 450",
          low: 150,
          high: 450,
          status: "NORMAL",
          note: "Value falls within the printed source reference range.",
          excerpt: "Platelets: 268 x10^3/uL        Reference Range: 150 - 450 x10^3/uL  [NORMAL]",
          conf: 0.99,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
        {
          testName: "Red Blood Cells (RBC)",
          val: "3.92",
          unit: "x10^6/uL",
          ref: "4.00 - 5.20",
          low: 4.0,
          high: 5.2,
          status: "LOW",
          note: "Value (3.92) is below source lower limit (4.00).",
          excerpt: "RBC Count: 3.92 x10^6/uL       Reference Range: 4.00 - 5.20 x10^6/uL [LOW]",
          conf: 0.96,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
      ];

      for (const obs of cbcObservations) {
        await prisma.medicalObservation.create({
          data: {
            reportId: cbcReport.id,
            testName: obs.testName,
            value: obs.val,
            unit: obs.unit,
            referenceText: obs.ref,
            referenceLow: obs.low,
            referenceHigh: obs.high,
            status: obs.status,
            observationNote: obs.note,
            sourcePage: 1,
            sourceExcerpt: obs.excerpt,
            confidence: obs.conf,
            verificationStatus: obs.verStatus,
            originalValue: obs.val,
            originalUnit: obs.unit,
            originalReferenceText: obs.ref,
            provenance: obs.prov,
            reportDate: new Date("2026-08-14"),
          },
        });
      }

      // Report 2 for Sarah: Metabolic & Vitamin Panel
      const cmpReport = await prisma.medicalReport.create({
        data: {
          patientId: sarah.id,
          title: "Comprehensive Metabolic & 25-OH Vitamin D Panel",
          fileName: "Sarah_Jenkins_CMP_Vitamin.pdf",
          fileSize: 168200,
          mimeType: "application/pdf",
          rawText: `METRO CLINICAL LABORATORIES
PATIENT: Sarah Jenkins | ID: PT-10482 | DOB: 1984-04-12 | SEX: F
SPECIMEN: Serum Gel Separator | COLLECTED: 2026-08-28 09:15 AM
ORDERING PHYSICIAN: Dr. Michael Vance, MD

METABOLIC & MICRONUTRIENT PROFILE:
Fasting Glucose: 104 mg/dL            Reference Range: 70 - 99 mg/dL        [HIGH]
Serum Creatinine: 0.88 mg/dL          Reference Range: 0.60 - 1.20 mg/dL    [NORMAL]
Blood Urea Nitrogen (BUN): 14 mg/dL   Reference Range: 7 - 20 mg/dL         [NORMAL]
Estimated GFR: > 60 mL/min/1.73m2     Reference Range: > 60 mL/min/1.73m2   [NORMAL]
Sodium: 139 mmol/L                    Reference Range: 135 - 145 mmol/L     [NORMAL]
Potassium: 4.2 mmol/L                 Reference Range: 3.5 - 5.0 mmol/L     [NORMAL]
Calcium: 9.3 mg/dL                    Reference Range: 8.5 - 10.2 mg/dL     [NORMAL]
Total Protein: 7.1 g/dL               Reference Range: 6.4 - 8.3 g/dL       [NORMAL]
Serum Albumin: 4.4 g/dL               Reference Range: 3.5 - 5.0 g/dL       [NORMAL]
Vitamin D (25-OH): 18.2 ng/mL         Reference Range: 30.0 - 100.0 ng/mL   [LOW]
Ferritin: 14 ng/mL                    Reference Range: 15 - 150 ng/mL       [LOW]
Serum Zinc: 88 mcg/dL                 Reference Range: Not provided in source [NOT ASSESSED]`,
          reportDate: new Date("2026-08-28"),
          processingStatus: "COMPLETED",
        },
      });

      const cmpObservations = [
        {
          testName: "Fasting Glucose",
          val: "104",
          unit: "mg/dL",
          ref: "70 - 99",
          low: 70,
          high: 99,
          status: "HIGH",
          note: "Value (104) exceeds source upper limit (99).",
          excerpt: "Fasting Glucose: 104 mg/dL            Reference Range: 70 - 99 mg/dL        [HIGH]",
          conf: 0.98,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
        {
          testName: "Serum Creatinine",
          val: "0.88",
          unit: "mg/dL",
          ref: "0.60 - 1.20",
          low: 0.6,
          high: 1.2,
          status: "NORMAL",
          note: "Value falls within the printed source reference range.",
          excerpt: "Serum Creatinine: 0.88 mg/dL          Reference Range: 0.60 - 1.20 mg/dL    [NORMAL]",
          conf: 0.99,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
        {
          testName: "Vitamin D (25-OH)",
          val: "18.2",
          unit: "ng/mL",
          ref: "30.0 - 100.0",
          low: 30.0,
          high: 100.0,
          status: "LOW",
          note: "Value (18.2) is below source lower limit (30.0).",
          excerpt: "Vitamin D (25-OH): 18.2 ng/mL         Reference Range: 30.0 - 100.0 ng/mL   [LOW]",
          conf: 0.98,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
        {
          testName: "Ferritin",
          val: "14",
          unit: "ng/mL",
          ref: "15 - 150",
          low: 15,
          high: 150,
          status: "LOW",
          note: "Value (14) is below source lower limit (15).",
          excerpt: "Ferritin: 14 ng/mL                    Reference Range: 15 - 150 ng/mL       [LOW]",
          conf: 0.95,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
        {
          testName: "Serum Zinc",
          val: "88",
          unit: "mcg/dL",
          ref: "Not provided in source",
          low: null,
          high: null,
          status: "NOT_ASSESSED",
          note: "No reference range was printed in the source document.",
          excerpt: "Serum Zinc: 88 mcg/dL                 Reference Range: Not provided in source [NOT ASSESSED]",
          conf: 0.94,
          verStatus: "PENDING_REVIEW",
          prov: "SOURCE_EXTRACTED",
        },
      ];

      for (const obs of cmpObservations) {
        await prisma.medicalObservation.create({
          data: {
            reportId: cmpReport.id,
            testName: obs.testName,
            value: obs.val,
            unit: obs.unit,
            referenceText: obs.ref,
            referenceLow: obs.low,
            referenceHigh: obs.high,
            status: obs.status,
            observationNote: obs.note,
            sourcePage: 1,
            sourceExcerpt: obs.excerpt,
            confidence: obs.conf,
            verificationStatus: obs.verStatus,
            originalValue: obs.val,
            originalUnit: obs.unit,
            originalReferenceText: obs.ref,
            provenance: obs.prov,
            reportDate: new Date("2026-08-28"),
          },
        });
      }

      // Conflict: Allergy inconsistency between intake and laboratory notes
      await prisma.conflict.create({
        data: {
          patientId: sarah.id,
          reportAId: cbcReport.id,
          category: "ALLERGY",
          description: "Patient intake lists documented allergy to 'Penicillin (urticaria/rash)', whereas laboratory requisition header notes 'NKDA' (No Known Drug Allergies).",
          valueA: "Intake: Penicillin (urticaria/rash), Sulfa-containing antibiotics",
          valueB: "Lab Requisition: NKDA (No Known Drug Allergies)",
          status: "NEEDS_REVIEW",
        },
      });

      // Audit logs for Sarah
      await prisma.auditLog.create({
        data: {
          userId: demoUser.id,
          patientId: sarah.id,
          action: "VERIFY_OBSERVATION",
          objectType: "MedicalObservation",
          objectId: "obs_hemoglobin",
          previousValue: "PENDING_REVIEW",
          newValue: "VERIFIED",
        },
      });

      await prisma.timelineEvent.create({
        data: {
          patientId: sarah.id,
          eventType: "REPORT_PROCESSED",
          title: "Complete Blood Count Processed",
          description: "12 structured laboratory observations extracted with source provenance.",
          actor: "MedLens Extraction Pipeline",
        },
      });

      await prisma.timelineEvent.create({
        data: {
          patientId: sarah.id,
          eventType: "HUMAN_VERIFICATION",
          title: "Clinician Verified Hemoglobin & WBC",
          description: "Hemoglobin 11.4 g/dL verified by Dr. Elena Rostova against source excerpt.",
          actor: "Dr. Elena Rostova, MD",
        },
      });
    }

    // 3. Patient 2: Robert Chen
    let robert = await prisma.patient.findUnique({
      where: { patientId: "PT-20815" },
    });

    if (!robert) {
      robert = await prisma.patient.create({
        data: {
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
        },
      });

      const lipidReport = await prisma.medicalReport.create({
        data: {
          patientId: robert.id,
          title: "Lipid Profile & Atherogenic Risk Markers",
          fileName: "Robert_Chen_Lipid_Panel.pdf",
          fileSize: 139500,
          mimeType: "application/pdf",
          rawText: `CARDIOVASCULAR DIAGNOSTIC INSTITUTE
PATIENT: Robert Chen | ID: PT-20815 | DOB: 1968-07-22 | SEX: M
ORDERING CLINICIAN: Dr. Sandra Wu, MD
PANEL: Standard Lipid Panel (Fasting 12 hours)

Total Cholesterol: 228 mg/dL          Reference Range: < 200 mg/dL        [HIGH]
LDL Cholesterol (Calc): 146 mg/dL     Reference Range: < 100 mg/dL        [HIGH]
HDL Cholesterol: 48 mg/dL             Reference Range: > 40 mg/dL         [NORMAL]
Triglycerides: 170 mg/dL              Reference Range: < 150 mg/dL        [HIGH]
Non-HDL Cholesterol: 180 mg/dL        Reference Range: < 130 mg/dL        [HIGH]
Cholesterol/HDL Ratio: 4.75           Reference Range: < 5.00             [NORMAL]
Apolipoprotein B: 112 mg/dL           Reference Range: Not provided in source [NOT ASSESSED]`,
          reportDate: new Date("2026-08-30"),
          processingStatus: "COMPLETED",
        },
      });

      const lipidObs = [
        {
          testName: "Total Cholesterol",
          val: "228",
          unit: "mg/dL",
          ref: "< 200",
          low: null,
          high: 200,
          status: "HIGH",
          note: "Value (228) exceeds source upper limit (200).",
          excerpt: "Total Cholesterol: 228 mg/dL          Reference Range: < 200 mg/dL        [HIGH]",
          conf: 0.99,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
        {
          testName: "LDL Cholesterol",
          val: "146",
          unit: "mg/dL",
          ref: "< 100",
          low: null,
          high: 100,
          status: "HIGH",
          note: "Value (146) exceeds source upper limit (100).",
          excerpt: "LDL Cholesterol (Calc): 146 mg/dL     Reference Range: < 100 mg/dL        [HIGH]",
          conf: 0.98,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
        {
          testName: "HDL Cholesterol",
          val: "48",
          unit: "mg/dL",
          ref: "> 40",
          low: 40,
          high: null,
          status: "NORMAL",
          note: "Value falls within the printed source reference range.",
          excerpt: "HDL Cholesterol: 48 mg/dL             Reference Range: > 40 mg/dL         [NORMAL]",
          conf: 0.98,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
        {
          testName: "Triglycerides",
          val: "170",
          unit: "mg/dL",
          ref: "< 150",
          low: null,
          high: 150,
          status: "HIGH",
          note: "Value (170) exceeds source upper limit (150).",
          excerpt: "Triglycerides: 170 mg/dL              Reference Range: < 150 mg/dL        [HIGH]",
          conf: 0.97,
          verStatus: "VERIFIED",
          prov: "HUMAN_VERIFIED",
        },
      ];

      for (const obs of lipidObs) {
        await prisma.medicalObservation.create({
          data: {
            reportId: lipidReport.id,
            testName: obs.testName,
            value: obs.val,
            unit: obs.unit,
            referenceText: obs.ref,
            referenceLow: obs.low,
            referenceHigh: obs.high,
            status: obs.status,
            observationNote: obs.note,
            sourcePage: 1,
            sourceExcerpt: obs.excerpt,
            confidence: obs.conf,
            verificationStatus: obs.verStatus,
            originalValue: obs.val,
            originalUnit: obs.unit,
            originalReferenceText: obs.ref,
            provenance: obs.prov,
            reportDate: new Date("2026-08-30"),
          },
        });
      }

      await prisma.timelineEvent.create({
        data: {
          patientId: robert.id,
          eventType: "PATIENT_CREATED",
          title: "Executive Profile Registered",
          description: "Patient profile created with user-provided details.",
          actor: "Clinical Coordinator",
        },
      });

      await prisma.timelineEvent.create({
        data: {
          patientId: robert.id,
          eventType: "HUMAN_VERIFICATION",
          title: "Lipid Profile Verified",
          description: "All 4 critical cardiovascular risk markers reviewed and approved.",
          actor: "Dr. Elena Rostova, MD",
        },
      });
    }

    return { success: true };
  } catch (seedErr) {
    console.error("Seed execution failed:", seedErr);
    return { success: false, error: seedErr };
  }
}
