"use server";

import db from "@/db";
import { userRoles, users } from "@/db/schema";
import { desc, eq, like } from "drizzle-orm";

import { User, UserWithRoles } from "@/db/types";

export async function fetchUsers(): Promise<UserWithRoles[]> {
  const limited_users = db
    .$with("limited_users")
    .as(db.select().from(users).orderBy(desc(users.createdAt)));

  return await db
    .with(limited_users)
    .select()
    .from(limited_users)
    .leftJoin(userRoles, eq(limited_users.id, userRoles.userId))
    .then((rows) => {
      let result: UserWithRoles[] = [];
      let roles: { [id: string]: string[] } = {};
      rows.forEach((row) => {
        roles[row.limited_users.id] = roles[row.limited_users.id] || [];
        if (row.userRole) roles[row.limited_users.id].push(row.userRole.role);
      });
      rows.forEach((row) => {
        if (!result.find((u) => u.id === row.limited_users.id)) {
          result.push({
            ...row.limited_users,
            roles: roles[row.limited_users.id] || [],
          });
        }
      });
      return result;
    });
}
