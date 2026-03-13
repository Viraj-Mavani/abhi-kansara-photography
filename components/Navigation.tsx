"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { identity } from "@/lib/identity";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/#" },
  { name: "Works", href: "/#" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [navVisible, setNavVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine if we are on a "Light" background page (About/Contact)
  const isLightPage = pathname === "/about" || pathname === "/contact";

  // Handle menu toggle with history API for back button support
  const handleMenuToggle = (open: boolean, isNavigating = false) => {
    if (open) {
      setIsMenuOpen(true);
      window.history.pushState({ menuOpen: true }, "");
    } else {
      setIsMenuOpen(false);
      if (!isNavigating && window.history.state?.menuOpen) {
        window.history.back();
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isMenuOpen]);

  // Lock scroll and notify other components when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    // Broadcast menu state for other components (like BackButton)
    window.dispatchEvent(new CustomEvent("menuToggle", { detail: { isOpen: isMenuOpen } }));
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest < 50) {
      setIsAtTop(true);
      setNavVisible(false);
      return;
    } else {
      setIsAtTop(false);
    }

    if (latest > previous && latest > 50) {
      setNavVisible(true);
    } else if (latest < previous) {
      setNavVisible(false);
    }
  });

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  } as any;

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  } as any;

  return (
    <>
      {/* Centered Big Logo at the top of the page */}
      <motion.div
        className="fixed top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: isAtTop && !isMenuOpen ? 1 : 0, 
          y: isAtTop && !isMenuOpen ? 0 : -20,
          scale: isAtTop ? 1 : 0.9 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image
          alt="Abhi Kansara Photography"
          src={identity.logo}
          width={240}
          height={120}
          className={cn(
            "h-16 w-auto transition-all duration-500 opacity-90",
            isLightPage ? "invert-0" : "invert mix-blend-difference"
          )}
          priority
        />
      </motion.div>

      {/* Floating Glassmorphism Pill Navbar */}
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={navVisible || isMenuOpen ? "visible" : "hidden"}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
        className="fixed top-0 inset-x-0 z-60 flex justify-center pt-6 px-6 pointer-events-none"
      >
        <nav
          className={cn(
            "pointer-events-auto flex items-center justify-between w-full max-w-4xl rounded-full px-8 py-3 transition-all duration-500 shadow-2xl border",
            (isLightPage && !isMenuOpen)
              ? "bg-white/90 backdrop-blur-md border-black/5" 
              : "bg-[#1a1a1a]/80 backdrop-blur-md border-white/10"
          )}
        >
          {/* Logo inside nav pill */}
          <Link href="/" className="flex items-center group" onClick={() => handleMenuToggle(false, true)}>
               <Image
                 src={identity.logo}
                 alt="Logo"
                 width={100}
                 height={40}
                 className={cn(
                   "h-8 w-auto transition-all duration-500 opacity-80 group-hover:opacity-100",
                   (isLightPage && !isMenuOpen) ? "invert-0" : "invert"
                 )}
               />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300",
                    isLightPage 
                      ? "text-slate-500 hover:text-black" 
                      : "text-white/60 hover:text-accent-gold"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <Link
              href="/contact"
              className={cn(
                "hidden sm:flex px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg",
                (isLightPage && !isMenuOpen)
                  ? "bg-black text-white hover:bg-accent-gold"
                  : "bg-accent-gold text-black hover:bg-white"
              )}
            >
              Inquire
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => handleMenuToggle(!isMenuOpen)}
              className={cn(
                "flex md:hidden p-2 rounded-full transition-all duration-300",
                (isLightPage && !isMenuOpen) ? "text-black" : "text-white"
              )}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col justify-start px-12 sm:px-24 pt-32 pb-12 overflow-y-auto"
          >
            <div className="flex flex-col gap-10">
              <motion.span 
                variants={linkVariants}
                className="text-accent-gold uppercase tracking-[0.3em] text-[10px] font-bold opacity-60"
              >
                Navigation
              </motion.span>
              <ul className="flex flex-col gap-6">
                {navLinks.concat({ name: "Inquire", href: "/contact" }).map((link) => (
                  <motion.li key={link.name} variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={() => handleMenuToggle(false, true)}
                      className="group flex items-center gap-6"
                    >
                      <span className="font-serif text-[2.75rem] leading-[1.1] sm:text-7xl text-white hover:text-accent-gold transition-colors italic">
                        {link.name}
                      </span>
                      <div className="h-px flex-1 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-8">
                <motion.span 
                  variants={linkVariants}
                  className="text-accent-gold uppercase tracking-[0.3em] text-[10px] font-bold opacity-60"
                >
                  Connect
                </motion.span>
                <div className="flex gap-6">
                  {identity.socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={linkVariants}
                        className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent-gold hover:border-accent-gold transition-all"
                      >
                        <Icon size={20} strokeWidth={1.5} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
