import { form, formField } from "@/src/db/schema";
export type FormFieldType = typeof formField.$inferSelect;
export type FormType = typeof form.$inferSelect;
export type FormWithFields = FormType & { formFields: FormFieldType[] };
