'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, ShoppingCart, MessageSquare, Plus, Clock, DollarSign, Award, Loader2 } from 'lucide-react';

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  partySize: number;
  status: string;
  notes: string | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  payments: { status: string; method: string }[];
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user profile
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== 'Customer') {
        router.push('/login');
        return;
      }
      setUser(meData.user);

      // 2. Fetch reservations
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const resData = await resRes.json();
        setReservations(resData.reservations);
      }

      // 3. Fetch orders
      const orderRes = await fetch('/api/orders');
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.orders);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Served':
      case 'Completed':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Pending':
      case 'Preparing':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Ready':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-2 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-semibold">Loading your portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-muted-foreground">Book sessions with your favorite pets and track your café order bills.</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/customer/book"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow hover:bg-opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Book Visit</span>
          </Link>
          <Link
            href="/customer/order"
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-xl hover:bg-opacity-90 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Order Food</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-foreground">{reservations.length}</h4>
            <p className="text-xs text-muted-foreground font-medium">Total Bookings</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-foreground">{orders.length}</h4>
            <p className="text-xs text-muted-foreground font-medium">Total Food Orders</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-foreground">
              ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
            </h4>
            <p className="text-xs text-muted-foreground font-medium">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Lists grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reservations List */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>Recent Bookings</span>
            </h3>
            <Link href="/customer/book" className="text-xs font-bold text-accent hover:underline">
              New Booking
            </Link>
          </div>

          <div className="space-y-3">
            {reservations.length > 0 ? (
              reservations.slice(0, 4).map((res) => (
                <div key={res.id} className="p-4 rounded-xl bg-muted/30 border border-border/40 flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <span>Session Slot</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(res.status)}`}>
                        {res.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {res.date} at {res.startTime}
                      </span>
                      <span>•</span>
                      <span>Party Size: <b>{res.partySize}</b></span>
                    </div>
                  </div>
                  {res.status === 'Pending' && (
                    <button
                      onClick={async () => {
                        if (confirm('Cancel reservation?')) {
                          await fetch('/api/reservations', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reservationId: res.id, status: 'Cancelled' }),
                          });
                          fetchData();
                        }
                      }}
                      className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">No reservations booked yet.</p>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-accent" />
              <span>Recent Kitchen Orders</span>
            </h3>
            <Link href="/customer/order" className="text-xs font-bold text-accent hover:underline">
              Order Treats
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.slice(0, 4).map((ord) => (
                <div key={ord.id} className="p-4 rounded-xl bg-muted/30 border border-border/40 flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <span>Order #{ord.id.substring(0, 6)}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center text-accent font-bold">
                        <DollarSign className="w-3 h-3" />
                        {ord.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-muted-foreground">Payment:</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(ord.payments[0]?.status || 'Pending')}`}>
                      {ord.payments[0]?.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">No orders placed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
