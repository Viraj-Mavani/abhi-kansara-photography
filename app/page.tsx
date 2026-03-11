import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-accent-gold selection:text-black">
      <Navigation />
      
      <div className="flex flex-col w-full">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </div>

      <Footer />
    </main>
  );
}

