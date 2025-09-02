"use client";
import type { FormFieldType } from "@/types/forms";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export const EditTextField = ({
  field,
  updateField,
  deleteField,
}: {
  field: FormFieldType;
  updateField: (field: Partial<FormFieldType>) => void;
  deleteField?: () => void;
}) => {
  return (
    <div className="border rounded-lg p-4 grid grid-cols-1 gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {field.type === "email" && "Email Field"}
          {field.type === "text" && "Text Field"}
          {field.type === "text-name" && "Name Field"}
          {field.type === "text-firstname" && "First Name Field"}
          {field.type === "text-middlename" && "Middle Name Field"}
          {field.type === "text-lastname" && "Last Name Field"}
          {field.type === "textarea" && "Text Area Field"}
          {field.type.startsWith("address") && "Address Field"}
          {field.type === "phone" && "Phone Field"}
        </h3>
        <div className="flex items-center gap-2">
          {field.type.startsWith("address") && (
            <Select
              value={field.type}
              onValueChange={(value) =>
                updateField({ type: value as typeof field.type })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="address">Home</SelectItem>
                <SelectItem value="address-shipping">Shipping</SelectItem>
                <SelectItem value="address-billing">Billing</SelectItem>
              </SelectContent>
            </Select>
          )}
          {(field.type.startsWith("text-") || field.type === "text") && (
            <Select
              value={field.type}
              onValueChange={(value) =>
                updateField({ type: value as typeof field.type })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Generic Text</SelectItem>
                <SelectItem value="text-name">Name</SelectItem>
                <SelectItem value="text-firstname">First Name</SelectItem>
                <SelectItem value="text-middlename">Middle Name</SelectItem>
                <SelectItem value="text-lastname">Last Name</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Toggle
            pressed={field.required || false}
            onPressedChange={(pressed) => updateField({ required: pressed })}
            aria-label="Toggle required"
            variant="outline"
            color="destructive"
          >
            <div className="flex px-2">
              {field.required ? "Required" : "Optional"}
            </div>
          </Toggle>
          <Button variant="outline" onClick={deleteField}>
            <Trash />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor={`question-${field.id}`}>Question</Label>

        <Input
          id={`question-${field.id}`}
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
          placeholder="Question or label for text input"
          className="w-full"
        />
      </div>
      {!field.type.startsWith("address") && (
        <div className="flex gap-1">
          {field.type !== "phone" && (
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor={`default-value-${field.id}`}>Default Value</Label>

              <Input
                id={`default-value-${field.id}`}
                value={field.defaultValue || ""}
                onChange={(e) => updateField({ defaultValue: e.target.value })}
                placeholder="Default value for text input"
                className="w-full"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>

            <Input
              id={`placeholder-${field.id}`}
              value={field.placeholder || ""}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Placeholder for text input"
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
