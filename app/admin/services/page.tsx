import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServices } from "@/lib/api";
import { deleteService } from "@/app/actions/services";
import AdminButton from "@/components/admin/ui/AdminButton";

// ─────────────────────────────────────────────────────────
//  Services List — Admin Table View
// ─────────────────────────────────────────────────────────

export default async function AdminServicesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const services = await getServices();

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
            Services
          </h1>
          <p className="text-sm text-white/40">
            Manage photography service offerings
          </p>
        </div>
        <Link href="/admin/services/new">
          <AdminButton size="md">+ Add Service</AdminButton>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-3">
                Service
              </th>
              <th className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-3">
                Slug
              </th>
              <th className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-3">
                Category
              </th>
              <th className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-3">
                Featured on Site
              </th>
              <th className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-3">
                Packages
              </th>
              <th className="text-right text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {service.icon && (
                      <span className="material-symbols-outlined text-[#c9a96e] text-lg">
                        {service.icon}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {service.title}
                      </p>
                      <p className="text-xs text-white/30 max-w-[200px] truncate">
                        {service.tagline}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <code className="text-xs text-white/40 bg-white/[0.04] px-2 py-1 rounded">
                    {service.slug}
                  </code>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-white/50">
                    {service.category || "—"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {service.isFeatured ? (
                    <span className="inline-block h-5 px-2 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[10px] font-bold text-[#c9a96e] uppercase tracking-wider leading-5">
                      Featured
                    </span>
                  ) : (
                    <span className="text-white/20 text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm text-white/50 tabular-nums">
                    {service.packages?.length || 0}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/services/${service.id}`}>
                      <AdminButton variant="ghost" size="sm">
                        Edit
                      </AdminButton>
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteService(service.id);
                      }}
                    >
                      <AdminButton variant="danger" size="sm" type="submit">
                        Delete
                      </AdminButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <p className="text-sm">No services yet.</p>
            <Link
              href="/admin/services/new"
              className="text-[#c9a96e] text-sm hover:underline mt-2 inline-block"
            >
              Create your first service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
