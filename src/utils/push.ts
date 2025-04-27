
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.error("Push notifications not supported");
        return null;
    }

    const registration = await navigator.serviceWorker.ready;
    let existing = await registration.pushManager.getSubscription();

    if (existing) {
        return existing;
    }

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    return subscription;
}

export async function unsubscribeFromPushNotifications(): Promise<void> {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
        await subscription.unsubscribe();
    }
}

// Helper: convert VAPID public key
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
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