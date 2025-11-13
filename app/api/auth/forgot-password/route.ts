import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { forgotPasswordSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expiresAt,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
