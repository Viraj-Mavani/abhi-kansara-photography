import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getServices } from "@/lib/api";
import ServiceForm from "@/components/admin/services/ServiceForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const { id } = await params;
  const services = await getServices();
  const service = services.find((s) => s.id === id);

  if (!service) notFound();

  return <ServiceForm initialData={service} />;
}
