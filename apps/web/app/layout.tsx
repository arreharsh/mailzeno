import React from "react";
import type { Metadata, Viewport } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/* SEO Metadata */

const SITE_URL = "https://mailzeno.dev";
const SITE_NAME = "MailZeno";
const SITE_TITLE = "MailZeno – Developer-First Email API & SMTP Platform";
const SITE_DESCRIPTION =
  "Send transactional and marketing emails using your own SMTP provider. Open-source email API with built-in dashboard, Node.js SDK, REST API, real-time logs, and email templates. Alternative to Resend, Postmark & SendGrid.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* Title */
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  /* Description */
  description: SITE_DESCRIPTION,

  /* Canonical */
  alternates: {
    canonical: SITE_URL,
  },

  /* Icons */
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },

  /* Keywords */
  keywords: [
    // Core product
    "email API",
    "SMTP API",
    "transactional email",
    "transactional email API",
    "email sending API",
    "SMTP email service",
    "email delivery API",
    "email infrastructure",

    // Tech-specific
    "Node.js email",
    "Node.js SMTP",
    "TypeScript email API",
    "JavaScript email SDK",
    "REST API email",
    "email SDK",

    // Use cases
    "send email via API",
    "send transactional email",
    "email notifications API",
    "password reset email",
    "welcome email API",
    "order confirmation email",
    "email verification API",

    // BYOS / Self-hosted
    "bring your own SMTP",
    "self-hosted email API",
    "open source email API",
    "open source SMTP",
    "self-hosted email platform",
    "email API self hosted",

    // Alternatives
    "Resend alternative",
    "SendGrid alternative",
    "Postmark alternative",
    "Mailgun alternative",
    "Amazon SES alternative",
    "email API alternative",

    // Features
    "email templates API",
    "email logs dashboard",
    "email analytics",
    "email delivery tracking",
    "SMTP dashboard",
    "email rate limiting",
    "bulk email API",

    // Developer tools
    "developer email tool",
    "email developer platform",
    "API first email",
    "headless email service",
    "programmatic email",

    // Brand
    "MailZeno",
    "mailzeno",
  ],

  /* Authors */
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  /* Robots */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* Open Graph */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "MailZeno – Developer-first email API and SMTP platform",
      },
    ],
  },

  /* Twitter */
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.webp"],
    creator: "@mailzeno",
  },

  /* App Info */
  applicationName: SITE_NAME,
  category: "Developer Tools, Transactional Email",

};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description: SITE_DESCRIPTION,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "50",
              },
              featureList: [
                "Bring Your Own SMTP",
                "REST API",
                "Node.js SDK",
                "Email Templates",
                "Real-time Logs",
                "Analytics Dashboard",
                "Rate Limiting",
                "Open Source",
              ],
            }),
          }}
        />
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/logo.svg`,
              sameAs: [
                "https://github.com/mailzeno",
                "https://twitter.com/mailzeno",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${figtree.className} ${geistMono.variable} font-medium antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
