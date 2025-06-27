import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { FetchGroupResponse, FetchGroupsResponse } from "@/types/group";
import { AuditAction } from "@prisma/client";

export async function getAllGroups(): Promise<FetchGroupsResponse> {
    try {
        const groups = await prisma.menuGroup.findMany({
            select: { id: true, name: true }
        });

        return {
            success: true,
            message: "Success",
            data: groups,
        };
    } catch (error) {
        console.error("Error fetching groups:", error);
        return {
            success: false,
            message: "Error fetching groups",
            data: [],
        };
    }
}

export async function getGroupById(id: string): Promise<FetchGroupResponse> {
    try {
        const group = await prisma.menuGroup.findUnique({
            where: { id: +id },
            select: { id: true, name: true },
        });

        if (!group) {
            return {
                success: false,
                message: "Group not found",
            };
        }

        return {
            success: true,
            message: 'Success',
            data: group
        }
    } catch (error) {
        console.error("Error fetching group:", error);
        return {
            success: false,
            message: "Error fetching groups",
        };
    }
}

export async function createGroup(name: string): Promise<FetchGroupResponse> {
    try {
        const exist = await prisma.menuGroup.findFirst({
            where: { name }
        });

        if (exist) {
            return {
                success: false,
                message: "Group already exists",
                data: exist,
            };
        }

        const group = await prisma.menuGroup.create({
            data: { name },
        });

        await logAuditAction({
            action: AuditAction.CREATE,
            entity: 'master/groups',
            details: { data: group }
        });

        return {
            success: true,
            message: "Group created successfully",
            data: group,
        };
    } catch (error) {
        console.error("Error creating group:", error);
        return {
            success: false,
            message: "Error creating group",
        };
    }
}

export async function updateGroup(id: string, name: string): Promise<FetchGroupResponse> {
    try {
        const group = await prisma.menuGroup.update({
            where: { id: +id },
            data: { name },
        });

        await logAuditAction({
            action: AuditAction.UPDATE,
            entity: 'master/groups',
            details: { data: group }
        });

        return {
            success: true,
            message: "Group updated successfully",
            data: group,
        };
    } catch (error) {
        console.error("Error updating group:", error);
        return {
            success: false,
            message: "Error updating group",
        };
    }
}

export async function deleteGroup(ids: number[]): Promise<FetchGroupResponse> {
    try {

        if (!ids || !Array.isArray(ids)) {
            return { success: false, message: "Id is required" };
        }

        // Check if any group is assigned to a module
        const groupsWithModules = await prisma.menuGroup.findMany({
            where: {
                id: { in: ids },
                menus: { some: {} },  // Check if the group has any associated modules
            }
        });

        if (groupsWithModules.length > 0) {
            return {
                success: false,
                message: "Cannot delete group(s) assigned to modules",
            };
        }

        // Proceed with deletion if no group is assigned to any module
        const deletedGroups = await prisma.menuGroup.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        await logAuditAction({
            action: AuditAction.DELETE,
            entity: 'master/groups',
            details: { data: deletedGroups }
        });

        return {
            success: true,
            message: "Group(s) deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting groups:", error);
        await logAuditAction({
            action: AuditAction.ERROR,
            entity: 'master/groups',
            details: { error: "Error deleting group" }
        });

        return {
            success: false,
            message: "Error deleting groups",
        };
    }
}