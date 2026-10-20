'use client';

import { useState } from 'react';
import { formatINR } from '@/lib/utils/currency';
import { MessageCircle, CheckCircle2, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const WHATSAPP_PHONE = '917382324346';
const DISPLAY_PHONE = '+91 73823 24346';

interface RazorpayButtonProps {
  projectId: string;
  projectTitle: string;
  priceInr: number;
  className?: string;
}

export default function RazorpayButton({
  projectId,
  projectTitle,
  priceInr,
  className = '',
}: RazorpayButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getWhatsAppMessage = (nameVal?: string, phoneVal?: string, emailVal?: string) => {
    return (
      `Hi Capstonia Projects! 👋\n` +
      `I want to order this engineering project package:\n\n` +
      `📦 Project: ${projectTitle}\n` +
      `💰 Package Price: ${formatINR(priceInr)}\n` +
      `👤 Student Name: ${nameVal?.trim() || 'Engineering Student'}\n` +
      `📱 WhatsApp: ${phoneVal?.trim() || 'My WhatsApp Number'}\n` +
      (emailVal?.trim() ? `✉️ Email: ${emailVal.trim()}\n` : '') +
      `\n✅ Deliverables Included:\n` +
      `• Verified Source Code (ZIP)\n` +
      `• IEEE Format Project Report (.docx/PDF)\n` +
      `• Seminar Viva PPT Presentation\n` +
      `• Video Execution Walkthrough & Setup Guide\n\n` +
      `Please confirm the order and share delivery details directly here on WhatsApp.`
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
      // Save order inquiry to Supabase custom_requests so admin can track inquiries
      const supabase = createClient();
      await supabase.from('custom_requests').insert({
        student_name: studentName.trim() || 'WhatsApp Student Buyer',
        email: email.trim() || `${phone.replace(/\D/g, '') || 'whatsapp'}@student.inquiry`,
        phone: phone.trim() || 'WhatsApp Direct',
        branch: 'CSE',
        category: 'DIRECT_ORDER',
        project_title: `ORDER: ${projectTitle} (${formatINR(priceInr)})`,
        description: `Direct WhatsApp Project Order inquiry for project: ${projectTitle}`,
        budget: `${formatINR(priceInr)}`,
        status: 'PENDING',
      });
    } catch (err) {
      console.warn('Could not record order inquiry to database:', err);
    }

    try {
      // Also cache in localStorage for customer history
      const existingRaw = localStorage.getItem('capstonia_purchased_orders') || localStorage.getItem('fastrack_purchased_orders');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newInquiry = {
        id: `wa_${Date.now()}`,
        orderId: `WA-${Date.now().toString().slice(-6)}`,
        projectId,
        projectTitle,
        amount: priceInr,
        createdAt: new Date().toISOString(),
        buyerEmail: email || phone,
        status: 'WHATSAPP_ORDER',
      };
      existing.unshift(newInquiry);
      localStorage.setItem('capstonia_purchased_orders', JSON.stringify(existing));
    } catch (_) {}

    setIsSubmitting(false);
    setShowModal(false);

    // Open WhatsApp
    handleDirectWhatsApp();
  };

  return (
    <>
      {/* Prominent Direct WhatsApp Order Button */}
      <div className="space-y-2">
        <button
          onClick={() => setShowModal(true)}
          className={`w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 text-sm active:scale-[0.99] border-2 border-[#1EBE5D] ${className}`}
        >
          {/* Universal WhatsApp Icon */}
          <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16.002 2C8.269 2 2 8.27 2 16.002c0 2.658.742 5.228 2.152 7.461L2.05 30.014l6.732-2.073A13.93 13.93 0 0 0 16.002 30C23.733 30 30 23.732 30 16.002 30 8.27 23.733 2 16.002 2zm7.644 19.832c-.32.898-1.59 1.656-2.586 1.871-.68.148-1.57.266-4.555-.973-3.816-1.586-6.28-5.46-6.473-5.715-.187-.258-1.547-2.062-1.547-3.934 0-1.871.977-2.793 1.328-3.176.352-.383.766-.48 1.023-.48.258 0 .512.004.738.016.242.012.566-.094.887.676.328.789 1.125 2.742 1.223 2.941.098.2.164.434.031.691-.133.258-.2.418-.398.652-.199.234-.418.523-.598.703-.2.2-.41.418-.176.82.234.398 1.043 1.723 2.234 2.785 1.535 1.367 2.832 1.793 3.23 1.992.398.2.633.168.867-.098.234-.266.996-1.16 1.262-1.559.266-.398.531-.332.898-.2.367.133 2.332 1.1 2.73 1.3.398.2.664.297.766.465.098.172.098.992-.223 1.89z" />
          </svg>
          <span>Order via WhatsApp — {formatINR(priceInr)}</span>
        </button>

        <p className="text-center text-[11px] text-[#000000]/70 font-bold">
          💬 Instant chat with technical team • Direct ZIP delivery via WhatsApp
        </p>
      </div>

      {/* Quick WhatsApp Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] border-2 border-[#D8CEBE] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#D8CEBE] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#25D366] text-white uppercase tracking-wider mb-1.5">
                  Direct WhatsApp Delivery
                </span>
                <h3 className="text-lg font-black text-[#000000]">Order Project Package</h3>
                <p className="text-xs text-[#000000]/80 font-medium">
                  {projectTitle} — <strong className="text-black">{formatINR(priceInr)}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#000000]/70 hover:text-[#000000] p-1.5 rounded-full hover:bg-[#ECE4DA] transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="student@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-[#000000] text-xs focus:outline-none focus:border-[#000000] font-bold"
                />
              </div>

              <div className="p-3 bg-[#ECE4DA] border border-[#D8CEBE] rounded-2xl space-y-1.5 text-[11px] text-[#000000] font-bold">
                <div className="flex items-center gap-1.5 text-[#25D366]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#25D366]" />
                  <span className="text-black font-extrabold">Instant WhatsApp Package:</span>
                </div>
                <div className="text-[11px] text-[#000000]/80 font-medium pl-5 space-y-0.5">
                  <div>• Complete Verified Source Code ZIP</div>
                  <div>• IEEE Standard Project Report & PPT</div>
                  <div>• Video Setup & Direct Support</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Send Order to WhatsApp ({DISPLAY_PHONE})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full py-2.5 bg-transparent hover:bg-[#ECE4DA] text-[#000000] font-extrabold rounded-full text-[11px] transition-colors"
                >
                  ⚡ Skip form & Open WhatsApp Directly
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
