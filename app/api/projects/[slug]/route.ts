import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel } from '@/lib/models/Project';
import { DEMO_PROJECTS } from '@/lib/constants';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectToDatabase();

    let project: any = await ProjectModel.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    }).lean();

    if (!project) {
      project = DEMO_PROJECTS.find((p) => p.slug === slug || p.id === slug);
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        id: project._id ? project._id.toString() : project.id,
      },
    });
  } catch (error: any) {
    console.error('Project Detail API Error:', error);
    const { slug } = await params;
    const fallback = DEMO_PROJECTS.find((p) => p.slug === slug || p.id === slug);
    if (fallback) {
      return NextResponse.json({ success: true, project: fallback });
    }
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
