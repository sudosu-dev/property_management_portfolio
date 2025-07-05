import pool from "#db/client";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSchema() {
  try {
    const schemaPath = join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("Running database schema...");
    await pool.query(schema);
    console.log("Schema executed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error running schema:", error);
    process.exit(1);
  }
}

runSchema();
