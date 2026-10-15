import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DEMO_PROJECTS, BRANCHES } from '@/lib/constants';
import ProjectDetailView from '@/components/projects/project-detail-view';

// Next.js 16 PPR/Instant Navigation configuration
export const instant = false;

export async function generateStaticParams() {
  return DEMO_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = DEMO_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found | Capstonia',
    };
  }

  return {
    title: `${project.title} — Capstonia Engineering Projects`,
    description: project.short_description,
    openGraph: {
      title: `${project.title} — Capstonia`,
      description: project.short_description,
      images: [project.thumbnail_url],
    },
  };
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Breadcrumb & Title skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-48 bg-[#D8CEBE]/80 rounded-full" />
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-[#D8CEBE]/80 rounded-full" />
          <div className="h-6 w-32 bg-[#D8CEBE]/80 rounded-full" />
        </div>
        <div className="h-10 w-3/4 bg-[#D8CEBE]/80 rounded-2xl" />
        <div className="h-4 w-1/2 bg-[#D8CEBE]/80 rounded-full" />
      </div>

      {/* Main Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full bg-[#FAF6F0] border border-[#D8CEBE] rounded-3xl flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-[#D8CEBE]" />
          </div>
          <div className="h-44 w-full bg-[#FAF6F0] border border-[#D8CEBE] rounded-3xl" />
          <div className="h-64 w-full bg-[#FAF6F0] border border-[#D8CEBE] rounded-3xl" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-96 w-full bg-[#FAF6F0] border border-[#D8CEBE] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

async function ProjectDetailAsyncContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = DEMO_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const branchInfo = BRANCHES.find((b) => b.id === project.branch);

  return <ProjectDetailView project={project} branchInfo={branchInfo} />;
}

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-[#ECE4DA] text-[#000000]">
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailAsyncContent params={params} />
      </Suspense>
    </div>
  );
}
