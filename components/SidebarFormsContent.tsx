"use client";

import { createForm, getUserForms } from "@/src/actions/forms";
import { useContext, useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { formContext } from "@/app/providers/form-provider";

export const SidebarFormsContent = ({
  forms: originalForms,
}: {
  forms: Awaited<ReturnType<typeof getUserForms>>;
}) => {
  const path = usePathname();
  const { currentTitle } = useContext(formContext);
  const id = Number(path.split("/").pop());
  const router = useRouter();
  const [forms, setForms] = useState(originalForms);
  const [publicForms, privateForms] = forms.reduce(
    (acc, form) => {
      if (form.isPublic) {
        acc[0].push(form);
      } else {
        acc[1].push(form);
      }
      return acc;
    },
    [[], []] as [typeof forms, typeof forms]
  );
  useEffect(() => {
    console.log(currentTitle, "<SidebarFormsContent />");
  }, [currentTitle]);
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  const tempId = Date.now(); // Temporary ID for optimistic UI
                  const tempForm: (typeof forms)[0] = {
                    id: tempId,
                    title: "Untitled Form",
                    description: "",
                    userId: "", // Will be filled in by the server
                    isPublic: false,
                    createdAt: new Date(),
                  };
                  setForms((prev) => [...prev, tempForm]);
                  createForm().then((newForm) => {
                    setForms((prev) =>
                      prev.map((form) => (form.id === tempId ? newForm : form))
                    );
                    router.push(`/dashboard/${newForm.id}`);
                  });
                }}
                className="flex items-center justify-between"
              >
                Add New Form <Plus />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {publicForms.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Public</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add public form</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicForms.map((form) => (
                <SidebarMenuItem key={form.id}>
                  <Link href={`/dashboard/${form.id}`}>
                    <SidebarMenuButton isActive={form.id === id}>
                      {form.id === id && currentTitle
                        ? currentTitle
                        : form.title}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
      {privateForms.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Private</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add private form</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {privateForms.map((form) => (
                <SidebarMenuItem key={form.id}>
                  <Link href={`/dashboard/${form.id}`}>
                    <SidebarMenuButton isActive={form.id === id}>
                      {form.id === id && currentTitle
                        ? currentTitle
                        : form.title}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
};
