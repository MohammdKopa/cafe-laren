import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type DB = PostgresJsDatabase<typeof schema>;

let _db: DB | null = null;

function getDb(): DB {
  if (_db) return _db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local or your deployment env.",
    );
  }
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");
  const client = postgres(connectionString, {
    ssl: isLocal ? false : "require",
    max: 10,
  });
  _db = drizzle(client, { schema });
  return _db;
}

export const db = new Proxy({} as DB, {
  get(_t, prop) {
    return Reflect.get(getDb(), prop);
  },
}) as DB;

export { schema };
