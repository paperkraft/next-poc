import { logAuditAction } from "@/lib/audit-log";
import prisma from "@/lib/prisma";
import { RECAPTCHA_SITE_KEY } from "@/utils/constants";
import { verifyPassword } from "@/utils/password";
import { fetchModuleByRole } from "./module.action";

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
        where: { email },
        include: {
            role: {
                include: {
                    permissions: {
                        include: {
                            module: true
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        return null;
    }

    const hasPwd = await verifyPassword({
        plainPassword: password,
        hashPassword: user.password ?? ""
    });

    if (!hasPwd) {
        await logAuditAction("Error", "auth/signin", { error: "Invalid credentials" }, user.id);
        return null;
    }

    await logAuditAction("login", "auth/signin", { user: `${user.firstName} ${user.lastName}` }, user.id);

    // Fetch ABAC modules using the role ID
    const moduleResponse = await fetchModuleByRole(user.roleId);
    const modulesResult = await moduleResponse.json();

    return {
        id: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.email,
        roleId: user.roleId,
        permissions: user.role.permissions.map((p) => ({
            moduleId: p.moduleId,
            permissionBits: p.permissionBits
        })),
        modules: modulesResult.data
    };
};