'use client'
import Link from "next/link";
import { Notifications } from "./page";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useSSE from "@/hooks/use-sse";

interface NotificationsProps {
    notifications: Notifications[]
}

export default function NotificationsList({ notifications }: NotificationsProps) {
    const [filterNotifications, setFilterNotifications] = useState<Notifications[]>(notifications);
    const unread = notifications.filter((item) => !item.read);
    const { setNotifications } = useSSE();

    const handleMarkAsRead = async (notificationIds?: string) => {

        if (notificationIds) {
            const res = await fetch('/api/notifications', {
                method: "PUT",
                body: JSON.stringify({ notificationIds })
            })
            const result = await res.json();
            if (result.success) {
                toast.success('Marked as read');
                const un = unread.filter((item)=> item.id !== notificationIds);
                console.log('unread', un);
            }
        } else {
            const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
            if (unreadIds.length === 0) return;
            const res = await fetch('/api/notifications', {
                method: "PUT",
                body: JSON.stringify({ notificationIds: unreadIds })
            })
            const result = await res.json();
            if (result.success) {
                toast.success('Marked all as read');
            }
        }
    }
    

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Tabs defaultValue={"all"}>
                    <TabsList>
                        <TabsTrigger value="all" onClick={()=> setFilterNotifications(notifications)}>All</TabsTrigger>
                        <TabsTrigger value="unread" onClick={()=> setFilterNotifications(unread)}>Unread</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Button variant={'ghost'} className='text-muted-foreground hover:text-blue-600 ml-auto' onClick={() => handleMarkAsRead()}>
                    <CheckCheckIcon className='size-4 mr-1' /> Mark all as read
                </Button>
            </div>

            <ScrollArea className={cn({ "h-[calc(100vh-250px)]": notifications.length > 0 })}>
                <ul className="space-y-2">
                    {filterNotifications?.map((notification) => (
                        <li key={notification.id} className={cn("hover:bg-gray-50 rounded", { "bg-gray-50": !notification.read })}>
                            <Link href="#" className='w-full'>
                                <div className='p-2'>
                                    <div className='flex max-h-10 overflow-hidden text-[14px] text-balance'>
                                        <p className={cn({ "font-semibold": !notification.read })}>{notification.message}</p>
                                        {!notification.read && <div className='bg-blue-500 rounded-full size-2 shrink-0 ml-auto'></div>}
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