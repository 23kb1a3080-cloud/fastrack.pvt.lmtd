export const instant = false;

import Link from 'next/link';
import Image from 'next/image';
import { BRANCHES, DEMO_PROJECTS } from '@/lib/constants';
import BranchCard from '@/components/catalog/branch-card';
import BranchNav from '@/components/catalog/branch-nav';
import ProjectCard from '@/components/catalog/project-card';
import { normalizeProjects } from '@/lib/utils/project';
import { ArrowRight, Download, Star, Award, Video, FileText, Search, ShieldCheck, Sparkles, Flame, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  let allPublished: any[] = [];
  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true);
    if (data && data.length > 0) {
      allPublished = normalizeProjects(data);
    } else {
      allPublished = normalizeProjects(DEMO_PROJECTS);
    }
  } catch (error) {
    console.warn('Failed to load projects:', error);
    allPublished = normalizeProjects(DEMO_PROJECTS);
  }

  const featuredProjects = allPublished.filter((p) => p.is_featured);
  const spotlightProjects = featuredProjects.length > 0 ? featuredProjects : allPublished;

  return (
    <div className="space-y-20 pb-24 bg-[#ECE4DA] text-[#000000]">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-16 bg-[#F5EFE6] border-b border-[#D8CEBE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Highlight Trust Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400/20 border-2 border-amber-500 text-[#000000] text-xs font-black mb-6 shadow-sm hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-amber-700 fill-amber-500" />
            <span>Verified B.Tech / B.E. Projects • <strong className="text-black font-black underline decoration-amber-500">100% Tested & Complete</strong></span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#000000] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Ready-to-Submit Final Year & Mini{' '}
            <span className="underline decoration-amber-500/80">
              Engineering Projects
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[#000000]/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Complete tested packages for <strong className="text-[#000000]">CSE, IT, AI&DS, AIML, & CSE (Data Science)</strong>. Includes source code ZIP, IEEE formatted report (Word & PDF), PPT deck, & setup video guide.
          </p>

          {/* Centered Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form action="/projects" method="GET" className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#000000]/60 pointer-events-none" />
              <input
                type="text"
                name="search"
                placeholder="Search by topic, branch (CSE, IT...), or technology (Python, React...)"
                className="w-full pl-12 pr-36 py-4.5 rounded-full bg-[#FAF6F0] border border-[#D8CEBE] text-[#000000] placeholder-[#000000]/50 text-sm font-bold shadow-xs focus:outline-none focus:border-[#000000]"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-3 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Quick Search Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#000000]/80">
            <Link
              href="/projects"
              className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-black border-2 border-amber-600 flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105"
            >
              <Flame className="h-3.5 w-3.5 fill-black text-black" />
              <span>Popular Projects</span>
            </Link>
            <span className="text-[#000000]/40">|</span>
            <Link href="/branches/CSE" className="hover:underline">CSE Web Apps</Link>
            <span>•</span>
            <Link href="/branches/AIML" className="hover:underline">AI & ML Models</Link>
            <span>•</span>
            <Link href="/branches/AI_DS" className="hover:underline">Generative AI RAG</Link>
            <span>•</span>
            <Link href="/branches/IT" className="hover:underline">IT Portals</Link>
          </div>

          {/* Warm Studio Photography Banner (Squarespace Style) */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#D8CEBE] bg-[#FAF6F0] shadow-md p-3">
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden">
              <Image
                src="/images/hero_engineering_lab.jpg"
                alt="Engineering Laboratory & AI Development Workstation"
                fill
                priority
                className="object-cover hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent flex items-end p-6 sm:p-8 text-left">
                <div className="text-[#FFFFFF]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0]/20 backdrop-blur-md text-[#FFFFFF] text-xs font-bold mb-2 border border-white/20">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    100% Tested Engineering Workstation Deliverables
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold">Lab-Verified Code, Reports & Circuit Hardware</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Navigation Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#000000]">
                Browse Store by Department
              </h2>
              <p className="text-xs text-[#000000]/80 font-medium">Filter project deliverables explicitly designed for your specialization</p>
            </div>
            <Link href="/projects" className="text-xs font-bold text-[#000000] hover:underline">
              View All Projects →
            </Link>
          </div>
          <BranchNav activeBranch="ALL" />
        </div>
      </section>

      {/* Department Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-[#000000]">Engineering Departments</h2>
          <p className="text-sm text-[#000000]/80 mt-2 font-medium">Find complete verified project packages for your course</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANCHES.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </section>

      {/* Featured Projects Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-50/80 via-[#FAF6F0] to-amber-100/40 border-2 border-amber-500/80 shadow-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black mb-2 shadow-xs border border-amber-600/30">
                <Flame className="h-3.5 w-3.5 fill-black text-black" />
                <span>FEATURED DELIVERABLES • READY FOR VIVA</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000]">
                Highlighted Engineering Projects
              </h2>
              <p className="text-sm text-[#000000]/80 mt-1 font-medium max-w-2xl">
                Ready-to-run projects designed for immediate semester viva submission. Includes complete tested source code ZIP, IEEE formatted report, and ready PPT presentation slides.
              </p>
            </div>
            <Link
              href="/projects"
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-black text-xs font-black transition-all flex items-center gap-2 shadow-sm shrink-0"
            >
              <span>View All Projects ({allPublished.length})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlightProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Store Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#000000]/70 uppercase tracking-wider block mb-1">
              Top Rated Deliverables
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000]">
              Featured Engineering Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="mt-4 md:mt-0 px-6 py-3 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            Explore Complete Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featuredProjects || []).length > 0 ? (
            featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-[#FAF6F0] rounded-3xl border border-[#D8CEBE]">
              <p className="text-sm font-bold text-[#000000]">No featured projects found.</p>
              <Link
                href="/projects"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#000000] text-white text-xs font-bold"
              >
                Browse Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Complete Package Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-bold text-[#000000]/70 uppercase tracking-wider block mb-2">
              Deliverable Guarantee
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#000000] leading-tight mb-6">
              Complete University Viva Submission Package
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#000000] text-sm">
              <div className="p-5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#000000] flex items-center justify-center text-[#FFFFFF] shrink-0">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#000000] text-base">Tested Source Code (ZIP)</h4>
                  <p className="text-xs text-[#000000]/80 mt-1 font-medium">Clean, fully commented code with step-by-step execution scripts.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#000000] flex items-center justify-center text-[#FFFFFF] shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#000000] text-base">IEEE Project Report (.docx & PDF)</h4>
                  <p className="text-xs text-[#000000]/80 mt-1 font-medium">40-60 page formatted report with abstract, data flow, & literature survey.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#000000] flex items-center justify-center text-[#FFFFFF] shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#000000] text-base">Seminar PPT Presentation</h4>
                  <p className="text-xs text-[#000000]/80 mt-1 font-medium">Ready 15-20 slide presentation deck structured for external viva examiners.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#000000] flex items-center justify-center text-[#FFFFFF] shrink-0">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#000000] text-base">Execution Video & Setup Guide</h4>
                  <p className="text-xs text-[#000000]/80 mt-1 font-medium">Step-by-step video walkthrough + environment setup guide for all projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
