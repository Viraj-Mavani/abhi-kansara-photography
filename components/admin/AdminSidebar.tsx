"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Images,
  SlidersHorizontal,
  Settings,
  LogOut,
  GalleryHorizontalEnd,
} from "lucide-react";
import { useState } from "react";

// ─────────────────────────────────────────────────────────
//  AdminSidebar — Fixed sidebar for the CMS dashboard
//  Dark background, gold accents, matching public site palette
// ─────────────────────────────────────────────────────────

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Manager", icon: GalleryHorizontalEnd },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/galleries", label: "Galleries", icon: Images },
  { href: "/admin/carousel", label: "Carousel", icon: GalleryHorizontalEnd },
  { href: "/admin/site-config", label: "Site Config", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col bg-[#07070a] border-r border-white/[0.06]">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
        <div className="h-8 w-8 rounded-lg bg-[#c9a96e]/15 flex items-center justify-center">
          <SlidersHorizontal className="h-4 w-4 text-[#c9a96e]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white/90 tracking-wide">
            Admin CMS
          </h1>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
            Abhi Kansara
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/15"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
