'use client';
import { AlertCircleIcon, X } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useNotifications } from '@/context/notification-context';
import { useState } from 'react';

export default function AllowNotification() {

    const {
        loading,
        subscription,
        permissionDenied,
        requestPermission,
        unsubscribe,
    } = useNotifications();

    const [showAlert, setShowAlert] = useState(true);
 

    if (loading) return null; // Avoid rendering while loading
    if (!showAlert) return null;

    // If notifications were denied by the user
    if (permissionDenied) {
        return (
            
            <Alert variant="default" className='bg-yellow-50 border border-yellow-300 text-yellow-900 dark:bg-yellow-50/5 dark:border-accent dark:text-yellow-600'>
                <AlertCircleIcon className="size-4 !text-inherit" />
                <AlertTitle className='flex'>
                    It looks like you denied notifications.
                    <X className='size-4 ml-auto cursor-pointer' onClick={() => setShowAlert(false)} />
                </AlertTitle>
                <AlertDescription>
                    <ul className='space-y-1'>
                        <li className='flex items-center gap-1'>Click the <InfoCircledIcon /> icon in your browser's address bar</li>
                        <li>Go to "Notifications" settings</li>
                        <li>Select "Allow" to enable notifications</li>
                    </ul>
                </AlertDescription>
            </Alert>
        );
    }

    // If the user is not subscribed to notifications
    if (!subscription) {
        return (
            
            <Alert variant="default" className='bg-yellow-50 border border-yellow-300 text-yellow-900 dark:bg-yellow-50/5 dark:border-accent dark:text-yellow-600'>
                <AlertCircleIcon className="size-4 !text-inherit" />
                <AlertTitle className='flex'>
                    You are not subscribed to push notifications.
                    <X className='size-4 ml-auto cursor-pointer' onClick={() => setShowAlert(false)} />
                </AlertTitle>
                <AlertDescription className='space-y-2'>
                    {/* Go to Notification setting <Link href={'/profile-settings/notifications?sub=false'} className='hover:text-blue-400'> click here</Link> */}
                    Click <button onClick={requestPermission} className='text-blue-400'>Allow Notifications</button> to subscribe.
                </AlertDescription>
            </Alert>
        );
    }

    // If the user is subscribed to notifications
    return (
        <Alert variant="default" className='bg-yellow-50 border border-yellow-300 text-yellow-900 dark:bg-yellow-50/5 dark:border-accent dark:text-yellow-600'>
            <AlertCircleIcon className="size-4 !text-inherit" />
            <AlertTitle className='flex'>
                Subscribed to notifications
                <X className='size-4 ml-auto cursor-pointer' onClick={() => setShowAlert(false)} />
            </AlertTitle>
            <AlertDescription>
                You have successfully subscribed to push notifications.
                <button onClick={unsubscribe} className="text-red-500 hover:text-red-700">Unsubscribe</button>
            </AlertDescription>
        </Alert>
    );
}