import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ProfileSidebarHeader } from "./ProfileSidebarHeader";
import { getUserForms } from "@/src/actions/forms";
import { SidebarFormsContent } from "./SidebarFormsContent";

export async function DashboardSidebar() {
  const forms = await getUserForms();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <ProfileSidebarHeader />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarFormsContent forms={forms} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
