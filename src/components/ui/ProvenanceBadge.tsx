import { getProvenanceDetails, ProvenanceType } from "@/lib/provenance";
import { User, FileText, Sparkles, Scale, CheckCircle2 } from "lucide-react";

interface ProvenanceBadgeProps {
  type?: string | null;
  className?: string;
  showTooltip?: boolean;
}

export function ProvenanceBadge({ type, className = "", showTooltip = true }: ProvenanceBadgeProps) {
  const details = getProvenanceDetails(type);

  const renderIcon = () => {
    switch (details.type) {
      case "USER_PROVIDED":
        return <User className="h-3 w-3 shrink-0" />;
      case "SOURCE_EXTRACTED":
        return <FileText className="h-3 w-3 shrink-0" />;
      case "AI_GENERATED":
        return <Sparkles className="h-3 w-3 shrink-0" />;
      case "DERIVED_FROM_SOURCE_RANGE":
        return <Scale className="h-3 w-3 shrink-0" />;
      case "HUMAN_VERIFIED":
        return <CheckCircle2 className="h-3 w-3 shrink-0" />;
      default:
        return <FileText className="h-3 w-3 shrink-0" />;
    }
  };

  return (
    <span
      title={showTooltip ? details.description : undefined}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold tracking-wide transition-all cursor-help ${details.badgeClass} ${className}`}
    >
      {renderIcon()}
      <span>{details.label}</span>
    </span>
  );
}
