import { getFormById } from "@/src/actions/forms";
import { FormTextField } from "./form-text-field";
import { NumberField } from "./number-field";
import { FormTextArea } from "./form-text-area";
import { FormAddress } from "./form-address";

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
      <h2 className="text-2xl font-bold">Form Preview</h2>
      <form className="flex flex-col gap-2 w-full">
        {form.formFields.map((field) => (
          <div key={field.id}>
            {(field.type === "text" || field.type === "email") && (
              <FormTextField key={field.id} field={field} />
            )}
            {field.type === "number" && (
              <NumberField key={field.id} field={field} />
            )}
            {field.type === "textarea" && (
              <FormTextArea key={field.id} field={field} />
            )}
            {field.type === "address" && (
              <FormAddress key={field.id} field={field} />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};
