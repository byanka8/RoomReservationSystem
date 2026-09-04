import { Suspense } from "react";
import VerifySecurityContent from "./VerifySecurityContent";

export default function VerifySecurityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifySecurityContent />
    </Suspense>
  );
}
