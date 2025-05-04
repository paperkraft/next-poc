import { auth } from '@/auth';
import AccessDenied from '@/components/custom/access-denied';

export default async function Page() {
    const session = await auth();
    return (
        <>
            <AccessDenied session={session}/>
        </>
    );
}