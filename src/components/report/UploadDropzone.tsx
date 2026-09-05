"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from "lucide-react";

interface UploadDropzoneProps {
  patientId: string;
  onUploadSuccess?: (reportId: string) => void;
}

const PIPELINE_STEPS = [
  "1. Secure document upload",
  "2. Text extraction & page segmentation",
  "3. Medical entity recognition",
  "4. Structured observation extraction",
  "5. Reference range & unit validation",
  "6. Statistical confidence scoring",
  "7. Source excerpt & provenance linkage",
  "8. Staging for human verification",
];

export function UploadDropzone({ patientId, onUploadSuccess }: UploadDropzoneProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successReportId, setSuccessReportId] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    // Limit to 15MB
    if (f.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15MB limit. Please upload a smaller medical report.");
      return;
    }
    setFile(f);
  };

  const handleUploadAndProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setCurrentStep(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);

    // Simulate pipeline progression visually
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const res = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(stepInterval);
      setCurrentStep(PIPELINE_STEPS.length - 1);

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to process document");
      }

      setSuccessReportId(json.reportId);
      if (onUploadSuccess) onUploadSuccess(json.reportId);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-sky-500 bg-sky-50/50 scale-[1.01]"
            : file
            ? "border-emerald-300 bg-emerald-50/20"
            : "border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400"
        } ${isProcessing ? "pointer-events-none opacity-90" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 text-sky-600 mb-4">
          {file ? (
            <FileCheck className="h-7 w-7 text-emerald-600" />
          ) : (
            <UploadCloud className="h-7 w-7 text-sky-600" />
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-900">
          {file ? file.name : "Upload Medical Report"}
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          {file
            ? `${(file.size / 1024).toFixed(1)} KB • Ready for extraction`
            : "Drag & drop your clinical laboratory PDF or click to browse"}
        </p>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
          <span>Supported: PDF, TXT (Max 15MB)</span>
          <span>•</span>
          <span>Encrypted Transmission</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Processing Failed</p>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Pipeline Status if Processing or Selected */}
      {file && !successReportId && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900">Extraction Pipeline</p>
              <p className="text-[11px] text-slate-500">
                8-stage provenance-aware structured data extraction
              </p>
            </div>
            {!isProcessing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadAndProcess();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B192C] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E3E62] transition-colors"
              >
                <span>Start Extraction</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Stepper Progress */}
          <div className="space-y-2 pt-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = isProcessing ? idx < currentStep : false;
              const isCurrent = isProcessing ? idx === currentStep : false;
              return (
                <div
                  key={step}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                    isCurrent
                      ? "bg-sky-50 text-sky-900 font-semibold border border-sky-200"
                      : isDone
                      ? "bg-slate-50 text-emerald-800 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-sky-600 animate-spin shrink-0" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300 ml-1 mr-1" />
                    )}
                    <span>{step}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono">
                    {isDone ? "Done" : isCurrent ? "Processing" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successReportId && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950">Extraction Completed</p>
              <p className="text-xs text-emerald-700">
                Observations extracted with source excerpts. Ready for human verification.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/reports/${successReportId}/review`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B192C] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1E3E62] transition-colors"
          >
            <span>Open Side-by-Side Review</span>
            <ArrowRight className="h-4 w-4 text-sky-400" />
          </button>
        </div>
      )}
    </div>
  );
}
