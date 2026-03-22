"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { backgroundImages } from "@/lib/data";

export default function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  const overlayOpacity = useTransform(scrollY, [0, 400], [0, 0.5]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4500); // 4.5 seconds for cinematic pacing

    return () => clearInterval(interval);
  }, []);

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
            src={backgroundImages[currentIndex]}
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
