import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

type PostgresDrizzleClient = PostgresJsDatabase<Record<string, never>>;

const globalForDrizzle = globalThis as unknown as {
  drizzle: PostgresDrizzleClient | undefined;
};

const db =
  globalForDrizzle.drizzle ??
  drizzle(postgres(process.env.DATABASE_URL!), { logger: false });

export default db;
if (process.env.NODE_ENV !== "production") globalForDrizzle.drizzle = db;
