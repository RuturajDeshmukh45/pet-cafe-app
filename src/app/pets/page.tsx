'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  photoUrl: string;
  status: string;
  restrictions: string | null;
}

export default function PetsCatalog() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('All');
  const [status, setStatus] = useState('All');

  const fetchPets = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (species !== 'All') query.set('species', species);
      if (status !== 'All') query.set('status', status);
      if (search) query.set('search', search);

      const res = await fetch(`/api/pets?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPets(data.pets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPets();
    }, 300); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [search, species, status]);

  const categories = ['All', 'Cat', 'Dog', 'Rabbit'];
  const statuses = ['All', 'Available', 'Playing', 'Resting'];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500 text-white';
      case 'Playing':
        return 'bg-blue-500 text-white';
      case 'Resting':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Meet Our Furry Residents</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Click filters below to find cats, dogs, or rabbits. Check their current status (playing, resting, or available) to see who you can interact with!
        </p>
      </div>

      {/* Filters Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by name, breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
          />
          <Search className="w-4.5 h-4.5 text-muted-foreground absolute left-3.5 top-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto items-center justify-end text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground text-xs">Species:</span>
            <div className="flex rounded-xl bg-muted p-1 border border-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSpecies(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    species === cat
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground text-xs">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-xs font-semibold"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center w-full">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-xs font-semibold">Loading pets profiles...</span>
          </div>
        </div>
      ) : pets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div key={pet.id} className="glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-border">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={pet.photoUrl}
                  alt={pet.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <span className={`absolute top-4 right-4 px-3 py-1 text-[11px] font-bold rounded-full shadow-md ${getStatusBadgeClass(pet.status)}`}>
                  {pet.status}
                </span>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-1.5">
                      <span>{pet.name}</span>
                      <Sparkles className="w-4 h-4 text-accent animate-float" />
                    </h3>
                    <span className="px-2.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-extrabold uppercase rounded border border-border">
                      {pet.breed}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {pet.description}
                  </p>
                </div>

                {pet.restrictions && (
                  <div className="flex items-start gap-2 p-3 bg-amber-500/5 text-amber-600 rounded-xl text-xs border border-amber-500/10">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><b>Caution:</b> {pet.restrictions}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                  <span>Species: <b className="text-foreground">{pet.species}</b></span>
                  <span>Age: <b className="text-foreground">{pet.age} months</b></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel py-16 text-center text-muted-foreground rounded-2xl">
          No pets matching your filter criteria. Try adjusting your query!
        </div>
      )}
    </div>
  );
}
