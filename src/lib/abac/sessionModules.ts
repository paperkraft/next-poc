import { auth } from '@/auth';
import { ModuleNode } from '@/types/modules';
import { Session } from 'next-auth';

type SessionModules = {
    modules: ModuleNode[];
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