"use client";

import type { FormFieldType } from "@/types/forms";
import { Label } from "./ui/label";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

export const FormTextArea = ({
  field,
  onChange,
}: {
  field: FormFieldType;
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState(field.defaultValue || "");
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <Textarea
        id={`${field.id}`}
        value={value}
        onFocus={() => setTouched(true)}
        onChange={change}
        placeholder={field.placeholder || ""}
        aria-invalid={!!errorMessage}
        className="resize-none field-sizing-content overflow-visible"
        style={
          { resize: "none", fieldSizing: "content" } as React.CSSProperties
        }
      />
      {touched && errorMessage && (
        <em className="text-destructive italic">{errorMessage}</em>
      )}
    </div>
  );
};
