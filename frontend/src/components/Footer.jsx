import React from 'react';
import { PawPrint, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export function Footer({ setActiveTab, onOpenRules }) {
  return (
    <footer className="bg-white border-t border-sky-100 pt-16 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1e75ff] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <PawPrint className="w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-black text-[#0e2445] tracking-tight">
                Pet Café
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              A cozy haven uniting barista craftsmanship with gentle rescue companion animals. Good Food, Warm Paws, Happy Hearts.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenRules}
                className="text-xs font-bold text-[#1e75ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read Café Safety Guidelines</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0e2445] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#1e75ff] cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pets')} className="hover:text-[#1e75ff] cursor-pointer">
                  Meet Our Resident Pets
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-[#1e75ff] cursor-pointer">
                  Coffee & Fresh Bakery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-[#1e75ff] cursor-pointer">
                  Photo Moments & Events
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#1e75ff] cursor-pointer">
                  About Our Welfare Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0e2445] mb-4">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1e75ff] flex-shrink-0" />
                <span>Monday – Friday: 9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1e75ff] flex-shrink-0" />
                <span>Saturday – Sunday: 10:00 AM – 9:00 PM</span>
              </div>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2 font-medium">
                Pet Nap Period: Daily 1:00 PM - 2:00 PM (Quiet lounge hours)
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0e2445] mb-4">
              Find Us
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1e75ff] flex-shrink-0 mt-0.5" />
                <span>42 Whisker Lane, Central Sanctuary District</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1e75ff] flex-shrink-0" />
                <span>+1 (555) PET-CAFE (738-2233)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1e75ff] flex-shrink-0" />
                <span>hello@petcafe.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Pet Café Management & Customer Experience System. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for animals and coffee lovers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
