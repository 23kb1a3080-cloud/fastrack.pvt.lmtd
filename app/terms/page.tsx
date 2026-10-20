import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#000000] space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">Terms & Conditions</h1>
        <p className="text-xs text-[#000000]/70 mt-1 font-bold">Last Updated: October 2026</p>
      </div>

      <div className="bg-[#FAF6F0] p-8 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-6 text-xs sm:text-sm font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">1. Introduction</h2>
          <p className="text-[#000000]/80">
            Welcome to <strong>Capstonia</strong>. By accessing our platform and purchasing engineering project deliverables, source code packages, documentation, or custom orders, you agree to comply with and be bound by the following terms and conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">2. Product Usage & License</h2>
          <p className="text-[#000000]/80">
            All project deliverables provided on Capstonia—including source code, IEEE reports (.docx/PDF), viva presentation slides (.pptx), and execution video demos—are licensed strictly for personal educational and academic reference purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">3. WhatsApp Ordering & Digital Deliverables</h2>
          <p className="text-[#000000]/80">
            Orders and custom requirements are coordinated and delivered directly via WhatsApp (+91 73823 24346) for fast student communication, immediate file transfers, and continuous technical support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">4. Refund & Technical Support Policy</h2>
          <p className="text-[#000000]/80">
            Due to the downloadable digital nature of engineering source code packages, refunds are only issued if a package is proven non-executable and our support team cannot resolve the runtime issue within 48 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">5. Contact & Support</h2>
          <p className="text-[#000000]/80">
            For support inquiries or custom requests, please visit our <Link href="/custom-request" className="font-extrabold text-[#000000] underline">Custom Order Request Page</Link> or contact our support team.
          </p>
        </section>
      </div>
    </div>
  );
}
