import { InferSelectModel } from "drizzle-orm";
import { users, sessions, userRoles } from "./schema";

export type RoleTypes = string;
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type UserRole = InferSelectModel<typeof userRoles>;
export type UserWithRoles = User & { roles: string[] };
