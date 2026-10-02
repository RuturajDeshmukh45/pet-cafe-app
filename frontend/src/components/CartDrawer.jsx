import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    tax, 
    grandTotal, 
    itemCount,
    openCheckout
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-pop-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-pop-in">
          
          {/* Header */}
          <div className="p-6 bg-sky-50/80 border-b border-sky-150 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1e75ff] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0e2445]">Your Food & Drinks</h3>
                <p className="text-xs text-slate-500 font-semibold">{itemCount} {itemCount === 1 ? 'item' : 'items'} in order</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-[#1e75ff] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-700">Your order is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse our artisanal coffees, teas, and fresh baked pastries to add items to your table order.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#0e2445] truncate">{item.name}</h4>
                    <p className="text-xs text-[#1e75ff] font-black mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-l cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-r cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Sales Tax & Service (8%)</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#0e2445] pt-2 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span>${grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={openCheckout}
                  className="flex-1 py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
