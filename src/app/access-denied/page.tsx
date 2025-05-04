import { Metadata } from 'next';

import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export const metadata: Metadata = {
    title: "Access Denied",
    description: "Cannot access",
};

export default async function Page() {
    const session = await auth();
    return (
        <>
            <AccessDenied session={session}/>
        </>
    );
}