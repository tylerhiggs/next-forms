"use client";

import type { FormFieldType } from "@/types/forms";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";

export const FormTextField = ({
  field,
  onChange,
}: {
  field: FormFieldType;
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState(field.defaultValue || "");
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (field.required && !e.target.value) {
      setErrorMessage("This field is required");
      return;
    }
    setErrorMessage("");
    onChange?.(e.target.value);
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <Label htmlFor={`${field.id}`}>{field.label}</Label>
      <Input
        id={`${field.id}`}
        value={value}
        onFocus={() => setTouched(true)}
        onChange={change}
        placeholder={field.placeholder || ""}
        aria-invalid={!!errorMessage}
      />
      {touched && errorMessage && (
        <em className="text-destructive italic">{errorMessage}</em>
      )}
    </div>
  );
};
