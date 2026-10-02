import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Coffee, 
  CheckCircle2, 
  ShieldCheck, 
  Receipt, 
  Sparkles,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export function CheckoutModal({ onOpenAuth }) {
  const { isCheckoutOpen, closeCheckout, cart, subtotal, tax, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orderType, setOrderType] = useState('Dine-In');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online (Card)');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Smith');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to complete your café order.', 'info', 'Sign In Required');
      onOpenAuth('login');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    if (paymentMethod === 'Online (Card)') {
      if (cardNumber.replace(/\s+/g, '').length < 12) {
        showToast('Please enter a valid 16-digit card number.', 'error');
        return;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        showToast('Please enter a valid expiration date (MM/YY).', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const itemsPayload = cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));

      const res = await api.createOrder({
        items: itemsPayload,
        orderType,
        paymentMethod,
        tableNumber: tableNumber ? `Table #${tableNumber}` : undefined
      });

      if (res.success && res.order) {
        setReceipt({
          orderId: res.order.id,
          totalAmount: res.order.totalAmount,
          subtotal: res.order.subtotal,
          tax: res.order.tax,
          items: res.order.items,
          payment: res.order.payment,
          orderType,
          tableNumber,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        clearCart();
        showToast('Your order has been placed successfully!', 'success', 'Order Confirmed');

        try {
          confetti({
            particleCount: 70,
            spread: 55,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        showToast(res.message || 'Failed to place order.', 'error');
      }
    } catch (err) {
      showToast('Network error processing your order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    setReceipt(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-xl w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e75ff] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0e2445]">
                {receipt ? 'Official Payment Receipt' : 'Order Checkout'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {receipt ? 'Transaction recorded in database' : 'Review and complete your food & drink order'}
              </p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {receipt ? (
          // Receipt Screen
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Payment Successful
              </span>
              <h4 className="text-2xl font-black text-[#0e2445]">
                Thank You For Your Order!
              </h4>
              <p className="text-xs text-slate-500">
                Our kitchen baristas have received your order ticket and are preparing your delicious items.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-dashed border-slate-300 pb-2">
                <span className="font-bold text-[#0e2445]">PET CAFÉ RECEIPT</span>
                <span>{receipt.date} {receipt.time}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Order ID:</span>
                <span className="font-bold text-[#0e2445]">{receipt.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transaction Ref:</span>
                <span className="font-bold text-[#0e2445]">{receipt.payment?.transactionRef || 'TXN_LOCAL'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Order Type:</span>
                <span className="font-bold">{receipt.orderType} {receipt.tableNumber ? `(Table #${receipt.tableNumber})` : ''}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-bold">{receipt.payment?.method}</span>
              </div>

              {/* Items List */}
              <div className="pt-2 border-t border-dashed border-slate-300 space-y-1.5 font-sans">
                {receipt.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono font-bold">${it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
                <div className="flex justify-between text-slate-500 font-sans">
                  <span>Subtotal:</span>
                  <span className="font-mono">${receipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-sans">
                  <span>Tax (8%):</span>
                  <span className="font-mono">${receipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#0e2445] pt-1 border-t border-slate-300 font-sans">
                  <span>Total Paid:</span>
                  <span className="font-mono text-[#1e75ff]">${receipt.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          // Checkout Form
          <form onSubmit={handleCheckout} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Dining Option */}
            <div>
              <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                1. Dining Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('Dine-In')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    orderType === 'Dine-In'
                      ? 'bg-blue-50 border-[#1e75ff] text-[#1e75ff]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  🍽️ Dine-In with Pets
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('Takeaway')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    orderType === 'Takeaway'
                      ? 'bg-blue-50 border-[#1e75ff] text-[#1e75ff]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  🥡 Takeaway / To-Go
                </button>
              </div>
            </div>

            {orderType === 'Dine-In' && (
              <div>
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                  Table Number (If seated)
                </label>
                <input
                  type="text"
                  placeholder="E.g. Table 4 or Window Perch"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
                />
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-2">
                2. Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online (Card)')}
                  className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    paymentMethod === 'Online (Card)'
                      ? 'bg-blue-50 border-[#1e75ff] text-[#1e75ff]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  💳 Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Pay at Café')}
                  className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    paymentMethod === 'Pay at Café'
                      ? 'bg-blue-50 border-[#1e75ff] text-[#1e75ff]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  💵 Pay at Counter
                </button>
              </div>
            </div>

            {/* Credit Card Inputs if Card chosen */}
            {paymentMethod === 'Online (Card)' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0e2445]">Simulated Card Processing</span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Secure</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#1e75ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#1e75ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      placeholder="12/28"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1e75ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                      placeholder="888"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1e75ff]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total Summary */}
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Total to Pay (inc. 8% tax)</span>
                <span className="text-xl font-black text-[#0e2445]">${grandTotal}</span>
              </div>
              <span className="text-xs font-bold text-[#1e75ff] bg-white px-3 py-1 rounded-full border border-sky-200">
                {cart.length} distinct item(s)
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Authorize & Place Order (${grandTotal})</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
