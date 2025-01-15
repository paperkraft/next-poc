'use client';

import Link from 'next/link';
import { BellIcon, CheckCheck, SettingsIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/context/notification-context';

const BellNotifications = () => {
    const { notifications, updateNotifications, count, setUnreadCount } = useNotifications();
    // console.log('Bell', notifications);

    const handleMarkAsRead = async (notificationIds?: string) => {
        const idsToMark = notificationIds ? [notificationIds] : notifications.filter((n) => !n.read).map((n) => n.id);

        try {
            // Only proceed if notifications were selected
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                body: JSON.stringify({ notificationIds: idsToMark }),
            });
            const result = await res.json();

            if (result.success) {
                // Update state only if there were successful changes
                const updatedNotifications = notifications.filter((notification) => !idsToMark.includes(notification.id));

                // Update global state and count
                updateNotifications(updatedNotifications);
                setUnreadCount(updatedNotifications?.length);
            }
        } catch (error) {
            console.error('Error in marking notifications as read', error);
        }
    };

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

            <DropdownMenuContent align='end' className='min-w-64 max-w-72 shadow-lg'>
                <DropdownMenuLabel className='p-2 text-lg flex items-center'>
                    <h1 className='ml-1'>Notifications</h1>
                    <Button variant='ghost' size="icon" className='text-muted-foreground ml-auto'>
                        <SettingsIcon className='size-5' />
                    </Button>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ScrollArea className={cn({ "h-80": notifications.length > 0 })}>
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

export default BellNotifications;