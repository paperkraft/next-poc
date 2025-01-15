import TitlePage from "@/components/custom/page-heading";
import { ReactNode, Suspense } from "react";
import { SidebarNav } from "./components/sidebar-nav";
import { useServerTranslation } from "@/i18n/server";

export default async function Layout({ children }: { children: ReactNode }) {
  const { t } = await useServerTranslation('setting');

  const sidebarNavItems = [
    {
      title: t('profile.title'),
      href: "/profile-settings",
    },
    {
      title: t('account.title'),
      href: "/profile-settings/account",
    },
    {
      title: t('appearance.title'),
      href: "/profile-settings/appearance",
    },
    {
      title: t('notifications.title'),
      href: "/profile-settings/notifications",
    },
    {
      title: t('display.title'),
      href: "/profile-settings/display",
    },
  ]
  return (
    <>
      <TitlePage title={t('title')} description={t('description')} />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 p-4">
        <aside className="-mx-4 lg:w-1/5 overflow-x-auto px-1 pt-1">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Suspense fallback={<>Loading...</>}>
            {children}
          </Suspense>
        </div>
      </div>
    </>
  );
}