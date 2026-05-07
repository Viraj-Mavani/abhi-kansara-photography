import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminCoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // If not authenticated, we shouldn't show the sidebar.
  // The login page is outside of (core), so this layout won't even render for /admin/login.
  // But just in case any unauthenticated user hits a core route, we hide the sidebar.
  if (!token) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
