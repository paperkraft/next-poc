'use client';
import { useEffect, useState } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, X } from 'lucide-react';
import { urlBase64ToUint8Array } from '@/utils';
import Link from 'next/link';

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

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });

            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);

            if (sub && checkSubscription(sub)) {
                return
            } else {
                console.log('Update');
                setSubscription(null);
            }
        } catch (error) {
            console.error("Error registering service worker", error);
            setSubscription(null);
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
                        console.log('granted');
                        const isCheck = subscription && checkSubscription(subscription);
                        if (!isCheck) setSubscription(null)
                    } else {
                        setNotificationDenied(true);
                        console.log('denied');
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

    if (subscription) {
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
                            {/* <Button variant='outline' size='sm' onClick={() => subscribeToPush()}>Subscribe</Button> */}
                            Go to Notification setting <Link href={'/profile-settings/notifications?sub=false'} className='hover:text-blue-400'> click here</Link>
                        </AlertDescription>
                    </Alert>
                </>
            )}
        </div>
    );
}

export async function subscribeToPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });

        if (sub && checkSubscription(sub)) {
            console.log('Exist Push Subscription');
            return
        } else {
            console.log('Update Push Subscription');
        }

        localStorage.setItem('push-subscription', JSON.stringify(sub));
        const serializedSub = JSON.parse(JSON.stringify(sub));
        await subscribeUser(serializedSub);
    } catch (error) {
        console.error("Error subscribing to push notifications:", error);
    }
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

function checkSubscription(current: PushSubscription): Boolean {
    const storedSubscription = localStorage.getItem("push-subscription")
    if (storedSubscription) {
        const stored: PushSubscription = JSON.parse(storedSubscription);
        return current.endpoint === stored.endpoint
    } else {
        return false
    }
}