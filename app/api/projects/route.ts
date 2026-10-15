import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel } from '@/lib/models/Project';
import { DEMO_PROJECTS } from '@/lib/constants';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'featured';

    await connectToDatabase();

    const query: Record<string, any> = { is_published: true };

    if (branch && branch !== 'ALL') {
      query.branch = branch;
    }

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { short_description: searchRegex },
        { tech_stack: searchRegex },
      ];
    }

    let sortObj: Record<string, any> = { is_featured: -1, created_at: -1 };
    if (sort === 'price_asc') sortObj = { price_inr: 1 };
    if (sort === 'price_desc') sortObj = { price_inr: -1 };
    if (sort === 'views') sortObj = { view_count: -1 };
    if (sort === 'downloads') sortObj = { download_count: -1 };

    let projects = await ProjectModel.find(query).sort(sortObj).lean();

    // Fallback if collection was empty
    if (!projects || projects.length === 0) {
      projects = DEMO_PROJECTS as any;
    }

    return NextResponse.json({
      success: true,
      count: projects.length,
      projects: projects.map((p: any) => ({
        ...p,
        id: p._id ? p._id.toString() : p.id,
      })),
    });
  } catch (error: any) {
    console.error('Projects API Error:', error);
    // Fallback to DEMO_PROJECTS if DB connection fails
    return NextResponse.json({
      success: true,
      count: DEMO_PROJECTS.length,
      projects: DEMO_PROJECTS,
    });
  }
}
