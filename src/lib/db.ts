import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const defaultDbPath = path.join(process.cwd(), "data", "simple_church.db");

function resolveDbPath() {
  const configured = process.env.SQLITE_PATH;
  if (!configured) {
    return defaultDbPath;
  }

  return path.isAbsolute(configured)
    ? configured
    : path.join(process.cwd(), configured);
}

const dbPath = resolveDbPath();

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const globalForDb = globalThis as unknown as {
  sqliteDb?: Database.Database;
};

function createDb() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

const db = globalForDb.sqliteDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqliteDb = db;
}

export default db;
