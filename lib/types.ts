export type EngineeringBranch = 
  | 'CSE' 
  | 'IT' 
  | 'AI_DS' 
  | 'AIML' 
  | 'CSE_DS';

export type ProjectCategory = 
  | 'MINI_PROJECT' 
  | 'MAJOR_FINAL_YEAR' 
  | 'HARDWARE_SIMULATION' 
  | 'RESEARCH_PAPER';

export interface Project {
  id: string;
  title: string;
  slug: string;
  branch: EngineeringBranch;
  category: ProjectCategory;
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
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  college_name?: string;
  branch?: EngineeringBranch;
  role: 'buyer' | 'admin';
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  project_id: string;
  amount_inr: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  buyer_email: string;
  buyer_phone: string;
  created_at: string;
  projects?: Project;
}
