import { getStore, newId } from "./store";

export interface CreateAuditLogParams {
  userId?: string | null;
  patientId?: string | null;
  action: string;
  objectType: string;
  objectId: string;
  previousValue?: string | null;
  newValue?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logAuditEvent(params: CreateAuditLogParams) {
  try {
    const store = getStore();
    const entry = {
      id: newId(),
      userId: params.userId || null,
      patientId: params.patientId || null,
      action: params.action,
      objectType: params.objectType,
      objectId: params.objectId,
      previousValue: params.previousValue || null,
      newValue: params.newValue || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      createdAt: new Date(),
    };
    store.auditLogs.push(entry);
    return entry;
  } catch (err) {
    console.error("Audit log recording failed:", err);
    return null;
  }
}

export async function createTimelineEvent(params: {
  patientId: string;
  eventType: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  actor?: string;
}) {
  try {
    const store = getStore();
    const entry = {
      id: newId(),
      patientId: params.patientId,
      eventType: params.eventType,
      title: params.title,
      description: params.description,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      actor: params.actor || "Clinician Reviewer",
      createdAt: new Date(),
    };
    store.timelineEvents.push(entry);
    return entry;
  } catch (err) {
    console.error("Timeline event creation failed:", err);
    return null;
  }
}
