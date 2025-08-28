"use client";

import { getFormById } from "@/src/actions/forms";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { formContext } from "@/app/providers/form-provider";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Kbd } from "./kbd";
import { fieldTypeEnum } from "@/src/db/schema";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { EditTextField } from "./edit-text-field";
import { FormPreview } from "./form-preview";
import { EditNumberField } from "./edit-number-field";
import type { FormFieldType } from "@/types/forms";

export const FormEditor = ({
  form,
}: {
  form: Awaited<ReturnType<typeof getFormById>>;
}) => {
  const { currentTitle, setCurrentTitle } = useContext(formContext);
  useEffect(() => {
    if (!form?.title) return;
    setCurrentTitle(form.title);
  }, [form?.title, setCurrentTitle]);
  const updateFormTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setCurrentTitle(target.value);
  };

  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const groups: {
    name: string;
    items: { title: string; type: (typeof fieldTypeEnum.enumValues)[number] }[];
  }[] = [
    {
      name: "Form Fields",
      items: [
        { title: "Text", type: "text" },
        { title: "Text Area", type: "textarea" },
        { title: "Email", type: "email" },
        { title: "Number", type: "number" },
        { title: "Checkbox", type: "checkbox" },
        { title: "Radio", type: "radio" },
        { title: "Select", type: "select" },
        { title: "Date", type: "date" },
      ],
    },
  ];

  const [formState, setFormState] = useState(form);
  const updateField = (
    updatedField: Partial<FormFieldType>,
    field: FormFieldType
  ) =>
    setFormState((prev) =>
      prev
        ? {
            ...prev,
            formFields: prev.formFields.map((f) =>
              f.id === field.id ? { ...f, ...updatedField } : f
            ),
          }
        : undefined
    );
  const deleteField = (field: FormFieldType) =>
    setFormState((prev) =>
      prev
        ? {
            ...prev,
            formFields: prev.formFields.filter((f) => f.id !== field.id),
          }
        : undefined
    );

  if (!form) {
    return <div>Form not found</div>;
  }
  return (
    <div className="w-full flex gap-4">
      <div className="flex flex-col pl-4 gap-4 w-1/2">
        <div className="flex items-center p-4">
          <h1 className="w-full">
            <input
              value={currentTitle}
              onChange={updateFormTitle}
              className="w-full text-4xl font-bold"
            />
          </h1>
        </div>
        {formState?.formFields?.map((field) => (
          <div key={field.id}>
            {field.type === "text" && (
              <EditTextField
                field={field}
                deleteField={() => deleteField(field)}
                updateField={(updatedField) => updateField(updatedField, field)}
              />
            )}
            {field.type === "number" && (
              <EditNumberField
                field={field}
                updateField={(updatedField) => updateField(updatedField, field)}
                deleteField={() => deleteField(field)}
              />
            )}
          </div>
        ))}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCommandOpen((open) => !open)}
              >
                Add Field
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <span>
                Use <Kbd keyName="meta" /> <Kbd keyName="E" /> to open/close
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.name} heading={group.name}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.type}
                    onSelect={() => {
                      setCommandOpen(false);
                      setFormState((prev) =>
                        prev
                          ? {
                              ...prev,
                              formFields: [
                                ...prev.formFields,
                                {
                                  id: Date.now(),
                                  label: "",
                                  type: item.type,
                                  order: prev.formFields.length,
                                  required: false,
                                  userId: prev.userId,
                                  formId: prev.id,
                                  options: null,
                                  placeholder: "",
                                  defaultValue: "",
                                  min: null,
                                  max: null,
                                },
                              ],
                            }
                          : undefined
                      );
                    }}
                  >
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </CommandDialog>
      </div>
      <FormPreview form={formState} />
    </div>
  );
};
