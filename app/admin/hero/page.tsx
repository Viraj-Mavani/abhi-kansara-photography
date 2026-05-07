import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getHeroBackgrounds, getPageConfig } from "@/lib/api";
import HeroManager from "@/components/admin/hero/HeroManager";

// ─────────────────────────────────────────────────────────
//  Admin Hero Page — Managed by Server Component
//  Fetches initial data and passes to client manager.
// ─────────────────────────────────────────────────────────

export default async function AdminHeroPage() {
  // Auth guard
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  if (!token) redirect("/admin/login");

  // Fetch initial data
  let backgrounds = [];
  let homeConfig = null;

  try {
    [backgrounds, homeConfig] = await Promise.all([
      getHeroBackgrounds(),
      getPageConfig("home"),
    ]);
  } catch (error) {
    console.error("Failed to load hero config:", error);
    // Fallback or error UI could go here
  }

  if (!homeConfig) {
    return (
      <div className="p-8 text-white/50 bg-red-500/10 border border-red-500/20 rounded-xl">
        <h2 className="text-xl font-bold text-red-500 mb-2">Configuration Error</h2>
        <p>Could not find the &quot;home&quot; page configuration in the database. Please ensure migrations and seeding were successful.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
          Hero Manager
        </h1>
        <p className="text-sm text-white/40">
          Manage landing page background visuals and cinematic transition timing.
        </p>
      </div>

      <HeroManager 
        initialBackgrounds={backgrounds} 
        homeConfig={homeConfig} 
      />
    </div>
  );
}
