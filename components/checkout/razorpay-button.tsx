'use client';

import { useState } from 'react';
import Script from 'next/script';
import { formatINR } from '@/lib/utils/currency';
import { ShieldCheck, Lock, Sparkles, Loader2, X } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);

  const initiatePayment = async () => {
    if (!email || !phone) {
      alert('Please enter your email and phone number for delivery receipt.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          buyerEmail: email,
          buyerPhone: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.orderId) {
        throw new Error(data.error || 'Could not initialize order');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'fastrackprojects',
        description: `Purchase: ${projectTitle.slice(0, 30)}...`,
        order_id: data.orderId,
        prefill: {
          email: email,
          contact: phone,
        },
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              projectId,
              buyerEmail: email,
              buyerPhone: phone,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            window.location.href = `/dashboard?payment=success&orderId=${response.razorpay_order_id}`;
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: {
          color: '#000000',
        },
      };

      const razorpayWindow = new (window as any).Razorpay(options);
      razorpayWindow.open();
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Black Button (#000000) with Off-White/White Text (#FFFFFF) */}
      <button
        onClick={() => setShowModal(true)}
        className={`w-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold py-4 px-6 rounded-full shadow-xs transition-all flex items-center justify-center gap-2 text-sm ${className}`}
      >
        <Lock className="h-4 w-4" />
        Buy Project Package — {formatINR(priceInr)}
      </button>

      {/* Contact Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] border border-[#D8CEBE] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8CEBE] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#000000]">Student Contact Details</h3>
                <p className="text-xs text-[#000000]/80 font-medium">Where should we send your receipt & instant download link?</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#000000]/70 hover:text-[#000000] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">
                  Email Address (for instant download receipt)
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-[#000000] text-sm focus:outline-none focus:border-[#000000] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">
                  WhatsApp / Phone Number (for setup support)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-[#000000] text-sm focus:outline-none focus:border-[#000000] font-bold"
                />
              </div>

              <div className="p-3 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl flex items-center gap-2 text-xs text-[#000000] font-bold">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#000000]" />
                <span>Protected by 256-Bit SSL & Razorpay Payment Security</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-[#ECE4DA] text-[#000000] font-bold rounded-full text-xs hover:bg-[#D8CEBE]"
              >
                Cancel
              </button>
              <button
                onClick={initiatePayment}
                disabled={loading}
                className="flex-1 py-3 bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-extrabold rounded-full text-xs shadow-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Pay {formatINR(priceInr)}
                    <Sparkles className="h-4 w-4 text-[#FFFFFF]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
