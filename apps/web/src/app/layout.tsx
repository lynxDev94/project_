import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/providers/Auth";
import { CreditsProvider } from "@/providers/Credits";
import AuthLayout from "./auth-layout";

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

export const metadata: Metadata = {
  title: "Agent Chat",
  description: "Agent Chat UX by LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <NuqsAdapter>
          <AuthProvider>
            <CreditsProvider>
              <AuthLayout>{children}</AuthLayout>
            </CreditsProvider>
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
