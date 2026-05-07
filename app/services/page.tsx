import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import ServicesShowcase from "@/components/sections/ServicesShowcase";
import BackButton from "@/components/BackButton";
import { getServices, getPageConfig } from "@/lib/api";

export const metadata: Metadata = {
  title: "Services | Abhi Kansara Photography",
  description:
    "Explore our curated photography experiences — Wedding, Event, Product, and Portrait photography crafted with intention and cinematic artistry.",
};

export default async function ServicesPage() {
  const allServices = await getServices();
  const services = allServices.filter(s => s.isFeatured !== false); // Default to true if somehow null
  const pageConfig = await getPageConfig('services');

  return (
    <main className="flex min-h-screen flex-col bg-accent-ivory text-black selection:bg-accent-gold selection:text-white">
      <Navigation />
      <BackButton />
      <ServicesShowcase services={services} pageConfig={pageConfig} />
      <Footer />
    </main>
  );
}
