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

export const metadata: Metadata = {
    title: "Audit-log",
    description: "Audit log for recently activities",
};

export default async function AuditLog() {
    try {
        const session = await auth();
        const hasAccess = session && hasPermission(+session?.user?.permissions, 15);
        const moduleId = session && findModuleId(session?.user?.modules, "Audit Logs");
        const response = await fetchAuditLogs().then((res) => res.json());

        if (!hasAccess) {
            return (
                <>
                    <TitlePage title={"Audit Log"} description={"Audit log for users activities"} />
                    <AccessDenied />
                </>
            )
        }

        const renderContent = () => {
            if (!response.success) {
                return <SomethingWentWrong message={response.message} />;
            }

            if (response.data.length === 0) {
                return <NoRecordPage text="audit logs" />;
            }

            return <AuditLogTable data={response.data} moduleId={moduleId as string} />;
        };

        return (
            <>
                <TitlePage title="Audit Log" description="Audit log for user activities" />
                {renderContent()}
            </>
        );
    } catch (error) {
        return (
            <>
                <TitlePage title="Audit Log" description="Audit log for user activities" />
                <SomethingWentWrong message="An unexpected error occurred." />
            </>
        )
    }
}