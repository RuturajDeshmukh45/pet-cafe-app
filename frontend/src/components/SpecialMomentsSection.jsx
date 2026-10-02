import React from 'react';
import { Coffee, Cake, PawPrint, ArrowUpRight } from 'lucide-react';

export function SpecialMomentsSection({ onSelectCategory }) {
  const moments = [
    {
      id: 'coffee',
      category: 'Coffee',
      title: 'Barista Latte Art',
      subtitle: 'Single-origin beans with adorable foam paw prints',
      icon: Coffee,
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
      actionTab: 'menu',
      filter: 'Coffee'
    },
    {
      id: 'treats',
      category: 'Treats',
      title: 'Fresh Artisan Bakeries',
      subtitle: 'Warm croissants, cinnamon swirls, and fruit waffles',
      icon: Cake,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
      actionTab: 'menu',
      filter: 'Bakery'
    },
    {
      id: 'pets',
      category: 'Our Pets',
      title: 'Rescue Companions',
      subtitle: 'Spend peaceful afternoons with loving furry friends',
      icon: PawPrint,
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
      actionTab: 'pets',
      filter: 'All'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1e75ff] uppercase tracking-wider">
          <span className="w-8 h-[2px] bg-sky-300 rounded-full"></span>
          <span>Our Special Moments</span>
          <span className="w-8 h-[2px] bg-sky-300 rounded-full"></span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0e2445]">
          Good food, great company, and adorable friends.
        </h2>
      </div>

      {/* 3 Featured Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {moments.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.actionTab, item.filter)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-sky-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="h-64 sm:h-72 w-full overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-[#0e2445] shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-[#1e75ff]" />
                  <span>{item.category}</span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold tracking-tight mb-1">{item.title}</h3>
                  <p className="text-xs text-sky-100/90 font-medium line-clamp-1">{item.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
