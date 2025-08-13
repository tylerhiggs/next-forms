import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getRequiredServerSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
