"use server";

import db from "@/db";
import { assertRole } from "./assert-role";
import { userRoles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function deleteRole(userId: string, role: string) {
  await assertRole("owner");

  await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)));
}
