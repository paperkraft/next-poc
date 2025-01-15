'use client';

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { INotifications, useNotifications } from "@/context/notification-context";
import { useSession } from "next-auth/react";

export default function NotificationsList() {

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { updateNotifications, notifications } = useNotifications();

    const [filterNotifications, setFilterNotifications] = useState<INotifications[]>([]);
    const [unread, setUnread] = useState<INotifications[]>([]);

    useEffect(() => {
        const fetchNotifications = async (userId: string) => {
            try {
                const res = await fetch(`/api/notifications?userId=${userId}`);
                const result = await res.json();
                if (result.success) {
                    const data: INotifications[] = result.data;
                    setFilterNotifications(data);
                    setUnread(data?.filter((n) => !n.read));
                }
            } catch (error) {
                console.error("Error", error);
            }
        }

        if(userId){
            fetchNotifications(userId);
        }

    }, [notifications, userId]);

    // useEffect(() => {
    //     if (notifications) {
    //         const ids = notifications.map((n) => n.id)
    //         setFilterNotifications((prev) => prev.map((n) => !ids.includes(n.id) ? { ...n, read: true } : n))
    //     }
    // }, [notifications]);
    

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
                // Update context
                updateNotifications(notifications.filter((n) => !idsToMark.includes(n.id)));
            }

        } catch (error) {
            console.error('Error in marking notifications as read', error);
        }
    }, [notifications, updateNotifications]);

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                {unread?.length > 0 && (
                    <Button variant={'ghost'} className='text-muted-foreground hover:text-blue-600 ml-auto' onClick={() => handleMarkAsRead()}>
                        <CheckCheckIcon className='size-4 mr-1' /> Mark all as read
                    </Button>
                )}
            </div>

            <ScrollArea className={cn({ "h-[calc(100vh-250px)]": filterNotifications?.length > 0 })}>
                <ul className="space-y-2">
                    {filterNotifications?.map((notification) => (
                        <li key={notification.id} className={cn("hover:bg-accent rounded", { "bg-accent": !notification.read })}>
                            <Link href="#" className='w-full group'>
                                <div className='p-2'>
                                    <div className={cn("flex gap-1 max-h-10 overflow-hidden text-[14px] text-balance", { "font-semibold": !notification.read })}>
                                        {!notification.read && <div className='bg-blue-500 rounded-full size-2 mt-1 shrink-0'></div>}
                                        {notification.message}
                                    </div>
                                    <div className='flex mt-1'>
                                        <small className='text-muted-foreground'>
                                            {new Date(notification.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour12: true, hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                        <small className='opacity-0 hover:text-blue-500 ml-auto group-hover:opacity-100' onClick={() => handleMarkAsRead(notification.id)}>
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