'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { BRANCHES } from '@/lib/constants';
import { formatINR } from '@/lib/utils/currency';
import { isStartingTier } from '@/lib/utils/project';
import { ArrowRight, CheckCircle2, Sparkles, Flame } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const branchInfo = BRANCHES.find((b) => b.id === project.branch);
  const displayPrice = project.discounted_price_inr || project.price_inr;
  const hasDiscount = project.discounted_price_inr && project.discounted_price_inr < project.price_inr;
  const discountPercent = hasDiscount
    ? Math.round(((project.price_inr - project.discounted_price_inr!) / project.price_inr) * 100)
    : 0;
  const isStarting3000 = displayPrice === 3000 || isStartingTier(project);

  return (
    <div
      className={`group bg-[#FAF6F0] rounded-2xl transition-all duration-300 flex flex-col h-full overflow-hidden relative ${
        isStarting3000
          ? 'border-2 border-amber-500 shadow-md ring-2 ring-amber-400/40 hover:shadow-xl hover:-translate-y-1.5'
          : 'border border-[#D8CEBE] hover:border-[#000000]/40 shadow-xs hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* Starting 3000 Special Banner Ribbon */}
      {isStarting3000 && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black px-3.5 py-1 text-[11px] font-black uppercase tracking-wider flex items-center justify-between border-b border-amber-600/30">
          <span className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 fill-black text-black" />
            Starts at ₹3,000 Special Deal
          </span>
          <span className="text-[10px] bg-black text-amber-300 px-2 py-0.5 rounded-full font-black">
            BEST VALUE
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-52 w-full bg-[#ECE4DA] overflow-hidden">
        <Image
          src={project.thumbnail_url}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Tags */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FAF6F0]/95 backdrop-blur-md text-[#000000] shadow-xs border border-[#D8CEBE]">
            {branchInfo?.name || project.branch}
          </span>

          <div className="flex items-center gap-1.5">
            {isStarting3000 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black shadow-sm border border-amber-600/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3 fill-black text-black" /> ₹3,000 Tier
              </span>
            ) : hasDiscount ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#000000] text-[#FFFFFF] shadow-xs">
                {discountPercent}% OFF
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Final Year Project' : 'Mini Project'}
            </span>
            {isStarting3000 && (
              <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                Starting ₹3,000
              </span>
            )}
          </div>
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-base font-extrabold text-[#000000] group-hover:opacity-80 transition-opacity line-clamp-2 leading-snug">
              {project.title}
            </h3>
          </Link>
        </div>

        <p className="text-xs text-[#000000]/80 line-clamp-2 leading-relaxed font-medium">
          {project.short_description}
        </p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(project.tech_stack || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ECE4DA] text-[#000000] border border-[#D8CEBE]"
            >
              {tech}
            </span>
          ))}
          {(project.tech_stack || []).length > 4 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#ECE4DA] text-[#000000]/70">
              +{(project.tech_stack || []).length - 4}
            </span>
          )}
        </div>

        {/* Deliverable Checkmarks */}
        <div className="flex items-center gap-3 pt-2 text-[11px] text-[#000000]/90 font-bold">
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> Source Code</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> IEEE Report</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#000000]" /> PPT</span>
        </div>

        {/* Footer Pricing & Buy Action */}
        <div className="mt-auto pt-4 border-t border-[#D8CEBE]/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-black ${isStarting3000 ? 'text-amber-900 font-black' : 'text-[#000000]'}`}>
                {formatINR(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#000000]/50 line-through font-bold">
                  {formatINR(project.price_inr)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#000000]/70 font-bold block">
              {isStarting3000 ? '⚡ Complete Package Deal' : 'Instant Download ZIP'}
            </span>
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
              isStarting3000
                ? 'bg-amber-500 hover:bg-amber-600 text-black font-black'
                : 'bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF]'
            }`}
          >
            <span>{isStarting3000 ? 'Get for ₹3,000' : 'View'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
