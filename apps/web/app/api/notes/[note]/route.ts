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

    const note = await prisma.note.findUnique({
      where: { id: noteId, userId },
    });

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

    return NextResponse.json({
      message: "Note fetched successfully",
      success: true,
      note,
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

    const note = await prisma.note.update({
      where: { id: noteId, userId },
      data: {
        title: body.title
      },
    });

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: noteId,
    });

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: noteId,
      Body: body.content || "",
    });

    const deleteResult = await r2.send(deleteObjectCommand);
    if(!deleteResult.$metadata.httpStatusCode || deleteResult.$metadata.httpStatusCode >= 400) {
      return NextResponse.json(
        { message: "Failed to delete old note content from R2", success: false },
        { status: 500 },
      );
    }

    const putResult = await r2.send(putObjectCommand);
    if(!putResult.$metadata.httpStatusCode || putResult.$metadata.httpStatusCode >= 400) {
      return NextResponse.json(
        { message: "Failed to update note content in R2", success: false },
        { status: 500 },
      );
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

    const note = await prisma.note.update({
      where: { id: noteId, userId },
      data: { ...body }
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
