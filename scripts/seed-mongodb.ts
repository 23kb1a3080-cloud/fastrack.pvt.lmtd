import mongoose from 'mongoose';
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { DEMO_PROJECTS } from '../lib/constants';
import { ProjectModel } from '../lib/models/Project';
import { UserModel } from '../lib/models/User';
import { OrderModel } from '../lib/models/Order';
import { CustomRequestModel } from '../lib/models/CustomRequest';

// Set DNS servers for Windows SRV queries
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (_) {}
}

// Load .env.local or .env if process.env.MONGODB_URI is not set
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}
loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fastrack_db';

async function seed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]+)@/, ':****@')} ...`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully to MongoDB!');

  // 1. Seed Projects
  console.log('Cleaning up demo_video_url and seeding catalog projects into MongoDB...');
  await ProjectModel.updateMany({}, { $unset: { demo_video_url: 1 } });
  let projectCount = 0;
  for (const p of DEMO_PROJECTS) {
    await ProjectModel.findOneAndUpdate(
      { slug: p.slug },
      {
        title: p.title,
        slug: p.slug,
        branch: p.branch,
        category: p.category,
        short_description: p.short_description,
        full_description: p.full_description,
        tech_stack: p.tech_stack,
        price_inr: p.price_inr,
        discounted_price_inr: p.discounted_price_inr,
        thumbnail_url: p.thumbnail_url,
        file_path: p.file_path,
        is_published: p.is_published,
        is_featured: p.is_featured,
        view_count: p.view_count || 100,
        download_count: p.download_count || 10,
        includes_report: p.includes_report ?? true,
        includes_ppt: p.includes_ppt ?? true,
        includes_diagrams: p.includes_diagrams ?? true,
      },
      { upsert: true, new: true }
    );
    projectCount++;
  }
  console.log(`Successfully seeded ${projectCount} projects into collection 'projects'!`);

  // 2. Seed Default Admin & Buyer Users
  console.log('Seeding users into MongoDB...');
  await UserModel.findOneAndUpdate(
    { email: 'admin@fastrack.com' },
    {
      full_name: 'Fastrack Admin',
      email: 'admin@fastrack.com',
      password: 'adminpassword123',
      phone: '+91 9876543210',
      role: 'admin',
      college_name: 'Fastrack Technologies',
      branch: 'CSE',
    },
    { upsert: true, new: true }
  );

  await UserModel.findOneAndUpdate(
    { email: 'student@example.com' },
    {
      full_name: 'Rahul Sharma',
      email: 'student@example.com',
      password: 'password123',
      phone: '+91 9123456789',
      role: 'buyer',
      college_name: 'Engineering College',
      branch: 'AIML',
    },
    { upsert: true, new: true }
  );
  console.log("Successfully seeded users: admin@fastrack.com and student@example.com into collection 'users'!");

  // 3. Seed Sample Completed Orders
  console.log('Seeding sample orders into MongoDB...');
  const firstProject = await ProjectModel.findOne({ slug: 'ai-medical-diagnostics-xray-platform' });
  if (firstProject) {
    await OrderModel.findOneAndUpdate(
      { razorpay_order_id: 'order_DEMO_SEED_001' },
      {
        project_id: firstProject._id.toString(),
        amount_inr: firstProject.discounted_price_inr || firstProject.price_inr,
        razorpay_order_id: 'order_DEMO_SEED_001',
        razorpay_payment_id: 'pay_DEMO_SEED_001',
        razorpay_signature: 'sig_valid_seed_mock',
        status: 'paid',
        buyer_email: 'student@example.com',
        buyer_phone: '+91 9123456789',
        package_tier: 'Standard',
      },
      { upsert: true, new: true }
    );
  }
  console.log("Successfully seeded sample orders into collection 'orders'!");

  // 4. Seed Sample Custom Request
  console.log('Seeding custom request into MongoDB...');
  await CustomRequestModel.findOneAndUpdate(
    { email: 'priya.k@example.com' },
    {
      studentName: 'Priya Kumari',
      email: 'priya.k@example.com',
      phone: '+91 9888877777',
      branch: 'CSE_DS',
      category: 'MAJOR_FINAL_YEAR',
      projectTitle: 'Automated Real-Time Crop Disease Detection using YOLOv8 and Drone Imagery',
      techStack: 'Python, PyTorch, YOLOv8, React Native, FastAPI',
      description: 'Need an IEEE 2025 standard project with full source code, model weights, PPT, and documentation.',
      deadline: '2026-11-30',
      budget: '₹3,500 - ₹5,000',
      status: 'reviewing',
    },
    { upsert: true, new: true }
  );
  console.log("Successfully seeded custom requests into collection 'customrequests'!");

  console.log('\n=============================================');
  console.log('ALL MONGODB COLLECTIONS SEEDED SUCCESSFULLY!');
  console.log('You can now open MongoDB Compass and inspect:');
  console.log('  Database: fastrack_db');
  console.log('  Collections: projects, users, orders, customrequests');
  console.log('=============================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('MongoDB Seeding failed:', err);
  process.exit(1);
});
