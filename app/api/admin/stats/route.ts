import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/stats - Get dashboard statistics (admin only)
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

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalBanners,
      activeBanners,
      contentCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.banner.count(),
      prisma.banner.count({ where: { isActive: true } }),
      prisma.content.count(),
    ]);

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          totalBanners,
          activeBanners,
          contentCount,
        },
        recentUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
