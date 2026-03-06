import Image from "next/image";
import { Instagram, Linkedin, Mail, Music2 } from "lucide-react";

export const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/abhikansara_photography",
    color: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-[#ee2a7b] hover:shadow-[0_15px_35px_-10px_rgba(238,42,123,0.6)]"
  },
  {
    icon: Music2,
    label: "TikTok",
    href: "https://tiktok.com",
    color: "hover:bg-black hover:text-white hover:border-black hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.4),5px_5px_0px_-2px_rgba(255,0,80,0.4),-5px_-5px_0px_-2px_rgba(0,242,234,0.4)]"
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abhikansaraphotography",
    color: "hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] hover:shadow-[0_15px_35px_-10px_rgba(0,119,181,0.6)]"
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:abhikansaraphotography@gmail.com",
    color: "hover:bg-white hover:text-[#EA4335] hover:border-[#EA4335] hover:shadow-[0_15px_35px_-10px_rgba(234,67,53,0.5)]"
  },
];

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-slate-200 bg-white px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">

          {/* Left: Logo & Pitch */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              alt="Abhi Kansara Photography logo"
              src="/Logo.png"
              width={150}
              height={150}
              className="h-12 w-auto grayscale transition-all duration-500 hover:grayscale-0"
              priority
            />
            <p className="mt-6 max-w-xs text-center font-serif text-xl leading-relaxed text-slate-500 md:text-left">
              Capturing moments that <span className="italic text-slate-900">stay forever.</span>
            </p>
          </div>

          {/* Right: Interactive Social Icons */}
          <div className="flex flex-wrap justify-center gap-5 lg:gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`group relative flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-[22px] border border-slate-200 bg-white text-slate-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:rotate-3 ${social.color}`}
              >
                {/* Floating Tooltip with "Bloom" animation */}
                <span className="absolute -top-12 opacity-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 transition-all duration-300 group-hover:-top-14 group-hover:opacity-100">
                  {social.label}
                </span>

                <social.icon strokeWidth={1.5} className="h-5 w-5 lg:h-6 lg:w-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between border-t border-slate-100 pt-8 md:flex-row">
          <div className="order-2 mt-8 md:order-1 md:mt-0">
            <p className="font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase">
              © 2026 Abhi Kansara — Visual Artist
            </p>
          </div>

          <div className="order-1 flex gap-8 md:order-2">
            {["About", "Service", "Work"].map((item) => (
              <a
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="relative font-mono text-[10px] font-bold uppercase tracking-widest text-slate-900 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-slate-900 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
