'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEMO_PROJECTS } from '@/lib/constants';
import { Download, CheckCircle2, FileText, User, Sparkles, LogIn, ShoppingBag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';
  const orderId = searchParams.get('orderId') || 'ORD-89412';

  const [user, setUser] = useState<{ name: string; email: string; role: string; branch?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      let currentUser: any = null;
      try {
        const stored = localStorage.getItem('capstonia_user') || localStorage.getItem('fastrack_user');
        if (stored) {
          currentUser = JSON.parse(stored);
        }
      } catch (_) {}

      if (!currentUser) {
        try {
          const res = await fetch('/api/auth/me');
          const data = await res.json();
          if (data.authenticated && data.user) {
            currentUser = {
              name: data.user.full_name,
              email: data.user.email,
              role: data.user.role === 'admin' ? 'ADMIN' : 'STUDENT',
              branch: data.user.branch || 'CSE',
            };
            localStorage.setItem('capstonia_user', JSON.stringify(currentUser));
          }
        } catch (_) {}
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  const purchasedProjects = [DEMO_PROJECTS[0], DEMO_PROJECTS[1]];

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-[#000000] border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-bold text-[#000000]/70 uppercase tracking-wider">
          Loading Your Deliverables...
        </p>
      </div>
    );
  }

  // Not signed in -> Authorization prompt
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#000000] text-white flex items-center justify-center mx-auto shadow-md">
          <ShoppingBag className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#000000]">Sign In to View Purchases</h1>
          <p className="text-xs text-[#000000]/75 font-medium leading-relaxed">
            Please log in or register your student account to access your purchased project packages, source code ZIP archives, and editable IEEE reports.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/login?redirect=/dashboard"
            className="w-full py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Student Account</span>
          </Link>
          <Link
            href="/login?mode=signup&redirect=/dashboard"
            className="w-full py-3 rounded-full bg-[#FAF6F0] hover:bg-[#E5DCCF] text-[#000000] border border-[#D8CEBE] font-extrabold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Create New Student Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#ECE4DA] text-[#000000]">
      {/* Payment Success Toast Banner */}
      {paymentSuccess && (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-950">Payment Verified & Completed!</h3>
              <p className="text-xs text-emerald-800 font-medium">Order #{orderId} has been confirmed. Your deliverables are unlocked below.</p>
            </div>
          </div>
          <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full border border-emerald-300">
            Instant Download Ready ✓
          </span>
        </div>
      )}

      {/* User Welcome & Profile Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              Verified Student Account
            </span>
            <span className="text-xs font-bold text-[#000000]/60">Department: {user.branch || 'Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#000000]">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xs text-[#000000]/80 font-medium">
            Registered Email: <strong className="text-[#000000]">{user.email}</strong> • Access your verified deliverables below.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] text-xs font-black shadow-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Browse Catalog</span>
          </Link>
          <Link
            href="/custom-request"
            className="px-4 py-2.5 rounded-full bg-[#ECE4DA] hover:bg-[#E5DCCF] text-[#000000] border border-[#D8CEBE] text-xs font-bold transition-all"
          >
            Custom Order
          </Link>
        </div>
      </div>

      {/* My Purchased Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#000000]">My Deliverable Packages</h2>
          <span className="text-xs font-bold text-[#000000]/70">{purchasedProjects.length} Active Downloads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchasedProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 sm:p-7 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-5 flex flex-col justify-between shadow-xs hover:border-[#000000]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#000000] px-3 py-1 rounded-full bg-[#ECE4DA] border border-[#D8CEBE]">
                    {project.branch} • {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Project' : 'Mini Project'}
                  </span>
                  <span className="text-xs text-emerald-800 font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    Verified & Paid
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#000000] line-clamp-2">{project.title}</h3>
                <p className="text-xs text-[#000000]/75 mt-2 line-clamp-2 leading-relaxed font-medium">
                  {project.short_description}
                </p>
              </div>

              {/* Action Downloads */}
              <div className="pt-4 border-t border-[#D8CEBE] space-y-2">
                <a
                  href={`/api/download/${orderId}`}
                  className="w-full py-3.5 px-4 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Complete Deliverables ZIP Archive</span>
                </a>

                <Link
                  href={`/projects/${project.slug}`}
                  className="w-full py-2.5 px-4 rounded-full bg-[#ECE4DA] hover:bg-[#E5DCCF] text-[#000000] font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-[#D8CEBE]"
                >
                  <FileText className="h-4 w-4 text-[#000000]" />
                  <span>View Documentation & Setup Guide</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#ECE4DA] text-[#000000]">
      <Suspense fallback={<div className="text-[#000000]/70 text-sm py-10 font-bold text-center">Loading student dashboard...</div>}>
        <BuyerDashboardContent />
      </Suspense>
    </div>
  );
}
