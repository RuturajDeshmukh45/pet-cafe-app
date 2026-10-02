import React from 'react';
import { ShieldCheck, ArrowRight, PawPrint, Heart } from 'lucide-react';

export function SafeHandlingBanner({ onOpenRules }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-blue-50/50 to-sky-100/60 border border-sky-200/80 p-6 sm:p-8 shadow-xs">
        
        {/* Soft Heart Watermark */}
        <div className="absolute top-4 left-6 text-sky-300/40 pointer-events-none select-none">
          <Heart className="w-8 h-8 stroke-current" />
        </div>

        {/* Soft Paw Watermark on right */}
        <div className="absolute -bottom-4 right-6 text-sky-200/50 pointer-events-none select-none">
          <PawPrint className="w-20 h-20 rotate-12 fill-current" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Shield Icon in circle */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-[#1e75ff] shadow-sm flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-2xl">
              <h3 className="text-lg sm:text-xl font-black text-[#0e2445] tracking-tight">
                Safe Handling & Rules
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                To keep our animal companions healthy and happy, we sanitize hands before entry, avoid waking sleeping pets, and only feed them approved café pet treats.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRules}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-sky-50 text-[#1e75ff] border-2 border-sky-300 font-bold rounded-full shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex-shrink-0 cursor-pointer"
          >
            <span>View Café Rules</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}
