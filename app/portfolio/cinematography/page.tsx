import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import CinematographyView from "./CinematographyView";

export const metadata: Metadata = {
	title: "Cinematography | Abhi Kansara Photography",
	description:
		"Experience our cinematic storytelling — curated highlight reels, wedding films, and editorial video content.",
};

import { getGalleries } from "@/lib/api";

export default async function CinematographyPage() {
  const galleries = await getGalleries();
  const videos = galleries
    .flatMap((g) => g.media)
    .filter((m) => m.type.toLowerCase() === "video");

  return (
    <main className="flex min-h-screen flex-col bg-accent-ivory text-black selection:bg-accent-gold selection:text-white">
      <Navigation />
      <BackButton />
      <CinematographyView initialVideos={videos} />
      <Footer />
    </main>
  );
}
