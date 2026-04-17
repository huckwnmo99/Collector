import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PWAProvider } from "@/components/providers/PWAProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Web Collector",
  description: "Your personal bookmark manager",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Web Collector",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <PWAProvider />
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
