"use server"

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { cache } from "react";

export async function getUserRolePermissions(userId: string) {

    const userWithRoleAndPermissions = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: { include: { rolePermissions: { include: { permission: true } } } },
        },
    });

    if (!userWithRoleAndPermissions) {
        throw new Error("User not found");
    }

    // Extracting the permissions
    const permissions = userWithRoleAndPermissions.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission
    );

    return {
        permissions: permissions,
    };
}


export const getMyPermissions = cache(async () => {
    
    const session = await auth();
    const id = session?.user?.id
    
    const userPermission = await prisma.user.findUnique({
        where: { id:id },
        include: {
            role: { include: { rolePermissions: { include: { permission: true } } } },
        },
    });

    if (!userPermission) {
        throw new Error("User not found");
    }

    const permissions = userPermission.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission
    );

    return permissions;

})

export const hasPermission = (rolePermissions: number, permissionBit: number): boolean => {
    return (rolePermissions & permissionBit) === permissionBit;
};
  