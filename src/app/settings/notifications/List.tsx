'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { Notifications } from "./page";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useSSE from "@/hooks/use-sse";
import { useRouter } from "next/navigation";

interface NotificationsProps {
    notifications: Notifications[]
}

export default function NotificationsList({ notifications }: NotificationsProps) {
    const [filterNotifications, setFilterNotifications] = useState<Notifications[]>(notifications);
    const unread = notifications.filter((item) => !item.read);
    const { setNotifications, setCount } = useSSE();
    const route = useRouter();

    const handleMarkAsRead = async (notificationIds?: string) => {

        if (notificationIds) {
            try {
                const unreadNotifications = unread.filter((item) => item.id !== notificationIds);
                const res = await fetch('/api/notifications', {
                    method: "PUT",
                    body: JSON.stringify({ notificationIds })
                })
                const result = await res.json();
                if (result.success) {
                    toast.success('Marked as read');
                    setNotifications(unreadNotifications as any);
                    setCount(unreadNotifications?.length);
                    route.refresh()
                }
            } catch (error) {
                console.error('Error in mark as read', error);
            } finally {
                route.refresh()
            }
        } else {
            try {
                const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
                if (unreadIds.length === 0) return;
                const res = await fetch('/api/notifications', {
                    method: "PUT",
                    body: JSON.stringify({ notificationIds: unreadIds })
                })
                const result = await res.json();
                if (result.success) {
                    toast.success('Marked all as read');
                    setNotifications([]);
                    setCount(0)
                    route.refresh()
                }
            } catch (error) {
                console.error('Error in mark all as read', error);
            } finally {
                route.refresh()
            }
        }
    }


    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Tabs defaultValue={"all"}>
                    <TabsList>
                        <TabsTrigger value="all" onClick={() => setFilterNotifications(notifications)}>All</TabsTrigger>
                        <TabsTrigger value="unread" onClick={() => setFilterNotifications(unread)}>Unread</TabsTrigger>
                    </TabsList>
                </Tabs>

                {
                    unread?.length > 0 &&
                    <Button variant={'ghost'} className='text-muted-foreground hover:text-blue-600 ml-auto' onClick={() => handleMarkAsRead()}>
                        <CheckCheckIcon className='size-4 mr-1' /> Mark all as read
                    </Button>
                }
            </div>

            <ScrollArea className={cn({ "h-[calc(100vh-250px)]": notifications.length > 0 })}>
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