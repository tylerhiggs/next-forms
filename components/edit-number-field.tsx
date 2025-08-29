import type { FormFieldType } from "@/types/forms";
import { Toggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { NumberInput } from "./ui/number-input";
export const EditNumberField = ({
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
        <h3 className="text-lg font-medium">Number Field</h3>
        <div className="flex items-center gap-2">
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
      <div className="flex gap-1">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`default-value-${field.id}`}>Default Value</Label>

          <NumberInput
            id={`default-value-${field.id}`}
            value={field.defaultValue ? Number(field.defaultValue) : undefined}
            update={(value) =>
              updateField({
                defaultValue: value !== undefined ? `${value}` : undefined,
              })
            }
            placeholder="Default value for number input"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>

          <Input
            id={`placeholder-${field.id}`}
            value={field.placeholder || ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Placeholder for number input"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`min-${field.id}`}>Minimum</Label>
          <NumberInput
            placeholder="Enter a number for minimum, or leave blank"
            value={field.min === null ? undefined : field.min}
            update={(value) =>
              updateField({ min: value === undefined ? null : value })
            }
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`max-${field.id}`}>Maximum</Label>
          <NumberInput
            placeholder="Enter a number for maximum, or leave blank"
            value={field.max === null ? undefined : field.max}
            update={(value) =>
              updateField({ max: value === undefined ? null : value })
            }
          />
        </div>
      </div>
    </div>
  );
};
