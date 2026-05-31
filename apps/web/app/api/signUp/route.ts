import prisma from '../../../utils/db'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const req = await request.json()
        const {email, password} = req

        const user = await prisma.user.findUnique({ where: { email } })
        if(user){
            return NextResponse.json({error: "User Already exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        })
        console.log(newUser)

        return NextResponse.json({message: "New User created successfully", success: true}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}