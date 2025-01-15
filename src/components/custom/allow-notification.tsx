'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, X } from 'lucide-react';
import { urlBase64ToUint8Array } from '@/utils';

export default function AllowNotification() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [notificationDenied, setNotificationDenied] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])


    function checkExistSubscription(current: PushSubscription, stored: PushSubscription): Boolean {
        return current.endpoint === stored.endpoint
    }

    async function registerServiceWorker() {
        try {
            const storedSubscription = localStorage.getItem('push-subscription');
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });

            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);

            if (storedSubscription) {
                const parsedstoredSubscription: PushSubscription = JSON.parse(storedSubscription);

                if (sub && checkExistSubscription(sub, parsedstoredSubscription)) {
                    return
                } else {
                    console.log('Update');
                    setSubscription(null);
                }
            } else {
                setSubscription(null);
            }
        } catch (error) {
            console.error("Error registering service worker", error);
        }
    }

    async function subscribeToPush() {
        try {
            const storedSubscription = localStorage.getItem('push-subscription');
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
            });

            if (storedSubscription) {
                const parsedstoredSubscription: PushSubscription = JSON.parse(storedSubscription);

                if (sub && checkExistSubscription(sub, parsedstoredSubscription)) {
                    console.log('Exist Push Subscription');
                    return
                } else {
                    console.log('Update Push Subscription');
                    localStorage.setItem('push-subscription', JSON.stringify(sub));
                    setSubscription(sub);
                    const serializedSub = JSON.parse(JSON.stringify(sub));
                    await subscribeUser(serializedSub);
                }
            } else {
                console.log('New Push Subscription');
                localStorage.setItem('push-subscription', JSON.stringify(sub));
                setSubscription(sub);
                const serializedSub = JSON.parse(JSON.stringify(sub));
                await subscribeUser(serializedSub);
            }
        } catch (error) {
            console.error("Error subscribing to push notifications:", error);
        }
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        // await unsubscribeUser()
    }

    useEffect(() => {
        const requestNotificationPermission = async () => {
            if ('Notification' in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setNotificationDenied(false);
                    } else {
                        setNotificationDenied(true);
                    }
                } catch (error) {
                    console.error('Error requesting notification permission:', error);
                    setNotificationDenied(true);
                }
            }
        };
        requestNotificationPermission();
    }, []);

    if (!isSupported) {
        return (
            <Alert variant="destructive">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Push notifications are not supported in this browser.
                </AlertDescription>
            </Alert>
        )
    }

    if(subscription){
        return null
    }

    return (
        <div>
            {notificationDenied && (
                <Alert variant="default" className='bg-yellow-50 border border-yellow-300 text-yellow-900 dark:bg-yellow-50/5 dark:border-accent dark:text-yellow-600'>
                    <AlertCircleIcon className="size-4 !text-inherit" />
                    <AlertTitle className='flex'>
                        It looks like you denied notifications.
                        <X className='size-4 ml-auto cursor-pointer' onClick={() => setNotificationDenied(false)} />
                    </AlertTitle>
                    <AlertDescription>
                        <ul className='space-y-1'>
                            <li className='flex items-center gap-1'>Click the <InfoCircledIcon /> icon in your browser's address bar</li>
                            <li>Go to "Notifications" settings</li>
                            <li>Select "Allow" to enable notifications</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {!subscription && !notificationDenied && (
                <>
                    <Alert variant="default" className='bg-yellow-50 border border-yellow-300 text-yellow-900 dark:bg-yellow-50/5 dark:border-accent dark:text-yellow-600'>
                        <AlertCircleIcon className="size-4 !text-inherit" />
                        <AlertTitle>You are not subscribed to push notifications.</AlertTitle>
                        <AlertDescription className='space-y-2'>
                            <Button variant='outline' size='sm' onClick={() => subscribeToPush()}>Subscribe</Button>
                        </AlertDescription>
                    </Alert>
                </>
            )}
        </div>
    );
}


async function subscribeUser(subscription: PushSubscription) {
    try {
        const response = await fetch('/api/web-push/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
        });

        const result = await response.json();
        console.log('Subscription saved:', result);
        return { success: true }
    } catch (error) {
        console.error('Failed to save subscription:', error);
    }
} 