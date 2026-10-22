'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, CheckCircle2, Sparkles, X, ArrowRight, Lock, LogIn, UserPlus, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const WHATSAPP_PHONE = '917382324346';
const DISPLAY_PHONE = '+91 73823 24346';

interface RazorpayButtonProps {
  projectId: string;
  projectTitle: string;
  priceInr?: number;
  className?: string;
}

export default function RazorpayButton({
  projectId,
  projectTitle,
  priceInr,
  className = '',
}: RazorpayButtonProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; role?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('capstonia_user') || localStorage.getItem('fastrack_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed.name) setStudentName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleOrderClick = () => {
    // Sign in and signup is mandatory for ordering the project
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setShowOrderModal(true);
  };

  const getWhatsAppMessage = (nameVal?: string, phoneVal?: string, emailVal?: string) => {
    return (
      `Hi Capstonia Projects! 👋\n` +
      `I want to inquire & order this engineering project package:\n\n` +
      `📦 Project: ${projectTitle}\n` +
      `👤 Student Name: ${nameVal?.trim() || user?.name || 'Engineering Student'}\n` +
      `📱 WhatsApp: ${phoneVal?.trim() || user?.phone || 'My WhatsApp Number'}\n` +
      `✉️ Student Account Email: ${emailVal?.trim() || user?.email || 'N/A'}\n` +
      `\n✅ Deliverables Included:\n` +
      `• Verified Source Code (ZIP)\n` +
      `• IEEE Format Project Report (.docx/PDF)\n` +
      `• Seminar Viva PPT Presentation\n` +
      `• Video Execution Walkthrough & Setup Guide\n\n` +
      `Please confirm availability and share order details directly here on WhatsApp.`
    );
  };

  const handleDirectWhatsApp = () => {
    const message = getWhatsAppMessage(studentName, phone, email);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.from('custom_requests').insert({
        student_name: studentName.trim() || user?.name || 'Student Buyer',
        email: email.trim() || user?.email || `${phone.replace(/\D/g, '')}@student.capstonia`,
        phone: phone.trim() || user?.phone || 'WhatsApp Direct',
        branch: 'CSE',
        category: 'DIRECT_ORDER',
        project_title: `ORDER: ${projectTitle}`,
        description: `Verified Student Order for project: ${projectTitle} (User: ${user?.email || 'N/A'})`,
        budget: 'WhatsApp Inquiry',
        status: 'PENDING',
      });
    } catch (err) {
      console.warn('Could not record order to database:', err);
    }

    try {
      const existingRaw = localStorage.getItem('capstonia_purchased_orders') || localStorage.getItem('fastrack_purchased_orders');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newInquiry = {
        id: `wa_${Date.now()}`,
        orderId: `WA-${Date.now().toString().slice(-6)}`,
        projectId,
        projectTitle,
        amount: 0,
        createdAt: new Date().toISOString(),
        buyerEmail: email || user?.email || phone,
        status: 'WHATSAPP_ORDER',
      };
      existing.unshift(newInquiry);
      localStorage.setItem('capstonia_purchased_orders', JSON.stringify(existing));
    } catch (_) {}

    setIsSubmitting(false);
    setShowOrderModal(false);

    // Open WhatsApp
    handleDirectWhatsApp();
  };

  return (
    <>
      {/* Prominent Direct WhatsApp Order Button */}
      <div className="space-y-2">
        <button
          onClick={handleOrderClick}
          className={`w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 text-sm active:scale-[0.99] border-2 border-[#1EBE5D] cursor-pointer ${className}`}
        >
          {/* Universal WhatsApp Icon */}
          <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16.002 2C8.269 2 2 8.27 2 16.002c0 2.658.742 5.228 2.152 7.461L2.05 30.014l6.732-2.073A13.93 13.93 0 0 0 16.002 30C23.733 30 30 23.732 30 16.002 30 8.27 23.733 2 16.002 2zm7.644 19.832c-.32.898-1.59 1.656-2.586 1.871-.68.148-1.57.266-4.555-.973-3.816-1.586-6.28-5.46-6.473-5.715-.187-.258-1.547-2.062-1.547-3.934 0-1.871.977-2.793 1.328-3.176.352-.383.766-.48 1.023-.48.258 0 .512.004.738.016.242.012.566-.094.887.676.328.789 1.125 2.742 1.223 2.941.098.2.164.434.031.691-.133.258-.2.418-.398.652-.199.234-.418.523-.598.703-.2.2-.41.418-.176.82.234.398 1.043 1.723 2.234 2.785 1.535 1.367 2.832 1.793 3.23 1.992.398.2.633.168.867-.098.234-.266.996-1.16 1.262-1.559.266-.398.531-.332.898-.2.367.133 2.332 1.1 2.73 1.3.398.2.664.297.766.465.098.172.098.992-.223 1.89z" />
          </svg>
          <span>Order via WhatsApp</span>
        </button>

        <p className="text-center text-[11px] text-[#000000]/70 font-bold flex items-center justify-center gap-1">
          <Lock className="h-3 w-3 text-[#000000]/60" />
          <span>Student Sign In required to place order • Instant WhatsApp Delivery</span>
        </p>
      </div>

      {/* Mandatory Sign In Modal (shown when guest student clicks Order) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] border-2 border-[#D8CEBE] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#000000] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="h-7 w-7 text-white" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase tracking-wider mb-2">
                Sign In Required to Order
              </span>
              <h3 className="text-xl font-black text-[#000000]">Sign In to Order Project</h3>
              <p className="text-xs text-[#000000]/80 font-medium mt-2 leading-relaxed">
                Please sign in or create a student account to order <strong>&quot;{projectTitle}&quot;</strong>. Having an account protects your order history, verified IEEE downloads, and 1-on-1 technical mentoring.
              </p>
            </div>

            <div className="p-3 bg-[#ECE4DA] border border-[#D8CEBE] rounded-2xl text-[11px] text-[#000000] font-bold text-left space-y-1">
              <div className="text-black font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>Why Sign In is Required:</span>
              </div>
              <div className="pl-5 text-[#000000]/80 font-medium text-[11px] space-y-0.5">
                <div>• Permanent access to Source Code ZIP & Reports</div>
                <div>• Verified WhatsApp student support & guidance</div>
                <div>• Fast 1-click re-downloads on any device</div>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}&reason=order`}
                className="w-full py-3.5 bg-[#000000] hover:bg-[#1a1a1a] text-white font-black rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In with Existing Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href={`/login?mode=signup&redirect=${encodeURIComponent(pathname)}&reason=order`}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create New Student Account (Sign Up)</span>
              </Link>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2 text-xs font-bold text-[#000000]/60 hover:text-[#000000] transition-colors"
              >
                Cancel and continue browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal (shown when authenticated user clicks Order) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] border-2 border-[#D8CEBE] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#D8CEBE] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#25D366] text-white uppercase tracking-wider mb-1.5">
                  Verified Student Order
                </span>
                <h3 className="text-lg font-black text-[#000000]">Order Project Package</h3>
                <p className="text-xs text-[#000000]/80 font-medium">
                  {projectTitle}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-[#000000]/70 hover:text-[#000000] p-1.5 rounded-full hover:bg-[#ECE4DA] transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Signed In User Pill */}
            {user && (
              <div className="p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl flex items-center gap-2 text-xs text-[#000000] font-bold">
                <User className="h-4 w-4 text-[#25D366] shrink-0" />
                <span className="truncate">
                  Signed in as <strong>{user.name}</strong> ({user.email})
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-[#000000] text-xs focus:outline-none focus:border-[#000000] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-[#000000] text-xs focus:outline-none focus:border-[#000000] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  placeholder="student@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-[#000000] text-xs focus:outline-none focus:border-[#000000] font-bold"
                />
              </div>

              <div className="p-3 bg-[#ECE4DA] border border-[#D8CEBE] rounded-2xl space-y-1 text-[11px] text-[#000000] font-bold">
                <div className="text-black font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>Deliverables Ready on WhatsApp:</span>
                </div>
                <div className="text-[11px] text-[#000000]/80 font-medium pl-5 space-y-0.5">
                  <div>• Tested Source Code ZIP</div>
                  <div>• IEEE Formatted Report (.docx/PDF) & Viva PPT</div>
                  <div>• Video Setup & Technical Guidance</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Send Order to WhatsApp ({DISPLAY_PHONE})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
