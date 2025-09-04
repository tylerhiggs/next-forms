"use client";

import type { FieldOptions, FormFieldType } from "@/types/forms";
import { Label } from "./ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
const NONE_OPTION = "None";

export const FormSelectField = ({
  field,
  onChange,
}: {
  field: FormFieldType;
  onChange?: (value: string | null) => void;
}) => {
  const options = field.options
    ? (JSON.parse(field.options) as FieldOptions)
    : { options: [] };
  if (!field.required) {
    options.options.push(NONE_OPTION);
  }
  const [value, setValue] = useState(
    field.defaultValue || !field.required
      ? field.defaultValue
      : options.options.length
      ? options.options.at(0) || null
      : null
  );
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const change = (newValue: string) => {
    setValue(newValue === NONE_OPTION ? null : newValue);
    if (field.required && !newValue) {
      setErrorMessage("This field is required");
      return;
    }
    setErrorMessage("");
    onChange?.(newValue || null);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <Label htmlFor={`${field.id}`}>{field.label}</Label>
      <Select
        value={value || NONE_OPTION}
        onValueChange={change}
        aria-invalid={!!errorMessage}
        required={field.required || false}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent id={`${field.id}`} onFocus={() => setTouched(true)}>
          {options.options.map((option, index) => (
            <SelectItem
              key={`form-select-preview-${field.id}-${index}`}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {touched && errorMessage && (
        <em className="text-destructive italic">{errorMessage}</em>
      )}
    </div>
  );
};
