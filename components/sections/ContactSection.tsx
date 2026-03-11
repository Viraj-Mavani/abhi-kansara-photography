"use client";

import AnimatedSection from "../AnimatedSection";

export default function ContactSection() {
  return (
    <section id="contact" className="relative w-full bg-background py-32 sm:py-48 px-6 sm:px-12 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto text-center">
        <AnimatedSection delay={0.1}>
          <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 block">Inquiries</span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            Tell Me Your <span className="italic text-white/70">Story</span>
          </h2>
          <p className="text-foreground-muted font-light mb-16 sm:mb-24">
            Currently accepting commissions for the upcoming wedding season. Please provide some details below, and I will be in touch securely.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <form className="flex flex-col gap-8 text-left w-full max-w-xl mx-auto">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-foreground-muted">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full bg-transparent border-b border-white/20 pb-2 text-foreground focus:outline-none focus:border-accent-gold transition-colors duration-300 placeholder:text-white/10"
                placeholder="John & Jane"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground-muted">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-transparent border-b border-white/20 pb-2 text-foreground focus:outline-none focus:border-accent-gold transition-colors duration-300 placeholder:text-white/10"
                placeholder="hello@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="text-xs uppercase tracking-widest text-foreground-muted">Wedding Details</label>
              <textarea 
                id="details" 
                rows={3}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-foreground focus:outline-none focus:border-accent-gold transition-colors duration-300 resize-none placeholder:text-white/10"
                placeholder="Date, Venue, Number of Guests..."
              />
            </div>

            <button 
              type="button" 
              className="mt-8 self-center sm:self-start px-8 py-3 uppercase tracking-[0.15em] text-sm text-foreground border border-white/20 hover:border-accent-gold hover:text-accent-gold transition-all duration-300"
              onClick={(e) => { e.preventDefault(); alert("Contact form implementation pending backend integration.")}}
            >
              Send Inquiry
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
