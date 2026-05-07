"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";

// ─────────────────────────────────────────────────────────
//  Admin Login — Premium frosted glass card
//  Posts to /api/admin/auth Route Handler
// ─────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Success — redirect to dashboard
      router.push("/admin/dashboard");
      router.refresh(); // Force layout re-render to pick up the new cookie
    } catch {
      setError("Connection error. Is the backend running?");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070a] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#c9a96e]/[0.03] blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#c9a96e]/[0.02] blur-[120px]" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4">
        {/* Card with frosted glass effect */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/50">
          {/* Logo / Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/15 mb-5">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-[#c9a96e]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white/90 tracking-wide mb-1">
              Admin Login
            </h1>
            <p className="text-sm text-white/30">
              Abhi Kansara Photography CMS
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AdminInput
              label="Email"
              type="email"
              placeholder="admin@abhikansara.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <AdminInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <AdminButton
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </AdminButton>
          </form>

          {/* Footer hint */}
          <p className="text-center text-[11px] text-white/20 mt-8">
            Protected area · Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
