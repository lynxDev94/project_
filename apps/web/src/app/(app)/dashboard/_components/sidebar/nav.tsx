"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/Auth";
import { SIDEBAR_NAV_ITEMS } from "./config";
import { isSidebarItemActive } from "./utils";

function SidebarNavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {SIDEBAR_NAV_ITEMS.map((item) => {
        const { href, label, icon: Icon } = item;
        const active = isSidebarItemActive(item, pathname);
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
    </>
  );
}

export function SidebarNav({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col bg-[#F8F9FE]">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-6 pt-6">
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
        <SidebarNavLinks pathname={pathname} />
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
