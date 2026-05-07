"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { GalleryCategory } from "@/lib/api";
import type { PageConfig, Gallery } from "@/lib/api";
import CategorySection from "@/components/portfolio/CategorySection";

// ─────────────────────────────────────────────────────────
//  Clients Hub — Grouped Category View
// ─────────────────────────────────────────────────────────

/** Enforced display order for categories */
const categoryOrder: GalleryCategory[] = [
	"Wedding",
	"Pre-Wedding",
	"Baby Shower",
	"Event",
	"Product",
	"Editorial",
	"Portrait",
];

export default function ClientsHub({ galleries, pageConfig }: { galleries: Gallery[], pageConfig: PageConfig }) {
	const grouped = galleries.reduce((acc, gallery) => {
		if (!acc[gallery.category]) acc[gallery.category] = [];
		acc[gallery.category].push(gallery);
		return acc;
	}, {} as Record<string, Gallery[]>);

	return (
		<>
			{/* Hero Section */}
			<section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-end px-6 sm:px-12 lg:px-20 pb-16 pt-40">
				{/* Background pattern */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-gold/3 blur-[150px]" />
					<div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent-gold/5 blur-[120px]" />
				</div>

				<div className="relative z-10 max-w-5xl">
					<motion.span
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-accent-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold block mb-4"
					>
						{pageConfig?.heroTagline}
					</motion.span>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.3,
							ease: [0.16, 1, 0.3, 1],
						}}
						className="font-serif text-5xl sm:text-7xl lg:text-9xl text-slate-900 font-bold italic leading-[0.9] tracking-tight mb-6"
					>
						{pageConfig?.heroTitle}
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed font-light"
					>
						{pageConfig?.heroSubtitle}
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
							className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-accent-gold hover:text-black"
						>
							Client Galleries
						</Link>
						<Link
							href="/portfolio/best-of-us"
							className="px-5 py-2.5 rounded-full bg-black/5 border border-black/10 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:border-black/20 hover:text-black"
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

			{/* Category Sections */}
			<section className="px-6 sm:px-12 lg:px-20 pb-20">
				{categoryOrder
					.filter((cat) => grouped[cat]?.length > 0)
					.map((category, idx) => (
						<CategorySection
							key={category}
							category={category}
							galleries={grouped[category]}
							index={idx}
						/>
					))}
			</section>
		</>
	);
}
