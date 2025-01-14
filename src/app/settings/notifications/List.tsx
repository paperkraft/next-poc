'use client'
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Notifications } from "./page";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useSSE from "@/hooks/use-sse";
import { useRouter } from "next/navigation";

interface NotificationsListProps {
    initialNotifications: Notifications[];
}

export default function NotificationsList({ initialNotifications }: NotificationsListProps) {

    const [filterNotifications, setFilterNotifications] = useState<Notifications[]>(initialNotifications);
    const [unread, setUnread] = useState<Notifications[]>(initialNotifications.filter((n) => !n.read));

    const route = useRouter();

    const { setNotifications, notifications } = useSSE();


    useEffect(() => {
        if (notifications) {
            const ids = notifications.map((n) => n.id)
            const filtered = initialNotifications.map((n) => !ids.includes(n.id) ? { ...n, read: true } : n);
            console.log('sse notifications', notifications);
            console.log('sse filter', filtered);
            setFilterNotifications(filtered)
        }
    }, [notifications, initialNotifications]);


    useEffect(() => {
        if (unread) {
            setNotifications(unread);
        }
    }, [unread]);

    // Handler for marking notifications as read
    const handleMarkAsRead = useCallback(async (notificationIds?: string) => {
        const idsToMark = notificationIds ? [notificationIds] : unread.map((n: Notifications) => n.id);

        if (idsToMark.length === 0) return;

        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                body: JSON.stringify({ notificationIds: idsToMark }),
            });

            const result = await res.json();

            if (result.success) {
                toast.success(notificationIds ? 'Marked as read' : 'Marked all as read');
                // const updatedNotifications = unread.filter((notification: Notifications) => !idsToMark.includes(notification.id));
                const filterNotify = initialNotifications.map((n) => (idsToMark.includes(n.id) ? { ...n, read: true } : n))
                setUnread(filterNotify.filter((n) => !n.read));
                //localstate
                console.log('filterNotify', filterNotify);
                setFilterNotifications(filterNotify)
            }

        } catch (error) {
            console.error('Error in marking notifications as read', error);
        } finally {
            route.refresh();
        }
    }, [route]);

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                {unread?.length > 0 && (
                    <Button variant={'ghost'} className='text-muted-foreground hover:text-blue-600 ml-auto' onClick={() => handleMarkAsRead()}>
                        <CheckCheckIcon className='size-4 mr-1' /> Mark all as read
                    </Button>
                )}
            </div>

            <ScrollArea className={cn({ "h-[calc(100vh-250px)]": initialNotifications?.length > 0 })}>
                <ul className="space-y-2">
                    {filterNotifications?.map((notification) => (
                        <li key={notification.id} className={cn("hover:bg-gray-50 rounded", { "bg-gray-50": !notification.read })}>
                            <Link href="#" className='w-full'>
                                <div className='p-2'>
                                    <div className={cn("flex gap-1 max-h-10 overflow-hidden text-[14px] text-balance", { "font-semibold": !notification.read })}>
                                        {!notification.read && <div className='bg-blue-500 rounded-full size-2 mt-1 shrink-0'></div>}
                                        {notification.message}
                                    </div>
                                    <div className='flex mt-1'>
                                        <small className='text-muted-foreground'>
                                            {new Date(notification.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour12: true, hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                        <small className='hover:text-blue-500 ml-auto' onClick={() => handleMarkAsRead(notification.id)}>
                                            {!notification.read && "Mark as read"}
                                        </small>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );
}