import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServices } from "@/lib/api";
import AdminButton from "@/components/admin/ui/AdminButton";
import ServiceList from "@/components/admin/services/ServiceList";
import { Plus } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  Admin Services Page — Secure Server Wrapper
// ─────────────────────────────────────────────────────────

export default async function AdminServicesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const services = await getServices();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Services
          </h1>
          <p className="text-sm text-white/40 font-medium">
            Manage your photography service offerings and featured flagship items.
          </p>
        </div>
        <Link href="/admin/services/new">
          <AdminButton size="md" className="shadow-lg shadow-[#c9a96e]/10">
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </AdminButton>
        </Link>
      </div>

      {/* Optimized Service Table (Client Side Interactions) */}
      <ServiceList initialServices={services} />
    </div>
  );
}
