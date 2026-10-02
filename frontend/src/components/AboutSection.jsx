import React from 'react';
import { ShieldCheck, Heart, Stethoscope, Sparkles, Award, Users } from 'lucide-react';

export function AboutSection({ onBookTable }) {
  const values = [
    {
      icon: Stethoscope,
      title: 'Veterinary Oversight',
      desc: 'Weekly checkups, up-to-date vaccinations, microchipping, and individualized wellness routines for every pet.'
    },
    {
      icon: ShieldCheck,
      title: 'Hospital-Grade Hygiene',
      desc: 'Separate sterile kitchen preparation zones, continuous medical HEPA air filtration, and mandatory customer sanitization.'
    },
    {
      icon: Heart,
      title: 'Animal-First Ethics',
      desc: 'Our pets are never forced to interact. They enjoy dedicated quiet mezzanine suites with unlimited nap privileges.'
    },
    {
      icon: Award,
      title: 'Rescue & Adoption',
      desc: 'Over 140 rescue cats, dogs, and rabbits rehomed through our vetted shelter partnership network since 2023.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-100 text-[#1e75ff] rounded-full text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Our Heartwarming Story</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0e2445] tracking-tight leading-tight">
            Where Animal Welfare Meets Exceptional Hospitality
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Pet Café was founded with a singular dream: to create a joyful sanctuary where rescue animals could thrive in an enriching, loving environment while bringing stress-free warmth, companionship, and delicious comfort food to café lovers.
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike traditional establishments, our café is designed from the ground up around animal behavior and comfort. With multi-tiered catwalks, indoor rabbit tunnels, sound-dampened chill zones, and strict capacity limits, our animals live their best lives every single day.
          </p>

          <div className="pt-2">
            <button
              onClick={onBookTable}
              className="px-7 py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
            >
              Plan Your Visit Today →
            </button>
          </div>
        </div>

        {/* Visual Card */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sky-50">
            <img
              src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000&auto=format&fit=crop&q=80"
              alt="Pet Cafe team and happy pets"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-sky-100 max-w-xs hidden sm:block animate-float-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                100%
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0e2445]">Ethical Care Guarantee</h4>
                <p className="text-[11px] text-slate-500">Certified by Local Humane Society</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={i} className="bg-white rounded-3xl p-6 border border-sky-150 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#1e75ff] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0e2445] mb-2">{v.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{v.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
