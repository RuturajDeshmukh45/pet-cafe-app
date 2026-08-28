'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
}

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
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
    category: 'Coffee',
    description: '',
    price: '',
    imageUrl: '',
    status: 'Available',
  });

  const router = useRouter();

  const fetchMenu = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== 'Admin') {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/menu');
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
  }, []);

  const openAddModal = () => {
    setForm({
      name: '',
      category: 'Coffee',
      description: '',
      price: '',
      imageUrl: '',
      status: 'Available',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl,
      status: item.status,
    });
    setEditId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.imageUrl) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSuccess('');

    const payload = {
      ...form,
      price: parseFloat(form.price),
    };

    try {
      const url = isEditing ? `/api/menu/${editId}` : '/api/menu';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(isEditing ? 'Menu item updated' : 'Menu item created');
        setShowModal(false);
        fetchMenu();
      } else {
        setError(data.error || 'Failed to save menu item.');
      }
    } catch (e) {
      setError('Something went wrong.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Menu item deleted');
        fetchMenu();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete menu item.');
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
          <h1 className="text-3xl font-extrabold text-foreground">Menu Catalogue Manager</h1>
          <p className="text-sm text-muted-foreground">Add, edit, or delete items on the café food & beverage menu.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1 px-4.5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow hover:bg-opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
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
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow border border-border flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" unoptimized />
                    </div>
                    <div>
                      <div className="font-bold text-base">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
                        {item.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-accent">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-secondary/40 text-secondary-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
                {isEditing ? 'Modify Menu Item' : 'Add New Menu Item'}
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
                  <label className="font-semibold text-muted-foreground">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm font-semibold"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min={0.01}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer"
              >
                <span>Save Menu Item</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
