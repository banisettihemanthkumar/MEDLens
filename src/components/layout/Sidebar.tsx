"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Clock,
  Search,
  ShieldCheck,
  GitCompare,
  AlertTriangle,
  Compass,
  ArrowRight
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Patient", href: "/patients/new", icon: UserPlus },
    { name: "Timeline", href: "/timeline", icon: Clock },
    { name: "Search Records", href: "/search", icon: Search },
    { name: "Security & Privacy", href: "/security", icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Clinical Navigation
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#0B192C] text-white shadow-sm font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Demo Quick Shortcuts */}
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/50 to-indigo-50/30 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-950">
            <Compass className="h-4 w-4 text-sky-600" />
            <span>Fictional Demo Patients</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
            Quick jump to pre-seeded clinical scenarios:
          </p>
          <div className="mt-2.5 space-y-1.5">
            <Link
              href="/dashboard#patient-PT-10482"
              className="flex items-center justify-between rounded-lg bg-white p-2 text-xs font-medium text-slate-700 shadow-sm border border-slate-200/60 hover:border-sky-300 hover:text-sky-700 transition-colors"
            >
              <div>
                <p className="font-semibold text-[11px]">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-400">CBC + CMP (Allergy Conflict)</p>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </Link>

            <Link
              href="/dashboard#patient-PT-20815"
              className="flex items-center justify-between rounded-lg bg-white p-2 text-xs font-medium text-slate-700 shadow-sm border border-slate-200/60 hover:border-sky-300 hover:text-sky-700 transition-colors"
            >
              <div>
                <p className="font-semibold text-[11px]">Robert Chen</p>
                <p className="text-[10px] text-slate-400">Lipid Risk Markers</p>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Principle Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Primary Principle
          </p>
          <p className="mt-1 text-xs font-medium text-slate-700 italic">
            "Trace every insight back to its source."
          </p>
        </div>
      </div>
    </aside>
  );
}
