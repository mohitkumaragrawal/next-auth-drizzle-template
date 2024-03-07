import NextAuth from "next-auth";
import GitHubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db";
import { sessions, users, userRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User, UserRole, RoleTypes } from "@/db/types";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session {
    user: User & { role: RoleTypes[]; username: string };
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends User {
    roles: UserRole[];
  }
}

if (!process.env.GITHUB_ID) {
  throw new Error("No GITHUB_ID has been provided.");
}

if (!process.env.GITHUB_SECRET) {
  throw new Error("No GITHUB_SECRET has been provided.");
}

function generateRandomId(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: {
    ...DrizzleAdapter(db),
    async createUser(data) {
      return await db
        .insert(users)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .then((res) => ({ ...res[0], roles: [] }) ?? null);
    },
    // Override getSessionAndUser method to include roles. Avoids a second db query in session callback
    getSessionAndUser: async (sessionToken) => {
      const data = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .innerJoin(users, eq(sessions.userId, users.id))
        .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .then((user) => {
          if (user.length === 0) return null;
          return {
            session: user[0].session,
            user: {
              ...user[0].user,
              roles: user.filter((u) => u.userRole).map((u) => u.userRole),
            },
          };
        });
      return data;
    },
  },
  callbacks: {
    session: async (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable, we're not using JWT");

      const { session, user } = opts;
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.roles.map((r) => r.role),
        },
      };
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile: (p) => {
        const username =
          p.login.replace(/\s/g, "-").toLowerCase() +
          "-" +
          generateRandomId(2) +
          Number(Date.now()).toString(36);
        return {
          id: p.id.toString(),
          name: p.name,
          username: username,
          email: p.email,
          image: p.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile: (p) => {
        // should be unique?
        const username =
          p.given_name.replace(/\s/g, "-").toLowerCase() +
          "-" +
          generateRandomId(2) +
          Number(Date.now()).toString(36);

        return {
          id: p.id,
          name: p.name,
          email: p.email,
          image: p.picture,
          username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
});
