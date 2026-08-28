'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Coffee, Menu, X, LogOut, Shield, User, Users, Calendar, ShoppingCart, MessageSquare, BookOpen, Layers, Home } from 'lucide-react';

interface UserSession {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Define navigation based on role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { label: 'Home', href: '/', icon: Home },
        { label: 'About', href: '/about', icon: BookOpen },
        { label: 'Pets', href: '/pets', icon: Users },
        { label: 'Menu', href: '/menu', icon: Coffee },
        { label: 'Gallery', href: '/gallery', icon: Layers },
      ];
    }

    switch (currentUser.role) {
      case 'Admin':
        return [
          { label: 'Dashboard', href: '/admin', icon: Layers },
          { label: 'Pets Catalog', href: '/admin/pets', icon: Users },
          { label: 'Menu Catalog', href: '/admin/menu', icon: Coffee },
          { label: 'User Control', href: '/admin/users', icon: Shield },
          { label: 'Audit Logs', href: '/admin/audit', icon: BookOpen },
        ];
      case 'Staff':
        return [
          { label: 'Staff Console', href: '/staff', icon: Users },
          { label: 'Reservations', href: '/staff/reservations', icon: Calendar },
          { label: 'F&B Orders', href: '/staff/orders', icon: ShoppingCart },
          { label: 'Pet Care', href: '/staff/pets', icon: Coffee },
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
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
              <div className="p-2 bg-accent rounded-xl text-accent-foreground shadow-md animate-float">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pet Café
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-border pl-3 ml-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-foreground leading-none">{currentUser.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize mt-0.5">{currentUser.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-border pl-3 ml-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary hover:bg-muted rounded-xl transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-accent text-accent-foreground rounded-xl hover:bg-opacity-95 shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-border px-2 pt-2 pb-4 space-y-1 animate-slide-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </Link>
            );
          })}

          {currentUser ? (
            <div className="pt-3 border-t border-border mt-3 px-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground capitalize mt-0.5">{currentUser.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl text-xs font-semibold hover:bg-opacity-95 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-border mt-3 flex gap-2 px-2">
              <Link
                href="/login"
                className="flex-1 text-center py-2 text-sm font-semibold text-primary hover:bg-muted border border-border rounded-xl transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2 text-sm font-semibold bg-accent text-accent-foreground rounded-xl hover:bg-opacity-95 shadow-md transition-all"
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
