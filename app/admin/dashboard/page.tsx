import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getServices,
  getGalleries,
  getCarouselItems,
} from "@/lib/api";

// ─────────────────────────────────────────────────────────
//  Admin Dashboard — Stats Overview + Quick Actions
// ─────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  // Auth guard
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  if (!token) redirect("/admin/login");

  // Fetch live counts from the public API (no auth needed for reads)
  let servicesCount = 0;
  let galleriesCount = 0;
  let carouselCount = 0;

  try {
    const [services, galleries, carouselItems] = await Promise.all([
      getServices(),
      getGalleries(),
      getCarouselItems(),
    ]);
    servicesCount = services.length;
    galleriesCount = galleries.length;
    carouselCount = carouselItems.length;
  } catch {
    // API might be down — show zero counts
  }

  const stats = [
    {
      label: "Services",
      count: servicesCount,
      href: "/admin/services",
      icon: "📷",
      description: "Photography service offerings",
    },
    {
      label: "Galleries",
      count: galleriesCount,
      href: "/admin/galleries",
      icon: "🖼️",
      description: "Client project galleries",
    },
    {
      label: "Carousel",
      count: carouselCount,
      href: "/admin/carousel",
      icon: "🎠",
      description: "Landing page carousel items",
    },
  ];

  const quickActions = [
    { label: "Add Service", href: "/admin/services/new" },
    { label: "Add Gallery", href: "/admin/galleries/new" },
    { label: "Edit Bio", href: "/admin/site-config" },
  ];

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-white/40">
          Welcome back. Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#c9a96e]/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-3xl font-bold text-white/80 tabular-nums group-hover:text-[#c9a96e] transition-colors">
                {stat.count}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white/70 mb-0.5">
              {stat.label}
            </h3>
            <p className="text-xs text-white/30">{stat.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white/40 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#c9a96e]/8 border border-[#c9a96e]/15 text-sm font-medium text-[#c9a96e] hover:bg-[#c9a96e]/15 hover:border-[#c9a96e]/30 transition-all duration-200"
            >
              <span className="text-base">+</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white/40 mb-4">
          System
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/30">Frontend</span>
            <p className="text-white/60 font-medium">Next.js 16</p>
          </div>
          <div>
            <span className="text-white/30">Backend</span>
            <p className="text-white/60 font-medium">.NET 8.0</p>
          </div>
          <div>
            <span className="text-white/30">Database</span>
            <p className="text-white/60 font-medium">PostgreSQL</p>
          </div>
          <div>
            <span className="text-white/30">Storage</span>
            <p className="text-white/60 font-medium">Cloudflare R2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
