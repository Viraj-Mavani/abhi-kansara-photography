"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// ─────────────────────────────────────────────────────────
//  AdminInput — Dark-themed text input for admin forms
// ─────────────────────────────────────────────────────────

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "h-11 w-full rounded-lg border bg-white/[0.03] px-4 text-sm text-white/90 placeholder:text-white/25 outline-none transition-all duration-200",
            "border-white/[0.08] focus:border-[#c9a96e]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#c9a96e]/20",
            error && "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[11px] text-red-400 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

AdminInput.displayName = "AdminInput";
export default AdminInput;
