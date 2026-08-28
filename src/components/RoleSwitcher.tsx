'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, User, Users, LogOut, Coffee } from 'lucide-react';

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
        className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-opacity-90 transition-all font-medium text-sm glass-panel border border-border"
      >
        <Coffee className="w-4 h-4 animate-float" />
        <span>Demo Switcher</span>
        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
          {currentUser ? currentUser.role : 'Guest'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-56 p-2 rounded-xl glass-panel border border-border shadow-2xl animate-fade-in flex flex-col gap-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase border-b border-border mb-1">
            Switch Demo Role
          </div>
          
          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Customer')}
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-muted transition-colors ${
              currentUser?.role === 'Customer' ? 'bg-muted font-semibold text-accent' : 'text-foreground'
            }`}
          >
            <User className="w-4 h-4 text-accent" />
            <span>Customer View</span>
          </button>

          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Staff')}
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-muted transition-colors ${
              currentUser?.role === 'Staff' ? 'bg-muted font-semibold text-accent' : 'text-foreground'
            }`}
          >
            <Users className="w-4 h-4 text-orange-400" />
            <span>Staff View</span>
          </button>

          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Admin')}
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-muted transition-colors ${
              currentUser?.role === 'Admin' ? 'bg-muted font-semibold text-accent' : 'text-foreground'
            }`}
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span>Admin View</span>
          </button>

          <div className="border-t border-border my-1"></div>

          <button
            disabled={loading}
            onClick={() => handleRoleSwitch('Guest')}
            className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout (Guest)</span>
          </button>
        </div>
      )}
    </div>
  );
}
