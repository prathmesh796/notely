import { createHmac } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "../../../../../utils/db";
import { authOptions } from "../../../auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ note: string }>;
};

function signJoinToken(noteId: string, userId: string): string {
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- runtime-only shared secret
  const secret = process.env.WS_AUTH_SECRET || "supersecretwskey";
  if (!secret) throw new Error("WS_AUTH_SECRET is not configured");

  const payload = Buffer.from(
    JSON.stringify({ noteId, userId, exp: Date.now() + 5 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { note: noteId } = await params;
    const note = await prisma.note.findFirst({
      where: { id: noteId, OR: [{ userId }, { editors: { has: userId } }] },
      select: { id: true },
    });
    if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json({ token: signJoinToken(note.id, userId) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create collaboration token";
    return NextResponse.json({ message }, { status: 500 });
  }
}
