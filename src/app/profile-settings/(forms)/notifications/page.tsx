import { Separator } from "@/components/ui/separator";
import { NotificationsForm } from "./NotificationsForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Configure how you receive notifications.",
};

export default async function SettingsNotificationsPage() {
  const t = await getTranslations('setting');
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("notifications.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("notifications.description")}</p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}