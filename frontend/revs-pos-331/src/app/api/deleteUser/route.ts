import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../lib/prisma';

export async function DELETE (request: NextRequest){
    const {userName, userEmail, userPermissions} = await request.json()
    const deletedUser = await prisma.users.delete({
        where: {
            email: userEmail
        }
    })
    return NextResponse.json(deletedUser);
}