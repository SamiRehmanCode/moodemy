import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { bannerSchema } from '@/lib/validations';

// GET /api/admin/banners - Get all banners (admin only)
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

    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ banners }, { status: 200 });
  } catch (error) {
    console.error('Get admin banners error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/banners - Create new banner (admin only)
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
    const validation = bannerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: validation.data,
    });

    return NextResponse.json(
      { message: 'Banner created successfully', banner },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
