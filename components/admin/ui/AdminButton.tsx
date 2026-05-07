"use client";

import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  AdminButton — Gold primary, ghost, and danger variants
// ─────────────────────────────────────────────────────────

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function AdminButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: AdminButtonProps) {
  const variants = {
    primary:
      "bg-[#c9a96e] text-black font-bold hover:bg-[#d4b87d] active:bg-[#b89a5f] shadow-lg shadow-[#c9a96e]/10",
    ghost:
      "bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:border-white/15",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-10 px-5 text-sm rounded-lg gap-2",
    lg: "h-12 px-6 text-sm rounded-lg gap-2.5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
