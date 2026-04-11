import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCarouselItems } from "@/lib/api";
import CarouselManager from "@/components/admin/carousel/CarouselManager";

export default async function AdminCarouselPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const items = await getCarouselItems();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
          Carousel
        </h1>
        <p className="text-sm text-white/40">
          Manage landing page carousel items. Changes reflect immediately on the home page.
        </p>
      </div>

      <CarouselManager items={items} />
    </div>
  );
}
