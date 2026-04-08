"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	Copy,
	Check,
	Smartphone,
	ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  Share Modal — Advanced Gallery Sharing
//  Copy link, mobile PWA link, social share
// ─────────────────────────────────────────────────────────

interface ShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	galleryName: string;
	gallerySlug: string;
}

const socialPlatforms = [
	{
		name: "WhatsApp",
		icon: "💬",
		getUrl: (url: string, text: string) =>
			`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
	},
	{
		name: "Facebook",
		icon: "📘",
		getUrl: (url: string) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
	},
	{
		name: "Twitter",
		icon: "🐦",
		getUrl: (url: string, text: string) =>
			`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
	},
	{
		name: "Pinterest",
		icon: "📌",
		getUrl: (url: string, text: string) =>
			`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
	},
	{
		name: "Email",
		icon: "✉️",
		getUrl: (url: string, text: string) =>
			`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check out this gallery: ${url}`)}`,
	},
];

export default function ShareModal({
	isOpen,
	onClose,
	galleryName,
	gallerySlug,
}: ShareModalProps) {
	const [copied, setCopied] = useState(false);
	const [mobileCopied, setMobileCopied] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
	const galleryUrl = `${baseUrl}/portfolio/clients/${gallerySlug}`;
	const mobileUrl = `${galleryUrl}?mobile=true`;
	const shareText = `Check out "${galleryName}" — captured by Abhi Kansara Photography`;

	// Close on escape
	useEffect(() => {
		if (!isOpen) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [isOpen, onClose]);

	// Close on outside click
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) onClose();
	};

	const copyToClipboard = async (text: string, type: "main" | "mobile") => {
		try {
			await navigator.clipboard.writeText(text);
			if (type === "main") {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} else {
				setMobileCopied(true);
				setTimeout(() => setMobileCopied(false), 2000);
			}
		} catch {
			// Fallback
			const ta = document.createElement("textarea");
			ta.value = text;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
		}
	};

	// Use native share API if available
	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: galleryName,
					text: shareText,
					url: galleryUrl,
				});
			} catch {
				// User cancelled share
			}
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-xl flex items-center justify-center px-4"
					onClick={handleBackdropClick}
				>
					<motion.div
						ref={modalRef}
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
						className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
					>
						{/* Close button */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
						>
							<X className="h-4 w-4" />
						</button>

						{/* Header */}
						<div className="mb-8">
							<span className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-bold block mb-2">
								Share Gallery
							</span>
							<h3 className="text-white text-xl sm:text-2xl font-serif italic">
								{galleryName}
							</h3>
						</div>

						{/* Copy Link */}
						<div className="space-y-3 mb-6">
							<label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold block">
								Gallery Link
							</label>
							<div className="flex gap-2">
								<div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm truncate font-mono">
									{galleryUrl}
								</div>
								<button
									onClick={() => copyToClipboard(galleryUrl, "main")}
									className={cn(
										"h-12 w-12 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0",
										copied
											? "bg-accent-gold/20 border-accent-gold/50 text-accent-gold"
											: "bg-white/5 border-white/10 text-white/60 hover:text-accent-gold hover:border-accent-gold/50"
									)}
								>
									{copied ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{/* Mobile Optimized Link */}
						<div className="space-y-3 mb-8">
							<label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
								<Smartphone className="h-3 w-3" />
								Mobile Home Screen Link
							</label>
							<div className="flex gap-2">
								<div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm truncate font-mono">
									{mobileUrl}
								</div>
								<button
									onClick={() => copyToClipboard(mobileUrl, "mobile")}
									className={cn(
										"h-12 w-12 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0",
										mobileCopied
											? "bg-accent-gold/20 border-accent-gold/50 text-accent-gold"
											: "bg-white/5 border-white/10 text-white/60 hover:text-accent-gold hover:border-accent-gold/50"
									)}
								>
									{mobileCopied ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</button>
							</div>
							<p className="text-white/25 text-[10px] leading-relaxed">
								Opens in a mobile-optimized view. Clients can add it to their
								home screen as an app.
							</p>
						</div>

						{/* Social Share Buttons */}
						<div className="space-y-3 mb-6">
							<label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold block">
								Share On
							</label>
							<div className="flex flex-wrap gap-2">
								{socialPlatforms.map((platform) => (
									<a
										key={platform.name}
										href={platform.getUrl(galleryUrl, shareText)}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider hover:border-accent-gold/50 hover:text-white transition-all duration-300"
									>
										<span>{platform.icon}</span>
										<span>{platform.name}</span>
									</a>
								))}
							</div>
						</div>

						{/* Native Share (mobile) */}
						{typeof navigator !== "undefined" && "share" in navigator && (
							<button
								onClick={handleNativeShare}
								className="w-full py-3 rounded-xl bg-accent-gold text-black text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-white transition-all duration-300"
							>
								<ExternalLink className="h-4 w-4" />
								Share via Device
							</button>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
