import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  email: string;
  password?: string;
  phone?: string;
  college_name?: string;
  branch?: string;
  role: 'buyer' | 'admin';
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    phone: { type: String },
    college_name: { type: String },
    branch: { type: String },
    role: { type: String, enum: ['buyer', 'admin'], default: 'buyer' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
