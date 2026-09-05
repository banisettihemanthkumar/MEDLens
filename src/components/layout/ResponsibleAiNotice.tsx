import { ShieldCheck, Info } from "lucide-react";

export function ResponsibleAiNotice() {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#0B192C] to-[#1E3E62] text-white px-4 py-2 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <Info className="h-3.5 w-3.5" />
          </span>
          <p className="text-[11px] text-slate-200 leading-snug">
            <strong className="font-semibold text-sky-300">MedLens Responsible AI Notice:</strong> MedLens organizes and summarizes medical records into structured information. It does <strong>not</strong> diagnose conditions, prescribe treatments, or recommend medication changes. Always verify against original sources and consult licensed medical professionals.
          </p>
        </div>
        <span className="hidden md:inline-block shrink-0 rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-sky-200 tracking-wide">
          NON-DIAGNOSTIC
        </span>
      </div>
    </div>
  );
}
