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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";

export default function NotificationsList() {
    const route = useRouter();

    const { setNotifications } = useSSE();
    const { data: session } = useSession();

    const userId = session?.user?.id;

    const { data: apiNotifications, isLoading } = useQuery({
        queryKey: ["notification", userId],
        queryFn: async () => {
            const res = await fetch(`/api/notifications?userId=${userId}`);
            const result = await res.json();
            return result.success ? result.data : [];
        },
        enabled: !!userId
    });

    const [filterNotifications, setFilterNotifications] = useState<Notifications[]>();
    const [unread, setUnread] = useState<Notifications[]>([]);

    useEffect(() => {
        if (apiNotifications) {
            setFilterNotifications(apiNotifications);

            const unreadNotifications = apiNotifications.filter((item: Notifications) => !item.read);
            setUnread(unreadNotifications);
            setNotifications(unreadNotifications);
        }
    }, [apiNotifications]);

    // Handler for marking notifications as read
    const handleMarkAsRead = useCallback(
        async (notificationIds?: string) => {
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
                    const updatedNotifications = unread.filter((notification: Notifications) => !idsToMark.includes(notification.id));
                    setNotifications(updatedNotifications as any);
                }

            } catch (error) {
                console.error('Error in marking notifications as read', error);
            } finally {
                route.refresh();
            }
        },
        [unread, route, setNotifications]
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Tabs defaultValue={"all"}>
                    <TabsList>
                        <TabsTrigger value="all" className="w-20" onClick={() => setFilterNotifications(apiNotifications)}>All</TabsTrigger>
                        <TabsTrigger value="unread" className="w-20" disabled={unread?.length === 0} onClick={() => setFilterNotifications(unread)}>Unread</TabsTrigger>
                    </TabsList>
                </Tabs>

                {unread?.length > 0 && (
                    <Button variant={'ghost'} className='text-muted-foreground hover:text-blue-600 ml-auto' onClick={() => handleMarkAsRead()}>
                        <CheckCheckIcon className='size-4 mr-1' /> Mark all as read
                    </Button>
                )}
            </div>

            <ScrollArea className={cn({ "h-[calc(100vh-250px)]": apiNotifications?.length > 0 })}>
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