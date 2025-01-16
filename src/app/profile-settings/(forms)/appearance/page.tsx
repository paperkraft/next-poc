import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "./AppearanceForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Appearance",
  description: "Customize the appearance of the app.",
};

export default async function SettingsAppearancePage() {
  const t = await getTranslations('setting');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('appearance.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('appearance.description')}</p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  )
}