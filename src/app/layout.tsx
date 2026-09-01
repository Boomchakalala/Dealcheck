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
    default: "TermLift — Turn Vendor Quotes Into Better Deals",
    template: "%s | TermLift",
  },
  description: "Analyze a supplier quote and find your negotiation opportunity — savings, leverage, and a full strategy. Negotiate it yourself, or have TermLift negotiate for you.",
  metadataBase: new URL("https://www.termlift.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/icon-512.png",
  },
  openGraph: {
    type: "website",
    siteName: "TermLift",
    title: "TermLift — Turn Vendor Quotes Into Better Deals",
    description: "Analyze a supplier quote and find your negotiation opportunity. Negotiate it yourself, or have TermLift negotiate for you.",
    url: "https://www.termlift.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TermLift — Turn Vendor Quotes Into Better Deals",
    description: "Analyze a supplier quote and find your negotiation opportunity. Negotiate it yourself, or have TermLift negotiate for you.",
  },
  alternates: {
    canonical: "https://www.termlift.com",
    languages: {
      en: "https://www.termlift.com",
      fr: "https://www.termlift.com",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "TermLift",
                applicationCategory: "BusinessApplication",
                description: "Stop overpaying vendors. Analyze a quote to find red flags and negotiation leverage, then negotiate it yourself or have TermLift negotiate it for you.",
                url: "https://www.termlift.com",
                offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
                operatingSystem: "Web",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "TermLift",
                url: "https://www.termlift.com",
                logo: "https://www.termlift.com/logo-icon.png",
                description: "AI-powered vendor quote analysis and a done-for-you negotiation service — find your negotiation opportunity, then negotiate it yourself or have TermLift negotiate on your behalf.",
                sameAs: [],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "hello@termlift.com",
                  contactType: "customer support",
                },
              },
            ]),
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
