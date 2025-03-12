import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppLayout from "@/components/layout/app-layout";
import ThemeProvider from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/context/auth-provider";
import { cn } from "@/lib/utils";
import { ChildProps } from "@/types";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | App",
    absolute: "App",
  },
  description: "CRM"
};

export default async function RootLayout({ children }: ChildProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={cn(inter.className)}>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <AppLayout>
                {children}
              </AppLayout>
              <Toaster richColors position="top-center"/>
            </ThemeProvider>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}