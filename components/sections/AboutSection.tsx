"use client";

import AnimatedSection from "../AnimatedSection";
import { portfolioImages } from "@/lib/data";
import dynamic from "next/dynamic";

const ParallaxImage = dynamic(() => import("../ParallaxImage"), { ssr: false });

export default function AboutSection() {
  const portraitData = portfolioImages.find((img) => img.id === "portrait");

  return (
    <section id="about" className="relative w-full bg-background py-32 sm:py-48 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left: Photographer Image */}
        <AnimatedSection 
          className="w-full lg:w-5/12 aspect-[4/5] relative rounded-sm overflow-hidden" 
          delay={0.1}
        >
          {portraitData && (
             <ParallaxImage
                src={portraitData.src}
                alt={portraitData.alt}
                blurDataURL={portraitData.blurDataURL}
                parallaxSpeed={0} // Turn off parallax for this specific portrait, let it be grounded
                className="w-full h-full"
             />
          )}
          {/* Subtle gold border accent */}
          <div className="absolute inset-0 border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-accent-gold/40 pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-accent-gold/40 pointer-events-none" />
        </AnimatedSection>

        {/* Right: Text Content */}
        <AnimatedSection className="w-full lg:w-7/12 flex flex-col" delay={0.3}>
          <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4">The Artist</span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
            I believe in the beauty of <br className="hidden sm:block" />
            <span className="italic">unscripted moments.</span>
          </h2>
          
          <div className="space-y-6 text-foreground-muted text-base sm:text-lg max-w-2xl font-light">
            <p>
              My approach to wedding photography is deeply rooted in editorial elegance and raw, emotional authenticity. I don't just want to take pictures of what your wedding looked like; I want to capture exactly how it felt.
            </p>
            <p>
              Based in India and traveling worldwide, I’ve spent the last decade documenting love stories for couples who value art, emotion, and cinematic perfection. When I’m not behind the lens, you’ll find me studying classic cinema or chasing the perfect golden hour.
            </p>
          </div>

          <div className="mt-12 flex items-center gap-6">
             <div className="w-16 h-[1px] bg-accent-gold/50" />
             <span className="font-serif text-xl text-foreground italic">Abhi Kansara</span>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
