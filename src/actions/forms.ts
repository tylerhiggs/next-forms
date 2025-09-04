"use server";

import { db } from "../db";
import { form } from "../db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";

export const createForm = async (isPublic = false) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const newForm = await db
    .insert(form)
    .values({
      title: "Untitled Form",
      userId: session.user.id,
      isPublic,
    })
    .returning();

  return newForm[0];
};

export const getUserForms = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userForms = await db
    .select()
    .from(form)
    .where(eq(form.userId, session.user.id));

  return userForms;
};

export const getFormById = async (formId: number) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  const userForm = await db.query.form.findFirst({
    where: and(eq(form.id, formId), eq(form.userId, session.user.id)),
    with: {
      formFields: {
        orderBy: (field) => asc(field.order),
      },
    },
  });

  return userForm;
};

export const getPublicFormById = async (formId: number) => {
  const publicForm = await db.query.form.findFirst({
    where: and(eq(form.id, formId), eq(form.isPublic, true)),
    with: {
      formFields: {
        orderBy: (field) => asc(field.order),
      },
    },
  });

  return publicForm;
};

export const updateForm = async (
  formId: number,
  updates: Partial<Omit<typeof form.$inferInsert, "userId" | "createdAt">>
) => {
  console.log("updates", updates);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const updatedForm = await db
    .update(form)
    .set(updates)
    .where(and(eq(form.id, formId), eq(form.userId, session.user.id)))
    .returning();

  return updatedForm[0];
};
