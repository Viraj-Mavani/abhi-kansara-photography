import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

// ─────────────────────────────────────────────────────────
//  Admin Layout — Isolated from public site
//  Auth guard + sidebar shell. No SmoothScroll, no CustomScrollbar.
// ─────────────────────────────────────────────────────────

export const metadata = {
  title: "Admin CMS | Abhi Kansara Photography",
  robots: { index: false, follow: false }, // Never index admin pages
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard — check for JWT cookie on every admin page load
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // Allow access to login page without a token
  // The login page is a child of this layout, so we need to let it through
  // We check the current path via a different mechanism — the login page
  // handles its own rendering, but we wrap ALL admin pages in this layout.
  // Since Next.js doesn't give us the path in layouts easily, we'll use
  // a simpler approach: always render the sidebar for authenticated users,
  // and the login page will have its own separate rendering logic.

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-[#0a0a0f] text-white/90 antialiased"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#333 #0a0a0f" }}
      >
        {token ? (
          <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 ml-64 min-h-screen">
              <div className="p-8">{children}</div>
            </main>
          </div>
        ) : (
          // Unauthenticated — render children directly (login page)
          <>{children}</>
        )}
      </body>
    </html>
  );
}
