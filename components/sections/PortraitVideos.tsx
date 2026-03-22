"use client";

import { motion } from "framer-motion";
import { videoSources } from "@/lib/data";
import VideoPlayer from "@/components/VideoPlayer";

export default function PortraitVideos() {
  return (
    <section className="relative w-full bg-transparent py-20 sm:py-32 z-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center">
        
        <div className="text-center mb-16 sm:mb-24">
          <span className="text-accent-gold uppercase tracking-[0.2em] text-xs mb-4 block font-bold">Cinematography</span>
          <h2 className="font-serif text-5xl sm:text-7xl font-medium text-white mix-blend-difference">
            Portrait <span className="italic text-white/60">Reels</span>
          </h2>
        </div>

        {/* Portrait Videos Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full justify-center items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[400px]"
          >
            <VideoPlayer 
              src={videoSources.portrait0} 
              poster={videoSources.portrait0Poster}
              aspectRatio="portrait"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[400px]"
          >
            <VideoPlayer 
              src={videoSources.portrait1} 
              poster={videoSources.portrait1Poster}
              aspectRatio="portrait"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
