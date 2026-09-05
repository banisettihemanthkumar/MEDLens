import { NextResponse } from "next/server";
import { ensureSeeded, getStore, newId } from "@/lib/store";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const { patientId, name, age, sex, symptoms, conditions, allergies, medications, otherInfo } = body;

    if (!patientId || !age || !sex) {
      return NextResponse.json({ error: "patientId, age, and sex are required" }, { status: 400 });
    }

    const store = getStore();

    // Check for duplicate patientId
    if (store.patients.find((p) => p.patientId === patientId)) {
      return NextResponse.json({ error: `Patient ID "${patientId}" is already in use.` }, { status: 409 });
    }

    const now = new Date();
    const newPatient = {
      id: newId(),
      patientId: String(patientId).trim(),
      name: name?.trim() || null,
      age: Number(age),
      sex: String(sex),
      symptoms: symptoms?.trim() || null,
      conditions: conditions?.trim() || null,
      allergies: allergies?.trim() || null,
      medications: medications?.trim() || null,
      otherInfo: otherInfo?.trim() || null,
      reviewStatus: "PENDING_REVIEW",
      createdAt: now,
      updatedAt: now,
    };

    store.patients.push(newPatient);

    // Add timeline event
    store.timelineEvents.push({
      id: newId(),
      patientId: newPatient.id,
      eventType: "PATIENT_CREATED",
      title: "Patient Record Created",
      description: "New patient profile registered with user-provided demographic and intake details.",
      metadata: null,
      actor: "User Intake Form",
      createdAt: now,
    });

    return NextResponse.json({ patient: newPatient }, { status: 201 });
  } catch (err) {
    console.error("Failed to create patient:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  await ensureSeeded();
  const store = getStore();
  return NextResponse.json({ patients: store.patients });
}
