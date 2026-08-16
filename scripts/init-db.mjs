import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  const defaultDbPath = path.join(__dirname, "..", "data", "simple_church.db");
  const dbPath = process.env.SQLITE_PATH ?? defaultDbPath;

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  try {
    db.exec(schema);
    console.log("Database initialized successfully.");
    console.log(`SQLite file: ${dbPath}`);
    console.log("Table: members");
  } finally {
    db.close();
  }
}

try {
  main();
} catch (error) {
  console.error(
    "Failed to initialize database:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}
