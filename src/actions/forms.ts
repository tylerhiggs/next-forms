"use server";

import { db } from "../db";
import { form } from "../db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export const createForm = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const newForm = await db
    .insert(form)
    .values({
      title: "Untitled Form",
      userId: session.user.id,
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

  const userForm = await db.select().from(form).where(eq(form.id, formId));

  if (!userForm.length || userForm[0].userId !== session.user.id) {
    throw new Error("Form not found or access denied");
  }

  return userForm[0];
};
