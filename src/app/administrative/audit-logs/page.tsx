import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import { fetchAuditLogs } from "../../action/audit.action";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";
import AuditLogTable from "./AuditLogTable";
import { findModuleId } from "@/utils/helper";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import NoRecordPage from "@/components/custom/no-record";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
    title: "Audit-log",
    description: "Audit log for recently activities",
};

export default function AuditLog() {
    return (
        <Suspense fallback={<Loading />}>
            <AuditLogContent />
        </Suspense>
    );
}

async function AuditLogContent() {
    const session = await auth();
    const hasAccess = session && hasPermission(+session?.user?.permissions, 15);
    const moduleId = session && findModuleId(session?.user?.modules, "Audit Logs");

    if (!hasAccess) {
        return (<AccessDenied />)
    }

    const { success, data, message } = await fetchAuditLogs().then((res) => res.json());

    return (
        <>
            <TitlePage title="Audit Log" description="Audit log for user activities" />
            {success ?
                data.length === 0
                    ? <NoRecordPage text="audit logs" />
                    : <AuditLogTable data={data} moduleId={moduleId as string} />
                : <SomethingWentWrong message={message} />
            }
        </>
    );
}