import type { Metadata } from "next";
import "../globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Shadow Journal",
  description: "Shadow Journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
