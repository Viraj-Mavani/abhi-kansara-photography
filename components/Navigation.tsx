"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "about" },
  { name: "Services", href: "#services" },
];

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Hide nav at the very top (for cinematic hero immersion), 
  // show when scrolling down, hide when scrolling up past threshold.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Always hide at the absolute top (hero section)
    if (latest < 100) {
      setHidden(true);
      setHasScrolled(false);
      return;
    }

    setHasScrolled(true);

    // Show nav when scrolling down, hide when scrolling up, 
    // but keep it visible if we are just scrolling slowly.
    // For a photography portfolio, revealing on scroll UP is common,
    // but revealing on scroll DOWN keeps it accessible. Let's make it fixed once past hero.
    if (latest > previous && latest > 150) {
      setHidden(false); // Can tweak this to hide on scroll down, but client wanted it "blending perfectly".
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-6 pointer-events-none"
    >
      <nav
        className={cn(
          "pointer-events-auto flex items-center justify-between w-full max-w-5xl rounded-full px-6 py-3 transition-all duration-500",
          hasScrolled
            ? "bg-background/70 backdrop-blur-md border border-white/10 shadow-2xl"
            : "bg-transparent"
        )}
      >
        {/* Logo Area */}
        <Link href="/" className="flex items-center group">
          <Image
            alt="Abhi Kansara Photography"
            src="/Logo.png"
            width={100}
            height={100}
            className="h-8 w-auto invert transition-opacity duration-500 opacity-90 group-hover:opacity-100 mix-blend-difference"
            priority
          />
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm font-medium tracking-wide text-foreground-muted hover:text-foreground transition-colors duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="contact"
          className="px-5 py-2 rounded-full bg-accent-gold text-black text-sm font-medium hover:bg-white transition-colors duration-300"
        >
          Book a Session
        </Link>
      </nav>
    </motion.header>
  );
}
