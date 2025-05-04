import { Metadata } from 'next';
import { Suspense } from 'react';

import Loading from '@/app/loading';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleId } from '@/utils/helper';

import { fetchAuditLogs } from '../../action/audit.action';
import AuditLogTable from './AuditLogTable';

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

    try {
        const { session, modules } = await getSessionModules();
        if (!session) return <AccessDenied />;

        const hasPermission = can({
            action: "READ",
            name: "Audit Logs",
            modules,
        });

        if (!hasPermission) return <AccessDenied />;
        const moduleId = findModuleId(modules, "Audit Logs");
        const { success, data, message } = await fetchAuditLogs().then((res) => res.json());
        return (
            <>
                <TitlePage
                    title="Audit Log"
                    description="Audit log for user activities"
                />

                {success ?
                    data.length > 0
                        ? <AuditLogTable data={data} moduleId={moduleId} />
                        : <NoRecordPage text="audit logs" />
                    : <SomethingWentWrong message={message} />
                }
            </>
        );

    } catch (error) {
        return (
            <>
                <TitlePage
                    title="Audit Log"
                    description="Audit log for user activities"
                />
            </>
        )
    }






}