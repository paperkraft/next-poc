import { headers } from 'next/headers';
import { Suspense } from 'react';

import Loading from '@/app/loading';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { can } from '@/lib/abac/checkPermissions';
import { getSessionModules } from '@/lib/abac/sessionModules';
import { findModuleIdByPath } from '@/utils/helper';

import { fetchAuditLogs } from '../../action/audit.action';
import AuditLogTable from './AuditLogTable';

export const metadata = {
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
    const headersList = headers();
    const currentPath = headersList.get('x-current-path') || '';

    try {
        const { session, modules } = await getSessionModules();
        if (!session) return <AccessDenied />;

        const hasPermission = can({
            action: "READ",
            path: currentPath,
            modules,
        });

        if (!hasPermission) return <AccessDenied />;
        const moduleId = findModuleIdByPath(modules, currentPath);

        const { success, data, message } = await fetchAuditLogs().then((res) => res.json());

        return (
            <>
                <TitlePage {...metadata} />

                {!success ? (
                    <SomethingWentWrong message={message} />
                ) : data.length ? (
                    <AuditLogTable data={data} moduleId={moduleId} />
                ) : (
                    <NoRecordPage text="audit logs" />
                )}
            </>
        );

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('AuditLogPage Error:', error);
        }
        return (
            <>
                <TitlePage {...metadata} />
                <SomethingWentWrong message="An unexpected error occurred." />
            </>
        )
    }






}