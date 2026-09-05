export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 animate-pulse p-4">
      <div className="h-6 w-1/3 bg-slate-200 rounded-lg"></div>
      <div className="h-4 w-1/2 bg-slate-100 rounded-lg"></div>
      <div className="space-y-2 pt-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 w-full bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
