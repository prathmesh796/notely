import prisma from '../../../../utils/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'next-auth/react';
import { User } from '@repo/types';

export async function GET(request: NextRequest, { noteId }: { noteId: string }) {
    try {
        const session = await getSession();
        const user = session?.user as User

        if (!session) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const note = await prisma.note.findUnique({
            where: {
                id: noteId,
                userId: user?.id
            }
        })
        return NextResponse.json({ message: "Note fetched successfully", success: true, note }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { noteId }: { noteId: string }) {
    try {
        const session = await getSession();
        const user = session?.user as User

        if (!session) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const note = await prisma.note.delete({
            where: {
                id: noteId,
                userId: user?.id
            }
        })
        return NextResponse.json({ message: "Note deleted successfully", success: true, note }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { noteId }: { noteId: string }) {
    try {
        const session = await getSession();
        const user = session?.user as User

        if (!session) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const req = await request.json()
        const { title, content } = req

        const note = await prisma.note.update({
            where: {
                id: noteId,
                userId: user?.id
            },
            data: {
                title,
                content,
            }
        })
        return NextResponse.json({ message: "Note updated successfully", success: true, note }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}