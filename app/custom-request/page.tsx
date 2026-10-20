'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANCHES } from '@/lib/constants';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Code2,
  MessageCircle,
  ArrowRight,
  Lock,
  LogIn,
  UserPlus,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const WHATSAPP_PHONE = '917382324346';
const DISPLAY_PHONE = '+91 73823 24346';

export default function CustomRequestPage() {
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; role?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    branch: 'CSE',
    category: 'MAJOR_FINAL_YEAR',
    projectTitle: '',
    techStack: '',
    description: '',
    deadline: '',
    budget: '',
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('capstonia_user') || localStorage.getItem('fastrack_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setFormData((prev) => ({
            ...prev,
            studentName: prev.studentName || parsed.name || '',
            email: prev.email || parsed.email || '',
            phone: prev.phone || parsed.phone || '',
          }));
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

  const generateWhatsAppMessage = () => {
    return (
      `Hi Capstonia Projects! 👋\n` +
      `I would like to place a Custom Engineering Project Order:\n\n` +
      `👤 Student Name: ${formData.studentName.trim() || user?.name || 'Engineering Student'}\n` +
      `📱 WhatsApp: ${formData.phone.trim() || user?.phone || 'My WhatsApp Number'}\n` +
      `✉️ Verified Account Email: ${formData.email.trim() || user?.email || 'N/A'}\n` +
      `🎓 Branch: ${formData.branch}\n` +
      `📁 Category: ${formData.category === 'MAJOR_FINAL_YEAR' ? 'Major Final Year Project' : 'Mini Project'}\n` +
      `💡 Project Topic / Title: ${formData.projectTitle.trim()}\n` +
      (formData.techStack.trim() ? `💻 Tech Stack: ${formData.techStack.trim()}\n` : '') +
      (formData.deadline ? `📅 Target Deadline: ${formData.deadline}\n` : '') +
      (formData.budget.trim() ? `💰 Estimated Budget: ${formData.budget.trim()}\n` : '') +
      (formData.description.trim() ? `📝 Project Details / Specifications:\n${formData.description.trim()}\n` : '') +
      `\nPlease review my custom project requirements and share pricing, feasibility & IEEE deliverable details.`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce mandatory authentication for placing custom orders
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const message = generateWhatsAppMessage();
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    setWhatsappLink(waUrl);

    try {
      const supabase = createClient();
      await supabase.from('custom_requests').insert({
        student_name: formData.studentName || user.name,
        email: formData.email || user.email,
        phone: formData.phone || user.phone || 'WhatsApp Direct',
        branch: formData.branch,
        category: formData.category,
        project_title: formData.projectTitle,
        tech_stack: formData.techStack || null,
        description: formData.description ? `(User: ${user.email}) ${formData.description}` : `(User: ${user.email})`,
        deadline: formData.deadline || null,
        budget: formData.budget || null,
        status: 'PENDING',
      });
    } catch (err: unknown) {
      console.warn('Database save warning (proceeding to WhatsApp):', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#000000]">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#25D366] text-white shadow-xs">
          <MessageCircle className="h-3.5 w-3.5 fill-white" />
          Direct WhatsApp Ordering & Solutions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#000000]">
          Request a Custom Project
        </h1>
        <p className="text-sm text-[#000000]/80 max-w-xl mx-auto font-medium leading-relaxed">
          Need a unique topic, specific IEEE paper implementation, or custom tech stack? Fill out your details below and we will directly connect with you on WhatsApp ({DISPLAY_PHONE}) with complete pricing & package options.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#FAF6F0] p-8 sm:p-12 rounded-3xl border-2 border-[#D8CEBE] text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#000000]">Custom Request Ready!</h2>
          <p className="text-sm text-[#000000]/80 max-w-md mx-auto font-medium leading-relaxed">
            Thank you, <span className="font-extrabold">{formData.studentName || user?.name}</span>. Your requirements for{' '}
            <strong className="text-black">&quot;{formData.projectTitle}&quot;</strong> have been prepared. We are redirecting you to WhatsApp to discuss code, IEEE report format, and delivery with our mentors.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappLink || `https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              <span>Chat on WhatsApp Now ({DISPLAY_PHONE})</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  studentName: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  branch: 'CSE',
                  category: 'MAJOR_FINAL_YEAR',
                  projectTitle: '',
                  techStack: '',
                  description: '',
                  deadline: '',
                  budget: '',
                });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#ECE4DA] hover:bg-[#D8CEBE] text-[#000000] font-extrabold text-xs transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Mandatory Sign In Warning Banner for Guest Visitors */}
            {!user ? (
              <div className="p-4 rounded-3xl bg-amber-100/90 border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <Lock className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider block text-amber-900">
                      Sign In Required to Order
                    </span>
                    <p className="text-xs font-medium text-amber-950/90 mt-0.5">
                      Please sign in or register to submit custom project orders.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    href="/login?redirect=/custom-request&reason=order"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#000000] text-white text-xs font-black text-center shadow-xs hover:bg-[#1a1a1a]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?mode=signup&redirect=/custom-request&reason=order"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-black text-center shadow-xs hover:bg-[#1EBE5D]"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl flex items-center justify-between text-xs text-[#000000] font-bold">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#25D366]" />
                  <span>
                    Authenticated Student: <strong>{user.name}</strong> ({user.email})
                  </span>
                </div>
                <span className="text-[10px] bg-[#25D366] text-white px-2 py-0.5 rounded-full font-black">
                  Ready to Order
                </span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@college.edu.in"
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Engineering Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.fullName} ({b.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Project Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  >
                    <option value="MAJOR_FINAL_YEAR">Major Final Year Project</option>
                    <option value="MINI_PROJECT">Mini Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Target Tech Stack
                  </label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="e.g. Python, React, PyTorch, MongoDB"
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  Project Title / Topic *
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  placeholder="e.g. Deep Learning Based Plant Disease Detection"
                  className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                  Detailed Specifications & IEEE Reference (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your required features, specific dataset, IEEE base paper details, or custom module requirements..."
                  className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Required Submission Date
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-1">
                    Approximate Budget (₹)
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. Starting from ₹3,000"
                    className="w-full px-3.5 py-2.5 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>
                  {isSubmitting
                    ? 'Opening WhatsApp...'
                    : user
                    ? `Submit & Chat on WhatsApp (${DISPLAY_PHONE})`
                    : `Sign In & Submit Order (${DISPLAY_PHONE})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Guarantee Highlights */}
          <div className="space-y-4">
            <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#000000]" />
                What We Guarantee
              </h3>

              <ul className="space-y-3 text-xs text-[#000000]/90 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span>
                    <strong>100% Executable Code:</strong> Fully debugged & tested on latest runtimes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span>
                    <strong>Complete IEEE Deliverables:</strong> Word report format + viva PPT slides.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span>
                    <strong>Video Installation Guide:</strong> Step-by-step setup video for local execution.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span>
                    <strong>Fast Turnaround:</strong> Delivery within 24-48 hours depending on scope.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[#ECE4DA] p-6 rounded-3xl border border-[#D8CEBE] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#000000]">
                <Clock className="h-4 w-4 text-[#000000]" />
                <span>Response Time</span>
              </div>
              <p className="text-xs text-[#000000]/80 font-medium leading-relaxed">
                Direct WhatsApp response within 15 minutes during active hours (9 AM - 10 PM IST).
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#D8CEBE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#000000]">
                <Code2 className="h-4 w-4 text-[#000000]" />
                <span>Supported Technologies</span>
              </div>
              <p className="text-xs text-[#000000]/80 font-medium leading-relaxed">
                Python, Django, FastAPI, React, Next.js, Node.js, PyTorch, OpenCV, TensorFlow, Scikit-learn, SQL, MongoDB, NLP, & LLM RAG pipelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Sign In Modal for Custom Orders */}
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
              <h3 className="text-xl font-black text-[#000000]">Sign In to Submit Custom Order</h3>
              <p className="text-xs text-[#000000]/80 font-medium mt-2 leading-relaxed">
                Please sign in or create an account to submit your custom project request. Having an account ensures your order is verified and our engineering mentors can track your custom deliverables.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/login?redirect=/custom-request&reason=order"
                className="w-full py-3.5 bg-[#000000] hover:bg-[#1a1a1a] text-white font-black rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In with Existing Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/login?mode=signup&redirect=/custom-request&reason=order"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create New Student Account (Sign Up)</span>
              </Link>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2 text-xs font-bold text-[#000000]/60 hover:text-[#000000] transition-colors"
              >
                Cancel and return to form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
