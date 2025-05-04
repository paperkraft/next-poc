import { VAPID_PUBLIC_KEY } from "@/constants";
import { urlBase64ToUint8Array } from ".";

export function isNotificationSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'showNotification' in ServiceWorkerRegistration.prototype;
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.error("Push notifications not supported");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
        });
    
        return subscription;

    } catch (error) {
        console.error('Push subscription failed:', error);
        return null
    }
}

export async function unsubscribeFromPushNotifications(): Promise<void> {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if(!subscription) return
    await subscription.unsubscribe();
}

// Remove all pushSubscription_* keys not matching the current user
export const cleanUpOldSubscriptions = (currentUserId: string) => {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("pushSubscription_")) {
            const keyUserId = key.replace("pushSubscription_", "");
            if (keyUserId !== currentUserId) {
                localStorage.removeItem(key);
            }
        }
    });
};