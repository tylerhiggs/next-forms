"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { ChevronsUpDownIcon } from "lucide-react";
import Image from "next/image";

export const ProfileSidebarHeader = () => {
  const session = useSession();
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="flex items-center h-auto justify-between">
            <div className="flex items-center gap-3">
              {session.data?.user?.image ? (
                <Image
                  src={session.data?.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full p-1"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {session.data?.user?.name?.charAt(0) || "P"}
                  </span>
                </div>
              )}
              {session.data?.user?.name || "Profile"}
            </div>
            <div className="flex items-center gap-1">
              <ChevronsUpDownIcon className=" h-4 w-4 text-muted-foreground" />
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          className="w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuItem onClick={() => signOut()}>
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
