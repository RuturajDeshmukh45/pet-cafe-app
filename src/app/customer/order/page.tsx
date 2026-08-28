'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Minus, ShoppingBag, Trash2, CreditCard, Coffee, CheckCircle, AlertTriangle } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Reservation {
  id: string;
  date: string;
  startTime: string;
}

export default function OrderFood() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedResId, setSelectedResId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Online' | 'PayAtCafe'>('Online');
  
  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchData = async () => {
    try {
      // Fetch menu items
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenu(menuData.menuItems);
      }

      // Fetch confirmed customer reservations for today or future to associate with the order
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const resData = await resRes.json();
        // filter active/confirmed ones
        const activeRes = resData.reservations.filter((r: any) => r.status === 'Confirmed' || r.status === 'Pending');
        setReservations(activeRes);
        if (activeRes.length > 0) {
          setSelectedResId(activeRes[0].id);
        }
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

  const categories = ['All', 'Coffee', 'Tea', 'Bakery', 'Beverage'];

  // Add/remove from cart
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.menuItemId === item.id);
      if (existing) {
        return prev.map((x) => (x.menuItemId === item.id ? { ...x, quantity: x.quantity + 1 } : x));
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((x) => {
          if (x.menuItemId === itemId) {
            const nextQty = x.quantity + delta;
            return nextQty <= 0 ? null : { ...x, quantity: nextQty };
          }
          return x;
        })
        .filter((x): x is CartItem => x !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((x) => x.menuItemId !== itemId));
  };

  const getSubtotal = () => cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const getTax = () => parseFloat((getSubtotal() * 0.05).toFixed(2));
  const getTotal = () => getSubtotal() + getTax();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setPlacingOrder(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
          reservationId: selectedResId || null,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setCart([]);
        setTimeout(() => {
          router.push('/customer');
        }, 2000);
      } else {
        setError(data.error || 'Failed to place order.');
      }
    } catch (e) {
      setError('Something went wrong.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const filteredMenu = activeCategory === 'All' ? menu : menu.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center w-full">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-foreground">Order Café Specialties</h1>
        <p className="text-sm text-muted-foreground">Select fresh goodies and check out to be served during your visit.</p>
      </div>

      {success ? (
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-border text-center space-y-4 py-12 shadow-xl">
          <div className="inline-flex p-4 bg-green-500/10 text-green-500 rounded-full animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Order Placed Successfully!</h3>
          <p className="text-sm text-muted-foreground">Kitchen is preparing your goodies. Redirecting to dashboard...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Menu Panel */}
          <div className="flex-grow space-y-6 w-full lg:w-2/3">
            {/* Category selection */}
            <div className="flex rounded-xl bg-muted p-1 border border-border inline-flex text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className={`glass-panel p-3.5 rounded-2xl border border-border flex gap-4 items-center transition-all ${
                    item.status === 'Unavailable' ? 'opacity-55' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" unoptimized />
                    {item.status === 'Unavailable' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[8px] text-white font-bold uppercase tracking-wider">
                        Sold Out
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline gap-1">
                      <h4 className="font-bold text-foreground text-sm truncate">{item.name}</h4>
                      <span className="text-xs font-bold text-accent">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">{item.description}</p>
                    
                    <button
                      type="button"
                      disabled={item.status === 'Unavailable'}
                      onClick={() => addToCart(item)}
                      className="mt-2.5 px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Panel (Right Sidebar) */}
          <div className="w-full lg:w-1/3 glass-panel p-6 rounded-2xl border border-border shadow-lg space-y-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ShoppingBag className="w-5 h-5 text-accent animate-float" />
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full ml-auto">
                {cart.reduce((sum, c) => sum + c.quantity, 0)} items
              </span>
            </h3>

            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold flex items-start gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {cart.length > 0 ? (
              <div className="space-y-4 text-sm">
                {/* Cart list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((c) => (
                    <div key={c.menuItemId} className="flex justify-between items-center gap-2">
                      <div className="min-w-0 flex-grow">
                        <p className="font-bold text-foreground text-xs truncate">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">${c.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center rounded-lg bg-muted border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(c.menuItemId, -1)}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-foreground">{c.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(c.menuItemId, 1)}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(c.menuItemId)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Taxes */}
                <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (5% Service charge)</span>
                    <span className="font-semibold text-foreground">${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-foreground border-t border-border pt-1.5">
                    <span>Grand Total</span>
                    <span className="text-accent">${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout config form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-3 border-t border-border">
                  {/* Associate Reservation */}
                  {reservations.length > 0 ? (
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground text-xs">Link to Reservation</label>
                      <select
                        value={selectedResId}
                        onChange={(e) => setSelectedResId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent text-xs font-semibold"
                      >
                        {reservations.map((r) => (
                          <option key={r.id} value={r.id}>
                            Visit: {r.date} ({r.startTime})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-500/5 text-amber-600 rounded-xl text-[10px] border border-amber-500/10">
                      You don&apos;t have any active reservations. This will be booked as a general customer account order.
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground text-xs">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Online')}
                        className={`py-2 rounded-xl border font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'Online'
                            ? 'bg-primary text-primary-foreground border-primary shadow'
                            : 'bg-background hover:bg-muted border-border text-foreground'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Online Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PayAtCafe')}
                        className={`py-2 rounded-xl border font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'PayAtCafe'
                            ? 'bg-primary text-primary-foreground border-primary shadow'
                            : 'bg-background hover:bg-muted border-border text-foreground'
                        }`}
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Pay at Café</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer"
                  >
                    {placingOrder ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Place Café Order</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <ShoppingBag className="w-8 h-8 opacity-40 animate-float" />
                <p>Your cart is empty. Click items on the menu to add them.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
