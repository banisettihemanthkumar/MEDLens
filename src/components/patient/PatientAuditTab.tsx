import { formatDateTime } from "@/lib/utils";
import { ShieldCheck, History } from "lucide-react";

interface PatientAuditTabProps {
  auditLogs: Array<{
    id: string;
    action: string;
    objectType: string;
    objectId: string;
    previousValue: string | null;
    newValue: string | null;
    createdAt: string | Date;
  }>;
}

export function PatientAuditTab({ auditLogs }: PatientAuditTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Immutable Audit History</h2>
        <p className="text-xs text-slate-500">
          Cryptographically aligned audit log capturing all human verification, field edits, and extraction actions
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Object</th>
              <th className="py-3 px-4">Previous Value</th>
              <th className="py-3 px-4">Updated Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 text-slate-500">{formatDateTime(log.createdAt)}</td>
                <td className="py-3 px-4 font-bold text-sky-900">{log.action}</td>
                <td className="py-3 px-4 text-slate-700">{log.objectType}</td>
                <td className="py-3 px-4 text-rose-700 bg-rose-50/30 font-semibold">
                  {log.previousValue || "—"}
                </td>
                <td className="py-3 px-4 text-emerald-700 bg-emerald-50/30 font-semibold">
                  {log.newValue || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
