export type ProvenanceType =
  | "USER_PROVIDED"
  | "SOURCE_EXTRACTED"
  | "AI_GENERATED"
  | "DERIVED_FROM_SOURCE_RANGE"
  | "HUMAN_VERIFIED";

export interface ProvenanceBadgeInfo {
  type: ProvenanceType;
  label: string;
  badgeClass: string;
  description: string;
  iconName: string;
}

export const PROVENANCE_CONFIG: Record<ProvenanceType, ProvenanceBadgeInfo> = {
  USER_PROVIDED: {
    type: "USER_PROVIDED",
    label: "USER PROVIDED",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    description: "Entered directly by user or patient intake; not verified against clinical source.",
    iconName: "User",
  },
  SOURCE_EXTRACTED: {
    type: "SOURCE_EXTRACTED",
    label: "SOURCE EXTRACTED",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    description: "Extracted directly from original medical document with exact excerpt provenance.",
    iconName: "FileText",
  },
  AI_GENERATED: {
    type: "AI_GENERATED",
    label: "AI GENERATED",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    description: "Synthesized by AI structured parsing; requires human verification.",
    iconName: "Sparkles",
  },
  DERIVED_FROM_SOURCE_RANGE: {
    type: "DERIVED_FROM_SOURCE_RANGE",
    label: "DERIVED FROM SOURCE RANGE",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    description: "Calculated strictly by comparing numeric value to reference interval printed in source.",
    iconName: "Scale",
  },
  HUMAN_VERIFIED: {
    type: "HUMAN_VERIFIED",
    label: "HUMAN VERIFIED",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    description: "Reviewed, confirmed or edited by a clinical human reviewer.",
    iconName: "CheckCircle2",
  },
};

export function getProvenanceDetails(type?: string | null): ProvenanceBadgeInfo {
  if (!type || !(type in PROVENANCE_CONFIG)) {
    return PROVENANCE_CONFIG.SOURCE_EXTRACTED;
  }
  return PROVENANCE_CONFIG[type as ProvenanceType];
}
