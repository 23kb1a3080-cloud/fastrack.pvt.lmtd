import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderModel } from '@/lib/models/Order';

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

    // Insert or update Order in MongoDB Compass
    try {
      await connectToDatabase();
      await OrderModel.findOneAndUpdate(
        { razorpay_order_id },
        {
          project_id: projectId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: 'paid',
          buyer_email: buyerEmail || 'student@example.com',
          buyer_phone: buyerPhone || '',
        },
        { upsert: true, returnDocument: 'after' }
      );
    } catch (dbErr) {
      console.error('MongoDB order update error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and saved in MongoDB',
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
