import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../lib/prisma';

export async function POST (request: NextRequest){
    const {userName, userEmail, userPermissions} = await request.json()
    const newUser = await prisma.users.create({
        data:{
            name: userName,
            email: userEmail,
            permissions: Number(userPermissions)
        }
    })
    return NextResponse.json(newUser)
}