import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomRequestModel } from '@/lib/models/CustomRequest';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.studentName || !data.email || !data.phone || !data.projectTitle) {
      return NextResponse.json(
        { error: 'Student name, email, phone, and project title are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const created = await CustomRequestModel.create({
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      branch: data.branch || 'CSE',
      category: data.category || 'MAJOR_FINAL_YEAR',
      projectTitle: data.projectTitle,
      techStack: data.techStack || '',
      description: data.description || '',
      deadline: data.deadline || '',
      budget: data.budget || '',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      requestId: created._id.toString(),
      message: 'Custom request recorded in MongoDB fastrack_db!',
    });
  } catch (error: any) {
    console.error('Custom Request API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit custom request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const requests = await CustomRequestModel.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ success: true, count: requests.length, requests });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
