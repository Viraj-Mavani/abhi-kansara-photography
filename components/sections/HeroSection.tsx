"use client";

import { portfolioImages } from "@/lib/data";
import dynamic from "next/dynamic";

const ParallaxImage = dynamic(() => import("../ParallaxImage"), { ssr: false });

export default function HeroSection() {
  const heroData = portfolioImages.find((img) => img.id === "hero");

  if (!heroData) return null;

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Parallax Image */}
      <div className="absolute inset-0 z-0">
        <ParallaxImage
          src={heroData.src}
          alt={heroData.alt}
          blurDataURL={heroData.blurDataURL}
          parallaxSpeed={0.3}
          priority
          className="h-full w-full"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl translate-y-12">
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-foreground font-medium drop-shadow-2xl">
          Visual <span className="text-accent-gold italic">Storyteller</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-foreground-muted max-w-2xl font-sans tracking-wide">
          Capturing the fleeting, the raw, and the beautiful. Luxury wedding photography tailored for the modern romantic.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-foreground-muted flex flex-col items-center gap-2 z-10">
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-accent-gold animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
