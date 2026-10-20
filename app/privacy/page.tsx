import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#000000] space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">Privacy Policy</h1>
        <p className="text-xs text-[#000000]/70 mt-1 font-bold">Last Updated: October 2026</p>
      </div>

      <div className="bg-[#FAF6F0] p-8 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-6 text-xs sm:text-sm font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">1. Information We Collect</h2>
          <p className="text-[#000000]/80">
            When you purchase a project or submit a custom project request on Capstonia, we collect minimal necessary information including your name, email address, phone number (for WhatsApp updates), and project specifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">2. Order & Direct WhatsApp Communication</h2>
          <p className="text-[#000000]/80">
            All order confirmations, delivery links, and technical mentoring are communicated directly via WhatsApp (+91 73823 24346) and email.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">3. How Information is Used</h2>
          <p className="text-[#000000]/80">
            Collected data is strictly used for fulfilling digital downloads, delivering order receipts, providing customer support, and sending custom project updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">4. Data Protection & Sharing</h2>
          <p className="text-[#000000]/80">
            Capstonia does not sell, trade, or rent user personal data to any third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-[#000000]">5. Questions & Support</h2>
          <p className="text-[#000000]/80">
            If you have questions regarding our privacy practices, please contact us via our <Link href="/custom-request" className="font-extrabold text-[#000000] underline">Custom Order Request Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
