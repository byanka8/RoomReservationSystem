"use client";

import { ReactNode } from "react";

type AuthFormProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthForm({ title, subtitle, children, footer }: AuthFormProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Member access</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </div>
        {footer && <div className="mt-4 text-center text-sm text-slate-600">{footer}</div>}
      </div>
    </div>
  );
}
