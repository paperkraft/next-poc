import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function TenantRootPage({ params }: { params: { tenantSlug: string } }) {
    // First validate the tenant slug
    const session = await auth();

    if (!session) {
        redirect('/signin')
    }

    if (session.user?.slug !== params.tenantSlug) {
        redirect(`/${session.user?.slug}/dashboard`)
    }

    // If everything is valid, redirect to dashboard
    redirect(`/${params.tenantSlug}/dashboard`)
}