import { NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay/razorpay-client';
import { DEMO_PROJECTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { projectId, buyerEmail, buyerPhone } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const priceInr = project.discounted_price_inr || project.price_inr;
    const priceInPaisa = Math.round(priceInr * 100);

    const razorpay = getRazorpayClient();
    const orderOptions = {
      amount: priceInPaisa,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        projectId: project.id,
        projectTitle: project.title,
        buyerEmail: buyerEmail || '',
        buyerPhone: buyerPhone || '',
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

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
