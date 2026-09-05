import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ResponsibleAiNotice } from "@/components/layout/ResponsibleAiNotice";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MedLens — AI-Powered Clinical Information Intelligence",
  description:
    "Transform fragmented patient records and medical reports into structured, traceable, and human-verified clinical intelligence without replacing professional medical judgment.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
        <ResponsibleAiNotice />
        <Navbar user={user} />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
