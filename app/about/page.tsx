"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import { portfolioImages } from "@/lib/data";

export default function AboutPage() {
  const portraitData = portfolioImages.find((img) => img.id === "portrait");

  return (
    <main className="flex min-h-screen flex-col bg-[#f5f0eb] selection:bg-accent-gold selection:text-black">
      <Navigation />
      
      <div className="flex-1 w-full pt-32 pb-24 px-6 sm:px-12 flex items-center justify-center">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Photographer Image */}
          <div className="w-full lg:w-5/12 aspect-4/5 relative rounded-sm overflow-hidden shadow-2xl">
            {portraitData && (
               <Image
                  src={portraitData.src}
                  alt={portraitData.alt}
                  fill
                  className="object-cover"
               />
            )}
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-7/12 flex flex-col">
            <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 font-bold">The Artist</span>
            <h1 className="font-serif text-5xl sm:text-6xl text-slate-900 mb-8 leading-tight">
              I believe in the beauty of <br className="hidden sm:block" />
              <span className="italic">unscripted moments.</span>
            </h1>
            
            <div className="space-y-6 text-slate-700 text-base sm:text-lg max-w-2xl font-light">
              <p>
                My approach to wedding photography is deeply rooted in editorial elegance and raw, emotional authenticity. I don't just want to take pictures of what your wedding looked like; I want to capture exactly how it felt.
              </p>
              <p>
                Based in India and traveling worldwide, I’ve spent the last decade documenting love stories for couples who value art, emotion, and cinematic perfection.
              </p>
            </div>

            <div className="mt-16 pt-16 border-t border-slate-300">
                <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 block font-bold">Philosophy</span>
                <p className="text-slate-700 font-light italic text-xl sm:text-2xl leading-relaxed">
                  "A photograph is a secret about a secret. The more it tells you the less you know." 
                  We strive to weave an air of mystery, elegance, and profound truth into every frame we capture.
                </p>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
               <div className="w-16 h-px bg-slate-400" />
               <span className="font-serif text-2xl text-slate-900 italic">Abhi Kansara</span>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
