import type { Metadata } from "next";
import { SidebarLayout } from "./_components/sidebar/layout";
import { AuthGuard } from "./_components/authGuard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarLayout>{children}</SidebarLayout>
    </AuthGuard>
  );
}
