"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
  { name: "WhatsApp", href: "https://whatsapp.com" },
  { name: "YouTube", href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="relative bg-background-secondary pt-32 pb-12 px-6 sm:px-12 overflow-hidden border-t border-white/5">
      {/* Decorative subtle background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Main CTA / Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="font-serif font-medium text-4xl sm:text-6xl lg:text-7xl mb-6 text-foreground tracking-tight">
            Let's create something <br />
            <span className="text-accent-gold italic">beautiful together.</span>
          </h2>
          <p className="max-w-xl mx-auto text-foreground-muted text-base sm:text-lg">
            Based in India. Available worldwide for luxury weddings, intimate elopements, and editorial portraiture.
          </p>
        </motion.div>

        {/* Social Links with magnetic hover effects */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-20">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                color: "var(--accent-gold)",
                textShadow: "0px 0px 8px rgba(201,169,110,0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="font-sans text-sm sm:text-base tracking-widest uppercase text-foreground-muted transition-colors duration-300 px-4 py-2"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-xs sm:text-sm text-foreground-muted/60">
          <p>© {new Date().getFullYear()} Abhi Kansara Photography. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
