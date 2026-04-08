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

export default function CinematographyPage() {
	return (
		<main className="flex min-h-screen flex-col bg-background text-foreground">
			<Navigation />
			<BackButton />
			<CinematographyView />
			<Footer />
		</main>
	);
}
