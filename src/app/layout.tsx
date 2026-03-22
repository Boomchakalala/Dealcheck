import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { I18nProvider } from "@/i18n/context";
import { CookieConsent } from "@/components/CookieConsent";
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
    default: "TermLift — Better Vendor Terms in 60 Seconds",
    template: "%s | TermLift",
  },
  description: "Paste a vendor quote, get back red flags, savings, and a negotiation email in 60 seconds. TermLift is the procurement expert your team never had. Free to try.",
  metadataBase: new URL("https://www.termlift.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/icon-512.png",
  },
  openGraph: {
    type: "website",
    siteName: "TermLift",
    title: "TermLift — Better Vendor Terms in 60 Seconds",
    description: "Paste a vendor quote, get back red flags, savings, and a negotiation email in 60 seconds. Free to try.",
    url: "https://www.termlift.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TermLift — Better Vendor Terms in 60 Seconds",
    description: "Better vendor terms in 60 seconds. Paste a quote, get red flags, savings, and a ready-to-send email. Free to try.",
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
        <meta name="google-site-verification" content="VFAqvJkNGlWXSZLe4dtSN8benH7O0vTRBDzrrOyCX5E" />
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
              <CookieConsent />
            </AnalyticsProvider>
          </I18nProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
