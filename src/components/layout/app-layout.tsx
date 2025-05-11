"use client";
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { PUBLIC_PATHS } from '@/constants/routes';
import { NotificationsProvider } from '@/context/notification-context';
import { useMounted } from '@/hooks/use-mounted';

import { SidebarProvider } from '../ui/sidebar';
import { TooltipProvider } from '../ui/tooltip';
import AppSidebar from './Sidebar/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const mounted = useMounted();
  const pathname = usePathname();
  const isPublicURL = PUBLIC_PATHS.includes(pathname);
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      !isPublicURL && route.replace("/");
    },
  });

  if (!mounted) return null;

  if (isPublicURL || (pathname === "/" && status !== "authenticated")) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (status === "authenticated") {
    return (
      <SidebarProvider>
        <NotificationsProvider>
          <AppSidebar>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AppSidebar>
        </NotificationsProvider>
      </SidebarProvider>
    )
  }
}