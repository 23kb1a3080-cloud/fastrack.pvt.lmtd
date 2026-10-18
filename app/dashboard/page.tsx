'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Download,
  CheckCircle2,
  FileText,
  Sparkles,
  LogIn,
  ShoppingBag,
  ShieldCheck,
  Package,
  Clock,
  ArrowRight,
  ExternalLink,
  Code,
  Layers,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils/currency';

interface OrderItem {
  id: string;
  orderId: string;
  paymentId?: string;
  amountInr?: number;
  packageTier?: string;
  status: string;
  createdAt: string;
  project: {
    id: string;
    title: string;
    slug: string;
    branch: string;
    category: string;
    short_description: string;
    file_path?: string;
  };
}

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';
  const paramOrderId = searchParams.get('orderId');

  const [user, setUser] = useState<{ name: string; email: string; role: string; branch?: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 1. Identify User Session
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
              branch: data.user.branch || 'Engineering',
            };
            localStorage.setItem('capstonia_user', JSON.stringify(currentUser));
          }
        } catch (_) {}
      }

      setUser(currentUser);
      setLoadingUser(false);
    };

    checkUser();
  }, []);

  // 2. Fetch User's Real Purchases (Publicly & Dynamically)
  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const normalizedEmail = user.email.toLowerCase().trim();
        const res = await fetch(`/api/orders?email=${encodeURIComponent(normalizedEmail)}`);
        const data = await res.json();

        let userOrders: OrderItem[] = [];
        if (data.success && Array.isArray(data.orders)) {
          userOrders = data.orders;
        }

        // Merge with client-side verified orders cache for instant rendering
        try {
          const localRaw = localStorage.getItem('capstonia_purchased_orders') || localStorage.getItem('fastrack_purchased_orders');
          if (localRaw) {
            const localList = JSON.parse(localRaw);
            const matchingLocal = localList.filter(
              (o: any) => o.buyerEmail?.toLowerCase().trim() === normalizedEmail
            );

            for (const item of matchingLocal) {
              const alreadyExists = userOrders.some(
                (o) => o.orderId === item.orderId || o.id === item.id || (item.project && o.project?.id === item.project?.id)
              );
              if (!alreadyExists) {
                userOrders.unshift(item);
              }
            }
          }
        } catch (_) {}

        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to load purchased orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loadingUser) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin h-9 w-9 border-4 border-[#000000] border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-bold text-[#000000]/70 uppercase tracking-widest">
          Authenticating Student Session...
        </p>
      </div>
    );
  }

  // Not signed in -> Clear student authorization prompt
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
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-300 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold shrink-0">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-950">Payment Verified & Completed!</h3>
              <p className="text-xs text-emerald-800 font-medium">
                Order {paramOrderId ? `#${paramOrderId}` : 'Confirmation'} is verified. Your complete deliverables package is unlocked below.
              </p>
            </div>
          </div>
          <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full border border-emerald-300 shrink-0">
            Instant Download Ready ✓
          </span>
        </div>
      )}

      {/* User Welcome & Profile Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
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
            Account Email: <strong className="text-[#000000]">{user.email}</strong> • Access your ordered deliverables and documentation below.
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

      {/* Loading state for orders */}
      {loadingOrders && (
        <div className="py-16 text-center bg-[#FAF6F0] rounded-3xl border border-[#D8CEBE]">
          <div className="inline-block animate-spin h-7 w-7 border-3 border-[#000000] border-t-transparent rounded-full mb-3" />
          <p className="text-xs font-bold text-[#000000]/70 uppercase tracking-wider">
            Fetching Your Project Deliverables...
          </p>
        </div>
      )}

      {/* ZERO PURCHASES EMPTY STATE — Clean & Professional */}
      {!loadingOrders && orders.length === 0 && (
        <div className="p-8 sm:p-14 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] text-[#000000] flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="h-8 w-8 text-[#000000]/70" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-black uppercase tracking-wider bg-[#ECE4DA] text-[#000000]/75 px-3.5 py-1 rounded-full border border-[#D8CEBE]">
              My Purchases • 0 Active Orders
            </span>
            <h2 className="text-2xl font-black text-[#000000]">No Project Deliverables Yet</h2>
            <p className="text-xs text-[#000000]/75 font-medium leading-relaxed">
              You haven't ordered any project packages yet for <strong className="text-[#000000]">{user.email}</strong>. Once you select a verified Standard or Premier project package from our catalog, your complete deliverables—including full source code (.zip), IEEE formatted documentation, viva presentation slides, and setup instructions—will appear here for instant download.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/projects"
              className="px-6 py-3.5 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Browse Engineering Catalog</span>
            </Link>
            <Link
              href="/custom-request"
              className="px-5 py-3.5 rounded-full bg-[#ECE4DA] hover:bg-[#E5DCCF] text-[#000000] border border-[#D8CEBE] font-extrabold text-xs transition-all flex items-center gap-2"
            >
              <span>Submit Custom Request</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="pt-6 border-t border-[#D8CEBE] flex flex-wrap items-center justify-center gap-6 text-xs text-[#000000]/70 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Standard Packages: ₹3,500 – ₹5,000
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Premier Packages: ₹7,000 – ₹10,000
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              100% Viva-Voce & IEEE Compliance
            </span>
          </div>
        </div>
      )}

      {/* ACTIVE PURCHASES GRID — Display ONLY When Student Ordered Project */}
      {!loadingOrders && orders.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#000000]">My Deliverable Packages</h2>
              <p className="text-xs text-[#000000]/70 font-medium">
                Verified project deliverables registered to {user.email}
              </p>
            </div>
            <span className="text-xs font-extrabold bg-[#000000] text-white px-3.5 py-1 rounded-full shadow-xs">
              {orders.length} {orders.length === 1 ? 'Active Package' : 'Active Packages'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              const proj = order.project;
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent Order';

              const tierName = order.packageTier || 'Standard';
              const isPremier = tierName.toLowerCase().includes('premier');

              return (
                <div
                  key={order.id || order.orderId}
                  className="p-6 sm:p-7 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-5 flex flex-col justify-between shadow-xs hover:border-[#000000]/40 transition-all"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#000000] px-3 py-1 rounded-full bg-[#ECE4DA] border border-[#D8CEBE]">
                          {proj?.branch || 'Engineering'} • {proj?.category === 'MAJOR_FINAL_YEAR' ? 'Major Project' : 'Mini Project'}
                        </span>
                        <span
                          className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                            isPremier
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}
                        >
                          {tierName} Package
                        </span>
                      </div>

                      <span className="text-xs text-emerald-800 font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                        Verified & Paid
                      </span>
                    </div>

                    {/* Project Title & Short Description */}
                    <div>
                      <h3 className="text-lg font-black text-[#000000] leading-snug line-clamp-2">
                        {proj?.title || 'Engineering Project Deliverable'}
                      </h3>
                      <p className="text-xs text-[#000000]/75 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {proj?.short_description || 'Complete verified project deliverable with source code, report, and viva PPT.'}
                      </p>
                    </div>

                    {/* Order Meta Info */}
                    <div className="p-3.5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#000000]/60 block font-bold">Order ID</span>
                        <strong className="text-[#000000] font-mono">{order.orderId || order.id}</strong>
                      </div>
                      <div>
                        <span className="text-[#000000]/60 block font-bold">Date</span>
                        <strong className="text-[#000000]">{formattedDate}</strong>
                      </div>
                      {order.amountInr && (
                        <div>
                          <span className="text-[#000000]/60 block font-bold">Amount Paid</span>
                          <strong className="text-[#000000] font-black">{formatINR(order.amountInr)}</strong>
                        </div>
                      )}
                      <div>
                        <span className="text-[#000000]/60 block font-bold">Access Status</span>
                        <strong className="text-emerald-800 font-black">Lifetime Unlocked ✓</strong>
                      </div>
                    </div>

                    {/* Deliverables Checklist */}
                    <div className="space-y-1.5 text-xs text-[#000000]/85 font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>Complete Clean Source Code (.zip archive)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>IEEE Standard Project Report (.docx / .pdf format)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>Viva-Voce Defense Presentation & Q&A (.pptx)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>Step-by-Step Execution and Setup Instructions</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Downloads */}
                  <div className="pt-4 border-t border-[#D8CEBE] space-y-2">
                    <a
                      href={`/api/download/${order.orderId || order.id}`}
                      download
                      className="w-full py-3.5 px-4 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Complete Deliverables ZIP Archive</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/api/download/${order.orderId || order.id}?type=report`}
                        download
                        className="py-2.5 px-3 rounded-full bg-[#ECE4DA] hover:bg-[#E5DCCF] text-[#000000] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border border-[#D8CEBE]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#000000]" />
                        <span>IEEE Report</span>
                      </a>

                      {proj?.slug && (
                        <Link
                          href={`/projects/${proj.slug}`}
                          className="py-2.5 px-3 rounded-full bg-[#ECE4DA] hover:bg-[#E5DCCF] text-[#000000] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border border-[#D8CEBE]"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[#000000]" />
                          <span>Setup Guide</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
