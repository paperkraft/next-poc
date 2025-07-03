import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { RECAPTCHA_SITE_KEY } from "@/utils/constants";
import { verifyPassword } from "@/utils/password";
import { fetchModuleByRole } from "./module.action";
import { AuditAction } from "@prisma/client";
import { getUserModules } from "@/lib/menus";

export const getRecaptchaToken = async (): Promise<string | null> => {
    if (!window.grecaptcha) {
        console.error("reCAPTCHA is not loaded yet.");
        return null;
    }

    try {
        const token = await new Promise<string>((resolve, reject) => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY as string, { action: "submit" })
                .then(resolve)
                .catch(reject);
        });

        return token;
    } catch (error) {
        console.error("Error generating reCAPTCHA token:", error);
        return null;
    }
};

export const getUser = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({
        where: { email, isActive: true },
        include: { tenant: true, profile: true, role: true }
    });

    if (!user) {
        return null;
    }

    const hasPwd = await verifyPassword({
        plainPassword: password,
        hashPassword: user.password ?? ""
    });

    if (!hasPwd) {
        await logAuditAction({
            action: AuditAction.ERROR,
            entity: "auth/signin",
            details: { data: { error: "Invalid credentials" } },
            userId: user?.id,
            tenantId: user?.tenantId,
            slug: user?.tenant?.slug
        }
        );
        return null;
    }

    await logAuditAction({
        action: AuditAction.LOGIN,
        entity: "auth/signin",
        details: { data: `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}` },
        userId: +user.id,
        tenantId: user?.tenantId,
        slug: user.tenant?.slug
    });

    // Fetch ABAC modules using the role ID
    // const moduleResponse = await fetchModuleByRole(+user.roleId);
    // const modulesResult = await moduleResponse.json();

    const modules = user ? await getUserModules(user.tenantId, +user.roleId) : []

    return {
        id: user.id,
        name: `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim(),
        email: user.email,
        roleId: user.roleId,
        role: user.role?.name,
        globalRoles: user.globalRoles as string[],
        slug: user.tenant?.slug,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name,
        modules: modules,
    };
};

export const getAllUser = async () => {

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                profile: true
            }
        });

        const allUser = users.map((u) => {
            return {
                id: u.id,
                name: u?.profile?.firstName ?? "" + u?.profile?.lastName
            }
        });

        return {
            success: true,
            data: allUser
        }
    } catch (error) {
        console.log(error);
    }
}