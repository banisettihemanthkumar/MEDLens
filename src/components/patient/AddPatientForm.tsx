"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Sparkles, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";

export function AddPatientForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
    name: "",
    age: "",
    sex: "Female",
    symptoms: "",
    conditions: "",
    allergies: "",
    medications: "",
    otherInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age, 10),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to register patient");
      }

      router.push(`/patients/${json.patient.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          {error}
        </div>
      )}

      {/* Demographics Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Demographic Identifiers</h3>
            <p className="text-[11px] text-slate-500">
              Unique clinical identifier and basic demographics
            </p>
          </div>
          <ProvenanceBadge type="USER_PROVIDED" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Patient ID</label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 font-mono px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-sky-500 focus:outline-none"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Unique medical record ID</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Patient Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Optional/anonymized</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Age</label>
              <input
                type="number"
                min="0"
                max="125"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="42"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Sex</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Context & Intake */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Clinical Background & Intake</h3>
            <p className="text-[11px] text-slate-500">
              Information supplied during registration. Labeled as USER PROVIDED.
            </p>
          </div>
          <ProvenanceBadge type="USER_PROVIDED" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Symptoms / Reason for Visit
            </label>
            <textarea
              rows={3}
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="e.g. Mild fatigue, intermittent dizziness after morning runs..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Existing Conditions
            </label>
            <textarea
              rows={3}
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              placeholder="e.g. Hypertension, Seasonal allergies..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Documented Allergies
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="e.g. Penicillin (rash), Sulfa drugs..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Current Medications & Supplements
            </label>
            <input
              type="text"
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              placeholder="e.g. Multivitamin daily, Lisinopril 10mg..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Other Relevant Information
          </label>
          <textarea
            rows={2}
            value={formData.otherInfo}
            onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
            placeholder="Dietary preferences, exercise habits, family medical history..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B192C] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1E3E62] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Registering Record...</span>
            </>
          ) : (
            <>
              <span>Create Patient Profile</span>
              <ArrowRight className="h-4 w-4 text-sky-400" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
