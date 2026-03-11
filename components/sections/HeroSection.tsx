"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* 
        This section represents "Section 0". 
        It is completely transparent and holds no background.
        It allows the FixedBackgroundCarousel beneath it to shine through.
      */}

      {/* Tactile Animated Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80 font-bold mix-blend-difference">
          Scroll
        </span>
        <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden mix-blend-difference">
          <motion.div 
            className="absolute top-0 right-0 w-full h-1/3 bg-white"
            animate={{ 
              y: ["-100%", "300%"] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "circInOut" 
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
