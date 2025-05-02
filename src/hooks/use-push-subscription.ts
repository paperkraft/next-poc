"use client";

import { useSession } from "next-auth/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { cleanUpOldSubscriptions, subscribeToPushNotifications, unsubscribeFromPushNotifications } from "@/utils/push";
import { toast } from "sonner";

export function usePushSubscription() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const [topics, setTopics] = useState<string[]>([]);

    const isSubscribing = useRef(false);
    const hasLoaded = useRef(false);

    const { data: session, status } = useSession();

    const currentUserId = session?.user?.id;
    const getLocalStorageKey = (currentUserId: string) => `pushSubscription_${currentUserId}`;
    // cleanUpOldSubscriptions(currentUserId); // To clear old user keys

    //SECTION - Load existing subscription from browser
    useEffect(() => {
        if (hasLoaded.current || status !== 'authenticated' || !currentUserId) return;
        hasLoaded.current = true;

        const loadSubscription = async () => {

            try {
                setLoading(true);

                if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

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

            } catch (error) {
                console.error("Error loading push subscription:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSubscription();
    }, [status, currentUserId]);

    //SECTION - Send subscription to backend
    const sendSubscriptionToBackend = useCallback(async (sub: PushSubscription, topic?: string | string[]) => {
        await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subscription: sub.toJSON(),
                topics: topic
            }),
        });
    }, []);

    //SECTION - Delete subscription from backend
    const deleteSubscriptionFromBackend = useCallback(async (endpoint: string) => {
        await fetch("/api/notifications/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint }),
        });
    }, []);

    //SECTION - Subscribe for push notification
    const subscribe = useCallback(async (topic: string) => {

        if (!currentUserId || subscription || isSubscribing.current) return;

        isSubscribing.current = true;
        setLoading(true);
        const key = getLocalStorageKey(currentUserId);

        try {

            const newSubscription = await subscribeToPushNotifications();
            if (!newSubscription?.endpoint) {
                throw new Error("No endpoint found");
            }

            setSubscription(newSubscription);

            // const updatedTopics = [...new Set([...topics, ...(Array.isArray(topic) ? topic : [topic])])];
            const updatedTopics = [...new Set([...topics, topic])];
            setTopics(updatedTopics);

            await sendSubscriptionToBackend(newSubscription, updatedTopics);

            toast.success('Subscribed successfully');

            await fetch("/api/notifications/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `Welcome ${session?.user?.name}`,
                    message: "You have subscribe successfully",
                    userId: session?.user?.id
                })
            });

            // Save locally
            localStorage.setItem(
                key,
                JSON.stringify({
                    endpoint: newSubscription.endpoint,
                    userId: currentUserId
                })
            );

        } catch (error) {
            console.error("Subscription error:", error);
            toast.error('Failed to subscribe')
        } finally {
            setLoading(false);
            isSubscribing.current = false;
        }
    }, [currentUserId, subscription, topics, sendSubscriptionToBackend]);

    //SECTION - Unsubscribe for push notification
    const unsubscribe = useCallback(async (topicToRemove?: string) => {
        if (!currentUserId) return;

        const updatedTopics = topics.filter(t => t !== topicToRemove);
        const key = getLocalStorageKey(currentUserId);

        setLoading(true);

        try {
            if (subscription) {
                if (updatedTopics.length === 0) {
                    // No topics left, fully unsubscribe
                    await unsubscribeFromPushNotifications();
                    await deleteSubscriptionFromBackend(subscription.endpoint);
                    localStorage.removeItem(key);
                    setSubscription(null);
                } else {
                    await sendSubscriptionToBackend(subscription!, updatedTopics);
                }
            }
            setTopics(updatedTopics);
            toast.success('Unsubscribed successfully');
        } catch (error) {
            console.error("Failed to unsubscribe from push notifications", error);
            toast.error('Failed to unsubscribe')
        } finally {
            setLoading(false);
        }
    }, [currentUserId, topics, subscription, deleteSubscriptionFromBackend, sendSubscriptionToBackend]);

    //SECTION - Update topic in subscription
    const updateTopic = useCallback(async (endpoint: string, topic: string, action: "subscribe" | "unsubscribe") => {
        await fetch("/api/notifications/topics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint, topic, action }),
        });
    }, []);

    //SECTION - Request notification permission
    const requestPermission = useCallback(async () => {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setPermissionDenied(false);
                    await subscribe("system");
                } else {
                    setPermissionDenied(true);
                }
            } catch (error) {
                console.error('Permission error:', error);
                setPermissionDenied(true);
            }
        }
    }, [subscribe]);

    //SECTION - Export state and functions
    return {
        topics,
        loading,
        permissionDenied,
        subscription,
        requestPermission,
        subscribe,
        unsubscribe,
        updateTopic
    };
}