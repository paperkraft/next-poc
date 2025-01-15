import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "./DisplayForm";
import { Metadata } from "next";
import { useServerTranslation } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Display",
  description: "Turn items on or off to control.",
};

export default async function SettingsDisplayPage() {
  const {t} = await useServerTranslation('setting');
  return (
    <div className="space-y-6">
      <div>
      <h3 className="text-lg font-medium">{t('display.title')}</h3>
      <p className="text-sm text-muted-foreground">{t('display.description')}</p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  )
}