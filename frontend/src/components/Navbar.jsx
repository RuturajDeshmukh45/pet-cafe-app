import React, { useState } from 'react';
import { 
  PawPrint, 
  Search, 
  ShoppingBag, 
  User, 
  Menu as MenuIcon, 
  X, 
  LogOut, 
  Calendar, 
  ChevronDown,
  ChefHat,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReservation, 
  onOpenSearch, 
  onOpenCustomerPortal 
}) {
  const { user, logout, isCustomer, isStaff, isAdmin } = useAuth();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Customer Navigation Links
  const customerLinks = [
    { id: 'home', label: 'Home' },
    { id: 'pets', label: 'Pets' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1e75ff] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <PawPrint className="w-6 h-6 fill-current animate-wiggle" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0e2445] flex items-center gap-1">
                Pet Café
              </span>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
                Good Food • Happy Pets
              </p>
            </div>
          </div>

          {/* Desktop Nav Links (For Customer) */}
          <nav className="hidden md:flex items-center gap-1 bg-sky-50/70 p-1.5 rounded-full border border-sky-100/80">
            {customerLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1e75ff] text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-[#1e75ff] hover:bg-white/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="p-2.5 text-slate-500 hover:text-[#1e75ff] hover:bg-sky-50 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label="Shopping Cart"
              className="relative p-2.5 text-slate-500 hover:text-[#1e75ff] hover:bg-sky-50 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1e75ff] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Bookings / Dashboard Button */}
            <button
              onClick={onOpenCustomerPortal}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-[#1e75ff] font-bold rounded-full text-xs transition-colors cursor-pointer border border-sky-200"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>My Bookings & Orders</span>
            </button>

            {/* User Pill & Sign Out */}
            <div className="flex items-center gap-2 bg-white border border-sky-200 px-3 py-1.5 rounded-full shadow-xs">
              <div className="w-6 h-6 rounded-full bg-sky-100 text-[#1e75ff] flex items-center justify-center text-xs font-black">
                {user?.name?.charAt(0) || 'C'}
              </div>
              <span className="text-xs font-bold text-[#0e2445] max-w-[100px] truncate hidden sm:inline">
                {user?.name?.split(' ')[0]}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-[#1e75ff]">
                Customer
              </span>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 md:hidden hover:bg-sky-50 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-sky-100 flex flex-col gap-2 animate-pop-in">
            {customerLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                  activeTab === link.id ? 'bg-[#1e75ff] text-white' : 'text-slate-700 hover:bg-sky-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomerPortal();
              }}
              className="text-left px-4 py-2.5 rounded-xl font-bold text-sm text-[#1e75ff] bg-sky-50"
            >
              My Bookings & Orders
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
