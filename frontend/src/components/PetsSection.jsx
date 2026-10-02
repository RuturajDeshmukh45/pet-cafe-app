import React, { useState, useEffect } from 'react';
import { PawPrint, Heart, Info, Calendar, Sparkles, Filter, Search } from 'lucide-react';
import { api } from '../services/api';

export function PetsSection({ onSelectPet, onBookWithPet }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (speciesFilter !== 'All') params.species = speciesFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.getPets(params);
      if (res.success) {
        setPets(res.pets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [speciesFilter, statusFilter, searchQuery]);

  const speciesOptions = ['All', 'Cat', 'Dog', 'Rabbit'];
  const statusOptions = ['All', 'Available', 'Playing', 'Resting'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Playing':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Resting':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-[#1e75ff] rounded-full text-xs font-bold mb-2">
            <PawPrint className="w-3.5 h-3.5 fill-current" />
            <span>Meet Our Resident Companions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e2445] tracking-tight">
            Our Adorable Furry Friends
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            All our animals are ethically rescued, vaccinated, well-socialized, and showered with daily love.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-200 rounded-full text-sm focus:outline-none focus:border-[#1e75ff] focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-sky-100 shadow-xs mb-8">
        {/* Species Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Species:</span>
          {speciesOptions.map((species) => (
            <button
              key={species}
              onClick={() => setSpeciesFilter(species)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                speciesFilter === species
                  ? 'bg-[#1e75ff] text-white shadow-xs'
                  : 'bg-sky-50 text-slate-600 hover:bg-sky-100'
              }`}
            >
              {species}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-sky-200 p-8">
          <PawPrint className="w-12 h-12 text-sky-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No pets found matching your criteria</h3>
          <p className="text-sm text-slate-500 mt-1">Try clearing your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="group bg-white rounded-3xl border border-sky-150 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Image & Status Badge */}
              <div className="h-56 w-full relative overflow-hidden bg-slate-50">
                <img
                  src={pet.photo_url || pet.photoUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs ${getStatusBadge(pet.status)}`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {pet.status}
                  </span>
                </div>

                {/* Species Badge */}
                <div className="absolute top-3.5 right-3.5 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {pet.species}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#0e2445] tracking-tight">{pet.name}</h3>
                    <span className="text-xs font-semibold text-slate-500">{pet.age} mos old</span>
                  </div>
                  <p className="text-xs font-bold text-[#1e75ff] mt-0.5">{pet.breed}</p>
                  
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                    {pet.description}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectPet(pet)}
                    className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-[#1e75ff] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Story</span>
                  </button>

                  <button
                    disabled={pet.status === 'Unavailable'}
                    onClick={() => onBookWithPet(pet)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      pet.status === 'Unavailable'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#1e75ff] hover:bg-blue-600 text-white shadow-xs hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
