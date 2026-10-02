import React from 'react';
import { X, PawPrint, Calendar, Heart, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function PetDetailModal({ pet, isOpen, onClose, onBookWithPet }) {
  const { isStaff, isAdmin } = useAuth();

  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-xl w-full overflow-hidden relative max-h-[85vh] flex flex-col">
        
        {/* Top Image Banner */}
        <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={pet.photo_url || pet.photoUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white transition-colors cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white flex items-end justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs mb-1 inline-block">
                {pet.species} • {pet.breed}
              </span>
              <h3 className="text-3xl font-black">{pet.name}</h3>
            </div>
            <span className="text-sm font-bold bg-white text-slate-800 px-3 py-1 rounded-full shadow-md">
              {pet.age} months old
            </span>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Status & Highlights */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${
              pet.status === 'Available'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : pet.status === 'Playing'
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              Status: {pet.status}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#1e75ff] border border-sky-200">
              Vaccinated & Microchipped
            </span>
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              About {pet.name}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {pet.description}
            </p>
          </div>

          {/* Handling & Restrictions */}
          {pet.restrictions && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
              <h5 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-current" />
                <span>Interaction Tips</span>
              </h5>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {pet.restrictions}
              </p>
            </div>
          )}

          {/* Staff-only care notes (visible only if logged in as staff or admin) */}
          {(isStaff || isAdmin) && pet.care_notes && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
              <h5 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                <span>Staff Care & Medication Notes (Internal)</span>
              </h5>
              <p className="text-xs text-purple-900 leading-relaxed font-mono">
                {pet.care_notes}
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookWithPet(pet);
            }}
            disabled={pet.status === 'Unavailable'}
            className="flex-1 py-3 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Slot with {pet.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
