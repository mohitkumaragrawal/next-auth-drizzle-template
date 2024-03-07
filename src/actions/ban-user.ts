"use server";

import { assertRole } from "./assert-role";

import db from "@/db";
import { users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function banUser(userId: string): Promise<void> {
  await assertRole("owner");

  await db
    .update(users)
    .set({
      banned: true,
    })
    .where(eq(users.id, userId));
}

export async function banUsers(usersIds: string[]): Promise<void> {
  await assertRole("owner");

  await db
    .update(users)
    .set({
      banned: true,
    })
    .where(inArray(users.id, usersIds));
}

export async function unbanUser(userId: string): Promise<void> {
  await assertRole("owner");

  await db
    .update(users)
    .set({
      banned: false,
    })
    .where(eq(users.id, userId));
}

export async function unbanUsers(usersIds: string[]): Promise<void> {
  await assertRole("owner");

  await db
    .update(users)
    .set({
      banned: false,
    })
    .where(inArray(users.id, usersIds));
}
