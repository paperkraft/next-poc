'use client';

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { INotifications, useNotifications } from "@/context/notification-context";

interface NotificationsListProps {
    initialNotifications: INotifications[];
}

export default function NotificationsList({ initialNotifications }: NotificationsListProps) {

    const route = useRouter();
    
    const { updateNotifications, notifications } = useNotifications();

    const [filterNotifications, setFilterNotifications] = useState<INotifications[]>(initialNotifications);
    const [unread, setUnread] = useState<INotifications[]>(initialNotifications.filter((n) => !n.read));

    useEffect(() => {
        if (notifications) {
            // local update
            const ids = notifications.map((n) => n.id)
            const filtered = initialNotifications.map((n) => !ids.includes(n.id) ? { ...n, read: true } : n);
            setFilterNotifications(filtered)
        }
    }, [notifications]);

    // Handler for marking notifications as read
    const handleMarkAsRead = useCallback(async (notificationIds?: string) => {
        const idsToMark = notificationIds ? [notificationIds] : unread.map((n: INotifications) => n.id);

        if (idsToMark.length === 0) return;

        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                body: JSON.stringify({ notificationIds: idsToMark }),
            });

            const result = await res.json();

            if (result.success) {
                toast.success(notificationIds ? 'Marked as read' : 'Marked all as read');

                const filterNotify = filterNotifications.map((n) => (idsToMark.includes(n.id) ? { ...n, read: true } : n))
                setUnread(filterNotify.filter((n) => !n.read));

                // context update
                const updatedNotifications = notifications.filter((n) => !idsToMark.includes(n.id));
                updateNotifications(updatedNotifications);

                //local update
                setFilterNotifications(filterNotify);
            }

        } catch (error) {
            console.error('Error in marking notifications as read', error);
        } finally {
            route.refresh();
        }
    }, [route, notifications, filterNotifications, updateNotifications]);

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