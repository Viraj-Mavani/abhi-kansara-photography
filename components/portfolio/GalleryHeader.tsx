"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Share2, Play, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  Gallery Header — Cover Photo Hero + Breadcrumbs + Actions
// ─────────────────────────────────────────────────────────

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface GalleryHeaderProps {
	title: string;
	subtitle?: string;
	coverPhotoUrl: string;
	breadcrumbs: BreadcrumbItem[];
	onShareClick: () => void;
	onSlideshowClick: () => void;
	date?: string;
	location?: string;
}

export default function GalleryHeader({
	title,
	subtitle,
	coverPhotoUrl,
	breadcrumbs,
	onShareClick,
	onSlideshowClick,
	date,
	location,
}: GalleryHeaderProps) {
	const formattedDate = date
		? new Date(date).toLocaleDateString("en-US", {
				month: "long",
				year: "numeric",
		  })
		: null;

	return (
		<section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
			{/* Cover Photo */}
			<Image
				src={coverPhotoUrl}
				alt={title}
				fill
				className="object-cover"
				quality={85}
				priority
			/>

			{/* Gradient overlays */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
			<div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

			{/* Content */}
			<div className="absolute inset-0 flex flex-col justify-start px-6 sm:px-12 lg:px-20 py-8 sm:py-12">
				{/* Breadcrumbs */}
				<motion.nav
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex items-center gap-2 mt-32 sm:mt-28"
				>
					{breadcrumbs.map((crumb, idx) => (
						<span key={`${crumb.href}-${idx}`} className="flex items-center gap-2">
							<Link
								href={crumb.href}
								className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold hover:text-accent-gold transition-colors duration-300"
							>
								{crumb.label}
							</Link>
							{idx < breadcrumbs.length - 1 && (
								<ChevronRight className="h-3 w-3 text-white/30" />
							)}
						</span>
					))}
				</motion.nav>

				{/* Title, Meta + Actions */}
				<div className="flex flex-col gap-6 mt-20 sm:mt-28">
					<div>
						{/* Category / Subtitle */}
						{subtitle && (
							<motion.span
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
								className="text-accent-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold block mb-3"
							>
								{subtitle}
							</motion.span>
						)}

						{/* Client Name */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
							className="font-serif text-4xl sm:text-6xl lg:text-8xl text-white font-bold italic leading-[0.9] tracking-tight"
						>
							{title}
						</motion.h1>

						{/* Date & Location */}
						{(formattedDate || location) && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.6 }}
								className="flex items-center gap-4 mt-4"
							>
								{formattedDate && (
									<span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold">
										{formattedDate}
									</span>
								)}
								{formattedDate && location && (
									<span className="h-3 w-px bg-white/20" />
								)}
								{location && (
									<span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold">
										{location}
									</span>
								)}
							</motion.div>
						)}
					</div>

					{/* Action Bar */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
						className="flex items-center gap-3"
					>
						<button
							onClick={onShareClick}
							className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent-gold hover:text-black hover:border-accent-gold transition-all duration-500 group"
						>
							<Share2 className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
							<span>Share Gallery</span>
						</button>
						<button
							onClick={onSlideshowClick}
							className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent-gold hover:text-black hover:border-accent-gold transition-all duration-500 group"
						>
							<Play className="h-3.5 w-3.5 fill-current transition-transform group-hover:scale-110" />
							<span>Slideshow</span>
						</button>
					</motion.div>
				</div>
			</div>

			{/* Bottom fade for smooth transition to content */}
			<div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-accent-ivory to-transparent pointer-events-none" />
		</section>
	);
}
