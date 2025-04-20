import { Metadata } from 'next';
import { Suspense } from 'react';

import Loading from '@/app/loading';
import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';
import NoRecordPage from '@/components/custom/no-record';
import TitlePage from '@/components/custom/page-heading';
import SomethingWentWrong from '@/components/custom/somthing-wrong';
import { canAll } from '@/lib/abac/checkPermissions';
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
    const session = await auth();
    const moduleId = session && findModuleId(session?.user?.modules, "Audit Logs");

    const canAccessAll = canAll({
        action: "ALL",
        name: "Audit Logs",
        modules: session?.user?.modules,
    });

    if (!canAccessAll) {
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