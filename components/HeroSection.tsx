import Image from "next/image";

export function HeroSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 min-h-[calc(100vh-120px)] items-center pb-12">
      {/* Left Column: Typography */}
      <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center gap-8 order-2 md:order-1">
        <div className="space-y-4">
          <h2 className="font-mono text-xs md:text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
            Wedding & Event Photographer
          </h2>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-primary tracking-tighter">
            Capturing<br />
            <span className="italic font-light">Life&apos;s</span><br />
            Elegance
          </h1>
          <p className="max-w-md text-slate-600 text-lg leading-relaxed pt-4 font-light">
            Based in London. Creating high-quality, emotional, and storytelling moments.
          </p>
        </div>
        <div className="pt-4">
          <button className="inline-flex items-center gap-3 border-b-2 border-primary pb-1 text-primary transition-all hover:gap-5 hover:opacity-70">
            <span className="font-mono text-sm font-bold uppercase tracking-widest">View Gallery</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
        <div className="flex w-full flex-nowrap items-center gap-3 pt-12 md:gap-4 md:pt-14">
          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/abhikansara_photography"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-1 items-center justify-center gap-3 rounded-[22px] border border-slate-200 bg-white py-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:border-[#ee2a7b] hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:shadow-[0_15px_35px_-10px_rgba(238,42,123,0.6)] active:scale-95 md:px-8"
          >
            <span className="whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover:text-white md:text-xs">
              Instagram
            </span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white">
              arrow_outward
            </span>
          </a>

          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/in/abhikansaraphotography"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-1 items-center justify-center gap-3 rounded-[22px] border border-slate-200 bg-white py-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:border-[#0077b5] hover:bg-[#0077b5] hover:shadow-[0_15px_35px_-10px_rgba(0,119,181,0.6)] active:scale-95 md:px-8"
          >
            <span className="whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover:text-white md:text-xs">
              LinkedIn
            </span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white">
              arrow_outward
            </span>
          </a>
        </div>

      </div>

      {/* Right Column: Hero Image */}
      <div className="md:col-span-6 lg:col-span-6 relative h-[60vh] md:h-[80vh] max-h-[700px] w-full order-1 md:order-2">
        <div className="h-full w-full overflow-hidden rounded-t-[10rem] rounded-b-lg border border-slate-200 p-2 bg-white shadow-xl shadow-slate-200/50">
          <div className="relative h-full w-full overflow-hidden rounded-t-[9.5rem] rounded-b-sm">
            <Image
              alt="High fashion portrait of a model with elegant styling"
              className="object-cover object-top transition-transform duration-1000 hover:scale-105"
              src="/IMG_4003.jpeg"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Floating Badge */}
          <div className="absolute bottom-8 -left-5 md:-left-10 z-10 hidden md:block">
            <div className="bg-white p-4 shadow-lg rounded-lg border border-slate-100 max-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured</span>
              </div>
              <p className="font-serif text-lg leading-tight italic">&quot;A Tale of Wedding&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
