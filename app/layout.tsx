import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Haptics Demo",
  description: "Minimal demo app for testing two custom web haptic patterns with adjustable intensity.",
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