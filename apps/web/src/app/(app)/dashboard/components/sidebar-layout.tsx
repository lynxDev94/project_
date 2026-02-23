"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpenText,
  FileText,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useAuthContext } from "@/providers/Auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpenText },
  { href: "/dashboard/entries", label: "Entries", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/dashboard/journal")) return "Journal";
  if (pathname.startsWith("/dashboard/entries")) return "Entries";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  return "Dashboard";
}

function SidebarNav({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col bg-[#F8F9FE]">
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-2 px-6 pt-6"
      >
        <Image
          src="/images/brandLogo.png"
          alt="Shadow Journal"
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-contain"
        />
        <span className="font-sans text-base font-bold tracking-tight">
          <span className="text-brand">Shadow</span>
          <span className="text-slate-800">Journal</span>
        </span>
      </Link>

      <nav className="space-y-1 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand/10 text-brand"
                  : "hover:bg-brand/5 hover:text-brand text-slate-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-dashboard-stroke mt-auto border-t p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="hover:bg-brand/5 hover:text-brand flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-dashboard-main-bg h-screen overflow-hidden text-slate-800">
      {/* Desktop fixed sidebar */}
      <aside className="border-dashboard-stroke fixed inset-y-0 left-0 z-40 hidden w-64 border-r md:block">
        <SidebarNav pathname={pathname} />
      </aside>

      <div className="flex h-full flex-col md:pl-64">
        {/* Global header with breadcrumbs + mobile menu */}
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
                <SheetContent
                  side="left"
                  className="p-0"
                >
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
                <span className="text-slate-800">{getPageTitle(pathname)}</span>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-14">
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
