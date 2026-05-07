"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { Gallery } from "@/lib/api";
import GalleryHeader from "@/components/portfolio/GalleryHeader";
import JustifiedGrid from "@/components/portfolio/JustifiedGrid";
import MediaViewer from "@/components/portfolio/MediaViewer";
import ShareModal from "@/components/portfolio/ShareModal";

// ─────────────────────────────────────────────────────────
//  Gallery View — Full Client Gallery Experience
//  Cover hero → Action bar → Justified photos → Videos
//  Implements infinite scroll: 30 photos per page
// ─────────────────────────────────────────────────────────

const PAGE_SIZE = 30;

interface GalleryViewProps {
	gallery: Gallery;
}

export default function GalleryView({ gallery }: GalleryViewProps) {
	const [viewerOpen, setViewerOpen] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(0);
	const [isSlideshowMode, setIsSlideshowMode] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	// Separate photos and videos
	const photos = useMemo(
		() => gallery.media.filter((m) => m.type.toLowerCase() === "photo"),
		[gallery.media]
	);
	const videos = useMemo(
		() => gallery.media.filter((m) => m.type.toLowerCase() === "video"),
		[gallery.media]
	);

	// Visible slice of photos (infinite scroll)
	const visiblePhotos = useMemo(
		() => photos.slice(0, visibleCount),
		[photos, visibleCount]
	);
	const hasMorePhotos = visibleCount < photos.length;

	// Combined list for the viewer (full arrays — viewer always has all items)
	const allMedia = useMemo(() => [...photos, ...videos], [photos, videos]);

	// ── IntersectionObserver sentinel ──────────────────────────
	const sentinelRef = useRef<HTMLDivElement>(null);

	const loadMore = useCallback(() => {
		setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, photos.length));
	}, [photos.length]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMorePhotos) {
					loadMore();
				}
			},
			{ rootMargin: "300px" } // pre-load 300px before the bottom
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMorePhotos, loadMore]);

	// ── Click handlers ─────────────────────────────────────────
	const handlePhotoClick = (index: number) => {
		setIsSlideshowMode(false);
		setViewerIndex(index);
		setViewerOpen(true);
	};

	const handleVideoClick = (index: number) => {
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
				date={gallery.date || gallery.shootDate}
				location={gallery.location}
			/>

			{/* Photo Grid */}
			{photos.length > 0 && (
				<section className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
					<JustifiedGrid items={visiblePhotos} onItemClick={handlePhotoClick} />

					{/* Infinite scroll sentinel */}
					<div ref={sentinelRef} className="h-1" aria-hidden />

					{/* Loading shimmer indicator */}
					{hasMorePhotos && (
						<div className="flex items-center justify-center gap-3 py-10">
							<div className="h-px w-12 bg-gradient-to-r from-transparent to-accent-gold/40" />
							<div className="flex gap-1.5">
								{[0, 1, 2].map((i) => (
									<div
										key={i}
										className="h-1 w-1 rounded-full bg-accent-gold/50 animate-pulse"
										style={{ animationDelay: `${i * 150}ms` }}
									/>
								))}
							</div>
							<div className="h-px w-12 bg-gradient-to-l from-transparent to-accent-gold/40" />
						</div>
					)}

					{/* All photos loaded indicator */}
					{!hasMorePhotos && photos.length > PAGE_SIZE && (
						<div className="flex items-center justify-center gap-3 py-10">
							<div className="h-px w-16 bg-white/[0.06]" />
							<span className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-bold">
								{photos.length} photos
							</span>
							<div className="h-px w-16 bg-white/[0.06]" />
						</div>
					)}
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
