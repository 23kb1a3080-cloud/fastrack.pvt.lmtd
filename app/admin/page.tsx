'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEMO_PROJECTS } from '@/lib/constants';
import { formatINR } from '@/lib/utils/currency';
import { Shield, Plus, ShieldAlert, ArrowRight, LogIn, Lock } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check local storage
      let currentUser: any = null;
      try {
        const stored = localStorage.getItem('capstonia_user') || localStorage.getItem('fastrack_user');
        if (stored) {
          currentUser = JSON.parse(stored);
        }
      } catch (_) {}

      // 2. Also check /api/auth/me cookie
      if (!currentUser) {
        try {
          const res = await fetch('/api/auth/me');
          const data = await res.json();
          if (data.authenticated && data.user) {
            currentUser = {
              name: data.user.full_name,
              email: data.user.email,
              role: data.user.role === 'admin' ? 'ADMIN' : 'STUDENT',
            };
            localStorage.setItem('capstonia_user', JSON.stringify(currentUser));
          }
        } catch (_) {}
      }

      setUser(currentUser);
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const totalRevenue = 148900;
  const totalOrders = 84;
  const totalProjects = DEMO_PROJECTS.length;

  if (checkingAuth) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-[#000000] border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-bold text-[#000000]/70 uppercase tracking-wider">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  // Not logged in -> Prompt to sign in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#000000] text-white flex items-center justify-center mx-auto shadow-md">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#000000]">Admin Login Required</h1>
          <p className="text-xs text-[#000000]/75 font-medium leading-relaxed">
            The administrator portal is restricted to authorized faculty and technical evaluators. Please sign in with your admin credentials.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D8CEBE] text-left text-xs space-y-1.5">
          <p className="font-extrabold text-[#000000]">Default Admin Demo Credentials:</p>
          <p className="text-[#000000]/80">Email: <strong className="text-[#000000]">admin@capstonia.com</strong></p>
          <p className="text-[#000000]/80">Password: <strong className="text-[#000000]">adminpassword123</strong></p>
        </div>
        <Link
          href="/login?redirect=/admin"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In to Admin Portal</span>
        </Link>
      </div>
    );
  }

  // Logged in, but NOT an admin
  const isAdmin = user.role === 'ADMIN' || user.role === 'admin' || user.email.includes('admin');
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#000000]">Access Restricted</h1>
          <p className="text-xs text-[#000000]/75 font-medium leading-relaxed">
            You are currently signed in as <strong className="text-[#000000]">{user.name}</strong> ({user.email}) with <strong>Student</strong> permissions. This area is reserved for administrators.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Go to Student Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login?redirect=/admin"
            className="w-full py-3 rounded-full bg-[#FAF6F0] hover:bg-[#E5DCCF] text-[#000000] border border-[#D8CEBE] font-extrabold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Switch to Admin Account</span>
          </Link>
        </div>
      </div>
    );
  }

  // Authorized Admin View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#ECE4DA] text-[#000000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#000000] text-white">
              <Shield className="h-5 w-5 text-white" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000]">Admin Control Portal</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#000000]/80 mt-1 font-medium">
            Manage engineering project catalog, review Razorpay transactions & track customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E5DCCF] border border-[#D8CEBE] text-[#000000]">
            Logged in: {user.name} (Admin)
          </span>
          <button className="px-5 py-2.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all">
            <Plus className="h-4 w-4" />
            <span>Upload Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-2 shadow-xs">
          <span className="text-xs font-extrabold text-[#000000]/60 uppercase tracking-wider">Total Sales Volume</span>
          <div className="text-3xl font-black text-[#000000]">{formatINR(totalRevenue)}</div>
          <span className="text-[11px] text-[#000000]/70 font-medium">Processed securely via Razorpay UPI & Cards</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-2 shadow-xs">
          <span className="text-xs font-extrabold text-[#000000]/60 uppercase tracking-wider">Completed Orders</span>
          <div className="text-3xl font-black text-[#000000]">{totalOrders}</div>
          <span className="text-[11px] text-[#000000]/70 font-medium">Student project downloads</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-2 shadow-xs">
          <span className="text-xs font-extrabold text-[#000000]/60 uppercase tracking-wider">Active Catalog Projects</span>
          <div className="text-3xl font-black text-[#000000]">{totalProjects}</div>
          <span className="text-[11px] text-[#000000]/70 font-medium">Across CSE, IT, AIML, AI&DS, CSE (DS)</span>
        </div>
      </div>

      {/* Projects Management Table */}
      <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#000000]">Catalog Projects Deliverables</h2>
          <span className="text-xs font-bold text-[#000000]/70">{DEMO_PROJECTS.length} Published Projects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ECE4DA] text-[#000000] uppercase tracking-wider font-extrabold border-b border-[#D8CEBE]">
              <tr>
                <th className="p-3">Project Title</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Category</th>
                <th className="p-3">Standard Price</th>
                <th className="p-3">Premier Price</th>
                <th className="p-3">Downloads</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8CEBE]/60 text-[#000000] font-medium">
              {DEMO_PROJECTS.map((project) => {
                const stdPrice = project.discounted_price_inr || project.price_inr;
                const premPrice = Math.min(10000, Math.max(7000, Math.round((stdPrice * 2) / 50) * 50));
                return (
                  <tr key={project.id} className="hover:bg-[#ECE4DA]/50 transition-colors">
                    <td className="p-3 font-bold text-[#000000] max-w-xs truncate">
                      {project.title}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECE4DA] text-[#000000] font-bold border border-[#D8CEBE]">
                        {project.branch}
                      </span>
                    </td>
                    <td className="p-3">
                      {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Final Year' : 'Mini Project'}
                    </td>
                    <td className="p-3 font-extrabold text-[#000000]">
                      {formatINR(stdPrice)}
                    </td>
                    <td className="p-3 font-extrabold text-amber-800">
                      {formatINR(premPrice)}
                    </td>
                    <td className="p-3">{project.download_count} orders</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                        Published ✓
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
