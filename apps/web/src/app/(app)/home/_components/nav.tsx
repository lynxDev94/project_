"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#process", label: "The Process" },
  { href: "#safety", label: "Safety" },
];

export const Nav = () => {
  return (
    <nav className="bg-background-dark/80 fixed top-0 right-0 left-0 z-50 border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/home" className="flex items-center gap-2">
          <img
            src="/images/brandLogo.png"
            alt="Shadow Journal"
            className="h-8 w-8 rounded-full object-contain"
          />
          <span className="font-sans text-xl font-bold tracking-tight">
            <span className="text-brand"> Shadow</span>
            <span className="font-extralight text-white">Journal</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-brand transition-colors">
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="border-brand/20 bg-brand/10 hover:bg-brand/20 rounded-full border px-5 py-2 text-white transition-all"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-brand hover:bg-brand/90 rounded-full px-5 py-2 text-white transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-white/10 bg-white/5 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5 text-slate-300" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="border-white/10 bg-background-dark p-0 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:text-white"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-8 px-8 pt-16 pb-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-lg font-medium text-slate-300 transition-colors hover:text-brand"
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-4">
                <Link
                  href="/signin"
                  className="border-brand/20 bg-brand/10 hover:bg-brand/20 rounded-full border px-5 py-3 text-center text-white transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-brand hover:bg-brand/90 rounded-full px-5 py-3 text-center text-white transition-all"
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
