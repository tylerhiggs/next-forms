import { getFormById } from "@/src/actions/forms";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashSidebar";
import { cookies } from "next/headers";

export default async function FormEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (!id) {
    return <div>Form ID is required</div>;
  }
  if (isNaN(Number(id))) {
    return <div>Invalid Form ID</div>;
  }
  const form = await getFormById(Number(id));
  if (!form) {
    return <div>Form not found</div>;
  }
  const cookieStore = cookies();
  const defaultOpen =
    (await cookieStore).get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <main className="flex w-full min-h-full">
        <SidebarTrigger />
        <div className="flex w-full min-h-full items-center justify-center">
          <h1 className="text-2xl font-bold">Editing Form: {form.title}</h1>
        </div>
      </main>
    </SidebarProvider>
  );
}
