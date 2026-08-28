'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Mail, Lock, LogIn, Loader2, Shield, User, Users, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect based on role
        const role = data.user.role;
        if (role === 'Admin') router.push('/admin');
        else if (role === 'Staff') router.push('/staff');
        else router.push('/customer');
        router.refresh();
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'Customer' | 'Staff' | 'Admin') => {
    setLoading(true);
    setError('');
    
    const credentials = {
      Customer: { email: 'customer@petcafe.com', password: 'customer123' },
      Staff: { email: 'staff@petcafe.com', password: 'staff123' },
      Admin: { email: 'admin@petcafe.com', password: 'admin123' },
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials[role]),
      });

      const data = await res.json();

      if (res.ok) {
        if (role === 'Admin') router.push('/admin');
        else if (role === 'Staff') router.push('/staff');
        else router.push('/customer');
        router.refresh();
      } else {
        setError(data.error || 'Quick login failed.');
      }
    } catch (e) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto py-12 animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-secondary text-primary rounded-2xl shadow-md mb-2">
          <Coffee className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Sign in to book tables and order treats.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground text-xs">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground text-xs">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
              />
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-opacity-95 shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-accent hover:underline">
            Register here
          </Link>
        </div>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="text-[10px] font-bold text-muted-foreground uppercase text-center tracking-wider">
            Quick Testing Accounts
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('Customer')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-center text-[10px]"
            >
              <User className="w-4 h-4 text-accent" />
              <span className="font-semibold text-foreground leading-none">Customer</span>
              <span className="text-[8px] text-muted-foreground">customer@</span>
            </button>
            <button
              onClick={() => handleQuickLogin('Staff')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-center text-[10px]"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span className="font-semibold text-foreground leading-none">Staff</span>
              <span className="text-[8px] text-muted-foreground">staff@</span>
            </button>
            <button
              onClick={() => handleQuickLogin('Admin')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-center text-[10px]"
            >
              <Shield className="w-4 h-4 text-red-400" />
              <span className="font-semibold text-foreground leading-none">Admin</span>
              <span className="text-[8px] text-muted-foreground">admin@</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
