import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { I18nProvider } from "@/i18n/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TermLift — AI Vendor Quote Analyzer | Negotiate Better Supplier Deals",
    template: "%s | TermLift",
  },
  description: "Drop in a vendor quote and get back exactly where you're overpaying, what to push for, and a ready-to-send email in 60 seconds.",
  icons: {
    icon: "/favicon.png",
    apple: "/icon-512.png",
  },
  openGraph: {
    title: "TermLift — AI Vendor Quote Analyzer | Negotiate Better Supplier Deals",
    description: "Drop in a vendor quote and get back exactly where you're overpaying, what to push for, and a ready-to-send email in 60 seconds.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <I18nProvider>
            <AnalyticsProvider>
              <Toaster position="top-right" richColors />
              {children}
            </AnalyticsProvider>
          </I18nProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
