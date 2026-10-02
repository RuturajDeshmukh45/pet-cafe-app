import React, { useState, useEffect } from 'react';
import {
  PawPrint,
  ChefHat,
  ShieldAlert,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Heart,
  Calendar,
  Gift,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function RoleAuthGateway() {
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Staff' | 'Admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Email validation state
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const { login, register, quickLogin } = useAuth();
  const { showToast } = useToast();

  const roleConfigs = {
    Customer: {
      id: 'Customer',
      title: 'Customer',
      portalTitle: 'Customer Portal',
      badgeColor: 'bg-blue-500 text-white',
      // demoEmail: 'customer@petcafe.com',
      // demoPass: 'customer123',
    },
    Staff: {
      id: 'Staff',
      title: 'Staff',
      portalTitle: 'Staff Operations',
      badgeColor: 'bg-indigo-600 text-white',
      // demoEmail: 'staff@petcafe.com',
      // demoPass: 'staff123',
    },
    Admin: {
      id: 'Admin',
      title: 'Admin',
      portalTitle: 'Administrator Control',
      badgeColor: 'bg-purple-600 text-white',
      // demoEmail: 'admin@petcafe.com',
      // demoPass: 'admin123',
    },
  };

  const currentRole = roleConfigs[selectedRole] || roleConfigs.Customer;

  /**
   * Validate Email strictly as requested:
   * "proper email after @ not any number and any other word not write"
   */
  const validateEmail = (val) => {
    if (!val || !val.trim()) {
      return 'Email address is required.';
    }

    const trimmed = val.trim();

    if (!trimmed.includes('@')) {
      return "Email must contain an '@' symbol.";
    }

    const parts = trimmed.split('@');
    if (parts.length !== 2) {
      return "Email must contain exactly one '@' symbol.";
    }

    const [localPart, domainPart] = parts;

    if (!localPart) {
      return 'Please enter the username before the @ symbol.';
    }

    if (!domainPart) {
      return "Please enter the domain after '@' (e.g., gmail.com or petcafe.com).";
    }

    // 1. Strict requirement: NO numbers after @
    if (/\d/.test(domainPart)) {
      return "Domain after '@' cannot contain numbers. Only letters are allowed (e.g., domain.com).";
    }

    // 2. Strict requirement: No spaces, special punctuation (other than valid dot), or extra words
    if (/\s/.test(domainPart)) {
      return "Domain after '@' cannot contain spaces or extra words.";
    }

    // 3. Domain must have valid letters followed by dot and letters (e.g. gmail.com, petcafe.com, mail.co.uk)
    const domainRegex = /^[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domainPart)) {
      return "Please enter a valid domain format after '@' (e.g., gmail.com, petcafe.com).";
    }

    return '';
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailTouched) {
      setEmailError(validateEmail(val));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setEmailError('');
    setEmailTouched(false);
  };

  const handleFillDemoCreds = (roleId) => {
    const cfg = roleConfigs[roleId];
    setSelectedRole(roleId);
    setEmail(cfg.demoEmail);
    setPassword(cfg.demoPass);
    setEmailError('');
    setEmailTouched(false);
    showToast(`Loaded ${cfg.title} credentials: ${cfg.demoEmail}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);

    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      showToast(err, 'error');
      return;
    }

    if (!password) {
      showToast('Please enter your password.', 'error');
      return;
    }

    if (authMode === 'register') {
      if (!name.trim()) {
        showToast('Please enter your full name.', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          showToast(`Welcome back! Logged in as ${res.user?.roleName || selectedRole}.`, 'success');
        } else {
          showToast(res.message || 'Login failed. Please check your credentials.', 'error');
        }
      } else {
        const res = await register({
          name,
          email,
          phone,
          password,
          roleName: selectedRole,
        });
        if (res.success) {
          showToast(`Account created successfully! Welcome to Pet Café.`, 'success');
        } else {
          showToast(res.message || 'Registration failed.', 'error');
        }
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handle1ClickDemo = async (roleToLogin = selectedRole) => {
    setSubmitting(true);
    try {
      const res = await quickLogin(roleToLogin);
      if (res.success) {
        showToast(`Instant access granted as ${roleToLogin}!`, 'success');
      } else {
        showToast('Demo login failed. Make sure backend is running.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (provider) => {
    showToast(`${provider} login simulation: logging in as ${selectedRole}...`, 'info');
    handle1ClickDemo(selectedRole);
  };

  return (
    <div className="min-h-screen w-full bg-[#eef6ff] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none">

      {/* Decorative Background Paw Prints & Trail */}
      <div className="absolute top-8 left-8 text-sky-200/50 pointer-events-none -z-10 select-none">
        <PawPrint className="w-28 h-28 rotate-[-15deg] fill-current" />
      </div>
      <div className="absolute top-1/3 -left-8 text-sky-200/40 pointer-events-none -z-10 select-none">
        <PawPrint className="w-24 h-24 rotate-[20deg] fill-current" />
      </div>
      <div className="absolute top-12 right-1/4 text-sky-200/35 pointer-events-none -z-10 select-none hidden lg:block">
        <PawPrint className="w-20 h-20 rotate-[10deg] fill-current" />
      </div>
      <div className="absolute bottom-8 right-8 text-sky-200/50 pointer-events-none -z-10 select-none hidden sm:block">
        <PawPrint className="w-40 h-40 rotate-[25deg] fill-current" />
      </div>
      <div className="absolute bottom-20 right-1/3 text-sky-200/30 pointer-events-none -z-10 select-none hidden lg:block">
        <PawPrint className="w-16 h-16 rotate-[-10deg] fill-current" />
      </div>

      {/* Main Container - Split View matching reference screenshot */}
      <div className="w-full max-w-7xl bg-transparent grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* ================= LEFT HERO COLUMN ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-8 relative">

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Custom Blue Mug with Paw Logo matching screenshot */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1d70f5] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 19h18a1 1 0 0 0 1-1v-1a5 5 0 0 0-5-5H6a5 5 0 0 0-5 5v1a1 1 0 0 0 1 1zm8-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" opacity="0.1" />
                <path d="M18 5H6a2 2 0 0 0-2 2v7a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6V7a2 2 0 0 0-2-2zm0 6h-2V7h2v4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <circle cx="9.5" cy="7.5" r="0.8" />
                <circle cx="14.5" cy="7.5" r="0.8" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-[#0e2445]">Pet</span>
                <span className="text-[#1d70f5]">Café</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Where Sweet Treats Meet Warm Paws
              </p>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0e2445] tracking-tight leading-[1.12]">
              Welcome to <br />
              <span className="text-[#1d70f5]">Pet Café</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-lg font-normal leading-relaxed">
              A cozy haven where pets &amp; people come together to create beautiful memories.
            </p>
          </div>

          {/* 4 Feature List Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">

            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl transition-all">
              <div className="w-11 h-11 rounded-2xl bg-sky-100/90 text-[#1d70f5] flex items-center justify-center flex-shrink-0 border border-sky-200/60 shadow-xs">
                <Calendar className="w-5 h-5 text-[#1d70f5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0e2445] leading-snug">Book &amp; Explore</h3>
                <p className="text-xs text-slate-500 font-medium">Reserve tables and discover events</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl transition-all">
              <div className="w-11 h-11 rounded-2xl bg-sky-100/90 text-[#1d70f5] flex items-center justify-center flex-shrink-0 border border-sky-200/60 shadow-xs">
                <PawPrint className="w-5 h-5 text-[#1d70f5] fill-current" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0e2445] leading-snug">Pet Friendly</h3>
                <p className="text-xs text-slate-500 font-medium">A safe and happy place for pets</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl transition-all">
              <div className="w-11 h-11 rounded-2xl bg-sky-100/90 text-[#1d70f5] flex items-center justify-center flex-shrink-0 border border-sky-200/60 shadow-xs">
                <Coffee className="w-5 h-5 text-[#1d70f5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0e2445] leading-snug">Sweet Treats</h3>
                <p className="text-xs text-slate-500 font-medium">Delicious treats for you and your pet</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5 p-2 rounded-2xl transition-all">
              <div className="w-11 h-11 rounded-2xl bg-sky-100/90 text-[#1d70f5] flex items-center justify-center flex-shrink-0 border border-sky-200/60 shadow-xs">
                <Gift className="w-5 h-5 text-[#1d70f5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0e2445] leading-snug">Loyalty Perks</h3>
                <p className="text-xs text-slate-500 font-medium">Earn points and enjoy exclusive rewards</p>
              </div>
            </div>

          </div>

          {/* Animals Photo Container & Floating Bottom Pill */}
          <div className="relative pt-2">

            {/* Real Animals Photo Container matching screenshot Golden Retriever + Cat */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-sky-50 max-w-xl group">
              <img
                src="/hero-pets.jpg"
                alt="Golden retriever and fluffy cat sitting together in Pet Café"
                className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Heart Trail above cat */}
              <div className="absolute top-4 right-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-sky-200">
                <Heart className="w-4 h-4 text-[#1d70f5] fill-sky-200 animate-pulse" />
                <span className="text-[11px] font-bold text-[#0e2445]">Best Furry Friends</span>
              </div>
            </div>

            {/* Floating Bottom Pill matching screenshot */}
            <div className="mt-4 inline-flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl shadow-blue-500/10 border border-sky-150">
              <div className="w-8 h-8 rounded-full bg-[#1d70f5] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Because every <span className="text-[#1d70f5] font-bold">tail wag</span> deserves a warm welcome.
              </p>
            </div>

          </div>

        </div>


        {/* ================= RIGHT AUTHENTICATION CARD ================= */}
        <div className="lg:col-span-5 flex justify-center">

          <div className="w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-blue-900/10 border border-sky-150 relative">

            {/* Floating Top Badge with steaming mug icon matching screenshot */}
            <div className="w-16 h-16 rounded-full bg-white border-2 border-sky-200 shadow-lg shadow-blue-500/15 flex items-center justify-center text-[#1d70f5] -mt-14 sm:-mt-16 mx-auto mb-4 relative z-20">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-[#1d70f5]" />
              </div>
            </div>

            {/* Card Titles */}
            <div className="text-center space-y-1 mb-5">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0e2445] tracking-tight">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {authMode === 'login'
                  ? 'Sign in to your account to continue'
                  : 'Sign up to access your role-specific dashboard'}
              </p>
            </div>

            {/* Role Switcher Tabs (Fulfilling Role-Based Entry) */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5 px-1">
                <span>Select Your Role</span>
                <span className="text-[11px] text-[#1d70f5] font-extrabold uppercase">
                  {currentRole.title} Portal
                </span>
              </div>
              <div className="grid grid-cols-3 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                {['Customer', 'Staff', 'Admin'].map((roleKey) => {
                  const isSelected = selectedRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => handleRoleSelect(roleKey)}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${isSelected
                        ? `${roleConfigs[roleKey].badgeColor} shadow-sm`
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {roleKey}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick 1-Click Fast Fill Pill for Testing */}
            <div className="mb-5 p-2.5 bg-amber-50 rounded-2xl border border-amber-200/90 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Demo: {selectedRole}</span>
                </p>
                <p className="text-xs text-amber-900 font-medium truncate">
                  {currentRole.demoEmail}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleFillDemoCreds(selectedRole)}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                  title="Auto-fill email & password"
                >
                  Fill
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handle1ClickDemo(selectedRole)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  title="Direct 1-click login"
                >
                  Quick Sign In
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* If Register Mode: Name & Phone */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#0e2445] mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="E.g. Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#1d70f5] focus:ring-2 focus:ring-blue-100 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0e2445] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#1d70f5] focus:ring-2 focus:ring-blue-100 text-slate-800"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address with STRICT VALIDATION */}
              <div>
                <label className="block text-xs font-bold text-[#0e2445] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-2xl text-sm focus:outline-none transition-all text-slate-800 ${emailError && emailTouched
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                      : emailTouched && !emailError && email
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                        : 'border-slate-200 focus:border-[#1d70f5] focus:ring-2 focus:ring-blue-100'
                      }`}
                  />
                  {/* Right Status Indicator */}
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {emailTouched && emailError && (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                    {emailTouched && !emailError && email && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>

                {/* Email Validation Error Note matching user requirement */}
                {emailError && emailTouched && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-start gap-1 leading-snug">
                    <span>⚠️</span>
                    <span>{emailError}</span>
                  </p>
                )}
                {emailTouched && !emailError && email && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <span>✓</span>
                    <span>Valid email domain format</span>
                  </p>
                )}
              </div>

              {/* Password with Eye / EyeOff Icon */}
              <div>
                <label className="block text-xs font-bold text-[#0e2445] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#1d70f5] focus:ring-2 focus:ring-blue-100 text-slate-800"
                  />
                  {/* Password Toggle Visibility Icon as requested by user */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Forgot password link */}
                {authMode === 'login' && (
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => showToast('Password reset link has been dispatched to your email.', 'info')}
                      className="text-xs text-[#1d70f5] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* Remember me Checkbox */}
              {authMode === 'login' && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1d70f5] focus:ring-blue-400 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#1d70f5] hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In' : `Create ${selectedRole} Account`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Divider "or continue with" */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-3 bg-white text-xs text-slate-400 font-semibold">
                or continue with
              </span>
            </div>

            {/* Social Buttons: Google & Apple matching screenshot */}
            <div className="grid grid-cols-2 gap-3 mb-5">

              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialClick('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleSocialClick('Apple')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.79-11.45-20.93-15.1-33.43-3.65-12.5-5.48-24.16-5.48-34.98 0-14.9 3.73-27.17 11.19-36.81 7.46-9.64 16.79-14.54 27.99-14.7 4.9 0 10.36 1.34 16.38 4.02 6.02 2.68 10.15 4.07 12.39 4.17 1.85 0 6.13-1.45 12.84-4.35 6.71-2.9 12.52-4.14 17.43-3.72 13.62.87 24.36 5.51 32.22 13.92-11.87 7.18-17.7 17.1-17.5 29.76.2 9.79 3.97 18.06 11.31 24.81 7.34 6.75 16.14 10.45 26.4 11.1-2.07 6.31-4.7 12.63-7.89 18.96zM119.22 33.15c0-7.29 2.66-14.05 7.98-20.28 5.32-6.23 11.85-10.45 19.59-12.66.76 2.39 1.14 4.89 1.14 7.5 0 7.39-2.77 14.33-8.31 20.82-5.54 6.49-12.33 10.59-20.37 12.3-.02-2.56-.03-5.12-.03-7.68z" />
                </svg>
                <span>Apple</span>
              </button>

            </div>

            {/* Switch Sign in / Sign up Mode */}
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium">
                {authMode === 'login' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setEmailError('');
                        setEmailTouched(false);
                      }}
                      className="text-[#1d70f5] font-bold hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setEmailError('');
                        setEmailTouched(false);
                      }}
                      className="text-[#1d70f5] font-bold hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Floating subtle footer */}
      <div className="absolute bottom-2 text-center w-full text-[11px] text-slate-400 pointer-events-none hidden sm:block">
        Pet Café Experience • Role-Based Authentication Gateway Enforced
      </div>

    </div>
  );
}
