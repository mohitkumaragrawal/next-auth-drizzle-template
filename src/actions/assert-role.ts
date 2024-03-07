"use server";

import { auth } from "@/auth/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function assertRole(role: string = ""): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((res) => res[0]);

  if (!dbUser) {
    throw new Error("User not found");
  }

  if (!role || role === "") return;
  const roles = [...session.user.role];
  if (roles.includes("owner")) return;

  if (dbUser.banned) {
    throw new Error("User is banned");
  }

  if (!roles.includes(role)) {
    throw new Error("Role not allowed");
  }
}
