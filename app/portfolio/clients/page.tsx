import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import ClientsHub from "./ClientsHub";

export const metadata: Metadata = {
	title: "Works | Abhi Kansara Photography",
	description:
		"Explore our curated portfolio of client galleries — Weddings, Pre-Weddings, Events, Baby Showers, and more. View the artistry behind every celebration.",
};

export default function PortfolioClientsPage() {
	return (
		<main className="flex min-h-screen flex-col bg-background text-foreground">
			<Navigation />
			<BackButton />
			<ClientsHub />
			<Footer />
		</main>
	);
}
