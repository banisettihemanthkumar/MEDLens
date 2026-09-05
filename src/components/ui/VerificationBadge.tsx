import { CheckCircle, Clock, Edit3, XCircle, Flag } from "lucide-react";

interface VerificationBadgeProps {
  status?: string | null;
  className?: string;
}

export function VerificationBadge({ status, className = "" }: VerificationBadgeProps) {
  const s = (status || "PENDING_REVIEW").toUpperCase();

  switch (s) {
    case "VERIFIED":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 ${className}`}>
          <CheckCircle className="h-3 w-3 text-emerald-600" />
          Verified
        </span>
      );
    case "EDITED":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800 ${className}`}>
          <Edit3 className="h-3 w-3 text-blue-600" />
          Edited
        </span>
      );
    case "REJECTED":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800 ${className}`}>
          <XCircle className="h-3 w-3 text-rose-600" />
          Rejected
        </span>
      );
    case "FLAGGED":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ${className}`}>
          <Flag className="h-3 w-3 text-amber-600" />
          Flagged
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50/70 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ${className}`}>
          <Clock className="h-3 w-3 text-amber-500 animate-pulse" />
          Pending Review
        </span>
      );
  }
}
