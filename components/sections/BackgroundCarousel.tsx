"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { fallbackBackgroundImages } from "@/lib/data";
import { HeroBackground } from "@/lib/api";

interface BackgroundCarouselProps {
  backgrounds?: HeroBackground[];
  interval?: number;
}

export default function BackgroundCarousel({ backgrounds = [], interval = 4.5 }: BackgroundCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  const overlayOpacity = useTransform(scrollY, [0, 400], [0, 0.5]);

  const images = backgrounds.length > 0 ? backgrounds.map(b => b.imageUrl) : fallbackBackgroundImages;

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, (interval || 4.5) * 1000);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-0 bg-black overflow-hidden pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "circOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentIndex]}
            alt="Photography Showcase"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <motion.div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
