'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { BranchInfo } from '@/lib/constants';
import { formatINR } from '@/lib/utils/currency';
import RazorpayButton from '@/components/checkout/razorpay-button';
import {
  FileText,
  FileCode,
  Presentation,
  CheckCircle2,
  XCircle,
  Zap,
  Play,
  Video,
  Layers,
  Sparkles,
  ShieldCheck,
  Star,
  Check,
  Headphones,
  Laptop,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Code2,
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  branchInfo?: BranchInfo;
}

export type PackageTierKey = 'BASIC' | 'STANDARD' | 'PREMIUM';

interface TierConfig {
  key: PackageTierKey;
  name: string;
  badge?: string;
  tagline: string;
  price: number;
  originalPrice: number;
  highlighted?: boolean;
  features: { title: string; included: boolean; note?: string }[];
}

export default function ProjectDetailView({
  project,
  branchInfo,
}: ProjectDetailViewProps) {
  // Compute Tier Prices dynamically
  const standardPrice = project.discounted_price_inr || project.price_inr;
  const standardOriginalPrice = Math.max(project.price_inr, Math.round(standardPrice * 1.5 / 50) * 50);

  const basicPrice = Math.max(499, Math.round((standardPrice * 0.62) / 50) * 50);
  const basicOriginalPrice = Math.round(basicPrice * 1.6 / 50) * 50;

  const premiumPrice = Math.round((standardPrice * 1.55) / 50) * 50;
  const premiumOriginalPrice = Math.round(premiumPrice * 1.5 / 50) * 50;

  const [selectedTier, setSelectedTier] = useState<PackageTierKey>('STANDARD');
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'screenshot'>('video');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
      return url;
    } catch {
      return 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
    }
  };

  const TIERS: Record<PackageTierKey, TierConfig> = {
    BASIC: {
      key: 'BASIC',
      name: 'Basic Package',
      tagline: 'Source Code Only — for students who prepare their own report',
      price: basicPrice,
      originalPrice: basicOriginalPrice,
      features: [
        { title: 'Complete Runnable Source Code ZIP', included: true, note: 'Frontend, backend, models & database' },
        { title: 'Local Setup & Execution Guide (README)', included: true, note: 'Step-by-step CLI commands' },
        { title: 'Environment Config & Requirements.txt', included: true, note: 'Exact library versions' },
        { title: 'Instant ZIP Download Link', included: true, note: 'Delivered immediately' },
        { title: 'IEEE Formatted Project Report (.docx & PDF)', included: false },
        { title: 'University Viva Presentation (.pptx)', included: false },
        { title: 'System Architecture Diagrams (DFD & UML)', included: false },
        { title: '1-on-1 Remote Installation Support', included: false },
      ],
    },
    STANDARD: {
      key: 'STANDARD',
      name: 'Standard Package',
      badge: 'MOST POPULAR • RECOMMENDED',
      tagline: 'Complete Ready-to-Submit Academic Deliverable Package',
      price: standardPrice,
      originalPrice: standardOriginalPrice,
      highlighted: true,
      features: [
        { title: 'Complete Runnable Source Code ZIP', included: true, note: 'Tested & verified runtime' },
        { title: 'Full IEEE Format Project Report (.docx & PDF)', included: true, note: '45-70 pages, editable Word' },
        { title: 'University Seminar & Viva Deck (.pptx)', included: true, note: '15-25 slides with speaker notes' },
        { title: 'Architecture, DFD Level 0/1/2 & UML Diagrams', included: true, note: 'High-res vector/PNG' },
        { title: 'Step-by-Step Execution Video Demo', included: true, note: 'Full recorded walkthrough' },
        { title: 'Viva Questions & Answers Reference Guide', included: true, note: '50+ examiner questions' },
        { title: 'Instant Re-download Access on Dashboard', included: true, note: 'Lifetime access' },
        { title: '1-on-1 Remote Installation Support', included: false },
      ],
    },
    PREMIUM: {
      key: 'PREMIUM',
      name: 'Premium VIP Package',
      badge: 'VIP MENTORSHIP • 100% PASS',
      tagline: 'Everything in Standard + 1-on-1 Live Installation & Defense Prep',
      price: premiumPrice,
      originalPrice: premiumOriginalPrice,
      features: [
        { title: 'Everything in Standard Package', included: true, note: 'Source code, IEEE report, PPT, diagrams' },
        { title: '1-on-1 Remote Setup Support via AnyDesk', included: true, note: 'Live setup by senior engineer' },
        { title: '100+ University Viva Q&A & Defense Guide', included: true, note: 'Covers edge cases & complexity' },
        { title: 'Minor Customization Support', included: true, note: 'Project title, college name, branding' },
        { title: 'Priority WhatsApp Developer Support', included: true, note: 'Direct line to technical lead' },
        { title: 'Guaranteed Runtime & Execution Assurance', included: true, note: '100% bug-free delivery' },
        { title: 'Complete Academic Reference License', included: true, note: 'Verified deliverables' },
      ],
    },
  };

  const currentTier = TIERS[selectedTier];
  const savingsAmount = currentTier.originalPrice - currentTier.price;
  const savingsPercent = Math.round((savingsAmount / currentTier.originalPrice) * 100);

  const WHATS_INCLUDED = [
    {
      icon: FileCode,
      title: 'Full Executable Source Code ZIP',
      badge: '.ZIP ARCHIVE',
      description: 'Complete project folder containing frontend, backend, trained ML/DL models, database schema scripts, and configuration files. Zero missing dependencies.',
      highlight: 'Tested on clean Python/Node environments',
    },
    {
      icon: FileText,
      title: 'IEEE Formatted Project Report',
      badge: '.DOCX & .PDF',
      description: '45 to 70 page editable Word document formatted according to standard IEEE university guidelines. Includes Abstract, Literature Survey, System Design, Algorithms, Testing & References.',
      highlight: '100% editable — add your name, college & roll number',
    },
    {
      icon: Presentation,
      title: 'Viva & Seminar Presentation Deck',
      badge: '.PPTX SLIDES',
      description: '15 to 25 polished PowerPoint slides containing architecture diagrams, methodology flowcharts, results comparison tables, and speaker presentation notes.',
      highlight: 'Structured for 10-15 minute examiner evaluation',
    },
    {
      icon: Layers,
      title: 'System Architecture & Data Flow Diagrams',
      badge: 'UML & DFD LEVEL 0/1/2',
      description: 'High-resolution system diagrams, Data Flow Diagrams (Level 0, 1, 2), Use Case diagrams, Sequence diagrams, and ER diagrams ready for inclusion in charts.',
      highlight: 'Supplied in high-res PNG & editable formats',
    },
    {
      icon: Video,
      title: 'Execution & Setup Video Walkthrough',
      badge: '1080P MP4',
      description: 'Recorded step-by-step video guide demonstrating local setup, prerequisite installations, terminal run commands, and live feature demonstration.',
      highlight: 'Guaranteed execution proof for reviewers',
    },
    {
      icon: HelpCircle,
      title: 'Comprehensive Viva Q&A Guide',
      badge: 'EXAMINER HANDBOOK',
      description: '50+ commonly asked external examiner questions with detailed technical answers explaining algorithm choices, time complexity, and system constraints.',
      highlight: 'Boosts your confidence during final viva defense',
    },
  ];

  const FAQS = [
    {
      q: 'How do I receive the project deliverables after payment?',
      a: 'Deliverables are delivered instantly! Once your payment is completed via Razorpay (UPI, GPay, PhonePe, Cards), your instant ZIP download link appears directly on your screen and in your Capstonia dashboard. A receipt with download links is also emailed to you.',
    },
    {
      q: 'Can I edit the IEEE report and viva PPT slides?',
      a: 'Yes, absolutely! The report is provided as an editable Microsoft Word (.docx) document alongside a PDF copy. You can easily insert your name, college logo, department details, guide name, and roll number before printing or submitting.',
    },
    {
      q: 'Will the project run on my laptop/computer?',
      a: 'Yes! Every project package is pre-tested on clean Windows, Mac, and Linux environments. Each package includes an explicit step-by-step README and video guide with exact terminal commands. If you select the Premium VIP tier, our technical lead can connect via AnyDesk/TeamViewer to configure and run it for you.',
    },
    {
      q: 'What is the difference between Basic, Standard, and Premium tiers?',
      a: 'The Basic package includes just the verified source code and setup instructions. The Standard package is our most popular all-in-one deliverable with source code + IEEE report + PPT slides + architecture diagrams. The Premium package includes everything plus 1-on-1 remote installation support via AnyDesk and 100+ viva defense prep materials.',
    },
    {
      q: 'Is payment secure?',
      a: '100% secure. All transactions are processed through Razorpay, India’s leading RBI-authorized PCI-DSS payment gateway. We support UPI (Google Pay, PhonePe, Paytm, BHIM), all Debit/Credit Cards, and Net Banking.',
    },
  ];

  return (
    <div className="space-y-12 pb-24 bg-[#ECE4DA] text-[#000000]">
      {/* Top Breadcrumb & Title Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#000000]/70 flex-wrap">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:underline">Projects</Link>
          <span>/</span>
          <Link href={`/branches/${project.branch}`} className="hover:underline text-[#000000] font-extrabold">
            {branchInfo?.name || project.branch}
          </Link>
          <span>/</span>
          <span className="text-[#000000] truncate max-w-xs sm:max-w-md font-bold">{project.title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#000000] text-[#FFFFFF] shadow-xs">
            {branchInfo?.fullName || project.branch}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FAF6F0] text-[#000000] border border-[#D8CEBE]">
            {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Final Year Project' : 'Mini Project'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E5DCCF] text-[#000000] border border-[#D8CEBE]">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
            100% Output Tested & Verified
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#000000]/80">
            <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
            4.9/5 Student Rating
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-[#000000]/85 max-w-3xl leading-relaxed font-medium">
          {project.short_description}
        </p>
      </div>

      {/* Main Grid: Left 2 Columns (Demo Video on Top, Checklist, Tiers, Overview), Right 1 Column (Sticky Buy Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-12">
          {/* ========================================================= */}
          {/* 1. DEMO VIDEO ON TOP (Centerpiece)                        */}
          {/* ========================================================= */}
          <div className="rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] overflow-hidden shadow-sm space-y-0">
            {/* Media Header & Tab Switcher */}
            <div className="p-4 sm:p-5 border-b border-[#D8CEBE] flex flex-wrap items-center justify-between gap-3 bg-[#F5EFE6]">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black text-[#000000] tracking-wide uppercase">
                  Live Project Output Verification
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center bg-[#ECE4DA] p-1 rounded-2xl border border-[#D8CEBE]">
                <button
                  onClick={() => {
                    setActiveMediaTab('video');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                      : 'text-[#000000]/80 hover:text-[#000000]'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Demo Video (1080p)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveMediaTab('screenshot');
                    setIsPlayingVideo(false);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeMediaTab === 'screenshot'
                      ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                      : 'text-[#000000]/80 hover:text-[#000000]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Architecture & UI</span>
                </button>
              </div>
            </div>

            {/* Video / Screenshot Viewer Canvas */}
            <div className="relative aspect-video w-full bg-[#000000] overflow-hidden">
              {activeMediaTab === 'video' ? (
                isPlayingVideo ? (
                  <iframe
                    src={getEmbedUrl(project.demo_video_url)}
                    title={`${project.title} Demo Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="relative w-full h-full group">
                    <Image
                      src={project.thumbnail_url}
                      alt={`${project.title} Preview Poster`}
                      fill
                      priority
                      sizes="(max-width: 1200px) 100vw, 66vw"
                      className="object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/30 to-[#000000]/40 flex flex-col justify-between p-6">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#000000]/80 text-[#FFFFFF] backdrop-blur-sm border border-white/20">
                          Execution Video Walkthrough
                        </span>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFFFFF]/90 text-[#000000] shadow-sm">
                          HD 1080p Recorded
                        </span>
                      </div>

                      {/* Big Play Button in center */}
                      <div className="self-center flex flex-col items-center gap-3">
                        <button
                          onClick={() => setIsPlayingVideo(true)}
                          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#FFFFFF] hover:bg-[#FAF6F0] text-[#000000] flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 active:scale-95"
                          aria-label="Play Demo Video"
                        >
                          <Play className="h-8 w-8 text-[#000000] fill-[#000000] ml-1" />
                        </button>
                        <span className="text-xs font-extrabold text-[#FFFFFF] drop-shadow-md bg-[#000000]/60 px-3 py-1 rounded-full backdrop-blur-xs">
                          Click to Play Verified Execution Demo
                        </span>
                      </div>

                      {/* Video Tags */}
                      <div className="flex items-center justify-between text-xs text-white/90 font-medium">
                        <span>Includes Code Walkthrough & Live Output</span>
                        <span>Full Run Guarantee</span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 66vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#000000]/80 backdrop-blur-md rounded-2xl border border-white/20 text-white text-xs font-bold flex items-center justify-between">
                    <span>High-Resolution System Blueprint & Architecture</span>
                    <span className="text-[10px] text-white/70">Included in package</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Footer Breakdown Banner */}
            <div className="p-4 sm:p-5 bg-[#FAF6F0] flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#000000]/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>Recorded directly from a working local environment</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-extrabold text-[#000000]">
                <span>⏱️ Runtime: ~6 Mins</span>
                <span>•</span>
                <span>🔊 Step-by-Step Audio Guidance</span>
                <span>•</span>
                <span>💻 Terminal Commands Shown</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. “WHAT’S INCLUDED” CHECKLIST                           */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8CEBE] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#000000]">
                  What&apos;s Included in This Package
                </h2>
                <p className="text-xs sm:text-sm text-[#000000]/80 font-medium mt-0.5">
                  Every academic deliverable required for university project approval & evaluation.
                </p>
              </div>
              <span className="inline-flex self-start sm:self-auto items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#000000] text-[#FFFFFF]">
                <ShieldCheck className="h-3.5 w-3.5" />
                6 Core Deliverables
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHATS_INCLUDED.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#ECE4DA] border border-[#D8CEBE] flex flex-col justify-between space-y-3 hover:border-[#000000]/40 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-xl bg-[#000000] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#FAF6F0] text-[#000000] px-2.5 py-1 rounded-full border border-[#D8CEBE]">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-[#000000] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#000000]/80 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#D8CEBE]/70 flex items-center gap-1.5 text-[11px] font-extrabold text-[#000000]">
                      <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                      <span>{item.highlight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. PACKAGE TIERS (Basic, Standard, Premium)               */}
          {/* ========================================================= */}
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#000000] text-[#FFFFFF] mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Choose Your Deliverable Package Tier
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#000000]">
                Flexible Package Options
              </h2>
              <p className="text-xs sm:text-sm text-[#000000]/80 font-medium">
                Select the package that fits your university submission and support requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(Object.keys(TIERS) as PackageTierKey[]).map((tierKey) => {
                const tier = TIERS[tierKey];
                const isSelected = selectedTier === tierKey;

                return (
                  <div
                    key={tier.key}
                    onClick={() => setSelectedTier(tier.key)}
                    className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border-2 ${
                      isSelected
                        ? 'bg-[#FAF6F0] border-[#000000] shadow-xl scale-[1.02]'
                        : 'bg-[#FAF6F0]/90 border-[#D8CEBE] hover:border-[#000000]/40 shadow-xs'
                    }`}
                  >
                    {/* Top Tier Badge */}
                    {tier.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#000000] text-[#FFFFFF] shadow-sm border border-[#D8CEBE]">
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Tier Radio Indicator & Name */}
                      <div className="flex items-start justify-between gap-2 pt-2">
                        <div>
                          <h3 className="text-lg font-black text-[#000000]">{tier.name}</h3>
                          <p className="text-[11px] text-[#000000]/75 font-medium leading-tight mt-0.5">
                            {tier.tagline}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#000000] bg-[#000000]'
                              : 'border-[#000000]/40'
                          }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-[#FFFFFF]" />}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="pt-2 border-t border-[#D8CEBE]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-[#000000]">
                            {formatINR(tier.price)}
                          </span>
                          <span className="text-xs text-[#000000]/50 line-through font-bold">
                            {formatINR(tier.originalPrice)}
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-1">
                          Save {Math.round(((tier.originalPrice - tier.price) / tier.originalPrice) * 100)}% Today
                        </span>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-2 pt-3 border-t border-[#D8CEBE] text-xs">
                        {tier.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className={`flex items-start gap-2 ${
                              feat.included ? 'text-[#000000]' : 'text-[#000000]/40'
                            }`}
                          >
                            {feat.included ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-[#000000]/30 shrink-0 mt-0.5" />
                            )}
                            <div className="leading-snug">
                              <span className={`font-bold ${feat.included ? '' : 'line-through'}`}>
                                {feat.title}
                              </span>
                              {feat.note && feat.included && (
                                <p className="text-[10px] text-[#000000]/70 font-medium">
                                  {feat.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Select Tier Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier(tier.key);
                      }}
                      className={`mt-6 w-full py-2.5 px-4 rounded-full text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-[#000000] text-[#FFFFFF] shadow-sm'
                          : 'bg-[#ECE4DA] hover:bg-[#E5DCCF] text-[#000000] border border-[#D8CEBE]'
                      }`}
                    >
                      {isSelected ? '✓ Selected Tier' : `Choose ${tier.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. PROJECT OVERVIEW & ABSTRACT                            */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-4 shadow-xs">
            <h2 className="text-xl font-black text-[#000000]">Project Overview & Abstract</h2>
            <p className="text-sm text-[#000000]/90 leading-relaxed whitespace-pre-line font-medium">
              {project.full_description}
            </p>
          </div>

          {/* Tech Stack Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-[#000000]" />
              <h2 className="text-xl font-black text-[#000000]">Technologies & Libraries Implemented</h2>
            </div>
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

          {/* Frequently Asked Questions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#000000]">Frequently Asked Questions</h2>
              <p className="text-xs text-[#000000]/80 font-medium mt-0.5">
                Got questions regarding deliverables or download access? Here are quick answers.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#D8CEBE] bg-[#ECE4DA] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-black text-sm text-[#000000]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#000000]/70" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs font-medium text-[#000000]/85 leading-relaxed border-t border-[#D8CEBE]/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: STICKY PURCHASE BOX (DESKTOP)               */}
        {/* ========================================================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 sm:p-8 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] space-y-6 shadow-md">
            {/* Active Tier Pill */}
            <div className="flex items-center justify-between border-b border-[#D8CEBE] pb-4">
              <div>
                <span className="text-[10px] font-black text-[#000000]/70 uppercase tracking-wider block">
                  Selected Package
                </span>
                <span className="text-sm font-black text-[#000000]">
                  {currentTier.name}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#000000] text-[#FFFFFF]">
                {currentTier.key} TIER
              </span>
            </div>

            {/* Price block */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#000000]">
                  {formatINR(currentTier.price)}
                </span>
                <span className="text-sm text-[#000000]/50 line-through font-bold">
                  {formatINR(currentTier.originalPrice)}
                </span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  -{savingsPercent}%
                </span>
              </div>
              <p className="text-xs text-[#000000]/70 font-medium mt-1">
                One-time payment • Instant ZIP download & lifetime access
              </p>
            </div>

            {/* STICKY BUY BUTTON */}
            <div className="space-y-3">
              <RazorpayButton
                projectId={project.id}
                projectTitle={project.title}
                priceInr={currentTier.price}
                packageTier={currentTier.name}
                buttonText={`Instant Download — ${formatINR(currentTier.price)}`}
                className="w-full !py-4 text-sm tracking-wide shadow-md hover:scale-[1.01] active:scale-98"
              />

              <div className="p-3 bg-[#ECE4DA] rounded-2xl border border-[#D8CEBE] text-center text-[11px] text-[#000000] font-bold flex items-center justify-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#000000]" />
                <span>Instant Razorpay UPI: GPay, PhonePe, Paytm, Cards</span>
              </div>
            </div>

            {/* Quick Checklist of Selected Tier */}
            <div className="space-y-2.5 pt-4 border-t border-[#D8CEBE] text-xs font-bold text-[#000000]">
              <div className="text-[11px] text-[#000000]/60 uppercase tracking-wider font-extrabold">
                {currentTier.name} Includes:
              </div>
              {currentTier.features.filter((f) => f.included).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span className="leading-snug">{feat.title}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#D8CEBE] space-y-2 text-[11px] text-[#000000]/80 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#000000] shrink-0" />
                <span>100% Tested Execution Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-[#000000] shrink-0" />
                <span>Immediate digital download after checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-[#000000] shrink-0" />
                <span>Full source code, editable docs, and slides</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. MOBILE & FLOATING STICKY BUY BAR (Bottom of screen)    */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#D8CEBE] shadow-2xl p-3.5 px-4 animate-in slide-in-from-bottom duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#000000] text-[#FFFFFF] px-2 py-0.5 rounded-full">
                {currentTier.key}
              </span>
              <span className="text-xs font-extrabold text-[#000000] truncate">
                {project.title}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-[#000000]">
                {formatINR(currentTier.price)}
              </span>
              <span className="text-[11px] text-[#000000]/50 line-through font-bold">
                {formatINR(currentTier.originalPrice)}
              </span>
            </div>
          </div>

          <div className="shrink-0 w-44 sm:w-52">
            <RazorpayButton
              projectId={project.id}
              projectTitle={project.title}
              priceInr={currentTier.price}
              packageTier={currentTier.name}
              buttonText={`Buy — ${formatINR(currentTier.price)}`}
              className="!py-3 !px-4 text-xs font-black shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
