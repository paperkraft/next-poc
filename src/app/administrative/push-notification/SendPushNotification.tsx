'use client';
import { useState } from 'react';
import { sendWebPushNotification } from '@/push';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SendPushNotification() {
    const { data } = useSession();
    const userId = data?.user?.id;

    const [message, setMessage] = useState<string | null>(null);

    const handleSendNotification = () => {
        setMessage(null);
        sendWebPushNotification({ userId, message });
    }

    return (
        <div className='space-y-4'>
            <Input
                className='max-w-md'
                placeholder={'Type push message ...'}
                value={message ?? ''}
                onChange={e => setMessage(e.target.value)}
            />
            <Button onClick={() => handleSendNotification()}>
                Send Notification
            </Button>
        </div>
    );
}