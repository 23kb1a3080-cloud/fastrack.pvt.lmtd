import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  branch: string;
  category: string;
  short_description: string;
  full_description: string;
  tech_stack: string[];
  price_inr: number;
  discounted_price_inr?: number;
  thumbnail_url: string;
  demo_video_url?: string;
  file_path: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  download_count: number;
  includes_report: boolean;
  includes_ppt: boolean;
  includes_diagrams: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    branch: { type: String, required: true, index: true },
    category: { type: String, required: true },
    short_description: { type: String, required: true },
    full_description: { type: String, required: true },
    tech_stack: [{ type: String }],
    price_inr: { type: Number, required: true },
    discounted_price_inr: { type: Number },
    thumbnail_url: { type: String, default: '/images/cse_microservices.jpg' },
    demo_video_url: { type: String },
    file_path: { type: String, default: 'projects/default.zip' },
    is_published: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    view_count: { type: Number, default: 0 },
    download_count: { type: Number, default: 0 },
    includes_report: { type: Boolean, default: true },
    includes_ppt: { type: Boolean, default: true },
    includes_diagrams: { type: Boolean, default: true },
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

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
