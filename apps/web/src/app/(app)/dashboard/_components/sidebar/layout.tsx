"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreditBalance } from "@/components/credits/credit-balance";
import { SidebarNav } from "./nav";
import { getSidebarPageTitle } from "./utils";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-dashboard-main-bg h-screen overflow-hidden text-slate-800">
      <aside className="border-dashboard-stroke fixed inset-y-0 left-0 z-40 hidden w-64 border-r md:block">
        <SidebarNav pathname={pathname} />
      </aside>
      <div className="flex h-full flex-col md:pl-64">
        <header className="border-dashboard-stroke bg-dashboard-main-bg/95 fixed top-0 right-0 left-0 z-30 h-14 border-b backdrop-blur-md md:left-64">
          <div className="flex h-full items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <SidebarNav pathname={pathname} />
                </SheetContent>
              </Sheet>

              <nav className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                <span className="text-slate-400">
                  <span className="text-brand">Shadow</span>
                  <span className="text-slate-800">Journal</span>
                </span>
                <span className="mx-1.5 text-slate-400">/</span>
                <span className="text-slate-800">{getSidebarPageTitle(pathname)}</span>
              </nav>
            </div>
            <CreditBalance />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-14">
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
