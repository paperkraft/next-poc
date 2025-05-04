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
    });

    if (!user) {
        return null;
    }

    const hasPwd = await verifyPassword({
        plainPassword: password,
        hashPassword: user.password ?? ""
    });

    if (!hasPwd) {
        await logAuditAction("Error", "auth/signin", { data: { error: "Invalid credentials" } });
        return null;
    }

    await logAuditAction("login", "auth/signin", { data: `${user.firstName} ${user.lastName}` }, user.id);

    // Fetch ABAC modules using the role ID
    const moduleResponse = await fetchModuleByRole(user.roleId);
    const modulesResult = await moduleResponse.json();

    return {
        id: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.email,
        roleId: user.roleId,
        modules: modulesResult.data
    };
};

export const getAllUser = async () => {

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });

        const allUser = users.map((u) => {
            return {
                id: u.id,
                name: u?.firstName ?? "" + u?.lastName
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