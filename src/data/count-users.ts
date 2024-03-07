"use server";

import db from "@/db";
import { users } from "@/db/schema";
import { countDistinct } from "drizzle-orm";

export async function countUsers() {
  return await db
    .select({ result: countDistinct(users.id) })
    .from(users)
    .then((row) => row[0].result);
}
