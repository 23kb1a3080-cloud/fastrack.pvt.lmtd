import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderModel } from '@/lib/models/Order';
import { ProjectModel } from '@/lib/models/Project';
import { DEMO_PROJECTS } from '@/lib/constants';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let email = searchParams.get('email');

    if (!email) {
      const cookieStore = await cookies();
      const userCookie = cookieStore.get('fastrack_user');
      if (userCookie?.value) {
        try {
          const u = JSON.parse(userCookie.value);
          email = u.email;
        } catch (_) {}
      }
    }

    if (!email) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let orders: any[] = [];
    try {
      await connectToDatabase();
      orders = await OrderModel.find({
        buyer_email: normalizedEmail,
        status: 'paid',
      })
        .sort({ created_at: -1 })
        .lean();
    } catch (dbErr: any) {
      console.warn('Orders lookup failed in MongoDB:', dbErr.message);
    }

    // Populate project details for each order
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        let project: any = null;
        try {
          if (order.project_id) {
            const conditions: any[] = [{ slug: order.project_id }];
            if (typeof order.project_id === 'string' && /^[0-9a-fA-F]{24}$/.test(order.project_id)) {
              conditions.push({ _id: order.project_id });
            }
            project = await ProjectModel.findOne({ $or: conditions }).lean();
          }
        } catch (_) {}

        if (!project && order.project_id) {
          project = DEMO_PROJECTS.find(
            (p) => p.id === order.project_id || p.slug === order.project_id
          );
        }

        return {
          id: order._id?.toString() || order.razorpay_order_id,
          orderId: order.razorpay_order_id,
          paymentId: order.razorpay_payment_id,
          amountInr: order.amount_inr,
          packageTier: order.package_tier || 'Standard',
          status: order.status,
          createdAt: order.created_at,
          project: project
            ? {
                id: project.id || project._id?.toString(),
                title: project.title,
                slug: project.slug,
                branch: project.branch,
                category: project.category,
                short_description: project.short_description,
                file_path: project.file_path,
              }
            : {
                id: order.project_id,
                title: 'Engineering Project Deliverable',
                slug: 'project-deliverable',
                branch: 'CSE',
                category: 'MAJOR_FINAL_YEAR',
                short_description: 'Complete verified project deliverable with source code, report, and viva PPT.',
                file_path: 'projects/deliverable.zip',
              },
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: populatedOrders,
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('Error fetching student orders:', error);
    return NextResponse.json({ success: false, orders: [], error: error.message }, { status: 500 });
  }
}
