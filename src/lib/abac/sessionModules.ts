import { auth } from '@/auth';
import { IModule } from '@/types/permissions';
import { Session } from 'next-auth';

type SessionModules = {
    modules: IModule[];
    session: Session | null;
}

// Server-side: This function is used to get the session modules on the server side
export async function getSessionModules(): Promise<SessionModules> {
    const session = await auth();
    if (!session) {
        return {
            modules: [],
            session: null,
        };
    }
    return {
        modules: session.user.modules || [],
        session,
    }
}