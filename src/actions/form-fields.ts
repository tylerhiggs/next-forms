"use server";

import { db } from "../db";
import { formField } from "../db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

export const createFormField = async (
  formId: number,
  field: typeof formField.$inferInsert
) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const newFormField = await db
    .insert(formField)
    .values({
      ...field,
      formId,
      userId: session.user.id,
    })
    .returning();

  return newFormField[0];
};

export const getFormFields = async (formId: number) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const formFields = await db
    .select()
    .from(formField)
    .where(
      and(eq(formField.formId, formId), eq(formField.userId, session.user.id))
    );

  return formFields;
};

export const updateFormField = async (
  fieldId: number,
  updates: Partial<Omit<typeof formField.$inferInsert, "formId" | "userId">>
) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const updatedField = await db
    .update(formField)
    .set(updates)
    .where(
      and(eq(formField.id, fieldId), eq(formField.userId, session.user.id))
    )
    .returning();

  return updatedField[0];
};

export const updateFormFields = async (
  fields: (Partial<Omit<typeof formField.$inferInsert, "formId" | "userId">> & {
    id: number;
  })[]
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const updatedFields = await db.transaction(async (tx) => {
    const results = [];
    for (const field of fields) {
      const updatedField = await tx
        .update(formField)
        .set(field)
        .where(
          and(eq(formField.id, field.id), eq(formField.userId, session.user.id))
        )
        .returning();
      if (updatedField[0]) {
        results.push(updatedField[0]);
      }
    }
    return results;
  });

  return updatedFields;
};

export const deleteField = async (fieldId: number) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const deletedField = await db
    .delete(formField)
    .where(
      and(eq(formField.id, fieldId), eq(formField.userId, session.user.id))
    )
    .returning();

  return deletedField[0];
};
