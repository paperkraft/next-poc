import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function useSSE() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (!session) return;
        const eventSource = new EventSource('/api/notifications/stream');
        const handleNewMessage = (event: MessageEvent) => {
            try {
                const newNotifications: Notification[] = JSON.parse(event.data);

                // setNotifications((prev) => {
                //     const ids = new Set(prev.map((notif) => notif.id));
                //     const uniqueNotifications = newNotifications.filter((notif) => !ids.has(notif.id));
                //     return [...uniqueNotifications, ...prev];
                // });

                setNotifications(newNotifications);
                setCount(newNotifications.length);
                
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

    return { notifications, setNotifications, count, setCount };
}