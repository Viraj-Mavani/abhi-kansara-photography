import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBio } from "@/lib/api";
import SiteConfigEditor from "@/components/admin/site-config/SiteConfigEditor";
import type { PageConfig } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api";

export default async function AdminSiteConfigPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const bio = await getBio();

  // Fetch all page configs
  let pageConfigs: PageConfig[] = [];
  try {
    const res = await fetch(`${API_URL}/siteconfig/pages`, { cache: "no-store" });
    if (res.ok) {
      pageConfigs = await res.json();
    }
  } catch {
    // API might not have page configs seeded yet
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
          Site Configuration
        </h1>
        <p className="text-sm text-white/40">
          Manage artist bio, page heroes, and global site settings
        </p>
      </div>

      <SiteConfigEditor bio={bio} pageConfigs={pageConfigs} />
    </div>
  );
}
