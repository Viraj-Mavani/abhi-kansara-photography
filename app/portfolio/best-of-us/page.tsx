import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import BestOfUsView from "./BestOfUsView";

export const metadata: Metadata = {
	title: "Best of Us | Abhi Kansara Photography",
	description:
		"A curated selection of our finest photographs — the moments that define our craft and passion for visual storytelling.",
};

import { getFeaturedGalleries } from "@/lib/api";

export default async function BestOfUsPage() {
  const featuredGalleries = await getFeaturedGalleries();
  const photos = featuredGalleries
    .flatMap((g) => g.media)
    .filter((m) => m.type.toLowerCase() === "photo");

  return (
    <main className="flex min-h-screen flex-col bg-accent-ivory text-black selection:bg-accent-gold selection:text-white">
      <Navigation />
      <BackButton />
      <BestOfUsView initialPhotos={photos} />
      <Footer />
    </main>
  );
}
