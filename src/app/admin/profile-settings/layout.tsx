import TitlePage from "@/components/custom/page-heading";
import { ReactNode } from "react";
import { SidebarNav } from "./components/sidebar-nav";
import { getTranslations } from "next-intl/server";

export default async function Layout({ children }: { children: ReactNode }) {

  const t = await getTranslations('setting');

  const sidebarNavItems = [
    {
      title: t('profile.title'),
      href: "/admin/profile-settings",
    },
    // {
    //   title: t('account.title'),
    //   href: "/profile-settings/account",
    // },
    {
      title: t('appearance.title'),
      href: "/admin/profile-settings/appearance",
    },
    {
      title: t('notifications.title'),
      href: "/admin/profile-settings/notifications",
    },
  ]

  return (
    <>
      <TitlePage title={t('title')} description={t('description')} />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 p-4 overflow-x-auto">
        <aside className="-mx-4 lg:w-1/5 overflow-x-auto px-1 pt-1">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          {children}
        </div>
      </div>
    </>
  );
}