"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f5f0eb] selection:bg-accent-gold selection:text-black">
      <Navigation />
      
      <div className="flex-1 w-full pt-48 pb-32 px-6 sm:px-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full mx-auto text-center">
            <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 block font-bold">Inquiries & Collaboration</span>
            <h1 className="font-serif text-5xl sm:text-7xl text-slate-900 mb-6">
              Tell Me Your <span className="italic text-slate-600">Story</span>
            </h1>
            <p className="text-slate-600 font-light mb-16 sm:mb-24 text-lg max-w-xl mx-auto">
              Currently accepting commissions worldwide. Please provide some details about your event, and my team will be in touch securely.
            </p>

            <form className="flex flex-col gap-10 text-left w-full max-w-xl mx-auto">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Name(s)</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-transparent border-b border-slate-300 pb-3 text-slate-900 focus:outline-none focus:border-accent-gold transition-colors duration-300 placeholder:text-slate-300 text-lg"
                  placeholder="John & Jane"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-transparent border-b border-slate-300 pb-3 text-slate-900 focus:outline-none focus:border-accent-gold transition-colors duration-300 placeholder:text-slate-300 text-lg"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="details" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Event Details</label>
                <textarea 
                  id="details" 
                  rows={4}
                  className="w-full bg-transparent border-b border-slate-300 pb-3 text-slate-900 focus:outline-none focus:border-accent-gold transition-colors duration-300 resize-none placeholder:text-slate-300 text-lg"
                  placeholder="Date, Venue, Number of Guests, Vision..."
                />
              </div>

              <button 
                type="button" 
                className="mt-8 self-center sm:self-start px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold text-slate-900 border border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
              >
                Send Inquiry
              </button>
            </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
