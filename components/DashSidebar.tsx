import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ProfileSidebarHeader } from "./ProfileSidebarHeader";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <ProfileSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
