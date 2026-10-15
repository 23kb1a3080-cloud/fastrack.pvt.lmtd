import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  user_id?: string;
  project_id: string;
  amount_inr: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  buyer_email: string;
  buyer_phone: string;
  package_tier?: string;
  created_at: Date;
  updated_at: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: String },
    project_id: { type: String, required: true, index: true },
    amount_inr: { type: Number, required: true },
    razorpay_order_id: { type: String, required: true, unique: true, index: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    buyer_email: { type: String, required: true },
    buyer_phone: { type: String },
    package_tier: { type: String, default: 'Standard' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
