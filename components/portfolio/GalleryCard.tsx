"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Gallery } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  Gallery Card — Used on the Clients Hub Page
// ─────────────────────────────────────────────────────────

interface GalleryCardProps {
	gallery: Gallery;
	index: number;
}

export default function GalleryCard({ gallery, index }: GalleryCardProps) {
	const photoCount = gallery.media.filter((m) => m.type === "photo").length;
	const videoCount = gallery.media.filter((m) => m.type === "video").length;

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{
				duration: 0.7,
				delay: index * 0.1,
				ease: [0.16, 1, 0.3, 1],
			}}
		>
			<Link
				href={`/portfolio/clients/${gallery.slug}`}
				className="group block relative overflow-hidden rounded-sm"
			>
				{/* Image */}
				<div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
					<Image
						src={gallery.coverPhotoUrl}
						alt={gallery.clientName}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
						loading="lazy"
					/>

					{/* Hover gradient */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

					{/* Hover border glow */}
					<div className="absolute inset-0 border border-white/0 group-hover:border-accent-gold/30 transition-all duration-700 rounded-sm" />
				</div>

				{/* Content overlay */}
				<div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
					{/* Category tag */}
					<motion.span
						className="text-accent-gold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold block mb-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
					>
						{gallery.category}
					</motion.span>

					{/* Client name */}
					<h3 className="font-serif text-xl sm:text-2xl text-white font-semibold italic leading-tight mb-2 group-hover:text-accent-ivory transition-colors duration-500">
						{gallery.clientName}
					</h3>

					{/* Meta row */}
					<div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
						{photoCount > 0 && (
							<span className="text-white/50 text-[10px] uppercase tracking-wider font-bold">
								{photoCount} Photos
							</span>
						)}
						{photoCount > 0 && videoCount > 0 && (
							<span className="h-3 w-px bg-white/20" />
						)}
						{videoCount > 0 && (
							<span className="text-white/50 text-[10px] uppercase tracking-wider font-bold">
								{videoCount} {videoCount === 1 ? "Film" : "Films"}
							</span>
						)}
					</div>

					{/* View indicator line */}
					<div className="mt-4 h-px bg-accent-gold/0 group-hover:bg-accent-gold/60 transition-all duration-700 scale-x-0 group-hover:scale-x-100 origin-left" />
				</div>
			</Link>
		</motion.div>
	);
}
