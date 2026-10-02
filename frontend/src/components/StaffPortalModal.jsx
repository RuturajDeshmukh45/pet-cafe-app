import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  PawPrint, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function StaffPortalModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadStaffData = async () => {
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
    if (isOpen) {
      loadStaffData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order status updated to ${newStatus}.`, 'success');
        loadStaffData();
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
        loadStaffData();
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
        loadStaffData();
      } else {
        showToast(res.message || 'Failed to update pet status.', 'error');
      }
    } catch (err) {
      showToast('Error updating pet status.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-4xl w-full overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">Staff Kitchen & Operations Portal</h3>
              <p className="text-xs text-blue-100 font-medium">Real-time order pipeline and animal availability control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#1e75ff] text-[#1e75ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kitchen Order Queue ({orders.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled').length} Active)
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'reservations'
                ? 'border-[#1e75ff] text-[#1e75ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Table Reservations ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'pets'
                ? 'border-[#1e75ff] text-[#1e75ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pet Status & Care ({pets.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === 'orders' ? (
            // Orders Queue
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-slate-400">No incoming orders</div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded">
                          #{ord.id}
                        </span>
                        <span className="text-sm font-bold text-[#0e2445]">{ord.customer_name}</span>
                        <span className="text-xs text-slate-400">({ord.order_type})</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          ord.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'Preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'Ready'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {ord.items?.map((it, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-sky-50 text-slate-700 px-2.5 py-1 rounded-lg border border-sky-150 font-medium"
                          >
                            {it.quantity}x {it.item_name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Operational Transition Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ord.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Preparing')}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Start Preparing →
                        </button>
                      )}
                      {ord.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Ready')}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark Ready for Table →
                        </button>
                      )}
                      {ord.status === 'Ready' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Served')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Complete / Served ✓
                        </button>
                      )}
                      {ord.status !== 'Cancelled' && ord.status !== 'Served' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Cancelled')}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'reservations' ? (
            // Reservations
            <div className="space-y-3">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0e2445]">{res.user_name}</span>
                      <span className="text-xs text-slate-500 font-mono">{res.user_phone || res.user_email}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
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
                      <strong>{res.date}</strong> at <strong>{res.start_time}</strong> • {res.party_size} guests
                      {res.notes && ` • Notes: ${res.notes}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {res.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Arrived')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Check-in Guest
                      </button>
                    )}
                    {res.status === 'Arrived' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                    {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Cancelled')}
                        className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Pets Status Switcher
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={pet.photo_url || pet.photoUrl}
                      alt={pet.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#0e2445]">{pet.name}</h4>
                      <p className="text-xs text-slate-500">{pet.breed}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                        pet.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pet.status === 'Playing'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pet.status}
                      </span>
                    </div>
                  </div>

                  {/* Quick Status Select */}
                  <select
                    value={pet.status}
                    onChange={(e) => handleUpdatePetStatus(pet.id, e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Playing">Playing</option>
                    <option value="Resting">Resting (Do Not Disturb)</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
