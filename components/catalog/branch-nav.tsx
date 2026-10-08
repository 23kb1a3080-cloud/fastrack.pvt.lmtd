'use client';

import Link from 'next/link';
import { BRANCHES } from '@/lib/constants';
import { EngineeringBranch } from '@/lib/types';

interface BranchNavProps {
  activeBranch?: EngineeringBranch | 'ALL';
}

export default function BranchNav({ activeBranch = 'ALL' }: BranchNavProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
      <Link
        href="/projects"
        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
          activeBranch === 'ALL'
            ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
            : 'bg-[#FAF6F0] text-[#000000] border border-[#D8CEBE] hover:bg-[#ECE4DA]'
        }`}
      >
        All Branches
      </Link>

      {BRANCHES.map((branch) => {
        const isActive = activeBranch === branch.id;
        return (
          <Link
            key={branch.id}
            href={`/branches/${branch.id}`}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-[#000000] text-[#FFFFFF] shadow-xs'
                : 'bg-[#FAF6F0] text-[#000000] border border-[#D8CEBE] hover:bg-[#ECE4DA]'
            }`}
          >
            {branch.name}
          </Link>
        );
      })}
    </div>
  );
}
