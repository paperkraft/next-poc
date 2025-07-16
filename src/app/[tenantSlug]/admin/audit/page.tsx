import { fetchAuditLogs } from "@/app/actions/audit.action";
import AuditLogUI from "./audit-log-ui";
import TitlePage from "@/components/custom/page-heading";

export const metadata = {
    title: "Audit-log",
    description: "Track all system activities and changes.",
};

export default async function Page() {
    const data = await fetchAuditLogs();
    const res = await data.json();
    return (
        <>
            <TitlePage {...metadata} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="container mx-auto p-6">
                    <AuditLogUI data={res?.data} />
                </div>
            </div>
        </>
    );
}