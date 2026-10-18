import fs from 'node:fs';
import path from 'node:path';
import { connectToDatabase } from './mongodb';
import { UserModel } from './models/User';

export interface AuthUserData {
  id: string;
  email: string;
  full_name: string;
  role: 'buyer' | 'admin';
  phone?: string;
  branch?: string;
  college_name?: string;
}

const FALLBACK_FILE = path.resolve(process.cwd(), '.system_user_store.json');

// Default accounts always available even offline
const DEFAULT_USERS: Array<AuthUserData & { password?: string }> = [
  {
    id: 'user_admin_001',
    email: 'admin@capstonia.com',
    full_name: 'Capstonia Admin',
    role: 'admin',
    phone: '+91 7382324346',
    branch: 'CSE',
    password: 'adminpassword123',
  },
  {
    id: 'user_admin_002',
    email: 'admin@fastrack.com',
    full_name: 'Capstonia Admin',
    role: 'admin',
    phone: '+91 7382324346',
    branch: 'CSE',
    password: 'adminpassword123',
  },
  {
    id: 'user_student_001',
    email: 'student@example.com',
    full_name: 'Rahul Sharma',
    role: 'buyer',
    phone: '+91 9123456789',
    branch: 'AIML',
    password: 'password123',
  },
];

function loadLocalUsers(): Array<AuthUserData & { password?: string }> {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return [...DEFAULT_USERS];
}

function saveLocalUsers(users: Array<AuthUserData & { password?: string }>) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (_) {}
}

export async function findUserByEmail(email: string): Promise<(AuthUserData & { password?: string }) | null> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Try MongoDB
  try {
    await connectToDatabase();
    const dbUser = await UserModel.findOne({ email: normalizedEmail });
    if (dbUser) {
      return {
        id: dbUser._id.toString(),
        email: dbUser.email,
        full_name: dbUser.full_name,
        role: dbUser.role,
        phone: dbUser.phone,
        branch: dbUser.branch,
        college_name: dbUser.college_name,
        password: dbUser.password,
      };
    }
  } catch (err: any) {
    console.warn('MongoDB lookup failed, using local store:', err.message);
  }

  // 2. Fallback to local store
  const localUsers = loadLocalUsers();
  const found = localUsers.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
  return found || null;
}

export async function registerNewUser(params: {
  full_name: string;
  email: string;
  password?: string;
  phone?: string;
  branch?: string;
  college_name?: string;
  role?: 'buyer' | 'admin';
}): Promise<AuthUserData> {
  const normalizedEmail = params.email.toLowerCase().trim();
  const role = params.role || (normalizedEmail.includes('admin') ? 'admin' : 'buyer');

  let createdId = `user_${Date.now()}`;

  // 1. Try MongoDB
  try {
    await connectToDatabase();
    const newUser = await UserModel.create({
      full_name: params.full_name,
      email: normalizedEmail,
      password: params.password,
      phone: params.phone || '',
      branch: params.branch || 'CSE',
      college_name: params.college_name || '',
      role,
    });
    createdId = newUser._id.toString();
  } catch (err: any) {
    console.warn('MongoDB user creation failed, persisting to local store:', err.message);
  }

  // 2. Always persist to local store backup
  const userData: AuthUserData & { password?: string } = {
    id: createdId,
    email: normalizedEmail,
    full_name: params.full_name,
    role,
    phone: params.phone,
    branch: params.branch || 'CSE',
    college_name: params.college_name,
    password: params.password,
  };

  const localUsers = loadLocalUsers();
  const existingIdx = localUsers.findIndex((u) => u.email.toLowerCase().trim() === normalizedEmail);
  if (existingIdx !== -1) {
    localUsers[existingIdx] = userData;
  } else {
    localUsers.push(userData);
  }
  saveLocalUsers(localUsers);

  return {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role,
    phone: userData.phone,
    branch: userData.branch,
    college_name: userData.college_name,
  };
}
