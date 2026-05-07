"use client";

import { useState, useMemo } from "react";
import type { Gallery } from "@/lib/api";
import GalleryHeader from "@/components/portfolio/GalleryHeader";
import JustifiedGrid from "@/components/portfolio/JustifiedGrid";
import MediaViewer from "@/components/portfolio/MediaViewer";
import ShareModal from "@/components/portfolio/ShareModal";

// ─────────────────────────────────────────────────────────
//  Gallery View — Full Client Gallery Experience
//  Cover hero → Action bar → Justified photos → Videos
// ─────────────────────────────────────────────────────────

interface GalleryViewProps {
	gallery: Gallery;
}

export default function GalleryView({ gallery }: GalleryViewProps) {
	const [viewerOpen, setViewerOpen] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(0);
	const [isSlideshowMode, setIsSlideshowMode] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);

	// Separate photos and videos
	const photos = useMemo(
		() => gallery.media.filter((m) => m.type.toLowerCase() === "photo"),
		[gallery.media]
	);
	const videos = useMemo(
		() => gallery.media.filter((m) => m.type.toLowerCase() === "video"),
		[gallery.media]
	);

	// Combined list for the viewer (photos first, then videos)
	const allMedia = useMemo(() => [...photos, ...videos], [photos, videos]);

	const handlePhotoClick = (index: number) => {
		// Index is relative to photos array — same position in allMedia
		setIsSlideshowMode(false);
		setViewerIndex(index);
		setViewerOpen(true);
	};

	const handleVideoClick = (index: number) => {
		// Videos start after all photos in allMedia
		setIsSlideshowMode(false);
		setViewerIndex(photos.length + index);
		setViewerOpen(true);
	};

	const handleSlideshowStart = () => {
		setIsSlideshowMode(true);
		setViewerIndex(0);
		setViewerOpen(true);
	};

	const breadcrumbs = [
		{ label: "Portfolio", href: "/portfolio/clients" },
		{ label: "Clients", href: "/portfolio/clients" },
		{ label: gallery.clientName, href: `/portfolio/clients/${gallery.slug}` },
	];

	return (
		<>
			{/* Hero */}
			<GalleryHeader
				title={gallery.clientName}
				subtitle={gallery.category}
				coverPhotoUrl={gallery.coverPhotoUrl}
				breadcrumbs={breadcrumbs}
				onShareClick={() => setShareOpen(true)}
				onSlideshowClick={handleSlideshowStart}
				date={gallery.date}
				location={gallery.location}
			/>

			{/* Photo Grid */}
			{photos.length > 0 && (
				<section className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
					<JustifiedGrid items={photos} onItemClick={handlePhotoClick} />
				</section>
			)}

			{/* Subtle divider between photos and videos */}
			{photos.length > 0 && videos.length > 0 && (
				<div className="flex items-center justify-center py-12 sm:py-16 px-8 sm:px-20">
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
					<div className="mx-6 h-1.5 w-1.5 rounded-full bg-accent-gold/40" />
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
				</div>
			)}

			{/* Video Grid */}
			{videos.length > 0 && (
				<section className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
					<JustifiedGrid items={videos} onItemClick={handleVideoClick} />
				</section>
			)}

			{/* Lightbox Viewer */}
			<MediaViewer
				items={allMedia}
				initialIndex={viewerIndex}
				isOpen={viewerOpen}
				autoStartSlideshow={isSlideshowMode}
				onClose={() => setViewerOpen(false)}
				onShare={() => {
					setViewerOpen(false);
					setShareOpen(true);
				}}
				galleryName={gallery.clientName}
			/>

			{/* Share Modal */}
			<ShareModal
				isOpen={shareOpen}
				onClose={() => setShareOpen(false)}
				galleryName={gallery.clientName}
				gallerySlug={gallery.slug}
			/>
		</>
	);
}
