import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/banners - Get all active banners
export async function GET(request: NextRequest) {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ banners }, { status: 200 });
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
