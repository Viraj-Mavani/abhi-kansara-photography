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

export default function BestOfUsPage() {
	return (
		<main className="flex min-h-screen flex-col bg-background text-foreground">
			<Navigation />
			<BackButton />
			<BestOfUsView />
			<Footer />
		</main>
	);
}
