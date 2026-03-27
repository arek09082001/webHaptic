import type { Metadata } from "next";
import deMessages from "@/messages/de.json";
import "./globals.css";
import { AuthProvider } from "./providers/auth-provider";
import { QueryProvider } from "./providers/query-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { MobileNavbar } from "@/components/custom-ui/mobile-navbar";
import { DesktopNavbar } from "@/components/custom-ui/desktop-navbar";
import { PwaRegistrar } from "@/components/pwa-registrar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: deMessages.layout.title,
  description: deMessages.layout.description,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: deMessages.layout.title,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="overflow-x-hidden font-sans bg-background text-text-primary antialiased">
        <PwaRegistrar />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ThemeProvider>
              <QueryProvider>
                <div className="flex min-h-dvh">
                  {/* Desktop Sidebar */}
                  <DesktopNavbar />

                  {/* Main Content */}
                  <main className="flex-1 overflow-x-hidden pb-16 md:ml-64 md:pb-0">
                    {children}
                  </main>

                  {/* Mobile Bottom Navigation */}
                  <MobileNavbar />
                </div>
              </QueryProvider>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}