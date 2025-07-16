import { getTranslations } from 'next-intl/server';

import { LoginDetail } from '@/app/actions/audit.action';
import { Separator } from '@/components/ui/separator';

import { ProfileForm } from './ProfileForm';

export default async function SettingsProfilePage({ lastLogins }: { lastLogins: LoginDetail[] | null }) {
  const t = await getTranslations('setting');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{t('profile.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('profile.description')}</p>
      </div>
      <Separator />
      <ProfileForm lastLogins={lastLogins} />
    </div>
  )
}