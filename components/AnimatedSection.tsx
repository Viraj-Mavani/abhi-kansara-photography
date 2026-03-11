"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

/**
 * A reusable wrapper component that animates its children 
 * smoothly when they scroll into the viewport.
 */
export default function AnimatedSection({
  children,
  className,
  delay = 0,
  duration = 0.8,
  yOffset = 40,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={cn("w-full opacity-0", className)}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: [0.25, 1, 0.5, 1], // Custom highly fluid cubic bezier
      }}
    >
      {children}
    </motion.div>
  );
}
