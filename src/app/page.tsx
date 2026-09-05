import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  CheckCircle2,
  Scale,
  Clock,
  Search,
  Activity,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Lock,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-slate-50/80 via-sky-50/20 to-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/90 px-3.5 py-1 text-xs font-semibold text-sky-800 shadow-sm backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Healthcare Clinical Intelligence & Provenance Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Turn fragmented medical information into a{" "}
            <span className="bg-gradient-to-r from-sky-600 to-[#1E3E62] bg-clip-text text-transparent">
              clear, reviewable patient record.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            MedLens organizes patient information and medical reports into structured, traceable
            information — helping people understand what their records contain without replacing
            professional medical judgment.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0B192C] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-[#1E3E62] transition-all hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 text-sky-400" />
            </Link>
            <Link
              href="/dashboard#demo"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span>View Interactive Demo</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          {/* Core Principle Callout */}
          <div className="mt-6 text-xs text-slate-400 font-medium">
            Core Principle: <span className="italic text-slate-600">"Trace every insight back to its source."</span>
          </div>

          {/* DASHBOARD MOCKUP / PRODUCT PREVIEW */}
          <div className="mt-16 rounded-3xl border border-slate-200/80 bg-white p-2 sm:p-4 shadow-2xl shadow-sky-950/5 ring-1 ring-black/5 text-left max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 overflow-hidden">
              {/* Mock Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm">
                    SJ
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Sarah Jenkins</span>
                      <span className="font-mono text-xs text-slate-400">PT-10482</span>
                      <VerificationBadge status="PARTIALLY_VERIFIED" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Age 42 • Female • Complete Blood Count & Metabolic Profile
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold">
                    12 Observations Linked
                  </span>
                  <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold">
                    1 Allergy Inconsistency
                  </span>
                </div>
              </div>

              {/* Mock Split Preview */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left: Document Excerpt Preview */}
                <div className="md:col-span-5 rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] text-slate-700 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Source Document Excerpt (Page 1)
                  </div>
                  <div className="text-slate-400">METRO CLINICAL LABORATORIES - REF #8892</div>
                  <div className="p-2 rounded bg-amber-100/80 border-l-2 border-amber-500 text-amber-950 font-bold">
                    Hemoglobin: 11.4 g/dL [LOW] (Range: 12.0 - 16.0 g/dL)
                  </div>
                  <div className="text-slate-500">Hematocrit: 34.2 % (Range: 36.0 - 48.0 %)</div>
                  <div className="text-slate-500">WBC Count: 6.4 x10^3/uL (Range: 4.5 - 11.0)</div>
                  <div className="mt-3 text-[10px] text-sky-700 font-sans font-semibold">
                    ✓ Verbatim snippet matched with 98% confidence
                  </div>
                </div>

                {/* Right: Structured Observation Card */}
                <div className="md:col-span-7 rounded-xl border border-sky-300 bg-sky-50/30 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Hemoglobin</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <ProvenanceBadge type="SOURCE_EXTRACTED" />
                        <span className="text-[10px] text-slate-400 font-mono">98% confidence</span>
                      </div>
                    </div>
                    <StatusBadge status="LOW" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">REPORTED VALUE</span>
                      <p className="font-bold text-slate-900">11.4 g/dL</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">SOURCE RANGE</span>
                      <p className="font-semibold text-slate-700">12.0 - 16.0 g/dL</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">STATUS</span>
                      <p className="font-bold text-amber-700">Below Source Limit</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500">
                      Calculated only from source-printed range
                    </span>
                    <button className="rounded-lg bg-emerald-600 px-3 py-1 font-semibold text-white text-xs shadow-sm">
                      Verify Observation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 CORE FEATURES SECTION */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-sky-600 tracking-wider">
              Comprehensive Clinical Capabilities
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-[#0B192C] tracking-tight sm:text-4xl">
              Engineered for absolute traceability and human verification
            </p>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Every data point in MedLens is anchored to its source document, preventing hallucinated
              ranges or unsubstantiated clinical assumptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Patient Information Intake</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Capture patient-reported symptoms, existing conditions, medications, and allergies.
                Every intake field is explicitly stamped with a <strong>USER PROVIDED</strong> provenance badge.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Intelligent Report Processing</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                An 8-stage pipeline parses laboratory PDFs, segments pages, identifies tests and values,
                and extracts exact source excerpts without modifying original documents.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Structured Medical Records</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Transform scanned and unstructured lab tests into clean, standardized observations with
                explicit values, units, reference intervals, and page citations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Reference-Range Awareness</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                <strong>Strict Rule:</strong> Never invent a reference range. If a source doesn't print a
                range, it is marked "Not provided in source" and evaluated as "Not assessed".
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Source & Provenance</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Every observation displays its origin: User Provided, Source Extracted, AI Generated,
                Derived from Source Range, or Human Verified.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Patient-Friendly Summaries</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Generate concise summaries detailing total tests, results in range, out of range, and
                not assessed. Never suggests diagnosis or alters treatments.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Human Verification</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Side-by-side review enables clinicians to verify, edit, flag, or reject extractions.
                Historical values are never silently overwritten.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Timeline & History</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Complete longitudinal event stream tracking patient creation, uploads, structured
                parsing, reviewer edits, and cross-report conflict resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AI COMMITMENT SECTION */}
      <section className="py-16 bg-[#0B192C] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <Lock className="h-3.5 w-3.5" />
            <span>Responsible AI by Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            "MedLens organizes and summarizes medical information. It does not diagnose, prescribe, or recommend treatment."
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Healthcare decisions require qualified clinical human expertise. MedLens functions
            strictly as an information intelligence and provenance layer. We never output disease
            predictions, therapeutic plans, dosage adjustments, or ungrounded conclusions.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
              Zero Hallucinated Reference Intervals
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
              Verbatim Text Excerpt Attribution
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
              Immutable Audit Records
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-600" />
              <span className="font-bold text-slate-900 tracking-tight">MEDLENS</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              AI-Powered Clinical Information Intelligence • From scattered reports to structured insight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/security" className="hover:text-slate-900 transition-colors">
              Security & Compliance
            </Link>
            <Link href="/security#privacy" className="hover:text-slate-900 transition-colors">
              Privacy Principles
            </Link>
            <Link href="/security#responsible-ai" className="hover:text-slate-900 transition-colors">
              Responsible AI Policy
            </Link>
            <Link href="/dashboard" className="font-semibold text-sky-700 hover:text-sky-900 transition-colors">
              Access Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
