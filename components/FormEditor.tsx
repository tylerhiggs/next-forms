"use client";

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
import type { FormWithFields } from "@/types/forms";
import { useFormState } from "@/hooks/use-form-state";
import { EditFormHeader } from "./edit-form-header";
import { EditSelectField } from "./edit-select-field";

export const FormEditor = ({ form }: { form: FormWithFields }) => {
  const { currentTitle, setCurrentTitle, currentPrivacy, setCurrentPrivacy } =
    useContext(formContext);
  const {
    formState,
    updateFormState,
    updateFormField,
    deleteField,
    addFormField,
    isSaved,
    saveNow,
  } = useFormState(form);

  useEffect(() => {
    if (!form?.title) return;
    setCurrentTitle(form.title);
  }, [form.title, setCurrentTitle]);

  useEffect(() => {
    setCurrentPrivacy(!form.isPublic);
  }, [form.isPublic, setCurrentPrivacy]);

  const updateFormTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setCurrentTitle(target.value);
    updateFormState({ title: target.value });
  };

  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        saveNow();
        console.log("Saving form...");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [saveNow]);

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
        { title: "Phone", type: "phone" },
        { title: "Number", type: "number" },
        { title: "Address", type: "address" },
        { title: "Checkbox", type: "checkbox" },
        { title: "Radio", type: "radio" },
        { title: "Select", type: "select" },
        { title: "Date", type: "date" },
      ],
    },
  ];

  if (!form) {
    return <div>Form not found</div>;
  }
  return (
    <div className="w-full flex flex-col min-h-full relative">
      <EditFormHeader
        isSaved={isSaved}
        isPrivate={!formState.isPublic}
        onPrivacyToggle={() => {
          updateFormState({ isPublic: !formState.isPublic });
          setCurrentPrivacy(!currentPrivacy);
        }}
        formId={form.id}
      />
      <div className="w-full grid grid-cols-2 gap-4 h-screen">
        <div className="flex flex-col pl-4 gap-4 w-full flex-1 min-h-0 max-h-full overflow-y-auto">
          <div className="flex items-center p-4">
            <h1 className="w-full">
              <input
                value={currentTitle || form.title}
                onChange={updateFormTitle}
                className="w-full text-4xl font-bold"
              />
            </h1>
          </div>
          {formState?.formFields?.map((field) => (
            <div key={field.id}>
              {(field.type.startsWith("text") ||
                field.type === "email" ||
                field.type === "textarea" ||
                field.type.startsWith("address") ||
                field.type === "phone") && (
                <EditTextField
                  field={field}
                  deleteField={() => deleteField(field.id)}
                  updateField={(updatedField) =>
                    updateFormField(field.id, updatedField)
                  }
                />
              )}
              {field.type === "number" && (
                <EditNumberField
                  field={field}
                  updateField={(updatedField) =>
                    updateFormField(field.id, updatedField)
                  }
                  deleteField={() => deleteField(field.id)}
                />
              )}
              {field.type === "select" && (
                <EditSelectField
                  field={field}
                  updateField={(updatedField) =>
                    updateFormField(field.id, updatedField)
                  }
                  deleteField={() => deleteField(field.id)}
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
                  Use <Kbd keyName="meta" /> <Kbd keyName="/" /> to open/close
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
                        addFormField({
                          id: Date.now(),
                          label: item.type
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" "),
                          type: item.type,
                          order: formState.formFields.length,
                          required: item.type === "email",
                          userId: formState.userId,
                          formId: formState.id,
                          options:
                            item.type === "select"
                              ? JSON.stringify({
                                  options: ["Option 1", "Option 2"],
                                })
                              : null,
                          selectMultiple: false,
                          placeholder: "",
                          defaultValue: "",
                          min: null,
                          max: null,
                        });
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
        <div className="w-full overflow-y-auto">
          <FormPreview form={formState} />
        </div>
      </div>
    </div>
  );
};
