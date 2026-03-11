import AnimatedSection from "../AnimatedSection";
import Image from "next/image";
import { servicesData } from "@/lib/data";

export default function ServicesSection() {
  return (
    <section id="services" className="relative w-full bg-background-secondary py-32 sm:py-48 px-6 sm:px-12 border-y border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-20 sm:mb-32">
          <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 block">Offerings</span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Curated <span className="italic text-white/70">Experiences</span>
          </h2>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 w-full">
          {servicesData.map((service, index) => (
            <AnimatedSection key={service.id} delay={0.2 * index} className="group flex flex-col">
              {/* Image Container with Hover Effect */}
              <div className="relative aspect-[4/5] w-full overflow-hidden mb-8 border border-white/5 transition-colors duration-500 group-hover:border-accent-gold/50 rounded-sm">
                 <Image
                   src={service.image}
                   alt={service.title}
                   fill
                   className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                 />
                 {/* Subtle dark overlay that lifts on hover */}
                 <div className="absolute inset-0 bg-black/40 transition-opacity duration-700 group-hover:bg-black/10" />
              </div>

              {/* Text */}
              <h3 className="font-serif text-2xl lg:text-3xl text-foreground mb-4 relative inline-block">
                 {service.title}
              </h3>
              <p className="text-foreground-muted font-light leading-relaxed text-sm sm:text-base">
                 {service.description}
              </p>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
}
