import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashSidebar";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies();
  const defaultOpen =
    (await cookieStore).get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <main>
        <SidebarTrigger />
        TODO
      </main>
    </SidebarProvider>
  );
}
