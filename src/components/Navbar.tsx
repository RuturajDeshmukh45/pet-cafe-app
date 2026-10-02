'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Coffee, 
  Menu, 
  X, 
  LogOut, 
  Shield, 
  User, 
  Users, 
  Calendar, 
  ShoppingCart, 
  MessageSquare, 
  BookOpen, 
  Layers, 
  Home, 
  PawPrint, 
  Search,
  ImageIcon
} from 'lucide-react';

interface UserSession {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUser();
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pets?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Define navigation based on role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { label: 'Home', href: '/', icon: Home },
        { label: 'About', href: '/about', icon: User },
        { label: 'Pets', href: '/pets', icon: PawPrint },
        { label: 'Menu', href: '/menu', icon: Coffee },
        { label: 'Gallery', href: '/gallery', icon: ImageIcon },
      ];
    }

    switch (currentUser.role) {
      case 'Admin':
        return [
          { label: 'Dashboard', href: '/admin', icon: Layers },
          { label: 'Pets Catalog', href: '/admin/pets', icon: PawPrint },
          { label: 'Menu Catalog', href: '/admin/menu', icon: Coffee },
          { label: 'User Control', href: '/admin/users', icon: Shield },
          { label: 'Audit Logs', href: '/admin/audit', icon: BookOpen },
        ];
      case 'Staff':
        return [
          { label: 'Staff Console', href: '/staff', icon: Users },
          { label: 'Reservations', href: '/staff/reservations', icon: Calendar },
          { label: 'F&B Orders', href: '/staff/orders', icon: ShoppingCart },
          { label: 'Pet Care', href: '/staff/pets', icon: PawPrint },
        ];
      case 'Customer':
        return [
          { label: 'My Dashboard', href: '/customer', icon: Layers },
          { label: 'Book Table', href: '/customer/book', icon: Calendar },
          { label: 'Order Food', href: '/customer/order', icon: ShoppingCart },
          { label: 'Write Review', href: '/customer/review', icon: MessageSquare },
          { label: 'Profile', href: '/customer/profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-sky-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="text-[#1e75ff] transition-transform group-hover:scale-110">
              <PawPrint className="w-8 h-8 fill-current drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#0e2445] leading-none">
                Pet Café
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
                Good Food • Happy Pets
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pill Bar */}
          <div className="hidden lg:flex items-center">
            <div className="bg-[#eff6ff]/90 border border-sky-150/70 p-1 rounded-full shadow-inner flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1e75ff] text-white shadow-md shadow-blue-500/25'
                        : 'text-slate-600 hover:text-[#1e75ff] hover:bg-white/70'
                    }`}
                  >
                    {Icon && <Icon className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Search trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search pets, food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 px-3.5 py-1.5 text-xs rounded-full border border-sky-200 bg-sky-50/50 text-[#0e2445] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full text-slate-500 hover:text-[#1e75ff] hover:bg-sky-50 transition-colors"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-sky-100 pl-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#0e2445] leading-none">{currentUser.name}</span>
                  <span className="text-[10px] text-sky-600 font-semibold capitalize mt-0.5">{currentUser.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#1e75ff] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold bg-[#1e75ff] hover:bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/25 transition-all hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 hover:text-blue-600"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:bg-sky-50 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search pets, food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-2 text-sm rounded-full border border-sky-200 bg-sky-50 text-[#0e2445] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1e75ff] text-white rounded-full text-xs font-bold"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-sky-100 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-slide-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1e75ff] text-white shadow-md'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-[#1e75ff]'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </Link>
            );
          })}

          {currentUser ? (
            <div className="pt-3 border-t border-sky-100 mt-3 px-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0e2445]">{currentUser.name}</span>
                  <span className="text-xs text-sky-600 font-semibold capitalize">{currentUser.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-sky-100 mt-3 flex gap-2">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-sm font-bold text-slate-700 bg-sky-50/70 border border-sky-200 rounded-full hover:bg-sky-100 transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-sm font-bold bg-[#1e75ff] text-white rounded-full hover:bg-blue-600 shadow-md shadow-blue-500/25 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
