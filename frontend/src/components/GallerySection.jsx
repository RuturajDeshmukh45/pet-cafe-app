import React from 'react';
import { Camera, Sparkles, Heart, Calendar, Clock, Gift } from 'lucide-react';

export function GallerySection({ onBookTable }) {
  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
      title: 'Afternoon Cuddles',
      tag: 'Cozy Corners'
    },
    {
      url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
      title: 'Signature Paw Latte Art',
      tag: 'Barista Specials'
    },
    {
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
      title: 'Milo Making New Friends',
      tag: 'Dog Lounge'
    },
    {
      url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
      title: 'Bunny Snack Time',
      tag: 'Rabbit Haven'
    },
    {
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
      title: 'Fresh Morning Pastries',
      tag: 'Bakery'
    },
    {
      url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80',
      title: 'Oliver Napping in Sunbeam',
      tag: 'Cat Mezzanine'
    }
  ];

  const perks = [
    {
      title: 'Puppy Hour Tuesdays',
      desc: 'Free complimentary doggy treat bowl with any specialty beverage purchased.',
      time: 'Tuesdays, 2 PM - 5 PM',
      badge: '20% Off Coffee'
    },
    {
      title: 'Acoustic Cat Reading Circle',
      desc: 'Quiet reading hours with gentle ambient acoustic melodies and purring companions.',
      time: 'Thursdays, 5 PM - 8 PM',
      badge: 'Free Book Exchange'
    },
    {
      title: 'Weekend Adoption Showcases',
      desc: 'Meet rescue partners and learn how to provide forever homes to shelter pets.',
      time: 'Saturdays & Sundays, 11 AM - 3 PM',
      badge: 'Rescue Partner Event'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-bold">
          <Camera className="w-3.5 h-3.5" />
          <span>Moments Captured In Time</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0e2445] tracking-tight">
          Snapshots of Joy & Purrs
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Every day at Pet Café is filled with warm drinks, joyful wagging tails, and gentle purrs.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 h-72 cursor-pointer"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-black px-3 py-1 rounded-full shadow-xs">
                {img.tag}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h4 className="text-lg font-bold tracking-tight">{img.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Special Offers & Events Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1e75ff] to-[#0e4cb8] p-8 sm:p-10 text-white shadow-xl shadow-blue-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weekly Café Gatherings</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Special Events & Community Days
            </h3>
          </div>
          <button
            onClick={onBookTable}
            className="px-6 py-3 bg-white text-[#1e75ff] font-bold rounded-full text-sm shadow-md hover:bg-sky-50 hover:scale-105 active:scale-95 transition-all cursor-pointer self-start md:self-auto"
          >
            Reserve for an Event →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((perk, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-300 text-slate-900 font-mono">
                  {perk.badge}
                </span>
                <Clock className="w-4 h-4 text-sky-200" />
              </div>
              <h4 className="text-base font-bold leading-snug">{perk.title}</h4>
              <p className="text-xs text-sky-100 font-normal leading-relaxed">{perk.desc}</p>
              <div className="text-[11px] text-sky-200 font-medium flex items-center gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{perk.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
