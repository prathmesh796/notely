import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, type S3ClientConfig } from "@aws-sdk/client-s3";

import prisma from "../../../../utils/db";
import { authOptions } from "../../auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ note: string }>;
};

const r2Config: S3ClientConfig = {
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
};

const r2 = new S3Client(r2Config);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

async function authenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user.id ?? null;
}

async function findAccessibleNote(noteId: string, userId: string) {
  return prisma.note.findFirst({
    where: {
      id: noteId,
      OR: [{ userId }, { editors: { has: userId } }],
    },
  });
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

    if(!noteId) {
      return NextResponse.json(
        { message: "Note ID is required", success: false },
        { status: 400 },
      );
    }

    const note = await findAccessibleNote(noteId, userId);

    if (!note) {
      return NextResponse.json(
        { message: "Note not found", success: false },
        { status: 404 },
      );
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: noteId,
    });

    const object = await r2.send(getObjectCommand);
    const content = await object.Body?.transformToString();
    const editorUsers = await prisma.user.findMany({
      where: { id: { in: note.editors } },
      select: { email: true },
    });

    return NextResponse.json({
      message: "Note fetched successfully",
      success: true,
      note: { ...note, editors: editorUsers.map((user) => user.email) },
      content,
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

    if(body.title === undefined && body.content === undefined) {
      return NextResponse.json(
        { message: "No fields to update", success: false },
        { status: 400 },
      );
    }

    const accessibleNote = await findAccessibleNote(noteId, userId);
    if (!accessibleNote) {
      return NextResponse.json({ message: "Note not found", success: false }, { status: 404 });
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: { title: body.title },
    });

    if (body.content !== undefined) {
      const putResult = await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: noteId,
        Body: body.content,
      }));
      if (!putResult.$metadata.httpStatusCode || putResult.$metadata.httpStatusCode >= 400) {
        return NextResponse.json(
          { message: "Failed to update note content in R2", success: false },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      message: "Note updated successfully",
      success: true,
      note,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const userId = await authenticatedUserId();

    if (!userId) return unauthorized();

    const { note: noteId } = await params;
    const body = (await request.json()) as {
      title?: string;
      editors?: string[];
    };

    if (body.title === undefined && body.editors === undefined) {
      return NextResponse.json({ message: "No fields to update", success: false }, { status: 400 });
    }

    const accessibleNote = await findAccessibleNote(noteId, userId);
    if (!accessibleNote) {
      return NextResponse.json({ message: "Note not found", success: false }, { status: 404 });
    }

    let editors: string[] | undefined;
    if (body.editors !== undefined) {
      if (accessibleNote.userId !== userId) {
        return NextResponse.json({ message: "Only the owner can manage access", success: false }, { status: 403 });
      }
      const recipients = [...new Set(body.editors.map((editor) => editor.trim().toLowerCase()).filter(Boolean))];
      const uuidRecipients = recipients.filter((recipient) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recipient),
      );
      const emailRecipients = recipients.filter((recipient) => !uuidRecipients.includes(recipient));
      const userFilters = [
        ...(uuidRecipients.length ? [{ id: { in: uuidRecipients } }] : []),
        ...(emailRecipients.length ? [{ email: { in: emailRecipients } }] : []),
      ];
      const users = await prisma.user.findMany({
        where: { OR: userFilters },
        select: { id: true, email: true },
      });
      const matchedRecipients = new Set(users.flatMap((user) => [user.id, user.email.toLowerCase()]));
      const unknownRecipients = recipients.filter((recipient) => !matchedRecipients.has(recipient));
      if (unknownRecipients.length) {
        return NextResponse.json(
          { message: `No account found for: ${unknownRecipients.join(", ")}`, success: false },
          { status: 400 },
        );
      }
      editors = users.map((user) => user.id).filter((id) => id !== userId);
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: { title: body.title, editors },
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

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await authenticatedUserId();

    if (!userId) return unauthorized();

    const { note: noteId } = await params;
    const note = await prisma.note.delete({
      where: { id: noteId, userId },
    });

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: noteId,
    });

    const deleteNote = await r2.send(deleteObjectCommand);

    if (!deleteNote.$metadata.httpStatusCode || deleteNote.$metadata.httpStatusCode >= 400) {
      return NextResponse.json(
        { message: "Failed to delete note content from R2", success: false },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Note deleted successfully",
      success: true,
      note,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
