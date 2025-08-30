import { FormType, type FormWithFields } from "@/types/forms";
import { useRef, useState } from "react";
import { formField } from "../src/db/schema";
import {
  createFormField,
  deleteField,
  updateFormFields,
} from "@/src/actions/form-fields";
import { toast } from "sonner";
import { updateForm } from "@/src/actions/forms";

export const useFormState = (originalForm: FormWithFields, debounce = 2000) => {
  const [formState, setFormState] = useState(originalForm);
  const [formUpdates, setFormUpdates] = useState<Partial<FormType> | null>(
    null
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateFormState = (updates: Partial<FormWithFields>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
    setFormUpdates((prev) => ({ ...prev, ...updates }));
    scheduleUpdate();
  };

  const [fieldUpdates, setFieldUpdates] = useState<
    (Partial<Omit<typeof formField.$inferInsert, "formId" | "userId">> & {
      id: number;
    })[]
  >([]);
  const fieldUpdatesRef = useRef(fieldUpdates);
  const formUpdatesRef = useRef(formUpdates);

  // Keep refs in sync with state
  fieldUpdatesRef.current = fieldUpdates;
  formUpdatesRef.current = formUpdates;

  /**
   * When creating a new form field, we create a temporary ID
   * and the server eventually returns a DB generated ID.
   *
   * When the DB returns the new ID, we can't just replace it in
   * `formState` since there may be debounced changes waiting to
   * be applied to the form item with the old ID.
   *
   * So we have 3 states:
   *
   * * ID not in `idMapping`: local id (in `formState`) is synced with DB ID
   * * `idMapping[ID] === -1`: DB ID has not yet been received.
   * * Else: DB ID has been received and is different from local ID.
   */
  const idMappingRef = useRef<Map<number, number>>(new Map());

  const addFormField = async ({
    id,
    ...field
  }: typeof formField.$inferSelect) => {
    idMappingRef.current.set(id, -1);
    setFormState((prev) => ({
      ...prev,
      formFields: [...prev.formFields, { ...field, id }],
    }));
    const dbGeneratedId = (await createFormField(originalForm.id, field)).id;
    idMappingRef.current.set(id, dbGeneratedId);
  };

  const removeFieldById = async (id: number) => {
    setFieldUpdates((prev) => prev.filter((update) => update.id !== id));
    setFormState((prev) => ({
      ...prev,
      formFields: prev.formFields.filter((field) => field.id !== id),
    }));
    const dbId = idMappingRef.current.get(id) ?? id;
    if (dbId === -1) {
      // retry: field not yet fully created in DB
      setTimeout(() => removeFieldById(id), debounce);
      return;
    }
    await deleteField(dbId);
  };

  const updateFormField = (
    id: number,
    updates: Partial<typeof formField.$inferInsert>
  ) => {
    if (fieldUpdates.filter((update) => update.id === id).length) {
      setFieldUpdates((prev) =>
        prev.map((update) =>
          update.id === id ? { ...update, ...updates } : update
        )
      );
    } else {
      setFieldUpdates((prev) => [...prev, { id, ...updates }]);
    }
    setFormState((prev) => ({
      ...prev,
      formFields: prev.formFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
    scheduleUpdate();
  };

  const executeUpdates = async () => {
    try {
      const currentFieldUpdates = fieldUpdatesRef.current;
      const currentFormUpdates = formUpdatesRef.current;

      const fieldUpdatesToApply = currentFieldUpdates
        .filter((update) => idMappingRef.current.get(update.id) !== -1)
        .map((update) => ({
          ...update,
          id: idMappingRef.current.get(update.id) ?? update.id,
        }));
      console.log("Applying field updates:", fieldUpdatesToApply);
      console.log("Current form updates:", currentFormUpdates);
      await Promise.all([
        fieldUpdatesToApply.length
          ? updateFormFields(fieldUpdatesToApply)
          : Promise.resolve(),
        currentFormUpdates
          ? updateForm(originalForm.id, currentFormUpdates)
          : Promise.resolve(),
      ]);
      if (currentFieldUpdates.length !== fieldUpdatesToApply.length) {
        toast.success("Some changes saved, others pending...");
        // try again after `debounce` ms if another update doesn't come in
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          executeUpdates();
        }, debounce);
      }
      setFieldUpdates((prev) =>
        prev.filter((update) => idMappingRef.current.get(update.id) === -1)
      );
      setFormUpdates(null);
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to save changes");
    }
  };

  const scheduleUpdate = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      executeUpdates();
    }, debounce);
  };

  return {
    formState,
    addFormField,
    updateFormField,
    updateFormState,
    deleteField: removeFieldById,
    saveNow: executeUpdates,
    isSaved: fieldUpdates.length === 0 && formUpdates === null,
  };
};
