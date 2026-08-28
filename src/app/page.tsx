import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db';
import { Calendar, Coffee, Users, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const revalidate = 0; // Disable cache to get real-time database content

export default async function Home() {
  // Fetch featured pets and menu items from database
  const pets = await prisma.pet.findMany({ take: 3, where: { status: 'Available' } });
  const menuItems = await prisma.menuItem.findMany({ take: 3, where: { status: 'Available' } });
  const reviews = await prisma.review.findMany({ take: 2, where: { status: 'Approved', rating: 5 }, include: { user: true } });

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-accent animate-pulse-slow fill-current" />
            <span>Voted Best Cozy Spot of 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Where Sweet Treats <br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Meet Warm Paws
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Welcome to Pet Café, a sanctuary where you can savor delicious barista-crafted coffees, indulge in fresh bakeries, and spend unforgettable quality time with our friendly rescue cats, dogs, and rabbits.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/customer/book"
              className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-opacity-95 hover:translate-y-[-2px] transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Book a Table</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pets"
              className="flex items-center gap-2 px-6 py-3.5 bg-muted text-foreground border border-border font-bold rounded-xl hover:bg-secondary/40 hover:translate-y-[-2px] transition-all"
            >
              <Users className="w-5 h-5 text-accent" />
              <span>Meet Our Pets</span>
            </Link>
          </div>
        </div>

        {/* Hero Image / Card Grid */}
        <div className="flex-1 relative w-full flex items-center justify-center">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-accent to-primary opacity-30 blur-2xl"></div>
          <div className="relative grid grid-cols-2 gap-4 max-w-md w-full">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-border">
                <Image
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80"
                  alt="Cat Cafe"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="glass-card p-4 rounded-2xl text-center">
                <h4 className="text-2xl font-bold text-primary">12+</h4>
                <p className="text-xs text-muted-foreground">Adorable Pets</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="glass-card p-4 rounded-2xl text-center">
                <h4 className="text-2xl font-bold text-accent">4.9★</h4>
                <p className="text-xs text-muted-foreground">Customer Rating</p>
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-border">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
                  alt="Dog Cafe"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules / Standard Guidelines banner */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-border shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary text-secondary-foreground rounded-2xl text-accent shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Safe Handling & Rules</h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              To keep our animal companions healthy and happy, we sanitize hands before entry, avoid waking sleeping pets, and only feed them approved café pet treats.
            </p>
          </div>
        </div>
        <Link
          href="/about#rules"
          className="px-5 py-2.5 bg-secondary text-secondary-foreground text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-all text-center whitespace-nowrap"
        >
          View Cafe Rules
        </Link>
      </section>

      {/* Meet the Pets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground">Meet Our Friends</h2>
            <p className="text-muted-foreground text-sm max-w-md">Our cuddly friends are ready to play and relax with you.</p>
          </div>
          <Link href="/pets" className="text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-1">
            <span>View All Pets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="glass-card rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={pet.photoUrl}
                    alt={pet.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-md">
                    {pet.status}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-bold text-foreground">{pet.name}</h3>
                      <span className="text-xs text-muted-foreground">{pet.breed}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{pet.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex justify-between text-[11px] text-muted-foreground">
                    <span>Species: <b>{pet.species}</b></span>
                    <span>Age: <b>{pet.age} months</b></span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No pets available. Seed the database to show items!
            </div>
          )}
        </div>
      </section>

      {/* Featured Menu items */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground">From Our Kitchen</h2>
            <p className="text-muted-foreground text-sm max-w-md">Try our delicious human treats, crafted freshly by our in-house baristas.</p>
          </div>
          <Link href="/menu" className="text-sm font-bold text-accent hover:text-primary transition-colors flex items-center gap-1">
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex gap-4 p-4 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
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
                    <h3 className="text-base font-bold text-foreground line-clamp-1">{item.name}</h3>
                    <span className="text-sm font-extrabold text-accent">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No menu items available. Seed the database to show items!
            </div>
          )}
        </div>
      </section>

      {/* Reviews Showcase */}
      <section className="py-6 space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-foreground">Loved by Our Guests</h2>
          <p className="text-muted-foreground text-sm">Read real feedback from guests who have spent time at our café.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="glass-panel p-6 rounded-2xl border border-border shadow space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="text-right text-xs font-bold text-primary">
                  — {rev.user.name}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-muted-foreground">
              No reviews available yet. Be the first to leave one!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
