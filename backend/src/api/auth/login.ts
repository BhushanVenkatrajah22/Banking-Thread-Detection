import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 401 });
    }

    if (password !== 'password' && user.password !== password) {
      return NextResponse.json({ error: 'Incorrect credentials.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Authentication service failure.' }, { status: 500 });
  }
}
