import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export type SidebarNavItem = {
  href: string;
  label: string;
  pageTitle: string;
  icon: LucideIcon;
};

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    pageTitle: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/journal",
    label: "Journal",
    pageTitle: "Journal",
    icon: BookOpenText,
  },
  {
    href: "/dashboard/entries",
    label: "Entries",
    pageTitle: "Entries",
    icon: FileText,
  },
  {
    href: "/dashboard/pricing",
    label: "Pricing",
    pageTitle: "Pricing",
    icon: CreditCard,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    pageTitle: "Settings",
    icon: Settings,
  },
];
