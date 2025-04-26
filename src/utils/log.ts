import { Session } from "next-auth";

export function logAccessDenied(session: Session | null, path: string) {
    console.warn(`[ACCESS DENIED] User: ${session?.user?.email || 'Unknown'} tried to access ${path}`);
    // (optional) If you want: Save to a logging API/database here
}
  