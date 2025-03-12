"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
    updateNotifications: (newNotifications: INotifications[]) => void;
    setUnreadCount: (newCount: number) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<INotifications[]>([]);
    const [count, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        if (!session) return;
        const eventSource = new EventSource('/api/notifications/stream');
        
        const handleNewMessage = (event: MessageEvent) => {
            try {
                const newNotifications: INotifications[] = JSON.parse(event.data);
                setNotifications(newNotifications);
                setUnreadCount(newNotifications.length);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onmessage = handleNewMessage;

        eventSource.onerror = () => {
            console.error('SSE connection failed');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [session]);


    // Function to handle updates when notifications are updated from the API
    const updateNotifications = (newNotifications: INotifications[]) => {
        setNotifications(newNotifications);
        setUnreadCount(newNotifications?.length);
    };

    const value = {
        notifications,
        count,
        updateNotifications,
        setUnreadCount,
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
