import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]/route";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      message: "Notes fetched successfully",
      success: true,
      notes,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      title?: string;
      content?: string;
    };

    const note = await prisma.note.create({
      data: {
        title: body.title ?? "",
        content: body.content ?? "",
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Note created successfully", success: true, note },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
