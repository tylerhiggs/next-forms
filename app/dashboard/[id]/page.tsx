import { getFormById } from "@/src/actions/forms";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashSidebar";
import { cookies } from "next/headers";
import { FormEditor } from "@/components/FormEditor";
import { FormProvider } from "@/app/providers/form-provider";
import { toast } from "sonner";
export default async function FormEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (!id) {
    return <div>Form ID is required</div>;
  }
  if (isNaN(Number(id))) {
    toast.error("Invalid Form ID", { duration: 10000 });
    return <div>Invalid Form ID</div>;
  }
  const form = await getFormById(Number(id));
  if (!form) {
    toast.error("Form not found", { duration: 10000 });
    return <div>Form not found</div>;
  }
  const cookieStore = cookies();
  const defaultOpen =
    (await cookieStore).get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <FormProvider>
        <DashboardSidebar />
        <main className="flex w-full min-h-full p-2">
          <SidebarTrigger />
          {form ? <FormEditor form={form} /> : <div>Loading...</div>}
        </main>
      </FormProvider>
    </SidebarProvider>
  );
}
