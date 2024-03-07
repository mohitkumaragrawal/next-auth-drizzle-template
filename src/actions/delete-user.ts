"use server";

import { assertRole } from "./assert-role";

import db from "@/db";
import { users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function deleteUser(userId: string): Promise<void> {
  await assertRole("owner");
  await db.delete(users).where(eq(users.id, userId));
}

export async function deleteUsers(usersIds: string[]): Promise<void> {
  await assertRole("owner");
  await db.delete(users).where(inArray(users.id, usersIds));
}
