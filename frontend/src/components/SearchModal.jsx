import React, { useState, useEffect } from 'react';
import { Search, X, PawPrint, Coffee, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export function SearchModal({ isOpen, onClose, onSelectPet, onNavigateToMenu, onOpenRules }) {
  const [query, setQuery] = useState('');
  const [pets, setPets] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    // Prefetch all data for fast instant fuzzy search
    async function loadSearchData() {
      try {
        const [petsRes, menuRes] = await Promise.all([
          api.getPets(),
          api.getMenu()
        ]);
        if (petsRes.success) setPets(petsRes.pets || []);
        if (menuRes.success) setMenuItems(menuRes.items || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadSearchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingPets = q
    ? pets.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.breed.toLowerCase().includes(q) ||
          p.species.toLowerCase().includes(q)
      )
    : pets.slice(0, 3);

  const matchingMenu = q
    ? menuItems.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      )
    : menuItems.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-2xl w-full overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search pets, coffees, bakery, rules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Pets Result */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <PawPrint className="w-3.5 h-3.5 text-[#1e75ff]" />
              <span>Pets ({matchingPets.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchingPets.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onSelectPet(p);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-sky-50 transition-colors cursor-pointer border border-transparent hover:border-sky-150"
                >
                  <img
                    src={p.photo_url || p.photoUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-[#0e2445]">{p.name}</h5>
                    <p className="text-xs text-slate-500">{p.breed} • {p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items Result */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Menu Items ({matchingMenu.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchingMenu.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onClose();
                    onNavigateToMenu(m.category);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-amber-50/60 transition-colors cursor-pointer border border-transparent hover:border-amber-200"
                >
                  <img
                    src={m.image_url || m.imageUrl}
                    alt={m.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-bold text-[#0e2445] truncate">{m.name}</h5>
                    <p className="text-xs text-slate-500">${parseFloat(m.price).toFixed(2)} • {m.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Rules Action */}
          <div
            onClick={() => {
              onClose();
              onOpenRules();
            }}
            className="p-3.5 rounded-2xl bg-sky-50 border border-sky-150 flex items-center justify-between cursor-pointer hover:bg-sky-100/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1e75ff]" />
              <span className="text-xs font-bold text-[#0e2445]">View Pet Café Hygiene & Safety Rules</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1e75ff]" />
          </div>

        </div>

      </div>
    </div>
  );
}
