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
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | App",
    absolute: "App",
  },
  description: "Educational ERP",
};

export default async function RootLayout({ children }: ChildProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  const cookieStore = cookies()
  const defaultOpen = Boolean(cookieStore.get("sidebar:state")?.value)

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={cn(inter.className)}>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <AppLayout defaultOpen={defaultOpen}>
                {children}
              </AppLayout>
              <Toaster richColors />
            </ThemeProvider>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}