"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function LandscapeVideos() {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-32 sm:py-48 z-10 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center">
        
        <div className="text-center mb-16 sm:mb-24">
          <span className="text-accent-gold uppercase tracking-[0.2em] text-xs mb-4 block font-bold">Films</span>
          <h2 className="font-serif text-5xl sm:text-7xl font-medium text-white">
            Cinematic <span className="italic text-white/60">Features</span>
          </h2>
        </div>

        {/* Landscape Video Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1200px] aspect-video relative bg-black rounded-xl overflow-hidden group shadow-2xl border border-white/10"
        >
          {/* Real implementation would use HTML5 <video> tag */}
          <div className="absolute inset-0 bg-[url('https://photos.smugmug.com/PORTFOLIO/Cinematography/i-dbRpQLs/0/KRNw4rsc7rSZVmCnLb8w4GdSx4zxCs2cNFvxwQb9M/X3/2023113019403916-7931054866584463286--1920-X3.jpg')] bg-cover bg-center transition-transform duration-[4s] group-hover:scale-105 opacity-70" />
          
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none transition-colors duration-500 group-hover:bg-black/50">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl pointer-events-auto cursor-pointer hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
                 <Play fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 ml-2" />
              </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
