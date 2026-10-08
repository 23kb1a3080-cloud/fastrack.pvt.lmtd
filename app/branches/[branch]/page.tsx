export const instant = false;

import { notFound } from 'next/navigation';
import { BRANCHES } from '@/lib/constants';
import { EngineeringBranch } from '@/lib/types';
import ProjectCard from '@/components/catalog/project-card';
import BranchCard from '@/components/catalog/branch-card';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function generateStaticParams() {
  return BRANCHES.map((branch) => ({
    branch: branch.id,
  }));
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ branch: string }>;
}) {
  const { branch } = await params;
  const branchUpper = branch.toUpperCase() as EngineeringBranch;
  const branchInfo = BRANCHES.find((b) => b.id === branchUpper);

  if (!branchInfo) {
    notFound();
  }

  const supabase = await createClient();
  const { data: branchProjects = [] } = await supabase.from('projects').select('*').eq('branch', branchUpper).eq('is_published', true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#ECE4DA] text-[#000000]">
      {/* Branch Banner Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[#000000] text-[#FFFFFF] shadow-xs mb-4">
            {branchInfo.fullName}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#000000]">
            {branchInfo.name} Engineering Projects
          </h1>
          <p className="mt-3 text-sm text-[#000000]/80 leading-relaxed font-medium">
            {branchInfo.description}
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#000000]">
            Available {branchInfo.name} Packages ({branchProjects.length})
          </h2>
          <Link href="/projects" className="text-xs font-bold text-[#000000] hover:underline">
            View All Branches →
          </Link>
        </div>

        {branchProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FAF6F0] rounded-3xl border border-[#D8CEBE]">
            <p className="text-[#000000] text-sm font-bold">
              More {branchInfo.fullName} projects coming soon! Contact support for custom project development.
            </p>
          </div>
        )}
      </div>

      {/* Other Branches Grid */}
      <div className="pt-8 border-t border-[#D8CEBE]">
        <h3 className="text-lg font-black text-[#000000] mb-6">Explore Other Departments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES.filter((b) => b.id !== branchUpper).slice(0, 4).map((b) => (
            <BranchCard key={b.id} branch={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
