'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BRANCHES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const supabase = createClient();

  // Check if user is already logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('capstonia_user') || localStorage.getItem('fastrack_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const currentMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    setMode(currentMode);
  }, [searchParams]);

  // Tab switcher that also updates the URL bar smoothly
  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      if (newMode === 'signup') {
        currentUrl.searchParams.set('mode', 'signup');
      } else {
        currentUrl.searchParams.delete('mode');
      }
      window.history.replaceState(null, '', currentUrl.toString());
    }
  };

  // Reliable redirection helper
  const performRedirect = (userRole?: string) => {
    let target = searchParams.get('redirect') || '';

    // Prevent redirect loops back to login/signup
    if (!target || target.startsWith('/login') || target.startsWith('/signup')) {
      target = userRole === 'ADMIN' ? '/admin' : '/dashboard';
    }

    // Smooth navigation with client router and direct fallback
    setTimeout(() => {
      try {
        router.push(target);
        router.refresh();
      } catch (e) {
        console.warn('router.push failed, using fallback:', e);
      }
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/login')) {
          window.location.href = target;
        }
      }, 300);
    }, 400);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate via robust server auth API route
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password. Please verify your details or sign up.');
      }

      const userObj = data.user;

      // 2. Synchronize Supabase client session if available
      try {
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
      } catch {}

      // 3. Persist local user session
      localStorage.setItem('capstonia_user', JSON.stringify(userObj));
      localStorage.setItem('fastrack_user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('authChange'));

      setSuccessMsg(`Sign in successful! Welcome back, ${userObj.name}. Redirecting...`);
      performRedirect(userObj.role);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = fullName.trim();
    const cleanEmail = signupEmail.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPassword = signupPassword.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      setErrorMsg('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      // 1. Register through our robust server auth API
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          branch,
          password: cleanPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create account. Please check your details.');
      }

      const userObj = data.user;

      // 2. Also register in local storage registry
      try {
        let registry: any[] = [];
        const stored = localStorage.getItem('capstonia_registered_users');
        if (stored) {
          registry = JSON.parse(stored);
        }
        registry = registry.filter((u) => u.email?.toLowerCase() !== cleanEmail);
        registry.push({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          branch,
          role: userObj.role,
          password: cleanPassword,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('capstonia_registered_users', JSON.stringify(registry));
      } catch {}

      // 3. Set current active session
      localStorage.setItem('capstonia_user', JSON.stringify(userObj));
      localStorage.setItem('fastrack_user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('authChange'));

      setSuccessMsg(`Account created successfully for ${cleanName}! Redirecting...`);
      performRedirect(userObj.role);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'STUDENT' | 'ADMIN') => {
    setErrorMsg('');
    setLoading(true);

    const user =
      role === 'ADMIN'
        ? { name: 'Admin Lead', email: 'admin@capstonia.com', role: 'ADMIN', branch: 'CSE', phone: '7382324346' }
        : { name: 'Rahul Sharma', email: 'student@college.edu', role: 'STUDENT', branch: 'CSE', phone: '9876543210' };

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', user }),
      });
    } catch {}

    localStorage.setItem('capstonia_user', JSON.stringify(user));
    localStorage.setItem('fastrack_user', JSON.stringify(user));
    window.dispatchEvent(new Event('authChange'));

    setSuccessMsg(`Signed in as ${user.name} (${role})! Redirecting...`);
    performRedirect(role);
  };

  const handleSwitchAccount = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      supabase.auth.signOut();
    } catch {}

    localStorage.removeItem('capstonia_user');
    localStorage.removeItem('fastrack_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('authChange'));
    setErrorMsg('');
    setSuccessMsg('Signed out of previous account. You can now sign in below.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 text-[#000000]">
      {/* Top Logo & Title Header */}
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#000000] p-1.5 shadow-md border border-[#D8CEBE]">
          <Image
            src="/images/logo.jpg"
            alt="Capstonia logo"
            width={48}
            height={48}
            className="object-contain rounded-xl"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">
          {mode === 'login' ? 'Welcome Back to Capstonia' : 'Create Your Student Account'}
        </h1>
        <p className="text-xs text-[#000000]/80 font-medium">
          {mode === 'login'
            ? 'Access your purchased source code ZIPs, reports, and viva PPTs.'
            : 'Join 10,000+ engineering students downloading verified deliverables.'}
        </p>
      </div>

      {/* Already Logged In Banner */}
      {currentUser && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-black shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="font-extrabold text-[12px] truncate">
                Signed in as {currentUser.name}
              </p>
              <p className="text-[10px] text-amber-800 truncate">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => performRedirect(currentUser.role)}
              className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Continue →
            </button>
            <button
              type="button"
              onClick={handleSwitchAccount}
              title="Sign in with different account"
              className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Sign In Notice for Ordering */}
      {searchParams.get('reason') === 'order' && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 text-xs font-bold flex items-start gap-3 shadow-sm">
          <Lock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-[13px] text-amber-950">Account Required to Order</p>
            <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
              Please sign in or register your account to complete your project order. Once authenticated, you will be redirected right back to finalize delivery on WhatsApp!
            </p>
          </div>
        </div>
      )}

      {/* Auth Card Container */}
      <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#D8CEBE] shadow-md space-y-5">
        {/* Toggle Mode Buttons */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE]">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#000000] text-[#FFFFFF] shadow-sm'
                : 'text-[#000000] hover:bg-[#FAF6F0]'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#000000] text-[#FFFFFF] shadow-sm'
                : 'text-[#000000] hover:bg-[#FAF6F0]'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* High-Contrast Feedback Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-xs font-bold text-rose-950 flex items-start gap-2.5 shadow-sm animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-snug">
              <span className="font-extrabold block text-rose-900 mb-0.5">Authentication Notice</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-xs font-bold text-emerald-950 flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div className="leading-snug">
              <span className="font-extrabold block text-emerald-900">Success!</span>
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMsg('Forgot your password? You can instantly sign in using the One-Click Demo below or create a new student account.');
                  }}
                  className="text-[11px] font-bold text-[#000000] hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000]/60 hover:text-[#000000] p-1 cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#D8CEBE] text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  WhatsApp Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  Branch *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60 pointer-events-none" />
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000]/60 hover:text-[#000000] p-1 cursor-pointer"
                  title={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000]/60 hover:text-[#000000] p-1 cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs font-medium text-[#000000]/90 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#D8CEBE] text-[#000000] focus:ring-[#000000] h-4 w-4"
              />
              <span>
                I agree to the <Link href="/terms" className="font-bold underline text-[#000000]">Terms & Conditions</Link> and <Link href="/privacy" className="font-bold underline text-[#000000]">Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick One-Click Demo Access */}
        <div className="pt-4 border-t border-[#D8CEBE] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#000000]/70 uppercase tracking-wider">
              One-Click Instant Demo Login
            </span>
            <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
              No Password Needed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('STUDENT')}
              className="px-3 py-2.5 rounded-xl bg-[#ECE4DA] hover:bg-[#E5DCCF] border border-[#D8CEBE] text-xs font-extrabold text-[#000000] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="px-3 py-2.5 rounded-xl bg-[#ECE4DA] hover:bg-[#E5DCCF] border border-[#D8CEBE] text-xs font-extrabold text-[#000000] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-xs text-[#000000]">Loading Login...</div>}>
      <AuthContent />
    </Suspense>
  );
}
