export const instant = false;

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BRANCHES, DEMO_PROJECTS } from '@/lib/constants';
import { normalizeProject } from '@/lib/utils/project';
import RazorpayButton from '@/components/checkout/razorpay-button';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  FileText,
  FileCode,
  Presentation,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const { data: projects, error } = await supabase.from('projects').select('slug');
    if (!error && projects && projects.length > 0) {
      return projects.map((project) => ({
        slug: project.slug,
      }));
    }
  } catch (error) {
    console.warn('generateStaticParams error:', error);
  }

  // Ensure generateStaticParams always returns at least one item (required by Next.js Cache Components)
  return DEMO_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let rawProject = null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
    rawProject = data;
  } catch (err) {
    console.warn('Failed to fetch project from database:', err);
  }

  if (!rawProject) {
    const demo = DEMO_PROJECTS.find((p) => p.slug === slug);
    if (demo) {
      rawProject = demo;
    } else {
      notFound();
    }
  }

  const project = normalizeProject(rawProject);
  const branchInfo = BRANCHES.find((b) => b.id === project.branch);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#ECE4DA] text-[#000000]">
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
              {(project.tech_stack || []).map((tech) => (
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

        {/* Right Column: Sticky Deliverable & Order Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] space-y-6 shadow-md border border-[#D8CEBE]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-[#000000]/80 uppercase tracking-wider block">
                  Complete Deliverables Package
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
              <h3 className="text-xl font-black text-[#000000] mt-2">
                Source Code, IEEE Report & PPT
              </h3>
              <span className="text-xs text-[#000000]/70 font-bold block mt-1">
                Direct WhatsApp Order • Instant Deliverables & Support
              </span>
            </div>

            {/* Direct WhatsApp Purchase / Order Button */}
            <RazorpayButton
              projectId={project.id}
              projectTitle={project.title}
            />

            {/* Deliverables checklist */}
            <div className="space-y-2.5 pt-4 border-t border-[#D8CEBE] text-xs text-[#000000] font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>Verified Source Code (ZIP)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>Formatted IEEE Project Report (.docx/PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>Seminar PPT Presentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>Execution Video & Setup Guide</span>
              </div>
            </div>

            <div className="p-3 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/30 text-center text-[11px] text-[#000000] font-bold flex items-center justify-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366] fill-[#25D366]" />
              <span>Direct WhatsApp Delivery • Instant Chat at +91 73823 24346</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
