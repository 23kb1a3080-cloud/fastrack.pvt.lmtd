import { NextResponse } from 'next/server';
import { findUserByEmail, registerNewUser } from '@/lib/auth-storage';

export async function POST(req: Request) {
  try {
    const { full_name, email, password, phone, branch, college_name } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Full name, email address, and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const newUser = await registerNewUser({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      branch: branch || 'CSE',
      college_name: college_name || '',
      role: email.toLowerCase().trim().includes('admin') ? 'admin' : 'buyer',
    });

    const userData = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      phone: newUser.phone,
      branch: newUser.branch,
      college_name: newUser.college_name,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      message: 'Account successfully registered and verified!',
    });

    // Store user session in cookie
    response.cookies.set('fastrack_user', JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
