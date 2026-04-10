"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { MediaItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  Justified Grid — Mathematical Row-Aligned Layout
//  Rows fill container width perfectly. Lightweight math.
// ─────────────────────────────────────────────────────────

interface JustifiedGridProps {
	items: MediaItem[];
	onItemClick: (index: number) => void;
	className?: string;
}

interface JustifiedRow {
	items: (MediaItem & { rowIndex: number })[];
	height: number;
}

/**
 * Compute justified rows: for a given container width and target row height,
 * greedily pack items into rows, scaling them to fill each row exactly.
 */
function computeRows(
	items: MediaItem[],
	containerWidth: number,
	targetRowHeight: number,
	gap: number
): JustifiedRow[] {
	if (containerWidth <= 0 || items.length === 0) return [];

	const rows: JustifiedRow[] = [];
	let currentRow: (MediaItem & { rowIndex: number })[] = [];
	let currentAspectSum = 0;
	let globalIndex = 0;

	for (const item of items) {
		const aspect = item.width / item.height;
		currentRow.push({ ...item, rowIndex: globalIndex });
		currentAspectSum += aspect;
		globalIndex++;

		// The row's total scaled width at targetRowHeight
		const totalGap = (currentRow.length - 1) * gap;
		const rowWidth = currentAspectSum * targetRowHeight + totalGap;

		if (rowWidth >= containerWidth) {
			// This row is full — compute actual height to perfectly fill width
			const actualHeight =
				(containerWidth - totalGap) / currentAspectSum;
			rows.push({ items: [...currentRow], height: actualHeight });
			currentRow = [];
			currentAspectSum = 0;
		}
	}

	// Last incomplete row — use target height (don't stretch)
	if (currentRow.length > 0) {
		const height = Math.min(
			targetRowHeight,
			(containerWidth - (currentRow.length - 1) * gap) / currentAspectSum
		);
		rows.push({ items: currentRow, height });
	}

	return rows;
}

export default function JustifiedGrid({
	items,
	onItemClick,
	className,
}: JustifiedGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	// Responsive target row height
	const targetRowHeight = useMemo(() => {
		if (containerWidth < 640) return 200;
		if (containerWidth < 1024) return 280;
		return 340;
	}, [containerWidth]);

	const gap = containerWidth < 640 ? 4 : 6;

	// Observe container width
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setContainerWidth(entry.contentRect.width);
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const rows = useMemo(
		() => computeRows(items, containerWidth, targetRowHeight, gap),
		[items, containerWidth, targetRowHeight, gap]
	);

	const handleClick = useCallback(
		(index: number) => {
			onItemClick(index);
		},
		[onItemClick]
	);

	return (
		<div ref={containerRef} className={cn("w-full", className)}>
			{rows.map((row, rowIdx) => (
				<div
					key={rowIdx}
					className="flex"
					style={{ gap, marginBottom: gap }}
				>
					{row.items.map((item) => {
						const aspect = item.width / item.height;
						const itemWidth = aspect * row.height;

						return (
							<motion.div
								key={item.id}
								layoutId={`media-${item.id}`}
								className="relative overflow-hidden cursor-pointer group"
								style={{
									width: itemWidth,
									height: row.height,
									flexShrink: 0,
								}}
								onClick={() => handleClick(item.rowIndex)}
								transition={{
									scale: { duration: 0.3, ease: "easeOut" },
									layout: {
										duration: 0.5,
										ease: [0.16, 1, 0.3, 1],
									},
								}}
							>
								{item.type.toLowerCase() === "photo" ? (
									<Image
										src={item.url}
										alt={item.alt || ""}
										fill
										sizes={`${Math.round(itemWidth)}px`}
										className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
										loading="lazy"
									/>
								) : (
									<>
										<Image
											src={item.posterUrl || item.url}
											alt={item.alt || "Video"}
											fill
											sizes={`${Math.round(itemWidth)}px`}
											className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
											loading="lazy"
										/>
										{/* Video indicator */}
										<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
											<div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all duration-500 group-hover:bg-accent-gold group-hover:border-accent-gold group-hover:scale-110">
												<Play className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white ml-0.5 transition-colors group-hover:text-black group-hover:fill-black" />
											</div>
										</div>
										{/* Duration badge */}
										{item.duration && (
											<span className="absolute bottom-2 right-2 text-[10px] font-mono tracking-wider bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-full">
												{item.duration}
											</span>
										)}
									</>
								)}

								{/* Hover gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
							</motion.div>
						);
					})}
				</div>
			))}
		</div>
	);
}
