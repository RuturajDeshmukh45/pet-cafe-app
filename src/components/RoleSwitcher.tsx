'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, User, Users, LogOut, PawPrint } from 'lucide-react';

interface UserSession {
  name: string;
  email: string;
  role: string;
}

export default function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch current user on mount or path change
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
  }, [pathname]);

  const handleRoleSwitch = async (role: 'Customer' | 'Staff' | 'Admin' | 'Guest') => {
    setLoading(true);
    setIsOpen(false);
    try {
      if (role === 'Guest') {
        await fetch('/api/auth/logout', { method: 'POST' });
        setCurrentUser(null);
        router.push('/');
        router.refresh();
      } else {
        const credentials = {
          Customer: { email: 'customer@petcafe.com', password: 'customer123' },
          Staff: { email: 'staff@petcafe.com', password: 'staff123' },
          Admin: { email: 'admin@petcafe.com', password: 'admin123' },
        };

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials[role]),
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          
          // Redirect based on role
          if (role === 'Admin') router.push('/admin');
          else if (role === 'Staff') router.push('/staff');
          else router.push('/customer');
          
          router.refresh();
        }
      }
    } catch (e) {
      console.error('Role switch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1e75ff] hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all font-bold text-xs"
      >
        <PawPrint className="w-4 h-4 fill-current animate-wiggle" />
        <span>Demo Switcher</span>
        <span className="px-2 py-0.5 bg-white text-[#1e75ff] font-extrabold text-[10px] rounded-full shadow-sm">
          {currentUser ? currentUser.role : 'Guest'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-60 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-200 shadow-2xl animate-fade-in flex flex-col gap-1 text-xs">
          <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-sky-100 mb-1">
            Quick Role Switcher
          </div>
          
          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Customer')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-xl transition-colors font-semibold ${
              currentUser?.role === 'Customer' ? 'bg-sky-100 text-[#1e75ff]' : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <User className="w-4 h-4 text-sky-500" />
            <span>Customer View</span>
          </button>

          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Staff')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-xl transition-colors font-semibold ${
              currentUser?.role === 'Staff' ? 'bg-sky-100 text-[#1e75ff]' : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Staff View</span>
          </button>

          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Admin')}
            className={`flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-xl transition-colors font-semibold ${
              currentUser?.role === 'Admin' ? 'bg-sky-100 text-[#1e75ff]' : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-500" />
            <span>Admin View</span>
          </button>

          <div className="border-t border-sky-100 my-1"></div>

          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Guest')}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-red-500 rounded-xl hover:bg-red-50 font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout (Guest)</span>
          </button>
        </div>
      )}
    </div>
  );
}
