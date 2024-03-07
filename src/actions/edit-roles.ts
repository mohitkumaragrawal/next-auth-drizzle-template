"use server";

import db from "@/db";
import { assertRole } from "./assert-role";
import { userRoles } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function editRoles(userId: string, newRoles: string[]) {
  await assertRole("owner");
  await db.delete(userRoles).where(eq(userRoles.userId, userId));
  await db.insert(userRoles).values(newRoles.map((role) => ({ role, userId })));
}
