import { logAuditAction } from "@/lib/audit-log";

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, username } = body;

    try {
        await logAuditAction({
            action: 'LOGOUT',
            entity: 'auth/signout',
            details: { data: { user: username } },
            userId,
        });

        return new Response('Logged', { status: 200 });
    } catch (error) {
        console.error('Logging failed:', error);
        return new Response('Error', { status: 500 });
    }
}
