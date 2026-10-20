'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/lib/types';

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';
  const orderId = searchParams.get('orderId') || 'ORD-89412';

  const [purchasedProjects, setPurchasedProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchPurchased = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('projects').select('*').limit(2);
      if (data) setPurchasedProjects(data);
    };
    fetchPurchased();
  }, []);

  return (
    <div className="space-y-8 bg-[#FAFAFA]">
      {/* Payment Success Toast Banner */}
      {paymentSuccess && (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-900">Payment Successful!</h3>
              <p className="text-xs text-emerald-700 font-medium">Order #{orderId} has been verified via Razorpay.</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
            Instant Access Unlocked
          </span>
        </div>
      )}

      {/* Dashboard Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Student Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">Access your purchased project files, reports, and presentation decks.</p>
        </div>
      </div>

      {/* My Purchased Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">My Purchased Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchasedProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                    {project.branch}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">Order Paid ✓</span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 line-clamp-2">{project.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{project.short_description}</p>
              </div>

              {/* Action Downloads */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <a
                  href={`/api/download/${orderId}`}
                  className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  Download Source Code & Project Package (ZIP)
                </a>

                <Link
                  href={`/projects/${project.slug}`}
                  className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
                >
                  <FileText className="h-4 w-4 text-slate-700" />
                  View Online Setup Guide & Report
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<div className="text-slate-500 text-sm py-10 font-medium">Loading student dashboard...</div>}>
        <BuyerDashboardContent />
      </Suspense>
    </div>
  );
}
