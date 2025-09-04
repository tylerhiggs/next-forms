import { getFormById } from "@/src/actions/forms";
import { FormTextField } from "./form-text-field";
import { NumberField } from "./number-field";
import { FormTextArea } from "./form-text-area";
import { FormAddress } from "./form-address";
import { FormSelectField } from "./form-select-field";

export const FormPreview = ({
  form,
}: {
  form: Awaited<ReturnType<typeof getFormById>>;
}) => {
  if (!form) {
    return <div>Form not found</div>;
  }
  return (
    <div className="min-h-full flex flex-col border-l w-full p-4">
      <h2 className="text-2xl font-bold">Preview: {form.title}</h2>
      <form className="flex flex-col gap-2 w-full">
        {form.formFields.map((field) => (
          <div key={field.id}>
            {(field.type.startsWith("text-") ||
              field.type === "text" ||
              field.type === "email" ||
              field.type === "phone") && (
              <FormTextField key={field.id} field={field} />
            )}
            {field.type === "number" && (
              <NumberField key={field.id} field={field} />
            )}
            {field.type === "textarea" && (
              <FormTextArea key={field.id} field={field} />
            )}
            {field.type.startsWith("address") && (
              <FormAddress key={field.id} field={field} />
            )}
            {field.type === "select" && (
              <FormSelectField key={field.id} field={field} />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};
