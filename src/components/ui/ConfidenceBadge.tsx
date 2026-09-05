interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const pct = Math.round(confidence * 100);
  let color = "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (pct < 85) color = "text-amber-700 bg-amber-50 border-amber-200";
  if (pct < 70) color = "text-rose-700 bg-rose-50 border-rose-200";

  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-semibold ${color}`}>
      {pct}% confidence
    </span>
  );
}
