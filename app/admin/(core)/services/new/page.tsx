import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ServiceForm from "@/components/admin/services/ServiceForm";

export default async function NewServicePage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  return <ServiceForm />;
}
