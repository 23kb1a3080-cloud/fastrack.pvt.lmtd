import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth-storage';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please check your spelling or register.' },
        { status: 401 }
      );
    }

    // Check password
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const userData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      branch: user.branch,
      college_name: user.college_name,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      message: 'Successfully authenticated!',
    });

    // Store user session in cookie
    response.cookies.set('fastrack_user', JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
