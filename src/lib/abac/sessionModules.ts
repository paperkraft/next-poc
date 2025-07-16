import { auth } from '@/auth';
import { Session } from 'next-auth';
import { GroupedMenus } from '../menus';

type SessionModules = {
    modules: GroupedMenus[];
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