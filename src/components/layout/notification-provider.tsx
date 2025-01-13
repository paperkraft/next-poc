'use client';

import Link from 'next/link';
import { BellIcon, CheckCheck, SettingsIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useSSE from '@/hooks/use-sse';

const NotificationProvider = () => {
    const { notifications, setNotifications, count, setCount } = useSSE();

    const handleMarkAsRead = async (notificationIds?: string) => {

        if (notificationIds) {
            const res = await fetch('/api/notifications', {
                method: "PUT",
                body: JSON.stringify({ notificationIds })
            })
            const result = await res.json();
            if (result.success) {
                const update = notifications.filter((item) => item.id !== notificationIds);
                setNotifications(update);
                setCount(update.length);
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
                setNotifications([]);
                setCount(0);
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className='size-8 block relative' autoFocus={false}>
                    <BellIcon className='-translate-x-1/2 block !size-5' />
                    {
                        count > 0 && (
                            <span className='absolute top-0 right-0 bg-red-500 size-[18px] rounded-full flex justify-center items-center'>
                                <span className='text-white text-[12px] select-none'>{count}</span>
                            </span>)
                    }
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-full min-w-64 max-w-72 shadow-lg'>
                <DropdownMenuLabel className='p-2 text-lg flex items-center'>
                    <p className='ml-1'>Notifications</p>
                    <Button variant='ghost' size="icon" className='text-muted-foreground ml-auto'>
                        <SettingsIcon className='size-5' />
                    </Button>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ScrollArea className={cn({"max-h-80": notifications.length > 0 })}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem key={notification.id}>
                                <Link href="#" className='w-full group'>
                                    <div className='space-y-2 p-1'>
                                        <div className='flex max-h-10 overflow-hidden'>
                                            {notification.message}
                                            <div className='ml-auto shrink-0 flex flex-col items-end justify-between'>
                                                <div className='bg-blue-500 rounded-full size-2 shrink-0'></div>
                                                <X className='size-5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500'
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <small className='text-muted-foreground'>
                                                {new Date(notification.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour12: true, hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))

                    ) : (
                        <DropdownMenuItem className='h-10'>
                            <div className='w-full text-center'>
                                No new notifications
                            </div>
                        </DropdownMenuItem>
                    )}
                    <ScrollBar orientation='vertical' />
                </ScrollArea>


                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className='flex items-center p-2 px-4'>
                            <small className='flex items-center cursor-pointer text-muted-foreground hover:text-blue-600' onClick={() => handleMarkAsRead()}>
                                <CheckCheck className='size-4 mr-1' /> Mark all as read
                            </small>
                            <Link href='/settings/notifications' className='ml-auto text-muted-foreground hover:text-blue-600 text-xs'>
                                View all
                            </Link>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationProvider;