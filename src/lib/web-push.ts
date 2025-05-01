import webpush from 'web-push';

const VAPID_EMAIL = 'mailto:mail@example.com';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
    VAPID_EMAIL,
    VAPID_PUBLIC_KEY!,
    VAPID_PRIVATE_KEY!
);

export async function sendWebPushNotification({
    subscription,
    title,
    body,
}: {
    subscription: any;
    title: string;
    body: string;
}) {
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: title ?? 'You have a new notification',
                body,
                icon: '/sv.svg',
                badge: '/sv.svg',
                url: '/',
            })
        );
    } catch (error: any) {
        console.error("❌ Web push failed:", error?.statusCode, error?.body || error.message);

        // Optionally: handle 410 (Gone) or 404 to remove stale subscriptions
        if (error?.statusCode === 410 || error?.statusCode === 404) {
            console.warn("🧹 Subscription is no longer valid, should be removed.");
        }
    }
}