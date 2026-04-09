"use client";

import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { Navbar } from "@/components/navbar";
import Home from "./home/page";
export default function DemoPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading (layout)...</div>}>
      <Toaster />
      <Navbar />
      <Home />
    </React.Suspense>
  );
}
