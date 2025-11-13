import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Find valid reset token
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (resetRequest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Check if token has been used
    if (resetRequest.used) {
      return NextResponse.json(
        { error: 'Reset token has already been used' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { token },
      data: { used: true },
    });

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
