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
} from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }
      const user = {
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Student',
        email: data.user.email,
        role: 'STUDENT',
        branch: 'CSE',
      };
      localStorage.setItem('fastrack_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));

      setSuccessMsg('Successfully authenticated with Supabase! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);

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
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            phone,
            branch,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const user = {
        name: fullName,
        email: signupEmail,
        phone,
        branch,
        role: 'STUDENT',
      };

      localStorage.setItem('fastrack_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));

      setSuccessMsg('Account registered with Supabase! Redirecting to your dashboard...');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign up.');
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
          ? { name: 'Admin Lead', email: 'admin@fastrackprojects.com', role: 'ADMIN', branch: 'CSE' }
          : { name: 'Rahul Sharma', email: 'rahul.student@college.edu', role: 'STUDENT', branch: 'CSE' };

      localStorage.setItem('fastrack_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));

      setSuccessMsg(`Signed in as ${user.name} (${role})! Redirecting...`);
      setTimeout(() => {
        router.push(role === 'ADMIN' ? '/admin' : '/dashboard');
      }, 800);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-[#000000]">
      {/* Top Logo & Title Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#000000] p-1.5 shadow-md border border-[#D8CEBE]">
          <Image
            src="/images/logo.jpg"
            alt="fastrackprojects logo"
            width={48}
            height={48}
            className="object-contain rounded-xl"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">
          {mode === 'login' ? 'Welcome Back to FastTrack' : 'Create Your Student Account'}
        </h1>
        <p className="text-xs text-[#000000]/80 font-medium">
          {mode === 'login'
            ? 'Access your purchased source code ZIPs, reports, and viva PPTs.'
            : 'Join 10,000+ engineering students downloading verified deliverables.'}
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-6">
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
          <div className="p-3.5 rounded-xl bg-[#ECE4DA] border border-[#000000]/30 text-xs font-bold text-[#000000] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#000000]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#ECE4DA] border border-[#000000] text-xs font-bold text-[#000000] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#000000]" />
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
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setErrorMsg('Password reset link sent to email (Demo mode)'); }} className="text-[11px] font-bold text-[#000000] hover:underline">
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
              className="w-full py-3 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Get Started'}</span>
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
