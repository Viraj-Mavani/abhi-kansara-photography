"use client";

import { motion } from "framer-motion";
import type { Gallery, GalleryCategory } from "@/lib/portfolio";
import GalleryCard from "./GalleryCard";

// ─────────────────────────────────────────────────────────
//  Category Section — Groups galleries by category
//  e.g. "Weddings" section containing wedding galleries
// ─────────────────────────────────────────────────────────

interface CategorySectionProps {
	category: GalleryCategory;
	galleries: Gallery[];
	index: number;
}

export default function CategorySection({
	category,
	galleries,
	index,
}: CategorySectionProps) {
	if (galleries.length === 0) return null;

	return (
		<section className="mb-20 sm:mb-28">
			{/* Category Header */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true, margin: "-50px" }}
				transition={{ duration: 0.7, delay: 0.1 }}
				className="mb-8 sm:mb-12 flex items-end gap-4"
			>
				<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold italic tracking-tight leading-none">
					{category}
				</h2>
				<div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent mb-2" />
				<span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
					{galleries.length} {galleries.length === 1 ? "Gallery" : "Galleries"}
				</span>
			</motion.div>

			{/* Gallery Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{galleries.map((gallery, idx) => (
					<GalleryCard
						key={gallery.id}
						gallery={gallery}
						index={idx}
					/>
				))}
			</div>
		</section>
	);
}
