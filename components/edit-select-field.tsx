"use client";
import type { FieldOptions, FormFieldType } from "@/types/forms";
import { Toggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export const EditSelectField = ({
  field,
  updateField,
  deleteField,
}: {
  field: FormFieldType;
  updateField: (field: Partial<FormFieldType>) => void;
  deleteField?: () => void;
}) => {
  const options = field.options
    ? (JSON.parse(field.options) as FieldOptions)
    : { options: [] };
  return (
    <div className="border rounded-lg p-4 grid grid-cols-1 gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select Field</h3>
        <div className="flex items-center gap-2">
          <Select
            key={field.defaultValue ?? "nothing"}
            value={field.defaultValue || undefined}
            onValueChange={(value: string | undefined) =>
              updateField({ defaultValue: value ? value : null })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.options.map((option, index) => (
                <SelectItem
                  key={`select-default-${field.id}-${index}`}
                  value={option}
                >
                  {option}
                </SelectItem>
              ))}
              {!field.required && (
                <SelectItem value={undefined as unknown as string}>
                  Default None
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Toggle
            pressed={field.selectMultiple || false}
            onPressedChange={(pressed) =>
              updateField({
                selectMultiple: pressed,
                defaultValue:
                  pressed && !field.defaultValue
                    ? options.options.at(0) || undefined
                    : field.defaultValue,
              })
            }
            aria-label="Toggle multiselect"
            variant="outline"
          >
            <div className="flex px-2">
              {field.selectMultiple ? "Multi Select" : "Single Select"}
            </div>
          </Toggle>
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
      <div className="flex gap-2 flex-wrap">
        {options.options.map((option, index) => (
          <div
            key={`select-${field.id}-${index}`}
            className="flex pl-2 items-center rounded-lg border border-accent gap-2"
          >
            <label className="sr-only" htmlFor={`option-${field.id}-${index}`}>
              Option {index + 1}
            </label>
            <input
              id={`option-${field.id}-${index}`}
              value={option}
              onChange={(e) =>
                updateField({
                  options: JSON.stringify({
                    options: options.options.map((o, i) =>
                      i === index ? e.target.value : o
                    ),
                  }),
                })
              }
              placeholder={`Option ${index + 1}`}
              className="field-sizing-content font-semibold"
            />
            <Button
              variant="ghost"
              onClick={() =>
                updateField({
                  options: JSON.stringify({
                    options: options.options.filter((_, i) => i !== index),
                  }),
                })
              }
            >
              <Trash />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            updateField({
              options: JSON.stringify({
                options: [
                  ...options.options,
                  `Option ${options.options.length + 1}`,
                ],
              }),
            })
          }
        >
          Add Option
          <Plus className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
