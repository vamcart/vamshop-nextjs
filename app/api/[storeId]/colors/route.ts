import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const paramsData = await params;
    const { userId } = await auth();

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 });
    }

    if (!paramsData.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const storByUserId = await prismadb.store.findFirst({
      where: {
        id: paramsData.storeId,
        userId,
      },
    });

    if (!storByUserId) {
      return new NextResponse('Unautorized', { status: 405 });
    }

    const colors = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log('[COLORS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const paramsData = await params;
    if (!paramsData.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log('[COLORS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
