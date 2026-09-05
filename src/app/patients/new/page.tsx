import { AddPatientForm } from "@/components/patient/AddPatientForm";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserPlus } from "lucide-react";

export default function NewPatientPage() {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sky-700 font-semibold text-xs mb-1">
            <UserPlus className="h-4 w-4" />
            <span>CLINICAL INTAKE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Register New Patient Record
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture demographic identifiers and intake disclosures. All intake fields are stamped as USER PROVIDED.
          </p>
        </div>

        <AddPatientForm />
      </main>
    </div>
  );
}
