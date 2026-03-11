"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function PortraitVideos() {
  return (
    <section className="relative w-full bg-[#1a1a1a] py-32 sm:py-48 z-10 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center">
        
        <div className="text-center mb-16 sm:mb-24">
          <span className="text-accent-gold uppercase tracking-[0.2em] text-xs mb-4 block font-bold">Cinematography</span>
          <h2 className="font-serif text-5xl sm:text-7xl font-medium text-white">
            Portrait <span className="italic text-white/60">Reels</span>
          </h2>
        </div>

        {/* Portrait Videos Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full justify-center items-center">
          
          {/* Video 1 Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[450px] aspect-9/16 relative bg-black rounded-lg overflow-hidden group shadow-2xl border border-white/10"
          >
            {/* Real implementation would use HTML5 <video> tag or embedded iframe with the smugmug source */}
            <div className="absolute inset-0 bg-[url('https://photos.smugmug.com/PORTFOLIO/Cinematography/i-BWqmL9b/0/KnrZd9cTCLGZkr3t3S882v2MxJc8X4nSbPD6sZTsv/X3/portfolio%20reel-X3.jpg')] bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110 opacity-70" />
            
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none transition-colors duration-500 group-hover:bg-black/40">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl pointer-events-auto cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
                   <Play fill="currentColor" className="w-8 h-8 ml-1" />
                </div>
            </div>
          </motion.div>

          {/* Video 2 Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[450px] aspect-9/16 relative bg-black rounded-lg overflow-hidden group shadow-2xl border border-white/10"
          >
            <div className="absolute inset-0 bg-[url('https://photos.smugmug.com/PORTFOLIO/Cinematography/i-GJwPZc7/0/MD2QZpn5qhrNXkTVzWdhf3gtH9GCQxwrZxv55GwzV/X3/0610%286%29-X3.jpg')] bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110 opacity-70" />
            
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none transition-colors duration-500 group-hover:bg-black/40">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl pointer-events-auto cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
                   <Play fill="currentColor" className="w-8 h-8 ml-1" />
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
