'use client';

import { Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logAuditViaBeacon = () => {
        const payload = JSON.stringify({
            action: 'LOGOUT',
            entity: 'auth/signout',
            details: {},
        });

        navigator.sendBeacon('/api/auth/logout', payload);
    };

    const handleConfirm = async () => {
        onOpenChange(false);
        setIsLoggingOut(true);

        try {
            // Send audit log in background
            logAuditViaBeacon();

            // Sign out without redirect
            await signOut();

            // Fast redirect
            router.replace('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
            router.replace('/signin');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Logging out</DialogTitle>
                    <DialogDescription>
                        You are logging out from the system...
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleConfirm}>
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Logging out...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoggingOut}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
