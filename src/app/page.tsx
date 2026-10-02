import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db';
import { 
  Calendar, 
  Coffee, 
  ArrowRight, 
  ShieldCheck, 
  PawPrint, 
  UtensilsCrossed, 
  Star, 
  Heart,
  Cake,
  Sparkles
} from 'lucide-react';

export const revalidate = 0; // Disable cache to get real-time database content

export default async function Home() {
  // Fetch featured pets and menu items from database
  const pets = await prisma.pet.findMany({ take: 3, where: { status: 'Available' } });
  const menuItems = await prisma.menuItem.findMany({ take: 3, where: { status: 'Available' } });
  const reviews = await prisma.review.findMany({ take: 2, where: { status: 'Approved', rating: 5 }, include: { user: true } });

  return (
    <div className="space-y-16 sm:space-y-20 animate-fade-in relative pb-12">
      
      {/* Decorative background paw watermarks */}
      <div className="absolute -top-10 -left-10 text-sky-200/40 pointer-events-none -z-10 select-none">
        <PawPrint className="w-32 h-32 rotate-[-20deg] fill-current" />
      </div>
      <div className="absolute top-1/3 -right-8 text-sky-150/30 pointer-events-none -z-10 select-none">
        <PawPrint className="w-40 h-40 rotate-[25deg] fill-current" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-4 pb-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Hero Left Content */}
        <div className="flex-1 space-y-6 text-left max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e0f0fe] text-[#1d70f5] border border-sky-200/90 rounded-full text-xs font-bold shadow-xs">
            <PawPrint className="w-3.5 h-3.5 fill-current" />
            <span>Voted Best Cozy Spot of 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0e2445] leading-[1.12]">
            Where Sweet Treats <br />
            <span className="text-[#38bdf8] inline-flex items-center gap-3">
              Meet Warm Paws
              <PawPrint className="w-9 h-9 sm:w-11 sm:h-11 text-[#38bdf8] fill-current inline-block align-middle animate-wiggle" />
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Welcome to Pet Café, a sanctuary where you can savor delicious barista-crafted coffees, indulge in fresh bakeries, and spend unforgettable quality time with our friendly rescue cats, dogs, and rabbits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/customer/book"
              className="flex items-center gap-2 px-7 py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              <Calendar className="w-5 h-5" />
              <span>Book a Table</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/pets"
              className="flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-sky-50 text-[#1e75ff] border-2 border-sky-300 font-bold rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              <PawPrint className="w-5 h-5" />
              <span>Meet Our Pets</span>
            </Link>
          </div>

          {/* Highlights Floating Bar */}
          <div className="pt-2">
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
                  <PawPrint className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0e2445] leading-snug">Adopt & Support</h4>
                  <p className="text-xs text-slate-500 font-medium">Give Them a Home</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Hero Right Visual Graphic (Collage & Doodles matching reference) */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
          
          {/* Organic Fluid Sky-Blue Blob Background */}
          <div className="absolute inset-2 sm:inset-4 bg-gradient-to-tr from-[#cfe6fc] via-[#dcedfd] to-[#d3eaff] hero-blob opacity-95 shadow-inner" />

          {/* Doodled Heart on left */}
          <div className="absolute left-1 sm:left-2 bottom-20 text-[#38bdf8] text-2xl font-bold select-none animate-float">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>

          {/* Doodled Decorative Swoosh on top */}
          <div className="absolute top-4 right-1/3 select-none text-sky-400">
            <svg width="45" height="24" viewBox="0 0 50 25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 20 C 15 5, 35 5, 45 15" />
            </svg>
          </div>

          {/* Doodled Leaves / Sparkle */}
          <div className="absolute top-10 right-28 select-none text-sky-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 C13 7 17 11 22 12 C17 13 13 17 12 22 C11 17 7 13 2 12 C7 11 11 7 12 2 Z" opacity="0.7"/>
            </svg>
          </div>

          {/* Doodled Paw Print watermark on bottom right */}
          <div className="absolute bottom-6 right-8 text-sky-300 select-none">
            <PawPrint className="w-7 h-7 fill-current opacity-70" />
          </div>

          {/* "Happy Pets Happy Hearts" Chalk Badge */}
          <div className="absolute -top-3 right-0 sm:right-2 z-20 select-none">
            <div className="relative bg-[#d3ebfd] text-[#1d70f5] px-4 py-3 rounded-3xl shadow-sm border border-sky-200/60 rotate-6 backdrop-blur-sm">
              <div className="font-handwriting text-center leading-tight">
                <span className="block text-lg font-bold text-[#1e75ff]">Happy Pets</span>
                <span className="block text-base font-bold text-[#1e75ff]">Happy Hearts</span>
                <span className="block text-sm text-[#1e75ff]">♡</span>
              </div>
            </div>
          </div>

          {/* Main Tuxedo Cat Image in Organic Curved Shape */}
          <div className="relative z-10 w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/hero-cat.jpg"
              alt="Cozy Tuxedo Cat resting in Pet Café"
              fill
              priority
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 270px, 320px"
            />
          </div>

          {/* Stacked Floating Polaroid Cards */}
          {/* Polaroid 1: Golden Retriever Dog */}
          <div className="absolute top-8 sm:top-10 right-2 sm:right-4 z-20 w-28 sm:w-36 aspect-square rounded-2xl polaroid-card rotate-[6deg] overflow-hidden">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/images/hero-dog.jpg"
                alt="Happy Golden Retriever"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 112px, 144px"
              />
            </div>
          </div>

          {/* Polaroid 2: Cute Rabbit */}
          <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-20 w-28 sm:w-36 aspect-square rounded-2xl polaroid-card rotate-[-3deg] overflow-hidden">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/images/hero-rabbit.jpg"
                alt="Cute Soft Rabbit"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 112px, 144px"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Safe Handling & Rules Banner (Middle card exactly like reference image) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#e1f0fe] via-[#f0f7ff] to-[#e4f1fe] border border-sky-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        
        {/* Subtle Watermarks */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300/40 select-none pointer-events-none">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sky-200/60 select-none pointer-events-none">
          <PawPrint className="w-24 h-24 fill-current" />
        </div>

        {/* Content */}
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-full bg-white text-[#1e75ff] shadow-md border border-sky-200 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#0e2445]">Safe Handling & Rules</h3>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              To keep our animal companions healthy and happy, we sanitize hands before entry, avoid waking sleeping pets, and only feed them approved café pet treats.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10 flex-shrink-0">
          <Link
            href="/about#rules"
            className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-sky-50 text-[#1e75ff] border border-sky-300 font-bold rounded-full text-sm shadow-xs transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>View Café Rules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Our Special Moments Section (Featured Moments from reference image) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-4">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-sky-300 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-[#0e2445] tracking-tight">
              Our Special Moments
            </h2>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-sky-300 rounded-full" />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Good food, great company, and adorable friends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Coffee */}
          <div className="group relative rounded-3xl overflow-hidden shadow-md border border-sky-100 bg-white aspect-[16/11]">
            <Image
              src="/images/moment-coffee.jpg"
              alt="Freshly brewed coffee"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-[#0e2445] rounded-full text-xs font-bold shadow-md border border-white">
                <Coffee className="w-3.5 h-3.5 text-[#1e75ff]" />
                <span>Coffee</span>
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
              <p className="text-sm font-bold">Barista Crafted Roast</p>
              <p className="text-xs text-white/80">Made fresh to energize your cuddle session</p>
            </div>
          </div>

          {/* Card 2: Bakery Treats */}
          <div className="group relative rounded-3xl overflow-hidden shadow-md border border-sky-100 bg-white aspect-[16/11]">
            <Image
              src="/images/moment-treats.jpg"
              alt="Delicious Bakery Treats"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-[#0e2445] rounded-full text-xs font-bold shadow-md border border-white">
                <Cake className="w-3.5 h-3.5 text-[#1e75ff]" />
                <span>Treats</span>
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
              <p className="text-sm font-bold">Buttery Croissants & Bakery</p>
              <p className="text-xs text-white/80">Warm homemade delicacies baked each morning</p>
            </div>
          </div>

          {/* Card 3: Our Pets */}
          <div className="group relative rounded-3xl overflow-hidden shadow-md border border-sky-100 bg-white aspect-[16/11]">
            <Image
              src="/images/moment-pets.jpg"
              alt="Our Playful Pets"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-[#0e2445] rounded-full text-xs font-bold shadow-md border border-white">
                <PawPrint className="w-3.5 h-3.5 text-[#1e75ff] fill-current" />
                <span>Our Pets</span>
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
              <p className="text-sm font-bold">Unconditional Love</p>
              <p className="text-xs text-white/80">Sweet rescue animals eagerly waiting for hugs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Friends (Database pets showcase) */}
      <section className="space-y-6 pt-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-[#0e2445]">Meet Our Friends</h2>
            <p className="text-slate-500 text-sm max-w-md">Our cuddly companions are ready to play and relax with you.</p>
          </div>
          <Link 
            href="/pets" 
            className="text-sm font-bold text-[#1e75ff] hover:text-blue-700 transition-colors flex items-center gap-1.5 bg-sky-50 px-4 py-2 rounded-full border border-sky-200"
          >
            <span>View All Pets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="glass-card rounded-3xl overflow-hidden flex flex-col border border-sky-100 bg-white shadow-sm hover:shadow-xl transition-all">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={pet.photoUrl}
                    alt={pet.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                    {pet.status}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
                    {pet.species}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-bold text-[#0e2445] flex items-center gap-1.5">
                        <span>{pet.name}</span>
                        <Sparkles className="w-4 h-4 text-sky-400" />
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-150">
                        {pet.breed}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{pet.description}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-sky-100 flex justify-between text-xs text-slate-500 font-medium">
                    <span>Age: <b className="text-[#0e2445]">{pet.age} months</b></span>
                    <Link href={`/pets?search=${pet.name}`} className="text-[#1e75ff] font-bold hover:underline">
                      View Profile &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-sky-50/50 rounded-2xl border border-sky-150">
              No pets available. Seed the database to show items!
            </div>
          )}
        </div>
      </section>

      {/* Featured Menu items */}
      <section className="space-y-6 pt-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-[#0e2445]">From Our Kitchen</h2>
            <p className="text-slate-500 text-sm max-w-md">Try our delicious human treats, crafted freshly by our in-house baristas.</p>
          </div>
          <Link 
            href="/menu" 
            className="text-sm font-bold text-[#1e75ff] hover:text-blue-700 transition-colors flex items-center gap-1.5 bg-sky-50 px-4 py-2 rounded-full border border-sky-200"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex gap-4 p-4 items-center border border-sky-100 bg-white hover:border-sky-300">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-[#0e2445] line-clamp-1">{item.name}</h3>
                    <span className="text-sm font-extrabold text-[#1e75ff]">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-sky-50/50 rounded-2xl border border-sky-150">
              No menu items available. Seed the database to show items!
            </div>
          )}
        </div>
      </section>

      {/* Reviews Showcase */}
      <section className="py-6 space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-[#0e2445]">Loved by Our Guests</h2>
          <p className="text-slate-500 text-sm">Read real feedback from guests who have spent time at our café.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="text-right text-xs font-bold text-[#1e75ff]">
                  — {rev.user.name}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 bg-sky-50/50 rounded-2xl border border-sky-150">
              No reviews available yet. Be the first to leave one!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
