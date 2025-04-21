import prisma from '@/lib/prisma';
import { FetchRoleResponse, FetchRolesResponse } from '@/types/role';

export async function fetchRoles(): Promise<FetchRolesResponse> {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return {
            success: true,
            message: 'Success',
            data: roles
        }
    } catch (error) {
        console.error("Error fetching roles:", error);
        return {
            success: false,
            message: "Error fetching roles",
            data: [],
        };
    }
}


export async function fetchUniqueRoles(id: string): Promise<FetchRoleResponse> {
    try {
        const role = await prisma.role.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
            },
        });

        return {
            success: true,
            message: 'Success',
            data: role
        }
    } catch (error) {
        console.error("Error fetching role:", error);
        return {
            success: false,
            message: 'Error fetching role'
        }
    }
}