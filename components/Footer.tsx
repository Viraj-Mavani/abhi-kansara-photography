import Image from "next/image";
import { Instagram, Linkedin, Mail, Music2 } from "lucide-react";
import Link from "next/link";
import { identity } from "@/lib/identity";

const socialLinks = identity.socialLinks;

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-black/5 bg-white/80 backdrop-blur-xl px-6 py-20 md:px-12 md:py-32 z-10 w-full text-black">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-16 md:flex-row">

          {/* Left Side: Call to Action */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-accent-gold uppercase tracking-[0.2em] text-xs mb-6 block font-bold">Let's Connect</span>
            <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8 text-slate-900">
              Let's create <br /> <span className="italic font-light text-slate-500">something beautiful</span>
            </h2>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-black/5 transition-all duration-500 hover:border-accent-gold hover:bg-accent-gold"
                  >
                    <Icon strokeWidth={1.5} className="h-5 w-5 text-slate-700 transition-colors duration-300 group-hover:text-black" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Side: Navigation & Info */}
          <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
            <Image
              src="/Logo.png"
              alt="Abhi Kansara Photography"
              width={150}
              height={50}
              className="opacity-90 mb-4 hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col gap-2 uppercase tracking-[0.15em] text-[10px] font-bold text-slate-500">
              <Link href="/about" className="hover:text-accent-gold transition-colors block">About The Artist</Link>
              <Link href="/services" className="hover:text-accent-gold transition-colors block">Services</Link>
              <Link href="/portfolio/clients" className="hover:text-accent-gold transition-colors block">Works</Link>
              <Link href="/contact" className="hover:text-accent-gold transition-colors block">Inquire Now</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-black/5 pt-8 md:flex-row text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <p className="order-1 text-center md:text-left">© {new Date().getFullYear()} Abhi Kansara. Visual Artist.</p>
          
          <div className="order-2 flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <div className="flex gap-8">
              {["Inquire", "Privacy", "Terms"].map((item) => (
                <Link
                  key={item}
                  href={item === "Inquire" ? "/contact" : item === "Privacy" ? "/privacy" : "/terms"}
                  className="hover:text-accent-gold transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
            
            <a 
              href="https://virajmavani.dev" 
              target="_blank" 
              className="hover:text-black transition-colors group flex items-center justify-center pt-2 md:pt-0 border-t border-black/5 md:border-t-0 w-full md:w-auto"
            >
              <span className="opacity-60">Built by</span>&nbsp;
              <span className="text-slate-500 group-hover:text-black transition-colors">Viraj Mavani</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
