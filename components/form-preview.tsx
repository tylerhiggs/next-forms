import { getFormById } from "@/src/actions/forms";
import { FormTextField } from "./form-text-field";
import { NumberField } from "./number-field";

export const FormPreview = ({
  form,
}: {
  form: Awaited<ReturnType<typeof getFormById>>;
}) => {
  if (!form) {
    return <div>Form not found</div>;
  }
  return (
    <div className="min-h-full border-l p-4">
      <h2 className="text-2xl font-bold">Form Preview</h2>
      <div className="flex flex-col gap-4">
        {form.formFields.map((field) => (
          <div key={field.id}>
            {field.type === "text" && (
              <FormTextField key={field.id} field={field} />
            )}
            {field.type === "number" && (
              <NumberField key={field.id} field={field} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
