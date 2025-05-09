"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePushSubscription } from "@/hooks/use-push-subscription";
export interface INotifications {
    id: string;
    message: string;
    userId: string | null;
    status: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface NotificationsContextType {
    notifications: INotifications[];
    count: number;
    subscribedTopics: string[];
    updateNotifications: (newNotifications: INotifications[]) => void;
    setUnreadCount: (newCount: number) => void;
    setSubscribedTopics: Dispatch<SetStateAction<string[]>>;

    // Push Notifications
    loading: boolean;
    subscription: PushSubscription | null;
    permissionDenied: boolean;
    subscribe: (topic: string) => Promise<void>;
    unsubscribe: () => void;
    updateTopic: (endpoint: string, topic: string, action: "subscribe" | "unsubscribe") => void;
    requestPermission: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<INotifications[]>([]);
    const [count, setUnreadCount] = useState<number>(-1);

    const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);

    const {
        loading,
        subscription,
        permissionDenied,
        subscribe,
        unsubscribe,
        updateTopic,
        requestPermission,
    } = usePushSubscription();

    useEffect(() => {
        if (!session) return;

        // Event source for notifications
        const eventSource = new EventSource('/api/notifications/stream');

        eventSource.onmessage = (event: MessageEvent) => {
            try {
                const newNotifications: INotifications[] = JSON.parse(event.data);
                setNotifications(newNotifications);
                setUnreadCount(newNotifications.length);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = () => {
            console.error('SSE connection failed');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [session]);

    useEffect(() => {
        if (!subscription) return;

        const controller = new AbortController();

        async function fetchTopics() {
            try {
                const endpoint = subscription?.endpoint;
                const currentTopics = await getCurrentSubscriptionTopics(endpoint as string);
                setSubscribedTopics(currentTopics);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            }
        }

        fetchTopics();

        return () => {
            controller.abort(); // cleanup
        }
    }, [subscription]);

    // Function to handle updates when notifications are updated from the API
    const updateNotifications = (newNotifications: INotifications[]) => {
        setNotifications(newNotifications);
        setUnreadCount(newNotifications?.length);
    };

    const value = {
        count,
        notifications,
        subscribedTopics,
        setUnreadCount,
        setSubscribedTopics,
        updateNotifications,

        // Push Notifications

        loading,
        subscription,
        permissionDenied,
        subscribe,
        unsubscribe,
        updateTopic,
        requestPermission,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

// Custom hook to use notifications context
export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};

async function getCurrentSubscriptionTopics(endpoint: string) {
    if (!endpoint) return [];

    const response = await fetch(`/api/notifications/topics/endpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint })
    });
    const result = await response.json();
    return result.data || [];
}