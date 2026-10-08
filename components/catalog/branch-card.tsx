'use client';

import Link from 'next/link';
import { BranchInfo } from '@/lib/constants';
import { ArrowRight, Code, Server, Brain, Cpu, Database } from 'lucide-react';

interface BranchCardProps {
  branch: BranchInfo;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const getBranchIcon = (id: string) => {
    switch (id) {
      case 'CSE': return <Code className="h-5 w-5 text-[#000000]" />;
      case 'IT': return <Server className="h-5 w-5 text-[#000000]" />;
      case 'AI_DS': return <Brain className="h-5 w-5 text-[#000000]" />;
      case 'AIML': return <Cpu className="h-5 w-5 text-[#000000]" />;
      case 'CSE_DS': return <Database className="h-5 w-5 text-[#000000]" />;
      default: return <Code className="h-5 w-5 text-[#000000]" />;
    }
  };

  return (
    <Link
      href={`/branches/${branch.id}`}
      className="group p-6 rounded-2xl bg-[#FAF6F0] hover:bg-[#F5EFE6] border border-[#D8CEBE] transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-[#ECE4DA] border border-[#D8CEBE]">
            {getBranchIcon(branch.id)}
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[#000000] text-[#FFFFFF] shadow-xs">
            {branch.name}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-[#000000] group-hover:opacity-80 transition-opacity">
          {branch.fullName}
        </h3>
        <p className="mt-2 text-xs font-medium leading-relaxed line-clamp-3 text-[#000000]/80">
          {branch.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#D8CEBE]/80 flex items-center justify-between text-xs font-extrabold text-[#000000]">
        <span>Browse {branch.name} Projects</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
