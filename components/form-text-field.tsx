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
    if (
      field.type === "email" &&
      e.target.value !== "" &&
      !/\S+@\S+\.\S+/.test(e.target.value)
    ) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setErrorMessage("");
    onChange?.(e.target.value);
  };
  const type = () => {
    if (field.type === "email") {
      return "email";
    }
    if (field.type === "phone") {
      return "tel";
    }
    return "text";
  };
  const autoComplete = () => {
    if (field.type === "email") {
      return "email";
    }
    if (field.type === "phone") {
      return "tel";
    }
    if (field.type === "text-firstname") {
      return "given-name";
    }
    if (field.type === "text-lastname") {
      return "family-name";
    }
    if (field.type === "text-middlename") {
      return "additional-name";
    }
    if (field.type === "text-name") {
      return "name";
    }
    return "off";
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <Label htmlFor={`${field.id}`}>{field.label}</Label>
      <Input
        id={`${field.id}`}
        value={value}
        type={type()}
        autoComplete={autoComplete()}
        name={type()}
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
