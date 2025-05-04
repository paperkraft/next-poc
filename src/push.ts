const SERVICE_WORKER_FILE_PATH = './sw.js';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const API_URLS = {
    subscription: '/api/web-push/subscription',
    sendPush: '/api/web-push/send',
    sendToTopic: '/api/web-push/send-to-topic',
};

export function isNotificationSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'showNotification' in ServiceWorkerRegistration.prototype;
}

export function handleNotificationPermission(onSubscribe: (subs: PushSubscription | null) => void): void {
    const permission = Notification.permission;
    if (permission === 'granted') {
        registerServiceWorkerAndSubscribe(onSubscribe);
    }
}

async function subscribeToPushNotifications(onSubscribe: (subs: PushSubscription | null) => void) {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: VAPID_PUBLIC_KEY,
        });

        console.info('Created subscription: ', subscription.toJSON());
        await submitSubscription(subscription);
        onSubscribe(subscription);

    } catch (error) {
        console.error('Push subscription failed:', error);
    }
}

async function submitSubscription(subscription: PushSubscription) {
    try {
        const response = await fetch(API_URLS.subscription, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
        });

        const result = await response.json();
        console.log('Subscription submitted:', result);
    } catch (error) {
        console.error('Failed to submit subscription:', error);
    }
}

export async function registerServiceWorkerAndSubscribe(onSubscribe: (subs: PushSubscription | null) => void) {
    try {
        await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
        await subscribeToPushNotifications(onSubscribe);
    } catch (error) {
        console.error('Service Worker registration failed:', error);
    }
}

interface NotificationProps {
    message: string | null,
    topic?: string,
    userId?: string
}

export async function sendWebPushNotification({ message, userId, topic }: NotificationProps) {
    try {
        const pushBody = {
            title: 'SV',
            body: message ?? 'Welcome to Demo App',
            // image: '/sv.svg',
            icon: '/sv.svg',
            badge: '/sv.svg',
            url: '/',
            userId,
            topic,
        };

        const apiUrl = topic ? API_URLS.sendToTopic : API_URLS.sendPush;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pushBody),
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Failed to send push notification:', error);
    }
}