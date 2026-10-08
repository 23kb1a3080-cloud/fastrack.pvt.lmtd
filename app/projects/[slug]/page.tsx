export const instant = false;

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BRANCHES } from '@/lib/constants';
import { formatINR } from '@/lib/utils/currency';
import RazorpayButton from '@/components/checkout/razorpay-button';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  FileText,
  FileCode,
  Presentation,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data: projects } = await supabase.from('projects').select('slug');
  return projects?.map((project) => ({
    slug: project.slug,
  })) || [];
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();

  if (!project) {
    notFound();
  }

  const branchInfo = BRANCHES.find((b) => b.id === project.branch);
  const displayPrice = project.discounted_price_inr || project.price_inr;
  const hasDiscount =
    project.discounted_price_inr && project.discounted_price_inr < project.price_inr;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#ECE4DA] text-[#000000]">
      {/* Header Breadcrumb & Title */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#000000]/70">
          <span>Projects</span>
          <span>/</span>
          <span className="text-[#000000] font-extrabold">{branchInfo?.name}</span>
          <span>/</span>
          <span className="text-[#000000] truncate max-w-md">{project.title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#000000] text-[#FFFFFF] shadow-xs">
            {branchInfo?.fullName}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FAF6F0] text-[#000000] border border-[#D8CEBE]">
            {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Final Year Project' : 'Mini Project'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#000000] leading-tight">
          {project.title}
        </h1>
      </div>

      {/* Main Grid: Left Column (Preview & Details), Right Column (Sticky Purchase Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Media Preview Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-[#D8CEBE] bg-[#ECE4DA] shadow-xs">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(max-width: 1200px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-4 shadow-xs">
            <h2 className="text-xl font-black text-[#000000]">Project Overview & Abstract</h2>
            <p className="text-sm text-[#000000]/90 leading-relaxed whitespace-pre-line font-medium">
              {project.full_description}
            </p>
          </div>

          {/* Tech Stack Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-4 shadow-xs">
            <h2 className="text-xl font-black text-[#000000]">Technologies & Tools Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full bg-[#ECE4DA] border border-[#D8CEBE] text-xs font-extrabold text-[#000000]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-4 shadow-xs">
            <h2 className="text-xl font-black text-[#000000]">Deliverable Package File Contents</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3.5 p-4 bg-[#ECE4DA] rounded-2xl border border-[#D8CEBE]">
                <FileCode className="h-5 w-5 text-[#000000] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-[#000000]">Source Code ZIP Archive</h4>
                  <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">Complete executable project folder with all scripts & configuration.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-[#ECE4DA] rounded-2xl border border-[#D8CEBE]">
                <FileText className="h-5 w-5 text-[#000000] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-[#000000]">IEEE Project Report (.docx & PDF)</h4>
                  <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">Includes Abstract, Literature Survey, System Design, Data Flow, Test Cases, and References.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-[#ECE4DA] rounded-2xl border border-[#D8CEBE]">
                <Presentation className="h-5 w-5 text-[#000000] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-[#000000]">PPT Presentation Deck (.pptx)</h4>
                  <p className="text-xs text-[#000000]/80 mt-0.5 font-medium">Ready 15-20 slide presentation deck formatted for university viva evaluation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Payment Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-6 shadow-md">
            <div>
              <span className="text-xs font-black text-[#000000]/80 uppercase tracking-wider block">
                Instant Download Deliverable
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-[#000000]">
                  {formatINR(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#000000]/50 line-through font-bold">
                    {formatINR(project.price_inr)}
                  </span>
                )}
              </div>
              <span className="text-xs text-[#000000]/70 font-bold block mt-1">
                One-time purchase • Unlimited access & re-downloads
              </span>
            </div>

            {/* Black Razorpay Purchase Button */}
            <RazorpayButton
              projectId={project.id}
              projectTitle={project.title}
              priceInr={displayPrice}
            />

            {/* Deliverables checklist */}
            <div className="space-y-2.5 pt-4 border-t border-[#D8CEBE] text-xs text-[#000000] font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#000000]" />
                <span>Verified Source Code (ZIP)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#000000]" />
                <span>Formatted IEEE Project Report</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#000000]" />
                <span>Seminar PPT Presentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#000000]" />
                <span>Execution Video & Setup Guide</span>
              </div>
            </div>

            <div className="p-3 bg-[#ECE4DA] rounded-2xl border border-[#D8CEBE] text-center text-[11px] text-[#000000] font-bold flex items-center justify-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#000000]" />
              <span>Razorpay Payments: GPay, PhonePe, Paytm, Cards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
