import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import React from "react";
import { AuthProvider } from "@/providers/Auth";
import { CreditsProvider } from "@/providers/Credits";
import { ReactQueryProvider } from "@/providers/ReactQuery";
import AuthLayout from "./auth-layout";
import Script from "next/script";
import { PwaRegister } from "@/components/pwa-register";
import { PwaInstallHelper } from "@/components/pwa-install-helper";
import { PwaInstallProvider } from "@/providers/PwaInstall";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shadow Journal",
    template: "%s | Shadow Journal",
  },
  description:
    "Private journaling with AI reflections inspired by Carl Jung’s analytical psychology—shadow work, archetypes, and recurring patterns in your life (not therapy or diagnosis).",
  keywords: [
    "Carl Jung",
    "Jungian",
    "analytical psychology",
    "shadow work",
    "archetypes",
    "journaling",
    "self-reflection",
    "AI journal",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Shadow Journal",
    description:
      "Reflect in private with AI-guided insights inspired by Carl Jung—shadow, persona, archetypes, and the patterns behind your reactions.",
    url: siteUrl,
    siteName: "Shadow Journal",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/brandLogo.png",
        width: 560,
        height: 560,
        alt: "Shadow Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadow Journal",
    description:
      "Private journaling with reflections grounded in Carl Jung’s ideas: shadow work, archetypes, and meaningful patterns.",
    images: ["/images/brandLogo.png"],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="47906f3b-928a-469a-8061-140b49420f3d"
        data-blockingmode="auto"
        strategy="afterInteractive"
      />
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <CreditsProvider>
              <PwaInstallProvider>
                <PwaRegister />
                <PwaInstallHelper />
                <AuthLayout>{children}</AuthLayout>
              </PwaInstallProvider>
            </CreditsProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
