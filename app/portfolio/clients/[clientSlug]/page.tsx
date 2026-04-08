import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import { getGalleryBySlug, getAllGallerySlugs } from "@/lib/portfolio";
import GalleryView from "./GalleryView";

// Generate static params for all known gallery slugs
export function generateStaticParams() {
	return getAllGallerySlugs();
}

// Dynamic metadata
export async function generateMetadata({
	params,
}: {
	params: Promise<{ clientSlug: string }>;
}): Promise<Metadata> {
	const { clientSlug } = await params;
	const gallery = getGalleryBySlug(clientSlug);
	if (!gallery) {
		return { title: "Gallery Not Found | Abhi Kansara Photography" };
	}
	return {
		title: `${gallery.clientName} | Abhi Kansara Photography`,
		description:
			gallery.description ||
			`View the ${gallery.category} gallery for ${gallery.clientName} — captured by Abhi Kansara Photography.`,
	};
}

export default async function GalleryPage({
	params,
}: {
	params: Promise<{ clientSlug: string }>;
}) {
	const { clientSlug } = await params;
	const gallery = getGalleryBySlug(clientSlug);

	if (!gallery) {
		notFound();
	}

	return (
		<main className="flex min-h-screen flex-col bg-background text-foreground">
			<Navigation />
			<BackButton />
			<GalleryView gallery={gallery} />
			<Footer />
		</main>
	);
}
