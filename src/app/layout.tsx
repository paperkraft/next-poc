import '@/styles/globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { NextAuthProvider } from '@/context/auth-provider';
import ThemeProvider from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import { ChildProps } from '@/types';

import type { Metadata } from "next";
import { auth } from '@/auth';
import StoreProvider from '@/context/store-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NotificationsProvider } from '@/context/notification-context';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | SV",
    absolute: "SV",
  },
  description: "CRM"
};

export default async function RootLayout({ children }: ChildProps) {
  const session = await auth();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <StoreProvider>
          <NextAuthProvider session={session}>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider>
                <NotificationsProvider>
                  <TooltipProvider>
                    {children}
                  </TooltipProvider>
                </NotificationsProvider>
                <Toaster richColors position="top-center" />
              </ThemeProvider>
            </NextIntlClientProvider>
          </NextAuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}