import { NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay/razorpay-client';
import { DEMO_PROJECTS } from '@/lib/constants';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel } from '@/lib/models/Project';
import { OrderModel } from '@/lib/models/Order';

export async function POST(req: Request) {
  try {
    const { projectId, buyerEmail, buyerPhone, packageTier, amountInr } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    let project: any = null;
    try {
      await connectToDatabase();
      const conditions: any[] = [{ slug: projectId }];
      if (typeof projectId === 'string' && /^[0-9a-fA-F]{24}$/.test(projectId)) {
        conditions.push({ _id: projectId });
      }
      project = await ProjectModel.findOne({ $or: conditions }).lean();
    } catch (e) {
      console.warn('MongoDB project lookup failed, falling back to DEMO_PROJECTS:', e);
    }

    if (!project) {
      project = DEMO_PROJECTS.find((p) => p.id === projectId || p.slug === projectId);
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const priceInr = amountInr ? Number(amountInr) : (project.discounted_price_inr || project.price_inr);
    const priceInPaisa = Math.round(priceInr * 100);

    const razorpay = getRazorpayClient();
    const orderOptions = {
      amount: priceInPaisa,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        projectId: project.id || (project._id ? project._id.toString() : ''),
        projectTitle: project.title,
        packageTier: packageTier || 'Standard',
        buyerEmail: buyerEmail || '',
        buyerPhone: buyerPhone || '',
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Record pending order in MongoDB
    try {
      await connectToDatabase();
      await OrderModel.create({
        project_id: project.id || (project._id ? project._id.toString() : projectId),
        amount_inr: priceInr,
        razorpay_order_id: razorpayOrder.id,
        status: 'pending',
        buyer_email: (buyerEmail || 'student@example.com').toLowerCase().trim(),
        buyer_phone: buyerPhone || '',
        package_tier: packageTier || 'Standard',
      });
    } catch (dbErr) {
      console.warn('Could not record pending order in MongoDB:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      projectTitle: project.title,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
