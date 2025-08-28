"use client";

import { useState } from "react";
import { Input } from "./input";
export const NumberInput = ({
  value,
  update,
  ...props
}: React.ComponentProps<"input"> & {
  value?: number;
  update?: (value?: number) => void;
}) => {
  const [localValue, setLocalValue] = useState(`${value}`);
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    const num = Number(e.target.value);
    if (isNaN(num)) {
      setErrorMessage("Please enter a valid number");
      return;
    }
    setErrorMessage("");
    update?.(e.target.value === "" ? undefined : num);
  };
  return (
    <div className="flex flex-col gap-2">
      <Input
        value={localValue}
        type="number"
        onFocus={() => setTouched(true)}
        onChange={change}
        aria-invalid={!!errorMessage || props["aria-invalid"]}
        {...props}
      />
      {touched && errorMessage && (
        <em className="text-destructive italic">{errorMessage}</em>
      )}
    </div>
  );
};
