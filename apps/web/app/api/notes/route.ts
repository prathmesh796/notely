import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, type S3ClientConfig } from "@aws-sdk/client-s3";

import prisma from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]/route";

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

    const sharedNotes = await prisma.note.findMany({
      where: {
        editors: {
          has: session.user.id
        }
      }
    });

    return NextResponse.json({
      message: "Notes fetched successfully",
      success: true,
      notes,
      sharedNotes,
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
    };

    const note = await prisma.note.create({
      data: {
        title: body.title || "Untitled Note",
        userId: session.user.id
      },
    });

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: note.id,
      Body: "",
    });

    const putNote = await r2.send(putObjectCommand);
    if(!putNote.$metadata.httpStatusCode || putNote.$metadata.httpStatusCode >= 400) {
      return NextResponse.json(
        { message: "Failed to create note content in R2", success: false },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Note created successfully", success: true, note },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

