import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { getBio } from "@/lib/api";

export default async function AboutPage() {
  const bioData = await getBio();

  return (
    <main className="flex min-h-screen flex-col bg-accent-ivory text-black selection:bg-accent-gold selection:text-white">
      <Navigation />
      <BackButton />

      {/* About Content */}
      <div className="flex-1 w-full pt-56 md:pt-64 pb-20 px-6 sm:px-12 flex flex-col items-center">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Portrait Image */}
          <AnimatedSection className="w-full lg:w-5/12 relative aspect-4/5 overflow-hidden rounded-sm" delay={0.1}>
            <Image
              src={bioData.portraitImage}
              alt={`${bioData.artistName} - Photographer Portrait`}
              fill
              className="object-cover"
              priority
            />
          </AnimatedSection>

          {/* Bio Text */}
          <AnimatedSection className="w-full lg:w-7/12 flex flex-col" delay={0.3}>
            <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 font-bold">The Artist</span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-slate-900 mb-8 leading-tight">
              I believe in the beauty of <br className="hidden lg:block" />
              <span className="italic">unscripted moments.</span>
            </h1>

            <div className="space-y-6 text-slate-600 text-base sm:text-lg max-w-2xl font-light">
              <p>
                {bioData.intro}
              </p>
              <p>
                {bioData.history}
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="w-16 h-px bg-accent-gold" />
              <span className="font-serif text-2xl text-slate-900 italic">{bioData.artistName}</span>
            </div>
          </AnimatedSection>

        </div>

        {/* Philosophy Section */}
        <AnimatedSection className="w-full max-w-4xl mx-auto mt-32 text-center" delay={0.2} yOffset={20}>
          <h2 className="font-mono text-sm uppercase tracking-[0.3em] font-bold text-accent-gold mb-8">Creative Philosophy</h2>
          <p className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-slate-900 italic font-light">
            &ldquo;To photograph truthfully and effectively is to see beneath the surfaces and record the qualities of nature and humanity which live or are latent in all things.&rdquo;
          </p>
        </AnimatedSection>

      </div>

      <Footer />
    </main>
  );
}
