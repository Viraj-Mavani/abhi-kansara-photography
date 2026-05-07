import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import ClientsHub from "./ClientsHub";
import { getGalleries, getPageConfig } from "@/lib/api";

export const metadata: Metadata = {
	title: "Works | Abhi Kansara Photography",
	description:
		"Explore our curated portfolio of client galleries — Weddings, Pre-Weddings, Events, Baby Showers, and more. View the artistry behind every celebration.",
};

export default async function PortfolioClientsPage() {
	const galleries = await getGalleries();
	const pageConfig = await getPageConfig('portfolio'); // Need to confirm this pageKey

	return (
		<main className="flex min-h-screen flex-col bg-accent-ivory text-black selection:bg-accent-gold selection:text-white">
			<Navigation />
			<BackButton />
			<ClientsHub galleries={galleries} pageConfig={pageConfig} />
			<Footer />
		</main>
	);
}
