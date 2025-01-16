import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./AccountForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Account",
  description: "Update your account settings.",
};

export default async function SettingsAccountPage() {
  const t = await getTranslations('setting');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('account.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('account.description')}</p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}