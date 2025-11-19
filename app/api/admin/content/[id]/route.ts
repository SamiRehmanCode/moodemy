import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { contentSchema } from '@/lib/validations';

// GET /api/admin/content/[id] - Get specific content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const content = await prisma.content.findUnique({
      where: { id },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/content/[id] - Update content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // try {
  //   const authHeader = request.headers.get('authorization');
  //   if (!authHeader?.startsWith('Bearer ')) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }

  //   const token = authHeader.substring(7);
  //   const payload = verifyToken(token);
    
  //   if (!payload || payload.role !== 'ADMIN') {
  //     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  //   }

  //   const { id } = await params;
  //   const body = await request.json();
    
  //   // Validate input
  //   const validation = contentSchema.safeParse(body);
  //   if (!validation.success) {
  //     return NextResponse.json(
  //       { error: 'Validation failed', details: validation.error.issues },
  //       { status: 400 }
  //     );
  //   }

  //   const content = await prisma.content.update({
  //     where: { id },
  //     data: validation.data,
  //   });

  //   return NextResponse.json(
  //     { message: 'Content updated successfully', content },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   console.error('Update content error:', error);
  //   return NextResponse.json(
  //     { error: 'Internal server error' },
  //     { status: 500 }
  //   );
  // }
}

// DELETE /api/admin/content/[id] - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Content deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
