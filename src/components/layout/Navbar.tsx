"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Search, 
  Bell, 
  User as UserIcon, 
  Sparkles, 
  LogOut,
  Activity,
  Layers,
  DatabaseZap
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await fetch("/api/demo/seed", { method: "POST" });
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white shadow-md shadow-slate-900/10 transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-[#0B192C] text-lg font-sans">
                  MEDLENS
                </span>
                <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 tracking-wide">
                  CLINICAL INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                From scattered reports to structured insight
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, tests (e.g. Hemoglobin), report IDs..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </form>
        </div>

        {/* Right: Actions, Demo Badge & Profile */}
        <div className="flex items-center gap-3">
          {/* Demo reset button */}
          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reload fictional sample patients and reports"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/60 px-2.5 py-1 text-xs font-medium text-sky-800 hover:bg-sky-100 transition-colors"
          >
            <DatabaseZap className="h-3.5 w-3.5 text-sky-600" />
            <span>{isResetting ? "Resetting..." : "Reset Demo Data"}</span>
          </button>

          {/* Quick Notice Tag */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Non-Diagnostic / Provenance Locked
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 pr-3 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="h-7 w-7 rounded-full bg-[#1E3E62] text-white flex items-center justify-center font-semibold text-xs">
                {user?.name ? user.name.charAt(0) : "D"}
              </div>
              <span className="hidden sm:inline max-w-[120px] truncate">
                {user?.name || "Dr. Elena Rostova"}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user?.name || "Dr. Elena Rostova, MD"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email || "demo@medlens.health"}
                  </p>
                  <span className="inline-block mt-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    Role: {user?.role || "CLINICIAN"}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Layers className="h-4 w-4 text-slate-400" />
                  Clinical Dashboard
                </Link>
                <Link
                  href="/security"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4 text-slate-400" />
                  Security & Compliance
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
