import { ObservationStatus } from "@/lib/validation";
import { ArrowDown, ArrowUp, Check, HelpCircle } from "lucide-react";

interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const s = (status || "NOT_ASSESSED").toUpperCase() as ObservationStatus;

  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  let label = "NOT ASSESSED";
  let icon = <HelpCircle className="h-3 w-3" />;

  if (s === "NORMAL") {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    label = "NORMAL";
    icon = <Check className="h-3 w-3" />;
  } else if (s === "LOW") {
    colorClass = "bg-amber-50 text-amber-700 border-amber-300";
    label = "LOW";
    icon = <ArrowDown className="h-3 w-3" />;
  } else if (s === "HIGH") {
    colorClass = "bg-rose-50 text-rose-700 border-rose-300";
    label = "HIGH";
    icon = <ArrowUp className="h-3 w-3" />;
  }

  return (
    <div className="inline-flex flex-col items-start">
      <span
        title="Status is calculated only from the reference range printed in the source report."
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold tracking-wide transition-colors ${colorClass} ${className}`}
      >
        {icon}
        <span>{label}</span>
      </span>
      <span className="text-[9px] text-slate-400 mt-0.5">from source range</span>
    </div>
  );
}
