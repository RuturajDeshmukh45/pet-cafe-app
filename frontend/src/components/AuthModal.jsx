import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, PawPrint, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, quickLogin } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill in email and password.', 'error');
      return;
    }

    if (mode === 'register') {
      if (!name) {
        showToast('Please enter your full name.', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) onClose();
      } else {
        const res = await register({ name, email, phone, password });
        if (res.success) onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (role) => {
    setSubmitting(true);
    try {
      await quickLogin(role);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-md w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e75ff] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <PawPrint className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0e2445]">
                {mode === 'login' ? 'Welcome Back!' : 'Join Pet Café'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mode === 'login' ? 'Sign in to access your bookings & orders' : 'Create an account to reserve and order'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-2 bg-slate-100/80 m-6 mb-0 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1e75ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1e75ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Login shortcuts */}
        <div className="px-6 pt-4">
          <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-amber-800">
              <span>Instant Demo Personas</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleDemo('Customer')}
                className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl transition-colors cursor-pointer text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemo('Staff')}
                className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl transition-colors cursor-pointer text-center"
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleDemo('Admin')}
                className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl transition-colors cursor-pointer text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Sophia Martinez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0e2445] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e75ff]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer disabled:opacity-60 mt-2"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In to Account' : 'Register Account'}
          </button>
        </form>

      </div>
    </div>
  );
}
