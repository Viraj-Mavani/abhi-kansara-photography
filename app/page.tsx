import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import BackgroundCarousel from "@/components/sections/BackgroundCarousel";
import HeroSection from "@/components/sections/HeroSection";
import LandingCarousel from "@/components/sections/LandingCarousel";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import PortraitVideos from "@/components/sections/PortraitVideos";
import LandscapeVideos from "@/components/sections/LandscapeVideos";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getFeaturedGalleries, getCarouselItems } from "@/lib/api";

export default async function Home() {
  const [featuredGalleries, carouselItems] = await Promise.all([
    getFeaturedGalleries(),
    getCarouselItems()
  ]);

  return (
    <main className="flex min-h-screen flex-col selection:bg-accent-gold selection:text-black bg-transparent">
      {/* Absolute zero fixed background */}
      <BackgroundCarousel />
      
      {/* Floating Navigation */}
      <Navigation />
      
      {/* Foreground scroll wrapper representing Sections 0 to 4 */}
      <div className="flex flex-col w-full relative z-10">
        <HeroSection />       {/* Section 0: Transparent */}
        <LandingCarousel items={carouselItems} />  {/* Section 1 */}
        <PortfolioGrid galleries={featuredGalleries} />     {/* Section 2 */}
        <PortraitVideos />    {/* Section 3 */}
        <LandscapeVideos />   {/* Section 4 */}
      </div>

      <Footer />
      <Analytics />
      <SpeedInsights />
    </main>
  );
}