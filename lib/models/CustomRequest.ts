import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomRequest extends Document {
  studentName: string;
  email: string;
  phone: string;
  branch: string;
  category: string;
  projectTitle: string;
  techStack?: string;
  description: string;
  deadline?: string;
  budget?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'completed';
  created_at: Date;
  updated_at: Date;
}

const CustomRequestSchema = new Schema<ICustomRequest>(
  {
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    branch: { type: String, required: true },
    category: { type: String, required: true },
    projectTitle: { type: String, required: true },
    techStack: { type: String },
    description: { type: String, required: true },
    deadline: { type: String },
    budget: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'completed'],
      default: 'pending',
    },
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

export const CustomRequestModel: Model<ICustomRequest> =
  mongoose.models.CustomRequest ||
  mongoose.model<ICustomRequest>('CustomRequest', CustomRequestSchema);
