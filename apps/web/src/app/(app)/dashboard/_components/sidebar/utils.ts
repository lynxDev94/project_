import { SIDEBAR_NAV_ITEMS, type SidebarNavItem } from "./config";

export function isSidebarItemActive(
  item: SidebarNavItem,
  pathname: string,
): boolean {
  if (item.href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(item.href);
}

export function getSidebarPageTitle(pathname: string): string {
  const activeItem = SIDEBAR_NAV_ITEMS.find((item) =>
    isSidebarItemActive(item, pathname),
  );
  return activeItem?.pageTitle ?? "Dashboard";
}
