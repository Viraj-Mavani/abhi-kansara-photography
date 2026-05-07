"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";
import {
	X,
	ChevronLeft,
	ChevronRight,
	Maximize,
	Minimize,
	Play,
	Pause,
	Download,
	Share2,
	Volume2,
	VolumeX,
} from "lucide-react";
import type { MediaItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useOverlay } from "@/hooks/useOverlay";

// ─────────────────────────────────────────────────────────
//  Premium Media Viewer — Unified Lightbox
//  Handles photos + videos with full controls
// ─────────────────────────────────────────────────────────

interface MediaViewerProps {
	items: MediaItem[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
	onShare?: () => void;
	galleryName?: string;
	autoStartSlideshow?: boolean;
}

export default function MediaViewer({
	items,
	initialIndex,
	isOpen,
	onClose,
	onShare,
	galleryName,
	autoStartSlideshow,
}: MediaViewerProps) {
	const [[page, direction], setPage] = useState([initialIndex, 0]);
	const [isNavigating, setIsNavigating] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isSlideshow, setIsSlideshow] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [isMuted, setIsMuted] = useState(true);
	const [volume, setVolume] = useState(0.5);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [videoProgress, setVideoProgress] = useState(0);
	const [videoDuration, setVideoDuration] = useState(0);
	const [videoBuffered, setVideoBuffered] = useState(0);
	const [showVolumeSlider, setShowVolumeSlider] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const slideshowTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const currentIndex = page;
	const currentItem = items[currentIndex];
	const isVideo = currentItem?.type?.toLowerCase() === "video";

	// Reset index when opening
	useEffect(() => {
		if (isOpen) {
			setPage([initialIndex, 0]);
			setIsNavigating(false);
			setIsClosing(false);
			setShowControls(true);
			
			// Reset video state for new session
			setVideoProgress(0);
			setVideoDuration(0);
			setVideoBuffered(0);

			if (autoStartSlideshow) {
				setIsSlideshow(true);
			} else {
				setIsSlideshow(false);
			}
		}
	}, [isOpen, initialIndex, autoStartSlideshow]);

	// Reset video state when item changes manually
	useEffect(() => {
		setVideoProgress(0);
		setVideoDuration(0);
		setVideoBuffered(0);
		setIsVideoPlaying(false);
	}, [currentIndex]);

	// Auto-hide controls after inactivity
	const resetControlsTimer = useCallback(() => {
		setShowControls(true);
		if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
		controlsTimerRef.current = setTimeout(() => {
			if (isVideoPlaying || isSlideshow) setShowControls(false);
		}, 3000);
	}, [isVideoPlaying, isSlideshow]);

	// Slideshow timer
	useEffect(() => {
		if (isSlideshow && !isVideo) {
			slideshowTimerRef.current = setTimeout(() => {
				goNext();
			}, 4000);
		}
		return () => {
			if (slideshowTimerRef.current) clearTimeout(slideshowTimerRef.current);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSlideshow, currentIndex, isVideo]);

	// Video autoplay when navigating to a video
	useEffect(() => {
		if (isVideo && videoRef.current && isOpen) {
			videoRef.current.muted = isMuted;
			videoRef.current.volume = volume;
			videoRef.current.play().then(() => {
				setIsVideoPlaying(true);
			}).catch(() => {
				// Autoplay blocked — keep muted
				if (videoRef.current) {
					videoRef.current.muted = true;
					setIsMuted(true);
					videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
				}
			});
		}
		if (!isVideo) {
			setIsVideoPlaying(false);
			setVideoProgress(0);
			setVideoDuration(0);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentIndex, isOpen, isVideo]);

	// Keyboard controls
	useEffect(() => {
		if (!isOpen) return;
		const handleKey = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowLeft":
					goPrev();
					break;
				case "ArrowRight":
					goNext();
					break;
				case " ":
					e.preventDefault();
					if (isVideo) toggleVideoPlay();
					else setIsSlideshow((s) => !s);
					break;
				case "f":
					toggleFullscreen();
					break;
				case "m":
					setIsMuted((m) => !m);
					break;
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, currentIndex, isVideo, isVideoPlaying]);

	// Touch swipe support
	const touchStartX = useRef(0);
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const handleTouchEnd = (e: React.TouchEvent) => {
		const diff = touchStartX.current - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 60) {
			if (diff > 0) goNext();
			else goPrev();
		}
	};

	const goNext = useCallback(() => {
		setIsNavigating(true);
		setPage([ (currentIndex + 1) % items.length, 1]);
	}, [currentIndex, items.length]);

	const goPrev = useCallback(() => {
		setIsNavigating(true);
		setPage([ (currentIndex - 1 + items.length) % items.length, -1]);
	}, [currentIndex, items.length]);

	const handleClose = useCallback(() => {
		setIsClosing(true);
		onClose();
	}, [onClose]);

	// Unified Overlay logic (Scroll Lock, Esc Key, Back Button)
	useOverlay(isOpen, handleClose);

	const toggleVideoPlay = () => {
		if (!videoRef.current) return;
		if (isVideoPlaying) {
			videoRef.current.pause();
			setIsVideoPlaying(false);
		} else {
			videoRef.current.play();
			setIsVideoPlaying(true);
		}
	};

	const toggleFullscreen = async () => {
		if (!containerRef.current) return;
		if (!document.fullscreenElement) {
			await containerRef.current.requestFullscreen();
			setIsFullscreen(true);
		} else {
			await document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	const handleVolumeChange = (val: number) => {
		setVolume(val);
		setIsMuted(val === 0);
		if (videoRef.current) {
			videoRef.current.volume = val;
			videoRef.current.muted = val === 0;
		}
	};

	const toggleMute = () => {
		const newMuted = !isMuted;
		setIsMuted(newMuted);
		if (videoRef.current) {
			videoRef.current.muted = newMuted;
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = Number(e.target.value);
		if (videoRef.current) {
			videoRef.current.currentTime = time;
			setVideoProgress(time);
		}
	};

	const handleVideoProgress = (e?: React.SyntheticEvent<HTMLVideoElement, Event>) => {
		const video = e ? e.currentTarget : videoRef.current;
		if (video && video.buffered.length > 0) {
			const bufferedEnd = video.buffered.end(video.buffered.length - 1);
			const duration = video.duration;
			if (duration > 0 && duration !== Infinity && !isNaN(duration)) {
				setVideoBuffered((bufferedEnd / duration) * 100);
			}
		}
	};

	const handleDownload = () => {
		const url = currentItem.url;
		const a = document.createElement("a");
		a.href = url;
		a.download = currentItem.alt || `media-${currentIndex}`;
		a.target = "_blank";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const formatTime = (s: number) => {
		if (isNaN(s) || s === Infinity) return "0:00";
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60);
		return `${m}:${sec.toString().padStart(2, "0")}`;
	};

	const parseDuration = (durStr?: string) => {
		if (!durStr) return 0;
		const parts = durStr.split(":").map(Number);
		if (parts.length === 2) return parts[0] * 60 + parts[1];
		if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
		return 0;
	};

	// Effective duration for the seek bar and UI
	const effectiveDuration = videoDuration > 0 ? videoDuration : parseDuration(currentItem?.duration);

	// Variants for the directional carousel
	const variants: Variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? "20%" : direction < 0 ? "-20%" : 0,
			opacity: 0,
			scale: isNavigating ? 1 : 0.9,
		}),
		center: {
			x: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: [0.16, 1, 0.3, 1],
				opacity: { duration: 0.4 },
				scale: { duration: 0.5 },
			},
		},
		exit: (direction: number) => ({
			x: direction > 0 ? "-20%" : direction < 0 ? "20%" : 0,
			opacity: 0,
			scale: 1,
			transition: {
				duration: 0.4,
				ease: [0.4, 0, 0.2, 1],
			},
		}),
	};

	return (
		<AnimatePresence mode="wait">
			{isOpen && currentItem && (
				<motion.div
					ref={containerRef}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4 }}
					className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col select-none"
					onMouseMove={resetControlsTimer}
					onClick={(e) => {
						if (e.target === e.currentTarget) resetControlsTimer();
					}}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
				>
					{/* ── Top Bar ── */}
					<motion.div
						initial={false}
						animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
						transition={{ duration: 0.3 }}
						className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent"
					>
						<div className="flex items-center gap-4">
							<span className="text-white/60 text-xs sm:text-sm font-light tracking-wider">
								{galleryName && (
									<span className="text-accent-gold font-medium">{galleryName}</span>
								)}
							</span>
							<span className="text-white/40 text-xs font-mono">
								{currentIndex + 1} / {items.length}
							</span>
						</div>

						<div className="flex items-center gap-2 sm:gap-3">
							{onShare && (
								<button
									onClick={onShare}
									className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-300"
									title="Share"
								>
									<Share2 className="h-4 w-4" />
								</button>
							)}
							<button
								onClick={handleDownload}
								className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-300"
								title="Download"
							>
								<Download className="h-4 w-4" />
							</button>
							<button
								onClick={toggleFullscreen}
								className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-300"
								title="Fullscreen"
							>
								{isFullscreen ? (
									<Minimize className="h-4 w-4" />
								) : (
									<Maximize className="h-4 w-4" />
								)}
							</button>
							<button
								onClick={handleClose}
								className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all duration-300"
								title="Close"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					</motion.div>

					{/* ── Main Content ── */}
					<div className="flex-1 flex items-center justify-center relative px-2 sm:px-20 overflow-hidden">
						{/* Prev Arrow */}
						<motion.button
							initial={false}
							animate={{ opacity: showControls ? 1 : 0 }}
							onClick={(e) => {
								e.stopPropagation();
								goPrev();
							}}
							className="absolute left-2 sm:left-6 z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-300"
						>
							<ChevronLeft className="h-6 w-6" />
						</motion.button>

						{/* Media Container with Directional Carousel */}
						<div className="relative w-full h-full flex items-center justify-center">
							<AnimatePresence mode="popLayout" custom={direction}>
								<motion.div
									key={currentIndex}
									custom={direction}
									variants={variants}
									initial="enter"
									animate="center"
									exit="exit"
									className="absolute inset-0 flex items-center justify-center"
								>
									{isVideo ? (
										<div className="relative max-w-full max-h-full flex items-center justify-center">
											<video
												ref={(el) => {
													if (el) videoRef.current = el;
												}}
												src={currentItem.url}
												poster={currentItem.posterUrl}
												className="max-h-[80vh] max-w-full rounded-sm object-contain"
												loop
												playsInline
												muted={isMuted}
												onClick={toggleVideoPlay}
												onTimeUpdate={(e) => {
													setVideoProgress(e.currentTarget.currentTime);
												}}
												onProgress={handleVideoProgress}
												onLoadedMetadata={(e) => {
													const d = e.currentTarget.duration;
													if (d > 0 && d !== Infinity && !isNaN(d)) {
														setVideoDuration(d);
													}
													handleVideoProgress(e);
												}}
											/>
											{/* Play/Pause overlay for video */}
											<AnimatePresence>
												{!isVideoPlaying && (
													<motion.button
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.8 }}
														onClick={toggleVideoPlay}
														className="absolute inset-0 flex items-center justify-center"
													>
														<div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 hover:bg-accent-gold hover:border-accent-gold hover:scale-110">
															<Play className="h-8 w-8 text-white fill-white ml-1" />
														</div>
													</motion.button>
												)}
											</AnimatePresence>
										</div>
									) : (
										<motion.div
											layoutId={!isNavigating && !isClosing ? `media-${currentItem.id}` : undefined}
											className="relative max-h-[85vh] max-w-full"
											transition={{
												duration: 0.6,
												ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
											}}
										>
											<Image
												src={currentItem.url}
												alt={currentItem.alt || ""}
												width={currentItem.width}
												height={currentItem.height}
												className="max-h-[85vh] w-auto object-contain rounded-sm"
												quality={90}
												priority
											/>
										</motion.div>
									)}
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Next Arrow */}
						<motion.button
							initial={false}
							animate={{ opacity: showControls ? 1 : 0 }}
							onClick={(e) => {
								e.stopPropagation();
								goNext();
							}}
							className="absolute right-2 sm:right-6 z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-300"
						>
							<ChevronRight className="h-6 w-6" />
						</motion.button>
					</div>

					{/* ── Bottom Bar ── */}
					<motion.div
						initial={false}
						animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
						transition={{ duration: 0.3 }}
						className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 sm:px-8 py-4"
					>
						{/* Video seek bar */}
						{isVideo && (
							<div className="flex items-center gap-3 mb-3">
								<span className="text-white/50 text-[11px] font-mono w-10 text-right">
									{formatTime(videoProgress)}
								</span>
								<div className="flex-1 relative group/seek flex items-center">
									<input
										type="range"
										min={0}
										max={effectiveDuration > 0 ? effectiveDuration : 1}
										step={0.1}
										value={videoProgress}
										onChange={handleSeek}
										className="w-full h-1 relative z-20 appearance-none bg-white/10 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:cursor-pointer"
									/>
									{/* Buffered Bar */}
									<div
										className="absolute left-0 h-1 bg-accent-gold/25 rounded-full pointer-events-none transition-all duration-300 z-10"
										style={{
											width: `${videoBuffered}%`,
										}}
									/>
									{/* Current Progress Bar */}
									<div
										className="absolute left-0 h-1 bg-accent-gold rounded-full pointer-events-none z-10"
										style={{
											width: `${effectiveDuration > 0 ? (videoProgress / effectiveDuration) * 100 : 0}%`,
										}}
									/>
								</div>
								<span className="text-white/50 text-[11px] font-mono w-10">
									{formatTime(effectiveDuration)}
								</span>
							</div>
						)}

						<div className="flex items-center justify-between">
							{/* Left controls */}
							<div className="flex items-center gap-2 sm:gap-3">
								{isVideo && (
									<button
										onClick={toggleVideoPlay}
										className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-300"
									>
										{isVideoPlaying ? (
											<Pause className="h-4 w-4" />
										) : (
											<Play className="h-4 w-4 ml-0.5" />
										)}
									</button>
								)}

								{/* Volume control */}
								{isVideo && (
									<div
										className="relative flex items-center"
										onMouseEnter={() => setShowVolumeSlider(true)}
										onMouseLeave={() => setShowVolumeSlider(false)}
									>
										<button
											onClick={toggleMute}
											className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-gold hover:border-accent-gold/50 transition-all duration-300"
										>
											{isMuted ? (
												<VolumeX className="h-4 w-4" />
											) : (
												<Volume2 className="h-4 w-4" />
											)}
										</button>
										<AnimatePresence>
											{showVolumeSlider && (
												<motion.div
													initial={{ opacity: 0, width: 0 }}
													animate={{ opacity: 1, width: 80 }}
													exit={{ opacity: 0, width: 0 }}
													className="relative flex items-center ml-2 overflow-hidden h-10"
												>
													<input
														type="range"
														min={0}
														max={1}
														step={0.05}
														value={isMuted ? 0 : volume}
														onChange={(e) =>
															handleVolumeChange(Number(e.target.value))
														}
														className="z-10 w-full h-1 appearance-none bg-white/20 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:cursor-pointer"
													/>
													<div
														className="absolute left-0 h-1 bg-accent-gold rounded-full pointer-events-none"
														style={{
															width: `${(isMuted ? 0 : volume) * 100}%`,
														}}
													/>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}

								{/* Slideshow toggle (for photos) */}
								{!isVideo && (
									<button
										onClick={() => setIsSlideshow((s) => !s)}
										className={cn(
											"h-10 px-4 rounded-full backdrop-blur-sm border flex items-center gap-2 text-xs uppercase tracking-wider font-bold transition-all duration-300",
											isSlideshow
												? "bg-accent-gold/20 border-accent-gold/50 text-accent-gold"
												: "bg-white/10 border-white/10 text-white/70 hover:text-accent-gold hover:border-accent-gold/50"
										)}
									>
										{isSlideshow ? (
											<Pause className="h-3 w-3" />
										) : (
											<Play className="h-3 w-3 ml-0.5" />
										)}
										<span className="hidden sm:inline">Slideshow</span>
									</button>
								)}
							</div>

							{/* Muted indicator (always visible for video) */}
							{isVideo && isMuted && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold"
								>
									<VolumeX className="h-3 w-3" />
									<span className="hidden sm:inline">Muted</span>
								</motion.div>
							)}

							{/* Right info */}
							<div className="text-right">
								{currentItem.alt && (
									<p className="text-white/60 text-xs sm:text-sm font-light">
										{currentItem.alt}
									</p>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
