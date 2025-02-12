import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const paramsData = await params;
    const { userId } = await auth();

    console.log("paramsDate");
    console.log(paramsData);

    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    if (!paramsData.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storByUserId = await prismadb.store.findFirst({
      where: {
        id: paramsData.storeId,
        userId,
      },
    });

    if (!storByUserId) {
      return new NextResponse("Unautorized", { status: 405 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('["CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const paramsData = await params;
    if (!paramsData.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('["CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
