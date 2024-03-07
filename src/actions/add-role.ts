"user server";

import db from "@/db";
import { assertRole } from "./assert-role";
import { userRoles } from "@/db/schema";

export default async function addRole(userId: string, role: string) {
  await assertRole("owner");

  await db.insert(userRoles).values({
    role,
    userId,
  });
}
