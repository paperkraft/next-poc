import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { FetchGroupResponse, FetchGroupsResponse } from "@/types/group";

export async function getAllGroups(): Promise<FetchGroupsResponse> {
    try {
        const groups = await prisma.group.findMany({
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
        const group = await prisma.group.findUnique({
            where: { id: id },
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
        const exist = await prisma.group.findFirst({
            where: { name }
        });

        if (exist) {
            return {
                success: false,
                message: "Group already exists",
                data: exist,
            };
        }

        const group = await prisma.group.create({
            data: { name },
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
        const group = await prisma.group.update({
            where: { id },
            data: { name },
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

export async function deleteGroup(ids: string[]): Promise<FetchGroupResponse> {
    try {

        if (!ids || !Array.isArray(ids)) {
            return { success: false, message: "Id is required" };
        }

        // Check if any group is assigned to a module
        const groupsWithModules = await prisma.group.findMany({
            where: {
                id: { in: ids },
                modules: { some: {} },  // Check if the group has any associated modules
            }
        });

        if (groupsWithModules.length > 0) {
            return {
                success: false,
                message: "Cannot delete group(s) assigned to modules",
            };
        }

        // Proceed with deletion if no group is assigned to any module
        const deletedGroups = await prisma.group.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        await logAuditAction('Delete', 'master/groups', { data: deletedGroups });

        return {
            success: true,
            message: "Group(s) deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting groups:", error);
        await logAuditAction('Error', 'master/groups', { error: "Error deleting group" });

        return {
            success: false,
            message: "Error deleting groups",
        };
    }
}