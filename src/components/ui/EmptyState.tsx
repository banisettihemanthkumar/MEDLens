import { LucideIcon, FolderSearch } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderSearch,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/80 text-slate-400">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">{description}</p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center rounded-xl bg-[#0B192C] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3E62] transition-colors"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center rounded-xl bg-[#0B192C] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3E62] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
