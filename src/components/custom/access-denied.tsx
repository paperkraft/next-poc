'use client'
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

export default function AccessDenied({ session }: { session?: Session | null }) {
    const router = useRouter();
    const mounted = useMounted();
    if (!mounted) return null
    return (
        <div className={cn("flex flex-col gap-2 items-center justify-center p-6 bg-accent rounded-md h-[calc(100svh-100px)]", { "h-screen": session })}>
            <div className="max-w-md space-y-4 text-center">
                <h1 className="text-xl font-semibold tracking-tight sm:text-4xl">Access Denied</h1>
                <p className="text-muted-foreground">
                    Sorry, you do not have the necessary permission to access this page.
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
    );
}