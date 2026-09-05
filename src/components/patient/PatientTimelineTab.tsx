import { formatDateTime } from "@/lib/utils";
import { Clock, User, FileText, CheckCircle2, AlertTriangle, Sparkles, Edit3 } from "lucide-react";

interface PatientTimelineTabProps {
  events: Array<{
    id: string;
    eventType: string;
    title: string;
    description: string;
    actor: string;
    createdAt: string | Date;
  }>;
}

export function PatientTimelineTab({ events }: PatientTimelineTabProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "PATIENT_CREATED":
        return <User className="h-4 w-4 text-sky-600" />;
      case "REPORT_UPLOADED":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "REPORT_PROCESSED":
        return <Sparkles className="h-4 w-4 text-purple-600" />;
      case "HUMAN_VERIFICATION":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "REPORT_EDITED":
        return <Edit3 className="h-4 w-4 text-amber-600" />;
      case "CONFLICT_DETECTED":
        return <AlertTriangle className="h-4 w-4 text-rose-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Patient Longitudinal History</h2>
        <p className="text-xs text-slate-500">
          Chronological audit timeline tracing creation, uploads, extractions, and clinician verifications
        </p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt) => (
          <div key={evt.id} className="relative flex items-start gap-4 group">
            <div className="absolute -left-6 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-300 shadow-xs group-hover:border-sky-500 transition-colors">
              {getEventIcon(evt.eventType)}
            </div>

            <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {formatDateTime(evt.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{evt.description}</p>
              <div className="mt-2 text-[10px] text-slate-400">
                Actor: <span className="font-semibold text-slate-600">{evt.actor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
