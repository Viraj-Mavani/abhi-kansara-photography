import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import { getGalleryBySlug, getGalleries } from "@/lib/api";
import GalleryView from "./GalleryView";

// Generate static params for all known gallery slugs
export async function generateStaticParams() {
	const galleries = await getGalleries();
	return galleries.map((g) => ({ clientSlug: g.slug }));
}

// Dynamic metadata
export async function generateMetadata({
	params,
}: {
	params: Promise<{ clientSlug: string }>;
}): Promise<Metadata> {
	const { clientSlug } = await params;
	const gallery = await getGalleryBySlug(clientSlug);
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
	const gallery = await getGalleryBySlug(clientSlug);

	if (!gallery) {
		notFound();
	}

	return (
		<main className="flex min-h-screen flex-col bg-accent-ivory text-black selection:bg-accent-gold selection:text-white">
			<Navigation />
			<BackButton />
			<GalleryView gallery={gallery} />
			<Footer />
		</main>
	);
}
