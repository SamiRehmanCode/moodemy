import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { contentSchema } from '@/lib/validations';

// GET /api/admin/content - Get all content (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: { type?: 'ABOUT_US' | 'HELP_SUPPORT' | 'PRIVACY_POLICY' } = {};
    
    if (type && ['ABOUT_US', 'HELP_SUPPORT', 'PRIVACY_POLICY'].includes(type)) {
      where.type = type as 'ABOUT_US' | 'HELP_SUPPORT' | 'PRIVACY_POLICY';
    }

    const contents = await prisma.content.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ contents }, { status: 200 });
  } catch (error) {
    console.error('Get admin content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/content - Create new content (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = contentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const content = await prisma.content.create({
      data: validation.data,
    });

    return NextResponse.json(
      { message: 'Content created successfully', content },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
