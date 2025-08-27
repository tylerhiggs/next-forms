"use client";

import { getFormById } from "@/src/actions/forms";
import { Input } from "./ui/input";
import { ChangeEvent, useContext, useEffect } from "react";
import { formContext } from "@/app/providers/form-provider";

export const FormEditor = ({
  form,
}: {
  form: Awaited<ReturnType<typeof getFormById>>;
}) => {
  const { currentTitle, setCurrentTitle } = useContext(formContext);
  useEffect(() => {
    setCurrentTitle(form.title);
  }, [form.title, setCurrentTitle]);
  const updateFormTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setCurrentTitle(target.value);
  };

  if (!form) {
    return <div>Form not found</div>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">
        <Input
          value={currentTitle}
          onChange={updateFormTitle}
          className="w-96"
        />
      </h1>
    </div>
  );
};
