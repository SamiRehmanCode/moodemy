import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetOtpEmail } from '@/lib/email';
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

    // Generate a 4-digit OTP
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    let otp = generateOtp();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save OTP to database. Handle rare token collisions by retrying a few times.
    let created = null;
    let attempts = 0;
    while (!created && attempts < 5) {
      attempts += 1;
      try {
        created = await prisma.passwordReset.create({
          data: {
            email,
            token: otp,
            expiresAt,
          },
        });
      } catch (err) {
        // If unique constraint failed, generate new OTP and retry
        otp = generateOtp();
      }
    }

    if (!created) {
      console.error('Failed to create OTP after retries');
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
    }

    // Send OTP email (user will use the 4-digit code to reset password)
    await sendPasswordResetOtpEmail(email, otp);

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
