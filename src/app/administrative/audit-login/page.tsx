import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";
import LoginSessionTable from "./LoginSessionTable";

export const metadata: Metadata = {
    title: "Login-audit-log",
    description: "Audit log for recently login",
};

export default async function LoginAudit() {
    const session = await auth();
    const rolePermissions = +session?.user?.permissions;
    const permission = hasPermission(rolePermissions, 15);

    if (!permission) {
        return <AccessDenied />;
    }
    return (
        <>
            <TitlePage title={"Login Audit"} description={"Audit log for users login"} />
            <LoginSessionTable />
        </>
    )
}