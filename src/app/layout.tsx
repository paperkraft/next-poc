import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/components/custom/auth-provider";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { ChildProps } from "@/types";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: {
    template: "%s | Webdesk",
    absolute: "Webdesk",
  },
  description: "Educational ERP",
};

export default function RootLayout({children}:ChildProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className)}>
        <NextAuthProvider>
          <ThemeProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster richColors/>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
