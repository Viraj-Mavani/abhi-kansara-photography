import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FixedBackgroundCarousel from "@/components/sections/FixedBackgroundCarousel";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import PortraitVideos from "@/components/sections/PortraitVideos";
import LandscapeVideos from "@/components/sections/LandscapeVideos";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col selection:bg-accent-gold selection:text-black">
      <FixedBackgroundCarousel />
      <Navigation />
      
      <div className="flex flex-col w-full relative z-0">
        <HeroSection />
        <ServicesCarousel />
        <PortfolioGrid />
        <PortraitVideos />
        <LandscapeVideos />
      </div>

      <Footer />
    </main>
  );
}

