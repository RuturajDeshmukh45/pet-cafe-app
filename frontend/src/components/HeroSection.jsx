import React from 'react';
import { 
  Calendar, 
  PawPrint, 
  ArrowRight, 
  Coffee, 
  Cake, 
  HeartHandshake, 
  Sparkles,
  Heart
} from 'lucide-react';

export function HeroSection({ onBookTable, onMeetPets }) {
  return (
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      
      {/* Decorative ambient background paw prints */}
      <div className="absolute top-12 left-6 text-sky-200/50 pointer-events-none -z-10 select-none hidden md:block">
        <PawPrint className="w-24 h-24 rotate-[-15deg] fill-current" />
      </div>
      <div className="absolute top-1/2 -right-6 text-sky-100 pointer-events-none -z-10 select-none hidden lg:block">
        <PawPrint className="w-36 h-36 rotate-[25deg] fill-current" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e0f0fe] text-[#1d70f5] border border-sky-200/90 rounded-full text-xs sm:text-sm font-bold shadow-xs">
              <PawPrint className="w-4 h-4 fill-current" />
              <span>Voted Best Cozy Spot of 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0e2445] leading-[1.12]">
              Where Sweet Treats <br />
              <span className="text-[#38bdf8] inline-flex items-center gap-3">
                Meet Warm Paws
                <PawPrint className="w-8 h-8 sm:w-11 sm:h-11 text-[#38bdf8] fill-current inline-block align-middle animate-wiggle" />
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              Welcome to Pet Café, a sanctuary where you can savor delicious barista-crafted coffees, indulge in fresh bakeries, and spend unforgettable quality time with our friendly rescue cats, dogs, and rabbits.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBookTable}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a Table</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onMeetPets}
                className="flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-sky-50 text-[#1e75ff] border-2 border-sky-300 font-bold rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
              >
                <PawPrint className="w-5 h-5 fill-current" />
                <span>Meet Our Pets</span>
              </button>
            </div>

            {/* Highlights Floating Bar */}
            <div className="pt-4">
              <div className="bg-white/95 backdrop-blur-md border border-sky-150 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 divide-y sm:divide-y-0 sm:divide-x divide-sky-100">
                
                {/* Feature 1 */}
                <div className="flex items-center gap-3 sm:pr-4">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-[#1e75ff] flex-shrink-0">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2445] leading-snug">Great Coffee</h4>
                    <p className="text-xs text-slate-500 font-medium">Freshly Brewed</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-[#1e75ff] flex-shrink-0">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2445] leading-snug">Delicious Treats</h4>
                    <p className="text-xs text-slate-500 font-medium">Homemade & Fresh</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-[#1e75ff] flex-shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2445] leading-snug">Adopt & Support</h4>
                    <p className="text-xs text-slate-500 font-medium">Give Them a Home</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Organic Blob & Overlapping Animal Photos */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* The Big Soft Organic Sky Blue Blob */}
            <div className="w-[320px] sm:w-[420px] lg:w-[460px] h-[340px] sm:h-[440px] lg:h-[480px] hero-blob-bg relative shadow-2xl shadow-sky-200/60 overflow-hidden flex items-center justify-center group">
              
              {/* Main Cat Photo resting paws on counter (matching screenshot) */}
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80"
                alt="Adorable black and white cat resting paws"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Overlapping Polaroid 1: Golden Retriever Dog */}
            <div className="absolute -top-4 -right-2 sm:-right-4 w-32 sm:w-40 bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/10 border border-sky-100 rotate-[5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-20">
              <div className="w-full h-24 sm:h-32 rounded-xl overflow-hidden bg-amber-50">
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80"
                  alt="Happy Golden Retriever"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-600 text-center mt-1.5 flex items-center justify-center gap-1">
                <span>Milo</span>
                <PawPrint className="w-2.5 h-2.5 text-amber-500 fill-current" />
              </p>
            </div>

            {/* Overlapping Polaroid 2: Cute Fluffy Rabbit */}
            <div className="absolute -bottom-4 right-4 sm:right-8 w-32 sm:w-40 bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/10 border border-sky-100 rotate-[-4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-20">
              <div className="w-full h-24 sm:h-32 rounded-xl overflow-hidden bg-sky-50">
                <img
                  src="https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&auto=format&fit=crop&q=80"
                  alt="Cute Rabbit"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-600 text-center mt-1.5 flex items-center justify-center gap-1">
                <span>Bella</span>
                <Sparkles className="w-2.5 h-2.5 text-sky-500" />
              </p>
            </div>

            {/* Stamp Badge: "Happy Pets Happy Hearts ♡" */}
            <div className="absolute top-10 -right-6 sm:-right-8 bg-sky-100/90 text-sky-800 border-2 border-dashed border-sky-300 rounded-3xl p-3 sm:p-4 rotate-[12deg] shadow-md z-30 hidden sm:block select-none pointer-events-none backdrop-blur-xs">
              <p className="text-xs font-black leading-tight text-center">
                Happy<br />Pets<br />Happy<br />Hearts<br />
                <Heart className="w-3.5 h-3.5 text-sky-600 fill-current inline-block mt-1" />
              </p>
            </div>

            {/* Little floating paw prints and doodles */}
            <div className="absolute -bottom-2 -left-4 text-sky-400 select-none pointer-events-none animate-float-slow">
              <PawPrint className="w-8 h-8 fill-current opacity-80" />
            </div>
            <div className="absolute top-6 left-2 text-sky-300 select-none pointer-events-none animate-float-reverse">
              <PawPrint className="w-6 h-6 fill-current opacity-60" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
