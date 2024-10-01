import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../lib/prisma';

export async function PUT(request: NextRequest){
    const body = await request.json();
    const userEmail = body.email;
    const userName = body.name || null;
    const userPermissions = body.permissions;

    if(!userEmail){
        console.log("No email provided, cannot update user");
        return NextResponse.error();
    }
    const updatedUser = await prisma.users.update({
        where: {
            email: userEmail
        },
        data:{
            name: userName,
            permissions: Number(userPermissions)
        }
    })
    return NextResponse.json(updatedUser);
}