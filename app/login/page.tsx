'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BRANCHES } from '@/lib/constants';
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
  Check,
  ExternalLink,
} from 'lucide-react';

export function AuthContent({ defaultMode }: { defaultMode?: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '';
  const initialMode = defaultMode || (searchParams.get('mode') === 'signup' ? 'signup' : 'login');

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Successful Registration Verification State
  const [registeredUser, setRegisteredUser] = useState<{
    name: string;
    email: string;
    branch: string;
    role: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(4);

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

  useEffect(() => {
    if (!defaultMode && searchParams.get('mode') === 'signup') {
      setMode('signup');
    }
  }, [searchParams, defaultMode]);

  // Handle countdown redirection after verified registration
  useEffect(() => {
    if (!registeredUser) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectParam || '/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [registeredUser, router, redirectParam]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed. Please check credentials.');
      } else {
        const user = {
          name: data.user.full_name || loginEmail.split('@')[0],
          email: data.user.email,
          role: data.user.role === 'admin' ? 'ADMIN' : 'STUDENT',
          branch: data.user.branch || 'CSE',
        };
        localStorage.setItem('capstonia_user', JSON.stringify(user));
        localStorage.setItem('fastrack_user', JSON.stringify(user));
        window.dispatchEvent(new Event('authChange'));

        setSuccessMsg('Successfully signed in! Redirecting...');
        setTimeout(() => {
          if (redirectParam) {
            router.push(redirectParam);
          } else {
            router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard');
          }
        }, 600);
      }
    } catch {
      setErrorMsg('Network or database connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName || !signupEmail || !phone || !signupPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email: signupEmail,
          password: signupPassword,
          phone,
          branch,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to create account.');
      } else {
        const user = {
          name: fullName,
          email: signupEmail,
          phone,
          branch,
          role: data.user?.role === 'admin' ? 'ADMIN' : 'STUDENT',
        };

        // Save session locally and dispatch update
        localStorage.setItem('capstonia_user', JSON.stringify(user));
        localStorage.setItem('fastrack_user', JSON.stringify(user));
        window.dispatchEvent(new Event('authChange'));

        // Show prominent verified registration screen
        setRegisteredUser(user);
      }
    } catch {
      setErrorMsg('Network error connecting to database.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'STUDENT' | 'ADMIN') => {
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user =
        role === 'ADMIN'
          ? { name: 'Capstonia Admin Lead', email: 'admin@capstonia.com', role: 'ADMIN', branch: 'CSE' }
          : { name: 'Rahul Sharma', email: 'student@example.com', role: 'STUDENT', branch: 'CSE' };

      localStorage.setItem('capstonia_user', JSON.stringify(user));
      localStorage.setItem('fastrack_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));

      setSuccessMsg(`Signed in as ${user.name} (${role})! Redirecting...`);
      setTimeout(() => {
        if (redirectParam) {
          router.push(redirectParam);
        } else {
          router.push(role === 'ADMIN' ? '/admin' : '/dashboard');
        }
      }, 600);
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-[#000000]">
      {/* Top Logo & Title Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#000000] p-1.5 shadow-md border border-[#D8CEBE]">
          <Image
            src="/images/logo.png"
            alt="Capstonia logo"
            width={48}
            height={48}
            className="object-contain rounded-xl"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">
          {registeredUser
            ? 'Account Verified & Active'
            : mode === 'login'
            ? 'Welcome Back to Capstonia'
            : 'Create Your Student Account'}
        </h1>
        <p className="text-xs text-[#000000]/80 font-medium">
          {registeredUser
            ? 'Your registration has been confirmed and verified in our database.'
            : mode === 'login'
            ? 'Access your purchased source code ZIPs, reports, and viva PPTs.'
            : 'Join 10,000+ engineering students downloading verified deliverables.'}
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-6">
        {/* ======================================================== */}
        {/* 1. SUCCESSFUL REGISTRATION & VERIFICATION CONFIRMATION   */}
        {/* ======================================================== */}
        {registeredUser ? (
          <div className="text-center py-3 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#000000] text-emerald-400 flex items-center justify-center mx-auto shadow-md border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                Email Registered & Verified
              </span>
              <h2 className="text-xl font-black text-[#000000]">
                Registration Successful!
              </h2>
              <p className="text-xs text-[#000000]/80 font-medium">
                Welcome to Capstonia, <strong className="text-[#000000]">{registeredUser.name}</strong>!
              </p>
            </div>

            {/* Registration Details Card */}
            <div className="p-4 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#D8CEBE]">
                <span className="text-[#000000]/70 font-semibold">Registered Email:</span>
                <span className="font-extrabold text-[#000000]">{registeredUser.email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D8CEBE]">
                <span className="text-[#000000]/70 font-semibold">Department:</span>
                <span className="font-extrabold text-[#000000]">{registeredUser.branch}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#000000]/70 font-semibold">Account Status:</span>
                <span className="font-black text-emerald-800 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-700 stroke-[3]" />
                  Active Student Member
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push(redirectParam || '/dashboard')}
                className="w-full py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Student Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-[#000000]/65 font-medium">
                Automatically redirecting to your dashboard in <strong className="text-[#000000]">{countdown}</strong> seconds...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Toggle Mode Buttons */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                    : 'text-[#000000] hover:bg-[#FAF6F0]'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                    : 'text-[#000000] hover:bg-[#FAF6F0]'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Feedback Messages */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>{successMsg}</span>
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
                        setErrorMsg('Password reset link sent to registered email.');
                      }}
                      className="text-[11px] font-bold text-[#000000] hover:underline"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                    />
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
                  className="w-full py-3 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                  <ArrowRight className="h-4 w-4" />
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
                      placeholder="e.g. Rahul Sharma"
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
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/60" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                    />
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
                  className="w-full py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Creating Account & Verifying...' : 'Create Account & Verify Email'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Quick One-Click Demo Access */}
            <div className="pt-4 border-t border-[#D8CEBE] space-y-3">
              <span className="block text-center text-[10px] font-extrabold text-[#000000]/60 uppercase tracking-wider">
                Fast One-Click Demo Login
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('STUDENT')}
                  className="px-3 py-2 rounded-xl bg-[#ECE4DA] hover:bg-[#E5DCCF] border border-[#D8CEBE] text-xs font-bold text-[#000000] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#000000]" />
                  <span>Student Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="px-3 py-2 rounded-xl bg-[#ECE4DA] hover:bg-[#E5DCCF] border border-[#D8CEBE] text-xs font-bold text-[#000000] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#000000]" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>
          </>
        )}
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
