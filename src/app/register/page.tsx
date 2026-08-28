'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, User, Mail, Phone, Lock, UserPlus, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Name, email, and password are required');
      return;
    }

    const emailParts = email.split('@');
    if (emailParts.length !== 2 || emailParts[1] !== 'gmail.com') {
      setError('Email address must end exactly with @gmail.com');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
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
        <h1 className="text-3xl font-extrabold text-foreground">Create Account</h1>
        <p className="text-sm text-muted-foreground">Sign up to get closer to our animal friends.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl space-y-6">
        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="inline-flex p-3 bg-green-500/10 text-green-500 rounded-full animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Registration Successful!</h3>
            <p className="text-xs text-muted-foreground">Redirecting you to the login screen...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground text-xs">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
                  />
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                </div>
              </div>

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
                <label className="font-semibold text-muted-foreground text-xs">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-accent text-foreground text-sm"
                  />
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
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
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-accent hover:underline">
                Log in here
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
