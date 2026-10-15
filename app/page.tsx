import Link from 'next/link';
import Image from 'next/image';
import { BRANCHES, DEMO_PROJECTS } from '@/lib/constants';
import BranchCard from '@/components/catalog/branch-card';
import BranchNav from '@/components/catalog/branch-nav';
import ProjectCard from '@/components/catalog/project-card';
import {
  ArrowRight,
  Download,
  Star,
  Award,
  BookOpen,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const featuredProjects = DEMO_PROJECTS.filter((p) => p.is_featured);
  // Pick the top 3 featured projects for the hero row
  const heroProjects = featuredProjects.slice(0, 3);

  return (
    <div className="space-y-20 pb-24 bg-[#ECE4DA] text-[#000000]">
      {/* ======================================================== */}
      {/* HERO SECTION                                             */}
      {/* Left: Circuit Chip Photo | Center: Headline, CTAs, 3 Cards */}
      {/* Right: Laptop with Code & Neural Network Nodes Photo     */}
      {/* ======================================================== */}
      <section className="relative pt-12 sm:pt-16 pb-16 bg-[#F5EFE6] border-b border-[#D8CEBE] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Header: Headline, Trust Badge, Subtitle & 2 CTA Buttons */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ECE4DA] border border-[#D8CEBE] text-[#000000] text-xs font-bold shadow-2xs">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Verified B.Tech / B.E. Engineering Projects Store</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#000000] tracking-tight leading-[1.1]">
              Ready-to-Submit Final Year & Mini{' '}
              <span className="underline decoration-[#000000]/30">
                Engineering Projects
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#000000]/85 max-w-2xl mx-auto leading-relaxed font-medium">
              Complete tested packages for <strong className="text-[#000000]">CSE, IT, AI&DS, AIML, & CSE (Data Science)</strong>. Includes verified source code ZIP, IEEE formatted report (Word & PDF), viva PPT presentation deck, & step-by-step setup documentation guide.
            </p>

            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {/* CTA 1: Primary Action */}
              <Link
                href="/projects"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF] text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2.5 shadow-md hover:scale-102 active:scale-98 group"
              >
                <span>Explore All Projects</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* CTA 2: Secondary Action */}
              <Link
                href="/custom-request"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF6F0] hover:bg-[#ECE4DA] text-[#000000] text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border border-[#D8CEBE] shadow-xs hover:border-[#000000]/40"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Custom Project Request</span>
              </Link>
            </div>

            {/* Quick Feature Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-[#000000]/80 pt-2">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-600" /> Instant ZIP Download
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#000000]" /> IEEE Formatted Word & PDF
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#000000]" /> Viva Presentation Deck
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#000000]" /> Setup Documentation Guide
              </span>
            </div>
          </div>

          {/* Hero Visual Showcase: Real Engineering Lab Collaboration Photography */}
          <div className="mt-10 relative rounded-3xl overflow-hidden border border-[#D8CEBE] shadow-md bg-[#FAF6F0]">
            <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full">
              <Image
                src="/images/hero_engineering_lab.jpg"
                alt="Engineering students actively collaborating on final year capstone project with laptops, code, and hardware prototypes in university innovation lab"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/85 via-[#000000]/25 to-transparent flex flex-col justify-end p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0]/20 backdrop-blur-md text-[#FFFFFF] text-xs font-bold border border-white/20">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      Academic Capstone Innovation Lab
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow-sm">
                      Tested & Evaluated by Senior Technical Evaluators
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 font-medium max-w-xl">
                      Over 4,800+ engineering graduates across India have successfully submitted their projects using Capstonia deliverables.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="px-4 py-2 rounded-2xl bg-[#000000]/70 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-base sm:text-lg font-black text-amber-400">4.9 / 5.0</div>
                      <div className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Student Rating</div>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-[#000000]/70 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-base sm:text-lg font-black text-white">100%</div>
                      <div className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Pass Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ROW OF THREE PROJECT CARDS IN THE CENTER                 */}
          {/* ======================================================== */}
          <div className="mt-14 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#000000]">
                  Featured Deliverable Packages • Ready for Download
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-xs font-bold text-[#000000] hover:underline flex items-center gap-1"
              >
                <span>View all {DEMO_PROJECTS.length} projects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heroProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
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

      {/* Trending Store Products (Full Catalog Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#000000]/70 uppercase tracking-wider block mb-1">
              Top Rated Deliverables
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000]">
              All Verified Engineering Projects
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
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
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
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#000000] text-base">Setup Manual & Run Instructions</h4>
                  <p className="text-xs text-[#000000]/80 mt-1 font-medium">Comprehensive setup manual + terminal run commands for local execution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
