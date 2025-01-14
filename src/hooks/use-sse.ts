import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export interface Notification {
    id: string;
    message: string;
    userId: string | null;
    status: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function useSSE() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [count, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        if (!session) return;
        const eventSource = new EventSource('/api/notifications/stream');
        const handleNewMessage = (event: MessageEvent) => {
            try {
                const newNotifications: Notification[] = JSON.parse(event.data);
                setNotifications(newNotifications);
                setUnreadCount(newNotifications?.length);
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

    // Function to handle updates when notifications are fetched from the API
    const updateNotifications = (newNotifications: Notification[]) => {
        setNotifications(newNotifications);
        setUnreadCount(newNotifications?.length);
    };

    return { notifications, setNotifications: updateNotifications, count, setUnreadCount };
}