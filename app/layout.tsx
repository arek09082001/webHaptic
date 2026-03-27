import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Haptics Demo",
  description: "Mobile-first demo app for testing haptic feedback patterns for login and time tracking actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}