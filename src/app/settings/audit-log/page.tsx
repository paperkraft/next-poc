import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import { fetchAuditLogs } from "../../action/audit.action";
import AuditLogTable from "./AuditLogTable";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";

export const metadata: Metadata = {
    title: "Audit-log",
    description: "Audit log for recently activities",
};

export default async function Page() {
    const session = await auth();
    const rolePermissions = +session?.user?.permissions;
    const permission = hasPermission(rolePermissions, 15);
    const data = await fetchAuditLogs().then((res) => res.json());

    if (!permission) {
        return <AccessDenied />;
    }

    return (
        <>
            <TitlePage title={"Audit Log"} description={"Audit log for users activities"} />
            <AuditLogTable data={data.data} />
        </>
    )
}