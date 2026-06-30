import prisma from '../../../utils/db'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'next-auth/react';
import { User } from '@repo/types';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        const user = session?.user as User

        if (!session) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const notes = await prisma.note.findMany({
            where: {
                userId: user?.id
            }
        })
        return NextResponse.json({ message: "Notes fetched successfully", success: true, notes }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const user = session?.user as User
        if (!session) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        const req = await request.json()
        const { title, content, userId } = req

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId,
            }
        })
        return NextResponse.json({ message: "Note created successfully", success: true, note }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}