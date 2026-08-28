'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ShoppingCart, Users, Coffee, Check, X, ShieldAlert, Play, Moon, EyeOff, Loader2 } from 'lucide-react';

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  partySize: number;
  status: string;
  notes: string | null;
  user: { name: string; email: string; phone: string | null };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  orderItems: { quantity: number; menuItem: { name: string } }[];
  payments: { status: string; method: string }[];
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  status: string;
}

export default function StaffConsole() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || (meData.user.role !== 'Staff' && meData.user.role !== 'Admin')) {
        router.push('/login');
        return;
      }

      // Fetch reservations
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const resData = await resRes.json();
        setReservations(resData.reservations);
      }

      // Fetch orders
      const orderRes = await fetch('/api/orders');
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.orders);
      }

      // Fetch pets
      const petRes = await fetch('/api/pets');
      if (petRes.ok) {
        const petData = await petRes.json();
        setPets(petData.pets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReservationStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id, status: nextStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, status: nextStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePetStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Served':
      case 'Available':
      case 'Completed':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Pending':
      case 'Preparing':
      case 'Playing':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Ready':
      case 'Resting':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-2 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-semibold">Loading Staff Desk...</span>
      </div>
    );
  }

  // Filter queues
  const pendingReservations = reservations.filter(r => r.status === 'Pending');
  const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="glass-panel p-6 rounded-3xl border border-border">
        <h1 className="text-3xl font-extrabold text-foreground">Staff Control Desk</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage guest sessions, process food prep queues, and monitor pet playtimes in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RESERVATIONS QUEUE */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm h-fit">
          <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Calendar className="w-5 h-5 text-accent" />
            <span>Booking Requests</span>
            <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full ml-auto">
              {pendingReservations.length} Pending
            </span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {pendingReservations.length > 0 ? (
              pendingReservations.map((res) => (
                <div key={res.id} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-foreground text-sm">
                      <span>{res.user.name}</span>
                      <span className="text-xs text-accent">{res.startTime}</span>
                    </div>
                    <p className="text-muted-foreground">{res.user.email} • {res.user.phone || 'No phone'}</p>
                    <p className="text-muted-foreground">Date: <b>{res.date}</b> • Party Size: <b>{res.partySize}</b></p>
                    {res.notes && (
                      <p className="bg-background p-2 rounded-lg border border-border/40 text-[11px] italic text-muted-foreground/80 mt-1">
                        &ldquo;{res.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReservationStatus(res.id, 'Confirmed')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-opacity-95 transition-all cursor-pointer"
                    >
                      <Check className="w-4.5 h-4.5" />
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={() => handleReservationStatus(res.id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg transition-all cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-8 text-center">No pending booking requests.</p>
            )}
          </div>
        </div>

        {/* FOOD PREP QUEUE */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm h-fit">
          <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <span>Kitchen Queue</span>
            <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full ml-auto">
              {activeOrders.length} Active
            </span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {activeOrders.length > 0 ? (
              activeOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline font-bold text-foreground text-sm">
                      <span>Order #{ord.id.substring(0, 6)}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground">Customer: <b>{ord.user.name}</b></p>
                    
                    {/* Items */}
                    <div className="border-t border-border/40 pt-2 space-y-1">
                      {ord.orderItems.map((item, i) => (
                        <div key={i} className="flex justify-between text-muted-foreground">
                          <span>{item.menuItem.name}</span>
                          <span className="font-semibold text-foreground">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border/40 pt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>Payment Status:</span>
                      <span className="font-bold text-foreground">{ord.payments[0]?.status || 'Pending'} ({ord.payments[0]?.method})</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {ord.status === 'Pending' && (
                      <button
                        onClick={() => handleOrderStatus(ord.id, 'Preparing')}
                        className="flex-1 py-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-opacity-95 transition-all text-[11px] cursor-pointer"
                      >
                        Start Prep
                      </button>
                    )}
                    {ord.status === 'Preparing' && (
                      <button
                        onClick={() => handleOrderStatus(ord.id, 'Ready')}
                        className="flex-1 py-1.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-opacity-95 transition-all text-[11px] cursor-pointer"
                      >
                        Mark Ready
                      </button>
                    )}
                    {ord.status === 'Ready' && (
                      <button
                        onClick={() => handleOrderStatus(ord.id, 'Served')}
                        className="flex-1 py-1.5 bg-green-600 text-white font-bold rounded-lg hover:bg-opacity-95 transition-all text-[11px] cursor-pointer"
                      >
                        Serve Guest
                      </button>
                    )}
                    <button
                      onClick={() => handleOrderStatus(ord.id, 'Cancelled')}
                      className="py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg transition-all text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-8 text-center">No active kitchen orders.</p>
            )}
          </div>
        </div>

        {/* PET STATUS MONITORS */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm h-fit">
          <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Users className="w-5 h-5 text-accent" />
            <span>Pet Status Center</span>
          </h3>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {pets.map((pet) => (
              <div key={pet.id} className="p-3.5 rounded-xl bg-muted/30 border border-border/40 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-foreground text-sm">{pet.name}</div>
                  <div className="text-[10px] text-muted-foreground">{pet.species} • {pet.breed}</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(pet.status)}`}>
                    {pet.status}
                  </span>
                </div>
                
                {/* Actions toggler */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => handlePetStatus(pet.id, 'Available')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      pet.status === 'Available' ? 'bg-green-600 text-white font-bold' : 'hover:bg-muted border border-border text-muted-foreground'
                    }`}
                    title="Available"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePetStatus(pet.id, 'Playing')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      pet.status === 'Playing' ? 'bg-amber-500 text-white font-bold' : 'hover:bg-muted border border-border text-muted-foreground'
                    }`}
                    title="Playing"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePetStatus(pet.id, 'Resting')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      pet.status === 'Resting' ? 'bg-blue-500 text-white font-bold' : 'hover:bg-muted border border-border text-muted-foreground'
                    }`}
                    title="Resting"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePetStatus(pet.id, 'Unavailable')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      pet.status === 'Unavailable' ? 'bg-red-500 text-white font-bold' : 'hover:bg-muted border border-border text-muted-foreground'
                    }`}
                    title="Unavailable"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
