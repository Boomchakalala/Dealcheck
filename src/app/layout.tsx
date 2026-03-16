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
    default: "TermLift — Better Vendor Terms in Minutes",
    template: "%s | TermLift",
  },
  description: "Drop in a vendor quote and get back exactly where you're overpaying, a full negotiation playbook, and a ready-to-send email — in under 60 seconds. Free to try.",
  metadataBase: new URL("https://www.termlift.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/icon-512.png",
  },
  openGraph: {
    type: "website",
    siteName: "TermLift",
    title: "TermLift — Better Vendor Terms in Minutes",
    description: "Stop overpaying vendors. Drop in any quote and get red flags, a negotiation playbook, and a ready-to-send email in 60 seconds.",
    url: "https://www.termlift.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TermLift — Stop Overpaying Vendors",
    description: "Drop in any vendor quote. Get back exactly where you're overpaying, what to push for, and a ready-to-send email — in 60 seconds.",
  },
  alternates: {
    canonical: "https://www.termlift.com",
    languages: {
      en: "https://www.termlift.com",
      fr: "https://www.termlift.com/fr",
    },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TermLift",
              applicationCategory: "BusinessApplication",
              description: "Stop overpaying vendors. Drop in any quote and get red flags, a negotiation playbook, and a ready-to-send email in 60 seconds.",
              url: "https://www.termlift.com",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              operatingSystem: "Web",
            }),
          }}
        />
      </head>
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
