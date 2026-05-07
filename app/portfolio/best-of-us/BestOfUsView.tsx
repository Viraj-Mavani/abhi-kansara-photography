"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MediaItem } from "@/lib/api";
import JustifiedGrid from "@/components/portfolio/JustifiedGrid";
import MediaViewer from "@/components/portfolio/MediaViewer";

export default function BestOfUsView({ initialPhotos }: { initialPhotos: MediaItem[] }) {
	const [viewerOpen, setViewerOpen] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(0);

	const handleItemClick = (index: number) => {
		setViewerIndex(index);
		setViewerOpen(true);
	};

	return (
		<>
			{/* Hero */}
			<section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-end px-6 sm:px-12 lg:px-20 pb-16 pt-40">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent-gold/3 blur-[150px]" />
				</div>

				<div className="relative z-10 max-w-5xl">
					<motion.span
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-accent-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold block mb-4"
					>
						Curated Collection
					</motion.span>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className="font-serif text-5xl sm:text-7xl lg:text-9xl text-slate-900 font-bold italic leading-[0.9] tracking-tight mb-6"
					>
						Best of Us
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed font-light"
					>
						The moments that stopped us in our tracks. A handpicked showcase of
						the photographs we're most proud of.
					</motion.p>

					{/* Quick nav tabs */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
						className="flex items-center gap-4 mt-8 flex-wrap"
					>
						<Link
							href="/portfolio/clients"
							className="px-5 py-2.5 rounded-full bg-black/5 border border-black/10 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:border-black/20 hover:text-black"
						>
							Client Galleries
						</Link>
						<Link
							href="/portfolio/best-of-us"
							className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-accent-gold hover:text-black"
						>
							Best of Us
						</Link>
						<Link
							href="/portfolio/cinematography"
							className="px-5 py-2.5 rounded-full bg-black/5 border border-black/10 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:border-black/20 hover:text-black"
						>
							Cinematography
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Justified Grid */}
			<section className="px-4 sm:px-8 lg:px-12 pb-20 sm:pb-32 pt-4">
				<JustifiedGrid items={initialPhotos} onItemClick={handleItemClick} />
			</section>

			{/* Lightbox */}
			<MediaViewer
				items={initialPhotos}
				initialIndex={viewerIndex}
				isOpen={viewerOpen}
				onClose={() => setViewerOpen(false)}
				galleryName="Best of Us"
			/>
		</>
	);
}
