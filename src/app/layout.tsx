import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/components/custom/auth-provider";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/app-layout";
import { ChildProps } from "@/types";
import "@/styles/globals.css";
import ThemeWrapper from "@/components/custom/theme-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Webdesk",
    absolute: "Webdesk",
  },
  description: "Educational ERP",
};

export default function RootLayout({ children }: ChildProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className)}>
        <NextAuthProvider>
          <ThemeProvider>
            <ThemeWrapper>
              <AppLayout>
                {children}
              </AppLayout>
            </ThemeWrapper>
            <Toaster richColors />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
