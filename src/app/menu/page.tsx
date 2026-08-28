'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, DollarSign } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
}

export default function MenuCatalog() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (category !== 'All') query.set('category', category);

      const res = await fetch(`/api/menu?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.menuItems);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [category]);

  const categories = ['All', 'Coffee', 'Tea', 'Bakery', 'Beverage'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Our Café Menu</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sip and snack on delicious, freshly brewed specialty beverages and yummy cat-themed pastries. Carefully curated with quality local ingredients.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex justify-center flex-wrap gap-2 text-sm">
        <div className="flex flex-wrap justify-center rounded-2xl bg-muted p-1 border border-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center w-full">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-xs font-semibold">Loading menu items...</span>
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={`glass-panel p-4 rounded-2xl border border-border flex gap-4 items-center transition-all ${
                item.status === 'Unavailable' ? 'opacity-60' : 'hover:scale-[1.01] hover:border-accent/40'
              }`}
            >
              {/* Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow border border-border">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
                {item.status === 'Unavailable' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-grow space-y-1.5">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-lg font-bold text-foreground line-clamp-1">{item.name}</h3>
                  <span className="text-base font-extrabold text-accent flex items-center">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{item.price.toFixed(2)}</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-full border border-border text-[9px] font-extrabold uppercase">
                    {item.category}
                  </span>
                  <span className={item.status === 'Available' ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                    {item.status === 'Available' ? 'Available now' : 'Sold out'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel py-16 text-center text-muted-foreground rounded-2xl">
          No menu items found in this category.
        </div>
      )}
    </div>
  );
}
