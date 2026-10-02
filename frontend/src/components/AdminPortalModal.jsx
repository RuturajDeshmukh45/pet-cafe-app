import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  Users, 
  PawPrint, 
  Plus, 
  Trash2, 
  Check, 
  EyeOff, 
  Eye, 
  FileText,
  UtensilsCrossed
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function AdminPortalModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals for adding
  const [showAddPet, setShowAddPet] = useState(false);
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'Cat',
    breed: '',
    age: 12,
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    status: 'Available',
    careNotes: '',
    restrictions: ''
  });

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: 'Coffee',
    description: '',
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    status: 'Available'
  });

  const { showToast } = useToast();

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, petsRes, menuRes, usersRes, reviewsRes, logsRes] = await Promise.all([
        api.getAdminStats(),
        api.getPets(),
        api.getMenu(),
        api.getUsers(),
        api.getAllReviews(),
        api.getAuditLogs()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (petsRes.success) setPets(petsRes.pets || []);
      if (menuRes.success) setMenuItems(menuRes.items || []);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (reviewsRes.success) setReviews(reviewsRes.reviews || []);
      if (logsRes.success) setAuditLogs(logsRes.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add Pet handler
  const handleCreatePet = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createPet(petForm);
      if (res.success) {
        showToast(res.message || 'Pet created successfully!', 'success');
        setShowAddPet(false);
        setPetForm({
          name: '',
          species: 'Cat',
          breed: '',
          age: 12,
          description: '',
          photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
          status: 'Available',
          careNotes: '',
          restrictions: ''
        });
        loadAdminData();
      } else {
        showToast(res.message || 'Failed to add pet.', 'error');
      }
    } catch (err) {
      showToast('Error adding pet.', 'error');
    }
  };

  const handleDeletePet = async (id) => {
    if (!window.confirm('Are you sure you want to remove this pet profile?')) return;
    try {
      const res = await api.deletePet(id);
      if (res.success) {
        showToast('Pet removed.', 'info');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error deleting pet.', 'error');
    }
  };

  // Add Menu Item handler
  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createMenuItem(menuForm);
      if (res.success) {
        showToast(res.message || 'Menu item created!', 'success');
        setShowAddMenu(false);
        loadAdminData();
      } else {
        showToast(res.message || 'Failed to add item.', 'error');
      }
    } catch (err) {
      showToast('Error adding menu item.', 'error');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        showToast('Menu item removed.', 'info');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error deleting item.', 'error');
    }
  };

  const handleToggleMenuAvailability = async (id) => {
    try {
      const res = await api.toggleMenuAvailability(id);
      if (res.success) {
        showToast(res.message, 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error updating availability.', 'error');
    }
  };

  // User management
  const handleUpdateUserRole = async (userId, roleName) => {
    try {
      const res = await api.updateUser(userId, { roleName });
      if (res.success) {
        showToast('User role updated.', 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Failed to update user role.', 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await api.updateUser(userId, { status: nextStatus });
      if (res.success) {
        showToast(`User status set to ${nextStatus}.`, 'info');
        loadAdminData();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  // Review moderation
  const handleModerateReview = async (reviewId, status) => {
    try {
      const res = await api.moderateReview(reviewId, status);
      if (res.success) {
        showToast(`Review marked as ${status}.`, 'info');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error updating review.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-5xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">Café Administrator Control Center</h3>
              <p className="text-xs text-purple-200 font-medium">System configuration, catalogue curation, and auditable metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'KPI Dashboard' },
            { id: 'pets', label: `Pets (${pets.length})` },
            { id: 'menu', label: `Menu (${menuItems.length})` },
            { id: 'users', label: `Users (${users.length})` },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
            { id: 'audit', label: `Audit Log (${auditLogs.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === 'overview' ? (
            // Overview & KPIs
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Total Revenue</span>
                  <span className="text-2xl font-black text-emerald-950 mt-1 block">
                    ${stats?.totalRevenue || '0.00'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Table Bookings</span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block">
                    {stats?.totalReservations || 0}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Food Orders</span>
                  <span className="text-2xl font-black text-amber-950 mt-1 block">
                    {stats?.totalOrders || 0}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Active Pets</span>
                  <span className="text-2xl font-black text-purple-950 mt-1 block">
                    {stats?.activePets || 0} / {stats?.totalPets || 0}
                  </span>
                </div>
              </div>

              {/* Breakdown tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Menu Categories Breakdown
                  </h4>
                  <div className="space-y-2">
                    {stats?.categoryStats?.map((c, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                        <span className="font-semibold text-slate-700">{c.category}</span>
                        <span className="font-mono font-bold text-purple-700">{c.item_count} items</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Pet Species Distribution
                  </h4>
                  <div className="space-y-2">
                    {stats?.speciesStats?.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                        <span className="font-semibold text-slate-700">{s.species}s</span>
                        <span className="font-mono font-bold text-blue-700">{s.pet_count} resident(s)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'pets' ? (
            // Pets Management
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Manage resident café companions</span>
                <button
                  onClick={() => setShowAddPet(!showAddPet)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Pet</span>
                </button>
              </div>

              {/* Add Pet Form Drawer */}
              {showAddPet && (
                <form onSubmit={handleCreatePet} className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#0e2445]">New Pet Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Name</label>
                      <input
                        required
                        type="text"
                        value={petForm.name}
                        onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                        placeholder="E.g. Rusty"
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Species</label>
                      <select
                        value={petForm.species}
                        onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      >
                        <option value="Cat">Cat</option>
                        <option value="Dog">Dog</option>
                        <option value="Rabbit">Rabbit</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Breed</label>
                      <input
                        required
                        type="text"
                        value={petForm.breed}
                        onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                        placeholder="E.g. Tabby"
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Age (Months)</label>
                      <input
                        type="number"
                        min="1"
                        value={petForm.age}
                        onChange={(e) => setPetForm({ ...petForm, age: parseInt(e.target.value, 10) })}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Photo Image URL</label>
                      <input
                        type="url"
                        value={petForm.photoUrl}
                        onChange={(e) => setPetForm({ ...petForm, photoUrl: e.target.value })}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold block mb-1">Description / Story</label>
                    <textarea
                      required
                      rows={2}
                      value={petForm.description}
                      onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                      placeholder="Personality, quirks, preferences..."
                      className="w-full p-2 bg-white rounded-lg border border-slate-200"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddPet(false)}
                      className="px-3 py-1.5 bg-slate-200 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1e75ff] text-white rounded-lg font-bold"
                    >
                      Save Pet
                    </button>
                  </div>
                </form>
              )}

              {/* Pets List */}
              <div className="divide-y divide-slate-100">
                {pets.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photo_url || p.photoUrl}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-[#0e2445]">{p.name}</h5>
                        <p className="text-xs text-slate-500">{p.species} • {p.breed} • {p.age} mos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100">{p.status}</span>
                      <button
                        onClick={() => handleDeletePet(p.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'menu' ? (
            // Menu Management
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Configure café menu and availability</span>
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Menu Item</span>
                </button>
              </div>

              {/* Add Menu Form */}
              {showAddMenu && (
                <form onSubmit={handleCreateMenuItem} className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#0e2445]">New Menu Item</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Item Name</label>
                      <input
                        required
                        type="text"
                        value={menuForm.name}
                        onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Category</label>
                      <select
                        value={menuForm.category}
                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      >
                        <option value="Coffee">Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Savory Snacks">Savory Snacks</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Price ($)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={menuForm.price}
                        onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) })}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold block mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddMenu(false)}
                      className="px-3 py-1.5 bg-slate-200 rounded-lg font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1e75ff] text-white rounded-lg font-bold text-xs"
                    >
                      Save Item
                    </button>
                  </div>
                </form>
              )}

              {/* Menu Items List */}
              <div className="divide-y divide-slate-100">
                {menuItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url || item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-[#0e2445]">{item.name}</h5>
                        <p className="text-xs text-slate-500">${parseFloat(item.price).toFixed(2)} • {item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMenuAvailability(item.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold cursor-pointer ${
                          item.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'users' ? (
            // Users Management
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-[#0e2445]">{u.name}</h5>
                    <p className="text-xs text-slate-500">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Role changer */}
                    <select
                      value={u.role_name || 'Customer'}
                      onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>

                    {/* Status toggle */}
                    <button
                      onClick={() => handleToggleUserStatus(u.id, u.status)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'reviews' ? (
            // Review Moderation
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0e2445]">{r.customer_name || 'Visitor'}</span>
                      <span className="text-xs text-amber-500 font-bold">★ {r.rating}/5</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full ${
                        r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.status !== 'Approved' && (
                      <button
                        onClick={() => handleModerateReview(r.id, 'Approved')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== 'Hidden' && (
                      <button
                        onClick={() => handleModerateReview(r.id, 'Hidden')}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Audit Logs
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-bold mb-2">Chronological Administrative Audit Trail (FR-12)</div>
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-mono font-bold text-[#0e2445]">{log.action}</span>
                    <span className="text-slate-500">on {log.entity_type} ({log.entity_id})</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
