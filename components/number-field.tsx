"use client";

import type { FormFieldType } from "@/types/forms";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
export const NumberField = ({
  field,
  onChange,
}: {
  field: FormFieldType;
  onChange?: (value: number) => void;
}) => {
  const [value, setValue] = useState(field.defaultValue || "");
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Number field value changed:", e.target.value);
    setValue(e.target.value);
    if (field.required && !e.target.value) {
      setErrorMessage("This field is required");
      return;
    }
    const num = Number(e.target.value);
    console.log("Number field value changed:", num);
    if (isNaN(num)) {
      setErrorMessage("Please enter a valid number");
      return;
    }
    setErrorMessage("");
    onChange?.(num);
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <Label htmlFor={`${field.id}`}>{field.label}</Label>
      <Input
        id={`${field.id}`}
        value={value}
        type="text"
        inputMode="decimal"
        onFocus={() => setTouched(true)}
        onInput={change}
        placeholder={field.placeholder || ""}
        aria-invalid={
          !!errorMessage || (field.required && touched && value === "")
        }
        required={field.required || false}
        min={field.min === null ? undefined : field.min}
        max={field.max === null ? undefined : field.max}
      />
      {touched && errorMessage && (
        <em className="text-destructive italic">{errorMessage}</em>
      )}
    </div>
  );
};
