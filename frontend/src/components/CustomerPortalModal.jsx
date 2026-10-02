import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  ShoppingBag, 
  User, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Receipt,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function CustomerPortalModal({ isOpen, onClose, onOpenReview }) {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resRes, ordRes] = await Promise.all([
        api.getMyReservations(),
        api.getMyOrders()
      ]);
      if (resRes.success) setReservations(resRes.reservations || []);
      if (ordRes.success) setOrders(ordRes.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const res = await api.cancelReservation(id);
      if (res.success) {
        showToast('Reservation cancelled successfully.', 'info');
        loadData();
      } else {
        showToast(res.message || 'Could not cancel reservation.', 'error');
      }
    } catch (err) {
      showToast('Error cancelling reservation.', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({ name, phone });
    setSavingProfile(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-3xl w-full overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e75ff] text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0e2445]">My Café Dashboard</h3>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'reservations'
                ? 'border-[#1e75ff] text-[#1e75ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Table Reservations ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#1e75ff] text-[#1e75ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Past Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#1e75ff] text-[#1e75ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === 'reservations' ? (
            // Reservations List
            reservations.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Reservations Yet</h4>
                <p className="text-xs text-slate-400">Book a cozy table slot to play with our animals!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0e2445]">{res.date}</span>
                        <span className="text-xs font-bold text-[#1e75ff] bg-white px-2 py-0.5 rounded border border-sky-200">
                          {res.start_time || res.startTime}
                        </span>
                        <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Party of <strong>{res.party_size || res.partySize} guests</strong>
                        {res.notes && ` • ${res.notes}`}
                      </p>
                    </div>

                    {res.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 self-start sm:self-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'orders' ? (
            // Orders List
            orders.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Food Orders Placed</h4>
                <p className="text-xs text-slate-400">Order handcrafted beverages and pastries from our menu!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-500">#{ord.id}</span>
                        <span className="text-xs text-slate-400 ml-2">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          ord.status === 'Served'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Ready'
                            ? 'bg-sky-100 text-sky-800'
                            : ord.status === 'Preparing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {ord.status}
                        </span>
                        <span className="text-sm font-black text-[#0e2445]">
                          ${parseFloat(ord.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-1">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-600">
                          <span>{it.quantity}x {it.item_name}</span>
                          <span className="font-mono">${parseFloat(it.subtotal).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Method: {ord.payment_method || 'Online'}</span>
                      <span className="font-mono">Ref: {ord.transaction_ref || 'TXN_CAFE'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Profile Form
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
                  Email (Cannot be modified)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
