import React, { useState, useEffect } from 'react';
import { 
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
  LogOut,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function AdminDashboardView() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

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

  const loadData = async () => {
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
    loadData();
  }, []);

  const handleCreatePet = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createPet(petForm);
      if (res.success) {
        showToast(res.message || 'Pet profile created!', 'success');
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
        loadData();
      } else {
        showToast(res.message || 'Failed to add pet.', 'error');
      }
    } catch (err) {
      showToast('Error creating pet.', 'error');
    }
  };

  const handleDeletePet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet profile?')) return;
    try {
      const res = await api.deletePet(id);
      if (res.success) {
        showToast('Pet removed.', 'info');
        loadData();
      }
    } catch (err) {
      showToast('Error removing pet.', 'error');
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createMenuItem(menuForm);
      if (res.success) {
        showToast(res.message || 'Menu item added!', 'success');
        setShowAddMenu(false);
        loadData();
      } else {
        showToast(res.message || 'Failed to add item.', 'error');
      }
    } catch (err) {
      showToast('Error creating menu item.', 'error');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        showToast('Menu item removed.', 'info');
        loadData();
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
        loadData();
      }
    } catch (err) {
      showToast('Error updating item.', 'error');
    }
  };

  const handleUpdateUserRole = async (userId, roleName) => {
    try {
      const res = await api.updateUser(userId, { roleName });
      if (res.success) {
        showToast('User role updated.', 'success');
        loadData();
      }
    } catch (err) {
      showToast('Failed to update role.', 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await api.updateUser(userId, { status: nextStatus });
      if (res.success) {
        showToast(`User status set to ${nextStatus}.`, 'info');
        loadData();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleModerateReview = async (reviewId, status) => {
    try {
      const res = await api.moderateReview(reviewId, status);
      if (res.success) {
        showToast(`Review marked as ${status}.`, 'info');
        loadData();
      }
    } catch (err) {
      showToast('Error updating review.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faff] flex flex-col">
      
      {/* Admin Header Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-purple-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Role Badge */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0e2445] tracking-tight">
                  Pet Café Admin
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                  <span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider">
                    Executive Control Center
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200">
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
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Admin Info & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-[#0e2445] block">{user?.name}</span>
                <span className="text-[10px] text-purple-700 font-extrabold uppercase">Administrator</span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Mobile Tab Scroller */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard' },
            { id: 'pets', label: `Pets (${pets.length})` },
            { id: 'menu', label: `Menu (${menuItems.length})` },
            { id: 'users', label: `Users (${users.length})` },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
            { id: 'audit', label: `Audit Log (${auditLogs.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-purple-700 text-white' : 'bg-white text-slate-700 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Executive KPI Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                  Executive Operational Metrics
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Financial totals, customer bookings, kitchen throughput, and animal roster stats.
                </p>
              </div>
              <button
                onClick={loadData}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Refresh Metrics
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200/90 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Total Revenue</span>
                <span className="text-3xl font-black text-emerald-950 mt-1 block">
                  ${stats?.totalRevenue || '0.00'}
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Verified completed payments</span>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200/90 shadow-xs">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Table Reservations</span>
                <span className="text-3xl font-black text-blue-950 mt-1 block">
                  {stats?.totalReservations || 0}
                </span>
                <span className="text-[11px] text-blue-700 mt-1 block font-medium">Booked café time slots</span>
              </div>

              <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/90 shadow-xs">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Food & Drink Orders</span>
                <span className="text-3xl font-black text-amber-950 mt-1 block">
                  {stats?.totalOrders || 0}
                </span>
                <span className="text-[11px] text-amber-700 mt-1 block font-medium">Barista & kitchen orders</span>
              </div>

              <div className="p-5 rounded-3xl bg-purple-50 border border-purple-200/90 shadow-xs">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">Resident Companions</span>
                <span className="text-3xl font-black text-purple-950 mt-1 block">
                  {stats?.activePets || 0} / {stats?.totalPets || 0}
                </span>
                <span className="text-[11px] text-purple-700 mt-1 block font-medium">Available for customer visits</span>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Menu Items by Category
                </h4>
                <div className="space-y-3">
                  {stats?.categoryStats?.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-none">
                      <span className="font-bold text-[#0e2445]">{c.category}</span>
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg">
                        {c.item_count} items
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Resident Animals by Species
                </h4>
                <div className="space-y-3">
                  {stats?.speciesStats?.map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-none">
                      <span className="font-bold text-[#0e2445]">{s.species}s</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                        {s.pet_count} animal(s)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pets Management */}
        {activeTab === 'pets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                  Resident Pet Profiles & Care Roster
                </h2>
                <p className="text-xs text-slate-500 font-medium">Add, update, or remove resident rescue animals.</p>
              </div>

              <button
                onClick={() => setShowAddPet(!showAddPet)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Resident Pet</span>
              </button>
            </div>

            {/* Add Pet Form */}
            {showAddPet && (
              <form onSubmit={handleCreatePet} className="p-6 rounded-3xl bg-sky-50 border border-sky-200 space-y-4 animate-pop-in">
                <h4 className="text-base font-bold text-[#0e2445]">Create New Pet Profile</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={petForm.name}
                      onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                      placeholder="E.g. Barnaby"
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Species</label>
                    <select
                      value={petForm.species}
                      onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
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
                      placeholder="E.g. Scottish Fold"
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
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
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Photo URL</label>
                    <input
                      type="url"
                      value={petForm.photoUrl}
                      onChange={(e) => setPetForm({ ...petForm, photoUrl: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold block mb-1">Bio / Story</label>
                  <textarea
                    required
                    rows={2}
                    value={petForm.description}
                    onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddPet(false)}
                    className="px-4 py-2 bg-slate-200 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1e75ff] text-white rounded-xl font-bold text-xs"
                  >
                    Save Pet
                  </button>
                </div>
              </form>
            )}

            {/* Pets Roster */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="p-4 rounded-3xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={pet.photo_url || pet.photoUrl}
                      alt={pet.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-base font-bold text-[#0e2445]">{pet.name}</h4>
                      <p className="text-xs text-slate-500">{pet.species} • {pet.breed} • {pet.age} mos</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 inline-block mt-1">
                        Status: {pet.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePet(pet.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Menu Management */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                  Café Food & Beverage Catalogue
                </h2>
                <p className="text-xs text-slate-500 font-medium">Configure items, prices, and availability.</p>
              </div>

              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Menu Item</span>
              </button>
            </div>

            {/* Add Menu Form */}
            {showAddMenu && (
              <form onSubmit={handleCreateMenuItem} className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-4 animate-pop-in">
                <h4 className="text-base font-bold text-[#0e2445]">New Menu Item</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Item Name</label>
                    <input
                      required
                      type="text"
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Category</label>
                    <select
                      value={menuForm.category}
                      onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
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
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold"
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
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddMenu(false)}
                    className="px-4 py-2 bg-slate-200 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1e75ff] text-white rounded-xl font-bold text-xs"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            )}

            {/* Menu List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 rounded-3xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url || item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#0e2445]">{item.name}</h4>
                      <p className="text-xs text-slate-500">${parseFloat(item.price).toFixed(2)} • {item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleMenuAvailability(item.id)}
                      className={`text-xs px-3 py-1 rounded-full font-bold cursor-pointer ${
                        item.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: User Management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                User & Role Administration
              </h2>
              <p className="text-xs text-slate-500 font-medium">Enforce RBAC role assignments (Customer, Staff, Admin) and active status.</p>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-4 rounded-3xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2445]">{u.name}</h4>
                    <p className="text-xs text-slate-500">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={u.role_name || 'Customer'}
                      onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleToggleUserStatus(u.id, u.status)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
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
          </div>
        )}

        {/* Tab 5: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                Customer Feedback Moderation
              </h2>
              <p className="text-xs text-slate-500 font-medium">Review, approve, or hide visitor testimonials.</p>
            </div>

            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-3xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0e2445]">{r.customer_name || 'Visitor'}</span>
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
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== 'Hidden' && (
                      <button
                        onClick={() => handleModerateReview(r.id, 'Hidden')}
                        className="px-3.5 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                System Audit & Activity Trail (FR-12)
              </h2>
              <p className="text-xs text-slate-500 font-medium">Traceable chronological record of administrative actions.</p>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-mono font-bold text-[#0e2445] mr-2">{log.action}</span>
                      <span className="text-slate-500">on {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}</span>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
