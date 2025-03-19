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

            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            const sub = await registration.pushManager.getSubscription();

            if (sub && checkSubscription(sub)) {
                setSubscription(sub);
            } else {
                setSubscription(null);
            }
        } catch (error) {
            console.error("Error registering service worker", error);
            setSubscription(null);
        }
    }

    useEffect(() => {
        async function requestNotificationPermission() {
            if ('Notification' in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setNotificationDenied(false);
                        if (!subscription || !checkSubscription(subscription)) {
                            setSubscription(null);
                            await subscribeToPush();
                        }
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

    if (subscription) {
        return null
    }

    return (
        <>
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
                            Go to Notification setting <Link href={'/profile-settings/notifications?sub=false'} className='hover:text-blue-400'> click here</Link>
                        </AlertDescription>
                    </Alert>
                </>
            )}
        </>
    );
}

export async function subscribeToPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });

        localStorage.setItem('push-subscription', JSON.stringify(sub));
        const serializedSub = JSON.parse(JSON.stringify(sub));
        await subscribeUser(serializedSub);
    } catch (error) {
        console.error("Error subscribing to push notifications:", error);
    }
}

export async function unsubscribeFromPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            localStorage.removeItem('push-subscription');
            console.log("Unsubscribed from push notifications");
        }
    } catch (error) {
        console.error("Error unsubscribing from push notifications:", error);
    }
}

async function subscribeUser(subscription: PushSubscription) {
    try {
        const response = await fetch('/api/web-push/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
        });

        await response.json();
        return { success: true }
    } catch (error) {
        console.error('Failed to save subscription:', error);
    }
}

function checkSubscription(current: PushSubscription): boolean {
    try {
        const storedSubscription = localStorage.getItem("push-subscription");
        if (!storedSubscription) return false;

        const parsedSubscription: PushSubscriptionJSON = JSON.parse(storedSubscription);
        return current.endpoint === parsedSubscription.endpoint;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
}
