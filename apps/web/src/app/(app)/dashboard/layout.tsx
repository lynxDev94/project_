import { SidebarLayout } from "./components/sidebar-layout";
import { DashboardAuthGuard } from "./_components/dashboard-auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <SidebarLayout>{children}</SidebarLayout>
    </DashboardAuthGuard>
  );
}
