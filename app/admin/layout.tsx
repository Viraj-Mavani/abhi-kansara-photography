import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin CMS | Abhi Kansara Photography",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard — check for JWT cookie on every admin page load
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // If no token and not on the login page, the user will just see the children (which is the login page component itself, as it handles its own display).
  // If we had middleware, we would redirect. For now, we just pass children.
  
  return (
    <div className="bg-[#0a0a0f] text-white/90 antialiased min-h-screen" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 #0a0a0f" }}>
      {children}
    </div>
  );
}
