import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'registered_users.json');

// Default initial accounts
const DEFAULT_USERS = [
  {
    name: 'Rahul Sharma',
    email: 'student@college.edu',
    phone: '9876543210',
    branch: 'CSE',
    role: 'STUDENT',
    passwordHash: hashPassword('password123'),
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Admin Lead',
    email: 'admin@capstonia.com',
    phone: '7382324346',
    branch: 'CSE',
    role: 'ADMIN',
    passwordHash: hashPassword('admin123'),
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Admin Lead',
    email: 'admin@gmail.com',
    phone: '7382324346',
    branch: 'CSE',
    role: 'ADMIN',
    passwordHash: hashPassword('admin123'),
    createdAt: new Date().toISOString(),
  },
];

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

function getStoredUsers(): any[] {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) {
      const dir = path.dirname(USERS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
      return DEFAULT_USERS;
    }
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS;
  } catch (err) {
    console.error('Failed to read registered_users.json:', err);
    return DEFAULT_USERS;
  }
}

function saveStoredUsers(users: any[]) {
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write registered_users.json:', err);
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('capstonia_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = JSON.parse(decodeURIComponent(sessionCookie));
    return NextResponse.json({ authenticated: true, user });
  } catch (err) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const cookieStore = await cookies();

    // 1. LOGOUT ACTION
    if (action === 'logout') {
      try {
        cookieStore.set('capstonia_session', '', {
          maxAge: 0,
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
        });
      } catch {}

      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    // 2. SYNC EXISTING LOCAL SESSION
    if (action === 'sync') {
      const user = body.user;
      if (user && user.email) {
        cookieStore.set('capstonia_session', encodeURIComponent(JSON.stringify(user)), {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
        });
      }
      return NextResponse.json({ success: true, user });
    }

    // 3. SIGN UP ACTION
    if (action === 'signup') {
      const { name, email, phone, branch, password } = body;
      const cleanEmail = email?.trim().toLowerCase();
      const cleanName = name?.trim();
      const cleanPhone = phone?.trim();
      const cleanPassword = password?.trim();
      const role = cleanEmail.includes('admin') ? 'ADMIN' : 'STUDENT';

      if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
        return NextResponse.json(
          { success: false, error: 'All fields are required.' },
          { status: 400 }
        );
      }

      if (cleanPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters.' },
          { status: 400 }
        );
      }

      const users = getStoredUsers();
      const existingUser = users.find((u) => u.email?.toLowerCase() === cleanEmail);

      const passwordHash = hashPassword(cleanPassword);

      if (existingUser) {
        // Update existing user details and password
        existingUser.name = cleanName;
        existingUser.phone = cleanPhone;
        existingUser.branch = branch || 'CSE';
        existingUser.role = role;
        existingUser.passwordHash = passwordHash;
        existingUser.updatedAt = new Date().toISOString();
      } else {
        users.push({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          branch: branch || 'CSE',
          role,
          passwordHash,
          createdAt: new Date().toISOString(),
        });
      }

      saveStoredUsers(users);

      // Attempt Supabase sign up in background
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nonlkkewujpoztzhzfwh.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_X_ICNGdFFa2eInHDEbX-_w_iP2gGNvm';
        const sb = createClient(supabaseUrl, supabaseKey);
        await sb.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: { full_name: cleanName, phone: cleanPhone, branch, role },
          },
        });
      } catch (sbErr) {
        // Ignored; local storage & server registry ensures instant login
      }

      const userObj = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        branch: branch || 'CSE',
        role,
      };

      cookieStore.set('capstonia_session', encodeURIComponent(JSON.stringify(userObj)), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: userObj,
      });
    }

    // 4. SIGN IN ACTION
    if (action === 'login') {
      const cleanEmail = body.email?.trim().toLowerCase();
      const cleanPassword = body.password?.trim();

      if (!cleanEmail || !cleanPassword) {
        return NextResponse.json(
          { success: false, error: 'Please enter both email and password.' },
          { status: 400 }
        );
      }

      const users = getStoredUsers();
      const passHash = hashPassword(cleanPassword);

      // A. Check Demo accounts
      const isStudentDemo =
        (cleanEmail === 'student@college.edu' || cleanEmail === 'rahul.student@college.edu') &&
        (cleanPassword === 'password123' || cleanPassword === 'student123');

      const isAdminDemo =
        (cleanEmail === 'admin@capstonia.com' || cleanEmail === 'admin001@capstonia.com' || cleanEmail === 'admin@gmail.com') &&
        (cleanPassword === 'admin123' || cleanPassword === 'password123');

      let matchedUser = users.find(
        (u) => u.email?.toLowerCase() === cleanEmail && (u.passwordHash === passHash || u.password === cleanPassword)
      );

      let authSuccessful = false;
      let userObj: any = null;

      if (matchedUser) {
        authSuccessful = true;
        userObj = {
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone || '',
          branch: matchedUser.branch || 'CSE',
          role: matchedUser.role || (cleanEmail.includes('admin') ? 'ADMIN' : 'STUDENT'),
        };
      } else if (isAdminDemo) {
        authSuccessful = true;
        userObj = {
          name: 'Admin Lead',
          email: cleanEmail,
          phone: '7382324346',
          branch: 'CSE',
          role: 'ADMIN',
        };
      } else if (isStudentDemo) {
        authSuccessful = true;
        userObj = {
          name: 'Rahul Sharma',
          email: cleanEmail,
          phone: '9876543210',
          branch: 'CSE',
          role: 'STUDENT',
        };
      } else {
        // Try Supabase Auth
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nonlkkewujpoztzhzfwh.supabase.co';
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_X_ICNGdFFa2eInHDEbX-_w_iP2gGNvm';
          const sb = createClient(supabaseUrl, supabaseKey);

          const { data, error } = await sb.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

          if (!error && data?.user) {
            authSuccessful = true;
            userObj = {
              name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              email: cleanEmail,
              phone: data.user.user_metadata?.phone || '',
              branch: data.user.user_metadata?.branch || 'CSE',
              role: data.user.user_metadata?.role || (cleanEmail.includes('admin') ? 'ADMIN' : 'STUDENT'),
            };
          } else if (
            error?.message?.toLowerCase().includes('email not confirmed') ||
            (error as any)?.code === 'email_not_confirmed'
          ) {
            // Credentials are valid in Supabase!
            authSuccessful = true;
            const capName = cleanEmail.split('@')[0];
            userObj = {
              name: capName.charAt(0).toUpperCase() + capName.slice(1),
              email: cleanEmail,
              phone: '',
              branch: 'CSE',
              role: cleanEmail.includes('admin') ? 'ADMIN' : 'STUDENT',
            };
          }
        } catch (sbErr) {
          console.warn('Supabase auth fallback check:', sbErr);
        }
      }

      if (!authSuccessful || !userObj) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email or password. Please verify your credentials or click Sign Up to register.',
          },
          { status: 401 }
        );
      }

      // Save/update in registry so re-logins are instant
      const updatedUsers = users.filter((u) => u.email?.toLowerCase() !== cleanEmail);
      updatedUsers.push({
        name: userObj.name,
        email: cleanEmail,
        phone: userObj.phone,
        branch: userObj.branch,
        role: userObj.role,
        passwordHash: passHash,
        lastLogin: new Date().toISOString(),
      });
      saveStoredUsers(updatedUsers);

      cookieStore.set('capstonia_session', encodeURIComponent(JSON.stringify(userObj)), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        message: 'Sign in successful',
        user: userObj,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Auth API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
