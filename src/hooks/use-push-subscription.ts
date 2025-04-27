"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cleanUpOldSubscriptions, subscribeToPushNotifications, unsubscribeFromPushNotifications } from "@/utils/push";
import { useSession } from "next-auth/react";

export function usePushSubscription() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const isSubscribing = useRef(false);
    const hasLoaded = useRef(false);
    const { data: session, status } = useSession();

    const currentUserId = session?.user?.id;
    const getLocalStorageKey = (currentUserId: string) => `pushSubscription_${currentUserId}`;
    // cleanUpOldSubscriptions(currentUserId); // To clear old user keys

    // Load existing subscription from browser
    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        if (status === 'loading') return;

        const loadSubscription = async () => {

            setLoading(true);

            if ("serviceWorker" in navigator && "PushManager" in window) {
                const registration = await navigator.serviceWorker.ready;
                const existing = await registration.pushManager.getSubscription();

                const key = getLocalStorageKey(currentUserId);
                const localData = JSON.parse(localStorage.getItem(key) || "{}");

                // Check if notifications are allowed
                if (Notification.permission === "granted") {
                    if (existing) {

                        const isSameUser = localData?.userId === currentUserId;
                        const isSameEndpoint = localData?.endpoint === existing.endpoint;

                        if (isSameUser && isSameEndpoint) {
                            setSubscription(existing);
                        } else {
                            // Doesn't match
                            await unsubscribe();
                        }

                    } else {
                        // If no subscription exists
                        setSubscription(null);
                    }
                } else if (Notification.permission === "denied") {
                    // If notifications are denied, set permissionDenied to true
                    setPermissionDenied(true);
                } else {
                    // If permission is not yet determined, we can request it
                    await requestPermission();
                }
            }

            setLoading(false);
        };

        loadSubscription();
    }, [status]);

    const sendSubscriptionToBackend = useCallback(async (sub: PushSubscription, topic?: string) => {

        const response = await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subscription: sub.toJSON(),
                topic: topic ?? "system"
            }),
        });

        if (!response.ok) {
            console.error("Failed to send subscription to backend");
        }
    }, []);

    const deleteSubscriptionFromBackend = useCallback(async (endpoint: string) => {
        await fetch("/api/notifications/subscribe", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ endpoint }),
        });

    }, []);

    const subscribe = useCallback(async (topic?: string) => {

        if (subscription || isSubscribing.current) return;
        isSubscribing.current = true;

        try {
            setLoading(true);
            const key = getLocalStorageKey(currentUserId);

            const newSubscription = await subscribeToPushNotifications();
            if (!newSubscription?.endpoint) {
                throw new Error("No endpoint found");
            }

            setSubscription(newSubscription);
            await sendSubscriptionToBackend(newSubscription, topic);

            // Save locally
            localStorage.setItem(
                key,
                JSON.stringify({ endpoint: newSubscription.endpoint, userId: currentUserId })
            );

        } catch (error) {
            console.error("Subscription error:", error);
        } finally {
            setLoading(false);
            isSubscribing.current = false;
        }
    }, [sendSubscriptionToBackend]);

    const unsubscribe = useCallback(async () => {
        try {
            setLoading(true);
            const key = getLocalStorageKey(currentUserId);

            if (subscription) {
                await unsubscribeFromPushNotifications();
                await deleteSubscriptionFromBackend(subscription.endpoint);
                localStorage.removeItem(key);
                setSubscription(null);
            }
        } catch (error) {
            console.error("Failed to unsubscribe from push notifications", error);
        } finally {
            setLoading(false);
        }
    }, [subscription, deleteSubscriptionFromBackend]);

    // Function to request notification permission from the user
    const requestPermission = useCallback(async () => {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                console.log('permission', permission);

                if (permission === 'granted') {
                    setPermissionDenied(false);
                    await subscribe();
                } else {
                    setPermissionDenied(true);
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
                setPermissionDenied(true);
            }
        }
    }, [subscribe]);

    return {
        loading,
        permissionDenied,
        subscription,
        requestPermission,
        subscribe,
        unsubscribe,
    };
}
