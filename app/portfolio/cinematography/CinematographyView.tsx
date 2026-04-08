"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { getCuratedVideos } from "@/lib/portfolio";
import MediaViewer from "@/components/portfolio/MediaViewer";

export default function CinematographyView() {
	const videos = getCuratedVideos();
	const [viewerOpen, setViewerOpen] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(0);

	const handleVideoClick = (index: number) => {
		setViewerIndex(index);
		setViewerOpen(true);
	};

	return (
		<>
			{/* Hero */}
			<section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-end px-6 sm:px-12 lg:px-20 pb-16 pt-32">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-accent-gold/3 blur-[150px]" />
				</div>

				<div className="relative z-10 max-w-5xl">
					<motion.span
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-accent-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold block mb-4"
					>
						Motion Pictures
					</motion.span>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className="font-serif text-5xl sm:text-7xl lg:text-9xl text-white font-bold italic leading-[0.9] tracking-tight mb-6"
					>
						Cinematography
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="text-white/40 text-sm sm:text-base max-w-xl leading-relaxed font-light"
					>
						Stories that move — cinematic highlight reels and editorial films
						that capture the essence of every celebration.
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
							className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:border-accent-gold/30 hover:text-accent-gold"
						>
							Client Galleries
						</Link>
						<Link
							href="/portfolio/best-of-us"
							className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:border-accent-gold/30 hover:text-accent-gold"
						>
							Best of Us
						</Link>
						<Link
							href="/portfolio/cinematography"
							className="px-5 py-2.5 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-accent-gold hover:text-black"
						>
							Cinematography
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Video Cards Grid */}
			<section className="px-4 sm:px-8 lg:px-12 pb-20 sm:pb-32 pt-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{videos.map((video, idx) => (
						<motion.div
							key={video.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{
								duration: 0.7,
								delay: idx * 0.1,
								ease: [0.16, 1, 0.3, 1],
							}}
							onClick={() => handleVideoClick(idx)}
							className="group cursor-pointer relative overflow-hidden rounded-sm"
						>
							<div
								className="relative overflow-hidden"
								style={{
									aspectRatio: `${video.width} / ${video.height}`,
								}}
							>
								<Image
									src={video.posterUrl || video.url}
									alt={video.alt || "Video"}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
									loading="lazy"
								/>

								{/* Gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

								{/* Play button */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-accent-gold group-hover:border-accent-gold group-hover:scale-110">
										<Play className="h-7 w-7 sm:h-8 sm:w-8 text-white fill-white ml-1 transition-colors group-hover:text-black group-hover:fill-black" />
									</div>
								</div>

								{/* Duration */}
								{video.duration && (
									<span className="absolute bottom-4 right-4 text-[11px] font-mono tracking-wider bg-black/60 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full">
										{video.duration}
									</span>
								)}

								{/* Hover border glow */}
								<div className="absolute inset-0 border border-white/0 group-hover:border-accent-gold/30 transition-all duration-700 rounded-sm" />
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Lightbox */}
			<MediaViewer
				items={videos}
				initialIndex={viewerIndex}
				isOpen={viewerOpen}
				onClose={() => setViewerOpen(false)}
				galleryName="Cinematography"
			/>
		</>
	);
}
