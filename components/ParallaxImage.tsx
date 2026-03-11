"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  blurDataURL?: string;
  className?: string;
  imageClassName?: string;
  parallaxSpeed?: number; // 0 (no parallax) to 1 (max parallax)
  priority?: boolean;
}

/**
 * A premium image component that combines Next.js Image with Framer Motion 
 * for a subtle, high-end parallax scroll effect.
 */
export default function ParallaxImage({
  src,
  alt,
  blurDataURL,
  className,
  imageClassName,
  parallaxSpeed = 0.2,
  priority = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Determine the translation range based on speed.
  // We use a slight negative to positive range to create depth.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxSpeed * 15}%`, `${parallaxSpeed * 15}%`]
  );

  // If no parallax speed is set, just render a regular optimized image container
  if (parallaxSpeed === 0) {
    return (
      <div className={cn("relative overflow-hidden bg-background-secondary", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-background-secondary w-full h-full",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ y, scale: 1 + parallaxSpeed * 0.3 }} // scale up slightly to avoid revealing edges during translation
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
    </div>
  );
}
