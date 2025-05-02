"use client"
import { useTranslations } from 'next-intl';

import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { availableTopics } from '@/constants';
import { useNotifications } from '@/context/notification-context';
import { useMounted } from '@/hooks/use-mounted';

import TopicManagement from './TopicManagement';
import { useRouter } from 'next/navigation';

export function NotificationsForm() {
  const mounted = useMounted();
  const router = useRouter();
  const t = useTranslations('setting');
  const { subscription, loading, unsubscribe, requestPermission } = useNotifications();

  const handleChange = async (check: boolean) => {
    if (check) {
      requestPermission();
    } else {
      unsubscribe();
    }
    router.refresh();
  }

  return (
    mounted &&
    <>
      <div className="space-y-4">
        <div>
          <h3 className="mb-4 text-lg font-medium">{t('notifications.form.app_notify')}</h3>
          <div className="flex flex-col gap-2">
            <p className="font-medium">{t('notifications.form.allow_notify')}</p>
            <Switch
              disabled={loading}
              checked={!!subscription}
              onCheckedChange={(check) => handleChange(check)}
            />
            <span className="text-xs text-muted-foreground">
              {t('notifications.form.allow_notify_desc')}
            </span>
          </div>
        </div>
        <Separator />
        <TopicManagement availableTopics={availableTopics} />
      </div>
    </>
  )
}