import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashSidebar";

export default async function Dashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />
      <main className="w-full">
        <div className="flex w-full min-h-full items-center justify-center">
          <h1 className="text-2xl font-bold">No form selected</h1>
        </div>
      </main>
    </SidebarProvider>
  );
}
