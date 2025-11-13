import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/content - Get all active content or specific type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = { isActive: true };
    
    if (type && ['ABOUT_US', 'HELP_SUPPORT', 'PRIVACY_POLICY'].includes(type)) {
      where.type = type;
    }

    const contents = await prisma.content.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ contents }, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
