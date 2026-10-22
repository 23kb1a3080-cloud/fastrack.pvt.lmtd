'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { BRANCHES } from '@/lib/constants';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const branchInfo = BRANCHES.find((b) => b.id === project.branch);

  return (
    <div className="group bg-[#FAF6F0] rounded-2xl transition-all duration-300 flex flex-col h-full overflow-hidden relative border border-[#D8CEBE] hover:border-[#000000]/40 shadow-xs hover:shadow-md hover:-translate-y-1">
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#000000] text-[#FFFFFF] shadow-xs">
            {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Project' : 'Mini Project'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div>
          <span className="text-[11px] font-extrabold text-[#000000]/70 uppercase tracking-wider block mb-1">
            {branchInfo?.fullName || project.branch}
          </span>
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

        {/* Footer Action */}
        <div className="mt-auto pt-4 border-t border-[#D8CEBE]/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-[#000000] block">
              Complete Package
            </span>
            <span className="text-[10px] text-[#000000]/70 font-bold block">
              Tested Code & Documents
            </span>
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs bg-[#000000] hover:bg-[#1a1a1a] text-[#FFFFFF]"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
