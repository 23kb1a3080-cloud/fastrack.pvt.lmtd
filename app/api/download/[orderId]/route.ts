import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderModel } from '@/lib/models/Order';
import { ProjectModel } from '@/lib/models/Project';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    await connectToDatabase();

    const order = await OrderModel.findOne({
      $or: [{ razorpay_order_id: orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }],
      status: 'paid',
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          message:
            'Order verified in Demo mode. In production, your full project ZIP archive, IEEE documentation, and PPT slides will be served immediately.',
          downloadUrl: '#',
        },
        { status: 200 }
      );
    }

    const project = await ProjectModel.findById(order.project_id).lean();

    return NextResponse.json({
      success: true,
      message: 'Download authorized',
      projectTitle: project?.title || 'Fastrack Project Deliverable',
      filePath: project?.file_path || 'projects/deliverable.zip',
      downloadUrl: `/downloads/${project?.file_path || 'deliverable.zip'}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Download authorization failed' },
      { status: 500 }
    );
  }
}
