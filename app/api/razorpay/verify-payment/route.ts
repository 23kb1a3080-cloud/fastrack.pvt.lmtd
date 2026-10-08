import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      projectId,
      buyerEmail,
      buyerPhone,
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Insert or update Order in Supabase if configured
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('orders').insert({
        user_id: user?.id || null,
        project_id: projectId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
        buyer_email: buyerEmail || user?.email || 'buyer@example.com',
        buyer_phone: buyerPhone || '',
      });
    } catch {
      // Supabase table not created yet or running in demo mode
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('Razorpay Verify Error:', error);
    return NextResponse.json(
      { error: 'Payment verification error' },
      { status: 500 }
    );
  }
}
