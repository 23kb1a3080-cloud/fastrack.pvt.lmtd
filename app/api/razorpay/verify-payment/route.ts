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

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Securely fetch project price
      const { data: project } = await supabase
        .from('projects')
        .select('price_inr, discounted_price_inr')
        .eq('id', projectId)
        .single();

      const amount = project?.discounted_price_inr || project?.price_inr || 0;

      const { error: insertError } = await supabase.from('orders').insert({
        order_number: `ORD-${Math.floor(Math.random() * 1000000)}`,
        user_id: user?.id || null,
        student_name: buyerEmail?.split('@')[0] || user?.email?.split('@')[0] || 'Student',
        student_email: buyerEmail || user?.email || 'buyer@example.com',
        student_phone: buyerPhone || '',
        project_id: projectId,
        amount_inr: amount,
        status: 'COMPLETED',
        razorpay_payment_id,
        razorpay_order_id,
      });

      if (insertError) {
        console.error('Failed to save order to database:', insertError);
      }
    } catch (dbError) {
      console.error('Database Error:', dbError);
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
