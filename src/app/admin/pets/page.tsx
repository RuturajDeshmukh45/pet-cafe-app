'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  photoUrl: string;
  status: string;
  careNotes: string | null;
  restrictions: string | null;
}

export default function PetsManager() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  
  // Form states
  const [form, setForm] = useState({
    name: '',
    species: 'Cat',
    breed: '',
    age: '',
    description: '',
    photoUrl: '',
    status: 'Available',
    careNotes: '',
    restrictions: '',
  });

  const router = useRouter();

  const fetchPets = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== 'Admin') {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/pets');
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
    fetchPets();
  }, []);

  const openAddModal = () => {
    setForm({
      name: '',
      species: 'Cat',
      breed: '',
      age: '',
      description: '',
      photoUrl: '',
      status: 'Available',
      careNotes: '',
      restrictions: '',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (pet: Pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      description: pet.description,
      photoUrl: pet.photoUrl,
      status: pet.status,
      careNotes: pet.careNotes || '',
      restrictions: pet.restrictions || '',
    });
    setEditId(pet.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.breed || !form.age || !form.description || !form.photoUrl) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSuccess('');
    
    const payload = {
      ...form,
      age: parseInt(form.age),
    };

    try {
      const url = isEditing ? `/api/pets/${editId}` : '/api/pets';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(isEditing ? 'Pet updated successfully' : 'Pet added successfully');
        setShowModal(false);
        fetchPets();
      } else {
        setError(data.error || 'Failed to save pet profile.');
      }
    } catch (e) {
      setError('Something went wrong.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pet profile? This action is permanent.')) return;
    
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Pet deleted successfully');
        fetchPets();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete pet.');
      }
    } catch (e) {
      setError('Something went wrong.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground">Pets Catalogue Manager</h1>
          <p className="text-sm text-muted-foreground">Add, update, or remove pets in the café system.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 px-4.5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow hover:bg-opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pet</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-green-500/10 text-green-600 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-4.5 h-4.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Table */}
      <div className="glass-panel rounded-2xl border border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Breed</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow border border-border flex-shrink-0">
                      <Image src={pet.photoUrl} alt={pet.name} fill sizes="48px" className="object-cover" unoptimized />
                    </div>
                    <div>
                      <div className="font-bold text-base">{pet.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">{pet.species}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{pet.breed}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{pet.age} months</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                      {pet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(pet)}
                      className="p-2 bg-secondary/40 text-secondary-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="p-2 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-border shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-xl font-bold text-foreground">
                {isEditing ? 'Modify Pet Profile' : 'Add New Pet to Café'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Species *</label>
                  <select
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm font-semibold"
                  >
                    <option value="Cat">Cat</option>
                    <option value="Dog">Dog</option>
                    <option value="Rabbit">Rabbit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Breed *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ragdoll, Golden Retriever"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Age (in months) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Photo URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm font-semibold"
                >
                  <option value="Available">Available</option>
                  <option value="Playing">Playing</option>
                  <option value="Resting">Resting</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Care Notes (Staff only)</label>
                <input
                  type="text"
                  placeholder="e.g. Specific food times, special traits"
                  value={form.careNotes}
                  onChange={(e) => setForm({ ...form, careNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Interaction Restrictions</label>
                <input
                  type="text"
                  placeholder="e.g. Do not lift up, gentle pets only"
                  value={form.restrictions}
                  onChange={(e) => setForm({ ...form, restrictions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer"
              >
                <span>Save Pet Profile</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
