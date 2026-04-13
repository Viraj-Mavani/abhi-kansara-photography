import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import BackgroundCarousel from "@/components/sections/BackgroundCarousel";
import HeroSection from "@/components/sections/HeroSection";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import PortraitVideos from "@/components/sections/PortraitVideos";
import LandscapeVideos from "@/components/sections/LandscapeVideos";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col selection:bg-accent-gold selection:text-black bg-transparent">
      {/* Absolute zero fixed background */}
      <BackgroundCarousel />
      
      {/* Floating Navigation */}
      <Navigation />
      
      {/* Foreground scroll wrapper representing Sections 0 to 4 */}
      <div className="flex flex-col w-full relative z-10">
        <HeroSection />       {/* Section 0: Transparent */}
        <ServicesCarousel />  {/* Section 1 */}
        <PortfolioGrid />     {/* Section 2 */}
        <LandscapeVideos />   {/* Section 3 */}
        <PortraitVideos />    {/* Section 4 */}
      </div>

      <Footer />
      <Analytics />
      <SpeedInsights />
    </main>
  );
}