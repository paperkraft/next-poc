'use client';
import { useEffect, useState } from 'react';
import { handleNotificationPermission, isNotificationSupported, registerServiceWorkerAndSubscribe } from '@/push';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AllowNotification() {
    const [unsupported, setUnsupported] = useState<boolean>(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        const isUnsupported = !isNotificationSupported();
        setUnsupported(isUnsupported);
        if (!isUnsupported) {
            handleNotificationPermission(setSubscription);
        }
    }, []);

    return (
        <div>
            <Button className={cn({ 'hidden': subscription })} disabled={unsupported} onClick={() => registerServiceWorkerAndSubscribe(setSubscription)}>
                {unsupported
                    ? 'Notification Unsupported'
                    : subscription
                        ? 'Notification allowed'
                        : 'Allow notification'}
            </Button>
        </div>
    );
}