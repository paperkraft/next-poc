import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";
import { getTranslations } from "next-intl/server";

export default async function SettingsProfilePage() {
  const t = await getTranslations('setting');

  return (
    <div className="space-y-4">
      <div>
      <h3 className="text-lg font-medium">{t('profile.title')}</h3>
      <p className="text-sm text-muted-foreground">{t('profile.description')}</p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}