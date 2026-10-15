import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { full_name, email, password, phone, branch, college_name } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists in MongoDB.' },
        { status: 409 }
      );
    }

    const newUser = await UserModel.create({
      full_name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      branch: branch || 'CSE',
      college_name: college_name || '',
      role: 'buyer',
    });

    const userData = {
      id: newUser._id.toString(),
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
      message: 'Account created successfully in MongoDB fastrack_db!',
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
    console.error('MongoDB Signup Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
