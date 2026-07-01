import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "../../../../utils/db";
import { authOptions } from "../../auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ note: string }>;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

async function authenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user.id ?? null;
}

function unauthorized() {
  return NextResponse.json(
    { message: "Unauthorized", success: false },
    { status: 401 },
  );
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const userId = await authenticatedUserId();

    if (!userId) return unauthorized();

    const { note: noteId } = await params;
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) {
      return NextResponse.json(
        { message: "Note not found", success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Note fetched successfully",
      success: true,
      note,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await authenticatedUserId();

    if (!userId) return unauthorized();

    const { note: noteId } = await params;
    const note = await prisma.note.delete({
      where: { id: noteId, userId },
    });

    return NextResponse.json({
      message: "Note deleted successfully",
      success: true,
      note,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const userId = await authenticatedUserId();

    if (!userId) return unauthorized();

    const { note: noteId } = await params;
    const body = (await request.json()) as {
      title?: string;
      content?: string;
    };

    const note = await prisma.note.update({
      where: { id: noteId, userId },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return NextResponse.json({
      message: "Note updated successfully",
      success: true,
      note,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
