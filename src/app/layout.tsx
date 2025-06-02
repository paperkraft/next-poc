import '@/styles/globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';

import AppLayout from '@/components/layout/app-layout';
import { Toaster } from '@/components/ui/sonner';
import { NextAuthProvider } from '@/context/auth-provider';
import ThemeProvider from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import { ChildProps } from '@/types';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Metadata } from "next";
import { auth } from '@/auth';
import StoreProvider from '@/context/store-provider';
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
                <AppLayout>
                  {children}
                </AppLayout>
                <Toaster richColors position="top-center" />
              </ThemeProvider>
            </NextIntlClientProvider>
          </NextAuthProvider>
        <SpeedInsights />
        </StoreProvider>
      </body>
    </html>
  );
}