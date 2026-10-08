import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Download, FileText, CheckCircle2 } from 'lucide-react';
import { BRANCHES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#FAF6F0] border-t border-[#D8CEBE] pt-16 pb-12 text-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deliverable Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#D8CEBE]">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE]">
            <Download className="h-7 w-7 text-[#000000] shrink-0" />
            <div>
              <h4 className="text-[#000000] text-xs font-extrabold uppercase tracking-wider">Instant Download</h4>
              <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">ZIP link delivered post-payment</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE]">
            <FileText className="h-7 w-7 text-[#000000] shrink-0" />
            <div>
              <h4 className="text-[#000000] text-xs font-extrabold uppercase tracking-wider">Complete Package</h4>
              <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">Code + Report PDF + PPT + Architecture Diagrams</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE]">
            <ShieldCheck className="h-7 w-7 text-[#000000] shrink-0" />
            <div>
              <h4 className="text-[#000000] text-xs font-extrabold uppercase tracking-wider">100% Tested & Verified</h4>
              <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">Guaranteed execution video demo</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE]">
            <div className="h-7 w-7 relative shrink-0">
              <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain rounded-lg" />
            </div>
            <div>
              <h4 className="text-[#000000] text-xs font-extrabold uppercase tracking-wider">Razorpay Secure UPI</h4>
              <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">GPay, PhonePe, Paytm, Cards</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#000000] p-1 flex items-center justify-center shrink-0 border border-[#D8CEBE]">
                <Image
                  src="/images/logo.jpg"
                  alt="fastrackprojects logo"
                  width={28}
                  height={28}
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-lg font-extrabold text-[#000000]">fastrackprojects</span>
            </div>
            <p className="text-xs text-[#000000]/90 leading-relaxed max-w-sm font-medium">
              India&apos;s premier engineering project store for B.Tech, B.E., and Diploma students. Complete tested deliverables with source code, IEEE reports, PPTs, and setup guides.
            </p>
            <div className="text-xs text-[#000000]/60 font-medium">
              © 2026 fastrackprojects. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-4">
              Branches
            </h4>
            <ul className="space-y-2.5 text-xs font-bold">
              {BRANCHES.map((b) => (
                <li key={b.id}>
                  <Link href={`/branches/${b.id}`} className="hover:opacity-70 transition-opacity">
                    {b.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-4">
              Package Includes
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> Source Code ZIP</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> IEEE Word (.docx)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> Report PDF</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> Viva PPT (.pptx)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> Video Demo</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#000000] uppercase tracking-wider mb-4">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-xs font-bold">
              <li><Link href="/projects" className="hover:opacity-70">All Projects Catalog</Link></li>
              <li><Link href="/dashboard" className="hover:opacity-70">Student Dashboard</Link></li>
              <li><Link href="/custom-request" className="hover:opacity-70">Custom Project Order</Link></li>
              <li><Link href="/terms" className="hover:opacity-70">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:opacity-70">Privacy Policy</Link></li>
              <li><Link href="/login" className="hover:opacity-70">Sign In / Register</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
