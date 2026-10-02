import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  Calendar, 
  PawPrint, 
  CheckCircle2, 
  X, 
  LogOut, 
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function StaffDashboardView() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'pets'
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordRes, resRes, petRes] = await Promise.all([
        api.getAllOrders(),
        api.getAllReservations(),
        api.getPets()
      ]);
      if (ordRes.success) setOrders(ordRes.orders || []);
      if (resRes.success) setReservations(resRes.reservations || []);
      if (petRes.success) setPets(petRes.pets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order status updated to ${newStatus}.`, 'success');
        loadData();
      } else {
        showToast(res.message || 'Failed to update order status.', 'error');
      }
    } catch (err) {
      showToast('Error updating order.', 'error');
    }
  };

  const handleUpdateReservationStatus = async (resId, newStatus) => {
    try {
      const res = await api.updateReservationStatus(resId, newStatus);
      if (res.success) {
        showToast(`Reservation marked as ${newStatus}.`, 'success');
        loadData();
      } else {
        showToast(res.message || 'Failed to update reservation.', 'error');
      }
    } catch (err) {
      showToast('Error updating reservation.', 'error');
    }
  };

  const handleUpdatePetStatus = async (petId, newStatus) => {
    try {
      const res = await api.updatePetStatus(petId, newStatus);
      if (res.success) {
        showToast(`Pet status changed to ${newStatus}.`, 'success');
        loadData();
      } else {
        showToast(res.message || 'Failed to update pet status.', 'error');
      }
    } catch (err) {
      showToast('Error updating pet status.', 'error');
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const servedOrders = orders.filter((o) => o.status === 'Served');

  return (
    <div className="min-h-screen bg-[#f7faff] flex flex-col">
      
      {/* Staff Header Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Role Badge */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0e2445] tracking-tight">
                  Pet Café Staff
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
                    Kitchen & Operations Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#1e75ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kitchen Orders ({orders.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled').length})
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'reservations'
                    ? 'bg-[#1e75ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today's Bookings ({reservations.length})
              </button>

              <button
                onClick={() => setActiveTab('pets')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pets'
                    ? 'bg-[#1e75ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pet Care & Status ({pets.length})
              </button>
            </nav>

            {/* Staff Info & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-[#0e2445] block">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-semibold">Staff Member</span>
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

      {/* Main Staff Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Top Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-sky-150 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Kitchen Orders</span>
              <h3 className="text-2xl font-black text-[#0e2445] mt-0.5">
                {orders.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled').length} Tickets
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-sky-150 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reserved Guests</span>
              <h3 className="text-2xl font-black text-[#0e2445] mt-0.5">
                {reservations.reduce((sum, r) => sum + (r.party_size || r.partySize || 0), 0)} Visitors
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-sky-150 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pets Active On Floor</span>
              <h3 className="text-2xl font-black text-[#0e2445] mt-0.5">
                {pets.filter((p) => p.status === 'Available' || p.status === 'Playing').length} / {pets.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <PawPrint className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab 1: Kitchen Orders Kanban / Queue */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                  Kitchen & Barista Order Pipeline
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Advance tickets through operational states: Pending ➔ Preparing ➔ Ready ➔ Served
                </p>
              </div>
              <button
                onClick={loadData}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Refresh Queue
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                
                {/* Column 1: Pending */}
                <div className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                      1. Pending ({pendingOrders.length})
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  </div>

                  {pendingOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No pending orders</p>
                  ) : (
                    pendingOrders.map((ord) => (
                      <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 block">#{ord.id}</span>
                            <h4 className="text-sm font-bold text-[#0e2445]">{ord.customer_name}</h4>
                          </div>
                          <span className="text-xs font-bold text-blue-600">${parseFloat(ord.total_amount).toFixed(2)}</span>
                        </div>

                        <div className="space-y-1">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="text-xs text-slate-600 flex justify-between">
                              <span>{it.quantity}x {it.item_name}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Preparing')}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Start Preparing</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Column 2: Preparing */}
                <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-800">
                      2. Preparing ({preparingOrders.length})
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  </div>

                  {preparingOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">None in prep</p>
                  ) : (
                    preparingOrders.map((ord) => (
                      <div key={ord.id} className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 block">#{ord.id}</span>
                            <h4 className="text-sm font-bold text-[#0e2445]">{ord.customer_name}</h4>
                          </div>
                          <span className="text-xs font-bold text-blue-600">${parseFloat(ord.total_amount).toFixed(2)}</span>
                        </div>

                        <div className="space-y-1">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="text-xs text-slate-600 flex justify-between">
                              <span>{it.quantity}x {it.item_name}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Ready')}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Mark Ready</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Column 3: Ready */}
                <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-800">
                      3. Ready for Table ({readyOrders.length})
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  </div>

                  {readyOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">None waiting</p>
                  ) : (
                    readyOrders.map((ord) => (
                      <div key={ord.id} className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 block">#{ord.id}</span>
                            <h4 className="text-sm font-bold text-[#0e2445]">{ord.customer_name}</h4>
                          </div>
                          <span className="text-xs font-bold text-purple-600">${parseFloat(ord.total_amount).toFixed(2)}</span>
                        </div>

                        <div className="space-y-1">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="text-xs text-slate-600 flex justify-between">
                              <span>{it.quantity}x {it.item_name}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Served')}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Served ✓</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Column 4: Served / Completed */}
                <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      4. Completed ({servedOrders.length})
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>

                  {servedOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No completed orders yet</p>
                  ) : (
                    servedOrders.slice(0, 5).map((ord) => (
                      <div key={ord.id} className="bg-white/80 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-[#0e2445]">{ord.customer_name}</span>
                          <span className="text-emerald-600">${parseFloat(ord.total_amount).toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Order #{ord.id} • Completed</p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab 2: Today's Reservations */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                Today's Guest Table Bookings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Verify guest arrivals and check in parties for their 90-minute pet petting slots.
              </p>
            </div>

            <div className="space-y-3">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0e2445]">{res.user_name}</span>
                      <span className="text-xs text-slate-500 font-mono">{res.user_phone || res.user_email}</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'Arrived'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>{res.date}</strong> at <strong>{res.start_time}</strong> • Party of <strong>{res.party_size} guests</strong>
                      {res.notes && ` • Notes: ${res.notes}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {res.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Arrived')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Check-in Guest
                      </button>
                    )}
                    {res.status === 'Arrived' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Completed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                    {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Cancelled')}
                        className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pet Welfare & Resting Status */}
        {activeTab === 'pets' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0e2445]">
                Resident Animals Status & Care Notes
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Switch pets to "Resting" when they need snooze time. View internal diet & care notes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.photo_url || pet.photoUrl}
                        alt={pet.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                      <div>
                        <h4 className="text-base font-bold text-[#0e2445]">{pet.name}</h4>
                        <p className="text-xs text-slate-500">{pet.species} • {pet.breed}</p>
                      </div>
                    </div>

                    <select
                      value={pet.status}
                      onChange={(e) => handleUpdatePetStatus(pet.id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="Available">Available for Guests</option>
                      <option value="Playing">Playing in Agility Area</option>
                      <option value="Resting">Resting (Off-Duty Nap)</option>
                      <option value="Unavailable">Unavailable / Vet Check</option>
                    </select>
                  </div>

                  {pet.care_notes && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-mono">
                      <strong>Care Notes:</strong> {pet.care_notes}
                    </div>
                  )}

                  {pet.restrictions && (
                    <div className="text-[11px] text-amber-800 font-medium">
                      ⚠️ Restrictions: {pet.restrictions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
