import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Check, Search, UtensilsCrossed, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export function MenuSection({ initialCategory = 'All' }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cart } = useCart();

  useEffect(() => {
    if (initialCategory) {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.getMenu(params);
      if (res.success) {
        setMenuItems(res.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [categoryFilter, searchQuery]);

  const categories = ['All', 'Coffee', 'Tea', 'Bakery', 'Desserts', 'Savory Snacks'];

  const getItemCartQty = (id) => {
    const found = cart.find((item) => item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Café Kitchen & Barista Counter</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e2445] tracking-tight">
            Fresh Sips & Artisan Bites
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Crafted with organic ingredients, specialty grade coffee beans, and served with a smile.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coffee, bakery, snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-200 rounded-full text-sm focus:outline-none focus:border-[#1e75ff] focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#1e75ff] text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-sky-100 hover:border-sky-300 hover:bg-sky-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-sky-200 p-8">
          <Coffee className="w-12 h-12 text-sky-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No menu items found</h3>
          <p className="text-sm text-slate-500 mt-1">Try another category or search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const inCartCount = getItemCartQty(item.id);
            const isAvailable = item.status === 'Available';

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-sky-150 p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex gap-4 group"
              >
                {/* Item Thumbnail */}
                <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                  <img
                    src={item.image_url || item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-1 text-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Details & Add to Cart */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[11px] font-black text-[#1e75ff] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-base font-black text-[#0e2445]">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0e2445] leading-snug line-clamp-1 mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {inCartCount > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {inCartCount} in order
                      </span>
                    )}

                    <button
                      disabled={!isAvailable}
                      onClick={() => addToCart(item, 1)}
                      className={`ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        !isAvailable
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-[#1e75ff] hover:bg-blue-600 text-white shadow-xs hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{inCartCount > 0 ? 'Add Another' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
