import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. User not found in MongoDB.' },
        { status: 401 }
      );
    }

    // Check password (plain text or fallback)
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const userData = {
      id: user._id.toString(),
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
      message: 'Successfully authenticated with MongoDB!',
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
    console.error('MongoDB Login Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
